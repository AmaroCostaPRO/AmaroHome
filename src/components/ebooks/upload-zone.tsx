'use client'

import { useCallback, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, Loader2, CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type UploadState = 'idle' | 'uploading' | 'success' | 'error'

export function UploadZone() {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [state, setState] = useState<UploadState>('idle')
  const [dragOver, setDragOver] = useState(false)
  const [message, setMessage] = useState('')

  const handleUpload = useCallback(async (file: File) => {
    setState('uploading')
    setMessage(`Enviando "${file.name}"...`)

    try {
      const formData = new FormData()
      formData.append('file', file)
      // Título derivado do nome do arquivo (sem extensão)
      formData.append('title', file.name.replace(/\.(pdf|epub)$/i, ''))

      const res = await fetch('/api/ebooks/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const body = await res.json()
        throw new Error(body.error || 'Erro no upload')
      }

      setState('success')
      setMessage('Upload concluído!')
      router.refresh()

      // Resetar estado após 3s
      setTimeout(() => {
        setState('idle')
        setMessage('')
      }, 3000)
    } catch (err) {
      setState('error')
      setMessage(err instanceof Error ? err.message : 'Erro desconhecido')

      setTimeout(() => {
        setState('idle')
        setMessage('')
      }, 4000)
    }
  }, [router])

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return
    const file = files[0]

    // Validação client-side
    const allowed = ['application/pdf', 'application/epub+zip']
    if (!allowed.includes(file.type)) {
      setState('error')
      setMessage('Apenas arquivos PDF e EPUB são suportados.')
      setTimeout(() => { setState('idle'); setMessage('') }, 4000)
      return
    }

    handleUpload(file)
  }, [handleUpload])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleFiles(e.dataTransfer.files)
  }, [handleFiles])

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      className={cn(
        'relative border-2 border-dashed rounded-lg p-6 text-center',
        'transition-all duration-200 cursor-pointer',
        dragOver
          ? 'border-accent/50 bg-accent/5'
          : 'border-glass-border hover:border-accent/30 hover:bg-white/2',
        state === 'success' && 'border-emerald-500/40 bg-emerald-500/5',
        state === 'error' && 'border-red-500/40 bg-red-500/5'
      )}
      onClick={() => state === 'idle' && inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.epub"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <div className="flex flex-col items-center gap-2">
        {state === 'idle' && (
          <>
            <Upload className="w-8 h-8 text-muted" />
            <p className="text-sm text-secondary font-medium">
              Arraste um arquivo ou clique para selecionar
            </p>
            <p className="text-xs text-muted">PDF ou EPUB (máx. 100MB)</p>
          </>
        )}

        {state === 'uploading' && (
          <>
            <Loader2 className="w-8 h-8 text-accent animate-spin" />
            <p className="text-sm text-accent font-medium">{message}</p>
          </>
        )}

        {state === 'success' && (
          <>
            <CheckCircle className="w-8 h-8 text-emerald-400" />
            <p className="text-sm text-emerald-400 font-medium">{message}</p>
          </>
        )}

        {state === 'error' && (
          <>
            <XCircle className="w-8 h-8 text-red-400" />
            <p className="text-sm text-red-400 font-medium">{message}</p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-1"
              onClick={(e) => { e.stopPropagation(); setState('idle'); setMessage('') }}
            >
              Tentar novamente
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
