'use client'

import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'

/**
 * Wrapper para animação de entrada das páginas.
 * Aplica fade-in + slide-up suave ao conteúdo principal.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="flex-1 w-full"
    >
      {children}
    </motion.div>
  )
}
