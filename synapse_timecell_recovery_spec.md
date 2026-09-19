# 🏛️ Synapse TimeCell Recovery（セル単位タイムトラベル＆履歴復元）詳細設計書

**バージョン:** 1.0  
**対象システム:** Synapse Core (`app.js`), スプレッドシート / テーブル機能 (`state.customTables`), 監査・復元エンジン  
**作成日:** 2026年9月18日  

---

## 1. エグゼクティブサマリー & ガバナンス（権限統制）

### 1.1 背景と目的
Synapseのマスターテーブルおよびスプレッドシート機能において、複数ユーザーによる同時編集や日常業務での誤入力・誤削除・一括上書きが発生した際、**「過去の任意の一時点」「特定セルの値」を安全に復元（TimeCell Recovery）** できる機能を提供します。

### 1.2 管理者限定付与（Admin-Only Enforcement）
* **権限制約:**
  * **本機能（TimeCell Recovery）の起動・閲覧・復元実行は、システム管理者（`role: 'admin'`）にのみ付与** します。
  * 一般ユーザー・閲覧者・外部パートナーのアカウントでは、履歴ボタンおよび復元メニューはUI上から完全に非表示・アクセス不可となります。
* **権限チェック機構:**
  ```javascript
  // 権限検証ガード
  function checkTimeCellRecoveryPermission(currentUser) {
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error("403 Forbidden: TimeCell Recovery機能はシステム管理者にのみ許可されています。");
    }
    return true;
  }
  ```

---

## 2. セッション・連続操作のグループ化（Googleスプレッドシート方式）

### 2.1 課題
セルを1文字ずつ入力したり、連続して数行を編集した際に、ログが1行ずつバラバラに記録されると、履歴リストが数千件に膨れ上がり、管理者が復元対象を探すのが極めて困難になります。

### 2.2 Googleスプレッドシート方式のグループ化仕様
* **セッション判定ルール:**
  1. **同一ユーザー** かつ **同一テーブル**
  2. **最後の操作から一定時間以内（デフォルト: 10分以内）の連続操作**
  3. **1つのログインセッション内の操作**
* **階層表示構造（UI）:**
  ```
  ▼ 2026年9月18日 14:30 - 14:42 (12分間) - 佐藤 健一 (管理者) [計 14件の変更]
      ├─ 14:42  [セル更新] A5: "株式会社B" ➔ "株式会社B (確定)"
      ├─ 14:38  [セル更新] C5: "350,000" ➔ "420,000"
      ├─ 14:35  [行追加]   行12 新規登録
      └─ 14:30  [セル更新] B2: "一次代理店" ➔ "総代理店"
  ▶ 2026年9月18日 11:15 - 11:20 (5分間) - 田中 次郎 (一般ユーザー) [計 3件の変更]
  ▶ 2026年9月17日 17:02 (1件) - システムバッチ自動同期 [計 1件の変更]
  ```
  * 管理者は、親グループ（大きな変更セッション）単位でワンクリック復元することも、アコーディオンを展開して「特定セル1箇所だけ」をピンポイントで復元することも可能です。

---

## 3. 多次元絞り込みフィルター仕様

管理者が膨大な履歴の中から目的の変更箇所を瞬時に特定できるよう、以下の3系統の直感的なフィルターを提供します。

### 3.1 ① ユーザー指定（複数指定可能 Multi-select）
* 操作を行ったユーザーをチェックボックス付きドロップダウンで複数指定可能。
* 例：`[✔ 佐藤 健一] [✔ 田中 次郎]` ➔ 指定した2名による操作履歴のみを抽出。
* 「システム自動連携」「AI自動補正」などのボットアカウントも個別に選択・除外可能。

### 3.2 ② 操作種別指定（複数指定可能 Multi-select）
テーブルに対する操作タイプごとに絞り込みが可能です：

| 操作種別コード | 操作名 | 内容 |
| :--- | :--- | :--- |
| `CELL_UPDATE` | セル値の変更 | 特定セルの手動編集・計算結果更新 |
| `ROW_INSERT` | 行の新規追加 | レコードの追加、フォームからの新規送信受領 |
| `ROW_DELETE` | 行の削除 | レコードの削除・アーカイブ |
| `COL_MUTATE` | 列の変更・追加 | カラム名の変更、新規列追加、列削除 |
| `BULK_PASTE` | 一括ペースト/インポート | CSVインポート、複数セルのコピー＆ペースト |
| `FORMULA_CHANGE` | 計算式の変更 | 関数・参照式の書き換え |

### 3.3 ③ 日時指定（柔軟な3パターン指定）
管理者の探索ニーズに合わせ、3通りの日付・時刻指定をサポートします：

1. **特定日時指定（ピンポイント特定）:**
   * 例: `2026-09-18 14:30` 時点の状態を即座にシミュレーション。
2. **特定の複数日時指定（飛び飛びのマルチピック）:**
   * 例: 「9月1日 00:00」「9月10日 12:00」「9月18日 15:00」の3時点を同時選択し、それぞれの値の変遷を横並び比較。
3. **期間指定（Date Range）:**
   * 開始日時 〜 終了日時のスライダーまたはカレンダー範囲選択。
   * プリセットボタン完備: `[今日]` `[過去24時間]` `[過去7日間]` `[今月]` `[全期間]`

---

## 4. データモデル・ログスキーマ設計

### 4.1 監査ログテーブル (`table_audit_logs`)

```sql
CREATE TABLE table_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_id VARCHAR(64) NOT NULL,            -- 対象テーブルID
    session_group_id VARCHAR(64) NOT NULL,    -- 連続操作グループID
    user_id UUID NOT NULL,                    -- 操作実行者
    user_name VARCHAR(128) NOT NULL,          -- 操作者表示名
    user_role VARCHAR(32) NOT NULL,           -- 操作時のロール ('admin', 'member' 等)
    action_type VARCHAR(32) NOT NULL,         -- CELL_UPDATE, ROW_INSERT 等
    row_id VARCHAR(64),                       -- 対象行識別子
    col_key VARCHAR(64),                      -- 対象列キー
    cell_coordinate VARCHAR(16),              -- 'B5' 等の表示用座標
    old_value JSONB,                          -- 変更前の値
    new_value JSONB,                          -- 変更後の値
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 高速検索・グループ化のための複合インデックス
CREATE INDEX idx_audit_table_time ON table_audit_logs(table_id, created_at DESC);
CREATE INDEX idx_audit_session_group ON table_audit_logs(session_group_id);
CREATE INDEX idx_audit_user_action ON table_audit_logs(user_id, action_type);
```

### 4.2 セッション・グループ化ビュー（集計ロジック）

```sql
-- 10分以内の連続操作を1つのセッションにまとめるウィンドウ集計
CREATE OR REPLACE VIEW view_grouped_table_sessions AS
SELECT 
    session_group_id,
    table_id,
    user_id,
    user_name,
    user_role,
    MIN(created_at) AS session_start,
    MAX(created_at) AS session_end,
    COUNT(*) AS total_changes,
    JSONB_AGG(
        JSONB_BUILD_OBJECT(
            'log_id', id,
            'action_type', action_type,
            'coordinate', cell_coordinate,
            'col_key', col_key,
            'old_value', old_value,
            'new_value', new_value,
            'created_at', created_at
        ) ORDER BY created_at DESC
    ) AS operations
FROM table_audit_logs
GROUP BY session_group_id, table_id, user_id, user_name, user_role;
```

---

## 5. UI/UX 画面設計（TimeCell Recovery ドロワー）

管理者のみがテーブル右上メニューの **「🕒 TimeCell Recovery（変更履歴・復元）」** をクリックした際に、右側から専用ドロワーがスライドインします。

```
┌─────────────────────────────────────────────────────────────┐
│ 🕒 TimeCell Recovery (変更履歴 & セル復元)  [管理者専用]   ✕ │
├─────────────────────────────────────────────────────────────┤
│ 🔍 フィルター条件設定                                        │
│  • ユーザー: [✔ 全員] [✔ 佐藤健一] [ 田中次郎] (複数選択可)  │
│  • 操作種別: [✔ 全種別] [✔ セル変更] [✔ 行削除]             │
│  • 日時指定: [期間指定: 2026/09/01 00:00 〜 2026/09/18 15:00]│
│             [特定日時ピンポイント] [複数日時ピック]           │
├─────────────────────────────────────────────────────────────┤
│ 履歴セッション一覧 (Googleスプレッドシート風グループ表示)    │
│                                                             │
│ ▼ 2026/09/18 14:30 - 14:42 (12分間) 佐藤 健一 [14件の変更]  │
│   [このセッション全体を一括復元する]                         │
│   ├─ 14:42 B5セル: "株式会社B" ➔ "株式会社B (確定)"         │
│   │        [↩ このセルのみ 14:42 直前の値に復元]            │
│   ├─ 14:38 C5セル: "350,000" ➔ "420,000"                    │
│   │        [↩ このセルのみ復元]                              │
│   └─ 14:35 行12: 新規行追加                                 │
│            [↩ この行追加を取り消す]                          │
│                                                             │
│ ▶ 2026/09/17 11:10 - 11:15 (5分間) 田中 次郎 [3件の変更]   │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. 復元実行時のフェイルセーフ設計

1. **差分プレビュー確認モーダル:**
   * 「復元」ボタンを押した際、即座に書き換えるのではなく、**「復元前の現在値」と「復元後の値」の差分ハイライト（赤・緑）** を管理者に提示し、承認を促す。
2. **復元自体の監査記録（Reversible Recovery）:**
   * 復元操作自体も新たな監査ログ（`action_type: 'RECOVERY_EXECUTED'`）として記録されるため、万が一間違った時点に復元してしまっても、復元前の状態へいつでも再復元可能です。
