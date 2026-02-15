import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Gamepad2 } from 'lucide-react'

interface Game {
  id: string
  title: string
  coverUrl: string | null
  status: string
}

export function GamesWidget({ games }: { games: Game[] }) {
  return (
    <div className="flex flex-col h-full">
      {games.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground space-y-2">
          <Gamepad2 className="w-8 h-8 opacity-20" />
          <p className="text-xs">Nenhum jogo recente</p>
        </div>
      ) : (
        <div className="flex-1 grid grid-cols-2 gap-3">
          {games.slice(0, 2).map((game) => (
            <Link
              key={game.id}
              href="/games"
              className="group relative aspect-3/4 rounded-lg overflow-hidden bg-slate-950 border border-white/5 shadow-md transition-transform hover:scale-105"
            >
              {game.coverUrl ? (
                <Image
                  src={game.coverUrl}
                  alt={game.title}
                  fill
                  className="object-cover transition-opacity group-hover:opacity-80"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-800">
                  <Gamepad2 className="w-8 h-8 text-slate-600" />
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/90 to-transparent p-2 pt-8">
                <p className="text-[10px] font-medium text-white line-clamp-1">{game.title}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <Link
        href="/games"
        className="mt-4 flex items-center justify-end text-xs font-medium text-muted-foreground hover:text-violet-400 transition-colors group"
      >
        <span>Biblioteca</span>
        <ArrowRight className="w-3 h-3 ml-1 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  )
}
