import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PageTransition } from '@/components/layout/page-transition'
import { PageWrapper } from '@/components/layout/page-wrapper'
import { BookCard } from '@/components/ebooks/book-card'
import { UploadZone } from '@/components/ebooks/upload-zone'
import { BookOpen } from 'lucide-react'

export default async function EbooksPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: ebooks } = await supabase
    .from('ebooks')
    .select('id, title, author, cover_thumbnail_url, reading_progress, status')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  const books = ebooks ?? []

  return (
    <PageTransition>
      <PageWrapper className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-foreground tracking-tight">
              Biblioteca de eBooks
            </h2>
            <p className="text-muted">
              {books.length > 0
                ? `${books.length} livro${books.length !== 1 ? 's' : ''} na sua estante`
                : 'Sua estante está vazia'}
            </p>
          </div>
        </div>

        {/* Upload Zone */}
        <UploadZone />

        {/* Books Grid or Empty State */}
        {books.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
            {books.map((book) => (
              <BookCard
                key={book.id}
                id={book.id}
                title={book.title}
                author={book.author}
                coverUrl={book.cover_thumbnail_url}
                progress={book.reading_progress?.percentage ?? 0}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 glass-card rounded-lg">
            <div className="w-20 h-20 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-6">
              <BookOpen className="w-10 h-10 text-accent/60" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Nenhum eBook ainda
            </h3>
            <p className="text-sm text-muted text-center max-w-sm">
              Arraste um arquivo PDF ou EPUB na área acima para começar a construir sua biblioteca pessoal.
            </p>
          </div>
        )}
      </PageWrapper>
    </PageTransition>
  )
}
