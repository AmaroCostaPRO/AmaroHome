import { createClient } from '@/lib/supabase/server'
import { listFiles, type DriveFile } from '@/lib/google/drive'

/**
 * Sincroniza ebooks do Google Drive com a tabela `ebooks` no Supabase.
 *
 * - Lista arquivos na pasta do Drive
 * - Verifica quais já existem no banco (por google_drive_file_id)
 * - Insere registros para arquivos novos
 */
export async function syncEbooksFromDrive(userId: string) {
  const supabase = await createClient()

  try {
    // 1. Buscar arquivos do Google Drive
    const driveFiles = await listFiles()

    if (driveFiles.length === 0) {
      return { synced: 0, total: 0 }
    }

    // 2. Buscar ebooks existentes do usuário no Supabase
    const { data: existingEbooks, error: fetchError } = await supabase
      .from('ebooks')
      .select('google_drive_file_id')
      .eq('user_id', userId)

    if (fetchError) throw fetchError

    const existingIds = new Set(
      (existingEbooks ?? []).map((e) => e.google_drive_file_id)
    )

    // 3. Filtrar arquivos que ainda não existem no banco
    const newFiles = driveFiles.filter((file) => !existingIds.has(file.id))

    if (newFiles.length === 0) {
      return { synced: 0, total: driveFiles.length }
    }

    // 4. Inserir novos ebooks
    const records = newFiles.map((file: DriveFile) => ({
      user_id: userId,
      google_drive_file_id: file.id,
      title: file.name.replace(/\.(pdf|epub)$/i, ''),
      file_type: file.mimeType === 'application/epub+zip' ? 'epub' : 'pdf',
      file_size: file.size ? parseInt(file.size, 10) : null,
      thumbnail_url: file.thumbnailLink ?? null,
    }))

    const { error: insertError } = await supabase
      .from('ebooks')
      .insert(records)

    if (insertError) throw insertError

    return { synced: newFiles.length, total: driveFiles.length }
  } catch (error) {
    console.error('[Ebooks] Erro na sincronização:', error)
    throw error
  }
}
