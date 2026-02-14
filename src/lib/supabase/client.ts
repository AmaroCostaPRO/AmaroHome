import { createBrowserClient } from '@supabase/ssr'

/**
 * Cliente Supabase para Client Components (browser).
 * Singleton automático — createBrowserClient reutiliza a mesma instância.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
