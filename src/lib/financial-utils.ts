import { Transaction } from '@/app/finances/actions'

/* ── Tipos para Gráficos ──────────────────────────────────────── */

export interface ChartDataPoint {
  name: string // Data (DD/MM) ou Categoria
  value: number // Valor total
  income?: number // Para fluxo de caixa (entrada)
  expense?: number // Para fluxo de caixa (saída)
  color?: string // Cor para o gráfico de pizza
}

/* ── Cores do Tema Aurora ─────────────────────────────────────── */

const AURORA_COLORS = [
  '#818cf8', // Indigo 400
  '#c084fc', // Purple 400
  '#e879f9', // Fuchsia 400
  '#22d3ee', // Cyan 400
  '#34d399', // Emerald 400
  '#f472b6', // Pink 400
]

/* ── Agrupamento por Categoria (Pie Chart) ────────────────────── */

export function calculateCategoryExpenses(transactions: Transaction[]): ChartDataPoint[] {
  const expenses = transactions.filter((t) => t.type === 'expense')
  
  const categoryMap = new Map<string, number>()

  expenses.forEach((t) => {
    const current = categoryMap.get(t.category) || 0
    categoryMap.set(t.category, current + t.amount)
  })

  // Converte para array e ordena por valor decrescente
  return Array.from(categoryMap.entries())
    .map(([name, value], index) => ({
      name,
      value,
      color: AURORA_COLORS[index % AURORA_COLORS.length],
    }))
    .sort((a, b) => b.value - a.value)
}

/* ── Fluxo Diário (Bar/Area Chart) ────────────────────────────── */

export function calculateDailyFlow(transactions: Transaction[], daysInMonth: number): ChartDataPoint[] {
  // Cria um array com todos os dias do mês
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  
  return days.map((day) => {
    // Filtra transações deste dia
    const dailyTransactions = transactions.filter((t) => {
      // Ajuste de fuso horário simples: pega o dia da string 'YYYY-MM-DD'
      const tDay = parseInt(t.date.split('-')[2]) 
      return tDay === day
    })

    const income = dailyTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)

    const expense = dailyTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)

    return {
      name: String(day),
      income,
      expense,
      value: income - expense, // Saldo do dia (opcional)
    }
  })
}
