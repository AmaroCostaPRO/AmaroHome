import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * Cliente Supabase com service_role key — bypass completo de RLS.
 * ⚠️ NUNCA expor no client-side. Usar apenas em Server Actions / Route Handlers.
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
