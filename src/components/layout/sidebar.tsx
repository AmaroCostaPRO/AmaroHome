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
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        className={cn(
          'hidden lg:flex flex-col fixed left-0 top-0 bottom-0 z-40',
          'glass-sidebar'
        )}
      >
        {/* Logo / Brand */}
        <div className="flex items-center h-16 px-4 gap-3 shrink-0">
          <div className="w-9 h-9 rounded-sm bg-accent flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                className="text-sm font-semibold text-foreground whitespace-nowrap"
              >
                Hub Pessoal
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-2">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'relative flex items-center gap-3 px-3 py-2.5 rounded-sm',
                    'text-sm font-medium transition-all duration-(--transition-fast)',
                    'group',
                    isActive
                      ? 'text-foreground bg-white/6'
                      : 'text-muted hover:text-secondary hover:bg-white/3'
                  )}
                >
                  {/* Active Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-accent"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}

                  <item.icon
                    className={cn(
                      'w-5 h-5 shrink-0 transition-colors',
                      isActive ? 'text-accent' : 'text-muted group-hover:text-secondary'
                    )}
                  />

                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        className="whitespace-nowrap overflow-hidden"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* Glow on active */}
                  {isActive && (
                    <div className="absolute inset-0 rounded-sm bg-accent/4 pointer-events-none" />
                  )}
                </Link>
              )
            })}
          </nav>
        </ScrollArea>

        {/* Collapse Toggle */}
        <div className="px-3 py-3 border-t border-(--border-subtle)">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              'flex items-center justify-center w-full py-2 rounded-sm',
              'text-muted hover:text-secondary hover:bg-white/3',
              'transition-all duration-(--transition-fast) cursor-pointer'
            )}
          >
            {collapsed ? (
              <PanelLeft className="w-5 h-5" />
            ) : (
              <PanelLeftClose className="w-5 h-5" />
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
