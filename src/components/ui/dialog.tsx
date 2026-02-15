'use client'

import { forwardRef, type ComponentPropsWithoutRef, type HTMLAttributes } from 'react'
import { Dialog as RadixDialog } from 'radix-ui'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

/* ── Re-exports ───────────────────────────────────────────────── */

const Dialog = RadixDialog.Root
const DialogTrigger = RadixDialog.Trigger
const DialogClose = RadixDialog.Close
const DialogPortal = RadixDialog.Portal

/* ── Overlay ──────────────────────────────────────────────────── */

const DialogOverlay = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof RadixDialog.Overlay>
>(({ className, ...props }, ref) => (
  <RadixDialog.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-black/60 backdrop-blur-sm',
      'data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out',
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = 'DialogOverlay'

/* ── Content ──────────────────────────────────────────────────── */

const DialogContent = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof RadixDialog.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <RadixDialog.Content
      ref={ref}
      className={cn(
        'fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2',
        'w-[calc(100%-2rem)] max-w-lg',
        'glass-panel p-6',
        'bg-elevated border border-glass-border',
        'shadow-(--shadow-lg)',
        'data-[state=open]:animate-scale-in',
        'focus:outline-none',
        className
      )}
      {...props}
    >
      {children}
      <RadixDialog.Close
        className={cn(
          'absolute right-4 top-4 rounded-sm p-1',
          'text-muted hover:text-foreground hover:bg-white/5',
          'transition-colors duration-(--transition-fast) cursor-pointer',
          'focus:outline-none focus:ring-2 focus:ring-ring'
        )}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Fechar</span>
      </RadixDialog.Close>
    </RadixDialog.Content>
  </DialogPortal>
))
DialogContent.displayName = 'DialogContent'

/* ── Header ───────────────────────────────────────────────────── */

function DialogHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex flex-col gap-1.5 mb-5', className)}
      {...props}
    />
  )
}

/* ── Title ────────────────────────────────────────────────────── */

const DialogTitle = forwardRef<
  HTMLHeadingElement,
  ComponentPropsWithoutRef<typeof RadixDialog.Title>
>(({ className, ...props }, ref) => (
  <RadixDialog.Title
    ref={ref}
    className={cn('text-2xl font-semibold text-foreground tracking-tight', className)}
    {...props}
  />
))
DialogTitle.displayName = 'DialogTitle'

/* ── Description ──────────────────────────────────────────────── */

const DialogDescription = forwardRef<
  HTMLParagraphElement,
  ComponentPropsWithoutRef<typeof RadixDialog.Description>
>(({ className, ...props }, ref) => (
  <RadixDialog.Description
    ref={ref}
    className={cn('text-base text-muted', className)}
    {...props}
  />
))
DialogDescription.displayName = 'DialogDescription'

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
}
