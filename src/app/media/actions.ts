'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

/* ── Tipos ────────────────────────────────────────────────────── */

export type MediaPlatform = 'youtube' | 'spotify'

export interface Playlist {
  id: string
  user_id: string
  title: string
  description?: string | null
  icon?: string | null
  color?: string | null
  created_at: string
}

export interface MediaItem {
  id: string
  user_id: string
  title: string
  description: string | null
  cover_url: string | null
  external_url: string
  platform: MediaPlatform
  playlist_id?: string | null
  created_at: string
  updated_at: string
}

/* ── Buscar Todos ─────────────────────────────────────────────── */

export async function getMedia(playlistId?: string): Promise<MediaItem[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Não autenticado')

  let query = supabase
    .from('media_library')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (playlistId && playlistId !== 'all') {
    query = query.eq('playlist_id', playlistId)
  }

  const { data, error } = await query

  if (error) throw new Error(error.message)

  return (data ?? []) as MediaItem[]
}

/* ── Buscar Playlists ─────────────────────────────────────────── */

export async function getPlaylists(): Promise<Playlist[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Não autenticado')

  const { data, error } = await supabase
    .from('playlists')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })

  if (error) throw new Error(error.message)

  return (data ?? []) as Playlist[]
}

/* ── Criar Playlist ───────────────────────────────────────────── */

export async function createPlaylist(payload: {
  title: string
  icon?: string
  color?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Não autenticado')

  const { error } = await supabase.from('playlists').insert({
    user_id: user.id,
    title: payload.title,
    icon: payload.icon || null,
    color: payload.color || null,
  })

  if (error) throw new Error(error.message)

  revalidatePath('/media')
}

/* ── Deletar Playlist ─────────────────────────────────────────── */

export async function deletePlaylist(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Não autenticado')

  // Opcional: Impedir deleção se tiver itens, ou deixar o ON DELETE SET NULL do banco lidar
  const { error } = await supabase
    .from('playlists')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)

  revalidatePath('/media')
}

/* ── Salvar Item ──────────────────────────────────────────────── */

export async function saveMedia(payload: {
  title: string
  description?: string
  cover_url?: string
  external_url: string
  platform: MediaPlatform
  playlist_id?: string | null
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Não autenticado')

  const { error } = await supabase.from('media_library').insert({
    user_id: user.id,
    title: payload.title,
    description: payload.description || null,
    cover_url: payload.cover_url || null,
    external_url: payload.external_url,
    platform: payload.platform,
    playlist_id: payload.playlist_id || null, // Ensure explicit null if undefined
  })

  if (error) throw new Error(error.message)

  revalidatePath('/media')
}

/* ── Remover Item ─────────────────────────────────────────────── */

export async function deleteMedia(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Não autenticado')

  const { error } = await supabase
    .from('media_library')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)

  revalidatePath('/media')
}
