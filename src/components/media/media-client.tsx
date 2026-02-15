'use client'

import { useState } from 'react'
import { ExternalLink, Library, Plus } from 'lucide-react'
import { MediaCard } from '@/components/media/media-card'
import { AddMediaDialog } from '@/components/media/add-media-dialog'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { usePlayer } from '@/contexts/player-context'
import type { MediaItem, Playlist } from '@/app/media/actions'

/* ── Helper: Extrair YouTube ID ───────────────────────────────── */

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

/* ── Componente Principal ─────────────────────────────────────── */

interface MediaClientProps {
  media: MediaItem[]
  playlists: Playlist[]
}

export function MediaClient({ media, playlists }: MediaClientProps) {
  const [playingYoutube, setPlayingYoutube] = useState<MediaItem | null>(null)
  const { playSpotify } = usePlayer()

  function handlePlay(item: MediaItem) {
    if (item.platform === 'youtube') {
      setPlayingYoutube(item)
    } else {
      playSpotify({
        id: item.id,
        title: item.title,
        description: item.description,
        external_url: item.external_url,
        cover_url: item.cover_url,
      })
    }
  }

  const ytVideoId = playingYoutube ? extractYouTubeId(playingYoutube.external_url) : null

  return (
    <>
      {/* Grid ou Empty State */}
      {media.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {media.map((item) => (
            <MediaCard key={item.id} item={item} onPlay={handlePlay} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 glass-panel">
          <div className="p-5 rounded-full bg-white/3 mb-5">
            <Library className="w-10 h-10 text-accent opacity-60" />
          </div>
          <h3 className="text-lg font-semibold text-secondary mb-2">
            Sua curadoria está vazia
          </h3>
          <p className="text-sm text-muted text-center max-w-xs mb-5">
            Adicione suas músicas favoritas do Spotify e vídeos do YouTube para montar sua biblioteca pessoal.
          </p>
          <AddMediaDialog playlists={playlists}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="w-4 h-4" />
                Adicionar primeiro item
              </Button>
            </DialogTrigger>
          </AddMediaDialog>
        </div>
      )}

      {/* ── YouTube Player Modal (local) ──────────────────── */}
      <Dialog
        open={!!playingYoutube}
        onOpenChange={(open) => { if (!open) setPlayingYoutube(null) }}
      >
        <DialogContent className="max-w-3xl p-0 gap-0 overflow-hidden">
          <DialogHeader className="p-4 pb-2">
            <DialogTitle className="line-clamp-1 text-base">
              {playingYoutube?.title}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Player de vídeo do YouTube
            </DialogDescription>
          </DialogHeader>

          {ytVideoId && (
            <div className="aspect-video w-full">
              <iframe
                src={`https://www.youtube.com/embed/${ytVideoId}?autoplay=1&rel=0`}
                title={playingYoutube?.title ?? 'YouTube Player'}
                className="w-full h-full"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          <div className="p-3 flex justify-end border-t border-glass-border">
            <Button
              variant="outline"
              onClick={() => window.open(playingYoutube?.external_url, '_blank', 'noopener,noreferrer')}
            >
              <ExternalLink className="w-4 h-4" />
              Ver no YouTube
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
