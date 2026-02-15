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
  personal_rating: 'like' | 'neutral' | 'dislike' | null
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

  // Tentar encontrar RAWG ID se possível
  let rawg_id: number | null = null
  let genre: string | null = null
  let released: string | null = null
  
  // Se tivermos um cover_url da RAWG, podemos tentar extrair o ID ou fazer uma busca exata
  // Mas por simplicidade, vamos fazer uma busca exata pelo nome na RAWG para pegar metadados
  if (process.env.RAWG_API_KEY) {
    try {
      const search = await searchRAWGGames(title)
      const match = search.find(g => g.title.toLowerCase() === title.toLowerCase()) || search[0]
      if (match) {
        rawg_id = match.id
        // Buscar detalhes para pegar gênero
        const details = await getRAWGGameDetails(match.id)
        if (details) {
          genre = details.genres[0]?.name || null
          released = details.released
        }
      }
    } catch (e) {
      console.error('Error fetching auto-metadata:', e)
    }
  }

  const { error } = await supabase.from('games_library').insert({
    title,
    platform: platform || null,
    status,
    cover_url: cover_url || null,
    user_id: user.id,
    rawg_id,
    genre,
    // Store release year in metadata if available
    metadata: released ? { release_date: released } : null
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

/* ── Atualizar Estatísticas (Horas e Nota) ────────────────────── */

export async function updateGameStats(
  id: string, 
  stats: { playtime_hours?: number; personal_rating?: 'like' | 'neutral' | 'dislike' | null }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Não autenticado')

  const { error } = await supabase
    .from('games_library')
    .update({ ...stats, updated_at: new Date().toISOString() })
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

/* ── RAWG Integration ─────────────────────────────────────────── */

interface RawgGame {
  id: number
  name: string
  background_image: string | null
  released: string | null
  platforms: { platform: { name: string } }[] | null
}

export interface SearchGameResult {
  id: number
  title: string
  cover_url: string | null
  year: string
  platforms: string[]
}

export interface RawgGameDetails {
  id: number
  name: string
  description_raw: string
  released: string | null
  background_image: string | null
  website: string | null
  rating: number
  playtime: number
  developers: { name: string }[]
  publishers: { name: string }[]
  genres: { name: string }[]
  platforms: { platform: { name: string } }[]
}

export async function getRAWGGameDetails(gameId: number): Promise<RawgGameDetails | null> {
  const apiKey = process.env.RAWG_API_KEY
  if (!apiKey) throw new Error('RAWG API Key not configured')

  try {
    const response = await fetch(
      `https://api.rawg.io/api/games/${gameId}?key=${apiKey}`,
      { next: { revalidate: 86400 } } // Cache por 24h
    )

    if (!response.ok) return null

    return await response.json() as RawgGameDetails
  } catch (error) {
    console.error('RAWG Details Error:', error)
    return null
  }
}

export async function searchRAWGGames(query: string): Promise<SearchGameResult[]> {
  if (!query || query.length < 3) return []

  const apiKey = process.env.RAWG_API_KEY
  if (!apiKey) throw new Error('RAWG API Key not configured')

  try {
    const response = await fetch(
      `https://api.rawg.io/api/games?key=${apiKey}&search=${encodeURIComponent(
        query
      )}&page_size=5&ordering=-rating`,
      { next: { revalidate: 3600 } }
    )

    if (!response.ok) return []

    const data = await response.json()
    
    return (data.results as RawgGame[]).map((game) => ({
      id: game.id,
      title: game.name,
      cover_url: game.background_image,
      year: game.released ? game.released.split('-')[0] : '',
      platforms: game.platforms?.map((p) => p.platform.name) || [],
    }))
  } catch (error) {
    console.error('RAWG Search Error:', error)
    return []
  }
}
