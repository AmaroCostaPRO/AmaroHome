'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Sparkles, BookOpen, Lightbulb, MessageSquare } from 'lucide-react'
import { ChatMessage } from '@/components/ai/chat-message'
import { ChatInput } from '@/components/ai/chat-input'
import { Button } from '@/components/ui/button'
import { PageWrapper } from '@/components/layout/page-wrapper'

/* ── Tipos ────────────────────────────────────────────────────── */

interface Message {
  role: 'user' | 'assistant'
  content: string
}

/* ── Sugestões de empty state ─────────────────────────────────── */

const suggestions = [
  { label: 'Resumir uma nota', icon: MessageSquare },
  { label: 'Ideias de leitura', icon: BookOpen },
  { label: 'Brainstorm criativo', icon: Lightbulb },
]

/* ── Página ───────────────────────────────────────────────────── */

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const abortRef = useRef<AbortController | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  /* Auto-scroll */
  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      })
    })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  /* Enviar mensagem */
  async function handleSend(text: string) {
    const userMessage: Message = { role: 'user', content: text }
    const assistantMessage: Message = { role: 'assistant', content: '' }

    setMessages((prev) => [...prev, userMessage, assistantMessage])
    setIsStreaming(true)

    const controller = new AbortController()
    abortRef.current = controller

    try {
      /* Payload com histórico + nova mensagem */
      const apiMessages = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
        timestamp: new Date().toISOString(),
      }))

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
        signal: controller.signal,
      })

      if (!res.ok || !res.body) {
        throw new Error('Erro na resposta da IA')
      }

      /* Ler stream em chunks */
      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        accumulated += decoder.decode(value, { stream: true })

        /* Atualizar a última mensagem (assistant) */
        const snapshot = accumulated
        setMessages((prev) => {
          const updated = [...prev]
          updated[updated.length - 1] = {
            role: 'assistant',
            content: snapshot,
          }
          return updated
        })
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        /* Cancelado pelo usuário — manter texto parcial */
      } else {
        setMessages((prev) => {
          const updated = [...prev]
          updated[updated.length - 1] = {
            role: 'assistant',
            content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.',
          }
          return updated
        })
      }
    } finally {
      setIsStreaming(false)
      abortRef.current = null
    }
  }

  /* Parar streaming */
  function handleStop() {
    abortRef.current?.abort()
  }

  /* Sugestão clicada */
  function handleSuggestion(text: string) {
    handleSend(text)
  }

  const hasMessages = messages.length > 0

  return (
    <PageWrapper className="flex flex-col h-[calc(100vh-6rem)] max-w-4xl mx-auto">
      {/* Header */}
      <div className="shrink-0 mb-4">
        <h2 className="text-2xl font-bold text-foreground tracking-tight">
          Assistente Pessoal
        </h2>
        <p className="text-muted text-sm">
          Converse com IA para ideias, resumos e brainstorms
        </p>
      </div>

      {/* Área de mensagens */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-4 pr-1 pb-4 scrollbar-thin"
      >
        {hasMessages ? (
          messages.map((msg, i) => (
            <ChatMessage key={i} role={msg.role} content={msg.content} />
          ))
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center h-full">
            <div className="p-5 rounded-full bg-accent/10 mb-5">
              <Sparkles className="w-10 h-10 text-accent opacity-70" />
            </div>
            <h3 className="text-lg font-semibold text-secondary mb-2">
              Como posso ajudar você hoje?
            </h3>
            <p className="text-sm text-muted text-center max-w-sm mb-6">
              Pergunte qualquer coisa — posso resumir notas, sugerir leituras ou ajudar com ideias.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestions.map((s) => (
                <Button
                  key={s.label}
                  variant="outline"
                  onClick={() => handleSuggestion(s.label)}
                >
                  <s.icon className="w-4 h-4" />
                  {s.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Indicador de digitação */}
        {isStreaming && messages[messages.length - 1]?.content === '' && (
          <div className="flex gap-3">
            <div className="shrink-0 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-accent animate-pulse" />
            </div>
            <div className="glass-panel rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-muted rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input fixo */}
      <div className="shrink-0 pt-2">
        <ChatInput
          onSend={handleSend}
          isStreaming={isStreaming}
          onStop={handleStop}
        />
      </div>
    </PageWrapper>
  )
}
