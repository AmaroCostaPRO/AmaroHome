'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

/* ── Tipos ────────────────────────────────────────────────────── */

export type GameStatus = 'playing' | 'backlog' | 'completed' | 'dropped'

export interface Game {
  id: string
  user_id: string
  title: string
  slug: string | null
  rawg_id: number | null
  platform: string | null
  genre: string | null
  rating: number | null
  cover_url: string | null
  status: GameStatus
  playtime_hours: number | null
  notes: string | null
  favorite: boolean
  metadata: Record<string, unknown> | null
  created_at: string
  updated_at: string
}

/* ── Buscar Jogos ─────────────────────────────────────────────── */

export async function getGames(): Promise<Game[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Não autenticado')

  const { data, error } = await supabase
    .from('games_library')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)

  return (data ?? []) as Game[]
}

/* ── Adicionar Jogo ───────────────────────────────────────────── */

export async function addGame(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Não autenticado')

  const title = formData.get('title') as string
  const platform = formData.get('platform') as string | null
  const status = (formData.get('status') as GameStatus) || 'backlog'
  const cover_url = (formData.get('cover_url') as string) || null

  if (!title) throw new Error('O título é obrigatório')

  const { error } = await supabase.from('games_library').insert({
    title,
    platform: platform || null,
    status,
    cover_url: cover_url || null,
    user_id: user.id,
  })

  if (error) throw new Error(error.message)

  revalidatePath('/games')
}

/* ── Atualizar Status ─────────────────────────────────────────── */

export async function updateGameStatus(id: string, status: GameStatus) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Não autenticado')

  const { error } = await supabase
    .from('games_library')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)

  revalidatePath('/games')
}

/* ── Remover Jogo ─────────────────────────────────────────────── */

export async function deleteGame(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Não autenticado')

  const { error } = await supabase
    .from('games_library')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)

  revalidatePath('/games')
}
