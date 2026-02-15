'use client'

import { useTransition } from 'react'
import Image from 'next/image'
import { MoreHorizontal, Gamepad2, ListChecks, Trophy, Trash2 } from 'lucide-react'
import { DropdownMenu } from 'radix-ui'
import { updateGameStatus, deleteGame } from '@/app/games/actions'
import type { Game } from '@/app/games/actions'
import { GameDetailsModal } from './game-details-modal'

/* ── Status Config ────────────────────────────────────────────── */

const statusConfig = {
  playing: { label: 'Jogando', color: 'bg-emerald-500/80', textColor: 'text-emerald-400' },
  backlog: { label: 'Backlog', color: 'bg-amber-500/80', textColor: 'text-amber-400' },
  completed: { label: 'Finalizado', color: 'bg-blue-500/80', textColor: 'text-blue-400' },
  dropped: { label: 'Abandonado', color: 'bg-red-500/80', textColor: 'text-red-400' },
} as const

/* ── Game Card ────────────────────────────────────────────────── */

interface GameCardProps {
  game: Game
}

export function GameCard({ game }: GameCardProps) {
  const [isPending, startTransition] = useTransition()
  const config = statusConfig[game.status]

  function handleStatusChange(status: 'playing' | 'backlog' | 'completed') {
    startTransition(() => updateGameStatus(game.id, status))
  }

  function handleDelete() {
    startTransition(() => deleteGame(game.id))
  }

  return (
    <div className="group relative glass-card overflow-hidden aspect-3/4 border-0">
      {/* Imagem de capa ou Fallback */}
      {game.cover_url ? (
        <Image
          src={game.cover_url}
          alt={game.title}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
      ) : (
        <div className="absolute inset-0 bg-linear-to-br from-indigo-900/50 via-purple-900/50 to-background flex items-center justify-center p-4">
          <Gamepad2 className="w-12 h-12 text-white/10" />
        </div>
      )}

      {/* Overlay gradiente para legibilidade do texto */}
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300 pointer-events-none" />

      {/* Trigger para Modal de Detalhes (Imagem/Card inteiro clicável, exceto controles) */}
      <GameDetailsModal game={game}>
        <div className="absolute inset-0 z-0 cursor-pointer" />
      </GameDetailsModal>

      {/* Badge de status (Top Left) */}
      <div className="absolute top-2 left-2 z-10">
        <span className={`inline-flex items-center text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-sm ${config.color} text-white shadow-lg`}>
          {config.label}
        </span>
      </div>

      {/* Dropdown Menu (Top Right) */}
      <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              className="p-1.5 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-colors cursor-pointer border border-white/10"
              aria-label="Opções do jogo"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              sideOffset={4}
              align="end"
              className="z-50 min-w-[180px] rounded-md bg-elevated border border-glass-border p-1.5 shadow-(--shadow-lg) backdrop-blur-xl animate-scale-in"
            >
              {game.status !== 'playing' && (
                <DropdownMenu.Item
                  onSelect={() => handleStatusChange('playing')}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-secondary rounded-sm hover:bg-white/5 hover:text-foreground cursor-pointer outline-none transition-colors"
                >
                  <Gamepad2 className="w-4 h-4 text-emerald-400" />
                  Mover para Jogando
                </DropdownMenu.Item>
              )}
              {game.status !== 'backlog' && (
                <DropdownMenu.Item
                  onSelect={() => handleStatusChange('backlog')}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-secondary rounded-sm hover:bg-white/5 hover:text-foreground cursor-pointer outline-none transition-colors"
                >
                  <ListChecks className="w-4 h-4 text-amber-400" />
                  Mover para Backlog
                </DropdownMenu.Item>
              )}
              {game.status !== 'completed' && (
                <DropdownMenu.Item
                  onSelect={() => handleStatusChange('completed')}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-secondary rounded-sm hover:bg-white/5 hover:text-foreground cursor-pointer outline-none transition-colors"
                >
                  <Trophy className="w-4 h-4 text-blue-400" />
                  Marcar como Finalizado
                </DropdownMenu.Item>
              )}

              <DropdownMenu.Separator className="my-1.5 h-px bg-glass-border" />

              <DropdownMenu.Item
                onSelect={handleDelete}
                className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 rounded-sm hover:bg-red-500/10 cursor-pointer outline-none transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Excluir
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>

      {/* Footer Info (Glassmorphism) */}
      <div className="absolute bottom-0 inset-x-0 p-3 bg-slate-900/60 backdrop-blur-md border-t border-white/10 transition-transform duration-300 translate-y-0">
        <h3 className="text-sm font-bold text-white leading-tight line-clamp-2 drop-shadow-md">
          {game.title}
        </h3>
        {game.platform && (
          <p className="text-[10px] text-white/70 mt-1 font-medium">{game.platform}</p>
        )}
      </div>

      {/* Overlay de loading */}
      {isPending && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}
