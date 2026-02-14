import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { uploadFile } from '@/lib/google/drive'
import type { EbookFileType } from '@/types/database'

const ALLOWED_TYPES: Record<string, EbookFileType> = {
  'application/pdf': 'pdf',
  'application/epub+zip': 'epub',
}

/**
 * POST /api/ebooks/upload
 * Recebe FormData com arquivo + metadados, envia ao Drive e registra no Supabase.
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const title = formData.get('title') as string | null
    const author = formData.get('author') as string | null

    if (!file) {
      return NextResponse.json({ error: 'Arquivo não enviado' }, { status: 400 })
    }

    // Validar tipo do arquivo
    const fileType = ALLOWED_TYPES[file.type]
    if (!fileType) {
      return NextResponse.json(
        { error: 'Tipo de arquivo não suportado. Apenas PDF e EPUB são aceitos.' },
        { status: 400 }
      )
    }

    // Upload para Google Drive
    const buffer = Buffer.from(await file.arrayBuffer())
    const driveFileId = await uploadFile(buffer, file.name, file.type)

    // Inserir registro no Supabase
    const ebookTitle = title || file.name.replace(/\.(pdf|epub)$/i, '')

    const { data: ebook, error: insertError } = await supabase
      .from('ebooks')
      .insert({
        user_id: user.id,
        google_drive_file_id: driveFileId,
        title: ebookTitle,
        author: author || 'Desconhecido',
        file_type: fileType,
        file_size_bytes: file.size,
      })
      .select('id, google_drive_file_id')
      .single()

    if (insertError) throw insertError

    return NextResponse.json({ success: true, data: ebook }, { status: 201 })
  } catch (error) {
    console.error('[API] Erro no upload de ebook:', error)
    return NextResponse.json(
      { error: 'Erro ao processar upload do ebook' },
      { status: 500 }
    )
  }
}
