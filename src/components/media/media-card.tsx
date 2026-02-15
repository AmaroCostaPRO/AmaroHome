'use client'

import { useTransition } from 'react'
import Image from 'next/image'
import { Play, ExternalLink, Trash2 } from 'lucide-react'
import { deleteMedia } from '@/app/media/actions'
import type { MediaItem } from '@/app/media/actions'

/* ── Ícones de plataforma inline (SVG leve) ───────────────────── */

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.67 31.67 0 0 0 0 12a31.67 31.67 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.87.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.67 31.67 0 0 0 24 12a31.67 31.67 0 0 0-.5-5.81zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
    </svg>
  )
}

function SpotifyIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.52 17.34c-.24.36-.66.48-1.02.24-2.82-1.74-6.36-2.1-10.56-1.14-.42.12-.78-.18-.9-.54-.12-.42.18-.78.54-.9 4.56-1.02 8.52-.6 11.64 1.32.42.18.48.66.3 1.02zm1.44-3.3c-.3.42-.84.6-1.26.3-3.24-1.98-8.16-2.58-11.94-1.38-.48.12-.99-.12-1.11-.6-.12-.48.12-.99.6-1.11 4.38-1.32 9.78-.66 13.5 1.62.36.18.54.78.21 1.17zm.12-3.36C15.24 8.4 8.88 8.16 5.16 9.3c-.6.18-1.2-.18-1.38-.72-.18-.6.18-1.2.72-1.38 4.26-1.26 11.28-1.02 15.72 1.62.54.3.72 1.02.42 1.56-.3.42-.96.6-1.5.3z" />
    </svg>
  )
}

/* ── Media Card ───────────────────────────────────────────────── */

interface MediaCardProps {
  item: MediaItem
  onPlay: (item: MediaItem) => void
}

export function MediaCard({ item, onPlay }: MediaCardProps) {
  const [isPending, startTransition] = useTransition()
  const isYouTube = item.platform === 'youtube'

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation()
    startTransition(() => deleteMedia(item.id))
  }

  function handlePlay(e: React.MouseEvent) {
    e.stopPropagation()
    onPlay(item)
  }

  function handleExternal(e: React.MouseEvent) {
    e.stopPropagation()
    window.open(item.external_url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="group relative glass-card p-2 hover:bg-white/5">
      {/* Capa */}
      <div className={`relative overflow-hidden rounded-2xl ${isYouTube ? 'aspect-video' : 'aspect-square'}`}>
        {item.cover_url ? (
            <Image
            src={item.cover_url}
            alt={item.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-violet-900/40 via-surface to-black flex items-center justify-center">
            {isYouTube ? (
              <YouTubeIcon className="w-12 h-12 text-white/20 group-hover:text-red-500/80 transition-colors duration-500" />
            ) : (
              <SpotifyIcon className="w-12 h-12 text-white/20 group-hover:text-green-500/80 transition-colors duration-500" />
            )}
          </div>
        )}

        {/* Badge de plataforma (Glass Pill) */}
        <div className="absolute top-3 left-3 z-10">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-xs font-medium shadow-lg">
            {isYouTube ? (
              <>
                <YouTubeIcon className="w-3.5 h-3.5 text-red-500" />
                <span className="text-white/90">YouTube</span>
              </>
            ) : (
              <>
                <SpotifyIcon className="w-3.5 h-3.5 text-green-500" />
                <span className="text-white/90">Spotify</span>
              </>
            )}
          </div>
        </div>

        {/* Overlay hover com ações (Neon Glow) */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4 backdrop-blur-sm">
          {/* Play in-app */}
          <button
            type="button"
            onClick={handlePlay}
            className="p-4 rounded-full bg-white text-black hover:scale-110 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.4)] cursor-pointer"
            title="Reproduzir"
          >
            <Play className="w-6 h-6 fill-current" />
          </button>

          {/* Ações secundárias */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleExternal}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/10 backdrop-blur-md transition-all hover:scale-105 cursor-pointer"
              title="Abrir externamente"
            >
              <ExternalLink className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              className="p-2.5 rounded-full bg-white/10 hover:bg-red-500/20 text-white hover:text-red-400 border border-white/10 backdrop-blur-md transition-all hover:scale-105 disabled:opacity-50 cursor-pointer"
              title="Excluir"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="px-1 py-3 space-y-1">
        <h3 className="text-base font-bold text-white leading-tight line-clamp-1 group-hover:text-violet-300 transition-colors">{item.title}</h3>
        {item.description && (
          <p className="text-xs text-gray-400 line-clamp-1 font-medium">{item.description}</p>
        )}
      </div>
    </div>
  )
}
