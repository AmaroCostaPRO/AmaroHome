// ============================================================
// HUB PESSOAL — Interfaces globais para uso em componentes
// ============================================================

import type { Database } from './database'

// Re-export dos tipos JSONB auxiliares
export type {
  ReadingProgress,
  PlaylistTrack,
  GameMetadata,
  WebGameConfig,
  AIMessage,
  FinanceMetadata,
} from './database'

// Re-export dos enums
export type {
  TransactionType,
  PlaylistPlatform,
  EbookFileType,
  EbookStatus,
  AIModel,
  GameStatus,
} from './database'

// ────────────────────────────────────────────────────────────
// Aliases das Rows (para uso direto nos componentes)
// ────────────────────────────────────────────────────────────

/** Transação financeira (receita ou despesa) */
export type Transaction = Database['public']['Tables']['finances']['Row']
export type TransactionInsert = Database['public']['Tables']['finances']['Insert']
export type TransactionUpdate = Database['public']['Tables']['finances']['Update']

/** Playlist de YouTube ou Spotify */
export type Playlist = Database['public']['Tables']['playlists']['Row']
export type PlaylistInsert = Database['public']['Tables']['playlists']['Insert']
export type PlaylistUpdate = Database['public']['Tables']['playlists']['Update']

/** Jogo na biblioteca pessoal */
export type Game = Database['public']['Tables']['games_library']['Row']
export type GameInsert = Database['public']['Tables']['games_library']['Insert']
export type GameUpdate = Database['public']['Tables']['games_library']['Update']

/** Nota / texto do editor */
export type Note = Database['public']['Tables']['notes']['Row']
export type NoteInsert = Database['public']['Tables']['notes']['Insert']
export type NoteUpdate = Database['public']['Tables']['notes']['Update']

/** eBook (metadados — arquivo real no Google Drive) */
export type Ebook = Database['public']['Tables']['ebooks']['Row']
export type EbookInsert = Database['public']['Tables']['ebooks']['Insert']
export type EbookUpdate = Database['public']['Tables']['ebooks']['Update']

/** Sessão de leitura de um eBook */
export type ReadingSession = Database['public']['Tables']['reading_sessions']['Row']
export type ReadingSessionInsert = Database['public']['Tables']['reading_sessions']['Insert']
export type ReadingSessionUpdate = Database['public']['Tables']['reading_sessions']['Update']

/** Game web personalizado */
export type WebGame = Database['public']['Tables']['web_games']['Row']
export type WebGameInsert = Database['public']['Tables']['web_games']['Insert']
export type WebGameUpdate = Database['public']['Tables']['web_games']['Update']

/** Conversa com assistente IA */
export type AIConversation = Database['public']['Tables']['ai_conversations']['Row']
export type AIConversationInsert = Database['public']['Tables']['ai_conversations']['Insert']
export type AIConversationUpdate = Database['public']['Tables']['ai_conversations']['Update']

// ────────────────────────────────────────────────────────────
// Tipos utilitários genéricos
// ────────────────────────────────────────────────────────────

/** Resposta paginada genérica */
export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  pageSize: number
  totalPages: number
}

/** Estado de carregamento para UI */
export interface AsyncState<T> {
  data: T | null
  isLoading: boolean
  error: string | null
}

/** Filtros comuns para listagens */
export interface ListFilters {
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  page?: number
  pageSize?: number
}

/** Resultado de uma Server Action */
export interface ActionResult<T = void> {
  success: boolean
  data?: T
  error?: string
}

/** Usuário autenticado (subset do auth.users) */
export interface AuthUser {
  id: string
  email: string
  user_metadata: {
    full_name?: string
    avatar_url?: string
    username?: string
  }
}
