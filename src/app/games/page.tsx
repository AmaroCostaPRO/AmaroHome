import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getGames } from './actions'
import { PageTransition } from '@/components/layout/page-transition'
import { GamesTabContent } from '@/components/games/games-tab-content'
import { AddGameDialog } from '@/components/games/add-game-dialog'

/* ── Página ───────────────────────────────────────────────────── */

export default async function GamesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const games = await getGames()

  return (
    <PageTransition>
      <div className="space-y-8 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-foreground tracking-tight">
              Minha Coleção
            </h2>
            <p className="text-muted">
              Gerencie sua biblioteca de jogos e acompanhe seu progresso
            </p>
          </div>

          <AddGameDialog />
        </div>

        {/* Tabs de Jogos */}
        <GamesTabContent games={games} />
      </div>
    </PageTransition>
  )
}
