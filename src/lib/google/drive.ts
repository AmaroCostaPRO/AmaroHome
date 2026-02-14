import { google } from 'googleapis'
import { Readable } from 'stream'

/**
 * Autenticação via OAuth 2.0 (User Impersonation).
 * Usa um Refresh Token para agir como VOCÊ (dono da conta),
 * usando sua cota de 15GB e ignorando o limite zero do robô.
 */
function getAuth() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  )

  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  })

  return oauth2Client
}

function getDrive() {
  return google.drive({ version: 'v3', auth: getAuth() })
}

// ── Tipos ────────────────────────────────────────────────────────

export interface DriveFile {
  id: string
  name: string
  mimeType: string
  size?: string
  thumbnailLink?: string
  webViewLink?: string
  createdTime?: string
  modifiedTime?: string
}

// ── Funções Públicas ─────────────────────────────────────────────

export async function listFiles(folderId?: string): Promise<DriveFile[]> {
  const drive = getDrive()
  const targetFolder = folderId ?? process.env.GOOGLE_DRIVE_FOLDER_ID!

  try {
    const response = await drive.files.list({
      q: `'${targetFolder}' in parents and trashed = false and (mimeType = 'application/pdf' or mimeType = 'application/epub+zip')`,
      fields: 'files(id, name, mimeType, thumbnailLink, webViewLink, createdTime)',
      orderBy: 'createdTime desc',
      pageSize: 100,
    })
    return (response.data.files ?? []) as DriveFile[]
  } catch (error) {
    console.error('[Google Drive] Erro ao listar arquivos:', error)
    return []
  }
}

export async function getFileStream(fileId: string): Promise<Readable> {
  const drive = getDrive()
  try {
    const response = await drive.files.get(
      { fileId, alt: 'media' },
      { responseType: 'stream' }
    )
    return response.data as Readable
  } catch (error) {
    console.error('[Google Drive] Erro ao obter stream:', error)
    throw error
  }
}

export async function uploadFile(
  buffer: Buffer,
  name: string,
  mimeType: string,
  folderId?: string
): Promise<string> {
  const targetFolder = folderId ?? process.env.GOOGLE_DRIVE_FOLDER_ID
  
  if (!targetFolder) throw new Error('Pasta destino não definida.')

  const drive = getDrive()

  try {
    console.log('[Google Drive OAuth] Iniciando upload para pasta:', targetFolder)

    const response = await drive.files.create({
      requestBody: {
        name,
        mimeType,
        parents: [targetFolder],
      },
      media: {
        mimeType,
        body: Readable.from(buffer),
      },
      fields: 'id',
    })

    console.log('[Google Drive] Upload concluído ID:', response.data.id)
    return response.data.id!
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('[Google Drive] Erro OAuth:', message)
    const gError = error as { response?: { data?: unknown } }
    if (gError.response) {
       console.error('Detalhes Google:', JSON.stringify(gError.response.data, null, 2))
    }
    throw error
  }
}