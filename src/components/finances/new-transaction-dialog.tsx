'use client'

import { useRef } from 'react'
import { useFormStatus } from 'react-dom'
import { Plus, Loader2 } from 'lucide-react'
import { addTransaction } from '@/app/finances/actions'
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
        'Salvar Transação'
      )}
    </Button>
  )
}

/* ── Categorias ───────────────────────────────────────────────── */

const categories = [
  'Alimentação',
  'Transporte',
  'Moradia',
  'Lazer',
  'Saúde',
  'Educação',
  'Salário',
  'Freelance',
  'Investimento',
  'Outros',
]

/* ── Componente Principal ─────────────────────────────────────── */

export function NewTransactionDialog() {
  const formRef = useRef<HTMLFormElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  async function handleAction(formData: FormData) {
    await addTransaction(formData)
    formRef.current?.reset()
    closeRef.current?.click() // fecha o modal após sucesso
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4" />
          Nova Transação
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Transação</DialogTitle>
          <DialogDescription>
            Registre uma receita ou despesa no seu controle financeiro.
          </DialogDescription>
        </DialogHeader>

        <form ref={formRef} action={handleAction} className="flex flex-col gap-4">
          {/* Título */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="tx-title" className="text-sm font-medium text-secondary">
              Título
            </label>
            <Input
              id="tx-title"
              name="title"
              placeholder="Ex: Supermercado, Salário..."
              required
            />
          </div>

          {/* Valor + Tipo (lado a lado) */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="tx-amount" className="text-sm font-medium text-secondary">
                Valor (R$)
              </label>
              <Input
                id="tx-amount"
                name="amount"
                type="text"
                inputMode="decimal"
                placeholder="0,00"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="tx-type" className="text-sm font-medium text-secondary">
                Tipo
              </label>
              <select
                id="tx-type"
                name="type"
                defaultValue="expense"
                required
                className="flex h-10 w-full rounded-sm px-3 py-2 text-sm bg-white/3 border border-glass-border text-foreground transition-all duration-(--transition-fast) hover:border-(--glass-border-hover) focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/20 focus:bg-white/5 cursor-pointer appearance-none"
              >
                <option value="expense" className="bg-elevated text-foreground">
                  Despesa
                </option>
                <option value="income" className="bg-elevated text-foreground">
                  Receita
                </option>
              </select>
            </div>
          </div>

          {/* Categoria */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="tx-category" className="text-sm font-medium text-secondary">
              Categoria
            </label>
            <select
              id="tx-category"
              name="category"
              required
              className="flex h-10 w-full rounded-sm px-3 py-2 text-sm bg-white/3 border border-glass-border text-foreground transition-all duration-(--transition-fast) hover:border-(--glass-border-hover) focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/20 focus:bg-white/5 cursor-pointer appearance-none"
            >
              <option value="" disabled className="bg-elevated text-muted">
                Selecione...
              </option>
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-elevated text-foreground">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Data */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="tx-date" className="text-sm font-medium text-secondary">
              Data
            </label>
            <Input
              id="tx-date"
              name="date"
              type="date"
              defaultValue={today}
              required
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
