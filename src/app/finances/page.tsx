import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getMonthlySummary } from './actions'
import { PageTransition } from '@/components/layout/page-transition'
import { SummaryCards } from '@/components/finances/summary-cards'
import { TransactionList } from '@/components/finances/transaction-list'
import { NewTransactionDialog } from '@/components/finances/new-transaction-dialog'

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

  /* ── Meses anterior / próximo ─── */
  const prevMonth = month === 1 ? 12 : month - 1
  const prevYear = month === 1 ? year - 1 : year
  const nextMonth = month === 12 ? 1 : month + 1
  const nextYear = month === 12 ? year + 1 : year

  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth() + 1

  return (
    <PageTransition>
      <div className="space-y-8 max-w-5xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-foreground tracking-tight">
              Finanças
            </h2>
            <p className="text-muted">
              Controle de receitas e despesas
            </p>
          </div>

          {/* Seletor de Mês */}
          <div className="flex items-center gap-2">
            <Link
              href={`/finances?month=${prevMonth}&year=${prevYear}`}
              className="p-2 rounded-sm text-muted hover:text-foreground hover:bg-white/5 transition-colors duration-(--transition-fast)"
              title="Mês anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>

            <span className="text-sm font-semibold text-foreground min-w-[140px] text-center">
              {monthNames[month - 1]} {year}
            </span>

            {!isCurrentMonth ? (
              <Link
                href={`/finances?month=${nextMonth}&year=${nextYear}`}
                className="p-2 rounded-sm text-muted hover:text-foreground hover:bg-white/5 transition-colors duration-(--transition-fast)"
                title="Próximo mês"
              >
                <ChevronRight className="w-5 h-5" />
              </Link>
            ) : (
              <div className="p-2 text-muted/30">
                <ChevronRight className="w-5 h-5" />
              </div>
            )}
          </div>
        </div>

        {/* Summary Cards */}
        <SummaryCards income={income} expense={expense} balance={balance} />

        {/* Nova Transação */}
        <div className="flex justify-end">
          <NewTransactionDialog />
        </div>

        {/* Transações */}
        <TransactionList transactions={transactions} />
      </div>
    </PageTransition>
  )
}
