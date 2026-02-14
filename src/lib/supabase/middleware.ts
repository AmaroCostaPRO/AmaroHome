import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Atualiza a sessão do Supabase no middleware do Next.js.
 *
 * Responsabilidades:
 * 1. Renova o token JWT via getClaims()
 * 2. Propaga cookies atualizados para Server Components (request.cookies)
 * 3. Propaga cookies atualizados para o browser (response.cookies)
 * 4. Redireciona para /login se o usuário não estiver autenticado
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANTE: Não inserir código entre createServerClient e getClaims().
  // Isso pode causar logout aleatório dos usuários.
  const { data } = await supabase.auth.getClaims()
  const user = data?.claims

  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/auth')
  ) {
    // Usuário não autenticado → redirecionar para login
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // IMPORTANTE: Sempre retornar supabaseResponse.
  // Se criar um NextResponse novo, copiar os cookies de supabaseResponse.
  return supabaseResponse
}
