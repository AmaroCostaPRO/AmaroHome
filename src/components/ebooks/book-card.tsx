'use client'

import Link from 'next/link'
import Image from 'next/image'
import { BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

/* ── Gradientes para capas placeholder ────────────────────── */

const GRADIENTS = [
  'from-violet-600/60 to-indigo-800/60',
  'from-emerald-600/60 to-teal-800/60',
  'from-rose-600/60 to-pink-800/60',
  'from-amber-600/60 to-orange-800/60',
  'from-sky-600/60 to-cyan-800/60',
  'from-fuchsia-600/60 to-purple-800/60',
]

function getGradient(title: string) {
  const hash = title.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return GRADIENTS[hash % GRADIENTS.length]
}

/* ── Props ─────────────────────────────────────────────────── */

interface BookCardProps {
  id: string
  title: string
  author: string
  coverUrl?: string | null
  progress?: number
}

/* ── BookCard Component ────────────────────────────────────── */

export function BookCard({ id, title, author, coverUrl, progress = 0 }: BookCardProps) {
  return (
    <Link href={`/ebooks/read/${id}`} className="group block">
      <div
        className={cn(
          'relative aspect-2/3 rounded-lg overflow-hidden',
          'border border-glass-border',
          'transition-all duration-300 ease-out',
          'group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-accent/10',
          'group-hover:border-accent/30'
        )}
      >
        {/* Cover Image or Gradient Placeholder */}
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
            className="object-cover"
          />
        ) : (
          <div
            className={cn(
              'absolute inset-0 bg-linear-to-br flex flex-col items-center justify-center p-4 gap-3',
              getGradient(title)
            )}
          >
            <BookOpen className="w-8 h-8 text-white/60" />
            <p className="text-sm font-semibold text-white/90 text-center leading-tight line-clamp-3">
              {title}
            </p>
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

        {/* Progress bar */}
        {progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/40">
            <div
              className="h-full bg-accent transition-all duration-500"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        )}
      </div>

      {/* Title & Author */}
      <div className="mt-2.5 space-y-0.5 px-0.5">
        <p className="text-sm font-medium text-foreground truncate group-hover:text-accent transition-colors">
          {title}
        </p>
        <p className="text-xs text-muted truncate">
          {author}
        </p>
      </div>
    </Link>
  )
}
