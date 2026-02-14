'use client'

import { useState } from 'react'
import { Tabs } from 'radix-ui'
import { motion, AnimatePresence } from 'framer-motion'
import { Gamepad2, ListChecks, Trophy, Ghost } from 'lucide-react'
import { GameCard } from './game-card'
import type { Game } from '@/app/games/actions'

/* ── Tabs Config ──────────────────────────────────────────────── */

const tabs = [
  {
    value: 'playing',
    label: 'Jogando Agora',
    icon: Gamepad2,
    emptyIcon: Gamepad2,
    emptyTitle: 'Nenhum jogo em andamento',
    emptyDesc: 'Adicione um jogo e comece a jogar!',
    accentColor: 'text-emerald-400',
  },
  {
    value: 'backlog',
    label: 'Backlog',
    icon: ListChecks,
    emptyIcon: Ghost,
    emptyTitle: 'Backlog vazio',
    emptyDesc: 'Sua fila de espera está limpa. Hora de adicionar novos títulos!',
    accentColor: 'text-amber-400',
  },
  {
    value: 'completed',
    label: 'Finalizados',
    icon: Trophy,
    emptyIcon: Trophy,
    emptyTitle: 'Nenhum jogo finalizado ainda',
    emptyDesc: 'Complete seus jogos e eles aparecerão aqui no Hall da Fama.',
    accentColor: 'text-blue-400',
  },
] as const

/* ── Componente ───────────────────────────────────────────────── */

interface GamesTabContentProps {
  games: Game[]
}

export function GamesTabContent({ games }: GamesTabContentProps) {
  const [activeTab, setActiveTab] = useState<string>('playing')

  function getFilteredGames(status: string) {
    return games.filter((g) => g.status === status)
  }

  return (
    <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
      {/* Lista de Tabs */}
      <Tabs.List className="flex gap-1 p-1 glass-panel w-fit mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.value
          return (
            <Tabs.Trigger
              key={tab.value}
              value={tab.value}
              className={`
                relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-md
                transition-all duration-300 cursor-pointer outline-none
                ${isActive
                  ? 'text-foreground bg-white/8 shadow-(--shadow-sm)'
                  : 'text-muted hover:text-secondary hover:bg-white/3'
                }
              `}
            >
              <Icon className={`w-4 h-4 ${isActive ? tab.accentColor : ''}`} />
              <span className="hidden sm:inline">{tab.label}</span>

              {/* Contagem */}
              <span className={`
                ml-1 text-xs px-1.5 py-0.5 rounded-full
                ${isActive ? 'bg-white/10 text-foreground' : 'bg-white/3 text-muted'}
              `}>
                {getFilteredGames(tab.value).length}
              </span>
            </Tabs.Trigger>
          )
        })}
      </Tabs.List>

      {/* Conteúdo das Tabs */}
      <AnimatePresence mode="wait">
        {tabs.map((tab) => {
          if (activeTab !== tab.value) return null
          const filtered = getFilteredGames(tab.value)
          const EmptyIcon = tab.emptyIcon

          return (
            <Tabs.Content key={tab.value} value={tab.value} asChild forceMount>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              >
                {filtered.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {filtered.map((game) => (
                      <GameCard key={game.id} game={game} />
                    ))}
                  </div>
                ) : (
                  /* Empty State */
                  <div className="flex flex-col items-center justify-center py-20 glass-panel">
                    <div className="p-4 rounded-full bg-white/3 mb-4">
                      <EmptyIcon className={`w-8 h-8 ${tab.accentColor} opacity-60`} />
                    </div>
                    <h3 className="text-base font-semibold text-secondary mb-1">
                      {tab.emptyTitle}
                    </h3>
                    <p className="text-sm text-muted text-center max-w-xs">
                      {tab.emptyDesc}
                    </p>
                  </div>
                )}
              </motion.div>
            </Tabs.Content>
          )
        })}
      </AnimatePresence>
    </Tabs.Root>
  )
}
