'use client'

import { X } from 'lucide-react'
import { usePlayer } from '@/contexts/player-context'

/* ── Helper: Extrair embed URL do Spotify ─────────────────────── */

function extractSpotifyEmbed(url: string): string | null {
  const match = url.match(/open\.spotify\.com\/(track|album|playlist)\/([a-zA-Z0-9]+)/)
  if (!match) return null
  return `https://open.spotify.com/embed/${match[1]}/${match[2]}?utm_source=generator&theme=0`
}

/* ── Componente ───────────────────────────────────────────────── */

export function GlobalSpotifyPlayer() {
  const { currentSpotifyMedia, closePlayer } = usePlayer()

  if (!currentSpotifyMedia) return null

  const embedUrl = extractSpotifyEmbed(currentSpotifyMedia.external_url)
  if (!embedUrl) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 shadow-2xl rounded-xl overflow-hidden glass-panel animate-in slide-in-from-right-4 fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-glass-border">
        <p className="text-xs font-medium text-secondary line-clamp-1 flex-1">
          {currentSpotifyMedia.title}
        </p>
        <button
          type="button"
          onClick={closePlayer}
          className="p-1 rounded-md hover:bg-white/10 text-muted hover:text-foreground transition-colors cursor-pointer shrink-0 ml-2"
          title="Fechar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Spotify Embed */}
      <iframe
        src={embedUrl}
        title={currentSpotifyMedia.title}
        className="w-full"
        height="152"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        style={{ border: 'none' }}
      />
    </div>
  )
}
