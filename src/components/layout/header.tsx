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
    <header className="sticky top-0 z-30 flex items-center justify-between h-20 px-8 transition-all duration-300">
      {/* Page Title */}
      <div className="flex items-center gap-4">
        {/* Mobile logo (hidden on desktop since sidebar shows it) */}
        <div className="lg:hidden w-10 h-10 rounded-xl bg-accent flex items-center justify-center shadow-[0_0_15px_var(--accent-glow)]">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-md">
            {title}
          </h1>
          <p className="text-sm text-gray-400 font-medium tracking-wide">Bem-vindo de volta, Amaro</p>
        </div>
      </div>

      {/* User Avatar & Actions */}
      <div className="flex items-center gap-4">
        {/* Hire Me / Action Button Concept */}
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 backdrop-blur-md">
           <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399] animate-pulse" />
           <span className="text-xs font-semibold text-white/80 uppercase tracking-widest">Online</span>
        </div>

        <div className="w-10 h-10 rounded-full bg-linear-to-tr from-violet-600 to-cyan-500 p-[2px] shadow-[0_0_20px_rgba(124,58,237,0.4)] cursor-pointer hover:scale-105 transition-transform duration-300">
           <div className="w-full h-full rounded-full bg-[#0b0c15] flex items-center justify-center border border-white/10">
              <span className="text-sm font-bold text-white">A</span>
           </div>
        </div>
      </div>
    </header>
  )
}
