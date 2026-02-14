import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { syncEbooksFromDrive } from '@/services/ebooks'

/**
 * POST /api/ebooks/sync
 * Sincroniza ebooks do Google Drive com o Supabase.
 */
export async function POST() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const result = await syncEbooksFromDrive(user.id)

    return NextResponse.json({
      success: true,
      data: {
        synced: result.synced,
        total: result.total,
      },
    })
  } catch (error) {
    console.error('[API] Erro na sincronização de ebooks:', error)
    return NextResponse.json(
      { error: 'Erro ao sincronizar ebooks do Google Drive' },
      { status: 500 }
    )
  }
}
