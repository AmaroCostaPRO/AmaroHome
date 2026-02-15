'use client'

import { useRef, useCallback, type FormEvent } from 'react'
import { Send, Square } from 'lucide-react'
import { Button } from '@/components/ui/button'

/* ── Tipos ────────────────────────────────────────────────────── */

interface ChatInputProps {
  onSend: (message: string) => void
  isStreaming: boolean
  onStop: () => void
}

/* ── Componente ───────────────────────────────────────────────── */

export function ChatInput({ onSend, isStreaming, onStop }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const autoResize = useCallback(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }, [])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const value = textareaRef.current?.value.trim()
    if (!value || isStreaming) return

    onSend(value)
    if (textareaRef.current) {
      textareaRef.current.value = ''
      textareaRef.current.style.height = 'auto'
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-panel p-3 flex items-end gap-2"
    >
      <textarea
        ref={textareaRef}
        placeholder="Digite sua mensagem..."
        rows={1}
        onInput={autoResize}
        onKeyDown={handleKeyDown}
        disabled={isStreaming}
        className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted resize-none outline-none py-2 px-1 max-h-[160px] disabled:opacity-50"
      />

      {isStreaming ? (
        <Button
          type="button"
          variant="destructive"
          onClick={onStop}
          className="shrink-0"
        >
          <Square className="w-4 h-4" />
        </Button>
      ) : (
        <Button type="submit" className="shrink-0">
          <Send className="w-4 h-4" />
        </Button>
      )}
    </form>
  )
}
