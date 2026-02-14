import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getDashboardData, type DashboardData, type RecentActivityItem } from '@/services/dashboard'
import { PageTransition } from '@/components/layout/page-transition'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Wallet,
  Music,
  Gamepad2,
  BookOpen,
  StickyNote,
  Sparkles,
  TrendingUp,
  Clock,
  type LucideIcon,
} from 'lucide-react'

/* ── Helpers ───────────────────────────────────────────────────── */

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

function getActivityIcon(type: RecentActivityItem['type']): LucideIcon {
  const icons: Record<RecentActivityItem['type'], LucideIcon> = {
    note: StickyNote,
    finance: Wallet,
    ebook: BookOpen,
  }
  return icons[type]
}

function getRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60_000)
  if (minutes < 1) return 'Agora'
  if (minutes < 60) return `${minutes} min atrás`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h atrás`
  const days = Math.floor(hours / 24)
  if (days === 1) return 'Ontem'
  return `${days}d atrás`
}

/* ── Quick Stats Config ────────────────────────────────────────── */

interface StatCardConfig {
  label: string
  getValue: (data: DashboardData) => string
  getChange: (data: DashboardData) => string
  icon: LucideIcon
  color: string
  bgColor: string
}

const statCards: StatCardConfig[] = [
  {
    label: 'Saldo do Mês',
    getValue: (d) => formatCurrency(d.monthBalance),
    getChange: () => 'mês corrente',
    icon: Wallet,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-400/10',
  },
  {
    label: 'Playlists',
    getValue: (d) => String(d.playlistCount),
    getChange: (d) => `${d.playlistCount} total`,
    icon: Music,
    color: 'text-violet-400',
    bgColor: 'bg-violet-400/10',
  },
  {
    label: 'Games na Biblioteca',
    getValue: (d) => String(d.gamesCount),
    getChange: () => 'jogando / backlog',
    icon: Gamepad2,
    color: 'text-amber-400',
    bgColor: 'bg-amber-400/10',
  },
  {
    label: 'eBooks',
    getValue: (d) => String(d.ebooksCount),
    getChange: (d) => `${d.ebooksCount} na estante`,
    icon: BookOpen,
    color: 'text-sky-400',
    bgColor: 'bg-sky-400/10',
  },
]

/* ── Dashboard Page (Server Component) ─────────────────────── */

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const data = await getDashboardData(user.id)

  return (
    <PageTransition>
      <div className="space-y-8 max-w-6xl">
        {/* Greeting Section */}
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            Bom dia! 👋
          </h2>
          <p className="text-muted">
            Aqui está um resumo do seu Hub Pessoal.
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {statCards.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="px-5 py-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {stat.getValue(data)}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted">
                      <TrendingUp className="w-3 h-3" />
                      <span>{stat.getChange(data)}</span>
                    </div>
                  </div>
                  <div className={`${stat.bgColor} p-2.5 rounded-sm`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Recent Activity */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted" />
                Atividade Recente
              </CardTitle>
              <CardDescription>As últimas ações no seu Hub</CardDescription>
            </CardHeader>
            <CardContent>
              {data.recentActivity.length === 0 ? (
                <p className="text-sm text-muted py-8 text-center">
                  Nenhuma atividade recente. Comece criando uma nota ou transação!
                </p>
              ) : (
                <div className="space-y-4">
                  {data.recentActivity.map((item) => {
                    const Icon = getActivityIcon(item.type)
                    return (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 py-2 group"
                      >
                        <div className="w-8 h-8 rounded-sm bg-white/4 flex items-center justify-center shrink-0 group-hover:bg-white/6 transition-colors">
                          <Icon className="w-4 h-4 text-muted" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-secondary truncate">
                            {item.title}
                          </p>
                        </div>
                        <span className="text-xs text-muted whitespace-nowrap">
                          {getRelativeTime(item.createdAt)}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
              <CardDescription>Acesso direto</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <Button variant="ghost" className="justify-start gap-3 h-11">
                  <Wallet className="w-4 h-4 text-emerald-400" />
                  <span>Nova Transação</span>
                </Button>
                <Button variant="ghost" className="justify-start gap-3 h-11">
                  <StickyNote className="w-4 h-4 text-amber-400" />
                  <span>Criar Nota</span>
                </Button>
                <Button variant="ghost" className="justify-start gap-3 h-11">
                  <BookOpen className="w-4 h-4 text-sky-400" />
                  <span>Sincronizar eBooks</span>
                </Button>
                <Button variant="ghost" className="justify-start gap-3 h-11">
                  <Sparkles className="w-4 h-4 text-violet-400" />
                  <span>Chat com IA</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  )
}
