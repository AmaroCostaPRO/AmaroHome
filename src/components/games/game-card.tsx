'use client'

import { useTransition } from 'react'
import Image from 'next/image'
import { MoreHorizontal, Gamepad2, ListChecks, Trophy, Trash2 } from 'lucide-react'
import { DropdownMenu } from 'radix-ui'
import { updateGameStatus, deleteGame } from '@/app/games/actions'
import type { Game } from '@/app/games/actions'

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
    <div className="group relative glass-card overflow-hidden" style={{ aspectRatio: '3/4' }}>
      {/* Imagem de capa ou Fallback gradiente */}
      {game.cover_url ? (
        <Image
          src={game.cover_url}
          alt={game.title}
          fill
          className="object-cover"
          unoptimized
        />
      ) : (
        <div className="absolute inset-0 bg-linear-to-br from-accent/20 via-surface to-elevated flex items-center justify-center p-4">
          <span className="text-sm font-semibold text-center text-secondary leading-tight">
            {game.title}
          </span>
        </div>
      )}

      {/* Overlay escuro no hover */}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Badge de status */}
      <div className="absolute bottom-2 left-2 z-10">
        <span className={`inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full ${config.color} text-white backdrop-blur-sm`}>
          {config.label}
        </span>
      </div>

      {/* Título no hover (quando tem capa) */}
      {game.cover_url && (
        <div className="absolute bottom-8 left-2 right-8 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <p className="text-xs font-semibold text-white drop-shadow-lg leading-tight line-clamp-2">
            {game.title}
          </p>
          {game.platform && (
            <p className="text-[10px] text-white/60 mt-0.5">{game.platform}</p>
          )}
        </div>
      )}

      {/* Overlay de loading */}
      {isPending && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {/* Dropdown Menu (3 pontos) */}
      <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              className="p-1.5 rounded-md bg-black/50 backdrop-blur-sm text-white/80 hover:text-white hover:bg-black/70 transition-colors cursor-pointer"
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
    </div>
  )
}
