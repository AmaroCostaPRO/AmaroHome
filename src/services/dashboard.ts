import { createClient } from '@/lib/supabase/server'

// ────────────────────────────────────────────────────────────
// Dashboard Data Types
// ────────────────────────────────────────────────────────────

export interface DashboardData {
  /** Saldo do mês atual: soma(income) - soma(expense) */
  monthBalance: number
  /** Total de playlists do usuário */
  playlistCount: number
  /** Total de games com status "playing" ou "backlog" */
  gamesCount: number
  /** Total de eBooks na estante */
  ebooksCount: number
  /** Últimas 5 atividades (notas criadas/atualizadas recentemente) */
  recentActivity: RecentActivityItem[]
}

export interface RecentActivityItem {
  id: string
  type: 'note' | 'finance' | 'ebook'
  title: string
  createdAt: string
}

// ────────────────────────────────────────────────────────────
// getDashboardData
// ────────────────────────────────────────────────────────────

export async function getDashboardData(userId: string): Promise<DashboardData> {
  const supabase = await createClient()

  // Primeiro dia do mês corrente (UTC)
  const now = new Date()
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  const [
    incomeResult,
    expenseResult,
    playlistResult,
    gamesResult,
    ebooksResult,
    recentNotesResult,
    recentFinancesResult,
  ] = await Promise.all([
    // Soma receitas do mês
    supabase
      .from('finances')
      .select('amount')
      .eq('user_id', userId)
      .eq('type', 'income')
      .gte('date', firstOfMonth),

    // Soma despesas do mês
    supabase
      .from('finances')
      .select('amount')
      .eq('user_id', userId)
      .eq('type', 'expense')
      .gte('date', firstOfMonth),

    // Contagem de playlists
    supabase
      .from('playlists')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId),

    // Contagem de games (playing | backlog)
    supabase
      .from('games_library')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .in('status', ['playing', 'backlog']),

    // Contagem de eBooks
    supabase
      .from('ebooks')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId),

    // Últimas 3 notas recentes
    supabase
      .from('notes')
      .select('id, title, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(3),

    // Últimas 2 transações recentes
    supabase
      .from('finances')
      .select('id, title, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(2),
  ])

  // Calcular saldo do mês
  const totalIncome = (incomeResult.data ?? []).reduce((sum, r) => sum + (r.amount ?? 0), 0)
  const totalExpense = (expenseResult.data ?? []).reduce((sum, r) => sum + (r.amount ?? 0), 0)
  const monthBalance = totalIncome - totalExpense

  // Montar atividades recentes (notas + finanças, ordenadas por data)
  const recentActivity: RecentActivityItem[] = [
    ...(recentNotesResult.data ?? []).map((n) => ({
      id: n.id,
      type: 'note' as const,
      title: n.title || 'Nota sem título',
      createdAt: n.created_at,
    })),
    ...(recentFinancesResult.data ?? []).map((f) => ({
      id: f.id,
      type: 'finance' as const,
      title: f.title,
      createdAt: f.created_at,
    })),
  ]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  return {
    monthBalance,
    playlistCount: playlistResult.count ?? 0,
    gamesCount: gamesResult.count ?? 0,
    ebooksCount: ebooksResult.count ?? 0,
    recentActivity,
  }
}
