-- ============================================================================
-- Supabase Database Setup & RLS Policy Configuration Script
-- ============================================================================
-- 以下のSQLスクリプトをSupabaseの「SQL Editor」で実行してください。
-- これにより、Synapseアプリに必要なテーブル、RLSポリシー、および
-- Authサインアップとユーザープロファイルの自動同期トリガーが設定されます。
-- ============================================================================

-- 1. synapse_users テーブルの作成
CREATE TABLE IF NOT EXISTS public.synapse_users (
  id TEXT PRIMARY KEY, -- email と同一
  name TEXT,
  password TEXT, -- 既存仕様との互換性のためのプレーンパスワード（Authのパスワードとは別管理）
  role TEXT DEFAULT 'sales',
  email TEXT,
  code TEXT,
  login_id TEXT, -- 新規追加：ログインID
  birthday TEXT, -- 新規追加：生年月日 (西暦)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ,
  pwd_changed_at TIMESTAMPTZ
);

-- 2. synapse_storage テーブルの作成
CREATE TABLE IF NOT EXISTS public.synapse_storage (
  key TEXT PRIMARY KEY,
  value JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 自動同期トリガー関数の作成
-- Supabase Auth にユーザーが新規追加（または仮登録）された際、
-- そのユーザー情報を自動的に public.synapse_users テーブルに挿入/更新します。
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.synapse_users (id, name, role, email, code, created_at)
  VALUES (
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', new.email),
    COALESCE(new.raw_user_meta_data->>'role', 'sales'),
    new.email,
    COALESCE(new.raw_user_meta_data->>'code', ''),
    new.created_at
  )
  ON CONFLICT (id) DO UPDATE
  SET
    name = EXCLUDED.name,
    role = COALESCE(EXCLUDED.role, synapse_users.role),
    code = COALESCE(EXCLUDED.code, synapse_users.code);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- トリガーの登録
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. 行レベルセキュリティ (Row Level Security - RLS) の有効化
ALTER TABLE public.synapse_storage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.synapse_users ENABLE ROW LEVEL SECURITY;

-- 5. synapse_storage に対するセキュリティポリシー設定
-- [ポリシーA] 認証済みのすべてのログインユーザーは、データを読み取る(SELECT)ことができます。
DROP POLICY IF EXISTS "Allow authenticated read access" ON public.synapse_storage;
CREATE POLICY "Allow authenticated read access"
  ON public.synapse_storage
  FOR SELECT
  TO authenticated
  USING (true);

-- [ポリシーB] 役割(role)が 'owner' のユーザーのみ、データの新規作成・更新・削除が可能です。
DROP POLICY IF EXISTS "Allow write/update for owner only" ON public.synapse_storage;
CREATE POLICY "Allow write/update for owner only"
  ON public.synapse_storage
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.synapse_users
      WHERE synapse_users.id = auth.jwt()->>'email' AND synapse_users.role = 'owner'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.synapse_users
      WHERE synapse_users.id = auth.jwt()->>'email' AND synapse_users.role = 'owner'
    )
  );

-- 6. synapse_users に対するセキュリティポリシー設定
-- [ポリシーC] 認証済みのすべてのログインユーザーは、他のユーザープロファイルを参照(SELECT)できます。
DROP POLICY IF EXISTS "Allow authenticated select synapse_users" ON public.synapse_users;
CREATE POLICY "Allow authenticated select synapse_users"
  ON public.synapse_users
  FOR SELECT
  TO authenticated
  USING (true);

-- [ポリシーD] 役割(role)が 'owner' のユーザーのみ、ユーザー情報の変更(作成・更新・削除)が可能です。
DROP POLICY IF EXISTS "Allow owner manage synapse_users" ON public.synapse_users;
CREATE POLICY "Allow owner manage synapse_users"
  ON public.synapse_users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.synapse_users
      WHERE synapse_users.id = auth.jwt()->>'email' AND synapse_users.role = 'owner'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.synapse_users
      WHERE synapse_users.id = auth.jwt()->>'email' AND synapse_users.role = 'owner'
    )
  );

-- 7. 初期のオーナーアカウント用シード（DBに最初の管理者を作成するための安全弁）
-- ※認証用のメールアドレス owner@synapse.management などを登録する前に、
-- public.synapse_users 側に最初のownerを定義しておくことで、RLSでエラーになるのを防ぎます。
INSERT INTO public.synapse_users (id, name, role, email, code)
VALUES ('owner@synapse.management', 'オーナー', 'owner', 'owner@synapse.management', '4X9N3K75')
ON CONFLICT (id) DO NOTHING;
