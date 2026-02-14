import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PdfReader } from '@/components/ebooks/pdf-reader'

interface ReadPageProps {
  params: Promise<{ id: string }>
}

export default async function ReadPage({ params }: ReadPageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: ebook, error } = await supabase
    .from('ebooks')
    .select('id, title, file_type, reading_progress')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !ebook) redirect('/ebooks')

  // Apenas PDFs são suportados pelo reader por enquanto
  if (ebook.file_type !== 'pdf') {
    redirect('/ebooks')
  }

  return (
    <PdfReader
      ebookId={ebook.id}
      title={ebook.title}
      initialPage={ebook.reading_progress?.page ?? 1}
    />
  )
}
