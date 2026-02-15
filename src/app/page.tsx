import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getSmartDashboardData } from '@/services/smart-dashboard'
import { PageTransition } from '@/components/layout/page-transition'
import { PageWrapper } from '@/components/layout/page-wrapper'
import { BentoGrid, BentoCard } from '@/components/dashboard/bento-grid'
import { WelcomeWidget } from '@/components/dashboard/welcome-widget'
import { CFOWidget } from '@/components/dashboard/cfo-widget'
import { NotesWidget } from '@/components/dashboard/notes-widget'
import { GamesWidget } from '@/components/dashboard/games-widget'
import { Wallet, BrainCircuit, Gamepad2 } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Parallel data fetching
  const data = await getSmartDashboardData(user.id)

  return (
    <PageTransition>
      <PageWrapper className="space-y-6">
        
        <BentoGrid>
          
          {/* 1. Widget de Boas-Vindas (Big Span) */}
          <BentoCard className="md:col-span-2 lg:col-span-2 row-span-1 min-h-[180px]">
            <WelcomeWidget userName={data.user.name} />
          </BentoCard>

          {/* 2. Widget CFO (Finanças) */}
          <BentoCard 
            title="Situação Financeira" 
            icon={<Wallet />}
            className="md:col-span-1 lg:col-span-1"
          >
            <CFOWidget data={data.finance} />
          </BentoCard>

          {/* 3. Widget Segundo Cérebro (Notas) */}
          <BentoCard 
            title="Segundo Cérebro" 
            icon={<BrainCircuit />}
            className="md:col-span-1 lg:col-span-1"
          >
            <NotesWidget notes={data.notes} />
          </BentoCard>

          {/* 4. Widget Media & Games (Jogos) - Agora na linha 2 se precisar, ou fluindo */}
          <BentoCard 
            title="Jogando Agora" 
            icon={<Gamepad2 />}
            className="md:col-span-1 lg:col-span-1"
          >
           <GamesWidget games={data.games} />
          </BentoCard>

          {/* Placeholder para Futuros Widgets (pode ser playlists, tarefas, etc) */}
           {/* <BentoCard className="hidden lg:block lg:col-span-1 bg-slate-900/20 border-dashed border-slate-700/50 flex items-center justify-center opacity-50">
            <span className="text-xs text-muted-foreground uppercase">Em breve</span>
           </BentoCard> */}

        </BentoGrid>

      </PageWrapper>
    </PageTransition>
  )
}
