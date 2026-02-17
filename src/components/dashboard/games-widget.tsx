'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Gamepad2 } from 'lucide-react'
import { useBentoGrid } from './bento-grid'

interface Game {
  id: string
  title: string
  coverUrl: string | null
  status: string
}

export function GamesWidget({ games }: { games: Game[] }) {
  const { expandedId } = useBentoGrid()
  const isExpanded = expandedId === 'games'

  return (
    <div className="flex flex-col h-full relative">
      {!games || games.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-500 space-y-3">
          <Gamepad2 className="w-10 h-10 opacity-20" />
          <p className="text-xs font-medium">Nenhum jogo recente</p>
        </div>
      ) : (
        <div className={`flex-1 grid gap-4 ${isExpanded ? 'grid-cols-4' : 'grid-cols-2'}`}>
          {games.slice(0, isExpanded ? 4 : 2).map((game) => (
            <Link
              key={game.id}
              href="/games"
              className="group relative aspect-3/4 rounded-xl overflow-hidden bg-slate-950 border border-white/5 shadow-lg transition-transform hover:scale-[1.02] hover:shadow-indigo-500/20"
            >
              {game.coverUrl ? (
                <Image
                  src={game.coverUrl}
                  alt={game.title}
                  fill
                  className="object-cover transition-opacity duration-500 group-hover:opacity-100 opacity-90"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-900">
                  <Gamepad2 className="w-8 h-8 text-slate-700" />
                </div>
              )}
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
              <div className="absolute inset-x-0 bottom-0 p-3">
                <p className="text-xs font-medium text-white line-clamp-2 leading-tight drop-shadow-md group-hover:text-indigo-200 transition-colors">
                  {game.title}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className={`mt-4 flex items-center justify-end transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-80'}`}>
        <Link
          href="/games"
          className="flex items-center text-xs font-medium text-slate-500 hover:text-indigo-400 transition-colors group"
        >
          <span>Biblioteca</span>
          <ArrowRight className="w-3 h-3 ml-1 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  )
}
