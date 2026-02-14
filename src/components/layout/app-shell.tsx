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
    <>
      <Sidebar />
      <div className="lg:pl-[260px] min-h-screen flex flex-col transition-all duration-(--transition-base)">
        <Header />
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8 pb-20 lg:pb-8 relative z-10">
          {children}
        </main>
      </div>
    </>
  )
}
