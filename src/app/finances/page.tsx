import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getMonthlySummary } from './actions'
import { PageTransition } from '@/components/layout/page-transition'
import { SummaryCards } from '@/components/finances/summary-cards'
import { RecentTransactions } from '@/components/finances/recent-transactions'
import { NewTransactionDialog } from '@/components/finances/new-transaction-dialog'
import { CashFlowChart } from '@/components/finances/charts/cash-flow-chart'
import { ExpensesPieChart } from '@/components/finances/charts/expenses-pie-chart'
import { calculateCategoryExpenses, calculateDailyFlow } from '@/lib/financial-utils'

/* ── Nomes dos meses em pt-BR ─────────────────────────────────── */

const monthNames = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

/* ── Página ───────────────────────────────────────────────────── */

interface FinancesPageProps {
  searchParams: Promise<{ month?: string; year?: string }>
}

export default async function FinancesPage({ searchParams }: FinancesPageProps) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const params = await searchParams
  const now = new Date()
  const year = params.year ? parseInt(params.year) : now.getFullYear()
  const month = params.month ? parseInt(params.month) : now.getMonth() + 1

  const { income, expense, balance, transactions } = await getMonthlySummary(year, month)

  // Processamento de dados para os gráficos
  const daysInMonth = new Date(year, month, 0).getDate()
  const dailyFlowData = calculateDailyFlow(transactions, daysInMonth)
  const categoryExpensesData = calculateCategoryExpenses(transactions)

  /* ── Meses anterior / próximo ─── */
  const prevMonth = month === 1 ? 12 : month - 1
  const prevYear = month === 1 ? year - 1 : year
  const nextMonth = month === 12 ? 1 : month + 1
  const nextYear = month === 12 ? year + 1 : year

  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth() + 1

  return (
    <PageTransition>
      <div className="space-y-6 max-w-7xl mx-auto pb-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-foreground tracking-tight">
              CFO 2.0
            </h2>
            <p className="text-muted">
              Dashboard Financeiro Inteligente
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Seletor de Mês */}
            <div className="flex items-center gap-2 bg-slate-900/50 p-1 rounded-lg border border-slate-700/50">
              <Link
                href={`/finances?month=${prevMonth}&year=${prevYear}`}
                className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Mês anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </Link>

              <span className="text-sm font-semibold text-slate-200 min-w-[120px] text-center">
                {monthNames[month - 1]} {year}
              </span>

              {!isCurrentMonth ? (
                <Link
                  href={`/finances?month=${nextMonth}&year=${nextYear}`}
                  className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                  title="Próximo mês"
                >
                  <ChevronRight className="w-4 h-4" />
                </Link>
              ) : (
                <div className="p-1.5 text-slate-700 cursor-not-allowed">
                  <ChevronRight className="w-4 h-4" />
                </div>
              )}
            </div>

            {/* Botão Nova Transação */}
            <NewTransactionDialog />
          </div>
        </div>

        {/* KPIs Cards */}
        <SummaryCards income={income} expense={expense} balance={balance} />

        {/* Grid Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Gráfico de Fluxo de Caixa (Ocupa 2 colunas no desktop) */}
          <div className="lg:col-span-2 h-[350px]">
            <CashFlowChart data={dailyFlowData} />
          </div>

          {/* Gráfico de Pizza (Ocupa 1 coluna) */}
          <div className="h-[350px]">
             <ExpensesPieChart data={categoryExpensesData} />
          </div>
        </div>

        {/* Lista de Transações Recentes (Full width) */}
        <div className="h-[400px]">
          <RecentTransactions transactions={transactions} />
        </div>
      </div>
    </PageTransition>
  )
}
