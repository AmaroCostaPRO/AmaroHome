'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Library, Folder, ListMusic } from 'lucide-react'
import { CreatePlaylistDialog } from './create-playlist-dialog'
import { Playlist } from '@/app/media/actions'

interface PlaylistSidebarProps {
  playlists: Playlist[]
}

export function PlaylistSidebar({ playlists }: PlaylistSidebarProps) {
  const searchParams = useSearchParams()
  const currentPlaylistId = searchParams.get('playlist')

  return (
    <div className="w-full md:w-64 shrink-0 space-y-8 glass-panel md:bg-transparent md:border-0 p-4 md:p-0">
       {/* Section: Library */}
       <div className="space-y-3">
         <h3 className="px-2 text-xs font-bold text-muted uppercase tracking-wider pl-4">
           Biblioteca
         </h3>
         <nav className="space-y-1">
           <Link
             href="/media"
             className={cn(
               "flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
               !currentPlaylistId
                 ? "bg-indigo-500/20 text-indigo-300 shadow-sm border border-indigo-500/20"
                 : "text-muted hover:text-white hover:bg-white/5"
             )}
           >
             <Library className="w-4 h-4" />
             Todas as Mídias
           </Link>
           {/* Future items could go here */}
         </nav>
       </div>

       {/* Section: Playlists */}
       <div className="space-y-3">
         <div className="flex items-center justify-between px-2 pl-4">
            <h3 className="text-xs font-bold text-muted uppercase tracking-wider">
              Playlists
            </h3>
         </div>
         
         <div className="mb-4">
            <CreatePlaylistDialog />
         </div>

         <nav className="space-y-1 max-h-[calc(100vh-350px)] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 pr-1">
           {playlists.map((playlist) => (
             <Link
               key={playlist.id}
               href={`/media?playlist=${playlist.id}`}
               className={cn(
                 "flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 group relative",
                 currentPlaylistId === playlist.id
                   ? "bg-indigo-500/20 text-indigo-300 border-l-4 border-indigo-400 pl-3"
                   : "text-muted hover:text-white hover:bg-white/5"
               )}
             >
               {playlist.icon === 'ListMusic' ? (
                 <ListMusic className={cn("w-4 h-4", currentPlaylistId === playlist.id ? "text-indigo-400" : "text-muted-foreground")} />
               ) : (
                 <Folder className={cn("w-4 h-4", currentPlaylistId === playlist.id ? "text-indigo-400" : "text-muted-foreground")} />
               )}
               <span className="truncate flex-1">{playlist.title}</span>
               
               {/* Color indicator if present */}
               {playlist.color && (
                 <span 
                   className="w-2 h-2 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"
                   style={{ backgroundColor: playlist.color }}
                 />
               )}
             </Link>
           ))}
           
           {playlists.length === 0 && (
             <div className="px-4 py-8 text-center border border-dashed border-white/10 rounded-lg">
               <p className="text-xs text-muted/60">
                 Nenhuma playlist criada.
               </p>
             </div>
           )}
         </nav>
       </div>
    </div>
  )
}
