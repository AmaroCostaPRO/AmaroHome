'use client'

import { useRef } from 'react'
import { useFormStatus } from 'react-dom'
import { Plus, Loader2 } from 'lucide-react'
import { addGame } from '@/app/games/actions'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

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
        'Adicionar Jogo'
      )}
    </Button>
  )
}

/* ── Plataformas ──────────────────────────────────────────────── */

const platforms = [
  'PC',
  'PlayStation 5',
  'PlayStation 4',
  'Xbox Series X|S',
  'Xbox One',
  'Nintendo Switch',
  'Mobile',
  'Steam Deck',
  'Outra',
]

/* ── Select styles (reutilizável) ─────────────────────────────── */

const selectClass =
  'flex h-10 w-full rounded-sm px-3 py-2 text-sm bg-white/3 border border-glass-border text-foreground transition-all duration-(--transition-fast) hover:border-(--glass-border-hover) focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/20 focus:bg-white/5 cursor-pointer appearance-none'

/* ── Componente Principal ─────────────────────────────────────── */

export function AddGameDialog() {
  const formRef = useRef<HTMLFormElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  async function handleAction(formData: FormData) {
    await addGame(formData)
    formRef.current?.reset()
    closeRef.current?.click()
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4" />
          Adicionar Jogo
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Jogo</DialogTitle>
          <DialogDescription>
            Adicione um jogo à sua coleção pessoal.
          </DialogDescription>
        </DialogHeader>

        <form ref={formRef} action={handleAction} className="flex flex-col gap-4">
          {/* Título */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="game-title" className="text-sm font-medium text-secondary">
              Título
            </label>
            <Input
              id="game-title"
              name="title"
              placeholder="Ex: The Witcher 3, Elden Ring..."
              required
            />
          </div>

          {/* Plataforma + Status (lado a lado) */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="game-platform" className="text-sm font-medium text-secondary">
                Plataforma
              </label>
              <select
                id="game-platform"
                name="platform"
                className={selectClass}
              >
                <option value="" className="bg-elevated text-muted">
                  Selecione...
                </option>
                {platforms.map((p) => (
                  <option key={p} value={p} className="bg-elevated text-foreground">
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="game-status" className="text-sm font-medium text-secondary">
                Status
              </label>
              <select
                id="game-status"
                name="status"
                defaultValue="backlog"
                required
                className={selectClass}
              >
                <option value="backlog" className="bg-elevated text-foreground">
                  Backlog
                </option>
                <option value="playing" className="bg-elevated text-foreground">
                  Jogando
                </option>
                <option value="completed" className="bg-elevated text-foreground">
                  Finalizado
                </option>
              </select>
            </div>
          </div>

          {/* URL da Capa */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="game-cover" className="text-sm font-medium text-secondary">
              URL da Capa <span className="text-muted">(opcional)</span>
            </label>
            <Input
              id="game-cover"
              name="cover_url"
              type="url"
              placeholder="https://..."
            />
          </div>

          {/* Botão */}
          <SubmitButton />
        </form>

        {/* Ref oculta para fechar o modal programaticamente */}
        <DialogClose ref={closeRef} className="hidden" />
      </DialogContent>
    </Dialog>
  )
}
