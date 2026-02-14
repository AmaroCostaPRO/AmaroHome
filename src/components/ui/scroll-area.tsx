'use client'

import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface ScrollAreaProps extends HTMLAttributes<HTMLDivElement> {
  /** Altura máxima do scroll container */
  maxHeight?: string
}

/**
 * Área de scroll com scrollbar minimalista estilizada via CSS.
 * A scrollbar global (globals.css) já é fina, mas este wrapper
 * garante overflow vertical e padding interno consistente.
 */
const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ className, maxHeight, style, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('overflow-y-auto overflow-x-hidden', className)}
        style={{ maxHeight, ...style }}
        {...props}
      >
        {children}
      </div>
    )
  }
)
ScrollArea.displayName = 'ScrollArea'

export { ScrollArea }
