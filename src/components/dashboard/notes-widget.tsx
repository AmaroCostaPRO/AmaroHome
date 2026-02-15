import Link from 'next/link'
import { FileText, Network, ArrowRight } from 'lucide-react'
import { formatRelativeDate } from '@/lib/utils'

interface Note {
  id: string
  title: string
  type: string
  updatedAt: string
}

export function NotesWidget({ notes }: { notes: Note[] }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 space-y-3">
        {notes.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">Nenhuma nota recente.</p>
        ) : (
          notes.map((note) => (
            <Link
              key={note.id}
              href="/notes"
              className="group flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <div className="p-2 rounded-md bg-white/5 text-muted-foreground group-hover:text-amber-400 group-hover:bg-amber-400/10 transition-colors">
                {note.type === 'board' ? (
                  <Network className="w-4 h-4" />
                ) : (
                  <FileText className="w-4 h-4" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate group-hover:text-amber-100 transition-colors">
                  {note.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatRelativeDate(note.updatedAt)}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
      <Link
        href="/notes"
        className="mt-4 flex items-center justify-end text-xs font-medium text-muted-foreground hover:text-amber-400 transition-colors group"
      >
        <span>Ver todas</span>
        <ArrowRight className="w-3 h-3 ml-1 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  )
}
