import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getMedia, getPlaylists } from './actions'
import { PageTransition } from '@/components/layout/page-transition'
import { MediaClient } from '@/components/media/media-client'
import { AddMediaDialog } from '@/components/media/add-media-dialog'
import { PlaylistSidebar } from '@/components/media/playlist-sidebar'
import { DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { PageWrapper } from '@/components/layout/page-wrapper'
import { Plus } from 'lucide-react'

/* ── Página ───────────────────────────────────────────────────── */

interface MediaPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function MediaPage({ searchParams }: MediaPageProps) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const params = await searchParams
  const currentPlaylistId = typeof params.playlist === 'string' ? params.playlist : undefined

  // Parallel data fetching
  const [media, playlists] = await Promise.all([
    getMedia(currentPlaylistId),
    getPlaylists()
  ])

  return (
    <PageTransition>
      <PageWrapper className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-foreground tracking-tight">
              A Minha Curadoria
            </h2>
            <p className="text-muted">
              Músicas, vídeos e conteúdos favoritos num só lugar
            </p>
          </div>

          <AddMediaDialog playlists={playlists}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4" />
                Adicionar Media
              </Button>
            </DialogTrigger>
          </AddMediaDialog>
        </div>

        {/* Content Layout */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Sidebar */}
          <PlaylistSidebar playlists={playlists} />

          {/* Grid + Players (Client Component) */}
          <div className="flex-1 w-full min-w-0">
             <MediaClient media={media} playlists={playlists} />
          </div>
        </div>
      </PageWrapper>
    </PageTransition>
  )
}
