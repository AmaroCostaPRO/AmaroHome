import { NextResponse, type NextRequest } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@/lib/supabase/server'
import type { AIMessage } from '@/types/database'

const perplexity = new OpenAI({
  apiKey: process.env.PERPLEXITY_API_KEY,
  baseURL: 'https://api.perplexity.ai',
})

/**
 * POST /api/ai/chat
 * Chat streaming com Perplexity (modelo sonar).
 * O texto aparece "digitando" no frontend via ReadableStream.
 *
 * Body: { messages: AIMessage[], conversationId?: string }
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const { messages, conversationId } = (await request.json()) as {
      messages: AIMessage[]
      conversationId?: string
    }

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: 'Mensagens não fornecidas' }, { status: 400 })
    }

    /* Converter formato AIMessage → formato OpenAI/Perplexity */
    const openaiMessages: OpenAI.ChatCompletionMessageParam[] = messages.map((msg) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    }))

    /* Streaming response do Perplexity */
    const completion = await perplexity.chat.completions.create({
      model: 'sonar',
      messages: openaiMessages,
      stream: true,
    })

    let fullResponse = ''
    const encoder = new TextEncoder()

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of completion) {
            const text = chunk.choices[0]?.delta?.content ?? ''
            if (text) {
              fullResponse += text
              controller.enqueue(encoder.encode(text))
            }
          }
          controller.close()

          /* Salvar conversa no Supabase após streaming completo */
          await saveConversation(
            supabase,
            user.id,
            messages,
            fullResponse,
            conversationId
          )
        } catch (err) {
          controller.error(err)
        }
      },
    })

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error) {
    console.error('[API] Erro no chat AI:', error)
    return NextResponse.json(
      { error: 'Erro ao processar chat com IA' },
      { status: 500 }
    )
  }
}

/**
 * Salva ou atualiza a conversa no Supabase.
 */
async function saveConversation(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  messages: AIMessage[],
  assistantResponse: string,
  conversationId?: string
) {
  const allMessages: AIMessage[] = [
    ...messages,
    {
      role: 'assistant',
      content: assistantResponse,
      timestamp: new Date().toISOString(),
    },
  ]

  try {
    if (conversationId) {
      await supabase
        .from('ai_conversations')
        .update({
          messages: allMessages as unknown as Record<string, unknown>[],
          token_count: allMessages.reduce((acc, m) => acc + m.content.length, 0),
        })
        .eq('id', conversationId)
        .eq('user_id', userId)
    } else {
      const title = messages[0].content.slice(0, 100)

      await supabase
        .from('ai_conversations')
        .insert({
          user_id: userId,
          title,
          model: 'sonar',
          messages: allMessages as unknown as Record<string, unknown>[],
          token_count: allMessages.reduce((acc, m) => acc + m.content.length, 0),
        })
    }
  } catch (error) {
    console.error('[AI] Erro ao salvar conversa:', error)
  }
}
