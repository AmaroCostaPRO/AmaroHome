'use client'

import { ReactNode, createContext, useContext, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

type BentoGridContextType = {
  expandedId: string | null
  setExpandedId: (id: string | null) => void
}

const BentoGridContext = createContext<BentoGridContextType | undefined>(undefined)

export function useBentoGrid() {
  const context = useContext(BentoGridContext)
  if (!context) {
    throw new Error('useBentoGrid must be used within a BentoGrid')
  }
  return context
}

interface BentoGridProps {
  children: ReactNode
  className?: string
}

export function BentoGrid({ children, className }: BentoGridProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <BentoGridContext.Provider value={{ expandedId, setExpandedId }}>
      <div className={cn('grid grid-cols-1 md:grid-cols-4 auto-rows-[minmax(180px,auto)] gap-4 p-6', className)}>
        {children}
      </div>
    </BentoGridContext.Provider>
  )
}

interface BentoCardProps {
  children: ReactNode
  className?: string
  title?: string
  icon?: ReactNode
  id: string
  colSpan?: number
  rowSpan?: number
}

export function BentoCard({ children, className, title, icon, id, colSpan = 1, rowSpan = 1 }: BentoCardProps) {
  const { expandedId, setExpandedId } = useBentoGrid()
  const isExpanded = expandedId === id

  const handleCardClick = () => {
    // Toggle expand on click, unless it's the Welcome widget which might handle it differently (we'll see),
    // but for now, generic click-to-expand.
    // If we want specific widgets to control expansion (like AI input focus), we can expose setExpandedId via hook.
    // For standard cards, click to expand is good.
    if (!isExpanded) {
      setExpandedId(id)
    }
  }

  // Calculate dynamic classes safely
  const getSpanClass = (span: number, type: 'col' | 'row') => {
    if (span === 2) return type === 'col' ? 'md:col-span-2' : 'md:row-span-2'
    if (span === 3) return type === 'col' ? 'md:col-span-3' : 'md:row-span-3'
    if (span === 4) return type === 'col' ? 'md:col-span-4' : 'md:row-span-4'
    return type === 'col' ? 'md:col-span-1' : 'md:row-span-1'
  }

  return (
    <motion.div
      layout
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      onClick={handleCardClick}
      className={cn(
        'group relative overflow-hidden',
        'bg-slate-900/40 backdrop-blur-md border border-indigo-500/20 rounded-2xl p-6 md:p-8',
        'hover:border-violet-500/50 transition-colors duration-300',
        'flex flex-col',
        isExpanded 
          ? 'md:col-span-2 md:row-span-2 z-20 shadow-2xl shadow-indigo-500/10' 
          : `${getSpanClass(colSpan, 'col')} ${getSpanClass(rowSpan, 'row')} z-0`,
        className
      )}
    >
      {(title || icon) && (
        <motion.div layout="position" className="flex items-center gap-3 mb-4 text-slate-400 group-hover:text-indigo-300 transition-colors">
          {icon && <span className="w-5 h-5 flex items-center justify-center">{icon}</span>}
          {title && <h3 className="text-sm font-semibold tracking-wider uppercase">{title}</h3>}
        </motion.div>
      )}
      
      <div className="flex-1 w-full h-full">
        {children}
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={(e) => {
              e.stopPropagation()
              setExpandedId(null)
            }}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors backdrop-blur-sm"
          >
            <X className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
