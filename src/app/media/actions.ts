'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

/* ── Tipos ────────────────────────────────────────────────────── */

export type MediaPlatform = 'youtube' | 'spotify'

export interface MediaItem {
  id: string
  user_id: string
  title: string
  description: string | null
  cover_url: string | null
  external_url: string
  platform: MediaPlatform
  created_at: string
  updated_at: string
}

/* ── Buscar Todos ─────────────────────────────────────────────── */

export async function getMedia(): Promise<MediaItem[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Não autenticado')

  const { data, error } = await supabase
    .from('media_library')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)

  return (data ?? []) as MediaItem[]
}

/* ── Salvar Item ──────────────────────────────────────────────── */

export async function saveMedia(payload: {
  title: string
  description?: string
  cover_url?: string
  external_url: string
  platform: MediaPlatform
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
