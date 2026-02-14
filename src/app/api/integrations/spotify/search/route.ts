import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// ── Token Cache ──────────────────────────────────────────────────

let cachedToken: string | null = null
let tokenExpiresAt = 0

/**
 * Obtém um access token do Spotify usando Client Credentials flow.
 * Cache em memória com TTL para evitar re-autenticação a cada request.
 */
async function getSpotifyToken(): Promise<string> {
  const now = Date.now()

  if (cachedToken && now < tokenExpiresAt) {
    return cachedToken
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID!
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  if (!response.ok) {
    throw new Error(`Spotify auth failed: ${response.status}`)
  }

  const data = await response.json()
  cachedToken = data.access_token
  // Expirar 60s antes do real para margem de segurança
  tokenExpiresAt = now + (data.expires_in - 60) * 1000

  return cachedToken!
}

// ── Route Handler ────────────────────────────────────────────────

/**
 * GET /api/integrations/spotify/search
 * Proxy server-side para busca na API do Spotify.
 *
 * Query params:
 * - q: termo de busca (obrigatório)
 * - type: track | playlist | artist | album (default: track)
 * - limit: 1-50 (default: 20)
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')
  const type = searchParams.get('type') || 'track'
  const limit = Math.min(Number(searchParams.get('limit') || '20'), 50)

  if (!q) {
    return NextResponse.json(
      { error: 'Parâmetro "q" é obrigatório' },
      { status: 400 }
    )
  }

  try {
    const token = await getSpotifyToken()

    const spotifyUrl = new URL('https://api.spotify.com/v1/search')
    spotifyUrl.searchParams.set('q', q)
    spotifyUrl.searchParams.set('type', type)
    spotifyUrl.searchParams.set('limit', String(limit))
    spotifyUrl.searchParams.set('market', 'BR')

    const response = await fetch(spotifyUrl.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorBody = await response.text()
      console.error('[Spotify] API error:', response.status, errorBody)
      return NextResponse.json(
        { error: 'Erro na API do Spotify' },
        { status: response.status }
      )
    }

    const data = await response.json()

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('[API] Erro na busca Spotify:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar no Spotify' },
      { status: 500 }
    )
  }
}
