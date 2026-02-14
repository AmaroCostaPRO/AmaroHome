'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

/* ── Tipos ────────────────────────────────────────────────────── */

export interface Note {
  id: string
  user_id: string
  title: string
  content: string | null
  is_pinned: boolean
  created_at: string
  updated_at: string
  type: 'document' | 'board'
}

/* ── Buscar Notas ─────────────────────────────────────────────── */

export async function getNotes(): Promise<Note[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Não autenticado')

  const { data, error } = await supabase
    .from('notes')
    .select('id, user_id, title, content, is_pinned, created_at, updated_at, type')
    .eq('user_id', user.id)
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)

  return (data ?? []) as Note[]
}

/* ── Criar ou Atualizar Nota ──────────────────────────────────── */

export async function saveNote(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Não autenticado')

  const id = formData.get('id') as string | null
  const title = (formData.get('title') as string) || 'Sem título'
  const type = (formData.get('type') as 'document' | 'board') || 'document'
  // Content agora é JSON stringificado, mas mantemos como string no banco
  const content = (formData.get('content') as string) || ''

  if (id) {
    /* Atualizar */
    const { error } = await supabase
      .from('notes')
      .update({ title, content, type, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw new Error(error.message)
  } else {
    /* Criar */
    const { error } = await supabase.from('notes').insert({
      title,
      content,
      type,
      user_id: user.id,
    })

    if (error) throw new Error(error.message)
  }

  revalidatePath('/notes')
}

/* ── Remover Nota ─────────────────────────────────────────────── */

export async function deleteNote(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Não autenticado')

  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)

  revalidatePath('/notes')
}

/* ── Fixar / Desafixar Nota ───────────────────────────────────── */

export async function togglePin(id: string, currentStatus: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Não autenticado')

  const { error } = await supabase
    .from('notes')
    .update({ is_pinned: !currentStatus, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)

  revalidatePath('/notes')
}
