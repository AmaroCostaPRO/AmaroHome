import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getMedia } from './actions'
import { PageTransition } from '@/components/layout/page-transition'
import { MediaClient } from '@/components/media/media-client'
import { AddMediaDialog } from '@/components/media/add-media-dialog'
import { DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

/* ── Página ───────────────────────────────────────────────────── */

export default async function MediaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const media = await getMedia()

  return (
    <PageTransition>
      <div className="space-y-8 max-w-6xl">
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

          <AddMediaDialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4" />
                Adicionar Media
              </Button>
            </DialogTrigger>
          </AddMediaDialog>
        </div>

        {/* Grid + Players (Client Component) */}
        <MediaClient media={media} />
      </div>
    </PageTransition>
  )
}
