import { TrendingUp, TrendingDown, Wallet } from 'lucide-react'

/* ── Formatador de moeda BRL ─────────────────────────────────── */

const formatBRL = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)

/* ── Tipos ────────────────────────────────────────────────────── */

interface SummaryCardsProps {
  income: number
  expense: number
  balance: number
}

/* ── Componente ───────────────────────────────────────────────── */

export function SummaryCards({ income, expense, balance }: SummaryCardsProps) {


  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Saldo Total */}
      <div className="relative overflow-hidden rounded-2xl p-6 bg-slate-900/40 backdrop-blur-md border border-indigo-500/20 transition-all hover:-translate-y-1 duration-300 group">
        <div className="absolute inset-0 bg-linear-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-slate-400 mb-1">Saldo Total</p>
            <h3 className={`text-2xl font-bold tracking-tight ${balance >= 0 ? 'text-white' : 'text-red-400'}`}>
              {formatBRL(balance)}
            </h3>
          </div>
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
            <Wallet className="w-5 h-5 text-indigo-400" />
          </div>
        </div>
      </div>

      {/* Receitas */}
      <div className="relative overflow-hidden rounded-2xl p-6 bg-slate-900/40 backdrop-blur-md border border-emerald-500/20 transition-all hover:-translate-y-1 duration-300 group">
        <div className="absolute inset-0 bg-linear-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-slate-400 mb-1">Receitas</p>
            <h3 className="text-2xl font-bold tracking-tight text-emerald-400">
              {formatBRL(income)}
            </h3>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Despesas */}
      <div className="relative overflow-hidden rounded-2xl p-6 bg-slate-900/40 backdrop-blur-md border border-rose-500/20 transition-all hover:-translate-y-1 duration-300 group">
        <div className="absolute inset-0 bg-linear-to-br from-rose-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-slate-400 mb-1">Despesas</p>
            <h3 className="text-2xl font-bold tracking-tight text-rose-400">
              {formatBRL(expense)}
            </h3>
          </div>
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
            <TrendingDown className="w-5 h-5 text-rose-400" />
          </div>
        </div>
      </div>
    </div>
  )
}
