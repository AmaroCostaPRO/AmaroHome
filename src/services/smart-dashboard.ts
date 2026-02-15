import { createClient } from '@/lib/supabase/server'
import type { SupabaseClient } from '@supabase/supabase-js'

// ────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────

export interface SmartDashboardData {
  user: {
    name: string
  }
  finance: {
    monthBalance: number
    monthIncome: number
    monthExpense: number
  }
  notes: {
    id: string
    title: string
    type: 'document' | 'board'
    updatedAt: string
  }[]
  games: {
    id: string
    title: string
    coverUrl: string | null
    status: string
  }[]
}

// ────────────────────────────────────────────────────────────
// Fetchers
// ────────────────────────────────────────────────────────────

async function getFinanceSummary(userId: string, supabase: SupabaseClient) {
  const now = new Date()
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  const { data: transactions } = await supabase
    .from('finances')
    .select('amount, type')
    .eq('user_id', userId)
    .gte('date', firstOfMonth)

  const income = transactions
    ?.filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + (t.amount || 0), 0) || 0

  const expense = transactions
    ?.filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + (t.amount || 0), 0) || 0

  return {
    monthBalance: income - expense,
    monthIncome: income,
    monthExpense: expense,
  }
}

async function getLatestNotes(userId: string, supabase: SupabaseClient) {
  const { data: notes } = await supabase
    .from('notes')
    .select('id, title, tags, updated_at')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
    .limit(3)

  return (notes || []).map((note) => ({
    id: note.id,
    title: note.title || 'Sem título',
    // Infer type based on tags (simple heuristic)
    type: (note.tags?.includes('diagram') || note.tags?.includes('board') ? 'board' : 'document') as 'document' | 'board',
    updatedAt: note.updated_at,
  }))
}

async function getLatestGames(userId: string, supabase: SupabaseClient) {
  const { data: games } = await supabase
    .from('games_library')
    .select('id, title, cover_url, status')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
    .limit(3)

  return (games || []).map((game) => ({
    id: game.id,
    title: game.title,
    coverUrl: game.cover_url,
    status: game.status,
  }))
}

// ────────────────────────────────────────────────────────────
// Main Service
// ────────────────────────────────────────────────────────────

export async function getSmartDashboardData(userId: string): Promise<SmartDashboardData> {
  const supabase = await createClient()

  // Buscar nome do usuário (perfil ou metadata)
  const { data: { user } } = await supabase.auth.getUser()
  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Viajante'

  // Fetch paralelo
  const [finance, notes, games] = await Promise.all([
    getFinanceSummary(userId, supabase),
    getLatestNotes(userId, supabase),
    getLatestGames(userId, supabase),
  ])

  return {
    user: { name: userName },
    finance,
    notes,
    games,
  }
}
