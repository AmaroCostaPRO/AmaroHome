'use client'

import { useState, useEffect } from 'react'
import { useFormStatus } from 'react-dom'
import Image from 'next/image'
import { Plus, Loader2, Search, Gamepad2 } from 'lucide-react'
import { addGame, searchRAWGGames } from '@/app/games/actions'
import type { SearchGameResult } from '@/app/games/actions'
import { useDebounce } from '@/hooks/use-debounce'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

/* ── Submit Button com Loading ────────────────────────────────── */

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} className="w-full mt-2">
      {pending ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Salvando...
        </>
      ) : (
        'Adicionar Jogo'
      )}
    </Button>
  )
}

/* ── Plataformas ──────────────────────────────────────────────── */

const platforms = [
  'PC',
  'PlayStation 5',
  'PlayStation 4',
  'Xbox Series X|S',
  'Xbox One',
  'Nintendo Switch',
  'Mobile',
  'Steam Deck',
  'Outra',
]

/* ── Select styles (reutilizável) ─────────────────────────────── */

const selectClass =
  'flex h-10 w-full rounded-sm px-3 py-2 text-sm bg-white/3 border border-glass-border text-foreground transition-all duration-(--transition-fast) hover:border-(--glass-border-hover) focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/20 focus:bg-white/5 cursor-pointer appearance-none'

/* ── Componente Principal ─────────────────────────────────────── */

export function AddGameDialog() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<'search' | 'details'>('search')
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchGameResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedGame, setSelectedGame] = useState<SearchGameResult | null>(null)
  
  const debouncedQuery = useDebounce(query, 500)

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setStep('search')
        setQuery('')
        setResults([])
        setSelectedGame(null)
      }, 300)
    }
  }, [open])

  // Search Effect
  useEffect(() => {
    async function search() {
      if (debouncedQuery.length < 3) {
        setResults([])
        return
      }

      setIsSearching(true)
      try {
        const games = await searchRAWGGames(debouncedQuery)
        setResults(games)
      } catch (error) {
        console.error(error)
      } finally {
        setIsSearching(false)
      }
    }

    search()
  }, [debouncedQuery])

  function handleSelectGame(game: SearchGameResult) {
    setSelectedGame(game)
    setStep('details')
  }

  async function handleAction(formData: FormData) {
    await addGame(formData)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4" />
          Adicionar Jogo
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md gap-0 p-0 overflow-hidden bg-elevated border-glass-border">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-white/5">
          <DialogTitle className="text-xl">
            {step === 'search' ? 'Novo Jogo' : 'Confirmar Detalhes'}
          </DialogTitle>
          <DialogDescription>
            {step === 'search' 
              ? 'Busque o jogo que deseja adicionar à sua coleção.' 
              : 'Preencha as informações adicionais.'}
          </DialogDescription>
        </div>

        <div className="p-6 pt-4">
          {step === 'search' ? (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <Input
                  placeholder="Buscar jogo..."
                  className="pl-9 bg-background/50 border-white/10 focus-visible:ring-accent/20"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus
                />
                {isSearching && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-accent" />
                )}
              </div>

              <div className="min-h-[300px] max-h-[400px] overflow-y-auto pr-1 -mr-1 custom-scrollbar">
                {results.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {results.map((game) => (
                      <button
                        key={game.id}
                        onClick={() => handleSelectGame(game)}
                        className="group relative flex flex-col text-left rounded-lg overflow-hidden border border-white/5 hover:border-accent/50 transition-all bg-background/30 hover:bg-background/50"
                      >
                        <div className="relative aspect-video w-full bg-black/20">
                          {game.cover_url ? (
                            <Image 
                              src={game.cover_url} 
                              alt={game.title}
                              fill
                              sizes="(max-width: 768px) 50vw, 33vw"
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted">
                              <Gamepad2 className="w-8 h-8 opacity-20" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent" />
                          <div className="absolute bottom-2 left-2 right-2">
                            <p className="text-xs font-medium text-white line-clamp-1">{game.title}</p>
                            <p className="text-[10px] text-white/60">{game.year}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-muted gap-2 py-12">
                    {query.length > 0 ? (
                      <p>Nenhum jogo encontrado.</p>
                    ) : (
                      <>
                        <Gamepad2 className="w-12 h-12 opacity-10" />
                        <p className="text-sm">Digite para buscar...</p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <form action={handleAction} className="flex flex-col gap-4">
              <input type="hidden" name="cover_url" value={selectedGame?.cover_url || ''} />
              
              <div className="flex gap-4 items-start">
                <div className="relative w-24 aspect-3/4 rounded-md overflow-hidden shrink-0 border border-white/10 shadow-lg">
                  {selectedGame?.cover_url && (
                    <Image 
                      src={selectedGame.cover_url} 
                      alt={selectedGame.title}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="game-title" className="text-sm font-medium text-secondary">
                      Título
                    </label>
                    <Input
                      id="game-title"
                      name="title"
                      defaultValue={selectedGame?.title}
                      readOnly
                      className="bg-white/5 border-white/5"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="game-status" className="text-sm font-medium text-secondary">
                      Status
                    </label>
                    <select
                      id="game-status"
                      name="status"
                      defaultValue="backlog"
                      className={selectClass}
                    >
                      <option value="backlog" className="bg-elevated">Backlog</option>
                      <option value="playing" className="bg-elevated">Jogando</option>
                      <option value="completed" className="bg-elevated">Finalizado</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="game-platform" className="text-sm font-medium text-secondary">
                  Plataforma Principal
                </label>
                <select
                  id="game-platform"
                  name="platform"
                  className={selectClass}
                >
                  <option value="" className="bg-elevated text-muted">Selecione...</option>
                  {platforms.map(p => (
                     <option key={p} value={p} className="bg-elevated">{p}</option>
                  ))}
                </select>
                {selectedGame?.platforms && selectedGame.platforms.length > 0 && (
                  <p className="text-xs text-muted">
                    Disponível em: {selectedGame.platforms.slice(0, 3).join(', ')}...
                  </p>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full bg-transparent border-white/10 hover:bg-white/5"
                  onClick={() => setStep('search')}
                >
                  Voltar
                </Button>
                <SubmitButton />
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

