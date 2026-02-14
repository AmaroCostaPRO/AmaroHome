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
  const cards = [
    {
      label: 'Receitas',
      value: income,
      icon: TrendingUp,
      color: 'text-emerald-400',
      borderColor: 'border-emerald-500/30',
      glowColor: 'shadow-[0_0_20px_rgba(34,197,94,0.12)]',
      bgIcon: 'bg-emerald-500/10',
    },
    {
      label: 'Despesas',
      value: expense,
      icon: TrendingDown,
      color: 'text-red-400',
      borderColor: 'border-red-500/30',
      glowColor: 'shadow-[0_0_20px_rgba(239,68,68,0.12)]',
      bgIcon: 'bg-red-500/10',
    },
    {
      label: 'Saldo',
      value: balance,
      icon: Wallet,
      color: balance >= 0 ? 'text-foreground' : 'text-red-400',
      borderColor: 'border-white/8',
      glowColor: 'shadow-[0_0_20px_rgba(255,255,255,0.04)]',
      bgIcon: 'bg-white/5',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`
            glass-card p-5 border ${card.borderColor} ${card.glowColor}
            transition-all duration-(--transition-base)
            hover:scale-[1.02] hover:${card.glowColor}
          `}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-secondary font-medium">
              {card.label}
            </span>
            <div className={`w-9 h-9 rounded-lg ${card.bgIcon} flex items-center justify-center`}>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
          </div>
          <p className={`text-2xl font-bold tracking-tight ${card.color}`}>
            {formatBRL(card.value)}
          </p>
        </div>
      ))}
    </div>
  )
}
