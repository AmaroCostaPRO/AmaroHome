import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface BentoGridProps {
  children: ReactNode
  className?: string
}

export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6', className)}>
      {children}
    </div>
  )
}

interface BentoCardProps {
  children: ReactNode
  className?: string
  title?: string
  icon?: ReactNode
}

export function BentoCard({ children, className, title, icon }: BentoCardProps) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden',
        'bg-slate-900/40 backdrop-blur-md border border-indigo-500/20 rounded-2xl p-5',
        'hover:border-violet-500/50 transition-all duration-300',
        'flex flex-col',
        className
      )}
    >
      {(title || icon) && (
        <div className="flex items-center gap-2 mb-4 text-muted-foreground group-hover:text-primary transition-colors">
          {icon && <span className="w-4 h-4">{icon}</span>}
          {title && <h3 className="text-xs font-semibold uppercase tracking-wider">{title}</h3>}
        </div>
      )}
      <div className="flex-1">{children}</div>
    </div>
  )
}
