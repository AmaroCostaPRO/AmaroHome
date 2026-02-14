'use client'

import { createContext, useContext, useState, useCallback } from 'react'
import type { ReactNode } from 'react'

/* ── Tipos ────────────────────────────────────────────────────── */

export interface PlayerMedia {
  id: string
  title: string
  description: string | null
  external_url: string
  cover_url: string | null
}

interface PlayerContextValue {
  currentSpotifyMedia: PlayerMedia | null
  playSpotify: (media: PlayerMedia) => void
  closePlayer: () => void
}

/* ── Context ──────────────────────────────────────────────────── */

const PlayerContext = createContext<PlayerContextValue | null>(null)

/* ── Provider ─────────────────────────────────────────────────── */

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [currentSpotifyMedia, setCurrentSpotifyMedia] = useState<PlayerMedia | null>(null)

  const playSpotify = useCallback((media: PlayerMedia) => {
    setCurrentSpotifyMedia(media)
  }, [])

  const closePlayer = useCallback(() => {
    setCurrentSpotifyMedia(null)
  }, [])

  return (
    <PlayerContext.Provider value={{ currentSpotifyMedia, playSpotify, closePlayer }}>
      {children}
    </PlayerContext.Provider>
  )
}

/* ── Hook ─────────────────────────────────────────────────────── */

export function usePlayer(): PlayerContextValue {
  const ctx = useContext(PlayerContext)
  if (!ctx) {
    throw new Error('usePlayer deve ser usado dentro de <PlayerProvider>')
  }
  return ctx
}
