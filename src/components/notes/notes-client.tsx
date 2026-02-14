'use client'

import { useState } from 'react'
import { Plus, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { NoteCard } from './note-card'
import { NoteEditorDialog } from './note-editor-dialog'
import type { Note } from '@/app/notes/actions'

/* ── Notes Client (orquestra Dialog + Grid) ───────────────────── */

interface NotesClientProps {
  notes: Note[]
}

export function NotesClient({ notes }: NotesClientProps) {
  const [editorOpen, setEditorOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)

  function handleNewNote() {
    setEditingNote(null)
    setEditorOpen(true)
  }

  function handleEditNote(note: Note) {
    setEditingNote(note)
    setEditorOpen(true)
  }

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            Minhas Notas
          </h2>
          <p className="text-muted">
            Ideias, lembretes e anotações rápidas
          </p>
        </div>

        <Button onClick={handleNewNote}>
          <Plus className="w-4 h-4" />
          Nova Nota
        </Button>
      </div>

      {/* Grid Masonry ou Empty State */}
      {notes.length > 0 ? (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-4">
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} onEdit={handleEditNote} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 glass-panel">
          <div className="p-5 rounded-full bg-white/3 mb-5">
            <FileText className="w-10 h-10 text-accent opacity-60" />
          </div>
          <h3 className="text-lg font-semibold text-secondary mb-2">
            Nenhuma nota ainda
          </h3>
          <p className="text-sm text-muted text-center max-w-xs mb-5">
            Comece a registrar suas ideias, lembretes e pensamentos.
          </p>
          <Button onClick={handleNewNote} variant="outline">
            <Plus className="w-4 h-4" />
            Escrever primeira nota
          </Button>
        </div>
      )}

      {/* Editor Dialog */}
      <NoteEditorDialog
        open={editorOpen}
        onOpenChange={setEditorOpen}
        note={editingNote}
      />
    </>
  )
}
