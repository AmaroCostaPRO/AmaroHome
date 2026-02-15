'use client'

import { usePathname } from 'next/navigation'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'

/** Rotas que NÃO devem exibir sidebar/header */
const AUTH_ROUTES = ['/login', '/auth', '/ebooks/read']

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route))

  if (isAuthRoute) {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden relative transition-all duration-300">
        <Header />
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative z-10 scroll-smooth">
          {children}
        </main>
      </div>
    </div>
  )
}
