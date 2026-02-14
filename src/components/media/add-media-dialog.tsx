'use client'

import { useState, useRef, useTransition, useCallback } from 'react'
import { useFormStatus } from 'react-dom'
import { Search, Loader2, Plus, Music, Video, CheckCircle2 } from 'lucide-react'
import Image from 'next/image'
import { Tabs } from 'radix-ui'
import { saveMedia } from '@/app/media/actions'
import type { MediaPlatform } from '@/app/media/actions'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

/* ── Tipos de busca Spotify ───────────────────────────────────── */

interface SpotifyImage {
  url: string
  height: number
  width: number
}

interface SpotifyArtist {
  name: string
}

interface SpotifyTrack {
  id: string
  name: string
  artists: SpotifyArtist[]
  album: {
    name: string
    images: SpotifyImage[]
  }
  external_urls: { spotify: string }
}

interface SpotifySearchResponse {
  success: boolean
  data: {
    tracks: {
      items: SpotifyTrack[]
    }
  }
}

/* ── Tipos oEmbed YouTube ─────────────────────────────────────── */

interface YouTubeOEmbedResponse {
  title: string
  thumbnail_url: string
}

/* ── Extrair Video ID do URL do YouTube ───────────────────────── */

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

/* ── Submit Button (YouTube) ──────────────────────────────────── */

function YouTubeSubmitButton({ disabled }: { disabled?: boolean }) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending || disabled} className="w-full mt-2">
      {pending ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Salvando...
        </>
      ) : (
        <>
          <Plus className="w-4 h-4" />
          Guardar Vídeo
        </>
      )}
    </Button>
  )
}

/* ── Componente Principal ─────────────────────────────────────── */

interface AddMediaDialogProps {
  children: React.ReactNode
}

export function AddMediaDialog({ children }: AddMediaDialogProps) {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('spotify')

  /* Spotify state */
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SpotifyTrack[]>([])
  const [searching, setSearching] = useState(false)
  const [savingId, setSavingId] = useState<string | null>(null)

  /* YouTube state */
  const [ytUrl, setYtUrl] = useState('')
  const [ytTitle, setYtTitle] = useState('')
  const [ytThumbnail, setYtThumbnail] = useState('')
  const [isFetching, setIsFetching] = useState(false)
  const [ytDetected, setYtDetected] = useState(false)

  /* Refs */
  const ytFormRef = useRef<HTMLFormElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  /* Spotify: Buscar */
  async function handleSearch() {
    if (!query.trim()) return
    setSearching(true)
    setResults([])

    try {
      const res = await fetch(`/api/integrations/spotify/search?q=${encodeURIComponent(query)}&type=track&limit=10`)
      if (!res.ok) throw new Error('Erro na busca')
      const json = (await res.json()) as SpotifySearchResponse
      setResults(json.data.tracks.items)
    } catch {
      setResults([])
    } finally {
      setSearching(false)
    }
  }

  /* Spotify: Guardar */
  async function handleSaveTrack(track: SpotifyTrack) {
    setSavingId(track.id)
    try {
      await saveMedia({
        title: track.name,
        description: track.artists.map((a) => a.name).join(', '),
        cover_url: track.album.images[0]?.url ?? null,
        external_url: track.external_urls.spotify,
        platform: 'spotify' as MediaPlatform,
      })
    } finally {
      setSavingId(null)
    }
  }

  /* YouTube: Auto-fetch via oEmbed */
  const handleYouTubeFetch = useCallback(async (url: string) => {
    const trimmed = url.trim()
    if (!trimmed) return

    const videoId = extractYouTubeId(trimmed)
    if (!videoId) return

    setIsFetching(true)
    setYtDetected(false)

    try {
      const res = await fetch(
        `https://www.youtube.com/oembed?url=${encodeURIComponent(trimmed)}&format=json`
      )
      if (!res.ok) throw new Error('oEmbed failed')

      const data = (await res.json()) as YouTubeOEmbedResponse

      setYtTitle((prev) => (prev ? prev : data.title))
      /* Usar maxresdefault como fallback de melhor resolução */
      setYtThumbnail(`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`)
      setYtDetected(true)
    } catch {
      /* Fallback: usar hqdefault se oEmbed falhar */
      setYtThumbnail(`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`)
      setYtDetected(true)
    } finally {
      setIsFetching(false)
    }
  }, [])

  /* YouTube: Guardar */
  const [, startYtTransition] = useTransition()

  async function handleYouTubeAction(formData: FormData) {
    const title = (formData.get('title') as string)?.trim()
    const url = (formData.get('url') as string)?.trim()
    const thumbnail = (formData.get('thumbnail') as string)?.trim()

    if (!title || !url) return

    startYtTransition(async () => {
      await saveMedia({
        title,
        external_url: url,
        cover_url: thumbnail || undefined,
        platform: 'youtube',
      })
      ytFormRef.current?.reset()
      setYtUrl('')
      setYtTitle('')
      setYtThumbnail('')
      setYtDetected(false)
      closeRef.current?.click()
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children}

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Adicionar Media</DialogTitle>
          <DialogDescription>
            Salve músicas do Spotify ou vídeos do YouTube na sua curadoria.
          </DialogDescription>
        </DialogHeader>

        <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
          <Tabs.List className="flex gap-1 p-1 glass-panel w-full mb-4">
            <Tabs.Trigger
              value="spotify"
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 cursor-pointer outline-none ${
                activeTab === 'spotify'
                  ? 'bg-green-500/15 text-green-400 shadow-sm'
                  : 'text-muted hover:text-secondary'
              }`}
            >
              <Music className="w-4 h-4" />
              Spotify
            </Tabs.Trigger>
            <Tabs.Trigger
              value="youtube"
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 cursor-pointer outline-none ${
                activeTab === 'youtube'
                  ? 'bg-red-500/15 text-red-400 shadow-sm'
                  : 'text-muted hover:text-secondary'
              }`}
            >
              <Video className="w-4 h-4" />
              YouTube
            </Tabs.Trigger>
          </Tabs.List>

          {/* ── Aba Spotify ─────────────────────────────────── */}
          <Tabs.Content value="spotify" className="outline-none">
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Buscar música, artista..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSearch() } }}
                className="flex-1"
              />
              <Button type="button" onClick={handleSearch} disabled={searching}>
                {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              </Button>
            </div>

            {/* Resultados */}
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
              {results.map((track) => (
                <div
                  key={track.id}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-white/5 transition-colors"
                >
                  <div className="relative w-10 h-10 rounded-sm overflow-hidden shrink-0">
                    {track.album.images[0] ? (
                      <Image
                        src={track.album.images[0].url}
                        alt={track.album.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full bg-white/5 flex items-center justify-center">
                        <Music className="w-4 h-4 text-muted" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground line-clamp-1">{track.name}</p>
                    <p className="text-xs text-muted line-clamp-1">
                      {track.artists.map((a) => a.name).join(', ')}
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => handleSaveTrack(track)}
                    disabled={savingId === track.id}
                    className="shrink-0"
                  >
                    {savingId === track.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              ))}

              {results.length === 0 && !searching && query && (
                <p className="text-sm text-muted text-center py-4">
                  Nenhum resultado encontrado
                </p>
              )}
            </div>
          </Tabs.Content>

          {/* ── Aba YouTube ─────────────────────────────────── */}
          <Tabs.Content value="youtube" className="outline-none">
            <form ref={ytFormRef} action={handleYouTubeAction} className="flex flex-col gap-3">
              {/* URL do Vídeo */}
              <div className="space-y-1">
                <label htmlFor="yt-url" className="text-xs font-medium text-secondary">
                  URL do Vídeo *
                </label>
                <div className="relative">
                  <Input
                    id="yt-url"
                    name="url"
                    type="url"
                    placeholder="https://youtube.com/watch?v=..."
                    value={ytUrl}
                    onChange={(e) => setYtUrl(e.target.value)}
                    onBlur={(e) => handleYouTubeFetch(e.target.value)}
                    required
                  />
                  {isFetching && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Loader2 className="w-4 h-4 text-muted animate-spin" />
                    </div>
                  )}
                  {ytDetected && !isFetching && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                    </div>
                  )}
                </div>
              </div>

              {/* Título (auto-preenchido, editável) */}
              <div className="space-y-1">
                <label htmlFor="yt-title" className="text-xs font-medium text-secondary">
                  Título {ytDetected && <span className="text-green-400/70 text-[10px]">(auto-detectado)</span>}
                </label>
                <Input
                  id="yt-title"
                  name="title"
                  placeholder={isFetching ? 'Detectando título...' : 'Cole o URL acima para auto-preencher'}
                  value={ytTitle}
                  onChange={(e) => setYtTitle(e.target.value)}
                  required
                />
              </div>

              {/* Hidden input para thumbnail */}
              <input type="hidden" name="thumbnail" value={ytThumbnail} />

              {/* Preview da miniatura */}
              {ytThumbnail && (
                <div className="relative aspect-video rounded-lg overflow-hidden border border-glass-border">
                  <Image
                    src={ytThumbnail}
                    alt="Preview do vídeo"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-2 left-3 right-3">
                    <p className="text-xs text-white/80 line-clamp-1 drop-shadow-md">
                      {ytTitle || 'Vídeo detectado'}
                    </p>
                  </div>
                </div>
              )}

              <YouTubeSubmitButton disabled={!ytTitle || !ytUrl} />
            </form>
          </Tabs.Content>
        </Tabs.Root>

        <DialogClose ref={closeRef} className="hidden" />
      </DialogContent>
    </Dialog>
  )
}
