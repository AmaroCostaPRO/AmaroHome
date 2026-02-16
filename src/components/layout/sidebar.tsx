'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Wallet,
  Music,
  Gamepad2,
  StickyNote,
  BookOpen,
  Sparkles,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'

/* ── Navigation Items ──────────────────────────────────────────── */

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/finances', label: 'Finanças', icon: Wallet },
  { href: '/media', label: 'Media', icon: Music },
  { href: '/games', label: 'Games', icon: Gamepad2 },
  { href: '/notes', label: 'Notas', icon: StickyNote },
  { href: '/ebooks', label: 'eBooks', icon: BookOpen },
  { href: '/ai', label: 'IA', icon: Sparkles },
]

/* ── Sidebar Component ─────────────────────────────────────────── */

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 88 : 250 }}
        transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
        className={cn(
          'hidden lg:flex flex-col relative z-40',
          'h-[calc(100vh-2rem)] my-4 ml-4',
          'rounded-3xl border border-white/5 bg-black/20 backdrop-blur-xl',
          'shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)]',
          'shrink-0'
        )}
      >
        {/* Logo / Brand */}
        <div className="flex items-center h-24 px-5 gap-4 shrink-0 overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-violet-600 to-indigo-600 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(124,58,237,0.4)]">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="text-2xl font-bold tracking-tight text-white whitespace-nowrap"
              >
                Amaro<span className="text-transparent bg-clip-text bg-linear-to-r from-violet-400 to-cyan-400">Home</span>
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-4 py-4">
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    'relative flex items-center gap-4 py-4 rounded-2xl',
                    collapsed ? 'px-4 justify-center' : 'px-8',
                    'text-lg font-medium transition-all duration-300',
                    'group overflow-hidden',
                    isActive
                      ? 'bg-white/10 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] border border-white/10'
                      : 'text-muted-foreground hover:text-white hover:bg-white/5'
                  )}
                >
                  <item.icon
                    className={cn(
                      'w-6 h-6 shrink-0 transition-all duration-300 z-10',
                      isActive ? 'text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]' : 'group-hover:text-violet-300'
                    )}
                  />

                  <AnimatePresence mode="wait">
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="whitespace-nowrap overflow-hidden z-10"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  
                  {/* Subtle Hover Gradient */}
                   <div className="absolute inset-0 bg-linear-to-r from-violet-500/0 via-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />
                </Link>
              )
            })}
          </nav>
        </ScrollArea>

        {/* Collapse Toggle */}
        <div className="px-6 py-6 mt-auto border-t border-white/5">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              'flex items-center justify-center w-full py-3 rounded-xl',
              'text-muted hover:text-foreground hover:bg-white/5',
              'transition-all duration-(--transition-fast) cursor-pointer'
            )}
          >
            {collapsed ? (
              <PanelLeft className="w-6 h-6" />
            ) : (
              <PanelLeftClose className="w-6 h-6" />
            )}
          </button>
        </div>
      </motion.aside>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass-header">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.slice(0, 5).map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-1 py-1 px-3 rounded-sm',
                  'transition-colors duration-(--transition-fast)',
                  isActive
                    ? 'text-accent'
                    : 'text-muted'
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
