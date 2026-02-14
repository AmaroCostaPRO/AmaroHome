'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Document, Page, pdfjs } from 'react-pdf'
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

// ── FIX: Forçar a versão do Worker a ser idêntica à da lib instalada ──
// Isso corrige o erro: "The API version does not match the Worker version"
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

/* ── Props ─────────────────────────────────────────────────── */

interface PdfReaderProps {
  ebookId: string
  title: string
  initialPage?: number
}

/* ── PDF Reader Component ──────────────────────────────────── */

export function PdfReader({ ebookId, title, initialPage = 1 }: PdfReaderProps) {
  const router = useRouter()
  const [numPages, setNumPages] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState(initialPage > 0 ? initialPage : 1)
  const [scale, setScale] = useState(1.2)
  const [loading, setLoading] = useState(true)

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    setLoading(false)
  }, [])

  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, numPages)))
  }, [numPages])

  const zoomIn = useCallback(() => setScale((s) => Math.min(s + 0.2, 3)), [])
  const zoomOut = useCallback(() => setScale((s) => Math.max(s - 0.2, 0.5)), [])

  // Stub: salvar progresso ao sair
  const handleBack = useCallback(async () => {
    // TODO: Salvar página atual no Supabase
    // await fetch(`/api/ebooks/${ebookId}/progress`, { method: 'PATCH', body: JSON.stringify({ page: currentPage }) })
    router.push('/ebooks')
  }, [router])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Toolbar */}
      <header className="sticky top-0 z-50 glass-header flex items-center justify-between h-14 px-4 gap-4">
        {/* Left: Back + Title */}
        <div className="flex items-center gap-3 min-w-0">
          <Button variant="ghost" size="icon" onClick={handleBack} aria-label="Voltar">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <span className="text-sm font-medium text-foreground truncate hidden sm:block">
            {title}
          </span>
        </div>

        {/* Center: Page Navigation */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage <= 1}
            aria-label="Página anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <span className="text-sm text-secondary tabular-nums min-w-[80px] text-center">
            {currentPage} / {numPages || '...'}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage >= numPages}
            aria-label="Próxima página"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Right: Zoom */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={zoomOut} aria-label="Diminuir zoom">
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-xs text-muted tabular-nums w-10 text-center">
            {Math.round(scale * 100)}%
          </span>
          <Button variant="ghost" size="icon" onClick={zoomIn} aria-label="Aumentar zoom">
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* PDF Content */}
      <div className="flex-1 overflow-auto flex justify-center py-6">
        <Document
          file={`/api/ebooks/${ebookId}/stream`}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <Loader2 className="w-10 h-10 text-accent animate-spin" />
              <p className="text-sm text-muted">Carregando PDF...</p>
            </div>
          }
          error={
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <p className="text-sm text-red-400">Erro ao carregar o PDF.</p>
              <Button variant="outline" size="sm" onClick={() => router.push('/ebooks')}>
                Voltar à Biblioteca
              </Button>
            </div>
          }
          className="max-w-full"
        >
          <Page
            pageNumber={Math.max(1, currentPage)} // <--- Blindagem extra aqui
            scale={scale}
            className={cn(
              'shadow-2xl shadow-black/40 rounded-sm',
              loading && 'animate-pulse'
            )}
            renderTextLayer={true}
            renderAnnotationLayer={true}
          />
        </Document>
      </div>
    </div>
  )
}