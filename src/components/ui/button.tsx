'use client'

import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  /* Base */
  'inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-95',
  {
    variants: {
      variant: {
        default:
          'bg-linear-to-r from-violet-600 via-indigo-600 to-violet-600 bg-[length:200%_auto] hover:bg-[position:right_center] text-white shadow-[0_0_20px_-5px_rgba(124,58,237,0.5)] hover:shadow-[0_0_25px_rgba(124,58,237,0.7)] border border-white/10',
        destructive:
          'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]',
        outline:
          'border border-white/10 bg-white/5 shadow-sm hover:bg-white/10 hover:text-white hover:border-white/20 backdrop-blur-md',
        secondary:
          'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost: 
          'hover:bg-white/5 hover:text-white text-gray-400',
        link: 
          'text-violet-400 underline-offset-4 hover:underline hover:text-violet-300',
        glow: 
          'bg-black/40 border border-white/10 text-white shadow-[0_0_15px_rgba(139,92,246,0.15)] hover:shadow-[0_0_25px_rgba(139,92,246,0.4)] hover:border-violet-500/50 hover:bg-black/60',
      },
      size: {
        default: 'h-10 px-5 py-2',
        sm: 'h-9 px-4 text-xs',
        lg: 'h-12 px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
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
