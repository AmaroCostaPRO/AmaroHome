'use client'

import { useRef, useEffect, useCallback } from 'react'
import { useFormStatus } from 'react-dom'
import { Loader2 } from 'lucide-react'
import { saveNote } from '@/app/notes/actions'
import type { Note } from '@/app/notes/actions'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

/* ── Submit Button com Loading ────────────────────────────────── */

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} className="w-full mt-2">
      {pending ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Salvando...
        </>
      ) : (
        'Salvar Nota'
      )}
    </Button>
  )
}

/* ── Auto-resize Textarea ─────────────────────────────────────── */

function autoResize(el: HTMLTextAreaElement) {
  el.style.height = 'auto'
  el.style.height = `${el.scrollHeight}px`
}

/* ── Componente Principal ─────────────────────────────────────── */

interface NoteEditorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  note: Note | null
}

export function NoteEditorDialog({ open, onOpenChange, note }: NoteEditorDialogProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleAutoResize = useCallback(() => {
    if (textareaRef.current) autoResize(textareaRef.current)
  }, [])

  /* Auto-resize quando abre com conteúdo */
  useEffect(() => {
    if (open) {
      requestAnimationFrame(handleAutoResize)
    }
  }, [open, handleAutoResize])

  async function handleAction(formData: FormData) {
    await saveNote(formData)
    formRef.current?.reset()
    closeRef.current?.click()
  }

  const isEditing = !!note

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Nota' : 'Nova Nota'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Atualize o conteúdo da sua nota.'
              : 'Escreva uma nova ideia, lembrete ou anotação.'}
          </DialogDescription>
        </DialogHeader>

        <form ref={formRef} action={handleAction} className="flex flex-col gap-4">
          {/* ID oculto (modo edição) */}
          {note && <input type="hidden" name="id" value={note.id} />}

          {/* Título */}
          <input
            name="title"
            defaultValue={note?.title ?? ''}
            placeholder="Título da nota..."
            className="w-full bg-transparent text-lg font-semibold text-foreground placeholder:text-muted/50 border-none outline-none py-1"
          />

          {/* Conteúdo */}
          <textarea
            ref={textareaRef}
            name="content"
            defaultValue={note?.content ?? ''}
            placeholder="Comece a escrever..."
            rows={6}
            onInput={(e) => autoResize(e.currentTarget)}
            className="w-full bg-white/3 border border-glass-border rounded-sm px-3 py-3 text-sm text-foreground placeholder:text-muted resize-none transition-all duration-(--transition-fast) hover:border-(--glass-border-hover) focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/20 focus:bg-white/5 min-h-[120px]"
          />

          {/* Botão */}
          <SubmitButton />
        </form>

        {/* Ref oculta para fechar o modal programaticamente */}
        <DialogClose ref={closeRef} className="hidden" />
      </DialogContent>
    </Dialog>
  )
}
