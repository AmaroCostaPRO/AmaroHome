'use client'

import { useEffect, useState, useTransition } from 'react'
import Image from 'next/image'
import { 
  Dialog, 
  DialogContent, 
  DialogTitle,
  DialogDescription,
  DialogHeader 
} from '@/components/ui/dialog'
import { Calendar, Building, Info, ThumbsUp, ThumbsDown, Minus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useDebounce } from '@/hooks/use-debounce'
import { getRAWGGameDetails, updateGameStats, type Game, type RawgGameDetails } from '@/app/games/actions'

interface GameDetailsModalProps {
  game: Game
  children: React.ReactNode
}

export function GameDetailsModal({ game, children }: GameDetailsModalProps) {
  const [open, setOpen] = useState(false)
  const [details, setDetails] = useState<RawgGameDetails | null>(null)
  
  // Personal inputs
  const [hours, setHours] = useState<string>(game.playtime_hours?.toString() || '')
  const [rating, setRating] = useState<string>(game.personal_rating || '')
  
  const debouncedHours = useDebounce(hours, 1000)
  const [isPending, startTransition] = useTransition()

  // Fetch RAWG Details on Open
  useEffect(() => {
    let mounted = true
    if (open && game.rawg_id && !details) {
      getRAWGGameDetails(game.rawg_id)
        .then(data => {
          if (mounted) setDetails(data)
        })
        .catch(console.error)
    }
    return () => { mounted = false }
  }, [open, game.rawg_id, details])

  // Auto-save Hours
  useEffect(() => {
    const numHours = parseFloat(debouncedHours)
    if (debouncedHours !== (game.playtime_hours?.toString() || '') && !isNaN(numHours)) {
      startTransition(() => {
        updateGameStats(game.id, { playtime_hours: numHours })
      })
    }
  }, [debouncedHours, game.id, game.playtime_hours])

  // Auto-save Rating
  const handleRatingChange = (value: string) => {
    setRating(value)
    if (value) {
      startTransition(() => {
        updateGameStats(game.id, { personal_rating: value as 'like' | 'neutral' | 'dislike' })
      })
    }
  }

  // Format Date
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'Data desconhecida'
    return new Date(dateString).toLocaleDateString('pt-BR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    })
  }

  const isMissingData = !game.rawg_id

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div onClick={() => setOpen(true)} className="cursor-pointer">
        {children}
      </div>
      
      <DialogContent className="max-w-4xl p-0 gap-0 overflow-hidden bg-slate-950/95 border-white/10 backdrop-blur-xl shadow-2xl min-h-[500px] flex flex-col">
        {isMissingData && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm p-6 text-center">
             <Info className="w-12 h-12 text-yellow-500 mb-4" />
             <h3 className="text-xl font-bold mb-2">Dados não disponíveis</h3>
             <p className="text-muted-foreground max-w-md  mb-6">
               Este jogo foi adicionado antes da integração com a RAWG ou sem um ID válido. 
               Por favor, remova e adicione o jogo novamente para ver os detalhes completos.
             </p>
             <button 
               className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium"
               onClick={() => setOpen(false)}
             >
               Fechar
             </button>
          </div>
        )}
        
        <DialogHeader className="sr-only">
            <DialogTitle>{game.title}</DialogTitle>
            <DialogDescription>Detalhes do jogo</DialogDescription>
        </DialogHeader>

        <div className="relative h-64 w-full">
          {(details?.background_image || game.cover_url) ? (
            <Image
              src={details?.background_image || game.cover_url || ''}
              alt={game.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
             <div className="w-full h-full bg-slate-900" />
          )}
          {/* Stronger Overlay Gradient */}
          <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/80 to-transparent" />
          
          <div className="absolute bottom-6 left-6 right-6">
            <h2 className="text-4xl font-bold text-white drop-shadow-lg mb-3 tracking-tight">{game.title}</h2>
            
            <div className="flex flex-wrap gap-3 items-center text-sm text-white/90">
              {details?.developers?.[0] && (
                <div className="flex items-center gap-1.5 bg-slate-950/40 border border-white/10 px-2.5 py-1 rounded-md backdrop-blur-md shadow-sm">
                  <Building className="w-4 h-4 text-violet-400" />
                  <span className="font-medium">{details.developers[0].name}</span>
                </div>
              )}
              
              <div className="flex items-center gap-1.5 bg-slate-950/40 border border-white/10 px-2.5 py-1 rounded-md backdrop-blur-md shadow-sm">
                <Calendar className="w-4 h-4 text-violet-400" />
                <span className="font-medium">{formatDate(details?.released || game.metadata?.release_date as string)}</span>
              </div>

              {details?.genres?.slice(0, 3).map(g => (
                <span key={g.name} className="px-3 py-0.5 rounded-full bg-slate-950/60 backdrop-blur-md border border-indigo-500/30 text-indigo-200 font-medium text-xs shadow-lg">
                  {g.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-8 p-6 lg:p-8">
          
          {/* Left: About */}
          <div className="space-y-6">
            <div className="prose prose-invert max-w-none">
              <h3 className="text-lg font-semibold text-white/90 flex items-center gap-2 mb-3">
                <Info className="w-5 h-5 text-violet-400" />
                Sobre
              </h3>
              {!details ? (
                <div className="space-y-2 animate-pulse">
                  <div className="h-4 bg-white/5 rounded w-full" />
                  <div className="h-4 bg-white/5 rounded w-5/6" />
                  <div className="h-4 bg-white/5 rounded w-4/6" />
                </div>
              ) : (
                <div className="text-muted-foreground text-sm leading-relaxed max-h-[300px] overflow-y-auto custom-scrollbar pr-2 whitespace-pre-line">
                  {details?.description_raw || "Sem descrição disponível."}
                </div>
              )}
            </div>
          </div>

          {/* Right: Personal Tracking */}
          <div className="flex flex-col gap-6 p-5 rounded-xl bg-white/5 border border-white/5 h-fit">
            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-2">
              Seu Progresso
            </h3>

            {/* Hours Played */}
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground font-medium ml-1">
                Horas Jogadas
              </label>
              <div className="relative">
                <Input
                  type="number"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  className="bg-black/20 border-white/10 text-lg font-mono text-center focus:border-accent/50 h-12"
                  placeholder="0"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">
                  HRS
                </span>
              </div>
            </div>

            <div className="w-full h-px bg-white/10" />

            {/* Rating */}
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground font-medium ml-1">
                Sua Avaliação
              </label>
              <ToggleGroup type="single" value={rating} onValueChange={handleRatingChange} className="justify-between w-full">
                <ToggleGroupItem 
                  value="like" 
                  aria-label="Gostei"
                  className="w-full hover:bg-white/5 transition-all data-[state=on]:bg-emerald-500/10 data-[state=on]:text-emerald-400 data-[state=on]:drop-shadow-[0_0_8px_rgba(52,211,153,0.5)] group"
                >
                  <ThumbsUp className="w-5 h-5 group-hover:text-emerald-400/80 transition-colors" />
                </ToggleGroupItem>
                
                <ToggleGroupItem 
                  value="neutral" 
                  aria-label="Neutro"
                  className="w-full hover:bg-white/5 transition-all data-[state=on]:bg-white/10 data-[state=on]:text-white group"
                >
                  <Minus className="w-5 h-5 group-hover:text-white/80 transition-colors" />
                </ToggleGroupItem>
                
                <ToggleGroupItem 
                  value="dislike" 
                  aria-label="Não gostei"
                  className="w-full hover:bg-white/5 transition-all data-[state=on]:bg-red-500/10 data-[state=on]:text-red-400 data-[state=on]:drop-shadow-[0_0_8px_rgba(248,113,113,0.5)] group"
                >
                  <ThumbsDown className="w-5 h-5 group-hover:text-red-400/80 transition-colors" />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            
             {/* Sync Status */}
            <div className="flex justify-end pt-2">
               {isPending ? (
                 <span className="text-[10px] text-accent animate-pulse">Salvando...</span>
               ) : (
                 <span className="text-[10px] text-muted-foreground/50">Sincronizado</span>
               )}
            </div>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
