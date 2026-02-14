'use client'

import { useTransition } from 'react'
import { Pin, PinOff, Trash2, FileText, Network } from 'lucide-react'
import { deleteNote, togglePin } from '@/app/notes/actions'
import type { Note } from '@/app/notes/actions'

/* ── Formatar data relativa ───────────────────────────────────── */

function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Hoje'
  if (diffDays === 1) return 'Ontem'
  if (diffDays < 7) return `${diffDays} dias atrás`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} sem. atrás`

  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

/* ── Note Card ────────────────────────────────────────────────── */

interface NoteCardProps {
  note: Note
  onEdit: (note: Note) => void
}

export function NoteCard({ note, onEdit }: NoteCardProps) {
  const [isPending, startTransition] = useTransition()

  function handlePin(e: React.MouseEvent) {
    e.stopPropagation()
    startTransition(() => togglePin(note.id, note.is_pinned))
  }

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation()
    startTransition(() => deleteNote(note.id))
  }

  return (
    <button
      type="button"
      onClick={() => onEdit(note)}
      disabled={isPending}
      className="group glass-panel p-4 text-left w-full break-inside-avoid mb-4 transition-all duration-300 hover:border-(--glass-border-hover) hover:shadow-(--shadow-md) cursor-pointer disabled:opacity-60 relative"
    >
      {/* Loading overlay */}
      {isPending && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-black/30 backdrop-blur-sm">
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {/* Header: Título + Ações */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-2 flex-1">
          {note.is_pinned && (
            <span className="inline-block mr-1.5 text-accent text-xs align-middle">📌</span>
          )}
          {note.type === 'board' && (
            <span className="inline-block mr-1.5 align-middle" title="Board / Diagrama">
              <Network className="w-3.5 h-3.5 text-blue-400 inline" />
            </span>
          )}
          {(!note.type || note.type === 'document') && (
             <span className="inline-block mr-1.5 align-middle" title="Documento">
              <FileText className="w-3.5 h-3.5 text-emerald-400 inline" />
            </span>
          )}
          {note.title}
        </h3>

        <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span
            role="button"
            tabIndex={0}
            onClick={handlePin}
            onKeyDown={(e) => { if (e.key === 'Enter') handlePin(e as unknown as React.MouseEvent) }}
            className="p-1 rounded-sm text-muted hover:text-accent hover:bg-white/5 transition-colors"
            title={note.is_pinned ? 'Desafixar' : 'Fixar'}
          >
            {note.is_pinned ? (
              <PinOff className="w-3.5 h-3.5" />
            ) : (
              <Pin className="w-3.5 h-3.5" />
            )}
          </span>

          <span
            role="button"
            tabIndex={0}
            onClick={handleDelete}
            onKeyDown={(e) => { if (e.key === 'Enter') handleDelete(e as unknown as React.MouseEvent) }}
            className="p-1 rounded-sm text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Excluir"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>

      {/* Preview do conteúdo */}
      {note.content && (
        <p className="text-xs text-muted leading-relaxed line-clamp-4 mb-3">
          {note.content}
        </p>
      )}

      {/* Footer: Data */}
      <p className="text-[10px] text-muted/60">
        {formatRelativeDate(note.updated_at)}
      </p>
    </button>
  )
}
