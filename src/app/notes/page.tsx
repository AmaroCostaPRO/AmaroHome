import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getNotes } from './actions'
import { PageTransition } from '@/components/layout/page-transition'
import { PageWrapper } from '@/components/layout/page-wrapper'
import { NotesClient } from '@/components/notes/notes-client'

/* ── Página ───────────────────────────────────────────────────── */

export default async function NotesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const notes = await getNotes()

  return (
    <PageTransition>
      <PageWrapper className="space-y-8">
        <NotesClient notes={notes} />
      </PageWrapper>
    </PageTransition>
  )
}
