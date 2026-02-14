import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getNotes } from './actions'
import { PageTransition } from '@/components/layout/page-transition'
import { NotesClient } from '@/components/notes/notes-client'

/* ── Página ───────────────────────────────────────────────────── */

export default async function NotesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const notes = await getNotes()

  return (
    <PageTransition>
      <div className="space-y-8 max-w-5xl">
        <NotesClient notes={notes} />
      </div>
    </PageTransition>
  )
}
