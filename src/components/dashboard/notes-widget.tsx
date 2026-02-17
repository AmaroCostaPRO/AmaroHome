'use client'

import Link from 'next/link'
import { FileText, Network, ArrowRight } from 'lucide-react'
import { formatRelativeDate } from '@/lib/utils'
import { useBentoGrid } from './bento-grid'
import { motion, AnimatePresence } from 'framer-motion'

interface Note {
  id: string
  title: string
  type: string
  updatedAt: string
}

export function NotesWidget({ notes }: { notes: Note[] }) {
  const { expandedId } = useBentoGrid()
  const isExpanded = expandedId === 'notes'

  // Mock preview generator
  const getPreview = (title: string, type: string) => {
    if (type === 'board') return `Visualização do quadro mental "${title}" com conexões e insights principais mapeados.`
    return `Conteúdo prévio da nota "${title}". Aqui você veria as primeiras linhas do pensamento capturado, ideias chave e tarefas relacionadas...`
  }

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex-1 space-y-2">
        {notes.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-4">Nenhuma nota recente.</p>
        ) : (
          notes.slice(0, 3).map((note) => (
            <div
              key={note.id}
              className="group flex flex-col p-3 -mx-2 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg transition-colors ${
                  note.type === 'board' 
                    ? 'bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20' 
                    : 'bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20'
                }`}>
                  {note.type === 'board' ? (
                    <Network className="w-4 h-4" />
                  ) : (
                    <FileText className="w-4 h-4" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <Link href={`/notes?id=${note.id}`} className="block focus:outline-none">
                    <p className="text-sm font-medium text-slate-200 truncate group-hover:text-white transition-colors">
                      {note.title}
                    </p>
                  </Link>
                  <p className="text-xs text-slate-500">
                    {formatRelativeDate(note.updatedAt)}
                  </p>
                </div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden pl-13 pt-2"
                  >
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                      {getPreview(note.title, note.type)}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))
        )}
      </div>

      <div className={`mt-4 flex items-center justify-end transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-80'}`}>
        <Link
          href="/notes"
          className="flex items-center text-xs font-medium text-slate-500 hover:text-indigo-400 transition-colors group"
        >
          <span>Ver todas</span>
          <ArrowRight className="w-3 h-3 ml-1 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  )
}
