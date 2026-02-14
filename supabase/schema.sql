-- ============================================================
-- HUB PESSOAL — Schema Completo (Supabase / PostgreSQL 17)
-- Projeto: AmaroHome
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 0. EXTENSÕES & HELPERS
-- ────────────────────────────────────────────────────────────

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;

-- ────────────────────────────────────────────────────────────
-- 1. ENUMS
-- ────────────────────────────────────────────────────────────

CREATE TYPE public.transaction_type AS ENUM ('income', 'expense');

CREATE TYPE public.playlist_platform AS ENUM ('youtube', 'spotify');

CREATE TYPE public.ebook_file_type AS ENUM ('pdf', 'epub');

CREATE TYPE public.ebook_status AS ENUM ('want_to_read', 'reading', 'finished', 'abandoned');

CREATE TYPE public.ai_model AS ENUM ('gemini', 'openai', 'claude');

-- ────────────────────────────────────────────────────────────
-- 2. TABELAS
-- ────────────────────────────────────────────────────────────

-- ========================
-- 2.1  FINANCES
-- ========================
CREATE TABLE public.finances (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  title       TEXT NOT NULL,
  amount      NUMERIC(12,2) NOT NULL,
  type        public.transaction_type NOT NULL,
  category    TEXT NOT NULL DEFAULT 'other',
  description TEXT,
  date        DATE NOT NULL DEFAULT CURRENT_DATE,
  is_recurring BOOLEAN DEFAULT false,
  metadata    JSONB DEFAULT '{}',

  created_at  TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.finances IS 'Transações financeiras pessoais (receitas e despesas)';

-- ========================
-- 2.2  PLAYLISTS
-- ========================
CREATE TABLE public.playlists (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  title       TEXT NOT NULL,
  description TEXT,
  platform    public.playlist_platform NOT NULL,
  cover_url   TEXT,
  is_public   BOOLEAN DEFAULT false,
  tracks      JSONB DEFAULT '[]',
  -- tracks: [{ title, url, embed_url, thumbnail, duration, artist, position }]

  created_at  TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.playlists IS 'Playlists de YouTube e Spotify com embed URLs';

-- ========================
-- 2.3  GAMES LIBRARY
-- ========================
CREATE TABLE public.games_library (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  title       TEXT NOT NULL,
  slug        TEXT,
  rawg_id     INTEGER,
  platform    TEXT,
  genre       TEXT,
  rating      NUMERIC(3,1) CHECK (rating >= 0 AND rating <= 10),
  cover_url   TEXT,
  status      TEXT DEFAULT 'backlog' CHECK (status IN ('backlog','playing','completed','dropped')),
  playtime_hours NUMERIC(7,1) DEFAULT 0,
  notes       TEXT,
  favorite    BOOLEAN DEFAULT false,
  metadata    JSONB DEFAULT '{}',
  -- metadata: { release_date, developer, publisher, screenshots[], esrb_rating }

  created_at  TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.games_library IS 'Biblioteca visual de jogos com dados do RAWG';

-- ========================
-- 2.4  NOTES
-- ========================
CREATE TABLE public.notes (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  title       TEXT NOT NULL DEFAULT 'Sem título',
  content     TEXT DEFAULT '',
  content_html TEXT DEFAULT '',
  tags        TEXT[] DEFAULT '{}',
  is_pinned   BOOLEAN DEFAULT false,
  is_archived BOOLEAN DEFAULT false,
  word_count  INTEGER DEFAULT 0,

  created_at  TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.notes IS 'Área de escrita com editor de texto rico';

-- ========================
-- 2.5  EBOOKS
-- ========================
CREATE TABLE public.ebooks (
  id                    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id               UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  google_drive_file_id  TEXT NOT NULL,
  title                 TEXT NOT NULL,
  author                TEXT DEFAULT 'Desconhecido',
  cover_thumbnail_url   TEXT,
  file_type             public.ebook_file_type NOT NULL,
  file_size_bytes       BIGINT,
  total_pages           INTEGER,
  reading_progress      JSONB DEFAULT '{"page": 0, "percentage": 0}',
  -- reading_progress: { page: number, percentage: number, cfi?: string (EPUB) }
  status                public.ebook_status DEFAULT 'want_to_read',
  tags                  TEXT[] DEFAULT '{}',
  favorite              BOOLEAN DEFAULT false,
  last_read_at          TIMESTAMPTZ,

  created_at            TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at            TIMESTAMPTZ DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.ebooks IS 'Metadados de eBooks armazenados no Google Drive';

-- ========================
-- 2.6  READING SESSIONS
-- ========================
CREATE TABLE public.reading_sessions (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  ebook_id        UUID REFERENCES public.ebooks(id) ON DELETE CASCADE NOT NULL,

  started_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at        TIMESTAMPTZ,
  pages_read      INTEGER DEFAULT 0,
  duration_minutes INTEGER DEFAULT 0,

  created_at      TIMESTAMPTZ DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.reading_sessions IS 'Sessões de leitura para estatísticas';

-- ========================
-- 2.7  WEB GAMES
-- ========================
CREATE TABLE public.web_games (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  title       TEXT NOT NULL,
  slug        TEXT NOT NULL,
  description TEXT,
  game_type   TEXT DEFAULT 'custom',
  thumbnail_url TEXT,
  html_content TEXT,
  is_published BOOLEAN DEFAULT false,
  play_count  INTEGER DEFAULT 0,
  high_score  INTEGER DEFAULT 0,
  config      JSONB DEFAULT '{}',
  -- config: { width, height, controls, difficulty, colors, ... }

  created_at  TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT now() NOT NULL,

  UNIQUE(user_id, slug)
);

COMMENT ON TABLE public.web_games IS 'Games web personalizados criados pelo usuário';

-- ========================
-- 2.8  AI CONVERSATIONS
-- ========================
CREATE TABLE public.ai_conversations (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  title       TEXT NOT NULL DEFAULT 'Nova conversa',
  model       public.ai_model NOT NULL DEFAULT 'gemini',
  messages    JSONB DEFAULT '[]',
  -- messages: [{ role: 'user'|'assistant', content: string, timestamp: string }]
  is_archived BOOLEAN DEFAULT false,
  token_count INTEGER DEFAULT 0,

  created_at  TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.ai_conversations IS 'Histórico de conversas com assistente IA';

-- ────────────────────────────────────────────────────────────
-- 3. TRIGGERS — auto-update updated_at
-- ────────────────────────────────────────────────────────────

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.finances
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.playlists
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.games_library
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.notes
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.ebooks
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.web_games
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.ai_conversations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ────────────────────────────────────────────────────────────
-- 4. ÍNDICES
-- ────────────────────────────────────────────────────────────

-- Finances
CREATE INDEX idx_finances_user_id ON public.finances(user_id);
CREATE INDEX idx_finances_date ON public.finances(user_id, date DESC);
CREATE INDEX idx_finances_category ON public.finances(user_id, category);
CREATE INDEX idx_finances_type ON public.finances(user_id, type);

-- Playlists
CREATE INDEX idx_playlists_user_id ON public.playlists(user_id);
CREATE INDEX idx_playlists_platform ON public.playlists(user_id, platform);

-- Games Library
CREATE INDEX idx_games_library_user_id ON public.games_library(user_id);
CREATE INDEX idx_games_library_status ON public.games_library(user_id, status);
CREATE INDEX idx_games_library_rawg_id ON public.games_library(rawg_id);

-- Notes
CREATE INDEX idx_notes_user_id ON public.notes(user_id);
CREATE INDEX idx_notes_pinned ON public.notes(user_id, is_pinned DESC, updated_at DESC);
CREATE INDEX idx_notes_tags ON public.notes USING GIN(tags);

-- eBooks
CREATE INDEX idx_ebooks_user_id ON public.ebooks(user_id);
CREATE INDEX idx_ebooks_status ON public.ebooks(user_id, status);
CREATE INDEX idx_ebooks_favorite ON public.ebooks(user_id, favorite) WHERE favorite = true;
CREATE INDEX idx_ebooks_tags ON public.ebooks USING GIN(tags);
CREATE INDEX idx_ebooks_drive_file ON public.ebooks(google_drive_file_id);

-- Reading Sessions
CREATE INDEX idx_reading_sessions_user_id ON public.reading_sessions(user_id);
CREATE INDEX idx_reading_sessions_ebook ON public.reading_sessions(ebook_id, started_at DESC);

-- Web Games
CREATE INDEX idx_web_games_user_id ON public.web_games(user_id);
CREATE INDEX idx_web_games_slug ON public.web_games(user_id, slug);

-- AI Conversations
CREATE INDEX idx_ai_conversations_user_id ON public.ai_conversations(user_id);
CREATE INDEX idx_ai_conversations_recent ON public.ai_conversations(user_id, updated_at DESC);

-- ────────────────────────────────────────────────────────────
-- 5. ROW LEVEL SECURITY (RLS)
-- ────────────────────────────────────────────────────────────

-- Habilita RLS em todas as tabelas
ALTER TABLE public.finances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ebooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.web_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;

-- ── FINANCES ──
CREATE POLICY "finances_select_own" ON public.finances
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "finances_insert_own" ON public.finances
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "finances_update_own" ON public.finances
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "finances_delete_own" ON public.finances
  FOR DELETE USING (auth.uid() = user_id);

-- ── PLAYLISTS ──
CREATE POLICY "playlists_select_own" ON public.playlists
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "playlists_insert_own" ON public.playlists
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "playlists_update_own" ON public.playlists
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "playlists_delete_own" ON public.playlists
  FOR DELETE USING (auth.uid() = user_id);

-- ── GAMES LIBRARY ──
CREATE POLICY "games_library_select_own" ON public.games_library
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "games_library_insert_own" ON public.games_library
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "games_library_update_own" ON public.games_library
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "games_library_delete_own" ON public.games_library
  FOR DELETE USING (auth.uid() = user_id);

-- ── NOTES ──
CREATE POLICY "notes_select_own" ON public.notes
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notes_insert_own" ON public.notes
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "notes_update_own" ON public.notes
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "notes_delete_own" ON public.notes
  FOR DELETE USING (auth.uid() = user_id);

-- ── EBOOKS ──
CREATE POLICY "ebooks_select_own" ON public.ebooks
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "ebooks_insert_own" ON public.ebooks
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "ebooks_update_own" ON public.ebooks
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "ebooks_delete_own" ON public.ebooks
  FOR DELETE USING (auth.uid() = user_id);

-- ── READING SESSIONS ──
CREATE POLICY "reading_sessions_select_own" ON public.reading_sessions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "reading_sessions_insert_own" ON public.reading_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reading_sessions_update_own" ON public.reading_sessions
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reading_sessions_delete_own" ON public.reading_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- ── WEB GAMES ──
CREATE POLICY "web_games_select_own" ON public.web_games
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "web_games_insert_own" ON public.web_games
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "web_games_update_own" ON public.web_games
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "web_games_delete_own" ON public.web_games
  FOR DELETE USING (auth.uid() = user_id);

-- ── AI CONVERSATIONS ──
CREATE POLICY "ai_conversations_select_own" ON public.ai_conversations
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "ai_conversations_insert_own" ON public.ai_conversations
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "ai_conversations_update_own" ON public.ai_conversations
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "ai_conversations_delete_own" ON public.ai_conversations
  FOR DELETE USING (auth.uid() = user_id);
