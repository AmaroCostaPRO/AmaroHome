// ============================================================
// HUB PESSOAL — Supabase Database Types
// Gerado manualmente para compatibilidade com @supabase/supabase-js
// ============================================================

// ────────────────────────────────────────────────────────────
// Tipos auxiliares JSONB
// ────────────────────────────────────────────────────────────

export interface ReadingProgress {
  page: number
  percentage: number
  /** CFI location string para EPUB */
  cfi?: string
}

export interface PlaylistTrack {
  title: string
  url: string
  embed_url: string
  thumbnail?: string
  duration?: string
  artist?: string
  position: number
}

export interface GameMetadata {
  release_date?: string
  developer?: string
  publisher?: string
  screenshots?: string[]
  esrb_rating?: string
}

export interface WebGameConfig {
  width?: number
  height?: number
  controls?: string
  difficulty?: string
  colors?: Record<string, string>
  [key: string]: unknown
}

export interface AIMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
}

export interface FinanceMetadata {
  recurrence_interval?: string
  installments?: number
  current_installment?: number
  payment_method?: string
  [key: string]: unknown
}

// ────────────────────────────────────────────────────────────
// Enums (espelham os CREATE TYPE do SQL)
// ────────────────────────────────────────────────────────────

export type TransactionType = 'income' | 'expense'
export type PlaylistPlatform = 'youtube' | 'spotify'
export type EbookFileType = 'pdf' | 'epub'
export type EbookStatus = 'want_to_read' | 'reading' | 'finished' | 'abandoned'
export type AIModel = 'gemini' | 'openai' | 'claude'
export type GameStatus = 'backlog' | 'playing' | 'completed' | 'dropped'

// ────────────────────────────────────────────────────────────
// Database Type (compatível com createClient<Database>)
// ────────────────────────────────────────────────────────────

export interface Database {
  public: {
    Tables: {
      finances: {
        Row: {
          id: string
          user_id: string
          title: string
          amount: number
          type: TransactionType
          category: string
          description: string | null
          date: string
          is_recurring: boolean
          metadata: FinanceMetadata
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          amount: number
          type: TransactionType
          category?: string
          description?: string | null
          date?: string
          is_recurring?: boolean
          metadata?: FinanceMetadata
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          amount?: number
          type?: TransactionType
          category?: string
          description?: string | null
          date?: string
          is_recurring?: boolean
          metadata?: FinanceMetadata
          updated_at?: string
        }
      }

      playlists: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          platform: PlaylistPlatform
          cover_url: string | null
          is_public: boolean
          tracks: PlaylistTrack[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          platform: PlaylistPlatform
          cover_url?: string | null
          is_public?: boolean
          tracks?: PlaylistTrack[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          platform?: PlaylistPlatform
          cover_url?: string | null
          is_public?: boolean
          tracks?: PlaylistTrack[]
          updated_at?: string
        }
      }

      games_library: {
        Row: {
          id: string
          user_id: string
          title: string
          slug: string | null
          rawg_id: number | null
          platform: string | null
          genre: string | null
          rating: number | null
          cover_url: string | null
          status: GameStatus
          playtime_hours: number
          notes: string | null
          favorite: boolean
          metadata: GameMetadata
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          slug?: string | null
          rawg_id?: number | null
          platform?: string | null
          genre?: string | null
          rating?: number | null
          cover_url?: string | null
          status?: GameStatus
          playtime_hours?: number
          notes?: string | null
          favorite?: boolean
          metadata?: GameMetadata
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          slug?: string | null
          rawg_id?: number | null
          platform?: string | null
          genre?: string | null
          rating?: number | null
          cover_url?: string | null
          status?: GameStatus
          playtime_hours?: number
          notes?: string | null
          favorite?: boolean
          metadata?: GameMetadata
          updated_at?: string
        }
      }

      notes: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          content_html: string
          tags: string[]
          is_pinned: boolean
          is_archived: boolean
          word_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title?: string
          content?: string
          content_html?: string
          tags?: string[]
          is_pinned?: boolean
          is_archived?: boolean
          word_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          content_html?: string
          tags?: string[]
          is_pinned?: boolean
          is_archived?: boolean
          word_count?: number
          updated_at?: string
        }
      }

      ebooks: {
        Row: {
          id: string
          user_id: string
          google_drive_file_id: string
          title: string
          author: string
          cover_thumbnail_url: string | null
          file_type: EbookFileType
          file_size_bytes: number | null
          total_pages: number | null
          reading_progress: ReadingProgress
          status: EbookStatus
          tags: string[]
          favorite: boolean
          last_read_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          google_drive_file_id: string
          title: string
          author?: string
          cover_thumbnail_url?: string | null
          file_type: EbookFileType
          file_size_bytes?: number | null
          total_pages?: number | null
          reading_progress?: ReadingProgress
          status?: EbookStatus
          tags?: string[]
          favorite?: boolean
          last_read_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          google_drive_file_id?: string
          title?: string
          author?: string
          cover_thumbnail_url?: string | null
          file_type?: EbookFileType
          file_size_bytes?: number | null
          total_pages?: number | null
          reading_progress?: ReadingProgress
          status?: EbookStatus
          tags?: string[]
          favorite?: boolean
          last_read_at?: string | null
          updated_at?: string
        }
      }

      reading_sessions: {
        Row: {
          id: string
          user_id: string
          ebook_id: string
          started_at: string
          ended_at: string | null
          pages_read: number
          duration_minutes: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          ebook_id: string
          started_at?: string
          ended_at?: string | null
          pages_read?: number
          duration_minutes?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          ebook_id?: string
          started_at?: string
          ended_at?: string | null
          pages_read?: number
          duration_minutes?: number
        }
      }

      web_games: {
        Row: {
          id: string
          user_id: string
          title: string
          slug: string
          description: string | null
          game_type: string
          thumbnail_url: string | null
          html_content: string | null
          is_published: boolean
          play_count: number
          high_score: number
          config: WebGameConfig
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          slug: string
          description?: string | null
          game_type?: string
          thumbnail_url?: string | null
          html_content?: string | null
          is_published?: boolean
          play_count?: number
          high_score?: number
          config?: WebGameConfig
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          slug?: string
          description?: string | null
          game_type?: string
          thumbnail_url?: string | null
          html_content?: string | null
          is_published?: boolean
          play_count?: number
          high_score?: number
          config?: WebGameConfig
          updated_at?: string
        }
      }

      ai_conversations: {
        Row: {
          id: string
          user_id: string
          title: string
          model: AIModel
          messages: AIMessage[]
          is_archived: boolean
          token_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title?: string
          model?: AIModel
          messages?: AIMessage[]
          is_archived?: boolean
          token_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          model?: AIModel
          messages?: AIMessage[]
          is_archived?: boolean
          token_count?: number
          updated_at?: string
        }
      }
    }

    Views: {
      [_ in never]: never
    }

    Functions: {
      [_ in never]: never
    }

    Enums: {
      transaction_type: TransactionType
      playlist_platform: PlaylistPlatform
      ebook_file_type: EbookFileType
      ebook_status: EbookStatus
      ai_model: AIModel
    }
  }
}
