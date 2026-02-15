'use client'

import { useTransition } from 'react'
import { Trash2, ArrowRight } from 'lucide-react'
import { deleteTransaction, type Transaction } from '@/app/finances/actions'
import { motion } from 'framer-motion'

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

/* ── Categorias → Badge Color (Aurora Theme) ──────────────────── */

const categoryColors: Record<string, string> = {
  alimentação: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  transporte: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  moradia: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  lazer: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  saúde: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  educação: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  salário: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  freelance: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  investimento: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
}

const defaultBadge = 'bg-slate-700/30 text-slate-400 border-slate-600/30'

/* ── Delete Button ────────────────────────────────────────────── */

function DeleteButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      disabled={isPending}
      onClick={() => startTransition(() => deleteTransaction(id))}
      className="p-1.5 rounded-md text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer disabled:opacity-40"
      title="Excluir transação"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  )
}

/* ── Componente Principal ─────────────────────────────────────── */

interface RecentTransactionsProps {
  transactions: Transaction[]
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  // Mostra apenas as últimas 5~7 transações
  const recentItems = transactions.slice(0, 6)

  return (
    <div className="w-full h-full bg-slate-900/40 backdrop-blur-md border border-indigo-500/20 rounded-2xl p-6 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
          <div className="w-1 h-5 bg-pink-500 rounded-full" />
          Recentes
        </h3>
        
        {transactions.length > 6 && (
          <button className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
            Ver todas <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
        {recentItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-8 text-slate-500 text-sm">
            Nenhuma transação recente
          </div>
        ) : (
          recentItems.map((t, i) => {
            const badgeClass = categoryColors[t.category.toLowerCase()] ?? defaultBadge
            return (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                key={t.id}
                className="group flex items-center justify-between p-3 rounded-xl bg-slate-800/20 border border-transparent hover:border-slate-700/50 hover:bg-slate-800/40 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold leading-none ${badgeClass}`}>
                    {t.category.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-200 truncate max-w-[120px] sm:max-w-[200px]">
                      {t.title}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {formatDate(t.date)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-sm font-bold tabular-nums ${
                      t.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {t.type === 'income' ? '+' : '-'} {formatBRL(t.amount)}
                  </span>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <DeleteButton id={t.id} />
                  </div>
                </div>
              </motion.div>
            )
          })
        )}
      </div>
    </div>
  )
}
