import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Auth Callback — troca o code PKCE por uma sessão válida.
 * URL esperada: /auth/callback?code=xxx
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Se falhou, redirecionar para login com erro
  return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent('Não foi possível autenticar. Tente novamente.')}`)
}
