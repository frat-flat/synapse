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
  login_id TEXT, -- ログインID
  birthday TEXT, -- 生年月日 (西暦)
  phone_number TEXT, -- 新規追加：電話番号
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
  INSERT INTO public.synapse_users (id, name, role, email, code, phone_number, created_at)
  VALUES (
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', new.email),
    COALESCE(new.raw_user_meta_data->>'role', 'sales'),
    new.email,
    COALESCE(new.raw_user_meta_data->>'code', ''),
    COALESCE(new.raw_user_meta_data->>'phone', new.raw_user_meta_data->>'phone_number', ''),
    new.created_at
  )
  ON CONFLICT (id) DO UPDATE
  SET
    name = EXCLUDED.name,
    role = COALESCE(EXCLUDED.role, synapse_users.role),
    code = COALESCE(EXCLUDED.code, synapse_users.code),
    phone_number = COALESCE(EXCLUDED.phone_number, synapse_users.phone_number);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- トリガーの登録
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
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

-- [ポリシーE] ユーザー自身による自分自身のプロファイルの更新を許可します（本登録および暗証番号・電話番号同期用）
DROP POLICY IF EXISTS "Allow users to update their own profile" ON public.synapse_users;
CREATE POLICY "Allow users to update their own profile"
  ON public.synapse_users
  FOR UPDATE
  TO authenticated
  USING (id = auth.jwt()->>'email')
  WITH CHECK (id = auth.jwt()->>'email');

-- 7. synapse_user_devices テーブルの作成（認証済み端末管理用）
CREATE TABLE IF NOT EXISTS public.synapse_user_devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES public.synapse_users(id) ON DELETE CASCADE,
  device_token TEXT NOT NULL,
  device_name TEXT,
  device_type TEXT CHECK (device_type IN ('smartphone', 'tablet', 'desktop')),
  last_used_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLSの有効化
ALTER TABLE public.synapse_user_devices ENABLE ROW LEVEL SECURITY;

-- セキュリティポリシー：自分自身のデバイスのみ閲覧・追加が可能、ownerはすべてのデバイスを管理（削除）可能
DROP POLICY IF EXISTS "Allow users to read their own devices" ON public.synapse_user_devices;
CREATE POLICY "Allow users to read their own devices" ON public.synapse_user_devices
  FOR SELECT TO authenticated USING (user_id = auth.jwt()->>'email');

DROP POLICY IF EXISTS "Allow users to insert their own devices" ON public.synapse_user_devices;
CREATE POLICY "Allow users to insert their own devices" ON public.synapse_user_devices
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.jwt()->>'email');

DROP POLICY IF EXISTS "Allow owner to manage all devices" ON public.synapse_user_devices;
CREATE POLICY "Allow owner to manage all devices" ON public.synapse_user_devices
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.synapse_users
      WHERE synapse_users.id = auth.jwt()->>'email' AND synapse_users.role = 'owner'
    )
  );

-- 8. 初期のオーナーアカウント用シード（DBに最初の管理者を作成するための安全弁）
-- ※認証用のメールアドレス owner@synapse.management などを登録する前に、
-- public.synapse_users 側に最初のownerを定義しておくことで、RLSでエラーになるのを防ぎます。
-- 既存のテーブルがある場合に備えて password カラムの NOT NULL 制約を解除する
ALTER TABLE public.synapse_users ALTER COLUMN password DROP NOT NULL;

INSERT INTO public.synapse_users (id, name, password, role, email, code)
VALUES ('owner@synapse.management', 'オーナー', 'temporary_password_please_change', 'owner', 'owner@synapse.management', 'OWNER_SEED_INIT_CODE')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 9. Party ID 発行用 RPC 関数の作成 (generate_party_id)
-- 競合のない一意の8桁のParty IDをシーケンスベースで安全に生成します。
-- SECURITY DEFINER を指定し、非特権ユーザー（anonなど）からの呼び出しでも synapse_storage の更新を行えるようにします。
-- ============================================================================
CREATE OR REPLACE FUNCTION public.generate_party_id(
  source_system text,
  is_temporary boolean
)
RETURNS text AS $$
DECLARE
  current_seq bigint;
  next_seq bigint;
  chars text := 'ACEFGHJKMNPQRSTWXY345679';
  M bigint := 331776; -- 24^4
  l bigint;
  r bigint;
  next_l bigint;
  next_r bigint;
  round int;
  keys bigint[] := ARRAY[1518500249, 1859775393, 2400959708, 3395469782];
  hash_val bigint;
  fnv_prime bigint := 16777619;
  Y bigint;
  temp bigint;
  id text := '';
  idx int;
BEGIN
  -- synapse_storage から現在のシーケンス番号を取得し、行をロックする
  SELECT COALESCE((value#>>'{}')::bigint, 300)
  INTO current_seq
  FROM public.synapse_storage
  WHERE key = 'synapse_id_sequence'
  FOR UPDATE;

  -- レコードが存在しない場合は初期値を設定する
  IF NOT FOUND THEN
    current_seq := 300;
  END IF;

  -- シーケンス番号をインクリメント
  next_seq := current_seq + 1;

  -- インクリメントしたシーケンス番号を synapse_storage に書き戻す
  INSERT INTO public.synapse_storage (key, value, updated_at)
  VALUES ('synapse_id_sequence', to_jsonb(next_seq), now())
  ON CONFLICT (key) DO UPDATE
  SET value = to_jsonb(next_seq), updated_at = now();

  -- 8桁の英数字IDを生成 (Format-Preserving Encryption)
  l := (next_seq / M) % M;
  r := next_seq % M;

  FOR round IN 0..3 LOOP
    -- R ^ key
    hash_val := (r # keys[round + 1]) & 4294967295;
    -- hash * 16777619 (double precision での乗算とキャストによる丸め込み)
    hash_val := (hash_val::double precision * fnv_prime::double precision)::bigint & 4294967295;
    -- hash ^ (hash >>> 16)
    hash_val := (hash_val # (hash_val >> 16)) & 4294967295;
    
    next_l := r;
    next_r := (l + hash_val) % M;
    l := next_l;
    r := next_r;
  END LOOP;

  Y := l * M + r;
  temp := Y;
  FOR round IN 1..8 LOOP
    idx := (temp % 24) + 1;
    id := id || substr(chars, idx, 1);
    temp := temp / 24;
  END LOOP;

  RETURN id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

