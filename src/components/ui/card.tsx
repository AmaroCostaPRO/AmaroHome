import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

/* ── Card Container ────────────────────────────────────────────── */

const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('glass-card p-0 overflow-hidden', className)}
      {...props}
    />
  )
)
Card.displayName = 'Card'

/* ── Card Header ───────────────────────────────────────────────── */

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col gap-1.5 px-6 pt-6 pb-2', className)}
      {...props}
    />
  )
)
CardHeader.displayName = 'CardHeader'

/* ── Card Title ────────────────────────────────────────────────── */

const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        'text-base font-semibold text-foreground tracking-tight',
        className
      )}
      {...props}
    />
  )
)
CardTitle.displayName = 'CardTitle'

/* ── Card Description ──────────────────────────────────────────── */

const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-muted', className)}
      {...props}
    />
  )
)
CardDescription.displayName = 'CardDescription'

/* ── Card Content ──────────────────────────────────────────────── */

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('px-6 pb-6 pt-2', className)}
      {...props}
    />
  )
)
CardContent.displayName = 'CardContent'

/* ── Card Footer ───────────────────────────────────────────────── */

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-center px-6 pb-6 border-t border-(--border-subtle) mt-2 pt-4',
        className
      )}
      {...props}
    />
  )
)
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
