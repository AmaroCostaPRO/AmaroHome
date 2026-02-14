'use client'

import { Bot, User } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

/* ── Tipos ────────────────────────────────────────────────────── */

interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
}

/* ── Componente ───────────────────────────────────────────────── */

export function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === 'user'

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div
        className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser
            ? 'bg-accent/15 text-accent'
            : 'bg-white/5 text-muted'
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Balão */}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? 'bg-accent/10 border border-accent/20 text-foreground'
            : 'glass-panel text-secondary'
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{content}</p>
        ) : (
          <div className="prose-chat">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  )
}
