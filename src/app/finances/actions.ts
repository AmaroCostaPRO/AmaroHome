'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

/* ── Tipos ────────────────────────────────────────────────────── */

export interface Transaction {
  id: string
  title: string
  amount: number
  type: 'income' | 'expense'
  category: string
  date: string
  user_id: string
}

export interface MonthlySummary {
  income: number
  expense: number
  balance: number
  transactions: Transaction[]
}

/* ── Adicionar Transação ──────────────────────────────────────── */

export async function addTransaction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Não autenticado')

  const title = formData.get('title') as string
  const rawAmount = formData.get('amount') as string
  const type = formData.get('type') as 'income' | 'expense'
  const category = formData.get('category') as string
  const date = formData.get('date') as string

  // Converte "1.234,56" (pt-BR) ou "1234.56" para number
  const normalized = rawAmount.replace(/\./g, '').replace(',', '.')
  const amount = parseFloat(normalized)

  if (!title || isNaN(amount) || !type || !category || !date) {
    throw new Error('Campos obrigatórios faltando ou inválidos')
  }

  const { error } = await supabase.from('finances').insert({
    title,
    amount,
    type,
    category,
    date,
    user_id: user.id,
  })

  if (error) throw new Error(error.message)

  revalidatePath('/finances')
}

/* ── Remover Transação ────────────────────────────────────────── */

export async function deleteTransaction(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Não autenticado')

  const { error } = await supabase
    .from('finances')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id) // Segurança: só o dono pode deletar

  if (error) throw new Error(error.message)

  revalidatePath('/finances')
}

/* ── Resumo Mensal ────────────────────────────────────────────── */

export async function getMonthlySummary(
  year: number,
  month: number
): Promise<MonthlySummary> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Não autenticado')

  // Primeiro e último dia do mês (formato YYYY-MM-DD)
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`
  const lastDay = new Date(year, month, 0).getDate()
  const endDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`

  const { data, error } = await supabase
    .from('finances')
    .select('*')
    .eq('user_id', user.id)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: false })

  if (error) throw new Error(error.message)

  const transactions = (data ?? []) as Transaction[]

  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const expense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  return {
    income,
    expense,
    balance: income - expense,
    transactions,
  }
}
