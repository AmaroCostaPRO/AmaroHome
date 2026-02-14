'use client'

import { usePathname } from 'next/navigation'
import { Sparkles } from 'lucide-react'

/* ── Label Map ─────────────────────────────────────────────────── */

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/finances': 'Finanças',
  '/media': 'Media',
  '/games': 'Games',
  '/notes': 'Notas',
  '/ebooks': 'eBooks',
  '/ai': 'Assistente IA',
}

/* ── Header Component ──────────────────────────────────────────── */

export function Header() {
  const pathname = usePathname()
  const title = pageTitles[pathname] || 'Hub Pessoal'

  return (
    <header className="glass-header sticky top-0 z-30 flex items-center justify-between h-16 px-6">
      {/* Page Title */}
      <div className="flex items-center gap-3">
        {/* Mobile logo (hidden on desktop since sidebar shows it) */}
        <div className="lg:hidden w-8 h-8 rounded-sm bg-accent flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <h1 className="text-lg font-semibold text-foreground tracking-tight">
          {title}
        </h1>
      </div>

      {/* User Avatar Placeholder */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-white/6 border border-glass-border flex items-center justify-center text-xs font-medium text-secondary cursor-pointer hover:border-(--glass-border-hover) transition-colors">
          U
        </div>
      </div>
    </header>
  )
}
