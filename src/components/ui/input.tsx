import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-sm px-3 py-2 text-sm',
          'bg-white/3 border border-glass-border',
          'text-foreground placeholder:text-muted',
          'transition-all duration-(--transition-fast)',
          'hover:border-(--glass-border-hover)',
          'focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/20',
          'focus:bg-white/5',
          'disabled:cursor-not-allowed disabled:opacity-40',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
