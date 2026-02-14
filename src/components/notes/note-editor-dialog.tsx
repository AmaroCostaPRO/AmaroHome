'use client'

import { useRef, useState, useEffect } from 'react'
import { useFormStatus } from 'react-dom'
import { Loader2, FileText, Network } from 'lucide-react'
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RichTextEditor } from './editors/rich-text-editor'
import { DiagramEditor } from './editors/diagram-editor'

/* ── Submit Button com Loading ────────────────────────────────── */

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
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

/* ── Componente Principal ─────────────────────────────────────── */

interface NoteEditorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  note: Note | null
}

export function NoteEditorDialog({ open, onOpenChange, note }: NoteEditorDialogProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  const [activeType, setActiveType] = useState<'document' | 'board'>('document')
  const [content, setContent] = useState('')

  /* Reset state on open */
  useEffect(() => {
    if (!open) return // Only run logic when dialog is open or becomes open
    
    if (note) {
      requestAnimationFrame(() => {
        setActiveType(note.type)
        setContent(note.content || '')
      })
    } else {
      requestAnimationFrame(() => {
        setActiveType('document')
        setContent('')
      })
    }
  }, [open, note])

  async function handleAction(formData: FormData) {
    /* Injetar o conteúdo do estado no FormData antes de enviar */
    formData.set('content', content)
    formData.set('type', activeType)
    
    await saveNote(formData)
    formRef.current?.reset()
    closeRef.current?.click()
  }

  const isEditing = !!note

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-5xl h-[85vh] flex flex-col p-0 gap-0 overflow-hidden"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="px-6 py-4 border-b border-glass-border bg-white/5 shrink-0">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <DialogTitle>{isEditing ? 'Editar Nota' : 'Nova Nota'}</DialogTitle>
              <DialogDescription>
                {isEditing ? 'Edite sua nota existente.' : 'Crie um novo documento ou diagrama.'}
              </DialogDescription>
            </div>
            
            {!isEditing && (
              <Tabs value={activeType} onValueChange={(v: string) => setActiveType(v as 'document' | 'board')}>
                <TabsList className="grid w-[200px] grid-cols-2">
                  <TabsTrigger value="document" className="flex gap-2">
                    <FileText className="w-4 h-4" /> Doc
                  </TabsTrigger>
                  <TabsTrigger value="board" className="flex gap-2">
                    <Network className="w-4 h-4" /> Board
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            )}
          </div>
        </DialogHeader>

        <form ref={formRef} action={handleAction} className="flex-1 flex flex-col min-h-0">
          {/* ID oculto (modo edição) */}
          {note && <input type="hidden" name="id" value={note.id} />}

          {/* Área de Edição (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-6 bg-background/50">
            <div className="space-y-4 max-w-4xl mx-auto h-full flex flex-col">
              {/* Título sem bordas */}
              <input
                name="title"
                defaultValue={note?.title ?? ''}
                placeholder="Título da nota..."
                className="w-full bg-transparent text-3xl font-bold text-foreground placeholder:text-muted/30 border-none outline-none py-2"
                autoComplete="off"
              />

              {/* Editor Switcher */}
              <div className="flex-1 min-h-[400px]">
                {activeType === 'document' ? (
                  <RichTextEditor 
                    content={content} 
                    onChange={setContent} 
                  />
                ) : (
                  <DiagramEditor 
                    content={content} 
                    onChange={setContent} 
                  />
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 border-t border-glass-border bg-white/5 flex justify-end shrink-0">
            <SubmitButton />
          </div>
        </form>

        <DialogClose ref={closeRef} className="hidden" />
      </DialogContent>
    </Dialog>
  )
}
