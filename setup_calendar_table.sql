-- ============================================================================
-- Supabase Database Setup & RLS Policy Configuration for Shared Calendar
-- ============================================================================
-- 以下のSQLスクリプトをSupabaseの「SQL Editor」で実行してください。
-- これにより、カレンダー予定を保存・共有するためのテーブルとRLSポリシーが設定されます。
-- ============================================================================

-- 1. synapse_calendar_events テーブルの作成
CREATE TABLE IF NOT EXISTS public.synapse_calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES public.synapse_users(id) ON DELETE CASCADE,
  user_name TEXT, -- 予定に表示する登録者名
  title TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  location TEXT,
  description TEXT,
  category TEXT DEFAULT '一般', -- 予定のカテゴリ (例: 会議, 作業, プライベート)
  color TEXT DEFAULT '#3b82f6', -- 予定の表示色
  shared_with TEXT[] DEFAULT ARRAY['*']::text[], -- 共有先メールアドレス配列。'*' は全員、空配列は自分のみ、または特定メールリスト
  is_google_event BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 行レベルセキュリティ (RLS) の有効化
ALTER TABLE public.synapse_calendar_events ENABLE ROW LEVEL SECURITY;

-- 3. 行レベルセキュリティ (RLS) ポリシーの設定

-- 【閲覧ポリシー】
-- ログインしているすべてのユーザーに対し、以下のいずれかに該当する予定のSELECTを許可します。
--   - 自分が作成者である (user_id = auth.jwt()->>'email')
--   - 共有先に自分のメールアドレスが含まれている (shared_with @> ARRAY[auth.jwt()->>'email'])
--   - 共有先に全員共有を示す '*' が含まれている (shared_with @> ARRAY['*'])
DROP POLICY IF EXISTS "Allow authenticated users to read all events" ON public.synapse_calendar_events;
DROP POLICY IF EXISTS "Allow read shared events" ON public.synapse_calendar_events;
CREATE POLICY "Allow read shared events"
  ON public.synapse_calendar_events
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.jwt()->>'email' OR
    shared_with @> ARRAY[auth.jwt()->>'email']::text[] OR
    shared_with @> ARRAY['*']::text[] OR
    shared_with IS NULL
  );

-- 【編集ポリシー】
-- 作成者本人（user_idがログインメールアドレスと一致）のみ、INSERT/UPDATE/DELETEを許可します。
DROP POLICY IF EXISTS "Allow users to manage their own events" ON public.synapse_calendar_events;
CREATE POLICY "Allow users to manage their own events"
  ON public.synapse_calendar_events
  FOR ALL
  TO authenticated
  USING (user_id = auth.jwt()->>'email')
  WITH CHECK (user_id = auth.jwt()->>'email');
