import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface CFOWidgetProps {
  data: {
    monthBalance: number
    monthIncome: number
    monthExpense: number
  }
}

export function CFOWidget({ data }: CFOWidgetProps) {
  return (
    <div className="h-full flex flex-col justify-between">
      <div className="space-y-1">
        <p className="text-3xl font-bold text-emerald-400 tracking-tight">
          {formatCurrency(data.monthBalance)}
        </p>
        <p className="text-xs text-muted-foreground font-medium">Saldo Atual</p>
      </div>

      <div className="space-y-3 mt-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="p-1 rounded-full bg-emerald-500/10 text-emerald-400">
              <ArrowUpRight className="w-3 h-3" />
            </div>
            <span>Receitas</span>
          </div>
          <span className="font-semibold text-foreground">{formatCurrency(data.monthIncome)}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="p-1 rounded-full bg-red-500/10 text-red-400">
              <ArrowDownRight className="w-3 h-3" />
            </div>
            <span>Despesas</span>
          </div>
          <span className="font-semibold text-foreground">{formatCurrency(data.monthExpense)}</span>
        </div>
      </div>
    </div>
  )
}
