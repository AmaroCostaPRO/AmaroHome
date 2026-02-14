'use client'

import { useTransition } from 'react'
import { Trash2, Receipt } from 'lucide-react'
import { deleteTransaction, type Transaction } from '@/app/finances/actions'

/* ── Formatadores ─────────────────────────────────────────────── */

const formatBRL = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)

const formatDate = (dateStr: string) => {
  const [, month, day] = dateStr.split('-')
  return `${day}/${month}`
}

/* ── Categorias → Badge Color ─────────────────────────────────── */

const categoryColors: Record<string, string> = {
  alimentação: 'bg-orange-500/15 text-orange-400 border-orange-500/20',
  transporte: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  moradia: 'bg-violet-500/15 text-violet-400 border-violet-500/20',
  lazer: 'bg-pink-500/15 text-pink-400 border-pink-500/20',
  saúde: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  educação: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
  salário: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  freelance: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  investimento: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20',
}

const defaultBadge = 'bg-white/8 text-secondary border-white/10'

/* ── Delete Button ────────────────────────────────────────────── */

function DeleteButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      disabled={isPending}
      onClick={() => startTransition(() => deleteTransaction(id))}
      className="p-2 rounded-sm text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors duration-(--transition-fast) cursor-pointer disabled:opacity-40"
      title="Excluir transação"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  )
}

/* ── Componente Principal ─────────────────────────────────────── */

interface TransactionListProps {
  transactions: Transaction[]
}

export function TransactionList({ transactions }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 glass-card rounded-lg">
        <div className="w-20 h-20 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-6">
          <Receipt className="w-10 h-10 text-accent/60" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Tudo tranquilo por aqui
        </h3>
        <p className="text-sm text-muted text-center max-w-sm">
          Nenhuma transação registrada neste mês. Use o botão acima para adicionar.
        </p>
      </div>
    )
  }

  return (
    <>
      {/* Desktop: Tabela */}
      <div className="hidden sm:block glass-panel overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-(--border-subtle)">
              <th className="text-left text-xs font-medium text-muted uppercase tracking-wider px-5 py-3">
                Data
              </th>
              <th className="text-left text-xs font-medium text-muted uppercase tracking-wider px-5 py-3">
                Título
              </th>
              <th className="text-left text-xs font-medium text-muted uppercase tracking-wider px-5 py-3">
                Categoria
              </th>
              <th className="text-right text-xs font-medium text-muted uppercase tracking-wider px-5 py-3">
                Valor
              </th>
              <th className="text-right text-xs font-medium text-muted uppercase tracking-wider px-5 py-3 w-16">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-(--border-subtle)">
            {transactions.map((t) => {
              const badgeClass = categoryColors[t.category.toLowerCase()] ?? defaultBadge
              return (
                <tr
                  key={t.id}
                  className="group hover:bg-white/2 transition-colors duration-(--transition-fast)"
                >
                  <td className="px-5 py-3.5 text-sm text-secondary tabular-nums">
                    {formatDate(t.date)}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-foreground font-medium">
                    {t.title}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeClass}`}
                    >
                      {t.category}
                    </span>
                  </td>
                  <td
                    className={`px-5 py-3.5 text-sm font-semibold text-right tabular-nums ${
                      t.type === 'income' ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {t.type === 'income' ? '+' : '-'} {formatBRL(t.amount)}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <DeleteButton id={t.id} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile: Lista de Cards */}
      <div className="sm:hidden flex flex-col gap-3">
        {transactions.map((t) => {
          const badgeClass = categoryColors[t.category.toLowerCase()] ?? defaultBadge
          return (
            <div
              key={t.id}
              className="glass-card p-4 flex items-center gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-foreground truncate">
                    {t.title}
                  </span>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border shrink-0 ${badgeClass}`}
                  >
                    {t.category}
                  </span>
                </div>
                <span className="text-xs text-muted">{formatDate(t.date)}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`text-sm font-semibold tabular-nums ${
                    t.type === 'income' ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {t.type === 'income' ? '+' : '-'} {formatBRL(t.amount)}
                </span>
                <DeleteButton id={t.id} />
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
