import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getFileStream } from '@/lib/google/drive'

const MIME_MAP: Record<string, string> = {
  pdf: 'application/pdf',
  epub: 'application/epub+zip',
}

/**
 * GET /api/ebooks/[id]/stream
 * Faz streaming do arquivo do Google Drive sem carregar tudo em memória.
 * O [id] é o UUID do ebook no Supabase, não o file_id do Drive.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const { id } = await params

  try {
    // Buscar ebook no Supabase
    const { data: ebook, error: fetchError } = await supabase
      .from('ebooks')
      .select('google_drive_file_id, file_type, title')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !ebook) {
      return NextResponse.json({ error: 'Ebook não encontrado' }, { status: 404 })
    }

    // Obter stream do Google Drive
    const nodeStream = await getFileStream(ebook.google_drive_file_id)
    const contentType = MIME_MAP[ebook.file_type] || 'application/octet-stream'

    // Converter Node Readable → Web ReadableStream (piping direto, sem buffer)
    const webStream = new ReadableStream({
      start(controller) {
        nodeStream.on('data', (chunk: Buffer) => {
          controller.enqueue(new Uint8Array(chunk))
        })
        nodeStream.on('end', () => {
          controller.close()
        })
        nodeStream.on('error', (err) => {
          controller.error(err)
        })
      },
      cancel() {
        nodeStream.destroy()
      },
    })

    return new NextResponse(webStream, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${encodeURIComponent(ebook.title)}.${ebook.file_type}"`,
        'Cache-Control': 'private, max-age=3600',
      },
    })
  } catch (error) {
    console.error('[API] Erro no streaming de ebook:', error)
    return NextResponse.json(
      { error: 'Erro ao fazer streaming do ebook' },
      { status: 500 }
    )
  }
}
