'use client'

import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  /* Base */
  'inline-flex items-center justify-center gap-2 rounded-sm text-sm font-medium transition-all duration-(--transition-fast) cursor-pointer select-none disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
  {
    variants: {
      variant: {
        default:
          'bg-accent text-white hover:bg-accent-hover shadow-(--shadow-sm) hover:shadow-(--shadow-md)',
        ghost:
          'bg-transparent text-secondary hover:text-foreground hover:bg-white/4',
        outline:
          'bg-transparent border border-glass-border text-secondary hover:text-foreground hover:border-(--glass-border-hover) hover:bg-white/2',
        danger:
          'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
        icon: 'h-10 w-10 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
