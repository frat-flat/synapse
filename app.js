// ==========================================
// Synapse - app.js
// ==========================================

// ==========================================
// デバッグログパネルの無効化
// ==========================================
window.logToDebugPanel = function() {};


// 初期ダミーデータの定義
const INITIAL_CUSTOMERS = [
  { id: 'F7P3MX9W', name: '山田 太郎', furigana: 'ヤマダ タロウ', phone: '090-1234-5678', email: 'yamada@example.com', corp: '株式会社テストコーポレーション', service: 'JO、代理店', historyCount: 3, relatedCustomerId: 'C3QG6TKA' },
  { id: 'K5N9QR7T', name: '鈴木 花子', furigana: 'スズキ ハナコ', phone: '080-9876-5432', email: 'suzuki@test.jp', corp: '合同会社鈴木商事', service: 'JO契約', historyCount: 1 },
  { id: 'E4H7JS6P', name: '佐藤 一郎', furigana: 'サトウ イチロウ', phone: '070-5555-5555', email: 'sato@sample.co.jp', corp: '株式会社サンプルサービス', service: 'JO、代理店', historyCount: 0 },
  { id: 'A3K9N5W7', name: '田中 健太', furigana: 'タナカ ケンタ', phone: '090-8888-9999', email: 'tanaka@domain.com', corp: '株式会社田中エージェンシー', service: '代理店', historyCount: 5 },
  { id: 'T7P5Y3Q9', name: '渡辺 三郎', furigana: 'ワタナベ サブロウ', phone: '080-3333-4444', email: 'watanabe@sample.com', corp: '渡辺コンサルティング', service: '申込者、代理店', historyCount: 2 }
];

const MOCK_CORPORATES = [
  { name: '株式会社トヨタ', code: '1010001000001', address: '愛知県豊田市トヨタ町1番地' },
  { name: '株式会社ソニー', code: '2010001000002', address: '東京都港区港南1丁目7番1号' },
  { name: '株式会社ソフトバンク', code: '3010001000003', address: '東京都港区海岸1丁目7番1号' },
  { name: '株式会社ディー・エヌ・エー', code: '4010001000004', address: '東京都渋谷区渋谷2丁目24番12号' },
  { name: '株式会社メルカリ', code: '5010001000005', address: '東京都港区六本木6丁目10番1号' },
  { name: '株式会社テストコーポレーション', code: '9010001999999', address: '東京都新宿区西新宿1-1-1' }
];

const MOCK_INTRODUCERS = [
  { id: 'H6K4PN9M', name: '田中 代理店', status: '代理店登録済', company: '株式会社田中エージェンシー', count: 12, similarity: 100 },
  { id: 'P5Q9RS7T', name: '高橋 紹介パートナー', status: 'パートナー', company: '個人パートナー', count: 5, similarity: 90 },
  { id: 'W3X5YT7N', name: '渡辺 エージェント', status: '代理店登録済', company: '渡辺コンサルティング', count: 8, similarity: 80 }
];

// ローカルストレージキー
const STORAGE_KEYS = {
  VERSION: 'synapse_db_version',
  SUPABASE_URL: 'synapse_supabase_url',
  SUPABASE_ANON_KEY: 'synapse_supabase_anon_key',
  CUSTOMERS: 'synapse_customers',
  APPOINTMENTS: 'synapse_appointments',
  PATTERNS: 'synapse_patterns',
  LOGGED_USER: 'synapse_logged_user',
  OFFICIAL_LINKS: 'synapse_official_links',
  JO_VISIBLE_COLUMNS: 'synapse_jo_visible_columns',
  JO_COLUMN_WIDTHS: 'synapse_jo_column_widths',
  JO_FIXED_COL: 'synapse_jo_fixed_col',
  JO_FIXED_ROW: 'synapse_jo_fixed_row',
  JO_CELL_STYLES: 'synapse_jo_cell_styles',
  JO_CONTRACTS: 'synapse_jo_contracts',
  JO_COLUMNS: 'synapse_jo_columns',
  
  AP_VISIBLE_COLUMNS: 'synapse_ap_visible_columns',
  AP_COLUMN_WIDTHS: 'synapse_ap_column_widths',
  AP_FIXED_COL: 'synapse_ap_fixed_col',
  AP_FIXED_ROW: 'synapse_ap_fixed_row',
  AP_CELL_STYLES: 'synapse_ap_cell_styles',
  AP_CONTRACTS: 'synapse_ap_contracts',
  AP_COLUMNS: 'synapse_ap_columns',

  AG_VISIBLE_COLUMNS: 'synapse_ag_visible_columns',
  AG_COLUMN_WIDTHS: 'synapse_ag_column_widths',
  AG_FIXED_COL: 'synapse_ag_fixed_col',
  AG_FIXED_ROW: 'synapse_ag_fixed_row',
  AG_CELL_STYLES: 'synapse_ag_cell_styles',
  AG_CONTRACTS: 'synapse_ag_contracts',
  AG_COLUMNS: 'synapse_ag_columns',

  DBMAKE_VISIBLE_COLUMNS: 'synapse_dbmake_visible_columns',
  DBMAKE_COLUMN_WIDTHS: 'synapse_dbmake_column_widths',
  DBMAKE_FIXED_COL: 'synapse_dbmake_fixed_col',
  DBMAKE_FIXED_ROW: 'synapse_dbmake_fixed_row',
  DBMAKE_CELL_STYLES: 'synapse_dbmake_cell_styles',
  DBMAKE_CONTRACTS: 'synapse_dbmake_contracts',
  DBMAKE_COLUMNS: 'synapse_dbmake_columns',
  ID_SEQUENCE: 'synapse_id_sequence',
  CUSTOM_TABLES: 'synapse_custom_tables',
  PERMISSIONS: 'synapse_permissions',
  AUDIT_LOGS: 'synapse_audit_logs',
  CUSTOM_ACCORDIONS: 'synapse_custom_accordions',
  USER_CUSTOM_ICONS: 'synapse_user_custom_icons',
  JO_ROW_HEIGHTS: 'synapse_jo_row_heights',
  AP_ROW_HEIGHTS: 'synapse_ap_row_heights',
  AG_ROW_HEIGHTS: 'synapse_ag_row_heights'
};

const INITIAL_JO_COLUMNS = [
  { id: 'customerPersonalityId', label: '顧客ID', required: false },
  { id: 'customerId', label: '顧客番号', required: true },
  { id: 'status', label: '運営状況', required: true },
  { id: 'corpName', label: '法人名', required: true },
  { id: 'furigana', label: '法人名（フリガナ）', required: false },
  { id: 'repName', label: '代表者名', required: true },
  { id: 'repFurigana', label: '代表者（フリガナ）', required: false },
  { id: 'appType', label: '申請形態', required: false },
  { id: 'shopName', label: '店舗名', required: false },
  { id: 'shopMedia', label: 'ショップ媒体', required: false },
  { id: 'shopUrl', label: 'ショップURL', required: false },
  { id: 'folder', label: 'フォルダ', required: false },
  { id: 'ledgerSheet', label: '帳簿シート', required: false },
  { id: 'contract', label: '契約書', required: false },
  { id: 'rakutenPassed', label: '楽天1次通過', required: false },
  { id: 'handoverDate', label: '引継日', required: false },
  { id: 'rewardStartDate', label: '報酬開始基準日', required: false },
  { id: 'minGuaranteeStartMonth', label: '最低保証開始月', required: false },
  { id: 'stopMonth', label: '停止月', required: false },
  { id: 'folderCreated', label: '格納フォルダ', required: false },
  { id: 'statementDetails', label: '入出金明細', required: false }
];

const INITIAL_AP_COLUMNS = [
  { id: 'customerPersonalityId', label: '顧客ID', required: false },
  { id: 'customerId', label: '顧客番号', required: true },
  { id: 'name', label: '申込者氏名', required: true },
  { id: 'furigana', label: 'フリガナ', required: false },
  { id: 'phone', label: '電話番号', required: true },
  { id: 'email', label: 'メールアドレス', required: false },
  { id: 'date', label: '申込日', required: false },
  { id: 'status', label: '状況', required: false }
];

const INITIAL_AG_COLUMNS = [
  { id: 'customerId', label: '顧客ID', required: false },
  { id: 'name', label: '代理店名', required: true },
  { id: 'status', label: 'ステータス', required: false },
  { id: 'company', label: '提携先会社', required: true },
  { id: 'count', label: '実績アポイント数', required: false }
];

const CURRENT_DB_VERSION = 'v16';
let targetSearchMode = 'main';
let supabaseClient = null;
let isSyncing = false;

// LocalStorageの更新をフックしてSupabaseと自動同期するラッパー
const originalSetItem = localStorage.setItem.bind(localStorage);
localStorage.setItem = function(key, value) {
  originalSetItem(key, value);
  if (!isSyncing && typeof syncToSupabase === 'function') {
    const isTargetKey = Object.values(STORAGE_KEYS).includes(key) || 
                        key === 'synapse_dbmake_partners' || 
                        key.startsWith('SYNAPSE_') || 
                        key.startsWith('synapse_');
    if (isTargetKey) {
      setTimeout(() => {
        syncToSupabase(key, value);
      }, 50);
    }
  }
};

// アプリケーションの状態管理
let state = {
  currentUser: null,
  currentView: 'login-screen',
  defaultStatsType: 'filled', // 選択セル統計の初期表示タイプ（デフォルトは個数）
  customers: [],
  appointments: [],
  patterns: {},
  officialLinks: [],
  connectedLinks: {}, // 現在編集中のアポイントに関連付けられた接続情報
  
  customTables: [], // 作成されたカスタムテーブルの配列
  activeCustomTableId: null, // 現在表示中のカスタムテーブルID
  customAccordions: [], // 管理者が新規作成したサイドバーフォルダ（アコーディオン）
  userCustomIcons: {}, // ユーザーごとのカスタムアイコン設定
  permissions: { folders: {}, tables: {}, columns: {}, rowFilters: {} }, // 詳細アクセス権限データ
  auditLogs: [], // 変更監査ログ
  previewUserId: null, // プレビュー（なりすまし）中の対象ユーザーID
  previewMode: 'hide', // プレビュー表示モード ('hide' | 'grayout')
  defaultZoomLevel: 100, // タブ以外の画面（ホーム等）のズームデフォルト値
  tableEditLocks: {}, // 各テーブルごとの直接編集ロック状態 (テーブルID -> boolean)
  
  // カスタムテーブル用選択情報（グリッド・フォーマット・範囲選択用）
  ctSelectedCell: null,
  ctSelectedRange: null,
  ctSelectedRows: new Set(),
  ctSelectedCols: new Set(),
  ctSelectedCells: new Set(),
  ctColumnSelectAnchor: null,
  ctColumnSelectLast: null,
  joColumnSelectAnchor: null,
  apColumnSelectAnchor: null,
  agColumnSelectAnchor: null,
  dbmakeColumnSelectAnchor: null,
  dbmakeLastSelectedCol: null,
  ctLastSelectedRow: null,
  ctLastSelectedCol: null,
  ctFilters: {}, // 各テーブル内の列フィルタ状態 (テーブルID -> { 列ID -> Set })
  
  isSelecting: false, // ドラッグ範囲選択中フラグ
  isSelectingRows: false,
  isSelectingCols: false,

  joVisibleColumns: [],
  joFilters: {},
  joColumnWidths: {},
  joRowHeights: {},
  joFixedCol: 'none',
  joFixedRow: 'none',
  joCellStyles: {}, 
  joSelectedCell: null, 
  joContracts: [], 
  joColumns: [], 
  joSelectedRow: null, 
  joSelectedCol: null, 
  joSelectedRange: null, // { startRow, startCol, endRow, endCol }
  joSelectedRows: new Set(),
  joSelectedCols: new Set(),
  joSelectedCells: new Set(),
  joLastSelectedRow: null,
  joLastSelectedCol: null,

  apVisibleColumns: [],
  apFilters: {},
  apColumnWidths: {},
  apRowHeights: {},
  apFixedCol: 'none',
  apFixedRow: 'none',
  apCellStyles: {}, 
  apSelectedCell: null, 
  apContracts: [], 
  apColumns: [], 
  apSelectedRow: null, 
  apSelectedCol: null, 
  apSelectedRange: null, // { startRow, startCol, endRow, endCol }
  apSelectedRows: new Set(),
  apSelectedCols: new Set(),
  apSelectedCells: new Set(),
  apLastSelectedRow: null,
  apLastSelectedCol: null,

  agVisibleColumns: [],
  agFilters: {},
  agColumnWidths: {},
  agRowHeights: {},
  agFixedCol: 'none',
  agFixedRow: 'none',
  agCellStyles: {}, 
  agSelectedCell: null, 
  agContracts: [], 
  agColumns: [], 
  agSelectedRow: null, 
  agSelectedCol: null, 
  agSelectedRange: null, // { startRow, startCol, endRow, endCol }
  agSelectedRows: new Set(),
  agSelectedCols: new Set(),
  agSelectedCells: new Set(),
  agLastSelectedRow: null,
  agLastSelectedCol: null,
  
  dbmakeVisibleColumns: ['id', 'registeredName', 'registeredNameKana', 'representativeName', 'phoneNumber', 'email', 'invoiceNum', 'corpNum', 'status', 'recordedBy', 'recordedAt', 'reward', 'remarks'],
  dbmakeFilters: {},
  dbmakeColumnWidths: {
    id: 80,
    registeredName: 180,
    registeredNameKana: 180,
    representativeName: 100,
    phoneNumber: 110,
    email: 180,
    invoiceNum: 120,
    corpNum: 120,
    status: 80,
    recordedBy: 80,
    recordedAt: 100,
    reward: 120,
    remarks: 200
  },
  dbmakeFixedCol: 'none',
  dbmakeFixedRow: 'none',
  dbmakeCellStyles: {}, 
  dbmakeSelectedCell: null, 
  dbmakeSelectedRow: null, 
  dbmakeSelectedCol: null, 
  dbmakeSelectedRange: null,
  dbmakeSelectedRows: new Set(),
  dbmakeSelectedCols: new Set(),
  dbmakeSelectedCells: new Set(),
  dbmakeLastSelectedRow: null,
  dbmakeLastSelectedCol: null,
  dbmakeColumns: [
    { id: 'id', name: '企業コード' },
    { id: 'registeredName', name: '企業名/パートナー名' },
    { id: 'registeredNameKana', name: 'フリガナ' },
    { id: 'representativeName', name: '代表者名' },
    { id: 'phoneNumber', name: '電話番号' },
    { id: 'email', name: 'メールアドレス' },
    { id: 'invoiceNum', name: 'インボイス登録番号' },
    { id: 'corpNum', name: '法人番号' },
    { id: 'status', name: 'ステータス' },
    { id: 'recordedBy', name: '登録者' },
    { id: 'recordedAt', name: '登録日時' },
    { id: 'reward', name: '報酬体系' },
    { id: 'remarks', name: '備考' }
  ],
  
  // フォーム編集時の一時状態
  formMode: 'new', // 'new' | 'existing'
  selectedExistingCustomer: null,
  addedCustomFields: new Set(),
  editingAppointId: null, // 下書き編集用ID
  selectedIntroducer: null, // 選択された紹介者情報

  // 条件付き書式ルール
  conditionalFormats: {
    jo: [],
    ap: [],
    ag: []
  },
  activeCFScreen: 'jo', // モーダル表示中の対象画面: 'jo' | 'ap' | 'ag'

  // タブ管理・状態維持用
  tabs: [], // { id: string, title: string, closable: boolean }
  activeTab: null,
  isFormDirty: false, // フォームが変更されたかどうかのフラグ
  draggingTabId: null
};

// アカウントごとに設定キーを分けて保存・取得するためのヘルパー
function getUserIdSuffix() {
  const loggedUser = localStorage.getItem(STORAGE_KEYS.LOGGED_USER);
  if (loggedUser) {
    try {
      const user = JSON.parse(loggedUser);
      if (user && user.id) {
        return '_' + user.id;
      }
    } catch (e) {
      console.error(e);
    }
  }
  return '';
}

function getSettingsKey(key) {
  if (key && key.startsWith('synapse_jo_')) {
    return key + getUserIdSuffix();
  }
  return key;
}

function getSettingItem(key) {
  return localStorage.getItem(getSettingsKey(key));
}

// 共通DB以外の個人用設定のみをsetSettingItemで保存
function setSettingItem(key, value) {
  localStorage.setItem(getSettingsKey(key), value);
}

// ==========================================
// 1. 初期化処理
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  loadUserCustomIcons();
  ensureStandardAccordionsInState();
  initDatabase();
  setupEventListeners();
  setupJoFormatToolbarEvents(); // 追加
  setupApFormatToolbarEvents();
  setupAgFormatToolbarEvents();
  setupTableCreator();         // 追加
  renderCustomTableList();     // 追加
  setupCustomTableFormatToolbarEvents(); // 追加
  setupCtButtonsEvents();      // 追加
  setupPermissionFeatures();
  updateParentSelectDropdowns();
  initFormatDropdowns();
  initCustomIconModalEvents();
  setupSidebarToggleBtnEvent();
  checkLoginStatus();

  // スクロール時にオーバーフローセルを再調整（バブリングしないためキャプチャフェーズを使用）
  document.addEventListener('scroll', (e) => {
    if (e.target && e.target.classList && e.target.classList.contains('spreadsheet-table-container')) {
      const table = e.target.querySelector('.spreadsheet-table');
      if (table) {
        adjustOverflowCells(table);
      }
    }
  }, true);

  // ウィンドウリサイズ時にもすべてのスプレッドシートテーブルのオーバーフローを再調整
  window.addEventListener('resize', () => {
    document.querySelectorAll('.spreadsheet-table').forEach(table => {
      adjustOverflowCells(table);
    });
  });
});

// 書式設定ツールバーのアライメントドロップダウンを初期化する
function initFormatDropdowns() {
  const prefixes = ['ct', 'ag', 'jo', 'ap', 'dbmake'];
  
  prefixes.forEach(pfx => {
    const types = ['align', 'valign', 'wrap'];
    
    types.forEach(type => {
      const dropdown = document.getElementById(`${pfx}-${type}-dropdown`);
      if (!dropdown) return;
      
      const btn = dropdown.querySelector('.format-dropdown-btn');
      const menu = dropdown.querySelector('.format-dropdown-menu');
      const iconSpan = btn ? btn.querySelector('.dropdown-icon') : null;
      
      if (btn && menu) {
        // 開閉トグル
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          
          // 他のドロップダウンをすべて閉じる
          document.querySelectorAll('.format-dropdown').forEach(d => {
            if (d !== dropdown) d.classList.remove('active');
          });
          document.querySelectorAll('.color-picker-dropdown').forEach(d => {
            d.style.display = 'none';
          });
          
          dropdown.classList.toggle('active');
        });
        
        // 子要素のボタンがクリックされたときにメインボタンの表示を更新し、ドロップダウンを閉じる
        menu.querySelectorAll('.toolbar-btn').forEach(subBtn => {
          subBtn.addEventListener('click', () => {
            if (iconSpan) {
              iconSpan.innerHTML = subBtn.innerHTML;
            }
            dropdown.classList.remove('active');
          });

          // activeクラス変更時の親アイコン画像同期
          const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
              if (mutation.attributeName === 'class' && subBtn.classList.contains('active')) {
                if (iconSpan) {
                  iconSpan.innerHTML = subBtn.innerHTML;
                }
              }
            });
          });
          observer.observe(subBtn, { attributes: true });

          // 初期のactive同期
          if (subBtn.classList.contains('active') && iconSpan) {
            iconSpan.innerHTML = subBtn.innerHTML;
          }
        });
      }
    });
  });
  
  // 外側クリックで閉じる
  document.addEventListener('mousedown', (e) => {
    if (e.target.closest('.format-dropdown')) return;
    document.querySelectorAll('.format-dropdown').forEach(d => {
      d.classList.remove('active');
    });
  }, true);
}

// 連番 (seq) から1対1 (全単射) で衝突のない8桁英数字IDを生成する暗号学的関数 (Format-Preserving Encryption 簡易版)
function encodeSequenceToId(seq) {
  const chars = 'ACEFGHJKMNPQRSTWXY345679';
  const M = 331776; // 24^4
  
  const f = (R, round) => {
    const key = [0x5A827999, 0x6ED9EBA1, 0x8F1BBCDC, 0xCA62C1D6][round];
    let hash = (R ^ key) * 16777619;
    hash = (hash ^ (hash >>> 16)) & 0xFFFFFFFF;
    return Math.abs(hash) % M;
  };

  let l = Math.floor(seq / M) % M;
  let r = seq % M;

  for (let round = 0; round < 4; round++) {
    const nextL = r;
    const nextR = (l + f(r, round)) % M;
    l = nextL;
    r = nextR;
  }

  const Y = l * M + r;

  let temp = Y;
  let id = '';
  for (let i = 0; i < 8; i++) {
    id += chars.charAt(temp % 24);
    temp = Math.floor(temp / 24);
  }
  return id;
}

// 8桁のユニークID生成ヘルパー (シーケンスベースで100%重複なしを保証)
function generate8DigitId() {
  let seq = parseInt(localStorage.getItem(STORAGE_KEYS.ID_SEQUENCE) || '0', 10);
  
  // 初期ダミーデータ（1〜300）との重複を避けるために300からスタート
  if (seq < 300) {
    seq = 300;
  }

  let uniqueId = '';
  let attempts = 0;

  do {
    seq++;
    uniqueId = encodeSequenceToId(seq);
    attempts++;
  } while (
    attempts < 1000 && (
      (state.appointments && state.appointments.some(a => a.id === uniqueId)) ||
      (state.joContracts && state.joContracts.some(j => j.customerPersonalityId === uniqueId || j.customerId === uniqueId)) ||
      (state.apContracts && state.apContracts.some(ap => ap.customerPersonalityId === uniqueId)) ||
      (state.agContracts && state.agContracts.some(ag => ag.customerId === uniqueId)) ||
      (typeof dbmakePartners !== 'undefined' && dbmakePartners && dbmakePartners.some(p => p.id === uniqueId))
    )
  );

  localStorage.setItem(STORAGE_KEYS.ID_SEQUENCE, String(seq));
  return uniqueId;
}

// 重複のない一意な4桁顧客番号を生成するヘルパー（JO情報・申込者情報共通）
function generateUniqueCustomerNumber() {
  let maxNum = 1000;
  if (state.joContracts) {
    state.joContracts.forEach(c => {
      const num = parseInt(c.customerId, 10);
      if (!isNaN(num) && num > maxNum) maxNum = num;
    });
  }
  if (state.apContracts) {
    state.apContracts.forEach(c => {
      const num = parseInt(c.customerId, 10);
      if (!isNaN(num) && num > maxNum) maxNum = num;
    });
  }
  return String(maxNum + 1);
}

/* ============================================================================
   ☁️ Supabase 接続・自動同期エンジン
   ============================================================================ */

// Supabaseクライアントの初期化
function initSupabase() {
  const url = localStorage.getItem(STORAGE_KEYS.SUPABASE_URL);
  const key = localStorage.getItem(STORAGE_KEYS.SUPABASE_ANON_KEY);
  
  if (url && key && window.supabase) {
    try {
      let cleanUrl = url.replace(/[\s\u200B-\u200D\uFEFF\u3000]/g, '');
      if (cleanUrl.endsWith('/')) {
        cleanUrl = cleanUrl.slice(0, -1);
      }
      let cleanKey = key.replace(/[\s\u200B-\u200D\uFEFF\u3000]/g, '');
      supabaseClient = window.supabase.createClient(cleanUrl, cleanKey);
      console.log("[Supabase] Client initialized successfully with URL:", cleanUrl);
      
      // UIの入力欄に初期値を反映する
      const urlInput = document.getElementById('supabase-url');
      const keyInput = document.getElementById('supabase-anon-key');
      if (urlInput) urlInput.value = url;
      if (keyInput) keyInput.value = key;
      
      return true;
    } catch (e) {
      console.error("[Supabase] Failed to create client:", e);
    }
  }
  supabaseClient = null;
  return false;
}

// Supabaseへのデータ送信 (プッシュ)
async function syncToSupabase(key, value) {
  if (!supabaseClient) return;
  try {
    const valString = typeof value === 'string' ? value : JSON.stringify(value);
    const { error } = await supabaseClient
      .from('synapse_storage')
      .upsert({ key: key, value: JSON.parse(valString), updated_at: new Date().toISOString() });
    
    if (error) {
      console.error(`[Supabase] Sync failed for key ${key}:`, error);
    } else {
      console.log(`[Supabase] Sync success for key ${key}`);
    }
  } catch (e) {
    console.error(`[Supabase] Error during syncToSupabase for key ${key}:`, e);
  }
}

// Supabaseからのデータ取得 (プル)
async function syncFromSupabase(showNotification = false) {
  if (!supabaseClient) return;
  try {
    console.log("[Supabase] Pulling latest data from cloud...");
    const { data, error } = await supabaseClient
      .from('synapse_storage')
      .select('*');
    
    if (error) {
      console.error("[Supabase] Pull failed:", error);
      if (showNotification) {
        showToast(`Supabaseデータ同期エラー: ${error.message || '接続失敗'} (Code: ${error.code || 'N/A'})`, "error");
      }
      return;
    }
    
    if (data && data.length > 0) {
      let updatedKeys = [];
      isSyncing = true;
      try {
        data.forEach(item => {
          const localVal = localStorage.getItem(item.key);
          const remoteValStr = JSON.stringify(item.value);
          if (localVal !== remoteValStr) {
            localStorage.setItem(item.key, remoteValStr);
            updatedKeys.push(item.key);
          }
        });
      } finally {
        isSyncing = false;
      }
      
      if (updatedKeys.length > 0) {
        console.log("[Supabase] LocalStorage updated with remote data:", updatedKeys);
        loadStateFromLocalStorage(updatedKeys);
        if (showNotification) {
          showToast("クラウドから最新データを同期しました。", "success");
        }
      } else {
        if (showNotification) {
          showToast("データは既に最新の状態です。", "info");
        }
      }
    }
  } catch (e) {
    console.error("[Supabase] Error during syncFromSupabase:", e);
    if (showNotification) showToast("同期処理中にエラーが発生しました。", "error");
  }
}

// ローカルストレージ更新後のメモリ再ロード関数
function loadStateFromLocalStorage(keys) {
  const userId = state.currentUser ? state.currentUser.id : 'guest';
  const dbmakeSuffix = getUserIdSuffix();
  
  keys.forEach(key => {
    if (key === STORAGE_KEYS.CUSTOMERS) {
      state.customers = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOMERS)) || [];
    } else if (key === STORAGE_KEYS.APPOINTMENTS) {
      state.appointments = JSON.parse(localStorage.getItem(STORAGE_KEYS.APPOINTMENTS)) || [];
    } else if (key === STORAGE_KEYS.JO_CONTRACTS) {
      state.joContracts = JSON.parse(localStorage.getItem(STORAGE_KEYS.JO_CONTRACTS)) || [];
    } else if (key === STORAGE_KEYS.AP_CONTRACTS) {
      state.apContracts = JSON.parse(localStorage.getItem(STORAGE_KEYS.AP_CONTRACTS)) || [];
    } else if (key === STORAGE_KEYS.AG_CONTRACTS) {
      state.agContracts = JSON.parse(localStorage.getItem(STORAGE_KEYS.AG_CONTRACTS)) || [];
    } else if (key === 'synapse_dbmake_partners') {
      dbmakePartners = JSON.parse(localStorage.getItem('synapse_dbmake_partners')) || [];
    } else if (key === STORAGE_KEYS.CUSTOM_TABLES) {
      state.customTables = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOM_TABLES)) || [];
    } else if (key === STORAGE_KEYS.CUSTOM_ACCORDIONS) {
      state.customAccordions = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOM_ACCORDIONS)) || [];
    } else if (key === STORAGE_KEYS.JO_COLUMNS) {
      state.joColumns = JSON.parse(localStorage.getItem(STORAGE_KEYS.JO_COLUMNS));
    } else if (key === STORAGE_KEYS.AP_COLUMNS) {
      state.apColumns = JSON.parse(localStorage.getItem(STORAGE_KEYS.AP_COLUMNS));
    } else if (key === STORAGE_KEYS.AG_COLUMNS) {
      state.agColumns = JSON.parse(localStorage.getItem(STORAGE_KEYS.AG_COLUMNS));
    } else if (key === `SYNAPSE_DBMAKE_COLUMNS${dbmakeSuffix}`) {
      state.dbmakeColumns = JSON.parse(localStorage.getItem(`SYNAPSE_DBMAKE_COLUMNS${dbmakeSuffix}`));
    }
  });

  // アクティブなビューの強制再描画
  if (state.currentView === 'jo-info-screen') {
    renderJoInfo();
  } else if (state.currentView === 'applicant-info-screen') {
    renderApplicantInfo();
  } else if (state.currentView === 'agency-info-screen') {
    renderAgencyInfo();
  } else if (state.currentView === 'dbmake-screen') {
    renderDbmakePartners();
  } else if (state.currentView.startsWith('custom-table-')) {
    const tableId = state.currentView.replace('custom-table-', '');
    renderCustomTable(tableId);
  }
}

// データベースの初期化（ローカルストレージチェック）
function initDatabase() {
  // バージョンが変わった場合はバージョン情報のみ更新（ユーザーデータを保護するためクリアは実行しない）
  if (localStorage.getItem(STORAGE_KEYS.VERSION) !== CURRENT_DB_VERSION) {
    localStorage.setItem(STORAGE_KEYS.VERSION, CURRENT_DB_VERSION);
  }

  // 顧客DB
  if (!localStorage.getItem(STORAGE_KEYS.CUSTOMERS)) {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(INITIAL_CUSTOMERS));
  }
  state.customers = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOMERS));

  // アポイントDB（空で初期化）
  if (!localStorage.getItem(STORAGE_KEYS.APPOINTMENTS)) {
    // デモ用にいくつかの過去アポイントをシード (指定された文字・数字による8桁ID)
    const demoAppoints = [
      {
        id: 'A3C9FPXT',
        date: '2026-06-20T10:00',
        customerType: 'existing',
        customerId: 'F7P3MX9W',
        customerName: '山田 太郎',
        memo: '今後の追加サービスのご提案。JOの登録状況は良好。次回アプローチは7月中旬。',
        customFields: { phone: '090-1234-5678', email: 'yamada@example.com' },
        status: 'official', // official = 正式登録, draft = 一時保存, cancelled = 破棄
        registeredAt: '2026-06-20T11:00:00'
      },
      {
        id: 'S7E3WR9M',
        date: '2026-06-18T14:00',
        customerType: 'existing',
        customerId: 'F7P3MX9W',
        customerName: '山田 太郎',
        memo: '初回面談。紹介パートナーである田中様からのご紹介。課題のヒアリング。',
        customFields: { phone: '090-1234-5678', introducer: '田中 代理店' },
        status: 'official',
        registeredAt: '2026-06-18T15:00:00'
      },
      {
        id: 'Y3N7QP9X',
        date: '2026-06-19T11:30',
        customerType: 'existing',
        customerId: 'F7P3MX9W',
        customerName: '山田 太郎',
        memo: '2回目面談。JOサービスの詳細説明とデモ実施。手応えあり。次回は見積提示。',
        customFields: { zoom: 'https://zoom.us/j/999888777' },
        status: 'official',
        registeredAt: '2026-06-19T12:30:00'
      },
      {
        id: 'G9R5XW7K',
        date: '2026-06-21T16:00',
        customerType: 'existing',
        customerId: 'K5N9QR7T',
        customerName: '鈴木 花子',
        memo: '代理店契約に関する条件すり合わせ。特に手数料率について。',
        customFields: { phone: '080-9876-5432', email: 'suzuki@test.jp' },
        status: 'official',
        registeredAt: '2026-06-21T17:00:00'
      },
      {
        id: 'NK76WMSY',
        date: '2026-06-22T15:30',
        customerType: 'new',
        customerName: '鈴木様紹介の佐藤さん',
        memo: '新規での挨拶面談。Zoomで実施。興味はありそうだが、時期尚早とのこと。',
        customFields: { zoom: 'https://zoom.us/j/1234567890' },
        status: 'draft',
        registeredAt: '2026-06-22T16:00:00'
      }
    ];
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(demoAppoints));
  }
  state.appointments = JSON.parse(localStorage.getItem(STORAGE_KEYS.APPOINTMENTS));

  // マイパターンDB（標準パターン初期設定）
  if (!localStorage.getItem(STORAGE_KEYS.PATTERNS)) {
    const defaultPatterns = {
      'basic': ['furigana', 'phone', 'email'],
      'corp': ['corp_info', 'industry', 'biz_details']
    };
    localStorage.setItem(STORAGE_KEYS.PATTERNS, JSON.stringify(defaultPatterns));
  }
  state.patterns = JSON.parse(localStorage.getItem(STORAGE_KEYS.PATTERNS));

  // 本登録ID紐付けDB
  if (!localStorage.getItem(STORAGE_KEYS.OFFICIAL_LINKS)) {
    const demoLinks = [
      {
        officialId: 'REG10294857',
        customerName: '山田 太郎',
        appointmentIds: ['A3C9FPXT', 'S7E3WR9M', 'Y3N7QP9X'],
        linkedAt: '2026-06-21T12:00:00.000Z'
      }
    ];
    localStorage.setItem(STORAGE_KEYS.OFFICIAL_LINKS, JSON.stringify(demoLinks));
  }
  state.officialLinks = JSON.parse(localStorage.getItem(STORAGE_KEYS.OFFICIAL_LINKS));

  // JO表示カラムDB
  const allJoColumnIds = [
    'customerPersonalityId', 'customerId', 'status', 'corpName', 'furigana', 'repName', 'repFurigana',
    'appType', 'shopName', 'shopMedia', 'shopUrl', 'folder', 'ledgerSheet',
    'contract', 'rakutenPassed', 'handoverDate', 'rewardStartDate',
    'minGuaranteeStartMonth', 'stopMonth', 'folderCreated', 'statementDetails'
  ];
  if (!getSettingItem(STORAGE_KEYS.JO_VISIBLE_COLUMNS)) {
    setSettingItem(STORAGE_KEYS.JO_VISIBLE_COLUMNS, JSON.stringify(allJoColumnIds));
  }
  state.joVisibleColumns = JSON.parse(getSettingItem(STORAGE_KEYS.JO_VISIBLE_COLUMNS));

  // 必須カラム（非表示不可）が必ず含まれることを保証
  const requiredColumns = ['customerPersonalityId', 'customerId', 'status', 'corpName', 'repName'];
  requiredColumns.forEach(col => {
    if (!state.joVisibleColumns.includes(col)) {
      state.joVisibleColumns.push(col);
    }
  });

  // JOカラム幅DB
  if (!getSettingItem(STORAGE_KEYS.JO_COLUMN_WIDTHS)) {
    setSettingItem(STORAGE_KEYS.JO_COLUMN_WIDTHS, JSON.stringify({}));
  }
  state.joColumnWidths = JSON.parse(getSettingItem(STORAGE_KEYS.JO_COLUMN_WIDTHS));

  // カラム幅の異常値（60px未満、または数値以外、NaNなど）を自動補正してリセット
  let widthUpdated = false;
  Object.keys(state.joColumnWidths).forEach(key => {
    const val = state.joColumnWidths[key];
    if (typeof val !== 'number' || isNaN(val) || val < 60) {
      state.joColumnWidths[key] = 100; // デフォルト 100px
      widthUpdated = true;
    }
  });
  if (widthUpdated) {
    setSettingItem(STORAGE_KEYS.JO_COLUMN_WIDTHS, JSON.stringify(state.joColumnWidths));
  }

  // JO行高DB
  if (!getSettingItem(STORAGE_KEYS.JO_ROW_HEIGHTS)) {
    setSettingItem(STORAGE_KEYS.JO_ROW_HEIGHTS, JSON.stringify({}));
  }
  state.joRowHeights = JSON.parse(getSettingItem(STORAGE_KEYS.JO_ROW_HEIGHTS));

  // 固定列・行のDB
  if (!getSettingItem(STORAGE_KEYS.JO_FIXED_COL)) {
    setSettingItem(STORAGE_KEYS.JO_FIXED_COL, 'none');
  }
  state.joFixedCol = getSettingItem(STORAGE_KEYS.JO_FIXED_COL);

  if (!getSettingItem(STORAGE_KEYS.JO_FIXED_ROW)) {
    setSettingItem(STORAGE_KEYS.JO_FIXED_ROW, 'none');
  }
  state.joFixedRow = getSettingItem(STORAGE_KEYS.JO_FIXED_ROW);

  state.joCellStyles = {};

  // JOカラム定義
  if (!localStorage.getItem(STORAGE_KEYS.JO_COLUMNS)) {
    localStorage.setItem(STORAGE_KEYS.JO_COLUMNS, JSON.stringify(INITIAL_JO_COLUMNS));
  }
  state.joColumns = JSON.parse(localStorage.getItem(STORAGE_KEYS.JO_COLUMNS));

  // JO契約データ本体
  if (!localStorage.getItem(STORAGE_KEYS.JO_CONTRACTS)) {
    const initialContracts = [];
    const statusOptions = ['運営中', '申請中', '一時停止'];
    const mediaOptions = ['楽天市場', 'Yahoo!ショッピング', 'Amazon', '自社サイト'];
    const appTypeOptions = ['新規', '移行'];

    const chars = 'ACEFGHJKMNPQRSTWXY345679';
    const generateStatic8DigitId = (idx) => {
      return encodeSequenceToId(idx);
    };

    for (let i = 1; i <= 300; i++) {
      const isYamada = i === 1;
      const isSato = i === 2;
      const isSuzuki = i === 3;
      const isWatanabe = i === 4;

      initialContracts.push({
        status: statusOptions[i % statusOptions.length],
        customerId: String(1000 + i),
        customerPersonalityId: isYamada ? 'F7P3MX9W' : (isSato ? 'E4H7JS6P' : (isSuzuki ? 'K5N9QR7T' : (isWatanabe ? 'T7P5Y3Q9' : generateStatic8DigitId(i)))),
        corpName: isYamada ? '株式会社テストコーポレーション' : (isSato ? '株式会社サンプルサービス' : (isSuzuki ? '合同会社鈴木商事' : (isWatanabe ? '渡辺コンサルティング' : `テスト法人 第${i}事業部`))),
        furigana: isYamada ? 'テストコーポレーション' : (isSato ? 'サンプルサービス' : (isSuzuki ? 'スズキショウジ' : (isWatanabe ? 'ワタナベコンサルティング' : `テストホウジンダイ${i}ジギョウブ`))),
        repName: isYamada ? '山田 太郎' : (isSato ? '佐藤 一郎' : (isSuzuki ? '鈴木 花子' : (isWatanabe ? '渡辺 三郎' : `代表 氏名${i}`))),
        repFurigana: isYamada ? 'ヤマダ タロウ' : (isSato ? 'サトウ イチロウ' : (isSuzuki ? 'スズキ ハナコ' : (isWatanabe ? 'ワタナベ サブロウ' : `ダイヒョウ シメイ${i}`))),
        appType: appTypeOptions[i % appTypeOptions.length],
        shopName: `テスト店舗${i}号店`,
        shopMedia: mediaOptions[i % mediaOptions.length],
        shopUrl: `https://www.example.com/shop${i}/`,
        folder: i % 2 === 0 ? '作成済' : '作成中',
        ledgerSheet: i % 3 === 0 ? '作成済' : '未作成',
        contract: i % 4 === 0 ? '締結済' : '未締結',
        rakutenPassed: i % 5 === 0 ? '通過' : '未通過',
        handoverDate: `2026-06-${String((i % 28) + 1).padStart(2, '0')}`,
        rewardStartDate: `2026-07-${String((i % 28) + 1).padStart(2, '0')}`,
        minGuaranteeStartMonth: `2026-07`,
        stopMonth: i % 10 === 0 ? '2026-08' : 'ー',
        folderCreated: i % 2 === 0 ? '済' : '未',
        statementDetails: i % 3 === 0 ? '確認済' : '未確認'
      });
    }
    localStorage.setItem(STORAGE_KEYS.JO_CONTRACTS, JSON.stringify(initialContracts));
  }
  state.joContracts = JSON.parse(localStorage.getItem(STORAGE_KEYS.JO_CONTRACTS));

  // --- 申込者情報 (ap) 用の初期設定 ---
  const allApColumnIds = ['customerPersonalityId', 'customerId', 'name', 'furigana', 'phone', 'email', 'date', 'status'];
  if (!getSettingItem(STORAGE_KEYS.AP_VISIBLE_COLUMNS)) {
    setSettingItem(STORAGE_KEYS.AP_VISIBLE_COLUMNS, JSON.stringify(allApColumnIds));
  }
  state.apVisibleColumns = JSON.parse(getSettingItem(STORAGE_KEYS.AP_VISIBLE_COLUMNS));
  ['customerId', 'customerPersonalityId', 'name', 'phone'].forEach(col => {
    if (!state.apVisibleColumns.includes(col)) state.apVisibleColumns.push(col);
  });

  if (!getSettingItem(STORAGE_KEYS.AP_COLUMN_WIDTHS)) {
    setSettingItem(STORAGE_KEYS.AP_COLUMN_WIDTHS, JSON.stringify({}));
  }
  state.apColumnWidths = JSON.parse(getSettingItem(STORAGE_KEYS.AP_COLUMN_WIDTHS));

  if (!getSettingItem(STORAGE_KEYS.AP_ROW_HEIGHTS)) {
    setSettingItem(STORAGE_KEYS.AP_ROW_HEIGHTS, JSON.stringify({}));
  }
  state.apRowHeights = JSON.parse(getSettingItem(STORAGE_KEYS.AP_ROW_HEIGHTS));

  if (!getSettingItem(STORAGE_KEYS.AP_FIXED_COL)) {
    setSettingItem(STORAGE_KEYS.AP_FIXED_COL, 'none');
  }
  state.apFixedCol = getSettingItem(STORAGE_KEYS.AP_FIXED_COL);

  if (!getSettingItem(STORAGE_KEYS.AP_FIXED_ROW)) {
    setSettingItem(STORAGE_KEYS.AP_FIXED_ROW, 'none');
  }
  state.apFixedRow = getSettingItem(STORAGE_KEYS.AP_FIXED_ROW);

  state.apCellStyles = {};

  if (!localStorage.getItem(STORAGE_KEYS.AP_COLUMNS)) {
    localStorage.setItem(STORAGE_KEYS.AP_COLUMNS, JSON.stringify(INITIAL_AP_COLUMNS));
  }
  state.apColumns = JSON.parse(localStorage.getItem(STORAGE_KEYS.AP_COLUMNS));

  if (!localStorage.getItem(STORAGE_KEYS.AP_CONTRACTS)) {
    const initialApplicants = [
      { customerId: '1002', customerPersonalityId: 'E4H7JS6P', name: '佐藤 一郎', furigana: 'サトウ イチロウ', phone: '070-5555-5555', email: 'sato@sample.co.jp', date: '2026-06-28', status: '審査中' },
      { customerId: '1004', customerPersonalityId: 'T7P5Y3Q9', name: '渡辺 三郎', furigana: 'ワタナベ サブロウ', phone: '080-3333-4444', email: 'watanabe@sample.com', date: '2026-06-30', status: '未対応' },
      { customerId: '1001', customerPersonalityId: 'F7P3MX9W', name: '山田 太郎', furigana: 'ヤマダ タロウ', phone: '090-1234-5678', email: 'yamada@example.com', date: '2026-07-01', status: '面談済' }
    ];
    localStorage.setItem(STORAGE_KEYS.AP_CONTRACTS, JSON.stringify(initialApplicants));
  }
  state.apContracts = JSON.parse(localStorage.getItem(STORAGE_KEYS.AP_CONTRACTS));

  // --- 代理店情報 (ag) 用の初期設定 ---
  const allAgColumnIds = ['customerId', 'name', 'status', 'company', 'count'];
  if (!getSettingItem(STORAGE_KEYS.AG_VISIBLE_COLUMNS)) {
    setSettingItem(STORAGE_KEYS.AG_VISIBLE_COLUMNS, JSON.stringify(allAgColumnIds));
  }
  state.agVisibleColumns = JSON.parse(getSettingItem(STORAGE_KEYS.AG_VISIBLE_COLUMNS));
  ['customerId', 'name', 'company'].forEach(col => {
    if (!state.agVisibleColumns.includes(col)) state.agVisibleColumns.push(col);
  });

  if (!getSettingItem(STORAGE_KEYS.AG_COLUMN_WIDTHS)) {
    setSettingItem(STORAGE_KEYS.AG_COLUMN_WIDTHS, JSON.stringify({}));
  }
  state.agColumnWidths = JSON.parse(getSettingItem(STORAGE_KEYS.AG_COLUMN_WIDTHS));

  if (!getSettingItem(STORAGE_KEYS.AG_ROW_HEIGHTS)) {
    setSettingItem(STORAGE_KEYS.AG_ROW_HEIGHTS, JSON.stringify({}));
  }
  state.agRowHeights = JSON.parse(getSettingItem(STORAGE_KEYS.AG_ROW_HEIGHTS));

  if (!getSettingItem(STORAGE_KEYS.AG_FIXED_COL)) {
    setSettingItem(STORAGE_KEYS.AG_FIXED_COL, 'none');
  }
  state.agFixedCol = getSettingItem(STORAGE_KEYS.AG_FIXED_COL);

  if (!getSettingItem(STORAGE_KEYS.AG_FIXED_ROW)) {
    setSettingItem(STORAGE_KEYS.AG_FIXED_ROW, 'none');
  }
  state.agFixedRow = getSettingItem(STORAGE_KEYS.AG_FIXED_ROW);

  state.agCellStyles = {};

  if (!localStorage.getItem(STORAGE_KEYS.AG_COLUMNS)) {
    localStorage.setItem(STORAGE_KEYS.AG_COLUMNS, JSON.stringify(INITIAL_AG_COLUMNS));
  }
  state.agColumns = JSON.parse(localStorage.getItem(STORAGE_KEYS.AG_COLUMNS));

  if (!localStorage.getItem(STORAGE_KEYS.AG_CONTRACTS)) {
    const initialAgencies = [
      { customerId: 'A3K9N5W7', name: '田中 代理店', status: '代理店登録済', company: '株式会社田中エージェンシー', count: '12件' },
      { customerId: 'E4H7JS6P', name: '佐藤 代理店', status: '代理店登録済', company: '株式会社サンプルサービス', count: '0件' },
      { customerId: 'T7P5Y3Q9', name: '渡辺 エージェント', status: '代理店登録済', company: '渡辺コンサルティング', count: '8件' },
      { customerId: 'F7P3MX9W', name: '山田 代理店', status: '代理店登録済', company: '株式会社テストコーポレーション', count: '3件' }
    ];
    localStorage.setItem(STORAGE_KEYS.AG_CONTRACTS, JSON.stringify(initialAgencies));
  }
  state.agContracts = JSON.parse(localStorage.getItem(STORAGE_KEYS.AG_CONTRACTS));

  // --- DBMAKEの設定ロード ---
  const allDbmakeColumnIds = ['id', 'registeredName', 'registeredNameKana', 'representativeName', 'phoneNumber', 'email', 'invoiceNum', 'corpNum', 'status', 'recordedBy', 'recordedAt', 'reward', 'remarks'];
  if (!getSettingItem(STORAGE_KEYS.DBMAKE_VISIBLE_COLUMNS)) {
    setSettingItem(STORAGE_KEYS.DBMAKE_VISIBLE_COLUMNS, JSON.stringify(allDbmakeColumnIds));
  }
  state.dbmakeVisibleColumns = JSON.parse(getSettingItem(STORAGE_KEYS.DBMAKE_VISIBLE_COLUMNS));

  if (!getSettingItem(STORAGE_KEYS.DBMAKE_COLUMN_WIDTHS)) {
    setSettingItem(STORAGE_KEYS.DBMAKE_COLUMN_WIDTHS, JSON.stringify({}));
  }
  state.dbmakeColumnWidths = JSON.parse(getSettingItem(STORAGE_KEYS.DBMAKE_COLUMN_WIDTHS));

  if (!getSettingItem(STORAGE_KEYS.DBMAKE_FIXED_COL)) {
    setSettingItem(STORAGE_KEYS.DBMAKE_FIXED_COL, 'none');
  }
  state.dbmakeFixedCol = getSettingItem(STORAGE_KEYS.DBMAKE_FIXED_COL);

  if (!getSettingItem(STORAGE_KEYS.DBMAKE_FIXED_ROW)) {
    setSettingItem(STORAGE_KEYS.DBMAKE_FIXED_ROW, 'none');
  }
  state.dbmakeFixedRow = getSettingItem(STORAGE_KEYS.DBMAKE_FIXED_ROW);

  // パートナーDBカラムのロード
  const dbmakeSuffix = getUserIdSuffix();
  const savedDbmakeCols = localStorage.getItem(`SYNAPSE_DBMAKE_COLUMNS${dbmakeSuffix}`);
  if (savedDbmakeCols) {
    state.dbmakeColumns = JSON.parse(savedDbmakeCols);
  }

  // テーマ・色調のロードと適用
  const userId = state.currentUser ? state.currentUser.id : 'guest';
  const savedTheme = localStorage.getItem(`SYNAPSE_THEME_${userId}`) || 'light';
  applyTheme(savedTheme);

  const savedHue = localStorage.getItem(`SYNAPSE_HUE_${userId}`) || '0';
  const savedSaturation = localStorage.getItem(`SYNAPSE_SATURATION_${userId}`) || '100';
  applyColorTone(savedHue, savedSaturation);

  // マスタ共有セル書式とユーザー個別セル書式のロード
  state.joMasterCellStyles = JSON.parse(localStorage.getItem('SYNAPSE_JO_CELL_STYLES_MASTER')) || {};
  state.joCellStyles = JSON.parse(localStorage.getItem(`SYNAPSE_JO_CELL_STYLES_${userId}`)) || {};

  state.apMasterCellStyles = JSON.parse(localStorage.getItem('SYNAPSE_AP_CELL_STYLES_MASTER')) || {};
  state.apCellStyles = JSON.parse(localStorage.getItem(`SYNAPSE_AP_CELL_STYLES_${userId}`)) || {};

  state.agMasterCellStyles = JSON.parse(localStorage.getItem('SYNAPSE_AG_CELL_STYLES_MASTER')) || {};
  state.agCellStyles = JSON.parse(localStorage.getItem(`SYNAPSE_AG_CELL_STYLES_${userId}`)) || {};

  // 条件付き書式ルールのロード
  state.conditionalFormats = {
    jo: JSON.parse(localStorage.getItem(`SYNAPSE_CF_JO_${userId}`)) || [],
    ap: JSON.parse(localStorage.getItem(`SYNAPSE_CF_AP_${userId}`)) || [],
    ag: JSON.parse(localStorage.getItem(`SYNAPSE_CF_AG_${userId}`)) || []
  };

  // 既存のローカルストレージカラム定義に対するドロップダウンマイグレーション（初期定義補完）
  const migrateColumns = (cols, defaults) => {
    let changed = false;
    cols.forEach(col => {
      const def = defaults.find(d => d.id === col.id);
      if (def && def.type === 'select' && !col.type) {
        col.type = 'select';
        col.choices = def.choices.map(val => ({ value: val, color: '#6366f1' }));
        col.dropdownStyle = def.dropdownStyle || 'chip-outline';
        changed = true;
      }
    });
    return changed;
  };

  // JOカラムの補完
  if (state.joColumns) {
    const defaults = [
      { id: 'status', type: 'select', choices: ['運営中', '申請中', '一時停止'], dropdownStyle: 'chip-outline' },
      { id: 'appType', type: 'select', choices: ['新規', '移行'], dropdownStyle: 'chip-outline' },
      { id: 'shopMedia', type: 'select', choices: ['楽天市場', 'Yahoo!ショッピング', 'Amazon', '自社サイト'], dropdownStyle: 'chip-outline' },
      { id: 'folder', type: 'select', choices: ['作成済', '作成中'], dropdownStyle: 'chip-outline' },
      { id: 'ledgerSheet', type: 'select', choices: ['作成済', '未作成'], dropdownStyle: 'chip-outline' },
      { id: 'contract', type: 'select', choices: ['締結済', '未締結'], dropdownStyle: 'chip-outline' },
      { id: 'rakutenPassed', type: 'select', choices: ['通過', '未通過'], dropdownStyle: 'chip-outline' }
    ];
    if (migrateColumns(state.joColumns, defaults)) {
      localStorage.setItem(STORAGE_KEYS.JO_COLUMNS, JSON.stringify(state.joColumns));
    }
  }

  // APカラムの補完
  if (state.apColumns) {
    const defaults = [
      { id: 'status', type: 'select', choices: ['審査中', '未対応', '面談済'], dropdownStyle: 'chip-outline' }
    ];
    if (migrateColumns(state.apColumns, defaults)) {
      localStorage.setItem(STORAGE_KEYS.AP_COLUMNS, JSON.stringify(state.apColumns));
    }
  }

  // AGカラムの補完
  if (state.agColumns) {
    const defaults = [
      { id: 'status', type: 'select', choices: ['代理店登録済', '未登録'], dropdownStyle: 'chip-outline' }
    ];
    if (migrateColumns(state.agColumns, defaults)) {
      localStorage.setItem(STORAGE_KEYS.AG_COLUMNS, JSON.stringify(state.agColumns));
    }
  }

  // DBMAKEカラムの補完
  if (state.dbmakeColumns) {
    const defaults = [
      { id: 'status', type: 'select', choices: ['ACTIVE', 'INACTIVE'], dropdownStyle: 'chip-outline' }
    ];
    if (migrateColumns(state.dbmakeColumns, defaults)) {
      localStorage.setItem(`SYNAPSE_DBMAKE_COLUMNS${dbmakeSuffix}`, JSON.stringify(state.dbmakeColumns));
    }
  }

  // --- カスタムテーブルのロード ---
  try {
    if (!localStorage.getItem(STORAGE_KEYS.CUSTOM_TABLES)) {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_TABLES, JSON.stringify([]));
    }
    state.customTables = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOM_TABLES)) || [];
    if (!Array.isArray(state.customTables)) {
      state.customTables = [];
    }
  } catch (e) {
    console.error("[Database] Failed to load custom tables, resetting to empty array:", e);
    state.customTables = [];
  }

  // --- カスタムアコーディオンのロード ---
  try {
    state.customAccordions = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOM_ACCORDIONS)) || [];
    if (!Array.isArray(state.customAccordions)) {
      state.customAccordions = [];
    }
  } catch (e) {
    console.error("[Database] Failed to load custom accordions, resetting to empty array:", e);
    state.customAccordions = [];
  }

  // 循環参照の自動修復・マイグレーション（フリーズ防止）
  let accordionSanitized = false;
  state.customAccordions.forEach(acc => {
    // 自己循環の補正
    if (acc.parentMenuId === acc.id) {
      acc.parentMenuId = 'root';
      accordionSanitized = true;
    }
    // 循環チェック
    const visited = new Set();
    let current = acc;
    while (current) {
      if (visited.has(current.id)) {
        console.warn("[Database Sanitation] Circular reference detected and reset to root for:", current.id);
        acc.parentMenuId = 'root';
        accordionSanitized = true;
        break;
      }
      visited.add(current.id);
      current = state.customAccordions.find(a => a.id === current.parentMenuId);
    }
  });
  if (accordionSanitized) {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_ACCORDIONS, JSON.stringify(state.customAccordions));
  }

  // --- 標準フォルダ・テーブルの自動マイグレーション ---
  const defaultAccs = [
    { id: 'appoint-accordion', name: 'アポイント情報', parentMenuId: 'root', isSystem: true },
    { id: 'agency-accordion', name: '代理店情報', parentMenuId: 'root', isSystem: true },
    { id: 'jo-accordion', name: 'JO情報', parentMenuId: 'root', isSystem: true },
    { id: 'applicant-accordion', name: '申込者情報', parentMenuId: 'root', isSystem: true }
  ];
  let customAccUpdated = false;
  defaultAccs.forEach(def => {
    if (!state.customAccordions.find(a => a.id === def.id)) {
      state.customAccordions.unshift(def); // 先頭に追加
      customAccUpdated = true;
    }
  });
  if (customAccUpdated) {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_ACCORDIONS, JSON.stringify(state.customAccordions));
  }

  const defaultTbls = [
    { id: 'agency-info-screen', name: '代理店 基本マスタ', parentMenuId: 'agency-accordion', isSystem: true },
    { id: 'jo-info-screen', name: 'JO 基本マスタ', parentMenuId: 'jo-accordion', isSystem: true },
    { id: 'applicant-info-screen', name: '申込者 基本マスタ', parentMenuId: 'applicant-accordion', isSystem: true }
  ];
  let customTabUpdated = false;
  defaultTbls.forEach(def => {
    if (!state.customTables.find(t => t.id === def.id)) {
      state.customTables.push(def);
      customTabUpdated = true;
    }
  });

  // 既存カスタムテーブルのデータ構造修復マイグレーション (rows / data の混在やプロパティ欠落の解消)
  state.customTables.forEach(tbl => {
    if (tbl.isSystem) return; // システムテーブルは除外

    if (tbl.data && !tbl.rows) {
      tbl.rows = tbl.data;
      delete tbl.data;
      customTabUpdated = true;
    }
    if (!tbl.rows) {
      tbl.rows = [];
      customTabUpdated = true;
    }
    if (!tbl.visibleColumns) {
      tbl.visibleColumns = tbl.columns ? tbl.columns.map(c => c.id) : [];
      customTabUpdated = true;
    }
    if (!tbl.columnWidths) {
      tbl.columnWidths = {};
      if (tbl.columns) {
        tbl.columns.forEach(c => { tbl.columnWidths[c.id] = 120; });
      }
      customTabUpdated = true;
    }
    if (!tbl.rowHeights) {
      tbl.rowHeights = {};
      customTabUpdated = true;
    }
    if (!tbl.fixedCol) {
      tbl.fixedCol = 'none';
      customTabUpdated = true;
    }
    if (!tbl.fixedRow) {
      tbl.fixedRow = 'none';
      customTabUpdated = true;
    }
    if (!tbl.cellStyles) {
      tbl.cellStyles = {};
      customTabUpdated = true;
    }
    // columnにlabelやnameが欠落している場合の補正
    if (tbl.columns) {
      tbl.columns.forEach(col => {
        if (!col.label && col.name) {
          col.label = col.name;
          customTabUpdated = true;
        }
        if (!col.name && col.label) {
          col.name = col.label;
          customTabUpdated = true;
        }
      });
    }
  });

  if (customTabUpdated) {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_TABLES, JSON.stringify(state.customTables));
  }

  // --- 権限データのロード ---
  const defaultPermissions = { folders: {}, tables: {}, columns: {}, rowFilters: {} };
  state.permissions = JSON.parse(localStorage.getItem(STORAGE_KEYS.PERMISSIONS)) || defaultPermissions;
  if (!state.permissions.folders) state.permissions.folders = {};
  if (!state.permissions.tables) state.permissions.tables = {};
  if (!state.permissions.columns) state.permissions.columns = {};
  if (!state.permissions.rowFilters) state.permissions.rowFilters = {};

  // 標準フォルダの初期権限（未設定の場合、全ユーザーに許可）
  const defaultFolders = ['appoint-accordion', 'agency-accordion', 'jo-accordion', 'applicant-accordion'];
  defaultFolders.forEach(fid => {
    if (!state.permissions.folders[fid]) {
      state.permissions.folders[fid] = ['admin', 'sales_01', 'sales_02', 'support_01'];
    }
  });

  // 標準テーブルの初期権限（未設定の場合、代理店情報は営業と管理者のみ、他は全員許可）
  const defaultTables = {
    'agency-info-screen': ['admin', 'sales_01', 'sales_02'],
    'jo-info-screen': ['admin', 'sales_01', 'sales_02', 'support_01'],
    'applicant-info-screen': ['admin', 'sales_01', 'sales_02', 'support_01']
  };
  Object.keys(defaultTables).forEach(tid => {
    if (!state.permissions.tables[tid]) {
      state.permissions.tables[tid] = defaultTables[tid];
    }
  });

  // --- 操作監査ログのロード ---
  state.auditLogs = JSON.parse(localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) || [];

  // Supabase初期化とバックグラウンド自動同期
  if (initSupabase()) {
    setTimeout(() => {
      syncFromSupabase();
    }, 100);
  }
}

function saveCustomTables() {
  localStorage.setItem(STORAGE_KEYS.CUSTOM_TABLES, JSON.stringify(state.customTables));
}

function saveCustomAccordions() {
  localStorage.setItem(STORAGE_KEYS.CUSTOM_ACCORDIONS, JSON.stringify(state.customAccordions));
}

function loadUserCustomIcons() {
  const saved = localStorage.getItem(STORAGE_KEYS.USER_CUSTOM_ICONS);
  if (saved) {
    try {
      state.userCustomIcons = JSON.parse(saved);
    } catch(e) {
      state.userCustomIcons = {};
    }
  }
  if (!state.userCustomIcons) state.userCustomIcons = {};
}

function saveUserCustomIcons() {
  localStorage.setItem(STORAGE_KEYS.USER_CUSTOM_ICONS, JSON.stringify(state.userCustomIcons));
}

function normalizeFolderId(id) {
  if (!id || id === 'root' || id === 'custom-tables') return 'root';
  if (id === 'appoint' || id === 'appoint-info' || id === 'appoint-accordion') return 'appoint-accordion';
  if (id === 'agency' || id === 'agency-info' || id === 'agency-accordion') return 'agency-accordion';
  if (id === 'jo' || id === 'jo-info' || id === 'jo-accordion') return 'jo-accordion';
  if (id === 'applicant' || id === 'applicant-info' || id === 'applicant-accordion') return 'applicant-accordion';
  return id;
}

function ensureStandardAccordionsInState() {
  if (!state.customAccordions) state.customAccordions = [];
  
  const stdAccs = [
    { id: 'applicant-accordion', name: '申込者情報', parentMenuId: 'root' },
    { id: 'jo-accordion', name: 'JO情報', parentMenuId: 'root' },
    { id: 'agency-accordion', name: '代理店情報', parentMenuId: 'root' },
    { id: 'appoint-accordion', name: 'アポイント情報', parentMenuId: 'root' }
  ];

  stdAccs.forEach(std => {
    const existing = state.customAccordions.find(a => a.id === std.id);
    if (!existing) {
      state.customAccordions.unshift(std);
    }
  });
}

function ensureStandardTablesInState() {
  if (!state.customTables) state.customTables = [];

  const stds = [
    { id: 'agency-info-screen', name: '代理店 基本マスタ', parentMenuId: 'agency-accordion' },
    { id: 'jo-info-screen', name: 'JO 基本マスタ', parentMenuId: 'jo-accordion' },
    { id: 'applicant-info-screen', name: '申込者 基本マスタ', parentMenuId: 'applicant-accordion' },
    { id: 'appointment-new', name: '新規アポイント', parentMenuId: 'appoint-accordion' },
    { id: 'appointment-existing', name: '既存顧客アポイント', parentMenuId: 'appoint-accordion' },
    { id: 'drafts-view-screen', name: '一時保存一覧', parentMenuId: 'appoint-accordion' },
    { id: 'history-view-screen', name: 'アポイント履歴', parentMenuId: 'appoint-accordion' },
    { id: 'official-id-link', name: '本登録ID紐付け', parentMenuId: 'appoint-accordion' }
  ];

  stds.forEach(std => {
    let existing = state.customTables.find(t => t.id === std.id);
    if (!existing) {
      state.customTables.push(std);
    } else {
      existing.parentMenuId = normalizeFolderId(existing.parentMenuId);
    }
  });
}

function getUserItemIconHtml(itemId, defaultIcon = null) {
  const userId = state.currentUser ? state.currentUser.id : 'default';
  const userIcons = state.userCustomIcons && state.userCustomIcons[userId];
  const custom = userIcons && userIcons[itemId];

  if (custom) {
    if (custom.type === 'none') {
      return '';
    } else if (custom.type === 'emoji' && custom.value) {
      return `<span class="user-custom-icon user-custom-icon-emoji">${custom.value}</span>`;
    } else if (custom.type === 'image' && custom.value) {
      return `<span class="user-custom-icon"><img src="${custom.value}" class="user-custom-icon-img" alt="icon"></span>`;
    }
  }

  if (defaultIcon) {
    return `<span class="user-custom-icon user-custom-icon-emoji">${defaultIcon}</span>`;
  }

  // テーブル(📊)とその他機能(📝)でデフォルトアイコンを判別
  const isSubMenu = ['appointment-new', 'appointment-existing', 'drafts-view-screen', 'history-view-screen', 'official-id-link'].includes(itemId);
  const autoIcon = isSubMenu ? '📝' : '📊';
  return `<span class="user-custom-icon user-custom-icon-emoji">${autoIcon}</span>`;
}

let currentIconTargetId = null;

function openCustomIconModal(itemId, itemName) {
  currentIconTargetId = itemId;
  const modal = document.getElementById('custom-icon-modal');
  const nameEl = document.getElementById('custom-icon-target-name');
  if (nameEl) nameEl.textContent = itemName;

  const userId = state.currentUser ? state.currentUser.id : 'default';
  const userIcons = state.userCustomIcons && state.userCustomIcons[userId];
  const current = userIcons && userIcons[itemId];

  const emojiInput = document.getElementById('custom-icon-emoji-input');
  const previewImg = document.getElementById('custom-icon-image-preview');
  const previewContainer = document.getElementById('custom-icon-image-preview-container');
  const fileInput = document.getElementById('custom-icon-file-input');

  if (fileInput) fileInput.value = '';

  if (current && current.type === 'none') {
    switchCustomIconTab('none');
  } else if (current && current.type === 'image') {
    switchCustomIconTab('image');
    if (previewImg) previewImg.src = current.value;
    if (previewContainer) previewContainer.style.display = 'flex';
  } else {
    switchCustomIconTab('emoji');
    if (emojiInput) emojiInput.value = (current && current.type === 'emoji') ? current.value : '';
    if (previewContainer) previewContainer.style.display = 'none';
  }

  if (modal) modal.classList.add('active');
}

function switchCustomIconTab(type) {
  const tabEmoji = document.getElementById('tab-btn-emoji');
  const tabImage = document.getElementById('tab-btn-image');
  const tabNone = document.getElementById('tab-btn-none');
  const secEmoji = document.getElementById('icon-section-emoji');
  const secImage = document.getElementById('icon-section-image');
  const secNone = document.getElementById('icon-section-none');

  if (tabEmoji) tabEmoji.classList.remove('active');
  if (tabImage) tabImage.classList.remove('active');
  if (tabNone) tabNone.classList.remove('active');

  if (secEmoji) secEmoji.style.display = 'none';
  if (secImage) secImage.style.display = 'none';
  if (secNone) secNone.style.display = 'none';

  if (type === 'emoji') {
    if (tabEmoji) tabEmoji.classList.add('active');
    if (secEmoji) secEmoji.style.display = 'flex';
  } else if (type === 'image') {
    if (tabImage) tabImage.classList.add('active');
    if (secImage) secImage.style.display = 'flex';
  } else if (type === 'none') {
    if (tabNone) tabNone.classList.add('active');
    if (secNone) secNone.style.display = 'flex';
  }
}

function initCustomIconModalEvents() {
  const modal = document.getElementById('custom-icon-modal');
  const closeBtn = document.getElementById('custom-icon-modal-close');
  const cancelBtn = document.getElementById('custom-icon-cancel-btn');
  const resetBtn = document.getElementById('custom-icon-reset-btn');
  const saveBtn = document.getElementById('custom-icon-save-btn');
  const tabEmoji = document.getElementById('tab-btn-emoji');
  const tabImage = document.getElementById('tab-btn-image');
  const tabNone = document.getElementById('tab-btn-none');
  const fileInput = document.getElementById('custom-icon-file-input');
  const previewImg = document.getElementById('custom-icon-image-preview');
  const previewContainer = document.getElementById('custom-icon-image-preview-container');

  if (closeBtn && modal) closeBtn.addEventListener('click', () => modal.classList.remove('active'));
  if (cancelBtn && modal) cancelBtn.addEventListener('click', () => modal.classList.remove('active'));

  if (tabEmoji) tabEmoji.addEventListener('click', () => switchCustomIconTab('emoji'));
  if (tabImage) tabImage.addEventListener('click', () => switchCustomIconTab('image'));
  if (tabNone) tabNone.addEventListener('click', () => switchCustomIconTab('none'));

  document.querySelectorAll('.preset-emoji-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const emojiInput = document.getElementById('custom-icon-emoji-input');
      if (emojiInput) emojiInput.value = e.target.textContent.trim();
    });
  });

  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          if (previewImg) previewImg.src = evt.target.result;
          if (previewContainer) previewContainer.style.display = 'flex';
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (!currentIconTargetId) return;
      const userId = state.currentUser ? state.currentUser.id : 'default';
      if (state.userCustomIcons && state.userCustomIcons[userId]) {
        delete state.userCustomIcons[userId][currentIconTargetId];
        saveUserCustomIcons();
      }
      if (modal) modal.classList.remove('active');
      renderCustomTableList();
      showToast('アイコンを初期設定に戻しました。', 'info');
    });
  }

  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      if (!currentIconTargetId) return;
      const userId = state.currentUser ? state.currentUser.id : 'default';
      if (!state.userCustomIcons) state.userCustomIcons = {};
      if (!state.userCustomIcons[userId]) state.userCustomIcons[userId] = {};

      const isNoneTab = document.getElementById('tab-btn-none')?.classList.contains('active');
      const isImageTab = document.getElementById('tab-btn-image')?.classList.contains('active');

      if (isNoneTab) {
        state.userCustomIcons[userId][currentIconTargetId] = {
          type: 'none',
          value: ''
        };
      } else if (isImageTab) {
        if (previewImg && previewImg.src && previewImg.src.startsWith('data:image')) {
          state.userCustomIcons[userId][currentIconTargetId] = {
            type: 'image',
            value: previewImg.src
          };
        } else {
          showToast('画像ファイルを選択してください。', 'warning');
          return;
        }
      } else {
        const emojiVal = document.getElementById('custom-icon-emoji-input').value.trim();
        if (!emojiVal) {
          showToast('絵文字を入力してください。', 'warning');
          return;
        }
        state.userCustomIcons[userId][currentIconTargetId] = {
          type: 'emoji',
          value: emojiVal
        };
      }

      saveUserCustomIcons();
      if (modal) modal.classList.remove('active');
      renderCustomTableList();
      showToast('カスタムアイコン設定を保存しました！', 'success');
    });
  }
}

function setupSidebarToggleBtnEvent() {
  const sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');
  if (!sidebarToggleBtn) return;
  if (sidebarToggleBtn.dataset.bound) return;
  sidebarToggleBtn.dataset.bound = 'true';

  sidebarToggleBtn.addEventListener('click', () => {
    const sidebar = document.getElementById('app-sidebar');
    if (!sidebar) return;

    sidebar.classList.toggle('collapsed');
    const isCollapsed = sidebar.classList.contains('collapsed');
    sidebarToggleBtn.style.left = isCollapsed ? '50px' : '210px';
    sidebarToggleBtn.textContent = isCollapsed ? '〉〉〉' : '〈〈〈';
  });
}

function savePermissions() {
  localStorage.setItem(STORAGE_KEYS.PERMISSIONS, JSON.stringify(state.permissions));
}

function saveAuditLogs() {
  localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(state.auditLogs));
}

function logCellEdit(tableId, rowId, colId, oldValue, newValue) {
  if (oldValue === newValue) return;

  let tableName = tableId;
  let columnName = colId;

  if (tableId === 'jo-info-screen') {
    tableName = 'JO情報';
    const col = state.joColumns.find(c => c.id === colId);
    if (col) columnName = col.label;
  } else if (tableId === 'applicant-info-screen') {
    tableName = '申込者情報';
    const col = state.apColumns.find(c => c.id === colId);
    if (col) columnName = col.label;
  } else if (tableId === 'agency-info-screen') {
    tableName = '代理店情報';
    const col = state.agColumns.find(c => c.id === colId);
    if (col) columnName = col.label;
  } else if (tableId === 'dbmake-screen') {
    tableName = 'パートナーDB';
    const col = state.dbmakeColumns.find(c => c.id === colId);
    if (col) columnName = col.label;
  } else if (tableId.startsWith('custom-table-')) {
    const tblId = tableId.replace('custom-table-', '');
    const tbl = state.customTables.find(t => t.id === tblId);
    if (tbl) {
      tableName = tbl.name;
      const col = tbl.columns.find(c => c.id === colId);
      if (col) columnName = col.label;
    }
  }

  const log = {
    id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    timestamp: new Date().toISOString(),
    userId: state.currentUser ? (state.currentUser.loginId || state.currentUser.id) : 'system',
    userName: state.currentUser ? state.currentUser.name : 'システム',
    tableId: tableId,
    tableName: tableName,
    rowId: rowId,
    columnId: colId,
    columnName: columnName,
    oldValue: oldValue || '',
    newValue: newValue || ''
  };

  state.auditLogs.unshift(log);
  saveAuditLogs();
}

// アクティブなプレビュー対象、または現在のユーザーIDを解決するヘルパー
function getCurrentUserId() {
  if (state.previewUserId) return state.previewUserId;
  if (state.currentUser) {
    if (state.currentUser.loginId && state.currentUser.loginId.toLowerCase().includes('admin')) {
      if (state.currentUser.id === 'sales') return 'sales_01';
      if (state.currentUser.id === 'support') return 'support_01';
    }
    return state.currentUser.loginId || state.currentUser.id;
  }
  return 'guest';
}

// フォルダ（アコーディオン）の閲覧可否判定
// 戻り値: { visible: boolean, grayout: boolean }
function checkFolderAccess(folderId) {
  // アポイント情報フォルダは常に表示する
  if (folderId === 'appoint-accordion') {
    return { visible: true, grayout: false };
  }

  const userId = getCurrentUserId();
  const isAdminReal = state.currentUser && state.currentUser.id === 'admin';
  
  if (isAdminReal && !state.previewUserId) {
    return { visible: true, grayout: false };
  }

  const isSetup = Object.keys(state.permissions.folders).includes(folderId);
  const allowed = state.permissions.folders[folderId] || [];
  const hasAccess = !isSetup || allowed.includes(userId);

  if (hasAccess) {
    return { visible: true, grayout: false };
  }

  if (state.previewUserId && state.previewMode === 'grayout' && isAdminReal) {
    return { visible: true, grayout: true };
  }

  return { visible: false, grayout: false };
}
// テーブル（シート）の閲覧可否判定
function checkTableAccess(tableId) {
  // アポイント画面（新規・既存・下書き・履歴等）は常に表示する
  if (tableId === 'appoint-screen') {
    return { visible: true, grayout: false };
  }

  const userId = getCurrentUserId();
  const isAdminReal = state.currentUser && state.currentUser.id === 'admin';

  if (isAdminReal && !state.previewUserId) {
    return { visible: true, grayout: false };
  }

  const isSetup = Object.keys(state.permissions.tables).includes(tableId);
  const allowed = state.permissions.tables[tableId] || [];
  const hasAccess = !isSetup || allowed.includes(userId);

  if (hasAccess) {
    return { visible: true, grayout: false };
  }

  if (state.previewUserId && state.previewMode === 'grayout' && isAdminReal) {
    return { visible: true, grayout: true };
  }

  return { visible: false, grayout: false };
}

// カラム（列）の閲覧可否判定
function checkColumnAccess(tableId, colId) {
  const userId = getCurrentUserId();
  const isAdminReal = state.currentUser && state.currentUser.id === 'admin';

  if (isAdminReal && !state.previewUserId) {
    return { visible: true, grayout: false };
  }

  const tableCols = state.permissions.columns[tableId] || {};
  const allowed = tableCols[colId] || [];
  
  const colKeys = Object.keys(tableCols);
  const isSetup = colKeys.includes(colId);
  const hasAccess = !isSetup || allowed.includes(userId);

  if (hasAccess) {
    return { visible: true, grayout: false };
  }

  if (state.previewUserId && state.previewMode === 'grayout' && isAdminReal) {
    return { visible: true, grayout: true };
  }

  return { visible: false, grayout: false };
}

// 行（データ行）の閲覧可否判定
function checkRowAccess(tableId, row) {
  const userId = getCurrentUserId();
  const isAdminReal = state.currentUser && state.currentUser.id === 'admin';

  if (isAdminReal && !state.previewUserId) {
    return { visible: true, grayout: false };
  }

  const filterSetting = (state.permissions.rowFilters[tableId] || {})[userId];
  
  if (!filterSetting || !filterSetting.rules || filterSetting.rules.length === 0) {
    return { visible: true, grayout: false };
  }

  const matchType = filterSetting.matchType || 'OR';
  
  const evalRule = (rule) => {
    const val = String(row[rule.columnId] || '').toLowerCase();
    const query = String(rule.word || '').toLowerCase();
    return val.includes(query);
  };

  let isMatch = false;
  if (matchType === 'AND') {
    isMatch = filterSetting.rules.every(rule => evalRule(rule));
  } else {
    isMatch = filterSetting.rules.some(rule => evalRule(rule));
  }

  if (isMatch) {
    return { visible: true, grayout: false };
  }

  if (state.previewUserId && state.previewMode === 'grayout' && isAdminReal) {
    return { visible: true, grayout: true };
  }

  return { visible: false, grayout: false };
}

// インライン権限付与ヘルパー
function appendInlineGrantBtn(parentEl, onClick) {
  if (!parentEl) return;
  if (parentEl.querySelector('.grant-access-inline-btn')) return;
  const btn = document.createElement('button');
  btn.className = 'grant-access-inline-btn';
  btn.innerHTML = '🔓 権限付与';
  btn.title = 'プレビュー中のユーザーにこの閲覧権限を付与します';
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    onClick();
  });
  parentEl.appendChild(btn);
}

function removeInlineGrantBtn(parentEl) {
  if (!parentEl) return;
  const btn = parentEl.querySelector('.grant-access-inline-btn');
  if (btn) btn.remove();
}

function grantPermission(type, targetId) {
  const userId = getCurrentUserId();
  if (!userId || userId === 'admin') return;

  if (type === 'folder') {
    if (!state.permissions.folders[targetId]) state.permissions.folders[targetId] = [];
    if (!state.permissions.folders[targetId].includes(userId)) {
      state.permissions.folders[targetId].push(userId);
    }
  } else if (type === 'table') {
    if (!state.permissions.tables[targetId]) state.permissions.tables[targetId] = [];
    if (!state.permissions.tables[targetId].includes(userId)) {
      state.permissions.tables[targetId].push(userId);
    }
  }
  savePermissions();
  renderCustomTableList();
  
  if (state.currentView === 'jo-info-screen') renderJoInfo();
  else if (state.currentView === 'applicant-info-screen') renderApplicantInfo();
  else if (state.currentView === 'agency-info-screen') renderAgencyInfo();
  else if (state.currentView === 'custom-table-screen' && state.activeCustomTableId) {
    renderCustomTable(state.activeCustomTableId);
  }
  
  showToast('権限を即時追加しました。', 'success');
}

function grantColumnPermissionDirect(tableId, colId) {
  const userId = getCurrentUserId();
  if (!userId || userId === 'admin') return;

  if (!state.permissions.columns[tableId]) state.permissions.columns[tableId] = {};
  if (!state.permissions.columns[tableId][colId]) state.permissions.columns[tableId][colId] = [];
  if (!state.permissions.columns[tableId][colId].includes(userId)) {
    state.permissions.columns[tableId][colId].push(userId);
  }
  
  savePermissions();
  renderCustomTableList();
  
  if (state.currentView === 'jo-info-screen') renderJoInfo();
  else if (state.currentView === 'applicant-info-screen') renderApplicantInfo();
  else if (state.currentView === 'agency-info-screen') renderAgencyInfo();
  else if (state.currentView === 'custom-table-screen' && state.activeCustomTableId) {
    renderCustomTable(state.activeCustomTableId);
  }
  
  showToast('カラムの閲覧権限を追加しました。', 'success');
}

function grantRowPermission(tableId) {
  const userId = getCurrentUserId();
  if (!userId || userId === 'admin') return;

  if (state.permissions.rowFilters[tableId]) {
    delete state.permissions.rowFilters[tableId][userId];
  }
  savePermissions();
  renderCustomTableList();
  
  if (state.currentView === 'jo-info-screen') renderJoInfo();
  else if (state.currentView === 'applicant-info-screen') renderApplicantInfo();
  else if (state.currentView === 'agency-info-screen') renderAgencyInfo();
  else if (state.currentView === 'custom-table-screen' && state.activeCustomTableId) {
    renderCustomTable(state.activeCustomTableId);
  }
  showToast('行表示制限（フィルタ）を解除しました。', 'success');
}

function deleteCustomAccordion(accId) {
  const acc = state.customAccordions.find(a => a.id === accId);
  if (!acc) return;
  if (acc.isSystem) {
    showToast('システム標準のフォルダは削除できません。', 'warning');
    return;
  }

  const hasChildren = state.customTables.some(t => t.parentMenuId === accId) ||
                      state.customAccordions.some(a => a.parentMenuId === accId);
  const msg = hasChildren
    ? `フォルダ「${acc.name}」を削除しますか？\n（配下のテーブルやフォルダは親なし直下に戻ります）`
    : `フォルダ「${acc.name}」を削除しますか？`;

  showAppConfirm('フォルダ削除の確認', msg, () => {
    state.customTables.forEach(tbl => {
      if (tbl.parentMenuId === accId) {
        tbl.parentMenuId = 'root';
      }
    });
    saveCustomTables();

    state.customAccordions.forEach(a => {
      if (a.parentMenuId === accId) {
        a.parentMenuId = 'root';
      }
    });

    state.customAccordions = state.customAccordions.filter(a => a.id !== accId);
    saveCustomAccordions();
    
    delete state.permissions.folders[accId];
    savePermissions();

    renderCustomTableList();
    renderModalFolderTree();
    showToast(`フォルダ「${acc.name}」を削除しました。`, 'success');
  });
}

// 標準メニュー要素のキャッシュ（DOM再構築時のロスト防止）
let cachedSysAccs = null;
let cachedSysTables = null;
let cachedAppointSubMenus = null;

function renderCustomTableList() {
  const sidebarNav = document.querySelector('.sidebar-nav');
  if (!sidebarNav) return;

  console.log('[Synapse Debug] renderCustomTableList called.');
  console.log('[Synapse Debug] Current customAccordions:', state.customAccordions);
  console.log('[Synapse Debug] Cached DOM elements exists:', !!cachedSysAccs);

  // 初回のみ標準要素を取得してキャッシュ
  if (!cachedSysAccs) {
    cachedSysAccs = {
      'appoint-accordion': document.getElementById('appoint-accordion'),
      'agency-accordion': document.getElementById('agency-accordion'),
      'jo-accordion': document.getElementById('jo-accordion'),
      'applicant-accordion': document.getElementById('applicant-accordion')
    };
    console.log('[Synapse Debug] cachedSysAccs initialized:', cachedSysAccs);
  }
  if (!cachedSysTables) {
    cachedSysTables = {
      'agency-info-screen': document.getElementById('menu-agency-info'),
      'jo-info-screen': document.getElementById('menu-jo-info'),
      'applicant-info-screen': document.getElementById('menu-applicant-info'),
      'appointment-new': document.getElementById('menu-new-appoint'),
      'appointment-existing': document.getElementById('menu-existing-appoint'),
      'drafts-view-screen': document.getElementById('menu-drafts-list'),
      'history-view-screen': document.getElementById('menu-history-list'),
      'official-id-link': document.getElementById('menu-link-official')
    };
  }
  if (!cachedAppointSubMenus) {
    cachedAppointSubMenus = [
      document.getElementById('menu-new-appoint'),
      document.getElementById('menu-existing-appoint'),
      document.getElementById('menu-drafts-list'),
      document.getElementById('menu-history-list'),
      document.getElementById('menu-link-official')
    ];
  }

  // キャッシュからクローン（参照渡しを防ぐためシャローコピー）
  const sysAccs = { ...cachedSysAccs };
  const sysTables = { ...cachedSysTables };
  const appointSubMenus = [...cachedAppointSubMenus];

  // 既存の動的カスタムアコーディオンおよびテーブルボタンをクリア
  sidebarNav.querySelectorAll('.sidebar-accordion').forEach(acc => {
    if (acc.id && acc.id.startsWith('cacc_')) {
      acc.remove();
    }
  });
  sidebarNav.querySelectorAll('.nav-item').forEach(btn => {
    if (btn.id && btn.id.startsWith('menu-custom-table-')) {
      btn.remove();
    }
  });

  // 標準フォルダとテーブル、およびサブメニューを一旦DOMから取り外す
  Object.values(sysAccs).forEach(el => { if (el) el.remove(); });
  Object.values(sysTables).forEach(el => { if (el) el.remove(); });
  appointSubMenus.forEach(el => { if (el) el.remove(); });

  // 2. 再帰的なアコーディオン・テーブルの再配置 (エクスプローラー風ツリー連動)
  const renderMenuNode = (parentId, containerEl, depth = 0) => {
    const normalizedParentId = normalizeFolderId(parentId);

    // A. 親IDに属するアコーディオン（標準フォルダ ＋ カスタムフォルダ）を抽出
    const childFolders = state.customAccordions.filter(acc => normalizeFolderId(acc.parentMenuId || 'root') === normalizedParentId);

    childFolders.forEach(acc => {
      const access = checkFolderAccess(acc.id);
      if (!access.visible) return;

      let folderDiv = sysAccs[acc.id]; // 標準フォルダの場合

      if (folderDiv) {
        // 標準アコーディオンの名前とカスタムアイコンを動的に反映
        const headerEl = folderDiv.querySelector('.accordion-header');
        if (headerEl) {
          const defaultIcon = acc.id === 'appoint-accordion' ? '📅' :
                              acc.id === 'agency-accordion' ? '💼' :
                              acc.id === 'jo-accordion' ? '📑' : '📋';
          const iconHtml = getUserItemIconHtml(acc.id, defaultIcon);
          headerEl.setAttribute('data-tooltip', acc.name);
          headerEl.innerHTML = `<span class="accordion-arrow">▼</span>${iconHtml}<span class="accordion-header-text">${acc.name}</span>`;

          const editBtn = document.createElement('span');
          editBtn.textContent = '🎨';
          editBtn.className = 'custom-icon-edit-btn';
          editBtn.title = 'アイコンを変更';
          editBtn.style.cssText = 'cursor: pointer; margin-left: auto; font-size: 0.75rem; opacity: 0; transition: opacity 0.2s; padding: 0 0.2rem;';
          editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openCustomIconModal(acc.id, acc.name);
          });
          headerEl.appendChild(editBtn);

          headerEl.addEventListener('mouseenter', () => { editBtn.style.opacity = '0.7'; });
          headerEl.addEventListener('mouseleave', () => { editBtn.style.opacity = '0'; });
        }
      } else {
        // 新規カスタムアコーディオンを動的生成
        folderDiv = document.createElement('div');
        folderDiv.className = 'sidebar-accordion';
        folderDiv.id = acc.id;
        folderDiv.style.marginTop = '0.15rem';

        const header = document.createElement('button');
        header.className = 'accordion-header';
        header.id = `menu-${acc.id}-parent`;
        header.setAttribute('data-tooltip', acc.name);

        const iconHtml = getUserItemIconHtml(acc.id, '📁');
        header.innerHTML = `<span class="accordion-arrow">▼</span>${iconHtml}<span class="accordion-header-text">${acc.name}</span>`;

        const editBtn = document.createElement('span');
        editBtn.textContent = '🎨';
        editBtn.className = 'custom-icon-edit-btn';
        editBtn.title = 'アイコンを変更';
        editBtn.style.cssText = 'cursor: pointer; margin-left: auto; font-size: 0.75rem; opacity: 0; transition: opacity 0.2s; padding: 0 0.2rem;';
        editBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          openCustomIconModal(acc.id, acc.name);
        });
        header.appendChild(editBtn);

        header.addEventListener('mouseenter', () => { editBtn.style.opacity = '0.7'; });
        header.addEventListener('mouseleave', () => { editBtn.style.opacity = '0'; });

        const isAdminReal = state.currentUser && state.currentUser.id === 'admin';
        if (isAdminReal && !state.previewUserId) {
          const delBtn = document.createElement('span');
          delBtn.textContent = '🗑️';
          delBtn.style.cursor = 'pointer';
          delBtn.style.marginLeft = '0.3rem';
          delBtn.style.marginRight = '0.5rem';
          delBtn.style.fontSize = '0.8rem';
          delBtn.style.opacity = '0';
          delBtn.style.transition = 'opacity 0.2s ease-in-out';
          delBtn.title = 'このフォルダを削除';
          delBtn.className = 'custom-folder-del-btn';
          delBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteCustomAccordion(acc.id);
          });
          header.appendChild(delBtn);

          header.addEventListener('mouseenter', () => { delBtn.style.opacity = '0.65'; });
          header.addEventListener('mouseleave', () => { delBtn.style.opacity = '0'; });
        }

        const content = document.createElement('div');
        content.className = 'accordion-content';
        content.id = `menu-${acc.id}-content`;
        content.style.display = 'none';
        content.style.flexDirection = 'column';
        content.style.gap = '0.2rem';
        content.style.marginTop = '0.15rem';

        header.addEventListener('click', (e) => {
          e.stopPropagation();
          header.classList.toggle('collapsed');
          const isHidden = content.style.display === 'none' || !content.style.display;
          content.style.display = isHidden ? 'flex' : 'none';
          const arrow = header.querySelector('.accordion-arrow');
          if (arrow) arrow.textContent = isHidden ? '▼' : '▶';
        });

        folderDiv.appendChild(header);
        folderDiv.appendChild(content);
      }

      folderDiv.draggable = false;

      // グレーアウト制御
      const headerEl = folderDiv.querySelector('.accordion-header');
      if (access.grayout) {
        folderDiv.classList.add('grayed-out-access');
        if (headerEl) {
          appendInlineGrantBtn(headerEl, () => {
            grantPermission('folder', acc.id);
          });
        }
      } else {
        folderDiv.classList.remove('grayed-out-access');
        if (headerEl) removeInlineGrantBtn(headerEl);
      }

      // DOMツリーに挿入
      if (parentId === 'root') {
        sidebarNav.insertBefore(folderDiv, document.getElementById('menu-form-customize') || null);
      } else {
        containerEl.appendChild(folderDiv);
      }

      // フォルダの子要素を再帰アペンド
      const contentEl = folderDiv.querySelector('.accordion-content');
      if (contentEl) {
        contentEl.innerHTML = '';

        // ★ 子フォルダ・子テーブルを再帰アペンド（深さ + 1）
        renderMenuNode(acc.id, contentEl, depth + 1);
      }
    });

    // B. 親IDに直属するテーブル（標準テーブル ＋ カスタムテーブル）を抽出
    const childTables = state.customTables.filter(t => normalizeFolderId(t.parentMenuId || 'root') === normalizedParentId);

    childTables.forEach(tbl => {
      const access = checkTableAccess(tbl.id);
      if (!access.visible) return;

      let btn = sysTables[tbl.id]; // 標準テーブルの場合

      const tableIcon = getUserItemIconHtml(tbl.id, null);
      if (btn) {
        btn.setAttribute('data-tooltip', tbl.name);
        btn.style.display = 'flex';
        btn.style.alignItems = 'center';
        btn.innerHTML = `${tableIcon}<span class="nav-item-text">${tbl.name}</span>`;

        let editBtn = btn.querySelector('.custom-icon-edit-btn');
        if (!editBtn) {
          editBtn = document.createElement('span');
          editBtn.textContent = '🎨';
          editBtn.className = 'custom-icon-edit-btn';
          editBtn.title = 'アイコンを変更';
          editBtn.style.cssText = 'cursor: pointer; margin-left: auto; font-size: 0.75rem; opacity: 0; transition: opacity 0.2s; padding: 0 0.2rem;';
          editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openCustomIconModal(tbl.id, tbl.name);
          });
          btn.appendChild(editBtn);

          btn.addEventListener('mouseenter', () => { editBtn.style.opacity = '0.7'; });
          btn.addEventListener('mouseleave', () => { editBtn.style.opacity = '0'; });
        }
      } else {
        // 新規カスタムテーブルボタンを動的生成
        btn = document.createElement('button');
        btn.className = 'nav-item';
        btn.style.width = '100%';
        btn.style.display = 'flex';
        btn.style.alignItems = 'center';
        btn.style.padding = '0.4rem 0.75rem';
        btn.style.fontSize = '0.85rem';
        btn.style.background = 'none';
        btn.style.border = 'none';
        btn.style.cursor = 'pointer';
        btn.style.color = 'var(--text-secondary)';
        btn.style.borderRadius = 'var(--radius-sm)';
        btn.style.transition = 'all 0.2s';
        btn.id = `menu-custom-table-${tbl.id}`;
        btn.dataset.tab = `custom-table-${tbl.id}`;
        btn.setAttribute('data-tooltip', tbl.name);
        btn.innerHTML = `${tableIcon}<span class="nav-item-text">${tbl.name}</span>`;

        const editBtn = document.createElement('span');
        editBtn.textContent = '🎨';
        editBtn.className = 'custom-icon-edit-btn';
        editBtn.title = 'アイコンを変更';
        editBtn.style.cssText = 'cursor: pointer; margin-left: auto; font-size: 0.75rem; opacity: 0; transition: opacity 0.2s; padding: 0 0.2rem;';
        editBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          openCustomIconModal(tbl.id, tbl.name);
        });
        btn.appendChild(editBtn);

        btn.addEventListener('mouseenter', () => { editBtn.style.opacity = '0.7'; });
        btn.addEventListener('mouseleave', () => { editBtn.style.opacity = '0'; });

        btn.addEventListener('click', () => {
          openTab(`custom-table-${tbl.id}-tab`, `custom-table-${tbl.id}-screen`, `📊 ${tbl.name}`);
          renderCustomTable(tbl.id);
        });
      }

      btn.draggable = false;

      // テーブルのグレーアウト制御
      if (access.grayout) {
        btn.classList.add('grayed-out-access');
        appendInlineGrantBtn(btn, () => {
          grantPermission('table', tbl.id);
        });
      } else {
        btn.classList.remove('grayed-out-access');
        removeInlineGrantBtn(btn);
      }

      // DOMツリーに挿入
      if (parentId === 'root') {
        btn.style.marginTop = '0.5rem';
        sidebarNav.insertBefore(btn, document.getElementById('menu-form-customize') || null);
      } else {
        containerEl.appendChild(btn);
      }
    });
  };

  // ルート直下から再帰構築
  renderMenuNode('root', sidebarNav);
}

// テーブル作成画面の初期セットアップとイベントリスナーの登録
// 和暦（元号）変換ヘルパー
function convertToWareki(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;

  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();

  const time = d.getTime();
  const reiwaStart = new Date('2019-05-01').getTime();
  const heiseiStart = new Date('1989-01-08').getTime();
  const showaStart = new Date('1926-12-25').getTime();
  const taishoStart = new Date('1912-07-30').getTime();
  const meijiStart = new Date('1868-01-25').getTime();

  let gengo = '';
  let gengoYear = 1;

  if (time >= reiwaStart) {
    gengo = '令和';
    gengoYear = year - 2019 + 1;
  } else if (time >= heiseiStart) {
    gengo = '平成';
    gengoYear = year - 1989 + 1;
  } else if (time >= showaStart) {
    gengo = '昭和';
    gengoYear = year - 1926 + 1;
  } else if (time >= taishoStart) {
    gengo = '大正';
    gengoYear = year - 1912 + 1;
  } else if (time >= meijiStart) {
    gengo = '明治';
    gengoYear = year - 1868 + 1;
  } else {
    return `${year}/${month}/${day}`;
  }

  const yearStr = gengoYear === 1 ? '元' : String(gengoYear);
  return `${gengo}${yearStr}年${month}月${day}日`;
}

// カスタム日時フォーマッター
function formatCustomDate(dateStr, formatType, customPattern) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;

  const yyyy = d.getFullYear();
  const yy = String(yyyy).slice(-2);
  const m = d.getMonth() + 1;
  const mm = String(m).padStart(2, '0');
  const day = d.getDate();
  const dd = String(day).padStart(2, '0');

  if (formatType === 'wareki') {
    return convertToWareki(dateStr);
  }

  let pattern = 'YYYY/MM/DD';
  if (formatType === 'YYYY/MM/DD') pattern = 'YYYY/MM/DD';
  else if (formatType === 'YYYY年MM月DD日') pattern = 'YYYY年MM月DD日';
  else if (formatType === 'custom' && customPattern) pattern = customPattern;

  return pattern
    .replace(/YYYY/g, yyyy)
    .replace(/YY/g, yy)
    .replace(/MM/g, mm)
    .replace(/M/g, m)
    .replace(/DD/g, dd)
    .replace(/D/g, day);
}

function setupTableCreator() {
  const addColBtn = document.getElementById('tc-add-col-btn');
  const columnsList = document.getElementById('tc-columns-list');
  const submitBtn = document.getElementById('tc-submit-btn');

  if (!addColBtn || !columnsList || !submitBtn) return;

  const createColumnRowHtml = (colCount) => {
    return `
      <div class="tc-column-row" style="display: flex; flex-direction: column; gap: 0.35rem; padding: 0.5rem; background: var(--bg-surface-elevated); border: 1px solid var(--border-color); border-radius: var(--radius-sm); margin-bottom: 0.25rem;">
        <div style="display: flex; gap: 0.5rem; align-items: center; width: 100%;">
          <input type="text" class="tc-col-input" value="列${colCount}" placeholder="列名" style="flex: 2; padding: 0.4rem; background: var(--bg-surface); border: 1px solid var(--border-color); color: var(--text-primary); border-radius: var(--radius-sm); outline: none; font-size: 0.85rem;" />
          <select class="tc-col-type" style="flex: 1; padding: 0.4rem; background: var(--bg-surface); border: 1px solid var(--border-color); color: var(--text-primary); border-radius: var(--radius-sm); outline: none; font-size: 0.85rem; cursor: pointer;">
            <option value="text">テキスト</option>
            <option value="number">数値</option>
            <option value="select">プルダウン</option>
            <option value="date">日付</option>
          </select>
          <button type="button" class="btn-icon tc-remove-col-btn" style="background: none; border: none; color: var(--danger); font-size: 1.2rem; cursor: pointer; padding: 0.25rem;">&times;</button>
        </div>
        <div class="tc-choices-container" style="display: none; width: 100%;">
          <input type="text" class="tc-col-choices" placeholder="選択肢をカンマ区切りで入力 (例: 東京,大阪,名古屋)" style="width: 100%; padding: 0.4rem; background: var(--bg-surface); border: 1px solid var(--border-color); color: var(--text-primary); border-radius: var(--radius-sm); outline: none; font-size: 0.8rem;" />
        </div>
        <div class="tc-date-format-container" style="display: none; width: 100%;">
          <div style="display: flex; gap: 0.5rem; align-items: center;">
            <select class="tc-col-date-format" style="flex: 1; padding: 0.4rem; background: var(--bg-surface); border: 1px solid var(--border-color); color: var(--text-primary); border-radius: var(--radius-sm); outline: none; font-size: 0.8rem; cursor: pointer;">
              <option value="YYYY/MM/DD">西暦 (2008/09/26)</option>
              <option value="YYYY年MM月DD日">西暦 (2008年09月26日)</option>
              <option value="wareki">和暦 (平成20年09月26日)</option>
              <option value="custom">カスタム表示形式</option>
            </select>
            <input type="text" class="tc-col-custom-date-format" placeholder="カスタム形式 (例: YYYY-MM-DD)" style="display: none; flex: 1; padding: 0.4rem; background: var(--bg-surface); border: 1px solid var(--border-color); color: var(--text-primary); border-radius: var(--radius-sm); outline: none; font-size: 0.8rem;" />
          </div>
        </div>
      </div>
    `;
  };

  const setupRowEvents = (row) => {
    const removeBtn = row.querySelector('.tc-remove-col-btn');
    if (removeBtn) {
      removeBtn.addEventListener('click', () => {
        if (columnsList.querySelectorAll('.tc-column-row').length > 1) {
          row.remove();
        } else {
          showToast('カラムは最低1つ必要です。', 'warning');
        }
      });
    }

    const typeSelect = row.querySelector('.tc-col-type');
    const choicesContainer = row.querySelector('.tc-choices-container');
    const dateFormatContainer = row.querySelector('.tc-date-format-container');
    const dateFormatSelect = row.querySelector('.tc-col-date-format');
    const customDateFormatInput = row.querySelector('.tc-col-custom-date-format');

    if (typeSelect) {
      typeSelect.addEventListener('change', (e) => {
        if (e.target.value === 'select') {
          choicesContainer.style.display = 'block';
          dateFormatContainer.style.display = 'none';
        } else if (e.target.value === 'date') {
          choicesContainer.style.display = 'none';
          dateFormatContainer.style.display = 'block';
        } else {
          choicesContainer.style.display = 'none';
          dateFormatContainer.style.display = 'none';
        }
      });
    }

    if (dateFormatSelect && customDateFormatInput) {
      dateFormatSelect.addEventListener('change', (e) => {
        if (e.target.value === 'custom') {
          customDateFormatInput.style.display = 'block';
        } else {
          customDateFormatInput.style.display = 'none';
        }
      });
    }
  };

  // 初期ロード時に1列目がなければ挿入する
  if (columnsList.querySelectorAll('.tc-column-row').length === 0) {
    columnsList.innerHTML = createColumnRowHtml(1);
    setupRowEvents(columnsList.querySelector('.tc-column-row'));
  } else {
    columnsList.querySelectorAll('.tc-column-row').forEach(row => setupRowEvents(row));
  }

  addColBtn.addEventListener('click', () => {
    const colCount = columnsList.querySelectorAll('.tc-column-row').length + 1;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = createColumnRowHtml(colCount).trim();
    const newRow = tempDiv.firstChild;
    setupRowEvents(newRow);
    columnsList.appendChild(newRow);
  });

  submitBtn.addEventListener('click', () => {
    const tableNameInput = document.getElementById('tc-table-name');
    if (!tableNameInput) return;

    const tableName = tableNameInput.value.trim();
    if (!tableName) {
      showToast('テーブル名を入力してください。', 'warning');
      return;
    }

    const colRows = columnsList.querySelectorAll('.tc-column-row');
    const columns = [];
    let colIndex = 1;
    let hasEmptyCol = false;
    let hasEmptyChoices = false;

    colRows.forEach(row => {
      const nameInput = row.querySelector('.tc-col-input');
      const typeSelect = row.querySelector('.tc-col-type');
      const choicesInput = row.querySelector('.tc-col-choices');
      const dateFormatSelect = row.querySelector('.tc-col-date-format');
      const customDateFormatInput = row.querySelector('.tc-col-custom-date-format');

      const colName = nameInput ? nameInput.value.trim() : '';
      const colType = typeSelect ? typeSelect.value : 'text';
      let choices = [];
      let dateFormat = 'YYYY/MM/DD';
      let customDateFormat = '';

      if (!colName) {
        hasEmptyCol = true;
        return;
      }

      if (colType === 'select') {
        const rawChoices = choicesInput ? choicesInput.value.trim() : '';
        if (!rawChoices) {
          hasEmptyChoices = true;
          return;
        }
        choices = rawChoices.split(',').map(c => c.trim()).filter(c => c).map((c, idx) => ({
          value: c,
          color: VALIDATION_PALETTE_COLORS[idx % VALIDATION_PALETTE_COLORS.length]
        }));
        if (choices.length === 0) {
          hasEmptyChoices = true;
          return;
        }
      }

      if (colType === 'date') {
        dateFormat = dateFormatSelect ? dateFormatSelect.value : 'YYYY/MM/DD';
        if (dateFormat === 'custom') {
          customDateFormat = customDateFormatInput ? customDateFormatInput.value.trim() : '';
          if (!customDateFormat) {
            customDateFormat = 'YYYY-MM-DD';
          }
        }
      }

      columns.push({
        id: `col_${colIndex}`,
        label: colName,
        type: colType,
        choices: choices,
        dropdownStyle: colType === 'select' ? 'chip-outline' : undefined,
        dateFormat: dateFormat,
        customDateFormat: customDateFormat,
        required: colIndex === 1
      });
      colIndex++;
    });

    if (hasEmptyCol) {
      showToast('空のカラム名があります。すべてのカラム名を入力してください。', 'warning');
      return;
    }

    if (hasEmptyChoices) {
      showToast('プルダウン形式のカラムには、選択肢を1つ以上（カンマ区切りで）入力してください。', 'warning');
      return;
    }

    if (columns.length === 0) {
      showToast('カラムを最低1つ定義してください。', 'warning');
      return;
    }

    const tableId = `ctbl_${Date.now()}`;
    const defaultWidths = {};
    columns.forEach(col => {
      defaultWidths[col.id] = 120;
    });

    const tableParentInput = document.getElementById('tc-table-parent');
    const parentMenuId = tableParentInput ? tableParentInput.value : 'custom-tables';

    const newTable = {
      id: tableId,
      name: tableName,
      parentMenuId: parentMenuId,
      columns: columns,
      visibleColumns: columns.map(c => c.id),
      columnWidths: defaultWidths,
      rowHeights: {},
      fixedCol: 'none',
      fixedRow: 'none',
      cellStyles: {},
      rows: [
        { id: `row_${Date.now()}_1` }
      ]
    };

    columns.forEach(col => {
      newTable.rows[0][col.id] = '';
    });

    state.customTables.push(newTable);
    saveCustomTables();

    showToast(`テーブル「${tableName}」を作成しました。`, 'success');

    tableNameInput.value = '';
    columnsList.innerHTML = createColumnRowHtml(1).trim();
    setupRowEvents(columnsList.querySelector('.tc-column-row'));

    renderCustomTableList();
    openTab(`custom-table-${tableId}`, 'custom-table-screen', `📋 ${tableName}`);
  });
}

// 表示列選択チェックボックスの描画
function renderCtColumnSelector(tbl) {
  const container = document.getElementById('ct-column-selector-dropdown');
  if (!container) return;
  container.innerHTML = '';

  tbl.columns.forEach(col => {
    if (col.required) return; // 1列目は常に表示

    const label = document.createElement('label');
    label.style.display = 'inline-flex';
    label.style.alignItems = 'center';
    label.style.gap = '0.4rem';
    label.style.cursor = 'pointer';
    label.style.color = 'var(--text-primary)';
    label.style.userSelect = 'none';
    label.style.fontSize = '0.8rem';
    label.style.width = '100%';
    label.style.marginBottom = '0.25rem';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = col.id;
    checkbox.checked = tbl.visibleColumns.includes(col.id);

    checkbox.addEventListener('change', (e) => {
      if (e.target.checked) {
        if (!tbl.visibleColumns.includes(col.id)) {
          tbl.visibleColumns.push(col.id);
        }
      } else {
        tbl.visibleColumns = tbl.visibleColumns.filter(id => id !== col.id);
      }
      saveCustomTables();
      renderCustomTable(tbl.id);
    });

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(col.label));
    container.appendChild(label);
  });
}

// ウィンドウ枠固定のセレクトボックス更新
function setupCtFrameFix(tbl) {
  const colSelect = document.getElementById('ct-fix-col-select');
  const rowSelect = document.getElementById('ct-fix-row-select');

  if (!colSelect || !rowSelect) return;

  colSelect.innerHTML = '<option value="none">固定しない</option>';
  
  let activeColIndex = 0;
  tbl.columns.forEach(col => {
    if (tbl.visibleColumns.includes(col.id)) {
      const letter = getColumnLetter(activeColIndex);
      const option = document.createElement('option');
      option.value = col.id;
      option.textContent = `${letter}列 (${col.label}) まで固定`;
      option.selected = tbl.fixedCol === col.id;
      colSelect.appendChild(option);
      activeColIndex++;
    }
  });

  rowSelect.value = tbl.fixedRow || 'none';

  if (!colSelect.dataset.listenerAttached) {
    colSelect.dataset.listenerAttached = 'true';
    colSelect.addEventListener('change', (e) => {
      if (state.activeCustomTableId) {
        const activeTbl = state.customTables.find(t => t.id === state.activeCustomTableId);
        if (activeTbl) {
          activeTbl.fixedCol = e.target.value;
          saveCustomTables();
          renderCustomTable(activeTbl.id);
        }
      }
    });
  }

  if (!rowSelect.dataset.listenerAttached) {
    rowSelect.dataset.listenerAttached = 'true';
    rowSelect.addEventListener('change', (e) => {
      if (state.activeCustomTableId) {
        const activeTbl = state.customTables.find(t => t.id === state.activeCustomTableId);
        if (activeTbl) {
          activeTbl.fixedRow = e.target.value;
          saveCustomTables();
          renderCustomTable(activeTbl.id);
        }
      }
    });
  }
}

// リサイズターゲット管理用の一時ステート
const ctResizeState = {
  tblId: null,
  type: null,
  targetId: null
};

// 行高ドラッグ調整のセットアップ
function setupCtRowResize(tbl, rowIndex, resizeHandle) {
  let startY = 0;
  let startHeight = 0;

  const onMouseMove = (e) => {
    const diff = e.clientY - startY;
    const newHeight = Math.max(15, startHeight + diff);
    
    if (!tbl.rowHeights) tbl.rowHeights = {};
    tbl.rowHeights[rowIndex] = newHeight;
    
    const trs = document.querySelectorAll(`#ct-table-body tr[data-row-id]`);
    const tr = trs[rowIndex];
    if (tr) {
      tr.style.height = `${newHeight}px`;
    }
  };

  const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    saveCustomTables();
    renderCustomTable(tbl.id);
  };

  resizeHandle.addEventListener('mousedown', (e) => {
    e.stopPropagation();
    e.preventDefault();
    startY = e.clientY;
    startHeight = tbl.rowHeights && tbl.rowHeights[rowIndex] ? tbl.rowHeights[rowIndex] : 30;
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
}

// マスタテーブル（jo, ap, ag）用の行高ドラッグ調整セットアップ
function setupMasterRowResize(prefix, rowIndex, resizeHandle) {
  let startY = 0;
  let startHeight = 0;

  const onMouseMove = (e) => {
    const diff = e.clientY - startY;
    const newHeight = Math.max(15, startHeight + diff);
    
    let rowHeightsObj;
    let trIdPrefix;
    
    if (prefix === 'jo') {
      rowHeightsObj = state.joRowHeights;
      trIdPrefix = 'jo-table-body';
    } else if (prefix === 'ap') {
      rowHeightsObj = state.apRowHeights;
      trIdPrefix = 'applicant-table-body';
    } else if (prefix === 'ag') {
      rowHeightsObj = state.agRowHeights;
      trIdPrefix = 'agency-table-body';
    }

    rowHeightsObj[rowIndex] = newHeight;
    
    const trs = document.querySelectorAll(`#${trIdPrefix} tr`);
    const tr = trs[rowIndex];
    if (tr) {
      tr.style.height = `${newHeight}px`;
      tr.style.maxHeight = `${newHeight}px`;
      tr.style.minHeight = `${newHeight}px`;
      tr.querySelectorAll('td').forEach(td => {
        td.style.height = `${newHeight}px`;
        td.style.maxHeight = `${newHeight}px`;
        td.style.minHeight = `${newHeight}px`;
        if (td.classList.contains('row-number-col')) {
          td.style.lineHeight = `${newHeight}px`;
        }
      });
    }
  };

  const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    
    let storageKey;
    let renderFn;
    let rowHeightsObj;
    if (prefix === 'jo') {
      storageKey = STORAGE_KEYS.JO_ROW_HEIGHTS;
      rowHeightsObj = state.joRowHeights;
      renderFn = renderJoInfo;
    } else if (prefix === 'ap') {
      storageKey = STORAGE_KEYS.AP_ROW_HEIGHTS;
      rowHeightsObj = state.apRowHeights;
      renderFn = renderApplicantInfo;
    } else if (prefix === 'ag') {
      storageKey = STORAGE_KEYS.AG_ROW_HEIGHTS;
      rowHeightsObj = state.agRowHeights;
      renderFn = renderAgencyInfo;
    }
    
    setSettingItem(storageKey, JSON.stringify(rowHeightsObj));
    renderFn();
  };

  resizeHandle.addEventListener('mousedown', (e) => {
    e.stopPropagation();
    e.preventDefault();
    startY = e.clientY;
    let rowHeightsObj = (prefix === 'jo') ? state.joRowHeights : ((prefix === 'ap') ? state.apRowHeights : state.agRowHeights);
    startHeight = rowHeightsObj[rowIndex] || 30;
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
}

// マスタテーブル（jo, ap, ag）用の右クリック行高数値指定ダイアログ
function setupMasterRowContextMenu(prefix, rowIndex, rowNumTd) {
  rowNumTd.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    e.stopPropagation();

    let rowHeightsObj;
    let selectedRowsSet;
    let storageKey;
    let renderFn;
    let displayPrefix;

    if (prefix === 'jo') {
      rowHeightsObj = state.joRowHeights;
      selectedRowsSet = state.joSelectedRows;
      storageKey = STORAGE_KEYS.JO_ROW_HEIGHTS;
      renderFn = renderJoInfo;
      displayPrefix = '案件マスタ';
    } else if (prefix === 'ap') {
      rowHeightsObj = state.apRowHeights;
      selectedRowsSet = state.apSelectedRows;
      storageKey = STORAGE_KEYS.AP_ROW_HEIGHTS;
      renderFn = renderApplicantInfo;
      displayPrefix = '申込者マスタ';
    } else if (prefix === 'ag') {
      rowHeightsObj = state.agRowHeights;
      selectedRowsSet = state.agSelectedRows;
      storageKey = STORAGE_KEYS.AG_ROW_HEIGHTS;
      renderFn = renderAgencyInfo;
      displayPrefix = '代理店マスタ';
    }

    const currentHeight = rowHeightsObj[rowIndex] || 30;
    const isTargetInSelection = selectedRowsSet.has(rowIndex);
    const targetRows = isTargetInSelection ? Array.from(selectedRowsSet) : [rowIndex];
    const label = isTargetInSelection ? `選択された ${targetRows.length} 行` : `${displayPrefix} 行 [ ${rowIndex + 1} ]`;

    const newHeightStr = prompt(`${label} の高さを入力してください (px):`, currentHeight);
    if (newHeightStr !== null) {
      const newHeight = parseInt(newHeightStr, 10);
      if (!isNaN(newHeight) && newHeight >= 15) {
        targetRows.forEach(rIdx => {
          rowHeightsObj[rIdx] = newHeight;
        });
        setSettingItem(storageKey, JSON.stringify(rowHeightsObj));
        renderFn();
        showToast(`${label} の高さを ${newHeight}px に設定しました。`, 'success');
      } else {
        showToast('無効な数値です（15px以上の数値を入力してください）。', 'error');
      }
    }
  });
}

// カスタムコンテキストメニューの表示
function showCtContextMenu(x, y, tbl, type, targetId) {
  if (window.logToDebugPanel) {
    window.logToDebugPanel(`showCtContextMenu: type=${type}, targetId=${targetId}`, '#00ffff');
  }
  const menu = document.getElementById('ct-context-menu');
  if (!menu) {
    if (window.logToDebugPanel) window.logToDebugPanel('ERR: ct-context-menu not found in DOM', '#ff4444');
    return;
  }

  ctResizeState.tblId = tbl.id;
  ctResizeState.type = type;
  ctResizeState.targetId = targetId;

  const widthItem = document.getElementById('ct-menu-change-width');
  const heightItem = document.getElementById('ct-menu-change-height');
  const dropdownSettingsItem = document.getElementById('ct-menu-dropdown-settings');

  if (type === 'col') {
    if (widthItem) widthItem.style.display = 'block';
    if (heightItem) heightItem.style.display = 'none';
    if (dropdownSettingsItem) dropdownSettingsItem.style.display = 'block';
  } else {
    if (widthItem) widthItem.style.display = 'none';
    if (heightItem) heightItem.style.display = 'block';
    if (dropdownSettingsItem) dropdownSettingsItem.style.display = 'none';
  }

  menu.style.left = `${x}px`;
  menu.style.top = `${y}px`;
  menu.style.display = 'block';

  const closeMenu = (e) => {
    if (menu.contains(e.target) && !e.target.classList.contains('context-item')) {
      return;
    }
    menu.style.display = 'none';
    document.removeEventListener('mousedown', closeMenu);
  };
  
  setTimeout(() => {
    document.addEventListener('mousedown', closeMenu);
  }, 100);
}

// 列幅ドラッグ調整のセットアップ
function setupCtColumnResize(tbl, colId, resizeHandle) {
  let startX = 0;
  let startWidth = 0;

  const onMouseMove = (e) => {
    const diff = e.clientX - startX;
    const newWidth = Math.max(60, startWidth + diff);
    
    tbl.columnWidths[colId] = newWidth;
    
    const ths = document.querySelectorAll(`#ct-table-thead th[data-col-id="${colId}"]`);
    ths.forEach(th => {
      th.style.width = `${newWidth}px`;
      th.style.minWidth = `${newWidth}px`;
    });

    const tds = document.querySelectorAll(`#ct-table-body td[data-col-id="${colId}"]`);
    tds.forEach(td => {
      td.style.width = `${newWidth}px`;
      td.style.minWidth = `${newWidth}px`;
    });
  };

  const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    saveCustomTables();
    renderCustomTable(tbl.id);
  };

  resizeHandle.addEventListener('mousedown', (e) => {
    e.stopPropagation();
    e.preventDefault();
    startX = e.clientX;
    startWidth = tbl.columnWidths[colId] || 120;
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
}

// セルへのインラインスタイル（書式）の適用ヘルパー
function applyInlineStylesToCell(element, style) {
  const getStyleVal = (camel, kebab) => style[camel] !== undefined ? style[camel] : style[kebab];

  element.style.fontWeight = getStyleVal('fontWeight', 'font-weight') || 'normal';
  element.style.fontStyle = getStyleVal('fontStyle', 'font-style') || 'normal';
  element.style.textDecoration = getStyleVal('textDecoration', 'text-decoration') || 'none';
  element.style.color = getStyleVal('color', 'color') || '';
  element.style.backgroundColor = getStyleVal('bg', 'background-color') || '';
  element.style.fontSize = getStyleVal('fontSize', 'font-size') || '0.85rem';
  element.style.textAlign = getStyleVal('textAlign', 'text-align') || 'left';
  element.style.verticalAlign = getStyleVal('verticalAlign', 'vertical-align') || 'middle';
  
  const whiteSpace = getStyleVal('whiteSpace', 'white-space');
  const textOverflow = getStyleVal('textOverflow', 'text-overflow');
  const overflow = getStyleVal('overflow', 'overflow');

  if (whiteSpace === 'normal') {
    // 折り返し (Wrap)
    element.style.whiteSpace = 'normal';
    element.style.overflow = 'visible';
    element.style.textOverflow = '';
  } else if (whiteSpace === 'nowrap' && (textOverflow === 'clip' || overflow === 'visible')) {
    // はみ出し (Overflow) - 初期設定では nowrap / clip。後続の adjustOverflowCells で overflow を動的に調整する
    element.style.whiteSpace = 'nowrap';
    element.style.overflow = 'hidden';
    element.style.textOverflow = 'clip';
  } else if (whiteSpace === 'nowrap') {
    // 切り詰め (Clip)
    element.style.whiteSpace = 'nowrap';
    element.style.overflow = 'hidden';
    element.style.textOverflow = textOverflow || 'ellipsis';
  } else {
    // デフォルト (切り詰め/三点リーダー)
    element.style.whiteSpace = 'nowrap';
    element.style.overflow = 'hidden';
    element.style.textOverflow = 'ellipsis';
  }
}

// はみ出し(Overflow)セルが右隣のセルと重なるか、または自動で切り落とされるかを動的に調整する
function adjustOverflowCells(tableElement) {
  if (!tableElement) return;
  
  const rows = tableElement.querySelectorAll('tbody tr');
  rows.forEach(row => {
    const cells = Array.from(row.querySelectorAll('td'));
    
    cells.forEach((td, idx) => {
      // style.whiteSpace === 'nowrap' && style.textOverflow === 'clip' の場合が「はみ出し」設定
      const isOverflowMode = td.style.whiteSpace === 'nowrap' && td.style.textOverflow === 'clip';
      if (!isOverflowMode) return;
      
      const nextTd = cells[idx + 1];
      let isNextEmpty = true;
      
      if (nextTd) {
        // 右隣のセルに値があるか判定 (入力欄、選択肢チップ、プレーンテキストなど)
        const text = nextTd.textContent.replace('▼', '').trim();
        const input = nextTd.querySelector('input, select');
        const inputValue = input ? input.value.trim() : '';
        const chip = nextTd.querySelector('.ct-chip-fill, .ct-chip-outline, .badge');
        const chipValue = chip ? chip.textContent.trim() : '';
        
        if (text || inputValue || chipValue) {
          isNextEmpty = false;
        }
      }
      
      if (isNextEmpty) {
        td.style.overflow = 'visible';
        td.style.zIndex = '1';
      } else {
        td.style.overflow = 'hidden';
        td.style.zIndex = '';
      }
    });
  });
}

// 汎用カスタムテーブル画面の動的描画
function renderCustomTable(tableId) {
  const tbl = state.customTables.find(t => t.id === tableId);
  if (!tbl) return;

  const listSection = document.querySelector('#custom-table-screen .list-section');
  if (listSection) {
    renderTableControlBar(tableId, listSection);
  }

  const nameInput = document.getElementById('ct-table-name-input');
  if (nameInput) {
    nameInput.value = tbl.name;
    if (!nameInput.dataset.listenerAttached) {
      nameInput.dataset.listenerAttached = 'true';
      nameInput.addEventListener('change', (e) => {
        const newName = e.target.value.trim();
        if (newName) {
          tbl.name = newName;
          saveCustomTables();
          const tab = state.tabs.find(t => t.id === `custom-table-${tbl.id}`);
          if (tab) tab.title = `📋 ${newName}`;
          
          const menuBtn = document.getElementById(`menu-custom-table-${tbl.id}`);
          if (menuBtn) menuBtn.textContent = `📋 ${newName}`;
          
          renderTabBar();
          showToast('テーブル名を変更しました。', 'success');
        } else {
          nameInput.value = tbl.name;
        }
      });
    }
  }

  // 配置先の同期と変更イベント
  const parentSelect = document.getElementById('ct-table-parent-select');
  if (parentSelect) {
    parentSelect.value = tbl.parentMenuId || 'custom-tables';
    parentSelect.dataset.activeTableId = tableId;
    if (!parentSelect.dataset.listenerAttached) {
      parentSelect.dataset.listenerAttached = 'true';
      parentSelect.addEventListener('change', (e) => {
        const activeTblId = parentSelect.dataset.activeTableId;
        const activeTbl = state.customTables.find(t => t.id === activeTblId);
        if (activeTbl) {
          activeTbl.parentMenuId = e.target.value;
          saveCustomTables();
          renderCustomTableList(); // サイドバーの再描画
          showToast('配置先メニューを変更しました。', 'success');
        }
      });
    }
  }

  renderCtColumnSelector(tbl);
  setupCtFrameFix(tbl);

  const thead = document.getElementById('ct-table-thead');
  const tbody = document.getElementById('ct-table-body');
  if (!thead || !tbody) return;

  thead.innerHTML = '';
  tbody.innerHTML = '';

  const columns = tbl.columns;
  const baseVisibleColumnIds = tbl.visibleColumns;
  const visibleColumnIds = [];
  columns.forEach(col => {
    const access = checkColumnAccess(`custom-table-${tbl.id}`, col.id);
    if (access.visible) {
      if (baseVisibleColumnIds.includes(col.id) || access.grayout) {
        visibleColumnIds.push(col.id);
      }
    }
  });

  // --- 固定列・固定行の計算 ---
  const fixedColIds = [];
  if (tbl.fixedCol && tbl.fixedCol !== 'none') {
    for (let i = 0; i < columns.length; i++) {
      const col = columns[i];
      if (visibleColumnIds.includes(col.id)) {
        fixedColIds.push(col.id);
        if (col.id === tbl.fixedCol) break;
      }
    }
  }

  const leftPosMap = {};
  let currentLeft = 70; // チェックボックス列 (20px) + 行番号列 (50px) = 合計 70px
  if (fixedColIds.length > 0) {
    fixedColIds.forEach(colId => {
      leftPosMap[colId] = currentLeft;
      const w = tbl.columnWidths[colId] || 120;
      currentLeft += w;
    });
  }

  const fixedRowLimit = tbl.fixedRow !== 'none' ? parseInt(tbl.fixedRow, 10) : 0;
  const topPosMap = {};
  let currentTop = 54; // 列記号 24px + 列名 30px = 合計 54px
  if (fixedRowLimit > 0) {
    for (let i = 0; i < fixedRowLimit; i++) {
      topPosMap[i] = currentTop;
      const rHeight = tbl.rowHeights && tbl.rowHeights[i] ? tbl.rowHeights[i] : 30;
      currentTop += rHeight;
    }
  }

  // 全選択共通処理
  const handleCtSelectAll = (e) => {
    if (e.target.tagName === 'INPUT') return;
    e.preventDefault();
    e.stopPropagation();
    
    state.ctSelectedCell = null;
    state.ctSelectedRange = null;
    state.ctSelectedCols.clear();
    state.ctSelectedRows.clear();
    state.ctSelectedCells.clear();
    
    const activeTableBody = document.getElementById('ct-table-body');
    if (activeTableBody) {
      activeTableBody.querySelectorAll('.ct-row-select-checkbox').forEach(cb => {
        cb.checked = true;
        state.ctSelectedRows.add(cb.value);
      });
    }
    
    const allCb = document.getElementById('ct-select-all-rows');
    if (allCb) allCb.checked = true;
    updateCtSelectionHighlight();
    syncCtFormatToolbar();
  };

  // 行1: 列記号行
  const lettersRow = document.createElement('tr');
  lettersRow.className = 'col-letters-row';
  lettersRow.style.height = '24px';

  const cornerTh1 = document.createElement('th');
  cornerTh1.style.width = '20px';
  cornerTh1.style.minWidth = '20px';
  cornerTh1.style.position = 'sticky';
  cornerTh1.style.left = '0px';
  cornerTh1.style.zIndex = '31';
  cornerTh1.style.cursor = 'pointer';
  cornerTh1.title = 'すべてのセルを選択';
  cornerTh1.addEventListener('click', handleCtSelectAll);
  lettersRow.appendChild(cornerTh1);

  const cornerTh2 = document.createElement('th');
  cornerTh2.className = 'row-number-col';
  cornerTh2.style.left = '20px';
  cornerTh2.style.position = 'sticky';
  cornerTh2.style.zIndex = '31';
  cornerTh2.style.cursor = 'pointer';
  cornerTh2.title = 'すべてのセルを選択';
  cornerTh2.addEventListener('click', handleCtSelectAll);
  lettersRow.appendChild(cornerTh2);

  let visibleColIndex = 0;
  columns.forEach(col => {
    if (!visibleColumnIds.includes(col.id)) return;

    const th = document.createElement('th');
    th.textContent = getColumnLetter(visibleColIndex);
    th.style.width = `${tbl.columnWidths[col.id] || 120}px`;
    th.style.minWidth = `${tbl.columnWidths[col.id] || 120}px`;

    if (fixedColIds.includes(col.id)) {
      th.classList.add('fixed-col-header');
      th.style.left = `${leftPosMap[col.id]}px`;
      th.style.position = 'sticky';
      th.style.zIndex = '32';
    }

    // アルファベット行の右クリックでもコンテキストメニューを表示する
    th.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (window.logToDebugPanel) {
        window.logToDebugPanel(`contextmenu (lettersRow th): col.id=${col.id}`, '#ffd700');
      }
      showCtContextMenu(e.clientX, e.clientY, tbl, 'col', col.id);
    });

    lettersRow.appendChild(th);
    visibleColIndex++;
  });
  thead.appendChild(lettersRow);

  // 行2: カラム名行
  const namesRow = document.createElement('tr');
  namesRow.className = 'col-names-row';
  namesRow.style.height = '30px';

  const selectAllTh = document.createElement('th');
  selectAllTh.style.width = '20px';
  selectAllTh.style.minWidth = '20px';
  selectAllTh.style.position = 'sticky';
  selectAllTh.style.left = '0px';
  selectAllTh.style.zIndex = '31';
  selectAllTh.style.cursor = 'pointer';
  selectAllTh.title = 'すべてのセルを選択';
  selectAllTh.innerHTML = '<input type="checkbox" id="ct-select-all-rows" style="margin:0;">';
  selectAllTh.addEventListener('click', handleCtSelectAll);
  namesRow.appendChild(selectAllTh);

  const numHeaderTh = document.createElement('th');
  numHeaderTh.className = 'row-number-col';
  numHeaderTh.style.left = '20px';
  numHeaderTh.style.position = 'sticky';
  numHeaderTh.style.zIndex = '31';
  numHeaderTh.style.cursor = 'pointer';
  numHeaderTh.title = 'すべてのセルを選択';
  numHeaderTh.addEventListener('click', handleCtSelectAll);
  namesRow.appendChild(numHeaderTh);

  columns.forEach(col => {
    if (!visibleColumnIds.includes(col.id)) return;

    const th = document.createElement('th');
    th.style.width = `${tbl.columnWidths[col.id] || 120}px`;
    th.style.minWidth = `${tbl.columnWidths[col.id] || 120}px`;
    th.dataset.colId = col.id;

    const headerWrapper = document.createElement('div');
    headerWrapper.className = 'th-wrapper';
    headerWrapper.style.display = 'flex';
    headerWrapper.style.justifyContent = 'space-between';
    headerWrapper.style.alignItems = 'center';
    headerWrapper.style.padding = '0 0.4rem';
    headerWrapper.style.height = '100%';
    headerWrapper.style.position = 'relative';

    const labelSpan = document.createElement('span');
    labelSpan.className = 'th-label';
    labelSpan.textContent = col.label;
    labelSpan.style.whiteSpace = 'nowrap';
    labelSpan.style.overflow = 'hidden';
    labelSpan.style.textOverflow = 'ellipsis';
    headerWrapper.appendChild(labelSpan);

    const filterBtn = document.createElement('span');
    filterBtn.className = 'filter-icon-btn';
    filterBtn.innerHTML = '▼';
    filterBtn.style.fontSize = '0.65rem';
    filterBtn.style.cursor = 'pointer';
    filterBtn.style.marginLeft = '0.25rem';
    filterBtn.style.opacity = '0.5';
    
    if (state.ctFilters[tableId] && state.ctFilters[tableId][col.id] && state.ctFilters[tableId][col.id].size > 0) {
      filterBtn.style.color = 'var(--secondary)';
      filterBtn.style.opacity = '1';
    }

    filterBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openCtFilterMenu(tbl, col.id, col.label, filterBtn);
    });
    headerWrapper.appendChild(filterBtn);

    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'col-resize-handle';
    resizeHandle.style.position = 'absolute';
    resizeHandle.style.right = '0';
    resizeHandle.style.top = '0';
    resizeHandle.style.bottom = '0';
    resizeHandle.style.width = '5px';
    resizeHandle.style.cursor = 'col-resize';
    resizeHandle.style.zIndex = '10';
    setupCtColumnResize(tbl, col.id, resizeHandle);
    headerWrapper.appendChild(resizeHandle);

    th.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (window.logToDebugPanel) {
        window.logToDebugPanel(`contextmenu (namesRow th): col.id=${col.id}`, '#ffd700');
      }
      showCtContextMenu(e.clientX, e.clientY, tbl, 'col', col.id);
    });

    th.addEventListener('click', (e) => {
      if (e.button !== 0) return;
      if (e.target.classList.contains('filter-icon-btn') || e.target.classList.contains('col-resize-handle')) return;
      
      const visibleCols = tbl.columns.filter(c => tbl.visibleColumns.includes(c.id));
      
      if (e.shiftKey && state.ctColumnSelectAnchor) {
        const anchorIdx = visibleCols.findIndex(c => c.id === state.ctColumnSelectAnchor);
        const clickIdx = visibleCols.findIndex(c => c.id === col.id);
        
        if (anchorIdx !== -1 && clickIdx !== -1) {
          state.ctSelectedCell = null;
          state.ctSelectedRange = null;
          state.ctSelectedRows.clear();
          state.ctSelectedCols.clear();
          
          const startIdx = Math.min(anchorIdx, clickIdx);
          const endIdx = Math.max(anchorIdx, clickIdx);
          
          for (let i = startIdx; i <= endIdx; i++) {
            state.ctSelectedCols.add(visibleCols[i].id);
          }
          state.ctColumnSelectLast = col.id;
          
          updateCtSelectionHighlight();
          syncCtFormatToolbar();
          return;
        }
      }
      
      state.ctSelectedCell = null;
      state.ctSelectedRange = null;
      state.ctSelectedRows.clear();
      state.ctSelectedCols.clear();
      
      state.ctSelectedCols.add(col.id);
      state.ctColumnSelectAnchor = col.id;
      state.ctColumnSelectLast = col.id;
      
      updateCtSelectionHighlight();
      syncCtFormatToolbar();
    });

    th.appendChild(headerWrapper);

    const colAccess = checkColumnAccess(`custom-table-${tbl.id}`, col.id);
    if (colAccess.grayout) {
      th.classList.add('grayed-out-access');
      appendInlineGrantBtn(headerWrapper, () => {
        grantColumnPermissionDirect(`custom-table-${tbl.id}`, col.id);
      });
    }

    if (fixedColIds.includes(col.id)) {
      th.classList.add('fixed-col-header');
      th.style.left = `${leftPosMap[col.id]}px`;
      th.style.position = 'sticky';
      th.style.zIndex = '32';
    }

    namesRow.appendChild(th);
  });
  thead.appendChild(namesRow);

  const selectAllCheckbox = namesRow.querySelector('#ct-select-all-rows');
  if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener('change', (e) => {
      const checked = e.target.checked;
      state.ctSelectedCell = null;
      state.ctSelectedRange = null;
      state.ctSelectedCols.clear();
      state.ctSelectedRows.clear();
      
      const checkboxes = tbody.querySelectorAll('.ct-row-select-checkbox');
      checkboxes.forEach(cb => {
        cb.checked = checked;
        if (checked) {
          state.ctSelectedRows.add(cb.value);
        }
      });
      updateCtSelectionHighlight();
      syncCtFormatToolbar();
    });
  }

  // --- フィルタによる絞り込み ---
  const tableFilters = state.ctFilters[tableId] || {};
  const filteredRows = tbl.rows.filter(row => {
    for (const colId of Object.keys(tableFilters)) {
      const activeFilters = tableFilters[colId];
      if (activeFilters && activeFilters.size > 0) {
        const val = String(row[colId] || '').trim();
        if (!activeFilters.has(val)) {
          return false;
        }
      }
    }
    return true;
  });

  filteredRows.forEach((row, rowIndex) => {
    const rowAccess = checkRowAccess(`custom-table-${tbl.id}`, row);
    if (!rowAccess.visible) return;

    const tr = document.createElement('tr');
    const rowHeight = tbl.rowHeights && tbl.rowHeights[rowIndex] ? tbl.rowHeights[rowIndex] : 30;
    tr.style.height = `${rowHeight}px`;
    tr.dataset.rowId = row.id;

    if (rowAccess.grayout) {
      tr.classList.add('grayed-out-access');
    }

    const isRowFixed = rowIndex < fixedRowLimit;
    if (isRowFixed) {
      tr.style.position = 'sticky';
      tr.style.top = `${topPosMap[rowIndex]}px`;
      tr.style.zIndex = '30';
      tr.classList.add('fixed-row');
    }

    const selectTd = document.createElement('td');
    selectTd.style.width = '20px';
    selectTd.style.minWidth = '20px';
    selectTd.style.textAlign = 'center';
    selectTd.style.background = 'var(--bg-surface-elevated)';
    selectTd.style.position = 'sticky';
    selectTd.style.left = '0px';
    selectTd.style.zIndex = isRowFixed ? '31' : '15';
    selectTd.innerHTML = `<input type="checkbox" class="ct-row-select-checkbox" value="${row.id}" style="margin:0;">`;
    
    const cb = selectTd.querySelector('input');
    cb.checked = state.ctSelectedRows.has(row.id);
    cb.addEventListener('change', (e) => {
      state.ctSelectedCell = null;
      state.ctSelectedRange = null;
      state.ctSelectedCols.clear();
      
      if (e.target.checked) {
        state.ctSelectedRows.add(row.id);
      } else {
        state.ctSelectedRows.delete(row.id);
      }
      
      const allCb = document.getElementById('ct-select-all-rows');
      if (allCb) {
        const total = tbody.querySelectorAll('.ct-row-select-checkbox').length;
        const checkedCount = tbody.querySelectorAll('.ct-row-select-checkbox:checked').length;
        allCb.checked = (total === checkedCount && total > 0);
      }
      
      updateCtSelectionHighlight();
      syncCtFormatToolbar();
    });
    tr.appendChild(selectTd);

    const numTd = document.createElement('td');
    numTd.className = 'row-number-col';
    numTd.style.left = '20px';
    numTd.style.position = 'sticky';
    numTd.style.zIndex = isRowFixed ? '31' : '15';

    if (rowAccess.grayout) {
      numTd.innerHTML = `${rowIndex + 1} <span class="grant-row-btn" style="cursor: pointer; color: var(--primary); font-size: 0.75rem; margin-left: 2px;" title="この行の表示条件を解除（全行表示に更新）">🔓</span>`;
      numTd.querySelector('.grant-row-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        grantRowPermission(`custom-table-${tbl.id}`);
      });
    } else {
      numTd.textContent = rowIndex + 1;
    }

    // 右クリックで行高変更メニュー表示
    numTd.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      e.stopPropagation();
      showCtContextMenu(e.clientX, e.clientY, tbl, 'row', rowIndex);
    });

    // クリックで行全体を選択
    numTd.addEventListener('click', (e) => {
      if (e.button !== 0) return;
      if (e.target.classList.contains('row-resize-handle') || e.target.classList.contains('grant-row-btn')) return;
      
      state.ctSelectedCell = null;
      state.ctSelectedRange = null;
      state.ctSelectedRows.clear();
      state.ctSelectedCols.clear();
      
      state.ctSelectedRows.add(row.id);
      
      updateCtSelectionHighlight();
      syncCtFormatToolbar();
    });

    // ドラッグによる行高調整用リサイズハンドル
    const rowResizeHandle = document.createElement('div');
    rowResizeHandle.className = 'row-resize-handle';
    rowResizeHandle.style.position = 'absolute';
    rowResizeHandle.style.left = '0';
    rowResizeHandle.style.right = '0';
    rowResizeHandle.style.bottom = '0';
    rowResizeHandle.style.height = '4px';
    rowResizeHandle.style.cursor = 'row-resize';
    rowResizeHandle.style.zIndex = '10';
    setupCtRowResize(tbl, rowIndex, rowResizeHandle);
    numTd.appendChild(rowResizeHandle);

    tr.appendChild(numTd);

    columns.forEach(col => {
      if (!visibleColumnIds.includes(col.id)) return;

      const td = document.createElement('td');
      td.style.width = `${tbl.columnWidths[col.id] || 120}px`;
      td.style.minWidth = `${tbl.columnWidths[col.id] || 120}px`;
      td.dataset.rowId = row.id;
      td.dataset.colId = col.id;

      const cellKey = `${row.id}:${col.id}`;
      const style = tbl.cellStyles[cellKey] || {};
      applyInlineStylesToCell(td, style);

      if (fixedColIds.includes(col.id)) {
        td.classList.add('fixed-col-data');
        td.style.left = `${leftPosMap[col.id]}px`;
        td.style.position = 'sticky';
        td.style.zIndex = isRowFixed ? '31' : '10';
      }

      const textVal = row[col.id] !== undefined ? row[col.id] : '';
      let displayVal = textVal;
      if (col.type === 'date' && textVal) {
        displayVal = formatCustomDate(textVal, col.dateFormat, col.customDateFormat);
      }
      
      if (col.type === 'select') {
        normalizeColChoices(col);
        const choice = col.choices.find(c => c.value === textVal);
        if (choice && textVal) {
          const styleType = col.dropdownStyle || 'chip-outline';
          if (styleType === 'chip-fill') {
            td.innerHTML = `
              <div class="ct-dropdown-cell-wrapper" style="justify-content: center; padding-right: 0;">
                <span class="ct-chip-fill" style="background-color: ${choice.color}; color: #ffffff;">${textVal}</span>
                <span class="ct-dropdown-arrow-icon" style="display: none;">▼</span>
              </div>
            `;
          } else if (styleType === 'arrow') {
            td.innerHTML = `
              <div class="ct-dropdown-cell-wrapper">
                <span style="color: ${choice.color}; font-weight: 500;">${textVal}</span>
                <span class="ct-dropdown-arrow-icon">▼</span>
              </div>
            `;
          } else {
            td.innerHTML = `
              <div class="ct-dropdown-cell-wrapper" style="justify-content: center; padding-right: 0;">
                <span class="ct-chip-outline" style="border: 1px solid ${choice.color}; background-color: ${hexToRgba(choice.color, 0.12)}; color: ${choice.color};">${textVal}</span>
                <span class="ct-dropdown-arrow-icon" style="display: none;">▼</span>
              </div>
            `;
          }
        } else {
          td.innerHTML = `
            <div class="ct-dropdown-cell-wrapper">
              <span style="color: var(--text-primary);">${textVal}</span>
              <span class="ct-dropdown-arrow-icon">▼</span>
            </div>
          `;
        }
      } else {
        td.textContent = displayVal;
      }

      // シングルクリックでドロップダウン編集を開く（ドロップダウンのみ）
      td.addEventListener('click', (e) => {
        if (col.type === 'select') {
          e.stopPropagation();
          if (isTableLocked(tableId)) return;
          if (td.querySelector('select')) return;
          td.dispatchEvent(new Event('dblclick'));
        }
      });

      td.addEventListener('dblclick', () => {
        if (isTableLocked(tableId)) return;
        if (td.querySelector('input') || td.querySelector('select')) return;

        let input;
        const isSelect = col.type === 'select' && col.choices && col.choices.length > 0;
        const isDate = col.type === 'date';
        
        if (isSelect) {
          normalizeColChoices(col);
          input = document.createElement('select');
          const optEmpty = document.createElement('option');
          optEmpty.value = '';
          optEmpty.textContent = '選択してください';
          input.appendChild(optEmpty);

          col.choices.forEach(choice => {
            const opt = document.createElement('option');
            opt.value = choice.value;
            opt.textContent = choice.value;
            if (choice.value === textVal) opt.selected = true;
            input.appendChild(opt);
          });
        } else {
          input = document.createElement('input');
          input.type = isDate ? 'date' : (col.type === 'number' ? 'number' : 'text');
          input.value = isDate ? (row[col.id] || '') : td.textContent;
        }

        input.style.width = '100%';
        input.style.height = '100%';
        input.style.border = '2px solid var(--primary)';
        input.style.background = 'var(--bg-surface)';
        input.style.color = 'var(--text-primary)';
        input.style.outline = 'none';
        input.style.padding = '0 4px';
        input.style.boxSizing = 'border-box';

        td.innerHTML = '';
        td.appendChild(input);
        input.focus();

        const finishEdit = () => {
          const newVal = input.value.trim();
          const oldVal = row[col.id] || '';
          logCellEdit(`custom-table-${tbl.id}`, row.id, col.id, oldVal, newVal);
          row[col.id] = newVal;
          saveCustomTables();
          renderCustomTable(tbl.id);
        };

        input.addEventListener('blur', finishEdit);
        if (isSelect) {
          input.addEventListener('change', () => {
            input.blur();
          });
        } else {
          input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
              input.blur();
            }
          });
        }
      });

      td.addEventListener('mousedown', (e) => {
        handleCtCellMouseDown(tbl, row.id, col.id, e);
      });
      td.addEventListener('mouseenter', () => {
        handleCtCellMouseEnter(tbl, row.id, col.id);
      });

      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });

  updateCtSelectionHighlight();
  adjustOverflowCells(document.querySelector('#custom-table-screen .spreadsheet-table'));
}

// --- カスタムテーブル用書式イベント ＆ セル選択 ＆ カラーピッカー ---
let ctStyleTextColor = 'var(--text-primary)';
let ctStyleBgColor = 'transparent';

function setupCtColorPickers() {
  const colorBtn = document.getElementById('ct-text-color-btn');
  const colorDropdown = document.getElementById('ct-color-picker-dropdown');
  if (colorBtn && colorDropdown) {
    colorBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeAllColorPickersExcept(colorDropdown);
      const isHidden = colorDropdown.style.display === 'none' || !colorDropdown.style.display;
      if (isHidden) {
        renderColorPickerContent(colorDropdown);
      }
      colorDropdown.style.display = isHidden ? 'block' : 'none';
    });

    document.addEventListener('mousedown', (e) => {
      if (!colorDropdown.contains(e.target) && !colorBtn.contains(e.target)) {
        colorDropdown.style.display = 'none';
      }
    }, true);
  }

  const bgColorBtn = document.getElementById('ct-bg-color-btn');
  const bgColorDropdown = document.getElementById('ct-bg-color-picker-dropdown');
  if (bgColorBtn && bgColorDropdown) {
    bgColorBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeAllColorPickersExcept(bgColorDropdown);
      const isHidden = bgColorDropdown.style.display === 'none' || !bgColorDropdown.style.display;
      if (isHidden) {
        renderColorPickerContent(bgColorDropdown);
      }
      bgColorDropdown.style.display = isHidden ? 'block' : 'none';
    });

    document.addEventListener('mousedown', (e) => {
      if (!bgColorDropdown.contains(e.target) && !bgColorBtn.contains(e.target)) {
        bgColorDropdown.style.display = 'none';
      }
    }, true);
  }
}

// 選択セル範囲取得
function getCtSelectedCellKeys() {
  const keys = [];
  if (!state.activeCustomTableId) return keys;
  const tbl = state.customTables.find(t => t.id === state.activeCustomTableId);
  if (!tbl) return keys;

  const rows = tbl.rows;
  const cols = tbl.columns.filter(c => tbl.visibleColumns.includes(c.id));

  // A. 行全体が選択されている場合
  if (state.ctSelectedRows && state.ctSelectedRows.size > 0) {
    state.ctSelectedRows.forEach(rowId => {
      cols.forEach(col => {
        keys.push(`${rowId}:${col.id}`);
      });
    });
    return keys;
  }

  // B. 列全体が選択されている場合
  if (state.ctSelectedCols && state.ctSelectedCols.size > 0) {
    state.ctSelectedCols.forEach(colId => {
      rows.forEach(row => {
        keys.push(`${row.id}:${colId}`);
      });
    });
    return keys;
  }

  // C. 非連続複数セル選択 (Ctrl)
  if (state.ctSelectedCells && state.ctSelectedCells.size > 0) {
    state.ctSelectedCells.forEach(cellKey => {
      keys.push(cellKey);
    });
    return keys;
  }

  // D. 範囲または単一選択
  const start = state.ctSelectedCell;
  const range = state.ctSelectedRange;

  if (!start) return keys;

  if (!range) {
    keys.push(`${start.rowId}:${start.colId}`);
    return keys;
  }

  const startRowIdx = rows.findIndex(r => r.id === range.startRowId);
  const endRowIdx = rows.findIndex(r => r.id === range.endRowId);
  const startColIdx = cols.findIndex(c => c.id === range.startColId);
  const endColIdx = cols.findIndex(c => c.id === range.endColId);

  if (startRowIdx === -1 || endRowIdx === -1 || startColIdx === -1 || endColIdx === -1) {
    keys.push(`${start.rowId}:${start.colId}`);
    return keys;
  }

  const minRow = Math.min(startRowIdx, endRowIdx);
  const maxRow = Math.max(startRowIdx, endRowIdx);
  const minCol = Math.min(startColIdx, endColIdx);
  const maxCol = Math.max(startColIdx, endColIdx);

  for (let r = minRow; r <= maxRow; r++) {
    for (let c = minCol; c <= maxCol; c++) {
      const row = rows[r];
      const col = cols[c];
      if (row && col) {
        keys.push(`${row.id}:${col.id}`);
      }
    }
  }
  return keys;
}

// 選択ハイライトの更新
function updateCtSelectionHighlight() {
  // 1. データセルのクリア
  const tds = document.querySelectorAll('#ct-table-body td');
  tds.forEach(td => {
    td.classList.remove('selected-cell');
    td.classList.remove('selected-row-cell');
  });

  // 2. 行ヘッダー（行番号セル）のハイライトクリア
  const numTds = document.querySelectorAll('#ct-table-body td.row-number-col');
  numTds.forEach(td => {
    td.classList.remove('active-row-header');
  });

  // 3. 列ヘッダーセルのハイライトクリア
  const colThs = document.querySelectorAll('#ct-table-thead th[data-col-id]');
  colThs.forEach(th => {
    th.classList.remove('active-col-header');
  });

  // 4. 左上の全選択角セルのハイライトクリア
  const corners = document.querySelectorAll('#ct-table-thead th.row-number-col');
  corners.forEach(th => {
    th.classList.remove('active-row-header');
  });

  // 5. 選択セルのキーを取得
  const selectedKeys = getCtSelectedCellKeys();
  if (selectedKeys.length === 0) return;

  const startCellKey = state.ctSelectedCell ? `${state.ctSelectedCell.rowId}:${state.ctSelectedCell.colId}` : null;

  // 6. データセルのハイライト適用
  selectedKeys.forEach(key => {
    const [rowId, colId] = key.split(':');
    const td = document.querySelector(`#ct-table-body td[data-row-id="${rowId}"][data-col-id="${colId}"]`);
    if (td) {
      if (key === startCellKey) {
        td.classList.add('selected-cell');
      } else {
        td.classList.add('selected-row-cell');
      }
    }
  });

  // 7. 行ヘッダー（行番号セル）のハイライト適用
  if (state.ctSelectedRows && state.ctSelectedRows.size > 0) {
    const trs = document.querySelectorAll('#ct-table-body tr[data-row-id]');
    trs.forEach(tr => {
      const rowId = tr.getAttribute('data-row-id');
      if (state.ctSelectedRows.has(rowId)) {
        const numTd = tr.querySelector('.row-number-col');
        if (numTd) numTd.classList.add('active-row-header');
      }
    });
  }

  // 8. 列ヘッダーセルのハイライト適用
  if (state.ctSelectedCols && state.ctSelectedCols.size > 0) {
    state.ctSelectedCols.forEach(colId => {
      const ths = document.querySelectorAll(`#ct-table-thead th[data-col-id="${colId}"]`);
      ths.forEach(th => th.classList.add('active-col-header'));
    });
  }

  // 9. 全選択されている場合は左上の角もハイライト
  const activeTableBody = document.getElementById('ct-table-body');
  if (activeTableBody) {
    const totalCheckboxes = activeTableBody.querySelectorAll('.ct-row-select-checkbox').length;
    const checkedCheckboxes = activeTableBody.querySelectorAll('.ct-row-select-checkbox:checked').length;
    if (totalCheckboxes > 0 && totalCheckboxes === checkedCheckboxes) {
      corners.forEach(th => th.classList.add('active-row-header'));
    }
  }
  
  updateSelectionStatsWidget();
}

function handleCtCellMouseDown(tbl, rowId, colId, event) {
  if (event.button !== 0) return;
  event.stopPropagation();

  const cellKey = `${rowId}:${colId}`;

  if (event.ctrlKey || event.metaKey) {
    // Ctrl: 非連続
    if (state.ctSelectedCells.has(cellKey)) {
      state.ctSelectedCells.delete(cellKey);
    } else {
      state.ctSelectedCells.add(cellKey);
    }
    state.ctSelectedCell = { rowId, colId };
    state.ctSelectedRange = null;
  } else {
    state.isSelecting = true;
    state.ctSelectedCell = { rowId, colId };
    state.ctSelectedRange = null;
    state.ctSelectedRows.clear();
    state.ctSelectedCols.clear();
    state.ctSelectedCells.clear();
    state.ctSelectedCells.add(cellKey);
  }

  updateCtSelectionHighlight();
  syncCtFormatToolbar();
}

function handleCtCellMouseEnter(tbl, rowId, colId) {
  if (!state.isSelecting || !state.ctSelectedCell) return;

  state.ctSelectedRange = {
    startRowId: state.ctSelectedCell.rowId,
    startColId: state.ctSelectedCell.colId,
    endRowId: rowId,
    endColId: colId
  };

  updateCtSelectionHighlight();
}

// スタイル適用
function applyCtStyle(property, value) {
  if (!state.activeCustomTableId) return;
  const tbl = state.customTables.find(t => t.id === state.activeCustomTableId);
  if (!tbl) return;

  const cellKeys = getCtSelectedCellKeys();
  if (cellKeys.length === 0) return;

  cellKeys.forEach(key => {
    if (!tbl.cellStyles[key]) tbl.cellStyles[key] = {};

    if (tbl.cellStyles[key][property] === value) {
      delete tbl.cellStyles[key][property];
    } else {
      tbl.cellStyles[key][property] = value;
    }

    if (Object.keys(tbl.cellStyles[key]).length === 0) {
      delete tbl.cellStyles[key];
    }
  });

  saveCustomTables();
  renderCustomTable(tbl.id);
  syncCtFormatToolbar();
}

// フォントサイズ調節
function adjustCtFontSize(change) {
  if (!state.activeCustomTableId) return;
  const tbl = state.customTables.find(t => t.id === state.activeCustomTableId);
  if (!tbl) return;

  const cellKeys = getCtSelectedCellKeys();
  if (cellKeys.length === 0) return;

  cellKeys.forEach(key => {
    if (!tbl.cellStyles[key]) tbl.cellStyles[key] = {};

    let currentSize = tbl.cellStyles[key].fontSize ? parseInt(tbl.cellStyles[key].fontSize, 10) : 10;
    let newSize = Math.max(6, Math.min(24, currentSize + change));

    if (newSize === 10) {
      delete tbl.cellStyles[key].fontSize;
    } else {
      tbl.cellStyles[key].fontSize = `${newSize}pt`;
    }

    if (Object.keys(tbl.cellStyles[key]).length === 0) {
      delete tbl.cellStyles[key];
    }
  });

  saveCustomTables();
  renderCustomTable(tbl.id);
  syncCtFormatToolbar();
}

function applyCtFontSize(newSize) {
  if (!state.activeCustomTableId) return;
  const tbl = state.customTables.find(t => t.id === state.activeCustomTableId);
  if (!tbl) return;

  const cellKeys = getCtSelectedCellKeys();
  if (cellKeys.length === 0) return;

  const size = Math.max(6, Math.min(24, newSize));

  cellKeys.forEach(key => {
    if (!tbl.cellStyles[key]) tbl.cellStyles[key] = {};

    if (size === 10) {
      delete tbl.cellStyles[key].fontSize;
    } else {
      tbl.cellStyles[key].fontSize = `${size}pt`;
    }

    if (Object.keys(tbl.cellStyles[key]).length === 0) {
      delete tbl.cellStyles[key];
    }
  });

  saveCustomTables();
  renderCustomTable(tbl.id);
  syncCtFormatToolbar();
}

// ツールバーの同期表示
function syncCtFormatToolbar() {
  if (!state.activeCustomTableId) return;
  const tbl = state.customTables.find(t => t.id === state.activeCustomTableId);
  if (!tbl) return;

  const cellKeys = getCtSelectedCellKeys();
  if (cellKeys.length === 0) return;

  const firstKey = cellKeys[0];
  const style = tbl.cellStyles[firstKey] || {};

  const sizeInput = document.getElementById('ct-font-size-input');
  if (sizeInput) {
    const size = style.fontSize ? parseInt(style.fontSize, 10) : 10;
    sizeInput.value = size;
  }

  const boldBtn = document.getElementById('ct-text-bold');
  if (boldBtn) {
    if (style.fontWeight === 'bold') boldBtn.classList.add('active');
    else boldBtn.classList.remove('active');
  }

  const italicBtn = document.getElementById('ct-text-italic');
  if (italicBtn) {
    if (style.fontStyle === 'italic') italicBtn.classList.add('active');
    else italicBtn.classList.remove('active');
  }

  const strikeBtn = document.getElementById('ct-text-strike');
  if (strikeBtn) {
    if (style.textDecoration === 'line-through') strikeBtn.classList.add('active');
    else strikeBtn.classList.remove('active');
  }

  const colorIndicator = document.getElementById('ct-text-color-indicator');
  if (colorIndicator) {
    colorIndicator.style.borderBottomColor = style.color || 'var(--text-primary)';
  }

  const bgIndicator = document.getElementById('ct-bg-color-indicator');
  if (bgIndicator) {
    bgIndicator.style.borderBottomColor = style.bg || 'transparent';
  }

  const aligns = {
    left: document.getElementById('ct-align-left'),
    center: document.getElementById('ct-align-center'),
    right: document.getElementById('ct-align-right')
  };
  const activeAlign = style.textAlign || 'left';
  Object.keys(aligns).forEach(key => {
    const btn = aligns[key];
    if (btn) {
      if (key === activeAlign) btn.classList.add('active');
      else btn.classList.remove('active');
    }
  });

  const valigns = {
    top: document.getElementById('ct-valign-top'),
    middle: document.getElementById('ct-valign-middle'),
    bottom: document.getElementById('ct-valign-bottom')
  };
  const activeValign = style.verticalAlign || 'middle';
  Object.keys(valigns).forEach(key => {
    const btn = valigns[key];
    if (btn) {
      if (key === activeValign) btn.classList.add('active');
      else btn.classList.remove('active');
    }
  });

  const wraps = {
    clip: document.getElementById('ct-wrap-clip'),
    wrap: document.getElementById('ct-wrap-wrap'),
    overflow: document.getElementById('ct-wrap-overflow')
  };
  let activeWrap = 'clip';
  if (style.whiteSpace === 'normal') activeWrap = 'wrap';
  else if (style.whiteSpace === 'nowrap' && style.textOverflow === 'clip') activeWrap = 'overflow';

  Object.keys(wraps).forEach(key => {
    const btn = wraps[key];
    if (btn) {
      if (key === activeWrap) btn.classList.add('active');
      else btn.classList.remove('active');
    }
  });
}

// 書式ツールバー全体の初期セットアップ
function setupCustomTableFormatToolbarEvents() {
  const fontDecBtn = document.getElementById('ct-font-dec');
  const fontIncBtn = document.getElementById('ct-font-inc');
  const fontSizeInput = document.getElementById('ct-font-size-input');
  
  if (fontDecBtn) fontDecBtn.addEventListener('click', () => adjustCtFontSize(-1));
  if (fontIncBtn) fontIncBtn.addEventListener('click', () => adjustCtFontSize(1));
  if (fontSizeInput) {
    fontSizeInput.addEventListener('change', (e) => {
      const val = parseInt(e.target.value, 10);
      if (!isNaN(val)) {
        applyCtFontSize(val);
      }
    });
  }

  document.getElementById('ct-text-bold')?.addEventListener('click', () => applyCtStyle('fontWeight', 'bold'));
  document.getElementById('ct-text-italic')?.addEventListener('click', () => applyCtStyle('fontStyle', 'italic'));
  document.getElementById('ct-text-strike')?.addEventListener('click', () => applyCtStyle('textDecoration', 'line-through'));

  document.getElementById('ct-align-left')?.addEventListener('click', () => applyCtStyle('textAlign', 'left'));
  document.getElementById('ct-align-center')?.addEventListener('click', () => applyCtStyle('textAlign', 'center'));
  document.getElementById('ct-align-right')?.addEventListener('click', () => applyCtStyle('textAlign', 'right'));

  document.getElementById('ct-valign-top')?.addEventListener('click', () => applyCtStyle('verticalAlign', 'top'));
  document.getElementById('ct-valign-middle')?.addEventListener('click', () => applyCtStyle('verticalAlign', 'middle'));
  document.getElementById('ct-valign-bottom')?.addEventListener('click', () => applyCtStyle('verticalAlign', 'bottom'));

  document.getElementById('ct-wrap-clip')?.addEventListener('click', () => {
    if (!state.activeCustomTableId) return;
    const tbl = state.customTables.find(t => t.id === state.activeCustomTableId);
    if (!tbl) return;
    const cellKeys = getCtSelectedCellKeys();
    cellKeys.forEach(key => {
      if (!tbl.cellStyles[key]) tbl.cellStyles[key] = {};
      tbl.cellStyles[key].whiteSpace = 'nowrap';
      delete tbl.cellStyles[key].textOverflow;
    });
    saveCustomTables();
    renderCustomTable(tbl.id);
    syncCtFormatToolbar();
  });

  document.getElementById('ct-wrap-wrap')?.addEventListener('click', () => {
    applyCtStyle('whiteSpace', 'normal');
  });

  document.getElementById('ct-wrap-overflow')?.addEventListener('click', () => {
    if (!state.activeCustomTableId) return;
    const tbl = state.customTables.find(t => t.id === state.activeCustomTableId);
    if (!tbl) return;

    const cellKeys = getCtSelectedCellKeys();
    cellKeys.forEach(key => {
      if (!tbl.cellStyles[key]) tbl.cellStyles[key] = {};
      tbl.cellStyles[key].whiteSpace = 'nowrap';
      tbl.cellStyles[key].textOverflow = 'clip';
    });
    saveCustomTables();
    renderCustomTable(tbl.id);
    syncCtFormatToolbar();
  });

  document.getElementById('ct-format-reset-btn')?.addEventListener('click', () => {
    if (!state.activeCustomTableId) return;
    const tbl = state.customTables.find(t => t.id === state.activeCustomTableId);
    if (!tbl) return;

    const cellKeys = getCtSelectedCellKeys();
    cellKeys.forEach(key => {
      delete tbl.cellStyles[key];
    });
    saveCustomTables();
    renderCustomTable(tbl.id);
    syncCtFormatToolbar();
  });

  setupCtColorPickers();
}

function closeAllFilterMenus() {
  const containerCt = document.getElementById('ct-filter-dropdown-container');
  if (containerCt) {
    containerCt.innerHTML = '';
    delete containerCt.dataset.activeColId;
  }
  const containerJo = document.getElementById('jo-filter-dropdown-container');
  if (containerJo) {
    containerJo.innerHTML = '';
    delete containerJo.dataset.activeColId;
  }
  document.querySelectorAll('.filter-menu-backdrop').forEach(el => el.remove());
}

// フィルタメニューの生成と配置
function openCtFilterMenu(tbl, colId, colLabel, anchorElement) {
  const container = document.getElementById('ct-filter-dropdown-container');
  if (!container) return;

  const isAlreadyOpen = container.dataset.activeColId === `${tbl.id}_${colId}`;
  closeAllFilterMenus();
  if (isAlreadyOpen) return;

  container.dataset.activeColId = `${tbl.id}_${colId}`;

  const backdrop = document.createElement('div');
  backdrop.className = 'filter-menu-backdrop';
  backdrop.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 999; background: transparent; cursor: default;';
  
  const handleBackdropClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeAllFilterMenus();
  };
  
  backdrop.addEventListener('mousedown', handleBackdropClick, true);
  backdrop.addEventListener('pointerdown', handleBackdropClick, true);
  backdrop.addEventListener('touchstart', handleBackdropClick, true);
  document.body.appendChild(backdrop);

  const rect = anchorElement.getBoundingClientRect();
  const dropdown = document.createElement('div');
  dropdown.className = 'filter-dropdown';
  dropdown.style.top = `${rect.bottom + window.scrollY + 5}px`;
  
  const menuWidth = 240;
  let leftPos = rect.left + window.scrollX;
  if (leftPos + menuWidth > window.innerWidth) {
    leftPos = window.innerWidth - menuWidth - 20;
  }
  dropdown.style.left = `${leftPos}px`;

  const uniqueValues = Array.from(new Set(tbl.rows.map(r => String(r[colId] || '').trim())));

  if (!state.ctFilters[tbl.id]) {
    state.ctFilters[tbl.id] = {};
  }

  let currentSelection = state.ctFilters[tbl.id][colId] 
    ? [...state.ctFilters[tbl.id][colId]] 
    : [...uniqueValues];

  dropdown.innerHTML = `
    <div style="font-weight: 600; margin-bottom: 0.25rem; color: var(--text-primary);">${colLabel} でフィルタ</div>
    <input type="text" class="filter-search-input" placeholder="テキストで検索..." style="width: 100%; box-sizing: border-box; padding: 4px; background: var(--bg-surface); border: 1px solid var(--border-color); color: var(--text-primary); border-radius: var(--radius-sm); outline: none; margin-bottom: 4px;" />
    <div style="display: flex; gap: 0.5rem; margin: 0.25rem 0;">
      <button class="btn-text" id="filter-btn-select-all" style="padding: 0; font-size: 0.7rem; color: var(--secondary); background: none; border: none; cursor: pointer;">すべて選択</button>
      <button class="btn-text" id="filter-btn-clear-all" style="padding: 0; font-size: 0.7rem; color: var(--danger); background: none; border: none; cursor: pointer;">すべてクリア</button>
    </div>
    <div class="filter-list" id="filter-list-items" style="max-height: 150px; overflow-y: auto; margin-bottom: 6px; border: 1px solid var(--border-color); padding: 4px; border-radius: var(--radius-sm);"></div>
    <div class="filter-actions" style="display: flex; justify-content: space-between; gap: 4px;">
      <button class="btn btn-sm btn-secondary" id="filter-btn-clear" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; flex: 1;">フィルタ解除</button>
      <button class="btn btn-sm btn-primary" id="filter-btn-apply" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; flex: 1;">適用</button>
    </div>
  `;

  container.appendChild(dropdown);

  const searchInput = dropdown.querySelector('.filter-search-input');
  const itemsContainer = dropdown.querySelector('#filter-list-items');
  const selectAllBtn = dropdown.querySelector('#filter-btn-select-all');
  const clearAllBtn = dropdown.querySelector('#filter-btn-clear-all');
  const clearBtn = dropdown.querySelector('#filter-btn-clear');
  const applyBtn = dropdown.querySelector('#filter-btn-apply');

  const col = tbl.columns.find(c => c.id === colId);
  const colorSection = createColorFilterSection(col, (targetVal) => {
    currentSelection = [targetVal];
    if (applyBtn) applyBtn.click();
  });

  if (colorSection && searchInput) {
    dropdown.insertBefore(colorSection, searchInput);
  }

  function renderList(filterQuery = '') {
    itemsContainer.innerHTML = '';
    const filteredVals = uniqueValues.filter(val => 
      val.toLowerCase().includes(filterQuery.toLowerCase())
    );

    if (filteredVals.length === 0) {
      itemsContainer.innerHTML = '<div style="color: var(--text-muted); font-size: 0.75rem; text-align: center; padding: 0.5rem;">候補なし</div>';
      return;
    }

    filteredVals.forEach(val => {
      const itemLabel = document.createElement('label');
      itemLabel.style.display = 'flex';
      itemLabel.style.alignItems = 'center';
      itemLabel.style.gap = '0.35rem';
      itemLabel.style.cursor = 'pointer';
      itemLabel.style.marginBottom = '2px';
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = val;
      checkbox.checked = currentSelection.includes(val);

      checkbox.addEventListener('change', (e) => {
        if (e.target.checked) {
          if (!currentSelection.includes(val)) currentSelection.push(val);
        } else {
          currentSelection = currentSelection.filter(v => v !== val);
        }
      });

      const span = document.createElement('span');
      span.textContent = val === '' ? '（ブランク）' : val;
      span.style.fontSize = '0.75rem';
      span.style.color = 'var(--text-primary)';

      itemLabel.appendChild(checkbox);
      itemLabel.appendChild(span);
      itemsContainer.appendChild(itemLabel);
    });
  }

  searchInput.addEventListener('input', (e) => {
    renderList(e.target.value.trim());
  });

  selectAllBtn.addEventListener('click', () => {
    currentSelection = [...uniqueValues];
    renderList(searchInput.value.trim());
  });

  clearAllBtn.addEventListener('click', () => {
    currentSelection = [];
    renderList(searchInput.value.trim());
  });

  clearBtn.addEventListener('click', () => {
    if (state.ctFilters[tbl.id]) {
      delete state.ctFilters[tbl.id][colId];
    }
    closeAllFilterMenus();
    renderCustomTable(tbl.id);
  });

  applyBtn.addEventListener('click', () => {
    if (!state.ctFilters[tbl.id]) {
      state.ctFilters[tbl.id] = {};
    }
    state.ctFilters[tbl.id][colId] = new Set(currentSelection);
    closeAllFilterMenus();
    renderCustomTable(tbl.id);
  });

  const onScrollAction = (e) => {
    if (!dropdown.contains(e.target)) {
      closeAllFilterMenus();
      window.removeEventListener('scroll', onScrollAction, true);
    }
  };
  window.addEventListener('scroll', onScrollAction, true);

  renderList();
}

// コントロールボタン・ドロップダウンのイベントセットアップ
function setupCtButtonsEvents() {
  const colSelectorBtn = document.getElementById('ct-column-selector-btn');
  const colSelectorDropdown = document.getElementById('ct-column-selector-dropdown');
  if (colSelectorBtn && colSelectorDropdown) {
    colSelectorBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = colSelectorDropdown.style.display === 'none' || !colSelectorDropdown.style.display;
      colSelectorDropdown.style.display = isHidden ? 'block' : 'none';
      
      const frameDropdown = document.getElementById('ct-frame-fix-dropdown');
      if (frameDropdown) frameDropdown.style.display = 'none';
    });

    document.addEventListener('mousedown', (e) => {
      if (!colSelectorDropdown.contains(e.target) && !colSelectorBtn.contains(e.target)) {
        colSelectorDropdown.style.display = 'none';
      }
    }, true);
  }

  const frameFixBtn = document.getElementById('ct-frame-fix-btn');
  const frameFixDropdown = document.getElementById('ct-frame-fix-dropdown');
  if (frameFixBtn && frameFixDropdown) {
    frameFixBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = frameFixDropdown.style.display === 'none' || !frameFixDropdown.style.display;
      frameFixDropdown.style.display = isHidden ? 'block' : 'none';
      
      const colDropdown = document.getElementById('ct-column-selector-dropdown');
      if (colDropdown) colDropdown.style.display = 'none';
    });

    document.addEventListener('mousedown', (e) => {
      if (!frameFixDropdown.contains(e.target) && !frameFixBtn.contains(e.target)) {
        frameFixDropdown.style.display = 'none';
      }
    }, true);
  }

  document.getElementById('ct-add-row-btn')?.addEventListener('click', () => {
    if (!state.activeCustomTableId) return;
    if (isTableLocked(state.activeCustomTableId)) {
      showToast('テーブルがロックされています。編集するには上部の鍵アイコンでロックを解除してください。', 'warning');
      return;
    }
    const tbl = state.customTables.find(t => t.id === state.activeCustomTableId);
    if (!tbl) return;

    const newRow = { id: `row_${Date.now()}_${tbl.rows.length + 1}` };
    tbl.columns.forEach(col => {
      newRow[col.id] = '';
    });

    tbl.rows.push(newRow);
    saveCustomTables();
    renderCustomTable(tbl.id);
    showToast('行を追加しました。', 'success');
  });

  document.getElementById('ct-delete-row-btn')?.addEventListener('click', () => {
    if (!state.activeCustomTableId) return;
    if (isTableLocked(state.activeCustomTableId)) {
      showToast('テーブルがロックされています。編集するには上部の鍵アイコンでロックを解除してください。', 'warning');
      return;
    }
    const tbl = state.customTables.find(t => t.id === state.activeCustomTableId);
    if (!tbl) return;

    if (state.ctSelectedRows.size === 0) {
      showToast('削除する行を選択してください。', 'warning');
      return;
    }

    if (!confirm(`選択された ${state.ctSelectedRows.size} 件の行を削除しますか？`)) {
      return;
    }

    tbl.rows = tbl.rows.filter(row => !state.ctSelectedRows.has(row.id));
    state.ctSelectedRows.clear();
    saveCustomTables();
    renderCustomTable(tbl.id);
    showToast('選択された行を削除しました。', 'success');
  });

  document.getElementById('ct-delete-table-btn')?.addEventListener('click', () => {
    if (!state.activeCustomTableId) return;
    const tbl = state.customTables.find(t => t.id === state.activeCustomTableId);
    if (!tbl) return;

    if (!confirm(`本当にテーブル「${tbl.name}」を削除しますか？\nこの操作は元に戻せません。`)) {
      return;
    }

    state.customTables = state.customTables.filter(t => t.id !== tbl.id);
    saveCustomTables();

    if (state.ctFilters[tbl.id]) {
      delete state.ctFilters[tbl.id];
    }

    renderCustomTableList();
    showToast(`テーブル「${tbl.name}」を削除しました。`, 'success');

    const tabId = `custom-table-${tbl.id}`;
    const tabIndex = state.tabs.findIndex(t => t.id === tabId);
    if (tabIndex !== -1) {
      state.tabs = state.tabs.filter(t => t.id !== tabId);
      if (state.activeTabId === tabId) {
        state.activeTabId = state.tabs.length > 0 ? state.tabs[state.tabs.length - 1].id : null;
      }
      renderTabBar();
      if (state.activeTabId) {
        activateTab(state.activeTabId);
      } else {
        openMyPage();
      }
    } else {
      openMyPage();
    }
  });

  // 1件データ登録モーダルの状態管理用グローバル変数 (DOMContentLoadedのスコープ内)
  let activeRegisterType = null;

  // 1件登録モーダルを開く共通関数
  window.openSingleRegisterModal = function(type) {
    activeRegisterType = type;
    const modal = document.getElementById('ct-single-add-modal');
    const container = document.getElementById('ct-single-add-form-container');
    if (!modal || !container) return;

    let columns = [];
    let titleText = 'レコード登録';

    if (type === 'jo') {
      columns = state.joColumns;
      titleText = '案件マスタ 新規登録';
    } else if (type === 'ap') {
      columns = state.apColumns;
      titleText = '申込者基本マスタ 新規登録';
    } else if (type === 'ag') {
      columns = state.agColumns;
      titleText = '代理店基本マスタ 新規登録';
    } else if (type === 'dbmake') {
      columns = state.dbmakeColumns;
      titleText = 'パートナーDB 新規登録';
    } else {
      const tbl = state.customTables.find(t => t.id === type);
      if (tbl) {
        columns = tbl.columns;
        titleText = `📋 ${tbl.name} 新規登録`;
      }
    }

    // タイトルの書き換え
    const titleEl = modal.querySelector('h3');
    if (titleEl) {
      titleEl.textContent = titleText;
    }

    container.innerHTML = '';
    columns.forEach(col => {
      const formGroup = document.createElement('div');
      formGroup.className = 'form-group';
      formGroup.style.display = 'flex';
      formGroup.style.flexDirection = 'column';
      formGroup.style.gap = '0.25rem';
      
      const label = document.createElement('label');
      label.textContent = col.label || col.id;
      label.style.fontWeight = 'bold';
      label.style.fontSize = '0.85rem';
      
      let input;
      if (col.type === 'select' && col.choices && col.choices.length > 0) {
        normalizeColChoices(col);
        input = document.createElement('select');
        input.id = `ct-add-input-${col.id}`;
        
        const optEmpty = document.createElement('option');
        optEmpty.value = '';
        optEmpty.textContent = '選択してください';
        input.appendChild(optEmpty);

        col.choices.forEach(choice => {
          const opt = document.createElement('option');
          opt.value = choice.value;
          opt.textContent = choice.value;
          input.appendChild(opt);
        });
      } else if (col.type === 'date') {
        input = document.createElement('input');
        input.type = 'date';
        input.id = `ct-add-input-${col.id}`;
      } else {
        input = document.createElement('input');
        input.type = col.type === 'number' ? 'number' : 'text';
        input.id = `ct-add-input-${col.id}`;
        input.placeholder = `${col.label || col.id}を入力してください`;
      }

      input.style.width = '100%';
      input.style.padding = '0.5rem';
      input.style.borderRadius = 'var(--radius-sm)';
      input.style.border = '1px solid var(--border-color)';
      input.style.background = 'var(--bg-surface-elevated)';
      input.style.color = 'var(--text-primary)';
      input.style.outline = 'none';

      formGroup.appendChild(label);
      formGroup.appendChild(input);
      container.appendChild(formGroup);
    });

    modal.style.display = 'flex';
  };

  // ➕ 1件データ登録モーダル表示
  document.getElementById('ct-add-single-row-btn')?.addEventListener('click', () => {
    if (!state.activeCustomTableId) return;
    openSingleRegisterModal(state.activeCustomTableId);
  });

  // モーダルを閉じる処理
  const closeSingleAddModal = () => {
    const modal = document.getElementById('ct-single-add-modal');
    if (modal) modal.style.display = 'none';
  };

  document.getElementById('ct-single-add-modal-close')?.addEventListener('click', closeSingleAddModal);
  document.getElementById('ct-single-add-modal-cancel')?.addEventListener('click', closeSingleAddModal);

  // 1件登録サブミット処理
  document.getElementById('ct-single-add-modal-submit')?.addEventListener('click', () => {
    if (!activeRegisterType) return;

    let columns = [];
    if (activeRegisterType === 'jo') {
      columns = state.joColumns;
    } else if (activeRegisterType === 'ap') {
      columns = state.apColumns;
    } else if (activeRegisterType === 'ag') {
      columns = state.agColumns;
    } else if (activeRegisterType === 'dbmake') {
      columns = state.dbmakeColumns;
    } else {
      const tbl = state.customTables.find(t => t.id === activeRegisterType);
      if (tbl) columns = tbl.columns;
    }

    const newRow = {};
    let hasData = false;

    columns.forEach(col => {
      const input = document.getElementById(`ct-add-input-${col.id}`);
      const val = input ? input.value.trim() : '';
      newRow[col.id] = val;
      if (val) hasData = true;
    });

    // ID類の自動生成補正
    if (activeRegisterType === 'jo') {
      if (!newRow.customerId) newRow.customerId = generateUniqueCustomerNumber();
      if (!newRow.customerPersonalityId) newRow.customerPersonalityId = generate8DigitId();
    } else if (activeRegisterType === 'ap') {
      if (!newRow.customerId) newRow.customerId = generateUniqueCustomerNumber();
      if (!newRow.customerPersonalityId) newRow.customerPersonalityId = generate8DigitId();
    } else if (activeRegisterType === 'ag') {
      if (!newRow.customerId) newRow.customerId = generateUniqueCustomerNumber();
      if (!newRow.customerPersonalityId) newRow.customerPersonalityId = generate8DigitId();
    } else if (activeRegisterType === 'dbmake') {
      if (!newRow.id) newRow.id = `pt_${generate8DigitId()}`;
    } else {
      newRow.id = `row_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    }

    if (!hasData) {
      showToast('データを入力してください。', 'warning');
      return;
    }

    // 各データソースへの保存処理
    if (activeRegisterType === 'jo') {
      state.joContracts.push(newRow);
      localStorage.setItem(STORAGE_KEYS.JO_CONTRACTS, JSON.stringify(state.joContracts));
      renderJoInfo();
    } else if (activeRegisterType === 'ap') {
      state.apContracts.push(newRow);
      localStorage.setItem(STORAGE_KEYS.AP_CONTRACTS, JSON.stringify(state.apContracts));
      renderApplicantInfo();
    } else if (activeRegisterType === 'ag') {
      state.agContracts.push(newRow);
      localStorage.setItem(STORAGE_KEYS.AG_CONTRACTS, JSON.stringify(state.agContracts));
      renderAgencyInfo();
    } else if (activeRegisterType === 'dbmake') {
      dbmakePartners.push(newRow);
      localStorage.setItem('synapse_dbmake_partners', JSON.stringify(dbmakePartners));
      renderDbmakePartners();
    } else {
      const tbl = state.customTables.find(t => t.id === activeRegisterType);
      if (tbl) {
        tbl.rows.push(newRow);
        saveCustomTables();
        renderCustomTable(tbl.id);
      }
    }

    closeSingleAddModal();
    showToast('新しいレコードを登録しました。', 'success');
  });
  // フィルターメニュー用色フィルターセクション生成ヘルパー
  function createColorFilterSection(col, onColorClick) {
    if (!col || col.type !== 'select' || !col.choices || col.choices.length === 0) {
      return null;
    }

    const section = document.createElement('div');
    section.className = 'color-filter-section';
    section.style.marginBottom = '6px';
    section.style.borderBottom = '1px solid var(--border-color)';
    section.style.paddingBottom = '6px';

    const title = document.createElement('div');
    title.textContent = '色でフィルタ';
    title.style.fontSize = '0.7rem';
    title.style.color = 'var(--text-muted)';
    title.style.marginBottom = '4px';
    title.style.fontWeight = '500';
    section.appendChild(title);

    const chipsContainer = document.createElement('div');
    chipsContainer.style.display = 'flex';
    chipsContainer.style.gap = '6px';
    chipsContainer.style.flexWrap = 'wrap';

    col.choices.forEach(choice => {
      const chip = document.createElement('div');
      chip.style.width = '18px';
      chip.style.height = '18px';
      chip.style.borderRadius = '50%';
      chip.style.backgroundColor = choice.color || '#6366f1';
      chip.style.border = `1px solid ${choice.textColor || '#ffffff'}`;
      chip.style.cursor = 'pointer';
      chip.style.boxShadow = '0 1px 3px rgba(0,0,0,0.15)';
      chip.title = choice.value;

      chip.style.display = 'flex';
      chip.style.alignItems = 'center';
      chip.style.justifyContent = 'center';
      chip.style.fontSize = '8px';
      chip.style.color = choice.textColor || '#ffffff';
      chip.style.fontWeight = 'bold';
      chip.textContent = String(choice.value).charAt(0);

      chip.addEventListener('click', (e) => {
        e.stopPropagation();
        onColorClick(choice.value);
      });

      chipsContainer.appendChild(chip);
    });

    section.appendChild(chipsContainer);
    return section;
  }

  // マスタの特定のセル値を更新して保存するヘルパー
  function saveMasterCellValue(masterType, contract, colId, newVal, rowIndex) {
    if (masterType === 'jo') {
      const item = state.joContracts.find(c => c.customerId === contract.customerId);
      if (item) {
        item[colId] = newVal;
        localStorage.setItem(STORAGE_KEYS.JO_CONTRACTS, JSON.stringify(state.joContracts));
        showToast('データを更新しました。', 'success');
      }
      renderJoInfo();
    } else if (masterType === 'ap') {
      const item = state.apContracts.find(c => c.customerId === contract.customerId);
      if (item) {
        item[colId] = newVal;
        localStorage.setItem(STORAGE_KEYS.AP_CONTRACTS, JSON.stringify(state.apContracts));
        showToast('データを更新しました。', 'success');
      }
      renderApplicantInfo();
    } else if (masterType === 'ag') {
      const item = state.agContracts.find(c => c.customerId === contract.customerId);
      if (item) {
        item[colId] = newVal;
        localStorage.setItem(STORAGE_KEYS.AG_CONTRACTS, JSON.stringify(state.agContracts));
        showToast('データを更新しました。', 'success');
      }
      renderAgencyInfo();
    } else if (masterType === 'dbmake') {
      const items = dbmakePartners || [];
      if (items.length > 0 && rowIndex !== undefined) {
        const item = items[rowIndex];
        if (item) {
          item[colId] = newVal;
          localStorage.setItem('synapse_dbmake_partners', JSON.stringify(items));
          showToast('データを更新しました。', 'success');
        }
      }
      renderDbmakePartners();
    }
  }

  // テーブル再描画ヘルパー
  function refreshTable(tableId) {
    if (tableId === 'jo') renderJoInfo();
    else if (tableId === 'ap') renderApplicantInfo();
    else if (tableId === 'ag') renderAgencyInfo();
    else if (tableId === 'dbmake') renderDbmakePartners();
    else {
      renderCustomTable(tableId);
    }
  }

  // 通常セル（テキスト・数値・日付）のインライン編集開始ヘルパー
  function startMasterCellEdit(td, val, col, contract, index, masterType) {
    if (td.querySelector('input') || td.querySelector('select')) return;

    const isDate = col.type === 'date';
    const input = document.createElement('input');
    input.type = isDate ? 'date' : (col.type === 'number' ? 'number' : 'text');
    input.value = val;

    input.style.width = '100%';
    input.style.height = '100%';
    input.style.border = '2px solid var(--primary)';
    input.style.background = 'var(--bg-surface)';
    input.style.color = 'var(--text-primary)';
    input.style.outline = 'none';
    input.style.padding = '0 4px';
    input.style.boxSizing = 'border-box';

    td.innerHTML = '';
    td.appendChild(input);
    input.focus();

    let isFinished = false;
    const finishEdit = () => {
      if (isFinished) return;
      isFinished = true;
      const newVal = input.value.trim();
      if (newVal !== val) {
        saveMasterCellValue(masterType, contract, col.id, newVal, index);
      } else {
        refreshTable(masterType);
      }
    };

    input.addEventListener('blur', finishEdit);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        input.blur();
      }
    });
  }

  // 各テーブルごとの「現在選択されている行データ」を取得するヘルパー
  function checkTableHasSelection(tableId) {
    if (tableId === 'jo') {
      if (state.joSelectedCell && state.joSelectedCell.customerId) {
        const idx = state.joContracts.findIndex(c => c.customerId === state.joSelectedCell.customerId);
        if (idx !== -1) {
          return { data: state.joContracts[idx], index: idx };
        }
      }
    } else if (tableId === 'ap') {
      if (state.apSelectedCell && state.apSelectedCell.customerId) {
        const idx = state.apContracts.findIndex(c => c.customerId === state.apSelectedCell.customerId);
        if (idx !== -1) {
          return { data: state.apContracts[idx], index: idx };
        }
      }
    } else if (tableId === 'ag') {
      if (state.agSelectedCell && state.agSelectedCell.customerId) {
        const idx = state.agContracts.findIndex(c => c.customerId === state.agSelectedCell.customerId);
        if (idx !== -1) {
          return { data: state.agContracts[idx], index: idx };
        }
      }
    } else if (tableId === 'dbmake') {
      if (state.dbmakeSelectedCell && state.dbmakeSelectedCell.partnerId) {
        const idx = dbmakePartners.findIndex(p => p.id === state.dbmakeSelectedCell.partnerId);
        if (idx !== -1) {
          return { data: dbmakePartners[idx], index: idx };
        }
      }
    } else {
      // カスタムテーブル
      if (state.ctSelectedCell) {
        const tbl = state.customTables.find(t => t.id === tableId);
        if (tbl) {
          const idx = tbl.rows.findIndex(r => r.id === state.ctSelectedCell.rowId);
          if (idx !== -1) {
            return { data: tbl.rows[idx], index: idx };
          }
        }
      }
    }
    return null;
  }

  // 登録・編集フォームモーダルの表示処理
  function openDataFormModal(tableId, rowData = null, rowIndex = -1) {
    let modal = document.getElementById('data-form-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'data-form-modal';
      modal.style.position = 'fixed';
      modal.style.top = '0';
      modal.style.left = '0';
      modal.style.width = '100vw';
      modal.style.height = '100vh';
      modal.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
      modal.style.backdropFilter = 'blur(4px)';
      modal.style.display = 'flex';
      modal.style.alignItems = 'center';
      modal.style.justifyContent = 'center';
      modal.style.zIndex = '9999';
      document.body.appendChild(modal);
    }

    modal.innerHTML = '';
    modal.style.display = 'flex';

    const modalContent = document.createElement('div');
    modalContent.style.background = 'var(--bg-surface-elevated)';
    modalContent.style.border = '1px solid var(--border-color)';
    modalContent.style.borderRadius = 'var(--radius-lg)';
    modalContent.style.width = '90%';
    modalContent.style.maxWidth = '550px';
    modalContent.style.maxHeight = '85vh';
    modalContent.style.display = 'flex';
    modalContent.style.flexDirection = 'column';
    modalContent.style.boxShadow = '0 10px 25px rgba(0,0,0,0.5)';
    modalContent.style.overflow = 'hidden';

    const isEdit = rowData !== null;
    const titleText = isEdit ? '📝 データの編集' : '➕ 新規データの登録';

    let columns = [];
    let currentTable = null;
    if (tableId === 'jo') {
      columns = state.joColumns;
    } else if (tableId === 'ap') {
      columns = state.apColumns;
    } else if (tableId === 'ag') {
      columns = state.agColumns;
    } else if (tableId === 'dbmake') {
      columns = [
        { id: 'id', label: '本登録顧客ID', readOnly: true },
        { id: 'companyName', label: '企業名' },
        { id: 'status', label: '運営状況', type: 'select', choices: ['運営中', '一時停止', '削除', '保留'] },
        { id: 'phone', label: '電話番号' },
        { id: 'email', label: 'メールアドレス' },
        { id: 'address', label: '住所' },
        { id: 'repName', label: '代表者名' },
        { id: 'repFurigana', label: '代表者フリガナ' },
        { id: 'invoiceNum', label: '適格請求書発行事業者登録番号' }
      ];
    } else {
      currentTable = state.customTables.find(t => t.id === tableId);
      if (currentTable) {
        columns = currentTable.columns;
      }
    }

    const header = document.createElement('div');
    header.style.padding = '1rem 1.5rem';
    header.style.borderBottom = '1px solid var(--border-color)';
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    header.innerHTML = `
      <h2 style="margin: 0; font-size: 1.2rem; color: var(--text-primary); font-weight: 600;">\${titleText}</h2>
      <span class="close-btn" style="cursor: pointer; font-size: 1.5rem; color: var(--text-muted);">&times;</span>
    `;
    modalContent.appendChild(header);

    const closeBtn = header.querySelector('.close-btn');
    const closeModal = () => { modal.style.display = 'none'; };
    closeBtn.addEventListener('click', closeModal);

    const body = document.createElement('div');
    body.style.padding = '1.5rem';
    body.style.overflowY = 'auto';
    body.style.flex = '1';
    body.style.display = 'flex';
    body.style.flexDirection = 'column';
    body.style.gap = '1rem';

    const inputsMap = {};

    columns.forEach(col => {
      if (col.id === 'id' && !isEdit) return;

      const group = document.createElement('div');
      group.style.display = 'flex';
      group.style.flexDirection = 'column';
      group.style.gap = '0.35rem';

      const label = document.createElement('label');
      label.style.fontSize = '0.8rem';
      label.style.fontWeight = '500';
      label.style.color = 'var(--text-secondary)';
      label.textContent = col.label || col.name || col.id;
      group.appendChild(label);

      let input;
      const val = isEdit ? (rowData[col.id] || '') : '';

      if (col.id === 'id' || col.readOnly) {
        input = document.createElement('input');
        input.type = 'text';
        input.value = val;
        input.readOnly = true;
        input.style.backgroundColor = 'var(--bg-surface)';
        input.style.color = 'var(--text-muted)';
        input.style.cursor = 'not-allowed';
      } else if (col.type === 'select' || (col.choices && col.choices.length > 0)) {
        normalizeColChoices(col);
        input = document.createElement('select');
        const optEmpty = document.createElement('option');
        optEmpty.value = '';
        optEmpty.textContent = '選択してください';
        input.appendChild(optEmpty);

        col.choices.forEach(choice => {
          const opt = document.createElement('option');
          opt.value = choice.value || choice;
          opt.textContent = choice.value || choice;
          if ((choice.value || choice) === val) opt.selected = true;
          input.appendChild(opt);
        });
      } else if (col.type === 'date') {
        input = document.createElement('input');
        input.type = 'date';
        input.value = val;
      } else if (col.type === 'number') {
        input = document.createElement('input');
        input.type = 'number';
        input.value = val;
      } else {
        input = document.createElement('input');
        input.type = 'text';
        input.value = val;
      }

      input.style.width = '100%';
      input.style.boxSizing = 'border-box';
      input.style.padding = '0.5rem';
      input.style.backgroundColor = input.readOnly ? 'var(--bg-surface)' : 'var(--bg-surface-elevated)';
      input.style.border = '1px solid var(--border-color)';
      input.style.color = 'var(--text-primary)';
      input.style.borderRadius = 'var(--radius-sm)';
      input.style.fontSize = '0.85rem';
      input.style.outline = 'none';

      if (!input.readOnly) {
        input.addEventListener('focus', () => {
          input.style.borderColor = 'var(--primary)';
          input.style.boxShadow = '0 0 0 2px rgba(99, 102, 241, 0.2)';
        });
        input.addEventListener('blur', () => {
          input.style.borderColor = 'var(--border-color)';
          input.style.boxShadow = 'none';
        });
      }

      group.appendChild(input);
      body.appendChild(group);

      inputsMap[col.id] = input;
    });

    modalContent.appendChild(body);

    const footer = document.createElement('div');
    footer.style.padding = '1rem 1.5rem';
    footer.style.borderTop = '1px solid var(--border-color)';
    footer.style.display = 'flex';
    footer.style.justifyContent = 'flex-end';
    footer.style.gap = '0.75rem';

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'btn btn-secondary';
    cancelBtn.textContent = 'キャンセル';
    cancelBtn.addEventListener('click', closeModal);
    footer.appendChild(cancelBtn);

    const saveBtn = document.createElement('button');
    saveBtn.className = 'btn btn-primary';
    saveBtn.textContent = isEdit ? '変更を保存' : '登録する';
    saveBtn.addEventListener('click', () => {
      const newValues = {};
      columns.forEach(col => {
        if (inputsMap[col.id]) {
          newValues[col.id] = inputsMap[col.id].value.trim();
        }
      });

      if (tableId === 'jo') {
        if (isEdit) {
          const item = state.joContracts[rowIndex];
          if (item) {
            const oldVal = { ...item };
            Object.assign(item, newValues);
            localStorage.setItem(STORAGE_KEYS.JO_CONTRACTS, JSON.stringify(state.joContracts));
            logCellEdit('jo-contracts', item.customerId, 'all_columns', JSON.stringify(oldVal), JSON.stringify(newValues));
          }
        } else {
          newValues.customerId = `JO-\${Date.now()}`;
          state.joContracts.unshift(newValues);
          localStorage.setItem(STORAGE_KEYS.JO_CONTRACTS, JSON.stringify(state.joContracts));
        }
        renderJoInfo();
      } else if (tableId === 'ap') {
        if (isEdit) {
          const item = state.apContracts[rowIndex];
          if (item) {
            const oldVal = { ...item };
            Object.assign(item, newValues);
            localStorage.setItem(STORAGE_KEYS.AP_CONTRACTS, JSON.stringify(state.apContracts));
            logCellEdit('ap-contracts', item.customerId, 'all_columns', JSON.stringify(oldVal), JSON.stringify(newValues));
          }
        } else {
          newValues.customerId = `AP-\${Date.now()}`;
          state.apContracts.unshift(newValues);
          localStorage.setItem(STORAGE_KEYS.AP_CONTRACTS, JSON.stringify(state.apContracts));
        }
        renderApplicantInfo();
      } else if (tableId === 'ag') {
        if (isEdit) {
          const item = state.agContracts[rowIndex];
          if (item) {
            const oldVal = { ...item };
            Object.assign(item, newValues);
            localStorage.setItem(STORAGE_KEYS.AG_CONTRACTS, JSON.stringify(state.agContracts));
            logCellEdit('ag-contracts', item.customerId, 'all_columns', JSON.stringify(oldVal), JSON.stringify(newValues));
          }
        } else {
          newValues.customerId = `AG-\${Date.now()}`;
          state.agContracts.unshift(newValues);
          localStorage.setItem(STORAGE_KEYS.AG_CONTRACTS, JSON.stringify(state.agContracts));
        }
        renderAgencyInfo();
      } else if (tableId === 'dbmake') {
        if (isEdit) {
          const item = dbmakePartners[rowIndex];
          if (item) {
            const oldVal = { ...item };
            Object.assign(item, newValues);
            localStorage.setItem('synapse_dbmake_partners', JSON.stringify(dbmakePartners));
            logCellEdit('dbmake-partners', item.id, 'all_columns', JSON.stringify(oldVal), JSON.stringify(newValues));
          }
        } else {
          newValues.id = `PARTNER-\${Date.now()}`;
          dbmakePartners.unshift(newValues);
          localStorage.setItem('synapse_dbmake_partners', JSON.stringify(dbmakePartners));
        }
        renderDbmakePartners();
      } else {
        if (currentTable) {
          if (isEdit) {
            const item = currentTable.rows[rowIndex];
            if (item) {
              const oldVal = { ...item };
              Object.assign(item, newValues);
              saveCustomTables();
              logCellEdit(`custom-table-\${tableId}`, item.id, 'all_columns', JSON.stringify(oldVal), JSON.stringify(newValues));
            }
          } else {
            newValues.id = `row_\${Date.now()}_\${Math.floor(Math.random() * 1000)}`;
            currentTable.rows.unshift(newValues);
            saveCustomTables();
          }
          renderCustomTable(tableId);
        }
      }

      showToast(isEdit ? 'データを変更しました。' : 'データを登録しました。', 'success');
      closeModal();
    });
    footer.appendChild(saveBtn);

    modalContent.appendChild(footer);
    modal.appendChild(modalContent);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  // セルのドロップダウンインライン編集開始処理
  function startMasterDropdownEdit(td, val, col, contract, index, masterType) {
    if (td.querySelector('select')) return;

    normalizeColChoices(col);
    const select = document.createElement('select');
    select.style.width = '100%';
    select.style.height = '100%';
    select.style.fontSize = '0.8rem';
    select.style.padding = '2px';
    select.style.border = '1px solid var(--primary)';
    select.style.borderRadius = '4px';
    select.style.boxSizing = 'border-box';

    const optEmpty = document.createElement('option');
    optEmpty.value = '';
    optEmpty.textContent = '選択してください';
    select.appendChild(optEmpty);

    col.choices.forEach(choice => {
      const opt = document.createElement('option');
      opt.value = choice.value;
      opt.textContent = choice.value;
      if (choice.value === val) opt.selected = true;
      select.appendChild(opt);
    });

    td.innerHTML = '';
    td.appendChild(select);
    select.focus();

    // 編集完了時の処理
    let isFinished = false;
    const finishEdit = () => {
      if (isFinished) return;
      isFinished = true;
      const newVal = select.value;
      if (newVal !== val) {
        saveMasterCellValue(masterType, contract, col.id, newVal, index);
      } else {
        // キャンセル時は元の状態に再描画
        if (masterType === 'jo') renderJoInfo();
        else if (masterType === 'ap') renderApplicantInfo();
        else if (masterType === 'ag') renderAgencyInfo();
        else if (masterType === 'dbmake') renderDbmakePartners();
      }
    };

    select.addEventListener('change', finishEdit);
    select.addEventListener('blur', finishEdit);
  }

  // 共通テーブル・マスタ検索ヘルパー
  function findCustomOrMasterTable(tableId) {
    if (tableId === 'jo-info-screen') {
      return {
        id: 'jo-info-screen',
        name: getDynamicMasterTableName('jo-info-screen'),
        columns: state.joColumns,
        columnWidths: state.joColumnWidths,
        rows: state.joContracts || [],
        isMaster: true
      };
    } else if (tableId === 'applicant-info-screen') {
      return {
        id: 'applicant-info-screen',
        name: getDynamicMasterTableName('applicant-info-screen'),
        columns: state.apColumns,
        columnWidths: state.apColumnWidths,
        rows: state.apContracts || [],
        isMaster: true
      };
    } else if (tableId === 'agency-info-screen') {
      return {
        id: 'agency-info-screen',
        name: getDynamicMasterTableName('agency-info-screen'),
        columns: state.agColumns,
        columnWidths: state.agColumnWidths,
        rows: state.agContracts || [],
        isMaster: true
      };
    } else if (tableId === 'dbmake') {
      return {
        id: 'dbmake',
        name: getDynamicMasterTableName('dbmake'),
        columns: state.dbmakeColumns,
        columnWidths: state.dbmakeColumnWidths,
        rows: dbmakePartners || [],
        isMaster: true
      };
    } else {
      return state.customTables.find(t => t.id === tableId);
    }
  }

  function saveAndRenderSizeChange(tbl) {
    const tableId = tbl.id;
    const suffix = getUserIdSuffix();
    if (tableId === 'jo-info-screen') {
      localStorage.setItem(STORAGE_KEYS.JO_COLUMN_WIDTHS, JSON.stringify(state.joColumnWidths));
      renderJoInfo();
    } else if (tableId === 'applicant-info-screen') {
      localStorage.setItem(STORAGE_KEYS.AP_COLUMN_WIDTHS, JSON.stringify(state.apColumnWidths));
      renderApplicantInfo();
    } else if (tableId === 'agency-info-screen') {
      localStorage.setItem(STORAGE_KEYS.AG_COLUMN_WIDTHS, JSON.stringify(state.agColumnWidths));
      renderAgencyInfo();
    } else if (tableId === 'dbmake') {
      localStorage.setItem(`SYNAPSE_DBMAKE_COL_WIDTHS${suffix}`, JSON.stringify(state.dbmakeColumnWidths));
      renderDbmakePartners();
    } else {
      saveCustomTables();
      renderCustomTable(tableId);
    }
  }

  // 📏 コンテキストメニューのクリックイベント
  document.getElementById('ct-menu-change-width')?.addEventListener('mousedown', (e) => {
    e.stopPropagation();
    const menu = document.getElementById('ct-context-menu');
    if (menu) menu.style.display = 'none';
    openCtResizeDialog();
  });
  document.getElementById('ct-menu-change-height')?.addEventListener('mousedown', (e) => {
    e.stopPropagation();
    const menu = document.getElementById('ct-context-menu');
    if (menu) menu.style.display = 'none';
    openCtResizeDialog();
  });
  document.getElementById('ct-menu-dropdown-settings')?.addEventListener('mousedown', (e) => {
    e.stopPropagation();
    if (window.logToDebugPanel) window.logToDebugPanel('ct-menu-dropdown-settings mousedown event detected!', '#00ff00');
    if (!ctResizeState.tblId || !ctResizeState.targetId) {
      if (window.logToDebugPanel) window.logToDebugPanel(`ERR: missing tblId(${ctResizeState.tblId}) or targetId(${ctResizeState.targetId})`, '#ff4444');
      return;
    }
    const tbl = findCustomOrMasterTable(ctResizeState.tblId);
    if (!tbl) {
      if (window.logToDebugPanel) window.logToDebugPanel(`ERR: tbl not found for ${ctResizeState.tblId}`, '#ff4444');
      return;
    }
    if (window.logToDebugPanel) window.logToDebugPanel(`Invoking openValidationSidebar for tbl.id=${tbl.id}, targetId=${ctResizeState.targetId}`, '#00ff00');
    openValidationSidebar(tbl, ctResizeState.targetId);
  });

  // リサイズダイアログ：キャンセル
  const closeCtResizeDialog = () => {
    const modal = document.getElementById('ct-resize-dialog-modal');
    if (modal) {
      modal.classList.remove('active');
      setTimeout(() => {
        modal.style.display = 'none';
      }, 250);
    }
  };
  document.getElementById('ct-resize-dialog-cancel')?.addEventListener('click', closeCtResizeDialog);

  // リサイズダイアログ：OK（確定）
  document.getElementById('ct-resize-dialog-submit')?.addEventListener('click', () => {
    if (!ctResizeState.tblId) return;
    const tbl = findCustomOrMasterTable(ctResizeState.tblId);
    if (!tbl) return;

    const mode = document.querySelector('input[name="ct-resize-mode"]:checked')?.value;
    const pixelVal = parseInt(document.getElementById('ct-resize-pixel-val')?.value, 10) || 30;

    if (ctResizeState.type === 'col') {
      if (mode === 'pixel') {
        tbl.columnWidths[ctResizeState.targetId] = Math.max(20, Math.min(1000, pixelVal));
      } else {
        // データに合わせる (フィット幅自動計算)
        const colId = ctResizeState.targetId;
        const col = tbl.columns.find(c => c.id === colId);
        let maxLen = col ? (col.label || col.name || '').length : 4;
        tbl.rows.forEach(r => {
          const val = String(r[colId] || '');
          if (val.length > maxLen) maxLen = val.length;
        });
        const autoWidth = Math.max(60, maxLen * 9 + 25);
        tbl.columnWidths[colId] = autoWidth;
      }
    } else {
      // 行高の適用
      if (!tbl.rowHeights) tbl.rowHeights = {};
      if (mode === 'pixel') {
        tbl.rowHeights[ctResizeState.targetId] = Math.max(15, Math.min(500, pixelVal));
      } else {
        // データに合わせる (デフォルト高さ30pxにリセット)
        tbl.rowHeights[ctResizeState.targetId] = 30;
      }
    }

    saveAndRenderSizeChange(tbl);
    closeCtResizeDialog();
    showToast('サイズを変更しました。', 'success');
  });

  // リサイズダイアログ表示用
  function openCtResizeDialog() {
    if (window.logToDebugPanel) window.logToDebugPanel(`openCtResizeDialog called: tblId=${ctResizeState.tblId}, type=${ctResizeState.type}, targetId=${ctResizeState.targetId}`, '#00ff00');
    const modal = document.getElementById('ct-resize-dialog-modal');
    const title = document.getElementById('ct-resize-dialog-title');
    const pixelLabel = document.getElementById('ct-resize-pixel-label');
    const pixelVal = document.getElementById('ct-resize-pixel-val');
    
    if (!modal) {
      if (window.logToDebugPanel) window.logToDebugPanel('ERR: ct-resize-dialog-modal DOM element not found', '#ff4444');
      return;
    }
    if (!ctResizeState.tblId) {
      if (window.logToDebugPanel) window.logToDebugPanel('ERR: missing ctResizeState.tblId', '#ff4444');
      return;
    }

    const tbl = findCustomOrMasterTable(ctResizeState.tblId);
    if (!tbl) {
      if (window.logToDebugPanel) window.logToDebugPanel(`ERR: tbl not found for ${ctResizeState.tblId}`, '#ff4444');
      return;
    }

    if (ctResizeState.type === 'col') {
      title.textContent = '列の幅を変更';
      pixelLabel.textContent = '新しい列の幅をピクセル単位で入力してください (デフォルト: 120)。';
      const currentWidth = tbl.columnWidths[ctResizeState.targetId] || 120;
      pixelVal.value = currentWidth;
    } else {
      title.textContent = '行の高さを変更';
      pixelLabel.textContent = '新しい行の高さをピクセル単位で入力してください (デフォルト: 30)。';
      const currentHeight = tbl.rowHeights && tbl.rowHeights[ctResizeState.targetId] ? tbl.rowHeights[ctResizeState.targetId] : 30;
      pixelVal.value = currentHeight;
    }

    // ラジオボタンの初期化
    document.getElementById('ct-resize-mode-pixel').checked = true;

    modal.style.display = 'flex';
    modal.offsetHeight; // 強制リフロー
    modal.classList.add('active');
    if (window.logToDebugPanel) {
      const computed = window.getComputedStyle(modal);
      window.logToDebugPanel(`Modal STATE: style.display=${modal.style.display}, computed.display=${computed.display}, computed.zIndex=${computed.zIndex}, opacity=${computed.opacity}, activeClass=${modal.classList.contains('active')}`, '#00ff00');
    }
  }
}

// ==========================================
// ⚙️ テーブル編集ロック＆共通ヘルパー（グローバル）
// ==========================================

function isTableLocked(tableId) {
  if (state.tableEditLocks === undefined) {
    state.tableEditLocks = {};
  }
  if (state.tableEditLocks[tableId] === undefined) {
    state.tableEditLocks[tableId] = true; // デフォルトはロック
  }
  return state.tableEditLocks[tableId];
}
window.isTableLocked = isTableLocked;

function getDynamicMasterTableName(tableId) {
  let parentHeaderId = '';
  let defaultName = '';
  
  if (tableId === 'jo-info-screen') {
    parentHeaderId = 'menu-jo-parent';
    defaultName = 'JO基本マスタ';
  } else if (tableId === 'applicant-info-screen') {
    parentHeaderId = 'menu-applicant-parent';
    defaultName = '申込者基本マスタ';
  } else if (tableId === 'agency-info-screen') {
    parentHeaderId = 'menu-agency-parent';
    defaultName = '代理店基本マスタ';
  } else if (tableId === 'dbmake') {
    const btn = document.getElementById('menu-dbmake');
    if (btn) {
      return btn.textContent.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '').replace(/[📊👥🛢️]/g, '').trim();
    }
    return 'パートナーDB';
  }

  if (parentHeaderId) {
    const el = document.getElementById(parentHeaderId);
    if (el) {
      const span = el.querySelector('span');
      let folderName = span ? span.textContent : el.textContent;
      folderName = folderName.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '').replace(/[📅💼📑📋]/g, '').trim();
      let baseName = folderName.replace(/(情報|フォルダ)$/, '');
      if (!baseName) baseName = folderName;
      return `${baseName}基本マスタ`;
    }
  }

  return defaultName;
}
window.getDynamicMasterTableName = getDynamicMasterTableName;

function syncMasterTableNamesWithFolders() {
  const agencyInfoBtn = document.getElementById('menu-agency-info');
  const joInfoBtn = document.getElementById('menu-jo-info');
  const applicantInfoBtn = document.getElementById('menu-applicant-info');

  if (joInfoBtn) {
    const name = getDynamicMasterTableName('jo-info-screen');
    joInfoBtn.innerHTML = `📊 ${name}`;
  }
  if (applicantInfoBtn) {
    const name = getDynamicMasterTableName('applicant-info-screen');
    applicantInfoBtn.innerHTML = `📊 ${name}`;
  }
  if (agencyInfoBtn) {
    const name = getDynamicMasterTableName('agency-info-screen');
    agencyInfoBtn.innerHTML = `📊 ${name}`;
  }
}
window.syncMasterTableNamesWithFolders = syncMasterTableNamesWithFolders;

function renderMasterDropdownCellMarkup(td, val, col, styleObj = {}) {
  const isSelect = col.type === 'select' || (col.choices && col.choices.length > 0);
  if (!isSelect) return false;

  normalizeColChoices(col);
  const choice = col.choices.find(c => c.value === val);
  
  if (choice && val) {
    const styleType = col.dropdownStyle || 'chip-outline';
    if (styleType === 'chip-fill') {
      td.innerHTML = `
        <div class="ct-dropdown-cell-wrapper" style="justify-content: center; padding-right: 0; display: flex; align-items: center; width: 100%; height: 100%;">
          <span class="ct-chip-fill" style="background-color: ${choice.color || '#000000'}; color: ${choice.textColor || '#ffffff'}; padding: 0.15rem 0.6rem; border-radius: 12px; font-size: 0.75rem; font-weight: 500; display: inline-block; max-width: 90%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-align: center;">${val}</span>
          <span class="ct-dropdown-arrow-icon" style="display: none;">▼</span>
        </div>
      `;
      if (styleObj['background-color']) {
        const badgeSpan = td.querySelector('.ct-chip-fill');
        if (badgeSpan) badgeSpan.style.backgroundColor = styleObj['background-color'];
      }
    } else if (styleType === 'arrow') {
      td.innerHTML = `
        <div class="ct-dropdown-cell-wrapper" style="position: relative; display: flex; align-items: center; justify-content: space-between; width: 100%; height: 100%; box-sizing: border-box; padding-right: 12px;">
          <span style="color: ${choice.color}; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${val}</span>
          <span class="ct-dropdown-arrow-icon" style="position: absolute; right: 4px; top: 50%; transform: translateY(-50%); font-size: 0.55rem; color: var(--text-muted); user-select: none; pointer-events: none;">▼</span>
        </div>
      `;
    } else {
      td.innerHTML = `
        <div class="ct-dropdown-cell-wrapper" style="justify-content: center; padding-right: 0; display: flex; align-items: center; width: 100%; height: 100%;">
          <span class="ct-chip-outline" style="border: 1px solid ${choice.color}; background-color: ${hexToRgba(choice.color, 0.12)}; color: ${choice.color}; padding: 0.15rem 0.6rem; border-radius: 12px; font-size: 0.75rem; font-weight: 500; display: inline-block; max-width: 90%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-align: center;">${val}</span>
          <span class="ct-dropdown-arrow-icon" style="display: none;">▼</span>
        </div>
      `;
      if (styleObj['background-color']) {
        const badgeSpan = td.querySelector('.ct-chip-outline');
        if (badgeSpan) badgeSpan.style.backgroundColor = styleObj['background-color'];
      }
    }
  } else {
    const styleType = col.dropdownStyle || 'chip-outline';
    if (styleType === 'arrow') {
      td.innerHTML = `
        <div class="ct-dropdown-cell-wrapper" style="position: relative; display: flex; align-items: center; justify-content: space-between; width: 100%; height: 100%; box-sizing: border-box; padding-right: 12px;">
          <span style="color: var(--text-primary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${val}</span>
          <span class="ct-dropdown-arrow-icon" style="position: absolute; right: 4px; top: 50%; transform: translateY(-50%); font-size: 0.55rem; color: var(--text-muted); user-select: none; pointer-events: none;">▼</span>
        </div>
      `;
    } else {
      td.textContent = val;
    }
  }
  return true;
}
window.renderMasterDropdownCellMarkup = renderMasterDropdownCellMarkup;

function getTableMeta(tableId) {
  if (tableId === 'jo') {
    return {
      columns: state.joColumns,
      rows: state.joContracts,
      name: getDynamicMasterTableName('jo-info-screen') || 'JO基本マスタ',
      idKey: 'customerId',
      save: () => {
        localStorage.setItem(STORAGE_KEYS.JO_CONTRACTS, JSON.stringify(state.joContracts));
      },
      render: () => {
        if (typeof renderJoInfo === 'function') renderJoInfo();
      }
    };
  } else if (tableId === 'ap') {
    return {
      columns: state.apColumns,
      rows: state.apContracts,
      name: getDynamicMasterTableName('applicant-info-screen') || '申込者基本マスタ',
      idKey: 'customerPersonalityId',
      save: () => {
        localStorage.setItem(STORAGE_KEYS.AP_CONTRACTS, JSON.stringify(state.apContracts));
      },
      render: () => {
        if (typeof renderApplicantInfo === 'function') renderApplicantInfo();
      }
    };
  } else if (tableId === 'ag') {
    return {
      columns: state.agColumns,
      rows: state.agContracts,
      name: getDynamicMasterTableName('agency-info-screen') || '代理店基本マスタ',
      idKey: 'customerId',
      save: () => {
        localStorage.setItem(STORAGE_KEYS.AG_CONTRACTS, JSON.stringify(state.agContracts));
      },
      render: () => {
        if (typeof renderAgencyInfo === 'function') renderAgencyInfo();
      }
    };
  } else if (tableId === 'dbmake') {
    let partners = [];
    if (typeof dbmakePartners !== 'undefined') {
      partners = dbmakePartners;
    } else if (typeof window.dbmakePartners !== 'undefined') {
      partners = window.dbmakePartners;
    }
    return {
      columns: state.dbmakeColumns,
      rows: partners,
      name: getDynamicMasterTableName('dbmake') || 'パートナーDB',
      idKey: 'id',
      save: () => {
        localStorage.setItem('cos_dbmake_partners', JSON.stringify(partners));
      },
      render: () => {
        if (typeof renderDbmakePartners === 'function') renderDbmakePartners();
      }
    };
  } else {
    const tbl = state.customTables.find(t => t.id === tableId);
    if (tbl) {
      return {
        columns: tbl.columns,
        rows: tbl.rows,
        name: tbl.name,
        idKey: 'id',
        save: () => {
          if (typeof saveCustomTables === 'function') saveCustomTables();
        },
        render: () => {
          if (typeof renderCustomTable === 'function') renderCustomTable(tableId);
        }
      };
    }
  }
  return null;
}

function renderTableControlBar(tableId, parentContainerEl) {
  const existing = parentContainerEl.querySelector(`.table-control-bar-${tableId}`);
  if (existing && existing.parentNode) {
    existing.parentNode.removeChild(existing);
  }

  const controlBar = document.createElement('div');
  controlBar.className = `table-control-bar table-control-bar-${tableId}`;
  controlBar.style.display = 'flex';
  controlBar.style.justifyContent = 'space-between';
  controlBar.style.alignItems = 'center';
  controlBar.style.marginBottom = '0.75rem';
  controlBar.style.gap = '0.5rem';

  const leftDiv = document.createElement('div');
  leftDiv.style.display = 'flex';
  leftDiv.style.alignItems = 'center';
  leftDiv.style.gap = '0.5rem';

  // 1件登録ボタン
  const addSingleBtn = document.createElement('button');
  addSingleBtn.className = 'btn btn-primary ct-add-single-row-btn';
  addSingleBtn.style.padding = '0.4rem 0.75rem';
  addSingleBtn.style.fontSize = '0.8rem';
  addSingleBtn.style.display = 'flex';
  addSingleBtn.style.alignItems = 'center';
  addSingleBtn.style.gap = '0.25rem';
  addSingleBtn.innerHTML = '<span>➕</span> 1件登録';
  addSingleBtn.addEventListener('click', () => {
    if (window.openSingleRegisterModal) {
      window.openSingleRegisterModal(tableId);
    }
  });
  leftDiv.appendChild(addSingleBtn);

  // 📥 CSVインポートボタン
  const meta = getTableMeta(tableId);
  if (meta) {
    const importBtn = document.createElement('button');
    importBtn.className = 'btn btn-secondary';
    importBtn.style.padding = '0.4rem 0.75rem';
    importBtn.style.fontSize = '0.8rem';
    importBtn.style.display = 'flex';
    importBtn.style.alignItems = 'center';
    importBtn.style.gap = '0.25rem';
    importBtn.innerHTML = '<span>📥</span> CSVインポート';

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.csv';
    fileInput.style.display = 'none';

    importBtn.addEventListener('click', () => {
      if (isTableLocked(tableId)) {
        showToast('テーブルがロックされています。CSVをインポートするには上部の鍵アイコンでロックを解除してください。', 'warning');
        return;
      }
      fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        const lines = text.split(/\r?\n/);
        if (lines.length === 0 || (lines.length === 1 && !lines[0].trim())) {
          showToast('CSVファイルが空です。', 'warning');
          return;
        }

        // 簡易CSVパース関数
        const parseCSVLine = (line) => {
          const result = [];
          let current = '';
          let inQuotes = false;
          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
              result.push(current.replace(/^"|"$/g, '').replace(/""/g, '"').trim());
              current = '';
            } else {
              current += char;
            }
          }
          result.push(current.replace(/^"|"$/g, '').replace(/""/g, '"').trim());
          return result;
        };

        const firstLineCells = parseCSVLine(lines[0]);
        // 1行目のいずれかの値が、列定義のlabelのいずれかと一致すればヘッダーと判定
        const isHeader = firstLineCells.some(h => meta.columns.some(col => col.label.toLowerCase() === h.toLowerCase()));
        let startIndex = 0;
        const colMap = {};

        if (isHeader) {
          startIndex = 1;
          meta.columns.forEach(col => {
            const idx = firstLineCells.findIndex(h => h.toLowerCase() === col.label.toLowerCase());
            if (idx !== -1) colMap[col.id] = idx;
          });
        } else {
          // ヘッダーがない場合は左から順番にマッピング
          meta.columns.forEach((col, idx) => {
            colMap[col.id] = idx;
          });
        }

        let importedCount = 0;
        for (let i = startIndex; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;

          const cells = parseCSVLine(line);
          const newRow = {};

          meta.columns.forEach(col => {
            const csvIdx = colMap[col.id];
            newRow[col.id] = (csvIdx !== undefined && cells[csvIdx] !== undefined) ? cells[csvIdx] : '';
          });

          // 自動採番処理
          if (tableId === 'jo') {
            if (!newRow.customerId) newRow.customerId = generateUniqueCustomerNumber();
            if (!newRow.customerPersonalityId) newRow.customerPersonalityId = generate8DigitId();
          } else if (tableId === 'ap') {
            if (!newRow.customerPersonalityId) newRow.customerPersonalityId = generate8DigitId();
            if (!newRow.customerId) newRow.customerId = generateUniqueCustomerNumber();
          } else if (tableId === 'ag') {
            if (!newRow.customerId) newRow.customerId = generateUniqueCustomerNumber();
            if (!newRow.customerPersonalityId) newRow.customerPersonalityId = generate8DigitId();
          } else if (tableId === 'dbmake') {
            if (!newRow.id) newRow.id = `pt_${generate8DigitId()}`;
          } else {
            if (!newRow.id) newRow.id = `row_${Date.now()}_${i}_${Math.floor(Math.random() * 1000)}`;
          }

          meta.rows.push(newRow);
          importedCount++;
        }

        if (importedCount > 0) {
          meta.save();
          meta.render();
          showToast(`${importedCount} 件のデータをインポートしました。`, 'success');
        } else {
          showToast('インポート可能なデータが見つかりませんでした。', 'warning');
        }

        fileInput.value = '';
      };

      reader.onerror = () => {
        showToast('ファイルの読み込みに失敗しました。', 'error');
      };

      reader.readAsText(file);
    });

    leftDiv.appendChild(importBtn);
    leftDiv.appendChild(fileInput);

    // 📤 CSVエクスポートボタン
    const exportBtn = document.createElement('button');
    exportBtn.className = 'btn btn-secondary';
    exportBtn.style.padding = '0.4rem 0.75rem';
    exportBtn.style.fontSize = '0.8rem';
    exportBtn.style.display = 'flex';
    exportBtn.style.alignItems = 'center';
    exportBtn.style.gap = '0.25rem';
    exportBtn.innerHTML = '<span>📤</span> CSVエクスポート';

    exportBtn.addEventListener('click', () => {
      const csvRows = [];
      // ヘッダーを追加
      csvRows.push(meta.columns.map(col => `"${col.label.replace(/"/g, '""')}"`).join(','));

      // データ行を追加
      meta.rows.forEach(row => {
        const values = meta.columns.map(col => {
          const val = row[col.id] || '';
          return `"${String(val).replace(/"/g, '""')}"`;
        });
        csvRows.push(values.join(','));
      });

      const csvContent = "\uFEFF" + csvRows.join("\n"); // Excel文字化け防止BOM
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${meta.name}_${new Date().toISOString().slice(0, 10)}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('CSVファイルをエクスポートしました。', 'success');
    });

    leftDiv.appendChild(exportBtn);
  }

  const rightDiv = document.createElement('div');
  rightDiv.style.display = 'flex';
  rightDiv.style.alignItems = 'center';
  rightDiv.style.gap = '0.5rem';

  // ロックアイコン
  const isLocked = isTableLocked(tableId);
  const editBtn = document.createElement('button');
  editBtn.className = `btn ${isLocked ? 'btn-secondary' : 'btn-primary'}`;
  editBtn.style.padding = '0.4rem 0.75rem';
  editBtn.style.fontSize = '0.8rem';
  editBtn.style.display = 'flex';
  editBtn.style.alignItems = 'center';
  editBtn.style.gap = '0.25rem';
  editBtn.innerHTML = `<span>${isLocked ? '🔒' : '🔓'}</span> ${isLocked ? '編集をロック中' : '編集ロック解除中'}`;

  editBtn.addEventListener('click', () => {
    const currentLock = isTableLocked(tableId);
    const newLock = !currentLock;
    
    if (state.tableEditLocks === undefined) {
      state.tableEditLocks = {};
    }
    state.tableEditLocks[tableId] = newLock;
    localStorage.setItem('synapse_table_edit_locks', JSON.stringify(state.tableEditLocks));

    editBtn.className = `btn ${newLock ? 'btn-secondary' : 'btn-primary'}`;
    editBtn.innerHTML = `<span>${newLock ? '🔒' : '🔓'}</span> ${newLock ? '編集をロック中' : '編集ロック解除中'}`;

    if (newLock) {
      showToast('テーブルを編集ロックしました。直接入力や行操作はブロックされます。', 'info');
    } else {
      showToast('テーブルの編集ロックを解除しました。ダブルクリックで直接入力が可能です。', 'success');
    }
    
    // 表示更新
    if (tableId === 'jo') renderJoInfo();
    else if (tableId === 'ap') renderApplicantInfo();
    else if (tableId === 'ag') renderAgencyInfo();
    else if (tableId === 'dbmake') renderDbmakePartners();
    else {
      renderCustomTable(tableId);
    }
  });
  rightDiv.appendChild(editBtn);

  controlBar.appendChild(leftDiv);
  controlBar.appendChild(rightDiv);

  parentContainerEl.insertBefore(controlBar, parentContainerEl.firstChild);
}
window.renderTableControlBar = renderTableControlBar;

// 表示モードに基づいたUI表示の更新
function updateUIForCurrentMode() {
  if (!state.currentUser) return;
  const mode = state.currentUser.id;

  const switchContainer = document.getElementById('global-mode-switch-container');
  if (switchContainer) {
    const isLoginAdmin = (state.currentUser.loginId && state.currentUser.loginId.toLowerCase().includes('admin')) ||
                         (state.currentUser.id === 'admin');
    switchContainer.style.display = isLoginAdmin ? 'flex' : 'none';
  }
  
  // アポイントアコーディオンの表示制御
  const appointAccordion = document.getElementById('appoint-accordion');
  if (appointAccordion) {
    appointAccordion.style.display = 'block';
  }
  
  // メニューバー（サイドバー）の管理者用メニューを完全に排除（ホーム画面に集約するため、常に非表示にする）
  const formCustBtn = document.getElementById('menu-form-customize');
  const tableCreatBtn = document.getElementById('menu-table-creator');
  const permSettingsBtn = document.getElementById('menu-permission-settings');
  const auditLogBtn = document.getElementById('menu-audit-log');
  
  if (formCustBtn) formCustBtn.style.display = 'none';
  if (tableCreatBtn) tableCreatBtn.style.display = 'none';
  if (permSettingsBtn) permSettingsBtn.style.display = 'none';
  if (auditLogBtn) auditLogBtn.style.display = 'none';

  // ホーム画面の管理者専用コントロールパネルの表示制御
  const adminHomePanel = document.getElementById('admin-home-panel');
  if (adminHomePanel) {
    const isAdminMode = getCurrentUserId() === 'admin';
    adminHomePanel.style.display = isAdminMode ? 'flex' : 'none';
  }

  // 管理者メニューボタンの表示制御
  const agencyInfoBtn = document.getElementById('menu-agency-info');
  const joInfoBtn = document.getElementById('menu-jo-info');
  const applicantInfoBtn = document.getElementById('menu-applicant-info');
  const dbmakeBtn = document.getElementById('menu-dbmake');
  
  if (agencyInfoBtn) agencyInfoBtn.style.display = mode === 'support' ? 'none' : 'block';
  if (joInfoBtn) joInfoBtn.style.display = 'block';
  if (applicantInfoBtn) applicantInfoBtn.style.display = 'block';
  if (dbmakeBtn) dbmakeBtn.style.display = mode === 'admin' ? 'block' : 'none';
  
  // ヘッダーのモード切り替えボタンの更新
  const btnSales = document.getElementById('btn-mode-sales');
  const btnSupport = document.getElementById('btn-mode-support');
  const btnAdmin = document.getElementById('btn-mode-admin');
  if (btnSales && btnSupport && btnAdmin) {
    btnSales.classList.remove('active');
    btnSupport.classList.remove('active');
    btnAdmin.classList.remove('active');
    if (mode === 'sales') {
      btnSales.classList.add('active');
    } else if (mode === 'support') {
      btnSupport.classList.add('active');
    } else {
      btnAdmin.classList.add('active');
    }
  }
  renderCustomTableList();
  if (typeof window.syncMasterTableNamesWithFolders === 'function') {
    window.syncMasterTableNamesWithFolders();
  }
}

// ログインステータスのチェック
function checkLoginStatus() {
  const loggedUser = localStorage.getItem(STORAGE_KEYS.LOGGED_USER);
  if (loggedUser) {
    state.currentUser = JSON.parse(loggedUser);
    initDatabase();
    
    const nameEl = document.getElementById('logged-in-user-name');
    const avatarEl = document.getElementById('logged-in-user-avatar');
    if (nameEl) nameEl.textContent = state.currentUser.name;
    if (avatarEl) avatarEl.textContent = state.currentUser.name.charAt(0);
    
    // タブの初期化
    state.tabs = [];
    state.activeTabId = null;

    // サイドバーとトグルボタンの状態初期化
    const sidebarEl = document.getElementById('app-sidebar');
    const toggleBtn = document.getElementById('sidebar-toggle-btn');
    if (sidebarEl) sidebarEl.classList.remove('collapsed');
    if (toggleBtn) toggleBtn.textContent = '〈〈〈';

    // UI表示の更新
    updateUIForCurrentMode();
    removeRestrictedTabsForRole(state.currentUser.id);

    showLoginScreen(false);
    
    // リロード時・初期ロード時は一律でマイページ（ホーム画面）を初期表示する
    switchView('mypage-screen');

    // ズーム比率の復元・マイグレーション処理（画面全体のCSSズームは100%に戻し、レイアウト占有面積を60%にする設計に対応）
    const userId = state.currentUser ? state.currentUser.id : 'guest';
    const migrationKey = `SYNAPSE_ZOOM_MIGRATION_V100_RESTORE_LAYOUT_${userId}`;
    if (!localStorage.getItem(migrationKey)) {
      localStorage.setItem(`SYNAPSE_ZOOM_DEFAULT_${userId}`, '100');
      state.defaultZoomLevel = 100;

      // ローカルストレージ内の古い個別タブズーム情報もすべてクリアして100に統一する
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('SYNAPSE_ZOOM_') && !key.startsWith('SYNAPSE_ZOOM_DEFAULT_') && !key.includes('MIGRATION')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));

      localStorage.setItem(migrationKey, 'done');
      console.log("%c[Zoom Restoration]%c Restored default layout zoom level to 100% for user:", "color: #10b981; font-weight: bold;", "color: inherit;", userId);
      // 即時適用
      applyZoom(100);
    }
  } else {
    showLoginScreen(true);
  }
}

// ビュー（画面）切り替え
function switchView(viewId) {
  state.currentView = viewId;
  state.activeTabId = viewId;

  // 全ての画面ビューを非活性化し、指定されたビューのみアクティブ化
  const views = document.querySelectorAll('.screen-view');
  views.forEach(v => {
    if (v.id === viewId) {
      v.classList.add('active');
      v.style.display = 'block';
    } else {
      v.classList.remove('active');
      v.style.display = 'none';
    }
  });

  // サイドメニューのハイライト状態の更新
  const sidebarNavItems = document.querySelectorAll('.sidebar-nav .nav-item');
  sidebarNavItems.forEach(item => {
    if (item.dataset.tab === viewId) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // ズーム比率の適用
  const userId = state.currentUser ? state.currentUser.id : 'guest';
  const savedZoom = localStorage.getItem(`SYNAPSE_ZOOM_${viewId}_${userId}`) || localStorage.getItem(`SYNAPSE_ZOOM_DEFAULT_${userId}`) || '100';
  applyZoom(parseInt(savedZoom, 10));

  // 特定画面の初期化処理の呼び出し
  if (viewId === 'home-screen') {
    if (typeof openHomePage === 'function') openHomePage();
  } else if (viewId === 'mypage-screen') {
    if (typeof openMyPage === 'function') openMyPage();
  } else if (viewId === 'dbmake-screen') {
    if (typeof openDbmakePage === 'function') openDbmakePage();
  } else if (viewId === 'jo-info-screen') {
    if (typeof renderJoInfo === 'function') renderJoInfo();
  } else if (viewId === 'applicant-info-screen') {
    if (typeof renderApplicantInfo === 'function') renderApplicantInfo();
  } else if (viewId === 'agency-info-screen') {
    if (typeof renderAgencyInfo === 'function') renderAgencyInfo();
  } else if (viewId.startsWith('custom-table-')) {
    const tableId = viewId.replace('custom-table-', '');
    if (typeof renderCustomTable === 'function') renderCustomTable(tableId);
  }
}

// ==========================================
// 2. ビュー（画面）切り替え制御
// ==========================================
// ログイン状態とレイアウトの制御
function showLoginScreen(show) {
  const tabsOuter = document.getElementById('tabs-outer-wrapper');
  const sidebar = document.getElementById('app-sidebar');
  const toggleBtn = document.getElementById('sidebar-toggle-btn');
  const mainHeader = document.getElementById('main-header');
  const views = document.querySelectorAll('.screen-view');
  const login = document.getElementById('login-screen');

  views.forEach(v => {
    v.classList.remove('active');
    v.style.display = 'none';
  });

  if (show) {
    if (tabsOuter) tabsOuter.style.display = 'none';
    if (sidebar) sidebar.style.display = 'none';
    if (toggleBtn) toggleBtn.style.display = 'none';
    if (mainHeader) mainHeader.style.display = 'none';
    if (login) {
      login.classList.add('active');
      login.style.display = 'flex'; // インラインで明示的に表示
    }
    state.currentView = 'login-screen';
  } else {
    if (sidebar) sidebar.style.display = 'flex';
    if (toggleBtn) toggleBtn.style.display = 'flex';
    if (mainHeader) mainHeader.style.display = 'flex';
    if (login) {
      login.classList.remove('active');
      login.style.display = 'none'; // インラインで明示的に非表示
    }

    const userId = state.currentUser ? state.currentUser.id : 'guest';
    const savedDefaultZoom = localStorage.getItem(`SYNAPSE_ZOOM_DEFAULT_${userId}`);
    state.defaultZoomLevel = savedDefaultZoom ? parseInt(savedDefaultZoom, 10) : 100;
    
    if (state.tabs.length > 0 && state.activeTabId) {
      if (tabsOuter) tabsOuter.style.display = 'block';
      const activeTab = state.tabs.find(t => t.id === state.activeTabId);
      if (activeTab) {
        const activeView = document.getElementById(activeTab.type);
        if (activeView) {
          activeView.classList.add('active');
          activeView.style.display = 'block';
          applyZoom(activeTab.zoomLevel || 100);
        }
        state.currentView = activeTab.type;
      }
    } else {
      if (tabsOuter) tabsOuter.style.display = 'none';
      const homeScreen = document.getElementById('home-screen');
      if (homeScreen) {
        homeScreen.classList.add('active');
        homeScreen.style.display = 'block';
        applyZoom(state.defaultZoomLevel);
      }
      state.currentView = 'home-screen';
    }
  }
}

// 画面表示ズーム倍率の適用と状態の保存（50%〜150%）
function applyZoom(level) {
  const sanitizedLevel = Math.max(50, Math.min(150, level));
  const userId = state.currentUser ? state.currentUser.id : 'guest';

  if (state.activeTabId) {
    const tab = state.tabs.find(t => t.id === state.activeTabId);
    if (tab) {
      tab.zoomLevel = sanitizedLevel;
      localStorage.setItem(`SYNAPSE_ZOOM_${tab.id}_${userId}`, sanitizedLevel);
    }
  } else {
    state.defaultZoomLevel = sanitizedLevel;
    localStorage.setItem(`SYNAPSE_ZOOM_DEFAULT_${userId}`, sanitizedLevel);
  }

  // ズームコントロールラベルの更新
  const label = document.getElementById('zoom-level-label');
  if (label) label.textContent = sanitizedLevel + '%';

  // アプリ全体レイアウト (.app-layout) に対してズームを適用し、サイドバー、ヘッダー、コンテンツがすべて同調するようにする
  const appLayout = document.querySelector('.app-layout');
  if (appLayout) {
    appLayout.style.zoom = sanitizedLevel + '%';
  }
}

// ホーム画面を開く（タブは作成せず、単に画面を切り替えてタブの選択を解除する）
function openHomePage() {
  if (state.activeTabId) {
    const currentTab = state.tabs.find(t => t.id === state.activeTabId);
    if (currentTab) saveTabState(currentTab);
  }
  
  state.activeTabId = null;
  state.currentView = 'home-screen';
  renderTabBar();
}

// マイページ画面を開く（タブは作成せず、単に画面を切り替えてタブの選択を解除する）
function openMyPage() {
  if (state.activeTabId) {
    const currentTab = state.tabs.find(t => t.id === state.activeTabId);
    saveTabState(currentTab);
  }
  
  state.activeTabId = null;

  const views = document.querySelectorAll('.screen-view');
  views.forEach(v => v.classList.remove('active'));
  
  const mypage = document.getElementById('mypage-screen');
  if (mypage) {
    mypage.classList.add('active');
    applyZoom(state.defaultZoomLevel || 100);
  }
  
  state.currentView = 'mypage-screen';
  renderTabBar();
}

// フォームに入力されている現在の状態をアクティブなタブに退避
function saveTabState(tab) {
  if (!tab || tab.type !== 'appointment-screen') return;

  const dateVal = document.getElementById('appoint-date').value;
  const nameVal = document.getElementById('customer-name').value.trim();
  const memoVal = document.getElementById('appoint-memo').value.trim();

  const customFieldsData = {};
  state.addedCustomFields.forEach(fieldType => {
    if (fieldType === 'corp_info') {
      customFieldsData['corp_info'] = {
        name: document.getElementById('corp-info-name')?.value.trim() || '',
        code: document.getElementById('corp-info-code')?.value.trim() || '',
        address: document.getElementById('corp-info-address')?.value.trim() || ''
      };
    } else if (fieldType === 'introducer') {
      customFieldsData['introducer'] = state.selectedIntroducer;
    } else {
      const inputEl = document.getElementById(`custom-field-input-${fieldType}`);
      if (inputEl) {
        customFieldsData[fieldType] = inputEl.value.trim();
      }
    }
  });

  tab.appointData = {
    id: state.editingAppointId,
    date: dateVal,
    customerType: state.formMode,
    customerId: state.selectedExistingCustomer ? state.selectedExistingCustomer.id : null,
    customerName: nameVal,
    memo: memoVal,
    customFields: customFieldsData,
    connectedLinks: state.connectedLinks || {}, // 現在の接続状況を保存
    selectedExistingCustomer: state.selectedExistingCustomer,
    addedCustomFields: Array.from(state.addedCustomFields),
    selectedIntroducer: state.selectedIntroducer,
    status: tab.appointData.status,
    viewOnly: tab.appointData.viewOnly,
    isFormDirty: state.isFormDirty
  };
}

// 指定したタブのデータをアポイント登録フォームに復元
function loadTabState(tab) {
  // フォームのクリアと初期化
  document.getElementById('appointment-form').reset();
  document.getElementById('custom-fields-list').innerHTML = '';
  state.addedCustomFields.clear();
  state.selectedIntroducer = null;
  state.selectedExistingCustomer = null;
  state.editingAppointId = null;
  state.connectedLinks = {}; // 接続情報の初期化

  if (tab.type !== 'appointment-screen') return;

  const data = tab.appointData;
  state.editingAppointId = data.id;
  state.connectedLinks = data.connectedLinks || {}; // 接続情報を復元
  document.getElementById('display-appoint-id').textContent = data.id;

  // 表示タイトルとボタン設定
  const isViewOnly = data.viewOnly || data.status === 'official' || data.status === 'cancelled';
  document.getElementById('appointment-screen-title').textContent = data.viewOnly ? 'アポイント詳細閲覧' : (data.customerType === 'new' ? '新規アポイント登録' : '既存アポイント登録');
  document.getElementById('delete-draft-btn').style.display = (data.viewOnly || data.status !== 'draft') ? 'none' : 'inline-flex';
  document.getElementById('related-data-alert').style.display = 'none';

  const saveBtn = document.getElementById('btn-save-draft');
  const submitBtn = document.getElementById('btn-submit-official');
  if (saveBtn) saveBtn.style.display = isViewOnly ? 'none' : 'inline-flex';
  if (submitBtn) submitBtn.style.display = isViewOnly ? 'none' : 'inline-flex';

  // 基本入力項目の復元と編集可否制御
  document.getElementById('appoint-date').value = data.date || '';
  document.getElementById('appoint-date').readOnly = isViewOnly;
  document.getElementById('appoint-memo').value = data.memo || '';
  document.getElementById('appoint-memo').readOnly = isViewOnly;

  const toggleContainer = document.getElementById('appointment-type-toggle-container');
  if (toggleContainer) {
    toggleContainer.style.display = 'none'; // トグルコンテナは常に非表示
  }

  state.formMode = data.customerType;
  const selectArea = document.getElementById('top-customer-select-area');
  const selectCustBtn = document.getElementById('btn-select-existing-cust');
  if (selectCustBtn) {
    selectCustBtn.disabled = isViewOnly;
  }

  const form = document.getElementById('appointment-form');
  const nameGroup = document.getElementById('customer-name-group');
  const nameInput = document.getElementById('customer-name');

  if (data.customerType === 'new') {
    if (selectArea) selectArea.style.display = 'none';
    if (form) form.style.display = 'block';
    if (nameGroup) nameGroup.style.display = 'block';
    if (nameInput) nameInput.required = true; // 新規顧客時は required
    selectCustomer(null);
    if (nameInput) {
      nameInput.value = data.customerName || '';
      nameInput.readOnly = isViewOnly;
    }
    
    // 新規アポイント登録画面で、まだ追加項目が設定されていない初期状態の場合、
    // フリガナ、電話番号、メールアドレスを自動的に追加する
    if (!isViewOnly && (!data.addedCustomFields || data.addedCustomFields.length === 0)) {
      data.addedCustomFields = ['furigana', 'phone', 'email'];
      data.customFields = data.customFields || {};
      data.customFields.furigana = data.customFields.furigana || '';
      data.customFields.phone = data.customFields.phone || '';
      data.customFields.email = data.customFields.email || '';
    }
  } else {
    if (selectArea) selectArea.style.display = isViewOnly ? 'none' : 'flex';
    if (nameGroup) nameGroup.style.display = 'none';
    if (nameInput) nameInput.required = false; // 既存顧客時は required を解除
    selectCustomer(data.selectedExistingCustomer);
    
    if (!data.selectedExistingCustomer) {
      if (form) form.style.display = 'none';
    } else {
      if (form) form.style.display = 'block';
      if (nameInput) {
        nameInput.value = data.selectedExistingCustomer.name;
      }
    }

    const relatedInput = document.getElementById('ext-info-related-id');
    const searchRelatedBtn = document.getElementById('btn-search-related-id');
    const clearRelatedBtn = document.getElementById('btn-clear-related-id');
    if (relatedInput) {
      relatedInput.disabled = isViewOnly;
    }
    if (searchRelatedBtn) {
      searchRelatedBtn.style.display = isViewOnly ? 'none' : 'inline-block';
    }
    if (data.selectedExistingCustomer) {
      const searchResults = searchRelatedCrossTables(data.selectedExistingCustomer);
      renderConnectionPanel(searchResults, isViewOnly);
    }
  }

  // 追加項目の復元
  if (data.addedCustomFields) {
    data.addedCustomFields.forEach(fieldType => {
      addCustomField(fieldType, data.customFields[fieldType]);
    });
  }

  // チェックボックスの状態を現在の追加状況と同期し、ラベルを更新
  if (window.renderFieldCheckboxes) {
    window.renderFieldCheckboxes();
  }
  if (window.updateMultiselectLabel) {
    window.updateMultiselectLabel();
  }

  // 関連顧客ID (複数) のリンク表示復元 (顧客マスタから引き出して表示)
  if (window.renderRelatedCustomerIdLinks) {
    const customerObj = state.customers.find(c => c.id === data.customerId);
    const relatedCustomerIdVal = customerObj ? (customerObj.relatedCustomerId || '') : '';
    window.renderRelatedCustomerIdLinks(relatedCustomerIdVal, isViewOnly);
  }

  // 関連アポイントIDの表示復元
  if (window.renderRelatedAppointIdLinks) {
    window.renderRelatedAppointIdLinks(data.relatedAppointmentIds || '', isViewOnly);
  }

  // 閲覧モードの場合はすべての入力項目・カスタマイズを無効化
  const selectApplyPattern = document.getElementById('select-apply-pattern');
  const multiselectBox = document.getElementById('field-multiselect-box');
  const newPatternInput = document.getElementById('new-pattern-name');
  const savePatternBtn = document.getElementById('btn-save-custom-pattern');

  if (isViewOnly) {
    if (selectApplyPattern) selectApplyPattern.disabled = true;
    if (multiselectBox) {
      multiselectBox.style.pointerEvents = 'none';
      multiselectBox.style.opacity = '0.6';
    }
    if (newPatternInput) newPatternInput.disabled = true;
    if (savePatternBtn) savePatternBtn.disabled = true;

    document.getElementById('customer-name').readOnly = true;
    const inputs = document.querySelectorAll('#custom-fields-list input, #custom-fields-list textarea');
    inputs.forEach(input => {
      input.readOnly = true;
      input.disabled = true;
    });
    const deleteBtns = document.querySelectorAll('#custom-fields-list .btn-danger');
    deleteBtns.forEach(btn => btn.style.display = 'none');

    const changeCustomerBtn = document.getElementById('change-customer-btn');
    if (changeCustomerBtn) changeCustomerBtn.style.display = 'none';

    const removeIntroBtn = document.getElementById('btn-remove-introducer');
    if (removeIntroBtn) removeIntroBtn.style.display = 'none';
  } else {
    if (selectApplyPattern) selectApplyPattern.disabled = false;
    if (multiselectBox) {
      multiselectBox.style.pointerEvents = 'auto';
      multiselectBox.style.opacity = '1';
    }
    if (newPatternInput) newPatternInput.disabled = false;
    if (savePatternBtn) savePatternBtn.disabled = false;

    const changeCustomerBtn = document.getElementById('change-customer-btn');
    if (changeCustomerBtn) changeCustomerBtn.style.display = 'inline-flex';
  }

  // ステータスバッジの更新
  const statusEl = document.getElementById('display-appoint-status');
  if (statusEl) {
    if (data.status === 'draft') {
      statusEl.textContent = '下書き';
      statusEl.className = 'badge badge-draft';
      statusEl.style = '';
    } else if (data.status === 'official') {
      statusEl.textContent = '正式登録';
      statusEl.className = 'badge badge-official';
      statusEl.style = '';
    } else if (data.status === 'cancelled') {
      statusEl.textContent = '破棄済';
      statusEl.className = 'badge';
      statusEl.style.background = 'rgba(239, 68, 68, 0.15)';
      statusEl.style.color = 'var(--danger)';
      statusEl.style.border = '1px solid rgba(239, 68, 68, 0.3)';
    }
  }

  state.isFormDirty = data.isFormDirty || false;
  updateDbTabs();
}
// 顧客詳細タブを新規タブとして起動する関数
function openCustomerDetailTab(customerId) {
  if (!customerId) return;
  
  const tabId = `customer-detail-${customerId}`;
  const tabTitle = `顧客詳細: ${customerId}`;
  
  const existingTab = state.tabs.find(t => t.id === tabId);
  if (existingTab) {
    openTab(tabId, 'customer-detail-template-view', tabTitle);
    renderCustomerDetailView(customerId);
    return;
  }
  
  // 新規タブ追加
  const newTab = {
    id: tabId,
    type: 'customer-detail-template-view',
    title: tabTitle,
    customerDetailId: customerId
  };
  
  // 現在アクティブなタブの状態をセーブ
  if (state.activeTabId) {
    const currentTab = state.tabs.find(t => t.id === state.activeTabId);
    saveTabState(currentTab);
  }
  
  state.tabs.push(newTab);
  
  // 画面の切り替えと描画
  openTab(tabId, 'customer-detail-template-view', tabTitle);
  renderCustomerDetailView(customerId);
}

// 4テーブル横断 顧客詳細マスタ表示レンダラー
function renderCustomerDetailView(customerId) {
  const parent = document.getElementById('customer-detail-template-view');
  if (!parent) return;

  let container = document.getElementById(`customer-detail-content-${customerId}`);
  if (!container) {
    container = document.createElement('div');
    container.id = `customer-detail-content-${customerId}`;
    container.className = 'customer-detail-content-wrapper';
    parent.appendChild(container);
  }

  parent.querySelectorAll('.customer-detail-content-wrapper').forEach(el => {
    el.style.display = el.id === `customer-detail-content-${customerId}` ? 'block' : 'none';
  });

  container.innerHTML = '';

  // 1. 各データベーステーブルから該当IDに紐づく情報を網羅的に収集
  const apRecords = state.apContracts ? state.apContracts.filter(r => (r.customerPersonalityId || r.customerId) === customerId) : [];
  const joRecords = state.joContracts ? state.joContracts.filter(r => (r.customerPersonalityId || r.customerId) === customerId) : [];
  const agentRecords = state.agentContracts ? state.agentContracts.filter(r => r.customerPersonalityId === customerId) : [];
  const partnerRecords = (typeof dbmakePartners !== 'undefined' && dbmakePartners) ? dbmakePartners.filter(r => (r.customerPersonalityId || r.id) === customerId) : [];

  let name = '（氏名未設定）';
  let furigana = '';
  let phone = '未設定';
  let email = '未設定';
  let address = '未設定';

  const customerMaster = state.customers.find(c => c.id === customerId);
  if (customerMaster && customerMaster.address) {
    address = customerMaster.address;
  }

  const firstRec = apRecords[0] || joRecords[0] || agentRecords[0] || partnerRecords[0];
  if (firstRec) {
    name = firstRec.name || firstRec.representative || firstRec.representativeName || firstRec.customerName || firstRec.registeredName || name;
    furigana = firstRec.furigana || firstRec.repFurigana || firstRec.representativeNameKana || furigana;
    phone = firstRec.phone || firstRec.tel || firstRec.phoneNumber || phone;
    email = firstRec.email || email;
    if (address === '未設定') {
      const ptAddr = firstRec.pref ? `${firstRec.pref}${firstRec.city || ''}${firstRec.addr1 || ''}${firstRec.addr2 || ''}` : '';
      address = firstRec.address || firstRec.repAddress || firstRec.location || ptAddr || address;
    }
  }

  const header = document.createElement('div');
  header.style.display = 'flex';
  header.style.alignItems = 'center';
  header.style.justifyContent = 'space-between';
  header.style.marginBottom = '2rem';
  header.style.borderBottom = '1px solid var(--border-color)';
  header.style.paddingBottom = '1rem';

  header.innerHTML = `
    <div>
      <div style="font-size: 0.85rem; color: var(--text-muted); font-weight: bold; margin-bottom: 0.25rem;">顧客ID: ${customerId}</div>
      <h1 style="margin: 0; font-size: 1.8rem; font-weight: 700; color: var(--text-primary);">
        ${name} <span style="font-size: 1rem; font-weight: normal; color: var(--text-secondary); margin-left: 0.5rem;">${furigana ? `(${furigana})` : ''}</span>
      </h1>
    </div>
    <span class="badge" style="background: rgba(26, 115, 232, 0.1); color: var(--primary); border: 1px solid rgba(26, 115, 232, 0.3); font-size: 0.85rem; padding: 0.35rem 0.75rem; font-weight: bold; border-radius: 20px;">
      本登録マスタ詳細
    </span>
  `;
  container.appendChild(header);

  const layout = document.createElement('div');
  layout.className = 'form-layout';
  layout.style.display = 'grid';
  layout.style.gridTemplateColumns = '320px 1fr';
  layout.style.gap = '1.5rem';

  const leftCol = document.createElement('div');
  leftCol.className = 'sidebar-panel';
  leftCol.style.width = '100%';
  leftCol.innerHTML = `
    <div class="sidebar-card" style="position: sticky; top: 1.5rem;">
      <h3 style="font-size: 1rem; font-weight: bold; margin-bottom: 1.2rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; color: var(--text-primary);">👤 基本プロフィール</h3>
      <div style="display: flex; flex-direction: column; gap: 0.8rem; font-size: 0.85rem;">
        <div>
          <span style="color: var(--text-muted); display: block; font-size: 0.75rem; margin-bottom: 0.15rem;">本登録顧客ID</span>
          <span style="font-family: monospace; font-weight: bold; color: var(--text-primary); font-size: 0.95rem;">${customerId}</span>
        </div>
        <div>
          <span style="color: var(--text-muted); display: block; font-size: 0.75rem; margin-bottom: 0.15rem;">電話番号</span>
          <span style="font-weight: bold; color: var(--text-primary);">${phone}</span>
        </div>
        <div>
          <span style="color: var(--text-muted); display: block; font-size: 0.75rem; margin-bottom: 0.15rem;">メールアドレス</span>
          <span style="font-weight: bold; color: var(--text-primary); word-break: break-all;">${email}</span>
        </div>
        <div>
          <span style="color: var(--text-muted); display: block; font-size: 0.75rem; margin-bottom: 0.15rem;">住所</span>
          <span style="color: var(--text-secondary);">${address}</span>
        </div>
      </div>
    </div>
  `;
  layout.appendChild(leftCol);

  const rightCol = document.createElement('div');
  rightCol.style.display = 'flex';
  rightCol.style.flexDirection = 'column';
  rightCol.style.gap = '1.5rem';

  const totalHits = apRecords.length + joRecords.length + agentRecords.length + partnerRecords.length;
  if (totalHits === 0) {
    const emptyCard = document.createElement('div');
    emptyCard.className = 'empty-state';
    emptyCard.style.padding = '3rem';
    emptyCard.style.background = 'var(--bg-surface-elevated)';
    emptyCard.style.borderRadius = 'var(--radius-md)';
    emptyCard.style.textAlign = 'center';
    emptyCard.innerHTML = `
      <span class="empty-state-icon" style="font-size: 2.5rem;">🔍</span>
      <p style="margin-top: 1rem; color: var(--text-secondary);">該当IDに紐づく申込者・JO・代理店・パートナーマスタレコードが見つかりませんでした。</p>
    `;
    rightCol.appendChild(emptyCard);
  } else {
    apRecords.forEach(ap => {
      const card = document.createElement('div');
      card.className = 'sidebar-card';
      card.style.borderLeft = '4px solid #1a73e8';
      card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">
          <h3 style="margin: 0; font-size: 1rem; color: var(--primary); display: flex; align-items: center; gap: 0.4rem;">📝 申込者マスタ情報</h3>
          <span class="badge badge-official" style="font-size: 0.7rem;">申込者契約</span>
        </div>
        <div style="display: grid; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; font-size: 0.85rem;">
          <div><span style="color: var(--text-muted); font-size: 0.75rem;">顧客番号</span><div style="font-weight: 600; font-family: monospace;">${ap.customerId || '未設定'}</div></div>
          <div><span style="color: var(--text-muted); font-size: 0.75rem;">申込コース</span><div style="font-weight: 600;">${ap.course || '未設定'}</div></div>
          <div><span style="color: var(--text-muted); font-size: 0.75rem;">ステータス</span><div style="font-weight: 600;">${ap.status || '本登録済み'}</div></div>
          <div><span style="color: var(--text-muted); font-size: 0.75rem;">登録日付</span><div>${ap.registeredDate || '未設定'}</div></div>
          <div style="grid-column: span 2;"><span style="color: var(--text-muted); font-size: 0.75rem;">備考</span><div style="color: var(--text-secondary);">${ap.memo || '（なし）'}</div></div>
        </div>
      `;
      rightCol.appendChild(card);
    });

    joRecords.forEach(jo => {
      const card = document.createElement('div');
      card.className = 'sidebar-card';
      card.style.borderLeft = '4px solid #34a853';
      card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">
          <h3 style="margin: 0; font-size: 1rem; color: #34a853; display: flex; align-items: center; gap: 0.4rem;">🏢 JOマスタ情報</h3>
          <span class="badge badge-success" style="font-size: 0.7rem;">JO契約</span>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; font-size: 0.85rem;">
          <div><span style="color: var(--text-muted); font-size: 0.75rem;">JO顧客番号</span><div style="font-weight: 600; font-family: monospace;">${jo.customerId || '未設定'}</div></div>
          <div><span style="color: var(--text-muted); font-size: 0.75rem;">法人名</span><div style="font-weight: 600;">${jo.corpName || '個人事業主/未設定'}</div></div>
          <div><span style="color: var(--text-muted); font-size: 0.75rem;">法人番号</span><div style="font-weight: 600; font-family: monospace;">${jo.corpNum || '未設定'}</div></div>
          <div><span style="color: var(--text-muted); font-size: 0.75rem;">代表者名</span><div style="font-weight: 600;">${jo.representative || '未設定'}</div></div>
          <div style="grid-column: span 2;"><span style="color: var(--text-muted); font-size: 0.75rem;">事業内容</span><div style="color: var(--text-secondary);">${jo.service || '未設定'}</div></div>
          <div style="grid-column: span 2;"><span style="color: var(--text-muted); font-size: 0.75rem;">法人所在地</span><div style="color: var(--text-secondary);">${jo.address || '未設定'}</div></div>
        </div>
      `;
      rightCol.appendChild(card);
    });

    agentRecords.forEach(ag => {
      const card = document.createElement('div');
      card.className = 'sidebar-card';
      card.style.borderLeft = '4px solid #f9ab00';
      card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">
          <h3 style="margin: 0; font-size: 1rem; color: #e37400; display: flex; align-items: center; gap: 0.4rem;">💼 代理店マスタ情報</h3>
          <span class="badge" style="font-size: 0.7rem; background: rgba(249, 171, 0, 0.1); color: #e37400; border: 1px solid rgba(249, 171, 0, 0.3);">代理店契約</span>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; font-size: 0.85rem;">
          <div><span style="color: var(--text-muted); font-size: 0.75rem;">代理店ランク</span><div style="font-weight: 600;">${ag.rank || '一般代理店'}</div></div>
          <div><span style="color: var(--text-muted); font-size: 0.75rem;">契約開始日</span><div style="font-weight: 600;">${ag.registeredDate || '未設定'}</div></div>
          <div><span style="color: var(--text-muted); font-size: 0.75rem;">紹介登録数</span><div style="font-weight: 600;">${ag.introductionsCount || 0} 件</div></div>
          <div style="grid-column: span 2;"><span style="color: var(--text-muted); font-size: 0.75rem;">備考</span><div style="color: var(--text-secondary);">${ag.memo || '（なし）'}</div></div>
        </div>
      `;
      rightCol.appendChild(card);
    });

    partnerRecords.forEach(pt => {
      const card = document.createElement('div');
      card.className = 'sidebar-card';
      card.style.borderLeft = '4px solid #ab34e8';
      const fullAddress = `${pt.pref || ''}${pt.city || ''}${pt.addr1 || ''}${pt.addr2 || ''}`;
      card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">
          <h3 style="margin: 0; font-size: 1rem; color: #ab34e8; display: flex; align-items: center; gap: 0.4rem;">🤝 パートナーマスタ情報</h3>
          <span class="badge" style="font-size: 0.7rem; background: rgba(171, 52, 232, 0.1); color: #ab34e8; border: 1px solid rgba(171, 52, 232, 0.3);">パートナー契約</span>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; font-size: 0.85rem;">
          <div><span style="color: var(--text-muted); font-size: 0.75rem;">パートナー法人名</span><div style="font-weight: 600;">${pt.registeredName || '未設定'}</div></div>
          <div><span style="color: var(--text-muted); font-size: 0.75rem;">代表者氏名</span><div style="font-weight: 600;">${pt.representativeName || '未設定'}</div></div>
          <div><span style="color: var(--text-muted); font-size: 0.75rem;">手数料プラン</span><div style="font-weight: 600;">${pt.reward || '未設定'}</div></div>
          <div><span style="color: var(--text-muted); font-size: 0.75rem;">ステータス</span><div style="font-weight: 600;">${pt.status || 'ACTIVE'}</div></div>
          <div><span style="color: var(--text-muted); font-size: 0.75rem;">登録日時</span><div>${pt.recordedAt ? pt.recordedAt.slice(0, 10) : '未設定'}</div></div>
          <div style="grid-column: span 2;"><span style="color: var(--text-muted); font-size: 0.75rem;">パートナー住所</span><div style="color: var(--text-secondary);">${fullAddress || '未設定'}</div></div>
          <div style="grid-column: span 2;"><span style="color: var(--text-muted); font-size: 0.75rem;">備考</span><div style="color: var(--text-secondary);">${pt.remarks || '（なし）'}</div></div>
        </div>
      `;
      rightCol.appendChild(card);
    });
  }

  // 6. 紐付けられたアポイント履歴の収集と表示
  const matchedAppoints = state.appointments ? state.appointments.filter(
    a => (a.customerId === customerId || (customerMaster && customerMaster.relatedCustomerId && customerMaster.relatedCustomerId.split(',').map(x => x.trim()).includes(a.customerId))) && a.status !== 'cancelled'
  ) : [];

  const appointCard = document.createElement('div');
  appointCard.className = 'sidebar-card';
  appointCard.style.borderLeft = '4px solid #17a2b8';

  let appointListHtml = '';
  if (matchedAppoints.length === 0) {
    appointListHtml = `<p style="color: var(--text-muted); font-size: 0.85rem; margin: 0.5rem 0 0 0;">紐付けられたアポイント履歴はありません。</p>`;
  } else {
    appointListHtml = `
      <div style="overflow-x: auto; margin-top: 0.5rem;">
        <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: left;">
          <thead>
            <tr style="border-bottom: 1px solid var(--border-color); color: var(--text-muted); font-size: 0.75rem;">
              <th style="padding: 0.5rem 0;">アポイントID</th>
              <th style="padding: 0.5rem 0;">日時</th>
              <th style="padding: 0.5rem 0;">ステータス</th>
              <th style="padding: 0.5rem 0;">メモ</th>
            </tr>
          </thead>
          <tbody>
            ${matchedAppoints.map(a => {
              let statusBadge = `<span class="badge" style="font-size: 0.65rem; background: rgba(52, 168, 83, 0.1); color: #34a853;">確定</span>`;
              if (a.status === 'draft') {
                statusBadge = `<span class="badge" style="font-size: 0.65rem; background: rgba(249, 171, 0, 0.1); color: #e37400; border: 1px solid rgba(249, 171, 0, 0.3);">下書き</span>`;
              }
              return `
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.03);">
                  <td style="padding: 0.6rem 0;">
                    <a href="#" class="appoint-detail-link" data-id="${a.id}" style="color: var(--primary); font-family: monospace; font-weight: bold; text-decoration: none;">${a.id}</a>
                  </td>
                  <td style="padding: 0.6rem 0; color: var(--text-secondary); white-space: nowrap;">${a.date.replace('T', ' ')}</td>
                  <td style="padding: 0.6rem 0;">${statusBadge}</td>
                  <td style="padding: 0.6rem 0; color: var(--text-muted); max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${a.memo || ''}">
                    ${a.memo || '（なし）'}
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  appointCard.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">
      <h3 style="margin: 0; font-size: 1rem; color: #17a2b8; display: flex; align-items: center; gap: 0.4rem;">📅 紐付けアポイント履歴</h3>
      <span class="badge" style="font-size: 0.7rem; background: rgba(23, 162, 184, 0.1); color: #17a2b8; border: 1px solid rgba(23, 162, 184, 0.3);">アポイント履歴</span>
    </div>
    ${appointListHtml}
  `;

  appointCard.querySelectorAll('.appoint-detail-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const apId = link.getAttribute('data-id');
      const appoint = state.appointments.find(x => x.id === apId);
      if (appoint) {
        openTab('appoint-' + apId, 'appointment-screen', `📅 アポイント (${apId})`, {
          ...appoint,
          viewOnly: false
        });
      }
    });
  });

  rightCol.appendChild(appointCard);

  layout.appendChild(rightCol);
  container.appendChild(layout);
}
function openTab(id, type, title, appointData = null) {
  // 動的マスタ名との同期
  if (['jo-info-screen', 'applicant-info-screen', 'agency-info-screen', 'dbmake-screen', 'dbmake'].includes(id)) {
    const tableId = id === 'dbmake-screen' ? 'dbmake' : id;
    const emoji = id === 'dbmake-screen' || id === 'dbmake' ? '🛢️ ' : '📊 ';
    const getTableName = window.getDynamicMasterTableName || getDynamicMasterTableName;
    title = emoji + getTableName(tableId);
  }

  let tab = state.tabs.find(t => t.id === id);
  if (tab) {
    // 既存タブも最新の動的タイトルに上書き
    tab.title = title;
  }

  if (!tab) {
    // 現在のタブの入力データを保存
    if (state.activeTabId) {
      const currentTab = state.tabs.find(t => t.id === state.activeTabId);
      saveTabState(currentTab);
    }

    // デフォルトのアポイントメントデータを作成
    const defaultAppointData = appointData || {
      id: generate8DigitId(),
      date: (() => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 16);
      })(),
      customerType: id === 'appointment-existing' ? 'existing' : 'new',
      customerId: null,
      customerName: '',
      memo: '',
      customFields: {},
      connectedLinks: {}, // 接続データを初期化
      addedCustomFields: [],
      selectedExistingCustomer: null,
      selectedIntroducer: null,
      status: 'draft',
      viewOnly: false,
      isFormDirty: false
    };

    // 新規の下書きアポイントレコードを登録DBにも登録（既存の下書き機能と互換）
    if (type === 'appointment-screen' && !appointData) {
      const isExistInAppoints = state.appointments.some(a => a.id === defaultAppointData.id);
      if (!isExistInAppoints) {
        state.appointments.push({
          id: defaultAppointData.id,
          date: defaultAppointData.date,
          customerType: defaultAppointData.customerType,
          customerId: null,
          customerName: '',
          memo: '',
          customFields: {},
          connectedLinks: {}, // 接続データを初期化
          status: 'draft',
          registeredAt: new Date().toISOString()
        });
        localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(state.appointments));
      }
    }

    const userId = state.currentUser ? state.currentUser.id : 'guest';
    const savedZoom = localStorage.getItem(`SYNAPSE_ZOOM_${id}_${userId}`);
    tab = {
      id: id,
      type: type,
      title: title,
      appointData: defaultAppointData,
      zoomLevel: savedZoom ? parseInt(savedZoom, 10) : 100
    };
    state.tabs.push(tab);
  } else {
    if (state.activeTabId === id) return;
    // 現在のタブの入力データを保存
    const currentTab = state.tabs.find(t => t.id === state.activeTabId);
    saveTabState(currentTab);
  }

  state.activeTabId = id;
  activateTab(id);
}

// タブを活性化して画面を切り替える
function activateTab(id) {
  const tab = state.tabs.find(t => t.id === id);
  if (!tab) return;

  state.activeTabId = id;

  const tabsOuter = document.getElementById('tabs-outer-wrapper');
  if (tabsOuter) tabsOuter.style.display = 'block';

  // タブの種類に応じた状態復元とデータ描画
  if (tab.type === 'appointment-screen') {
    loadTabState(tab);
  } else if (tab.type === 'drafts-view-screen') {
    renderAllDrafts();
  } else if (tab.type === 'history-view-screen') {
    renderAllHistory();
  } else if (tab.type === 'link-official-screen') {
    renderLinkOfficialScreen();
  } else if (tab.type === 'agency-info-screen') {
    renderAgColumnSelector();
    renderAgencyInfo();
  } else if (tab.type === 'jo-info-screen') {
    renderJoColumnSelector();
    renderJoInfo();
  } else if (tab.type === 'applicant-info-screen') {
    renderApColumnSelector();
    renderApplicantInfo();
  } else if (tab.type === 'customer-detail-template-view') {
    renderCustomerDetailView(tab.customerDetailId);
  } else if (tab.type === 'custom-table-screen') {
    const tableId = tab.id.replace('custom-table-', '');
    state.activeCustomTableId = tableId;
    renderCustomTable(tableId);
  } else if (tab.type === 'table-creator-screen') {
    state.activeCustomTableId = null;
  }

  // 画面表示切り替え
  const views = document.querySelectorAll('.screen-view');
  views.forEach(v => {
    if (v.id === tab.type) {
      v.classList.add('active');
      v.style.display = 'block';
      applyZoom(tab.zoomLevel || 100);
    } else {
      v.classList.remove('active');
      v.style.display = 'none';
    }
  });

  state.currentView = tab.type;
  renderTabBar();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// タブを閉じる
function closeTab(id, event) {
  if (event) event.stopPropagation();

  const tabIndex = state.tabs.findIndex(t => t.id === id);
  if (tabIndex === -1) return;

  const tab = state.tabs[tabIndex];

  // 未保存の下書き編集中の場合は確認ダイアログを表示
  if (tab.type === 'appointment-screen' && tab.appointData && tab.appointData.isFormDirty && tab.appointData.status === 'draft') {
    if (!confirm(`「${tab.title}」は保存されていません。このタブを閉じてもよろしいですか？`)) {
      return;
    }
  }

  let nextActiveTabId = null;
  if (state.activeTabId === id) {
    if (state.tabs.length > 1) {
      const nextIndex = tabIndex > 0 ? tabIndex - 1 : tabIndex + 1;
      nextActiveTabId = state.tabs[nextIndex].id;
    }
  } else {
    nextActiveTabId = state.activeTabId;
  }

  state.tabs.splice(tabIndex, 1);

  if (state.tabs.length === 0) {
    state.activeTabId = null;
    const tabsOuter = document.getElementById('tabs-outer-wrapper');
    if (tabsOuter) tabsOuter.style.display = 'none';

    // すべてのタブが閉じられたらホーム画面を表示
    const views = document.querySelectorAll('.screen-view');
    views.forEach(v => v.classList.remove('active'));
    const homeScreen = document.getElementById('home-screen');
    if (homeScreen) homeScreen.classList.add('active');
    
    state.currentView = 'home-screen';
  } else if (nextActiveTabId) {
    activateTab(nextActiveTabId);
  } else {
    renderTabBar();
  }
}

// タブバーの動的再描画
function renderTabBar() {
  const bar = document.getElementById('app-tabs-bar');
  if (!bar) return;

  bar.innerHTML = '';

  state.tabs.forEach(tab => {
    const tabDiv = document.createElement('div');
    tabDiv.className = `tab-item${tab.id === state.activeTabId ? ' active' : ''}`;
    if (tab.id === state.draggingTabId) {
      tabDiv.classList.add('dragging');
    }
    tabDiv.dataset.tabId = tab.id;
    tabDiv.draggable = true;

    tabDiv.addEventListener('dragstart', (e) => {
      state.draggingTabId = tab.id;
      tabDiv.classList.add('dragging');
      e.dataTransfer.setData('text/plain', tab.id);
      e.dataTransfer.effectAllowed = 'move';
    });

    tabDiv.addEventListener('dragover', (e) => {
      e.preventDefault();
      const draggingId = state.draggingTabId;
      if (!draggingId || draggingId === tab.id) return;

      const draggingIndex = state.tabs.findIndex(t => t.id === draggingId);
      const targetIndex = state.tabs.findIndex(t => t.id === tab.id);

      if (draggingIndex !== -1 && targetIndex !== -1) {
        const [draggedTab] = state.tabs.splice(draggingIndex, 1);
        state.tabs.splice(targetIndex, 0, draggedTab);
        renderTabBar();
      }
    });

    tabDiv.addEventListener('dragend', () => {
      tabDiv.classList.remove('dragging');
      state.draggingTabId = null;
      renderTabBar();
    });

    const titleSpan = document.createElement('span');
    titleSpan.textContent = tab.title;
    tabDiv.appendChild(titleSpan);

    const closeSpan = document.createElement('span');
    closeSpan.className = 'tab-close-btn';
    closeSpan.innerHTML = '&times;';
    closeSpan.addEventListener('click', (e) => closeTab(tab.id, e));
    tabDiv.appendChild(closeSpan);

    tabDiv.addEventListener('click', () => {
      activateTab(tab.id);
    });

    bar.appendChild(tabDiv);
  });

  // タブバー全体の表示・非表示を制御
  const tabsOuter = document.getElementById('tabs-outer-wrapper');
  if (tabsOuter) {
    tabsOuter.style.display = state.tabs.length > 0 ? 'block' : 'none';
  }

  // 左メニューのハイライト状態も連動して更新
  const sidebarNavItems = document.querySelectorAll('.sidebar-nav .nav-item');
  sidebarNavItems.forEach(item => {
    const tabId = item.dataset.tab;
    if (tabId === state.activeTabId || (state.activeTabId === null && tabId === 'mypage-screen' && state.currentView === 'mypage-screen')) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // 左アコーディオンの親項目のアクティブ表示制御
  const appointTabs = ['appointment-new', 'appointment-existing', 'drafts-view-screen', 'history-view-screen', 'link-official-screen'];
  const parentHeader = document.getElementById('menu-appoint-parent');
  if (parentHeader) {
    const isAppointTabActive = appointTabs.some(id => state.activeTabId === id) || 
                               (state.activeTabId && (state.activeTabId.startsWith('edit-') || state.activeTabId.startsWith('view-')));
    if (isAppointTabActive) {
      parentHeader.classList.add('active');
    } else {
      parentHeader.classList.remove('active');
    }
  }
}

// ==========================================
// 3. イベントリスナー定義
// ==========================================
function isScrollbarClick(e) {
  const wrapper = e.target.closest('.sticky-table-wrapper');
  if (!wrapper) return false;
  const rect = wrapper.getBoundingClientRect();
  // スクロールバーの幅/高さを想定し、その境界領域をクリックしたかチェック
  const isRightScrollbar = (e.clientX >= rect.left + wrapper.clientWidth) && (e.clientX <= rect.right);
  const isBottomScrollbar = (e.clientY >= rect.top + wrapper.clientHeight) && (e.clientY <= rect.bottom);
  return isRightScrollbar || isBottomScrollbar;
}

function clearAllSpreadsheetSelections() {
  // すべての画面の選択状態をクリア
  state.joSelectedCell = null;
  state.joSelectedRange = null;
  state.joSelectedRows.clear();
  state.joSelectedCols.clear();
  state.joSelectedCells.clear();
  state.joSelectedRow = null;
  state.joSelectedCol = null;
  state.joLastSelectedRow = null;
  state.joLastSelectedCol = null;

  state.apSelectedCell = null;
  state.apSelectedRange = null;
  state.apSelectedRows.clear();
  state.apSelectedCols.clear();
  state.apSelectedCells.clear();
  state.apSelectedRow = null;
  state.apSelectedCol = null;
  state.apLastSelectedRow = null;
  state.apLastSelectedCol = null;

  state.agSelectedCell = null;
  state.agSelectedRange = null;
  state.agSelectedRows.clear();
  state.agSelectedCols.clear();
  state.agSelectedCells.clear();
  state.agSelectedRow = null;
  state.agSelectedCol = null;
  state.agLastSelectedRow = null;
  state.agLastSelectedCol = null;

  state.dbmakeSelectedCell = null;
  state.dbmakeSelectedRange = null;
  state.dbmakeSelectedRows.clear();
  state.dbmakeSelectedCols.clear();
  state.dbmakeSelectedCells.clear();
  state.dbmakeSelectedRow = null;
  state.dbmakeSelectedCol = null;
  state.dbmakeLastSelectedRow = null;
  state.dbmakeLastSelectedCol = null;

  state.ctSelectedCell = null;
  state.ctSelectedRange = null;
  state.ctSelectedRows.clear();
  state.ctSelectedCols.clear();
  state.ctSelectedCells.clear();
  state.ctLastSelectedRow = null;
  state.ctLastSelectedCol = null;

  // 現在表示中のアクティブなタブがある場合、再描画
  if (state.activeTabId) {
    const activeTab = state.tabs.find(t => t.id === state.activeTabId);
    if (activeTab) {
      if (activeTab.type === 'jo-info-screen') {
        renderJoInfo();
        syncJoFormatToolbar();
      } else if (activeTab.type === 'applicant-info-screen') {
        renderApplicantInfo();
        syncApFormatToolbar();
      } else if (activeTab.type === 'agency-info-screen') {
        renderAgencyInfo();
        syncAgFormatToolbar();
      } else if (activeTab.type === 'dbmake-screen') {
        renderDbmakePartners();
        syncDbmakeFormatToolbar();
      } else if (activeTab.type === 'custom-table-screen') {
        if (state.activeCustomTableId) {
          renderCustomTable(state.activeCustomTableId);
          syncCustomTableFormatToolbar();
        }
      }
    }
  }

  // 選択統計ウィジェットの更新
  updateSelectionStatsWidget();
}

function setupEventListeners() {
  document.addEventListener('mousedown', (e) => {
    // スクロールバーをクリックした場合は選択を保持
    if (isScrollbarClick(e)) {
      return;
    }

    // 以下の要素、またはその内部をクリックした場合は、選択を保持する（解除しない）
    const keepSelection = e.target.closest('.spreadsheet-table') || 
                          e.target.closest('#dbmake-spreadsheet-table') ||
                          e.target.closest('.format-toolbar') || 
                          e.target.closest('#dbmake-format-toolbar') || 
                          e.target.closest('#custom-table-format-toolbar') || 
                          e.target.closest('#selection-stats-widget') || 
                          e.target.closest('.filter-menu-pop') || 
                          e.target.closest('.context-menu') || 
                          e.target.closest('.dropdown-menu') || 
                          e.target.closest('.modal') || 
                          e.target.closest('.toast') ||
                          e.target.closest('.grant-row-btn') ||
                          e.target.closest('.grant-col-btn') ||
                          e.target.closest('.grant-table-btn') ||
                          e.target.closest('.column-selector-pop') || 
                          e.target.closest('.ag-column-selector-pop') || 
                          e.target.closest('.cf-setting-menu') ||
                          e.target.closest('.toast-notification') ||
                          e.target.closest('#table-search-overlay') ||
                          e.target.closest('#validation-sidebar') ||
                          e.target.closest('#validation-color-palette') ||
                          e.target.closest('input') ||
                          e.target.closest('select') ||
                          e.target.closest('button') ||
                          e.target.closest('.btn');

    if (keepSelection) {
      return; // 選択をクリアしない
    }

    clearAllSpreadsheetSelections();
  });

  document.addEventListener('mouseup', () => {
    state.isSelecting = false;
    state.isSelectingRows = false;
    state.isSelectingCols = false;
  });

  // ロゴクリックでホーム画面へ
  const logoBtn = document.getElementById('sidebar-logo-btn');
  if (logoBtn) {
    logoBtn.addEventListener('click', (e) => {
      switchView('home-screen');
    });
  }

  // 接続データベース詳細タブ切り替え
  document.querySelector('.ext-db-tab-buttons-row')?.addEventListener('click', (e) => {
    const btn = e.target.closest('.db-tab-btn');
    if (!btn) return;
    
    // 全て非表示
    document.querySelectorAll('.db-tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.db-tab-panel').forEach(p => p.style.display = 'none');
    
    // 選択されたタブをアクティブ化
    btn.classList.add('active');
    const panelId = `db-panel-${btn.dataset.dbTab}`;
    const panel = document.getElementById(panelId);
    if (panel) panel.style.display = 'block';
  });

  // 固定タブのクリックイベント登録
  document.querySelectorAll('.tab-item').forEach(tab => {
    tab.addEventListener('click', () => {
      switchView(tab.dataset.tab);
    });
  });

  // 左サイドメニューの各ボタンのクリックイベント登録
  const sidebarButtons = [
    { id: 'menu-mypage', tab: 'mypage-screen' },
    { id: 'menu-new-appoint', tab: 'appointment-new' },
    { id: 'menu-existing-appoint', tab: 'appointment-existing' },
    { id: 'menu-drafts-list', tab: 'drafts-view-screen' },
    { id: 'menu-history-list', tab: 'history-view-screen' },
    { id: 'menu-link-official', tab: 'link-official-screen' },
    { id: 'menu-agency-info', tab: 'agency-info-screen' },
    { id: 'menu-jo-info', tab: 'jo-info-screen' },
    { id: 'menu-applicant-info', tab: 'applicant-info-screen' },
    { id: 'menu-dbmake', tab: 'dbmake-screen' },
    { id: 'menu-form-customize', tab: 'form-customize-screen' },
    { id: 'menu-table-creator', tab: 'table-creator-screen' }
  ];

  sidebarButtons.forEach(btn => {
    const el = document.getElementById(btn.id);
    if (el) {
      el.addEventListener('click', () => {
        if (btn.tab === 'mypage-screen') {
          openMyPage();
          return;
        }
        if (btn.tab === 'dbmake-screen') {
          openDbmakePage();
          return;
        }

        let title = '';
        let type = '';
        if (btn.tab === 'appointment-new') {
          title = '新規アポイント';
          type = 'appointment-screen';
        } else if (btn.tab === 'appointment-existing') {
          title = '既存顧客アポイント';
          type = 'appointment-screen';
        } else if (btn.tab === 'drafts-view-screen') {
          title = '一時保存一覧';
          type = 'drafts-view-screen';
        } else if (btn.tab === 'history-view-screen') {
          title = 'アポイント履歴';
          type = 'history-view-screen';
        } else if (btn.tab === 'link-official-screen') {
          title = '本登録ID紐付け';
          type = 'link-official-screen';
        } else if (btn.tab === 'agency-info-screen') {
          title = '📊 代理店・基本マスタ';
          type = 'agency-info-screen';
        } else if (btn.tab === 'jo-info-screen') {
          title = '📊 JO・基本マスタ';
          type = 'jo-info-screen';
        } else if (btn.tab === 'applicant-info-screen') {
          title = '📊 申込者・基本マスタ';
          type = 'applicant-info-screen';
        } else if (btn.tab === 'form-customize-screen') {
          title = 'フォーム作成';
          type = 'form-customize-screen';
        } else if (btn.tab === 'table-creator-screen') {
          title = 'テーブル作成';
          type = 'table-creator-screen';
        }
        openTab(btn.tab, type, title);
      });
    }
  });

  // 左サイドメニューのアコーディオン開閉イベント登録
  const accordionHeader = document.getElementById('menu-appoint-parent');
  const accordionContent = document.getElementById('menu-appoint-content');
  if (accordionHeader && accordionContent) {
    accordionHeader.addEventListener('click', () => {
      accordionHeader.classList.toggle('collapsed');
      accordionContent.classList.toggle('collapsed');
    });
  }

  const customAccordionHeader = document.getElementById('menu-custom-tables-parent');
  const customAccordionContent = document.getElementById('menu-custom-tables-content');
  if (customAccordionHeader && customAccordionContent) {
    customAccordionHeader.addEventListener('click', () => {
      customAccordionHeader.classList.toggle('collapsed');
      const isHidden = customAccordionContent.style.display === 'none' || !customAccordionContent.style.display;
      customAccordionContent.style.display = isHidden ? 'flex' : 'none';
    });
  }

  // 代理店アコーディオン
  const agAccordionHeader = document.getElementById('menu-agency-parent');
  const agAccordionContent = document.getElementById('menu-agency-content');
  if (agAccordionHeader && agAccordionContent) {
    agAccordionHeader.addEventListener('click', () => {
      agAccordionHeader.classList.toggle('collapsed');
      const isHidden = agAccordionContent.style.display === 'none' || !agAccordionContent.style.display;
      agAccordionContent.style.display = isHidden ? 'flex' : 'none';
    });
  }

  // JOアコーディオン
  const joAccordionHeader = document.getElementById('menu-jo-parent');
  const joAccordionContent = document.getElementById('menu-jo-content');
  if (joAccordionHeader && joAccordionContent) {
    joAccordionHeader.addEventListener('click', () => {
      joAccordionHeader.classList.toggle('collapsed');
      const isHidden = joAccordionContent.style.display === 'none' || !joAccordionContent.style.display;
      joAccordionContent.style.display = isHidden ? 'flex' : 'none';
    });
  }

  // 申込者アコーディオン
  const apAccordionHeader = document.getElementById('menu-applicant-parent');
  const apAccordionContent = document.getElementById('menu-applicant-content');
  if (apAccordionHeader && apAccordionContent) {
    apAccordionHeader.addEventListener('click', () => {
      apAccordionHeader.classList.toggle('collapsed');
      const isHidden = apAccordionContent.style.display === 'none' || !apAccordionContent.style.display;
      apAccordionContent.style.display = isHidden ? 'flex' : 'none';
    });
  }

  // ロゴクリックでホーム画面に戻る
  const logo = document.querySelector('.logo-section');
  if (logo) {
    logo.style.cursor = 'pointer';
    logo.addEventListener('click', () => {
      if (state.currentUser) {
        if (state.activeTabId) {
          const currentTab = state.tabs.find(t => t.id === state.activeTabId);
          saveTabState(currentTab);
        }
        state.activeTabId = null;
        showLoginScreen(false);
      }
    });
  }



  // 表示モード切り替えボタンのイベント登録
  const btnSales = document.getElementById('btn-mode-sales');
  const btnSupport = document.getElementById('btn-mode-support');
  const btnAdmin = document.getElementById('btn-mode-admin');
  if (btnSales) {
    btnSales.addEventListener('click', () => changeUserMode('sales'));
  }
  if (btnSupport) {
    btnSupport.addEventListener('click', () => changeUserMode('support'));
  }
  if (btnAdmin) {
    btnAdmin.addEventListener('click', () => changeUserMode('admin'));
  }

  // ログイン・ログアウト
  document.getElementById('login-form').addEventListener('submit', handleLogin);
  document.getElementById('logout-btn').addEventListener('click', handleLogout);

  // テーマ切り替え
  const themeSelector = document.getElementById('theme-selector');
  if (themeSelector) {
    themeSelector.addEventListener('change', (e) => {
      const theme = e.target.value;
      applyTheme(theme);
      const userId = state.currentUser ? state.currentUser.id : 'guest';
      localStorage.setItem(`SYNAPSE_THEME_${userId}`, theme);
    });
  }

  // 色味調整
  const hueSlider = document.getElementById('hue-slider');
  const satSlider = document.getElementById('saturation-slider');
  if (hueSlider && satSlider) {
    hueSlider.addEventListener('input', (e) => {
      applyColorTone(e.target.value, satSlider.value);
    });
    hueSlider.addEventListener('change', (e) => {
      const userId = state.currentUser ? state.currentUser.id : 'guest';
      localStorage.setItem(`SYNAPSE_HUE_${userId}`, e.target.value);
    });

    satSlider.addEventListener('input', (e) => {
      applyColorTone(hueSlider.value, e.target.value);
    });
    satSlider.addEventListener('change', (e) => {
      const userId = state.currentUser ? state.currentUser.id : 'guest';
      localStorage.setItem(`SYNAPSE_SATURATION_${userId}`, e.target.value);
    });
  }

  // Supabase接続保存 & 同期ボタン
  const saveSupabaseBtn = document.getElementById('btn-save-supabase');
  if (saveSupabaseBtn) {
    saveSupabaseBtn.addEventListener('click', async () => {
      const urlInput = document.getElementById('supabase-url');
      const keyInput = document.getElementById('supabase-anon-key');
      if (!urlInput || !keyInput) return;

      const url = urlInput.value.trim();
      const key = keyInput.value.trim();

      if (!url || !key) {
        showToast("URLとAnon Keyの両方を入力してください。", "error");
        return;
      }

      // ローカルストレージに保存
      localStorage.setItem(STORAGE_KEYS.SUPABASE_URL, url);
      localStorage.setItem(STORAGE_KEYS.SUPABASE_ANON_KEY, key);

      showToast("接続設定を保存しました。接続テスト中...", "info");

      // Supabaseの再初期化
      if (initSupabase()) {
        // クラウドからの同期をトリガー
        await syncFromSupabase(true);
      } else {
        showToast("Supabaseの初期化に失敗しました。URLまたはキーが不正です。", "error");
      }
    });
  }

  // マイページカードのクリックアクション
  document.getElementById('card-new-appoint').addEventListener('click', () => {
    openTab('appointment-new', 'appointment-screen', '新規アポイント');
  });
  document.getElementById('card-existing-appoint').addEventListener('click', () => {
    openTab('appointment-existing', 'appointment-screen', '既存顧客アポイント');
  });
  document.getElementById('card-drafts-list').addEventListener('click', () => {
    openTab('drafts-view-screen', 'drafts-view-screen', '一時保存一覧');
  });
  document.getElementById('card-history-list').addEventListener('click', () => {
    openTab('history-view-screen', 'history-view-screen', 'アポイント履歴');
  });
  document.getElementById('card-link-official').addEventListener('click', () => {
    openTab('link-official-screen', 'link-official-screen', '本登録ID紐付け');
  });

  // ダッシュボード内「すべて見る」リンク
  document.getElementById('view-all-drafts-btn').addEventListener('click', () => {
    openTab('drafts-view-screen', 'drafts-view-screen', '一時保存一覧');
  });
  document.getElementById('view-all-history-btn').addEventListener('click', () => {
    openTab('history-view-screen', 'history-view-screen', 'アポイント履歴');
  });

  // 顧客判定トグル（新規・既存）
  document.getElementById('toggle-cust-new').addEventListener('click', () => setFormMode('new'));
  document.getElementById('toggle-cust-existing').addEventListener('click', () => {
    if (state.selectedExistingCustomer) {
      setFormMode('existing');
    } else {
      openCustomerSearchModal();
    }
  });

  // 既存顧客変更ボタン
  document.getElementById('change-customer-btn').addEventListener('click', () => {
    targetSearchMode = 'main';
    openCustomerSearchModal();
  });

  // 8桁の英数字IDのみを入力制限するバリデーションフィルター
  function setupIdInputFilter(inputEl) {
    if (!inputEl) return;
    inputEl.addEventListener('input', (e) => {
      let val = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
      if (val.length > 8) {
        val = val.substring(0, 8);
      }
      e.target.value = val;
    });
  }

  // その他関連するID (複数顧客ID・チップ追加＋「×」削除ボタン対応版)
  window.renderRelatedCustomerIdLinks = function(valString, isViewOnly) {
    const container = document.getElementById('ext-info-related-id-link-container');
    if (!container) return;
    container.innerHTML = '';

    const ids = valString 
      ? valString.split(',').map(id => id.trim()).filter(id => id !== '')
      : [];

    // 1. 各関連顧客IDチップのレンダリング
    ids.forEach(id => {
      const chip = document.createElement('div');
      chip.className = 'id-chip';
      chip.style.display = 'inline-flex';
      chip.style.alignItems = 'center';
      chip.style.gap = '0.3rem';
      chip.style.background = 'rgba(26, 115, 232, 0.08)';
      chip.style.border = '1px solid rgba(26, 115, 232, 0.2)';
      chip.style.padding = '0.2rem 0.5rem';
      chip.style.borderRadius = '20px';
      chip.style.fontSize = '0.85rem';
      chip.style.fontFamily = 'monospace';

      const link = document.createElement('a');
      link.href = '#';
      link.style.color = 'var(--primary)';
      link.style.fontWeight = 'bold';
      link.style.textDecoration = 'none';
      link.textContent = id;
      link.addEventListener('click', (e) => {
        e.preventDefault();
        openCustomerDetailTab(id);
      });
      chip.appendChild(link);

      if (!isViewOnly) {
        const deleteBtn = document.createElement('span');
        deleteBtn.textContent = '×';
        deleteBtn.style.color = 'var(--text-muted)';
        deleteBtn.style.cursor = 'pointer';
        deleteBtn.style.fontWeight = 'bold';
        deleteBtn.style.marginLeft = '0.2rem';
        deleteBtn.addEventListener('click', () => {
          const updatedIds = ids.filter(x => x !== id);
          const newValString = updatedIds.join(', ');
          
          if (state.selectedExistingCustomer && state.selectedExistingCustomer.id) {
            syncBiDirectionalRelatedCustomerId(state.selectedExistingCustomer.id, newValString);
          }
          window.renderRelatedCustomerIdLinks(newValString, isViewOnly);
        });
        chip.appendChild(deleteBtn);
      }

      container.appendChild(chip);
    });

    // 2. 「＋ 関連IDを追加」ボタンの配置
    if (!isViewOnly) {
      const addBtn = document.createElement('button');
      addBtn.type = 'button';
      addBtn.className = 'btn-text';
      addBtn.style.fontSize = '0.8rem';
      addBtn.style.padding = '0.2rem 0.5rem';
      addBtn.style.border = '1px dashed var(--primary)';
      addBtn.style.borderRadius = '20px';
      addBtn.style.background = 'transparent';
      addBtn.style.color = 'var(--primary)';
      addBtn.style.cursor = 'pointer';
      addBtn.textContent = '＋ 関連IDを追加';

      addBtn.addEventListener('click', () => {
        container.removeChild(addBtn);

        const inputGroup = document.createElement('div');
        inputGroup.style.display = 'inline-flex';
        inputGroup.style.alignItems = 'center';
        inputGroup.style.gap = '0.25rem';

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = '8桁ID';
        input.style.width = '80px';
        input.style.padding = '0.15rem 0.4rem';
        input.style.fontSize = '0.8rem';
        input.style.fontFamily = 'monospace';
        input.style.border = '1px solid var(--primary)';
        input.style.borderRadius = 'var(--radius-sm)';
        input.style.background = 'var(--bg-surface)';
        input.style.color = 'var(--text-primary)';
        
        setupIdInputFilter(input);

        const confirmBtn = document.createElement('button');
        confirmBtn.type = 'button';
        confirmBtn.className = 'btn-success';
        confirmBtn.style.padding = '0.15rem 0.4rem';
        confirmBtn.style.fontSize = '0.75rem';
        confirmBtn.textContent = '追加';

        const cancelBtn = document.createElement('button');
        cancelBtn.type = 'button';
        cancelBtn.className = 'btn-secondary';
        cancelBtn.style.padding = '0.15rem 0.4rem';
        cancelBtn.style.fontSize = '0.75rem';
        cancelBtn.textContent = '取消';

        const handleAdd = () => {
          const newId = input.value.trim();
          if (newId.length !== 8) {
            showToast('関連IDは8桁の英数字で入力してください。', 'warning');
            return;
          }
          if (ids.includes(newId)) {
            showToast('このIDはすでに関連付けされています。', 'warning');
            return;
          }

          ids.push(newId);
          const newValString = ids.join(', ');

          if (state.selectedExistingCustomer && state.selectedExistingCustomer.id) {
            syncBiDirectionalRelatedCustomerId(state.selectedExistingCustomer.id, newValString);
          }
          window.renderRelatedCustomerIdLinks(newValString, isViewOnly);
        };

        confirmBtn.addEventListener('click', handleAdd);
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleAdd();
          }
        });

        cancelBtn.addEventListener('click', () => {
          window.renderRelatedCustomerIdLinks(valString, isViewOnly);
        });

        inputGroup.appendChild(input);
        inputGroup.appendChild(confirmBtn);
        inputGroup.appendChild(cancelBtn);
        container.appendChild(inputGroup);
        input.focus();
      });

      container.appendChild(addBtn);
    }
  };



  // ================= 関連するアポイントIDのイベントバインド =================
  window.renderRelatedAppointIdLinks = function(valString, isViewOnly) {
    const container = document.getElementById('appoint-related-appoint-links-container');
    if (!container) return;
    container.innerHTML = '';

    const ids = valString 
      ? valString.split(',').map(id => id.trim()).filter(id => id !== '')
      : [];

    ids.forEach(id => {
      const chip = document.createElement('div');
      chip.className = 'id-chip';
      chip.style.display = 'inline-flex';
      chip.style.alignItems = 'center';
      chip.style.gap = '0.3rem';
      chip.style.background = 'rgba(26, 115, 232, 0.08)';
      chip.style.border = '1px solid rgba(26, 115, 232, 0.2)';
      chip.style.padding = '0.2rem 0.5rem';
      chip.style.borderRadius = '20px';
      chip.style.fontSize = '0.85rem';
      chip.style.fontFamily = 'monospace';

      const link = document.createElement('a');
      link.href = '#';
      link.style.color = 'var(--primary)';
      link.style.fontWeight = 'bold';
      link.style.textDecoration = 'none';
      link.textContent = id;
      link.addEventListener('click', (e) => {
        e.preventDefault();
        viewAppointmentDetails(id);
      });
      chip.appendChild(link);

      if (!isViewOnly) {
        const deleteBtn = document.createElement('span');
        deleteBtn.textContent = '×';
        deleteBtn.style.color = 'var(--text-muted)';
        deleteBtn.style.cursor = 'pointer';
        deleteBtn.style.fontWeight = 'bold';
        deleteBtn.style.marginLeft = '0.2rem';
        deleteBtn.addEventListener('click', () => {
          const updatedIds = ids.filter(x => x !== id);
          const newValString = updatedIds.join(', ');

          if (state.editingAppointId) {
            const appoint = state.appointments.find(a => a.id === state.editingAppointId);
            if (appoint) {
              appoint.relatedAppointmentIds = newValString;
              localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(state.appointments));
              syncBiDirectionalRelatedAppointmentIds(state.editingAppointId, newValString);
            }
          }
          window.renderRelatedAppointIdLinks(newValString, isViewOnly);
        });
        chip.appendChild(deleteBtn);
      }

      container.appendChild(chip);
    });

    if (!isViewOnly) {
      const addBtn = document.createElement('button');
      addBtn.type = 'button';
      addBtn.className = 'btn-text';
      addBtn.style.fontSize = '0.8rem';
      addBtn.style.padding = '0.2rem 0.5rem';
      addBtn.style.border = '1px dashed var(--primary)';
      addBtn.style.borderRadius = '20px';
      addBtn.style.background = 'transparent';
      addBtn.style.color = 'var(--primary)';
      addBtn.style.cursor = 'pointer';
      addBtn.textContent = '＋ 関連アポイントを追加';

      addBtn.addEventListener('click', () => {
        container.removeChild(addBtn);

        const inputGroup = document.createElement('div');
        inputGroup.style.display = 'inline-flex';
        inputGroup.style.alignItems = 'center';
        inputGroup.style.gap = '0.25rem';

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = '8桁ID';
        input.style.width = '80px';
        input.style.padding = '0.15rem 0.4rem';
        input.style.fontSize = '0.8rem';
        input.style.fontFamily = 'monospace';
        input.style.border = '1px solid var(--primary)';
        input.style.borderRadius = 'var(--radius-sm)';
        input.style.background = 'var(--bg-surface)';
        input.style.color = 'var(--text-primary)';
        
        setupIdInputFilter(input);

        const confirmBtn = document.createElement('button');
        confirmBtn.type = 'button';
        confirmBtn.className = 'btn-success';
        confirmBtn.style.padding = '0.15rem 0.4rem';
        confirmBtn.style.fontSize = '0.75rem';
        confirmBtn.textContent = '追加';

        const cancelBtn = document.createElement('button');
        cancelBtn.type = 'button';
        cancelBtn.className = 'btn-secondary';
        cancelBtn.style.padding = '0.15rem 0.4rem';
        cancelBtn.style.fontSize = '0.75rem';
        cancelBtn.textContent = '取消';

        const handleAdd = () => {
          const newId = input.value.trim();
          if (newId.length !== 8) {
            showToast('アポイントIDは8桁の英数字で入力してください。', 'warning');
            return;
          }
          if (ids.includes(newId)) {
            showToast('このIDはすでに関連付けされています。', 'warning');
            return;
          }

          ids.push(newId);
          const newValString = ids.join(', ');

          if (state.editingAppointId) {
            const appoint = state.appointments.find(a => a.id === state.editingAppointId);
            if (appoint) {
              appoint.relatedAppointmentIds = newValString;
              localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(state.appointments));
              syncBiDirectionalRelatedAppointmentIds(state.editingAppointId, newValString);
            }
          }
          window.renderRelatedAppointIdLinks(newValString, isViewOnly);
        };

        confirmBtn.addEventListener('click', handleAdd);
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleAdd();
          }
        });

        cancelBtn.addEventListener('click', () => {
          window.renderRelatedAppointIdLinks(valString, isViewOnly);
        });

        inputGroup.appendChild(input);
        inputGroup.appendChild(confirmBtn);
        inputGroup.appendChild(cancelBtn);
        container.appendChild(inputGroup);
        input.focus();
      });

      container.appendChild(addBtn);
    }
  };





  const btnSwitchMainId = document.getElementById('btn-switch-main-id');
  if (btnSwitchMainId) {
    btnSwitchMainId.addEventListener('click', () => {
      document.getElementById('btn-switch-main-id').classList.add('active');
      document.getElementById('btn-switch-related-id-view').classList.remove('active');
      
      if (state.selectedExistingCustomer) {
        const searchResults = searchRelatedCrossTables(state.selectedExistingCustomer);
        renderConnectionPanel(searchResults, false);
      }
    });
  }

  const btnSwitchRelatedIdView = document.getElementById('btn-switch-related-id-view');
  if (btnSwitchRelatedIdView) {
    btnSwitchRelatedIdView.addEventListener('click', () => {
      document.getElementById('btn-switch-main-id').classList.remove('active');
      document.getElementById('btn-switch-related-id-view').classList.add('active');
      
      const relatedInput = document.getElementById('ext-info-related-id');
      const relatedId = relatedInput ? relatedInput.value.trim() : '';
      if (relatedId) {
        let relatedCustomer = state.customers.find(c => c.id === relatedId);
        if (!relatedCustomer) {
          if (state.joContracts) {
            const jo = state.joContracts.find(j => (j.customerPersonalityId || j.customerId) === relatedId);
            if (jo) {
              relatedCustomer = {
                id: relatedId,
                name: jo.repName || '未登録',
                furigana: jo.repFurigana || '',
                corp: jo.corpName || '',
                service: 'JO契約'
              };
            }
          }
          if (!relatedCustomer && state.apContracts) {
            const ap = state.apContracts.find(a => (a.customerPersonalityId || a.customerId) === relatedId);
            if (ap) {
              relatedCustomer = {
                id: relatedId,
                name: ap.name || '未登録',
                furigana: ap.furigana || '',
                service: '申込者情報'
              };
            }
          }
        }
        
        const searchResults = searchRelatedCrossTables(relatedCustomer || { id: relatedId });
        renderConnectionPanel(searchResults, false);
      }
    });
  }

  // 既存顧客未選択時プレースホルダー内の選択ボタン
  const selectCustBtn = document.getElementById('btn-select-existing-cust');
  if (selectCustBtn) {
    selectCustBtn.addEventListener('click', openCustomerSearchModal);
  }

  // モーダル操作
  document.getElementById('close-modal-btn').addEventListener('click', closeModal);
  document.getElementById('modal-cancel-btn').addEventListener('click', closeModal);
  document.getElementById('modal-search-input').addEventListener('input', handleModalSearch);

  // マルチセレクトドロップダウン初期化と表示生成
  const FIELD_OPTIONS = [
    { id: 'furigana', label: 'フリガナ' },
    { id: 'phone', label: '電話番号' },
    { id: 'email', label: 'メールアドレス' },
    { id: 'line', label: 'LINE名' },
    { id: 'address', label: '住所' },
    { id: 'corp_info', label: '法人情報 (API連携)' },
    { id: 'industry', label: '業種' },
    { id: 'biz_details', label: '事業内容' },
    { id: 'zoom', label: 'Zoom URL' },
    { id: 'introducer', label: '紹介者 (DB検索)' },
    { id: 'rep_furigana', label: '代表者フリガナ' },
    { id: 'corp_furigana', label: '法人名フリガナ' },
    { id: 'corp_num', label: '法人番号' },
    { id: 'invoice_num', label: 'インボイス登録番号' },
    { id: 'rep_birthday', label: '代表者生年月日' }
  ];

  window.renderFieldCheckboxes = function() {
    const container = document.getElementById('multiselect-checkboxes-container');
    if (!container) return;
    container.innerHTML = '';

    FIELD_OPTIONS.forEach(opt => {
      const label = document.createElement('label');
      label.style.display = 'block';
      label.style.cursor = 'pointer';
      
      const chk = document.createElement('input');
      chk.type = 'checkbox';
      chk.id = `chk-field-${opt.id}`;
      chk.value = opt.id;
      chk.style.marginRight = '0.5rem';
      
      if (state.addedCustomFields.has(opt.id)) {
        chk.checked = true;
      }

      chk.addEventListener('change', (e) => {
        if (e.target.checked) {
          addCustomField(opt.id);
        } else {
          removeCustomField(opt.id);
        }
        updateMultiselectLabel();
      });

      label.appendChild(chk);
      label.appendChild(document.createTextNode(opt.label));
      container.appendChild(label);
    });
  };

  window.updateMultiselectLabel = function() {
    const labelText = document.getElementById('multiselect-label-text');
    if (!labelText) return;
    const count = state.addedCustomFields.size;
    if (count > 0) {
      labelText.textContent = `選択中: ${count} 件の項目`;
      labelText.style.color = 'var(--primary)';
      labelText.style.fontWeight = 'bold';
    } else {
      labelText.textContent = '項目を選択して追加...';
      labelText.style.color = 'var(--text-primary)';
      labelText.style.fontWeight = 'normal';
    }
  };

  const fieldMultiselectBox = document.getElementById('field-multiselect-box');
  if (fieldMultiselectBox) {
    fieldMultiselectBox.addEventListener('click', (e) => {
      e.stopPropagation();
      const checkboxes = document.getElementById('multiselect-checkboxes-container');
      if (checkboxes) {
        const isHidden = checkboxes.style.display === 'none';
        checkboxes.style.display = isHidden ? 'block' : 'none';
      }
    });
  }

  document.addEventListener('mousedown', (e) => {
    const checkboxes = document.getElementById('multiselect-checkboxes-container');
    const multiselect = document.getElementById('field-multiselect');
    if (checkboxes && multiselect && !multiselect.contains(e.target)) {
      checkboxes.style.display = 'none';
    }
  }, true);

  window.renderFieldCheckboxes();
  window.updateMultiselectLabel();

  window.renderPatternOptions = function() {
    const selectApplyPattern = document.getElementById('select-apply-pattern');
    if (!selectApplyPattern) return;

    selectApplyPattern.innerHTML = '<option value="">-- パターンを選択して適用 --</option>';

    const optBasic = document.createElement('option');
    optBasic.value = 'basic';
    optBasic.textContent = '基本情報パターン';
    selectApplyPattern.appendChild(optBasic);

    const optCorp = document.createElement('option');
    optCorp.value = 'corp';
    optCorp.textContent = '法人確認パターン';
    selectApplyPattern.appendChild(optCorp);

    const savedPatterns = JSON.parse(localStorage.getItem(STORAGE_KEYS.PATTERNS)) || {};
    Object.keys(savedPatterns).forEach(pName => {
      if (pName !== 'basic' && pName !== 'corp') {
        const opt = document.createElement('option');
        opt.value = pName;
        opt.textContent = `${pName} (マイパターン)`;
        selectApplyPattern.appendChild(opt);
      }
    });
  };

  window.renderPatternOptions();

  const selectApplyPattern = document.getElementById('select-apply-pattern');
  if (selectApplyPattern) {
    selectApplyPattern.addEventListener('change', (e) => {
      const patternName = e.target.value;
      if (patternName) {
        applyPattern(patternName);
        e.target.value = '';
        
        FIELD_OPTIONS.forEach(opt => {
          const chk = document.getElementById(`chk-field-${opt.id}`);
          if (chk) {
            chk.checked = state.addedCustomFields.has(opt.id);
          }
        });
        window.updateMultiselectLabel();
      }
    });
  }
  
  // カスタムマイパターン保存
  document.getElementById('btn-save-custom-pattern').addEventListener('click', saveCustomPattern);

  // アポイントフォームの送信・一時保存・破棄
  document.getElementById('appointment-form').addEventListener('submit', handleFormSubmit);
  document.getElementById('btn-save-draft').addEventListener('click', handleSaveDraft);
  document.getElementById('delete-draft-btn').addEventListener('click', handleDeleteDraft);

  // フォーム内の任意の入力を検知してDirtyフラグを立てる
  document.getElementById('appointment-form').addEventListener('input', () => {
    state.isFormDirty = true;
  });

  // 本登録ID紐付けフォームの処理
  const linkOfficialForm = document.getElementById('link-official-form');
  if (linkOfficialForm) {
    linkOfficialForm.addEventListener('submit', handleLinkSubmit);
  }
  const linkSearchCust = document.getElementById('link-search-customer');
  if (linkSearchCust) {
    linkSearchCust.addEventListener('input', (e) => {
      renderLinkSearchAppoints(e.target.value.trim());
    });
  }

  // 関連データ検知のマージボタン
  document.getElementById('btn-merge-existing').addEventListener('click', () => {
    const matchedCustId = document.getElementById('btn-merge-existing').dataset.matchedId;
    if (matchedCustId) {
      const customer = state.customers.find(c => c.id === matchedCustId);
      if (customer) {
        const currentTab = state.tabs.find(t => t.id === state.activeTabId);
        if (currentTab && currentTab.appointData) {
          currentTab.appointData.customerType = 'existing';
          currentTab.appointData.selectedExistingCustomer = customer;
          currentTab.appointData.customerId = customer.id;
          currentTab.appointData.customerName = customer.name;
          currentTab.appointData.addedCustomFields = []; // カスタム項目をクリア
          currentTab.appointData.customFields = {}; // カスタム項目値をクリア
          currentTab.title = '既存顧客アポイント';
        }
        state.formMode = 'existing';
        document.getElementById('appointment-screen-title').textContent = '既存顧客アポイント登録';
        
        const selectArea = document.getElementById('top-customer-select-area');
        if (selectArea) selectArea.style.display = 'none';

        // フォーム上のカスタムフィールド表示をクリア
        document.getElementById('custom-fields-list').innerHTML = '';
        state.addedCustomFields.clear();

        selectCustomer(customer);
        renderTabBar();
        document.getElementById('related-data-alert').style.display = 'none';
        showToast('既存顧客データと紐付けました。', 'success');
      }
    }
  });

  // 条件付き書式モーダルの操作
  const closeRulesModal = () => {
    const modal = document.getElementById('conditional-formatting-modal');
    if (modal) modal.style.display = 'none';
  };
  const closeRulesBtn1 = document.getElementById('close-rules-modal-btn');
  const closeRulesBtn2 = document.getElementById('close-rules-modal-footer-btn');
  if (closeRulesBtn1) closeRulesBtn1.addEventListener('click', closeRulesModal);
  if (closeRulesBtn2) closeRulesBtn2.addEventListener('click', closeRulesModal);

  // 新規ルール追加
  const addRuleBtn = document.getElementById('add-rule-btn');
  if (addRuleBtn) {
    addRuleBtn.addEventListener('click', () => {
      const colId = document.getElementById('new-rule-col').value;
      const op = document.getElementById('new-rule-op').value;
      const val = document.getElementById('new-rule-val').value.trim();
      const bg = document.getElementById('new-rule-bg').value;
      const color = document.getElementById('new-rule-color').value;
      const bold = document.getElementById('new-rule-bold').checked;
      
      if (!colId) {
        showToast('対象の列を選択してください。', 'warning');
        return;
      }
      
      const newRule = {
        colId: colId,
        operator: op,
        value: val,
        bg: bg,
        color: color,
        bold: bold
      };
      
      if (colId === 'all') {
        let firstCol = 'status';
        if (state.activeCFScreen === 'jo') firstCol = state.joColumns[0]?.id || 'status';
        else if (state.activeCFScreen === 'ap') firstCol = state.apColumns[0]?.id || 'status';
        else if (state.activeCFScreen === 'ag') firstCol = state.agColumns[0]?.id || 'status';
        newRule.triggerColId = firstCol;
      }
      
      state.conditionalFormats[state.activeCFScreen].push(newRule);
      
      const userId = state.currentUser ? state.currentUser.id : 'guest';
      const saveKey = `SYNAPSE_CF_${state.activeCFScreen.toUpperCase()}_${userId}`;
      localStorage.setItem(saveKey, JSON.stringify(state.conditionalFormats[state.activeCFScreen]));
      
      renderCFRulesList();
      
      if (state.activeCFScreen === 'jo') renderJoInfo();
      else if (state.activeCFScreen === 'ap') renderApplicantInfo();
      else if (state.activeCFScreen === 'ag') renderAgencyInfo();
      
      showToast('条件付き書式ルールを追加しました。', 'success');
      
      document.getElementById('new-rule-val').value = '';
      document.getElementById('new-rule-bg').value = 'transparent';
      document.getElementById('new-rule-color').value = 'var(--text-primary)';
      document.getElementById('new-rule-bold').checked = false;
    });
  }

  // 上部タブバーの開閉イベント登録
  const tabsToggleBtn = document.getElementById('tabs-toggle-btn');
  const tabsOuter = document.getElementById('tabs-outer-wrapper');
  const tabsContainer = document.getElementById('tabs-container');
  if (tabsToggleBtn && tabsOuter && tabsContainer) {
    tabsToggleBtn.addEventListener('click', () => {
      tabsContainer.classList.toggle('collapsed');
      tabsOuter.classList.toggle('tabs-collapsed');
      if (tabsContainer.classList.contains('collapsed')) {
        tabsToggleBtn.textContent = '▼▼▼';
        tabsToggleBtn.title = 'タブバーを展開';
      } else {
        tabsToggleBtn.textContent = '▲▲▲';
        tabsToggleBtn.title = 'タブバーを折りたたむ';
      }
    });
  }

  // 表示倍率（ズーム）のイベントハンドラ登録
  const zoomInBtn = document.getElementById('zoom-in-btn');
  const zoomOutBtn = document.getElementById('zoom-out-btn');
  const zoomResetBtn = document.getElementById('zoom-reset-btn');

  const getActiveZoomLevel = () => {
    if (state.activeTabId) {
      const tab = state.tabs.find(t => t.id === state.activeTabId);
      return tab ? (tab.zoomLevel || 100) : 100;
    }
    return state.defaultZoomLevel || 100;
  };

  if (zoomInBtn) {
    zoomInBtn.addEventListener('click', () => {
      const currentZoom = getActiveZoomLevel();
      applyZoom(currentZoom + 10);
    });
  }
  if (zoomOutBtn) {
    zoomOutBtn.addEventListener('click', () => {
      const currentZoom = getActiveZoomLevel();
      applyZoom(currentZoom - 10);
    });
  }
  if (zoomResetBtn) {
    zoomResetBtn.addEventListener('click', () => {
      applyZoom(100);
    });
  }

  // カスタムフォームの送信イベントを監視するメッセージリスナーを追加
  window.addEventListener('message', handleFormSubmitMessage);

  // 🏷️ ドロップダウン設定サイドバーイベントの初期化
  setupValidationSidebarEvents();
}

// 表示モードの切り替え処理
function changeUserMode(mode) {
  if (!state.currentUser) return;
  if (state.currentUser.id === mode) return; // 既にそのモードなら何もしない
  
  state.currentUser.id = mode;
  state.currentUser.name = mode === 'admin' ? 'システム管理者' : (mode === 'support' ? '開設サポート担当' : '営業担当A');
  
  // localStorageに保存
  localStorage.setItem(STORAGE_KEYS.LOGGED_USER, JSON.stringify(state.currentUser));
  
  // ユーザー名表示の更新
  const nameEl = document.getElementById('logged-in-user-name');
  const avatarEl = document.getElementById('logged-in-user-avatar');
  if (nameEl) nameEl.textContent = state.currentUser.name;
  if (avatarEl) avatarEl.textContent = state.currentUser.name.charAt(0);
  
  // UIの表示制御を更新
  updateUIForCurrentMode();
  
  // タブとビューの再調整
  if (mode === 'sales') {
    renderTabs();
    if (state.activeTabId === 'dbmake-screen') {
      switchView('mypage-screen');
    }
  } else if (mode === 'support') {
    removeRestrictedTabsForRole(mode);
    renderTabs();
    if (state.activeTabId === 'dbmake-screen') {
      switchView('mypage-screen');
    }
  } else {
    openTab('agency-info-screen', 'agency-info-screen', '📊 代理店・基本マスタ');
  }
  
  // テーブル情報などの再描画（権限による表示変更を反映するため）
  initDatabase();
  renderCustomTableList();
  renderJoInfo();
  renderJoColumnSelector();
  renderAgencyInfo();
  renderApplicantInfo();
  
  let modeLabel = '営業';
  if (mode === 'admin') modeLabel = '管理者';
  else if (mode === 'support') modeLabel = '開設サポート';
  showToast(`${modeLabel}モードに切り替えました。`, 'success');
}

// ==========================================
// 4. 認証処理
// ==========================================
function handleLogin(e) {
  e.preventDefault();
  try {
    const id = document.getElementById('login-id').value.trim();
    const pass = document.getElementById('login-pass').value.trim();

    if (pass === 'password' && id) {
      let initialMode = 'sales';
      let name = '営業担当A';
      
      // 入力されたIDがadminっぽければ管理者モードで開始、それ以外なら営業モードで開始
      if (id.toLowerCase().includes('admin')) {
        initialMode = 'admin';
        name = 'システム管理者';
      } else if (id.toLowerCase().includes('support')) {
        initialMode = 'support';
        name = '開設サポート担当';
      } else if (id === 'sales_02') {
        name = '営業担当B';
      }
      
      state.currentUser = { id: initialMode, name: name, loginId: id };
      localStorage.setItem(STORAGE_KEYS.LOGGED_USER, JSON.stringify(state.currentUser));
      
      // ログインユーザー用のDB設定を再ロード
      initDatabase();
      renderJoInfo();
      renderJoColumnSelector();
      
      const nameEl = document.getElementById('logged-in-user-name');
      const avatarEl = document.getElementById('logged-in-user-avatar');
      if (nameEl) nameEl.textContent = state.currentUser.name;
      if (avatarEl) avatarEl.textContent = state.currentUser.name.charAt(0);
      
      // タブの初期化
      state.tabs = [];
      state.activeTabId = null;

      // サイドバーとトグルボタンの状態初期化
      const sidebarEl = document.getElementById('app-sidebar');
      const toggleBtn = document.getElementById('sidebar-toggle-btn');
      if (sidebarEl) sidebarEl.classList.remove('collapsed');
      if (toggleBtn) toggleBtn.textContent = '〈〈〈';

      // UI表示の更新
      updateUIForCurrentMode();
      removeRestrictedTabsForRole(state.currentUser.id);

      showToast('ログインしました。', 'success');
      showLoginScreen(false);

      if (state.currentUser.id === 'admin') {
        openTab('agency-info-screen', 'agency-info-screen', '📊 代理店・基本マスタ');
      } else {
        switchView('mypage-screen');
      }
    } else {
      showToast('パスワードが正しくありません。 (パスワード: password)', 'error');
    }
  } catch (err) {
    console.error("Login Handler Failure:", err);
    alert("ログイン処理中にエラーが発生しました：\n" + err.message + "\n\n詳細:\n" + err.stack);
  }
}

function handleLogout() {
  state.currentUser = null;
  localStorage.removeItem(STORAGE_KEYS.LOGGED_USER);
  
  // デフォルト（未ログイン状態）のDB設定を再ロード
  initDatabase();
  renderJoInfo();
  renderJoColumnSelector();
  
  // タブのクリーンアップ
  state.tabs = [];
  state.activeTabId = null;
  const tabsOuter = document.getElementById('tabs-outer-wrapper');
  if (tabsOuter) tabsOuter.style.display = 'none';

  showLoginScreen(true);
  showToast('ログアウトしました。', 'success');
}

function applyTheme(theme) {
  document.body.classList.remove('theme-light', 'theme-warm');
  if (theme === 'light') {
    document.body.classList.add('theme-light');
  } else if (theme === 'warm') {
    document.body.classList.add('theme-warm');
  }

  const selector = document.getElementById('theme-selector');
  if (selector) {
    selector.value = theme;
  }
}

function applyColorTone(hue, saturation) {
  const h = parseInt(hue, 10);
  const s = parseInt(saturation, 10);
  
  document.body.style.setProperty('--theme-hue', h + 'deg');
  document.body.style.setProperty('--theme-saturation', s / 100);
  
  const hueSlider = document.getElementById('hue-slider');
  if (hueSlider) {
    hueSlider.value = h;
  }
  const hueLabel = document.getElementById('hue-value-label');
  if (hueLabel) {
    hueLabel.textContent = h + '°';
  }
  
  const satSlider = document.getElementById('saturation-slider');
  if (satSlider) {
    satSlider.value = s;
  }
  const satLabel = document.getElementById('saturation-value-label');
  if (satLabel) {
    satLabel.textContent = s + '%';
  }
}

// 列記号（"A", "B", "AA" 等）を 0始まりの数値インデックスに変換
function letterToColIndex(letter) {
  let col = 0;
  letter = letter.toUpperCase();
  for (let i = 0; i < letter.length; i++) {
    col = col * 26 + (letter.charCodeAt(i) - 64);
  }
  return col - 1;
}

// 0始まりの数値インデックスを列記号（"A", "B" 等）に変換
function colIndexToLetter(idx) {
  let letter = '';
  let temp = idx;
  while (temp >= 0) {
    letter = String.fromCharCode((temp % 26) + 65) + letter;
    temp = Math.floor(temp / 26) - 1;
  }
  return letter;
}

// Googleスタイルの範囲指定文字列をパースする
function parseGoogleRange(rangeStr, columns, contracts, visibleColumnIds) {
  const visibleCols = columns.filter(c => visibleColumnIds.includes(c.id));
  const totalRows = contracts.length;
  const totalCols = visibleCols.length;
  
  if (!rangeStr) {
    return { startRow: 0, endRow: totalRows - 1, startCol: 0, endCol: totalCols - 1 };
  }
  
  const cleanStr = rangeStr.replace(/\s+/g, '').toUpperCase();
  
  let startRow = 0, endRow = totalRows - 1;
  let startCol = 0, endCol = totalCols - 1;
  
  if (cleanStr === 'ALL' || cleanStr === '行全体') {
    return { startRow, endRow, startCol, endCol };
  }
  
  if (cleanStr.includes(':')) {
    const parts = cleanStr.split(':');
    const part1 = parts[0];
    const part2 = parts[1];
    
    const p1Match = part1.match(/^([A-Z]+)?([0-9]+)?$/);
    const p2Match = part2.match(/^([A-Z]+)?([0-9]+)?$/);
    
    if (p1Match && p2Match) {
      const p1Col = p1Match[1] ? letterToColIndex(p1Match[1]) : null;
      const p1Row = p1Match[2] ? parseInt(p1Match[2], 10) - 1 : null;
      const p2Col = p2Match[1] ? letterToColIndex(p2Match[1]) : null;
      const p2Row = p2Match[2] ? parseInt(p2Match[2], 10) - 1 : null;
      
      let sCol = 0, eCol = totalCols - 1;
      if (p1Col !== null && p2Col !== null) {
        sCol = Math.min(p1Col, p2Col);
        eCol = Math.max(p1Col, p2Col);
      } else if (p1Col !== null) {
        sCol = eCol = p1Col;
      } else if (p2Col !== null) {
        sCol = eCol = p2Col;
      }
      
      let sRow = 0, eRow = totalRows - 1;
      if (p1Row !== null && p2Row !== null) {
        sRow = Math.min(p1Row, p2Row);
        eRow = Math.max(p1Row, p2Row);
      } else if (p1Row !== null) {
        sRow = p1Row;
      } else if (p2Row !== null) {
        eRow = p2Row;
      }
      
      startCol = Math.min(sCol, totalCols - 1);
      endCol = Math.min(eCol, totalCols - 1);
      startRow = Math.min(sRow, totalRows - 1);
      endRow = Math.min(eRow, totalRows - 1);
    }
  } else {
    const match = cleanStr.match(/^([A-Z]+)?([0-9]+)?$/);
    if (match) {
      const col = match[1] ? letterToColIndex(match[1]) : null;
      const row = match[2] ? parseInt(match[2], 10) - 1 : null;
      
      if (col !== null && row === null) {
        startCol = endCol = Math.min(col, totalCols - 1);
      } else if (col === null && row !== null) {
        startRow = endRow = Math.min(row, totalRows - 1);
      } else if (col !== null && row !== null) {
        startCol = endCol = Math.min(col, totalCols - 1);
        startRow = endRow = Math.min(row, totalRows - 1);
      }
    }
  }
  
  startCol = Math.max(0, startCol);
  endCol = Math.max(0, endCol);
  startRow = Math.max(0, startRow);
  endRow = Math.max(0, endRow);
  
  return { startRow, endRow, startCol, endCol };
}

// HEXからHSLへの変換
function hexToHsl(hex) {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  let r = parseInt(hex.substring(0, 2), 16) / 255;
  let g = parseInt(hex.substring(2, 4), 16) / 255;
  let b = parseInt(hex.substring(4, 6), 16) / 255;

  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

// 編集権限に応じた適用対象スタイルオブジェクトの取得
// 画面種別ごとの選択中セルキーの取得 (カラーピッカー共通適用のため)
function getTargetCellKeysForScreen(screenType) {
  const cellKeys = [];
  
  if (screenType === 'jo') {
    if (state.joSelectedRows && state.joSelectedRows.size > 0) {
      state.joSelectedRows.forEach(rIdx => {
        const contract = state.joContracts[rIdx];
        if (contract) {
          state.joVisibleColumns.forEach(colId => {
            cellKeys.push(`${contract.customerId}_${colId}`);
          });
        }
      });
    } else if (state.joSelectedCols && state.joSelectedCols.size > 0) {
      state.joSelectedCols.forEach(colId => {
        state.joContracts.forEach(contract => {
          cellKeys.push(`${contract.customerId}_${colId}`);
        });
      });
    } else if (state.joSelectedRange) {
      const minR = Math.min(state.joSelectedRange.startRow, state.joSelectedRange.endRow);
      const maxR = Math.max(state.joSelectedRange.startRow, state.joSelectedRange.endRow);
      const minC = Math.min(state.joSelectedRange.startCol, state.joSelectedRange.endCol);
      const maxC = Math.max(state.joSelectedRange.startCol, state.joSelectedRange.endCol);
      const visibleCols = state.joColumns.filter(c => state.joVisibleColumns.includes(c.id));
      
      for (let r = minR; r <= maxR; r++) {
        const rowData = state.joContracts[r];
        if (rowData) {
          for (let c = minC; c <= maxC; c++) {
            const col = visibleCols[c];
            if (col) {
              cellKeys.push(`${rowData.customerId}_${col.id}`);
            }
          }
        }
      }
    } else if (state.joSelectedCell) {
      cellKeys.push(`${state.joSelectedCell.customerId}_${state.joSelectedCell.colId}`);
    }
  } else if (screenType === 'ap') {
    if (state.apSelectedRows && state.apSelectedRows.size > 0) {
      state.apSelectedRows.forEach(rIdx => {
        const contract = state.apContracts[rIdx];
        if (contract) {
          state.apVisibleColumns.forEach(colId => {
            cellKeys.push(`${contract.customerId}_${colId}`);
          });
        }
      });
    } else if (state.apSelectedCols && state.apSelectedCols.size > 0) {
      state.apSelectedCols.forEach(colId => {
        state.apContracts.forEach(contract => {
          cellKeys.push(`${contract.customerId}_${colId}`);
        });
      });
    } else if (state.apSelectedRange) {
      const minR = Math.min(state.apSelectedRange.startRow, state.apSelectedRange.endRow);
      const maxR = Math.max(state.apSelectedRange.startRow, state.apSelectedRange.endRow);
      const minC = Math.min(state.apSelectedRange.startCol, state.apSelectedRange.endCol);
      const maxC = Math.max(state.apSelectedRange.startCol, state.apSelectedRange.endCol);
      const visibleCols = state.apColumns.filter(c => state.apVisibleColumns.includes(c.id));
      
      for (let r = minR; r <= maxR; r++) {
        const rowData = state.apContracts[r];
        if (rowData) {
          for (let c = minC; c <= maxC; c++) {
            const col = visibleCols[c];
            if (col) {
              cellKeys.push(`${rowData.customerId}_${col.id}`);
            }
          }
        }
      }
    } else if (state.apSelectedCell) {
      cellKeys.push(`${state.apSelectedCell.customerId}_${state.apSelectedCell.colId}`);
    }
  } else if (screenType === 'ag') {
    if (state.agSelectedRows && state.agSelectedRows.size > 0) {
      state.agSelectedRows.forEach(rIdx => {
        const rowData = state.agContracts[rIdx];
        if (rowData) {
          state.agVisibleColumns.forEach(colId => {
            cellKeys.push(`${rowData.customerId}_${colId}`);
          });
        }
      });
    } else if (state.agSelectedCols && state.agSelectedCols.size > 0) {
      state.agSelectedCols.forEach(colId => {
        state.agContracts.forEach(rowData => {
          cellKeys.push(`${rowData.customerId}_${colId}`);
        });
      });
    } else if (state.agSelectedRange) {
      const minR = Math.min(state.agSelectedRange.startRow, state.agSelectedRange.endRow);
      const maxR = Math.max(state.agSelectedRange.startRow, state.agSelectedRange.endRow);
      const minC = Math.min(state.agSelectedRange.startCol, state.agSelectedRange.endCol);
      const maxC = Math.max(state.agSelectedRange.startCol, state.agSelectedRange.endCol);
      const visibleCols = state.agColumns.filter(c => state.agVisibleColumns.includes(c.id));
      
      for (let r = minR; r <= maxR; r++) {
        const rowData = state.agContracts[r];
        if (rowData) {
          for (let c = minC; c <= maxC; c++) {
            const col = visibleCols[c];
            if (col) {
              cellKeys.push(`${rowData.customerId}_${col.id}`);
            }
          }
        }
      }
    } else if (state.agSelectedCell) {
      cellKeys.push(`${state.agSelectedCell.customerId}_${state.agSelectedCell.colId}`);
    }
  } else if (screenType === 'dbmake') {
    const searchQuery = document.getElementById('dbmake-search-input')?.value.trim().toLowerCase() || '';
    const statusFilter = document.getElementById('dbmake-status-filter')?.value || 'ALL';
    const filtered = dbmakePartners.filter(p => {
      const nameMatch = p.registeredName.toLowerCase().includes(searchQuery);
      const kanaMatch = p.registeredNameKana.toLowerCase().includes(searchQuery);
      const repMatch = p.representativeName.toLowerCase().includes(searchQuery);
      const invoiceMatch = (p.invoiceNum || '').toLowerCase().includes(searchQuery);
      const emailMatch = (p.email || '').toLowerCase().includes(searchQuery);
      const searchMatch = !searchQuery || nameMatch || kanaMatch || repMatch || invoiceMatch || emailMatch;
      const statusMatch = statusFilter === 'ALL' || p.status === statusFilter;
      const favMatch = !dbmakeFilterFav || p.isFavorite;
      return searchMatch && statusMatch && favMatch;
    });

    if (state.dbmakeSelectedRows && state.dbmakeSelectedRows.size > 0) {
      state.dbmakeSelectedRows.forEach(rIdx => {
        const partner = filtered[rIdx];
        if (partner) {
          state.dbmakeVisibleColumns.forEach(colId => {
            cellKeys.push(`${partner.id}_${colId}`);
          });
        }
      });
    } else if (state.dbmakeSelectedCols && state.dbmakeSelectedCols.size > 0) {
      state.dbmakeSelectedCols.forEach(colId => {
        filtered.forEach(partner => {
          cellKeys.push(`${partner.id}_${colId}`);
        });
      });
    } else if (state.dbmakeSelectedRange) {
      const minR = Math.min(state.dbmakeSelectedRange.startRow, state.dbmakeSelectedRange.endRow);
      const maxR = Math.max(state.dbmakeSelectedRange.startRow, state.dbmakeSelectedRange.endRow);
      const minC = Math.min(state.dbmakeSelectedRange.startCol, state.dbmakeSelectedRange.endCol);
      const maxC = Math.max(state.dbmakeSelectedRange.startCol, state.dbmakeSelectedRange.endCol);
      
      for (let r = minR; r <= maxR; r++) {
        const rowData = filtered[r];
        if (rowData) {
          for (let c = minC; c <= maxC; c++) {
            const colId = state.dbmakeVisibleColumns[c];
            if (colId) {
              cellKeys.push(`${rowData.id}_${colId}`);
            }
          }
        }
      }
    } else if (state.dbmakeSelectedCell) {
      cellKeys.push(`${state.dbmakeSelectedCell.partnerId}_${state.dbmakeSelectedCell.colId}`);
    }
  } else if (screenType === 'ct') {
    return getCtSelectedCellKeys();
  }
  return cellKeys;
}

// 編集権限に応じた適用対象スタイルオブジェクトの取得
function getTargetStyles(screenType) {
  const isMasterAdmin = state.currentUser && state.currentUser.id === 'admin';
  if (screenType === 'jo') {
    return isMasterAdmin ? state.joMasterCellStyles : state.joCellStyles;
  } else if (screenType === 'ap') {
    return isMasterAdmin ? state.apMasterCellStyles : state.apCellStyles;
  } else if (screenType === 'ag') {
    return isMasterAdmin ? state.agMasterCellStyles : state.agCellStyles;
  } else if (screenType === 'dbmake') {
    return state.dbmakeCellStyles;
  } else if (screenType === 'ct') {
    if (state.activeCustomTableId) {
      const tbl = state.customTables.find(t => t.id === state.activeCustomTableId);
      if (tbl) return tbl.cellStyles;
    }
  }
  return {};
}

// スタイル変更の永続化
function saveCellStyles(screenType) {
  const userId = state.currentUser ? state.currentUser.id : 'guest';
  const isMasterAdmin = state.currentUser && state.currentUser.id === 'admin';
  
  if (screenType === 'jo') {
    if (isMasterAdmin) {
      localStorage.setItem('SYNAPSE_JO_CELL_STYLES_MASTER', JSON.stringify(state.joMasterCellStyles));
    } else {
      localStorage.setItem(`SYNAPSE_JO_CELL_STYLES_${userId}`, JSON.stringify(state.joCellStyles));
    }
  } else if (screenType === 'ap') {
    if (isMasterAdmin) {
      localStorage.setItem('SYNAPSE_AP_CELL_STYLES_MASTER', JSON.stringify(state.apMasterCellStyles));
    } else {
      localStorage.setItem(`SYNAPSE_AP_CELL_STYLES_${userId}`, JSON.stringify(state.apCellStyles));
    }
  } else if (screenType === 'ag') {
    if (isMasterAdmin) {
      localStorage.setItem('SYNAPSE_AG_CELL_STYLES_MASTER', JSON.stringify(state.agMasterCellStyles));
    } else {
      localStorage.setItem(`SYNAPSE_AG_CELL_STYLES_${userId}`, JSON.stringify(state.agCellStyles));
    }
  } else if (screenType === 'dbmake') {
    localStorage.setItem(`SYNAPSE_DBMAKE_CELL_STYLES_${userId}`, JSON.stringify(state.dbmakeCellStyles));
  } else if (screenType === 'ct') {
    saveCustomTables();
  }
}

// 個別書式のリセット処理
function resetUserStyles(screenType, cellKeys) {
  if (!cellKeys || cellKeys.length === 0) return;
  const isMasterAdmin = state.currentUser && state.currentUser.id === 'admin';
  
  cellKeys.forEach(cellKey => {
    if (isMasterAdmin) {
      if (screenType === 'jo' && state.joMasterCellStyles) delete state.joMasterCellStyles[cellKey];
      else if (screenType === 'ap' && state.apMasterCellStyles) delete state.apMasterCellStyles[cellKey];
      else if (screenType === 'ag' && state.agMasterCellStyles) delete state.agMasterCellStyles[cellKey];
    } else {
      if (screenType === 'jo' && state.joCellStyles) delete state.joCellStyles[cellKey];
      else if (screenType === 'ap' && state.apCellStyles) delete state.apCellStyles[cellKey];
      else if (screenType === 'ag' && state.agCellStyles) delete state.agCellStyles[cellKey];
    }
  });
  
  saveCellStyles(screenType);
  
  if (screenType === 'jo') {
    renderJoInfo();
    syncJoFormatToolbar();
  } else if (screenType === 'ap') {
    renderApplicantInfo();
    syncApFormatToolbar();
  } else if (screenType === 'ag') {
    renderAgencyInfo();
    syncAgFormatToolbar();
  }
  
  showToast(isMasterAdmin ? '選択範囲の共有書式をクリアしました。' : '選択範囲の書式を共有マスタに戻しました。', 'success');
}

// 範囲リセット用ポップアップ制御の共通ヘルパー
function setupResetRangePopup(screenType, btnId, popupId, inputId, confirmId, confirmAllId, columns, contracts, visibleColumnIds) {
  const btn = document.getElementById(btnId);
  const popup = document.getElementById(popupId);
  const input = document.getElementById(inputId);
  const confirmBtn = document.getElementById(confirmId);
  const confirmAllBtn = document.getElementById(confirmAllId);
  
  if (!btn || !popup || !input || !confirmBtn || !confirmAllBtn) return;
  
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    
    document.querySelectorAll('.reset-range-popup').forEach(p => {
      if (p !== popup) p.style.display = 'none';
    });
    
    const isHidden = popup.style.display === 'none' || !popup.style.display;
    popup.style.display = isHidden ? 'block' : 'none';
    
    if (isHidden) {
      input.value = getGoogleRangeStr(screenType);
      input.select();
      input.focus();
    }
  });
  
  // 選択範囲をリセット
  confirmBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const rangeText = input.value.trim();
    if (!rangeText) return;
    
    const range = parseGoogleRange(rangeText, columns, contracts, visibleColumnIds);
    const visibleCols = columns.filter(c => visibleColumnIds.includes(c.id));
    
    const cellKeys = [];
    for (let r = range.startRow; r <= range.endRow; r++) {
      const contract = contracts[r];
      if (contract) {
        for (let c = range.startCol; c <= range.endCol; c++) {
          const col = visibleCols[c];
          if (col) {
            cellKeys.push(`${contract.customerId}_${col.id}`);
          }
        }
      }
    }
    
    resetUserStyles(screenType, cellKeys);
    popup.style.display = 'none';
  });
  
  // シート全体をリセット (オールリセット)
  confirmAllBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isMasterAdmin = state.currentUser && state.currentUser.id === 'admin';
    if (confirm('シートのすべての個別書式を初期化します。よろしいですか？')) {
      if (isMasterAdmin) {
        if (screenType === 'jo') state.joMasterCellStyles = {};
        else if (screenType === 'ap') state.apMasterCellStyles = {};
        else if (screenType === 'ag') state.agMasterCellStyles = {};
      } else {
        if (screenType === 'jo') state.joCellStyles = {};
        else if (screenType === 'ap') state.apCellStyles = {};
        else if (screenType === 'ag') state.agCellStyles = {};
      }
      
      saveCellStyles(screenType);
      
      if (screenType === 'jo') {
        renderJoInfo();
        syncJoFormatToolbar();
      } else if (screenType === 'ap') {
        renderApplicantInfo();
        syncApFormatToolbar();
      } else if (screenType === 'ag') {
        renderAgencyInfo();
        syncAgFormatToolbar();
      }
      
      showToast('シート全体の書式をリセットしました。', 'success');
      popup.style.display = 'none';
    }
  });
  
  popup.addEventListener('click', (e) => {
    e.stopPropagation();
  });
}

// --- 高級カラーパレット＆カスタムカラーピッカーの制御変数と関数群 ---
const PASTEL_COLORS = [
  // 1段目: 最も淡いパステル調
  '#F3F4F6', '#FEE2E2', '#FFEDD5', '#FEF9C3', '#D1FAE5', '#E0F2FE', '#E0E7FF', '#F3E8FF',
  // 2段目: 中間のパステル調
  '#E5E7EB', '#FCA5A5', '#FDBA74', '#FDE047', '#6EE7B7', '#7DD3FC', '#A5B4FC', '#D8B4FE',
  // 3段目: やや濃いパステル調
  '#D1D5DB', '#F87171', '#FB923C', '#FACC15', '#34D399', '#38BDF8', '#818CF8', '#C084FC'
];

const DARK_COLORS = [
  // 1段目: 標準カラー
  '#9CA3AF', '#EF4444', '#F97316', '#EAB308', '#10B981', '#0EA5E9', '#6366F1', '#A855F7',
  // 2段目: 濃いカラー
  '#4B5563', '#DC2626', '#EA580C', '#CA8A04', '#059669', '#0284C7', '#4F46E5', '#9333EA',
  // 3段目: 最も濃い・ダーク調
  '#1F2937', '#991B1B', '#9A3412', '#854D0E', '#065F46', '#075985', '#3730A3', '#6B21A8'
];

let favoriteColors = [];
let colorHistory = [];

function loadColorPresets() {
  const userId = state.currentUser ? state.currentUser.id : 'guest';
  try {
    favoriteColors = JSON.parse(localStorage.getItem(`SYNAPSE_FAV_COLORS_${userId}`)) || [];
    colorHistory = JSON.parse(localStorage.getItem(`SYNAPSE_COLOR_HISTORY_${userId}`)) || [];
  } catch (e) {
    favoriteColors = [];
    colorHistory = [];
  }
}

function saveColorPresets() {
  const userId = state.currentUser ? state.currentUser.id : 'guest';
  localStorage.setItem(`SYNAPSE_FAV_COLORS_${userId}`, JSON.stringify(favoriteColors));
  localStorage.setItem(`SYNAPSE_COLOR_HISTORY_${userId}`, JSON.stringify(colorHistory));
}

// 他のカラーピッカーをすべて閉じる
function closeAllColorPickersExcept(exceptPicker) {
  document.querySelectorAll('.color-picker-dropdown').forEach(p => {
    if (p !== exceptPicker) p.style.display = 'none';
  });
}

// カラーピッカーの内容を動的生成
function renderColorPickerContent(pickerEl) {
  const pickerType = pickerEl.getAttribute('data-picker-type');
  const targetScreen = pickerEl.getAttribute('data-target-screen');
  
  if (!pickerEl.hasAttribute('data-active-tab')) {
    pickerEl.setAttribute('data-active-tab', pickerType === 'bg' ? 'pastel' : 'dark');
  }
  const activeTab = pickerEl.getAttribute('data-active-tab');
  
  if (!pickerEl.hasAttribute('data-apply-mode')) {
    pickerEl.setAttribute('data-apply-mode', 'direct');
  }
  const applyMode = pickerEl.getAttribute('data-apply-mode');

  // 現在選択されているセルの文字色/背景色を取得して、パレット内で同期・強調表示する
  let activeColor = '';
  if (targetScreen === 'ct') {
    const tbl = state.customTables.find(t => t.id === state.activeCustomTableId);
    const keys = getCtSelectedCellKeys();
    if (tbl && keys.length > 0) {
      const firstKey = keys[0];
      const style = tbl.cellStyles[firstKey] || {};
      activeColor = pickerType === 'bg' ? (style.bg || 'transparent') : (style.color || 'var(--text-primary)');
    }
  } else if (targetScreen) {
    const cellKeys = getTargetCellKeysForScreen(targetScreen);
    const targetStyles = getTargetStyles(targetScreen);
    if (cellKeys.length > 0 && targetStyles) {
      const firstKey = cellKeys[0];
      const style = targetStyles[firstKey] || {};
      activeColor = pickerType === 'bg' ? (style.bg || 'transparent') : (style.color || 'var(--text-primary)');
    }
  }
  
  let html = '';
  
  // 適用方法ラジオ (サイドバー内のピッカーでなければ表示)
  if (targetScreen !== 'cf-sidebar-text' && targetScreen !== 'cf-sidebar-bg') {
    html += `
      <div class="apply-mode-container" style="display: flex; gap: 8px; justify-content: center; padding: 4px 0; border-bottom: 1px solid var(--border-color); margin-bottom: 6px;">
        <label style="font-size: 0.7rem; font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 3px; color: var(--text-primary);">
          <input type="radio" name="${targetScreen}-${pickerType}-apply-mode" value="direct" ${applyMode === 'direct' ? 'checked' : ''} style="margin: 0; cursor: pointer;">
          選択範囲
        </label>
        <label style="font-size: 0.7rem; font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 3px; color: var(--text-primary);">
          <input type="radio" name="${targetScreen}-${pickerType}-apply-mode" value="conditional" ${applyMode === 'conditional' ? 'checked' : ''} style="margin: 0; cursor: pointer;">
          条件指定
        </label>
      </div>
    `;
  }
  
  // タブ
  html += `
    <div class="color-picker-tabs">
      <button type="button" class="color-picker-tab-btn ${activeTab === 'pastel' ? 'active' : ''}" data-tab="pastel">パステル</button>
      <button type="button" class="color-picker-tab-btn ${activeTab === 'dark' ? 'active' : ''}" data-tab="dark">標準</button>
    </div>
  `;
  
  // パレットスウォッチ
  const colors = activeTab === 'pastel' ? PASTEL_COLORS : DARK_COLORS;
  html += `<div class="color-palette-grid" style="display: grid; grid-template-columns: repeat(8, 1fr); gap: 4px; padding: 4px;">`;
  colors.forEach(c => {
    const isCurrent = (c === activeColor);
    const borderStyle = isCurrent ? '2px solid var(--primary); transform: scale(1.15); box-shadow: 0 0 4px var(--primary);' : '1px solid var(--border-color);';
    html += `<div class="color-swatch" style="background-color: ${c}; width: 16px; height: 16px; border-radius: 50%; cursor: pointer; border: ${borderStyle}" data-color="${c}"></div>`;
  });
  html += `</div>`;
  
  // お気に入り
  if (favoriteColors.length > 0) {
    html += `<div class="color-picker-section-title" style="padding-left: 4px; font-weight: bold; font-size: 0.65rem; color: var(--text-secondary); margin-top: 6px; margin-bottom: 2px;">お気に入り</div>`;
    html += `<div class="color-palette-grid" style="display: grid; grid-template-columns: repeat(8, 1fr); gap: 4px; padding: 4px;">`;
    favoriteColors.forEach(c => {
      const isCurrent = (c === activeColor);
      const borderStyle = isCurrent ? '2px solid var(--primary); transform: scale(1.15); box-shadow: 0 0 4px var(--primary);' : '1px solid var(--border-color);';
      html += `<div class="color-swatch" style="background-color: ${c}; width: 16px; height: 16px; border-radius: 50%; cursor: pointer; border: ${borderStyle}" data-color="${c}"></div>`;
    });
    html += `</div>`;
  }
  
  // 履歴
  if (colorHistory.length > 0) {
    html += `<div class="color-picker-section-title" style="padding-left: 4px; font-weight: bold; font-size: 0.65rem; color: var(--text-secondary); margin-top: 6px; margin-bottom: 2px;">履歴</div>`;
    html += `<div class="color-palette-grid" style="display: grid; grid-template-columns: repeat(8, 1fr); gap: 4px; padding: 4px;">`;
    colorHistory.forEach(c => {
      const isCurrent = (c === activeColor);
      const borderStyle = isCurrent ? '2px solid var(--primary); transform: scale(1.15); box-shadow: 0 0 4px var(--primary);' : '1px solid var(--border-color);';
      html += `<div class="color-swatch" style="background-color: ${c}; width: 16px; height: 16px; border-radius: 50%; cursor: pointer; border: ${borderStyle}" data-color="${c}"></div>`;
    });
    html += `</div>`;
  }
  
  // カスタム ＆ リセット
  const resetColor = pickerType === 'bg' ? 'transparent' : 'var(--text-primary)';
  const resetLabel = pickerType === 'bg' ? '✖' : 'A';
  const resetTitle = pickerType === 'bg' ? '塗りつぶしなし' : 'デフォルト色';
  const resetBgStyle = pickerType === 'bg' ? 'transparent' : 'var(--text-primary)';
  
  const isResetCurrent = (resetColor === activeColor);
  const resetBorderStyle = isResetCurrent ? '2px solid var(--primary); transform: scale(1.15); box-shadow: 0 0 4px var(--primary);' : '1px solid var(--border-color);';

  html += `
    <div class="color-picker-custom-row" style="display: flex; justify-content: space-between; align-items: center; padding: 4px; border-top: 1px solid var(--border-color); margin-top: 6px; padding-top: 6px;">
      <button type="button" class="color-swatch" data-color="${resetColor}" style="background: ${resetBgStyle}; border: ${resetBorderStyle} border-radius: 50%; width: 18px; height: 18px; line-height: 16px; font-size: 0.7rem; text-align: center; cursor: pointer; font-weight: bold; color: ${pickerType === 'bg' ? 'var(--text-secondary)' : 'white'};" title="${resetTitle}">${resetLabel}</button>
      <button type="button" class="color-picker-custom-btn" style="background: none; border: none; font-size: 1.1rem; cursor: pointer; padding: 0;" title="カスタムカラーを作成">➕</button>
    </div>
  `;
  
  pickerEl.innerHTML = html;
}

// 色適用共通処理
function applyColor(screenType, pickerType, color) {
  if (screenType === 'cf-sidebar-text') {
    cfStyleTextColor = color;
    updateCfPreview();
    return;
  } else if (screenType === 'cf-sidebar-bg') {
    cfStyleBgColor = color;
    updateCfPreview();
    return;
  }
  
  let dropdownId = `${screenType}-color-picker-dropdown`;
  if (pickerType === 'bg') dropdownId = `${screenType}-bg-color-picker-dropdown`;
  
  const dropdownEl = document.getElementById(dropdownId);
  const applyMode = dropdownEl ? dropdownEl.getAttribute('data-apply-mode') : 'direct';
  
  if (applyMode === 'conditional') {
    applyConditionalColor(screenType, pickerType, color);
    return;
  }
  
  const cellKeys = getTargetCellKeysForScreen(screenType);
  if (cellKeys.length === 0) return;
  
  const targetStyles = getTargetStyles(screenType);
  
  cellKeys.forEach(cellKey => {
    if (!targetStyles[cellKey]) targetStyles[cellKey] = {};
    
    if (pickerType === 'bg') {
      if (color === 'transparent') {
        delete targetStyles[cellKey].bg;
      } else {
        targetStyles[cellKey].bg = color;
      }
    } else {
      if (color === 'var(--text-primary)') {
        delete targetStyles[cellKey].color;
      } else {
        targetStyles[cellKey].color = color;
      }
    }
    
    if (Object.keys(targetStyles[cellKey]).length === 0) delete targetStyles[cellKey];
  });
  
  saveCellStyles(screenType);
  
  if (screenType === 'ag') {
    renderAgencyInfo();
    syncAgFormatToolbar();
  } else if (screenType === 'jo') {
    renderJoInfo();
    syncJoFormatToolbar();
  } else if (screenType === 'ap') {
    renderApplicantInfo();
    syncApFormatToolbar();
  } else if (screenType === 'dbmake') {
    renderDbmakePartners();
    syncDbmakeFormatToolbar();
  } else if (screenType === 'ct') {
    if (state.activeCustomTableId) {
      renderCustomTable(state.activeCustomTableId);
      syncCtFormatToolbar();
    }
  }
}

// 条件付き書式ルール作成ビューを直接立ち上げるヘルパー
function applyConditionalColor(screenType, pickerType, color) {
  editingCFType = screenType;
  editingCFRuleId = null;
  
  const sidebar = document.getElementById('conditional-formatting-sidebar');
  const titleSpan = document.getElementById('rules-screen-name');
  if (!sidebar || !titleSpan) return;
  
  titleSpan.textContent = screenType === 'jo' ? 'JO情報' : screenType === 'ap' ? '申込者情報' : '代理店情報';
  sidebar.classList.add('open');
  
  openCFEditor(null);
  
  if (pickerType === 'bg') {
    cfStyleBgColor = color;
  } else {
    cfStyleTextColor = color;
  }
  updateCfPreview();
}

// カラーピッカーの初期化バインド
function initColorPickers() {
  loadColorPresets();
  
  const pickers = document.querySelectorAll('.color-picker-dropdown');
  pickers.forEach(picker => {
    const id = picker.id;
    if (id) {
      if (id.includes('-bg-color-picker-dropdown')) {
        const screen = id.replace('-bg-color-picker-dropdown', '');
        picker.setAttribute('data-target-screen', screen);
        picker.setAttribute('data-picker-type', 'bg');
      } else if (id.includes('-color-picker-dropdown')) {
        const screen = id.replace('-color-picker-dropdown', '');
        picker.setAttribute('data-target-screen', screen);
        picker.setAttribute('data-picker-type', 'color');
      }
    }
    
    renderColorPickerContent(picker);
    
    picker.addEventListener('click', (e) => {
      e.stopPropagation();
      
      const tabBtn = e.target.closest('.color-picker-tab-btn');
      if (tabBtn) {
        const tab = tabBtn.getAttribute('data-tab');
        picker.setAttribute('data-active-tab', tab);
        renderColorPickerContent(picker);
        return;
      }
      
      const swatch = e.target.closest('.color-swatch');
      if (swatch) {
        const color = swatch.getAttribute('data-color');
        const targetScreen = picker.getAttribute('data-target-screen');
        const pickerType = picker.getAttribute('data-picker-type');
        
        applyColor(targetScreen, pickerType, color);
        picker.style.display = 'none';
        return;
      }
      
      const customBtn = e.target.closest('.color-picker-custom-btn');
      if (customBtn) {
        const targetScreen = picker.getAttribute('data-target-screen');
        const pickerType = picker.getAttribute('data-picker-type');
        
        openCustomColorModal(targetScreen, pickerType);
        picker.style.display = 'none';
        return;
      }
      
      const radioInput = e.target.closest('input[type="radio"]');
      if (radioInput) {
        const val = radioInput.value;
        picker.setAttribute('data-apply-mode', val);
        
        const targetScreen = picker.getAttribute('data-target-screen');
        if (val === 'conditional') {
          picker.style.display = 'none'; // パレットを閉じる
          openConditionalFormattingModal(targetScreen); // サイドバーを開く
        } else {
          // 直接適用に戻された際、もしその画面のサイドバーが開いていれば閉じる
          const sidebar = document.getElementById('conditional-formatting-sidebar');
          if (sidebar && editingCFType === targetScreen) {
            sidebar.classList.remove('open');
          }
        }
        return;
      }
    });
  });
}

// --- カスタムカラー作成ダイアログの制御ロジック ---
let activeModalScreenType = null;
let activeModalPickerType = null;
let selectedHexColor = '#000000';
let activeModalTab = 'grad';

function openCustomColorModal(screenType, pickerType) {
  activeModalScreenType = screenType;
  activeModalPickerType = pickerType;
  activeModalTab = 'grad';
  selectedHexColor = '#000000';
  
  const modal = document.getElementById('custom-color-modal');
  if (!modal) return;
  
  modal.style.display = 'flex';
  
  // タブ初期化
  document.getElementById('color-tab-grad').classList.add('active');
  document.getElementById('color-tab-rgb').classList.remove('active');
  document.getElementById('color-panel-grad').style.display = 'block';
  document.getElementById('color-panel-rgb').style.display = 'none';
  
  // スライダー初期化
  document.getElementById('color-hue-slider').value = 0;
  document.getElementById('rgb-slider-r').value = 0;
  document.getElementById('rgb-input-r').value = 0;
  document.getElementById('rgb-slider-g').value = 0;
  document.getElementById('rgb-input-g').value = 0;
  document.getElementById('rgb-slider-b').value = 0;
  document.getElementById('rgb-input-b').value = 0;
  
  updateModalColorPreview('#000000');
  drawGradientCanvas();
}

function updateModalColorPreview(hex) {
  selectedHexColor = hex.toUpperCase();
  document.getElementById('color-modal-preview').style.backgroundColor = selectedHexColor;
  document.getElementById('color-modal-hex').value = selectedHexColor;
  
  const favBtn = document.getElementById('color-modal-fav-toggle');
  if (favoriteColors.includes(selectedHexColor)) {
    favBtn.textContent = '★';
    favBtn.style.color = '#F59E0B';
  } else {
    favBtn.textContent = '☆';
    favBtn.style.color = 'var(--text-secondary)';
  }
}

function drawGradientCanvas() {
  const canvas = document.getElementById('color-grad-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  
  const hue = parseInt(document.getElementById('color-hue-slider').value, 10);
  
  ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
  ctx.fillRect(0, 0, width, height);
  
  const gradWhite = ctx.createLinearGradient(0, 0, width, 0);
  gradWhite.addColorStop(0, 'rgba(255,255,255,1)');
  gradWhite.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gradWhite;
  ctx.fillRect(0, 0, width, height);
  
  const gradBlack = ctx.createLinearGradient(0, 0, 0, height);
  gradBlack.addColorStop(0, 'rgba(0,0,0,0)');
  gradBlack.addColorStop(1, 'rgba(0,0,0,1)');
  ctx.fillStyle = gradBlack;
  ctx.fillRect(0, 0, width, height);
}

function rgbToHex(r, g, b) {
  const toHex = (c) => {
    const hex = Math.max(0, Math.min(255, c)).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return '#' + toHex(r) + toHex(g) + toHex(b);
}

function hexToRgb(hex) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function initCustomColorModalEvents() {
  const modal = document.getElementById('custom-color-modal');
  const tabGrad = document.getElementById('color-tab-grad');
  const tabRgb = document.getElementById('color-tab-rgb');
  const panelGrad = document.getElementById('color-panel-grad');
  const panelRgb = document.getElementById('color-panel-rgb');
  
  const canvas = document.getElementById('color-grad-canvas');
  const hueSlider = document.getElementById('color-hue-slider');
  
  const sliderR = document.getElementById('rgb-slider-r');
  const inputR = document.getElementById('rgb-input-r');
  const sliderG = document.getElementById('rgb-slider-g');
  const inputG = document.getElementById('rgb-input-g');
  const sliderB = document.getElementById('rgb-slider-b');
  const inputB = document.getElementById('rgb-input-b');
  
  const hexInput = document.getElementById('color-modal-hex');
  const favToggle = document.getElementById('color-modal-fav-toggle');
  
  const cancelBtn = document.getElementById('color-modal-cancel');
  const saveBtn = document.getElementById('color-modal-save');
  
  if (!modal) return;
  
  // タブ切り替え
  tabGrad.addEventListener('click', () => {
    activeModalTab = 'grad';
    tabGrad.classList.add('active');
    tabRgb.classList.remove('active');
    panelGrad.style.display = 'block';
    panelRgb.style.display = 'none';
  });
  
  tabRgb.addEventListener('click', () => {
    activeModalTab = 'rgb';
    tabRgb.classList.add('active');
    tabGrad.classList.remove('active');
    panelRgb.style.display = 'block';
    panelGrad.style.display = 'none';
    
    const rgb = hexToRgb(selectedHexColor);
    if (rgb) {
      sliderR.value = rgb.r; inputR.value = rgb.r;
      sliderG.value = rgb.g; inputG.value = rgb.g;
      sliderB.value = rgb.b; inputB.value = rgb.b;
    }
  });
  
  // 色相スライダー変更
  hueSlider.addEventListener('input', () => {
    drawGradientCanvas();
    updateColorFromCanvasCoords(canvas.width / 2, canvas.height / 2);
  });
  
  // キャンバスクリック・ドラッグ
  let isDragging = false;
  
  const handleCanvasColorPick = (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = Math.max(0, Math.min(canvas.width - 1, ((e.clientX - rect.left) / rect.width) * canvas.width));
    const y = Math.max(0, Math.min(canvas.height - 1, ((e.clientY - rect.top) / rect.height) * canvas.height));
    updateColorFromCanvasCoords(x, y);
  };
  
  const updateColorFromCanvasCoords = (x, y) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const imgData = ctx.getImageData(x, y, 1, 1).data;
    const hex = rgbToHex(imgData[0], imgData[1], imgData[2]);
    updateModalColorPreview(hex);
  };
  
  canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    handleCanvasColorPick(e);
  });
  
  window.addEventListener('mousemove', (e) => {
    if (isDragging) {
      handleCanvasColorPick(e);
    }
  });
  
  window.addEventListener('mouseup', () => {
    isDragging = false;
  });
  
  // RGB連動
  const syncRGB = () => {
    const r = parseInt(sliderR.value, 10);
    const g = parseInt(sliderG.value, 10);
    const b = parseInt(sliderB.value, 10);
    const hex = rgbToHex(r, g, b);
    updateModalColorPreview(hex);
  };
  
  const bindRgbEvents = (slider, input) => {
    slider.addEventListener('input', () => {
      input.value = slider.value;
      syncRGB();
    });
    input.addEventListener('input', () => {
      let val = parseInt(input.value, 10);
      if (isNaN(val)) val = 0;
      val = Math.max(0, Math.min(255, val));
      input.value = val;
      slider.value = val;
      syncRGB();
    });
  };
  
  bindRgbEvents(sliderR, inputR);
  bindRgbEvents(sliderG, inputG);
  bindRgbEvents(sliderB, inputB);
  
  // HEX手入力
  hexInput.addEventListener('change', () => {
    let hex = hexInput.value.trim();
    if (!hex.startsWith('#')) hex = '#' + hex;
    if (/^#[0-9A-F]{6}$/i.test(hex)) {
      updateModalColorPreview(hex);
      const rgb = hexToRgb(hex);
      if (rgb) {
        sliderR.value = rgb.r; inputR.value = rgb.r;
        sliderG.value = rgb.g; inputG.value = rgb.g;
        sliderB.value = rgb.b; inputB.value = rgb.b;
      }
    } else {
      hexInput.value = selectedHexColor;
    }
  });
  
  // お気に入りトグル
  favToggle.addEventListener('click', () => {
    const idx = favoriteColors.indexOf(selectedHexColor);
    if (idx !== -1) {
      favoriteColors.splice(idx, 1);
    } else {
      if (favoriteColors.length >= 16) {
        favoriteColors.shift();
      }
      favoriteColors.push(selectedHexColor);
    }
    saveColorPresets();
    updateModalColorPreview(selectedHexColor);
    
    document.querySelectorAll('.color-picker-dropdown').forEach(renderColorPickerContent);
  });
  
  // キャンセル
  cancelBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });
  
  // 決定
  saveBtn.addEventListener('click', () => {
    const hIdx = colorHistory.indexOf(selectedHexColor);
    if (hIdx !== -1) {
      colorHistory.splice(hIdx, 1);
    }
    colorHistory.push(selectedHexColor);
    if (colorHistory.length > 16) {
      colorHistory.shift();
    }
    
    saveColorPresets();
    
    document.querySelectorAll('.color-picker-dropdown').forEach(renderColorPickerContent);
    applyColor(activeModalScreenType, activeModalPickerType, selectedHexColor);
    
    modal.style.display = 'none';
  });
}

// HSLからHEXへの変換
function hslToHex(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    let p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  const toHex = x => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// テーマに応じたカラーの自動補正
function adjustColorForTheme(colorStr, isBackground) {
  if (!colorStr || colorStr === 'transparent' || colorStr.startsWith('var(')) {
    return colorStr;
  }
  
  const userId = state.currentUser ? state.currentUser.id : 'guest';
  const theme = localStorage.getItem(`SYNAPSE_THEME_${userId}`) || 'light';

  // ライトモード（デフォルト）の場合は、補正をせず元の色をそのまま返す
  if (theme === 'light') {
    return colorStr;
  }

  try {
    const hsl = hexToHsl(colorStr);
    
    if (theme === 'dark') {
      if (isBackground) {
        hsl.l = Math.max(12, Math.min(20, hsl.l * 0.3));
        hsl.s = Math.min(40, hsl.s);
      } else {
        hsl.l = Math.max(80, Math.min(95, 100 - (hsl.l * 0.2)));
      }
    } else if (theme === 'warm') {
      let targetHue = 35;
      hsl.h = hsl.h * 0.6 + targetHue * 0.4;
      
      if (isBackground) {
        hsl.l = Math.max(85, Math.min(93, 100 - (100 - hsl.l) * 0.4));
        hsl.s = Math.max(10, Math.min(30, hsl.s));
      } else {
        hsl.l = Math.max(20, Math.min(35, hsl.l * 0.3));
        hsl.s = Math.min(45, hsl.s);
      }
    }
    return hslToHex(hsl.h, hsl.s, hsl.l);
  } catch (e) {
    return colorStr;
  }
}

// 条件の一致判定
function evaluateCondition(cellValue, operator, targetValue, targetValue2) {
  const valStr = cellValue === null || cellValue === undefined ? '' : String(cellValue).trim();
  const targetStr = targetValue === null || targetValue === undefined ? '' : String(targetValue).trim();
  const targetStr2 = targetValue2 === null || targetValue2 === undefined ? '' : String(targetValue2).trim();
  
  const valNum = parseFloat(valStr);
  const targetNum = parseFloat(targetStr);
  const targetNum2 = parseFloat(targetStr2);
  const isValNum = !isNaN(valNum);
  const isTargetNum = !isNaN(targetNum);
  const isTargetNum2 = !isNaN(targetNum2);
  
  switch (operator) {
    case 'empty':
      return valStr === '';
    case 'not_empty':
      return valStr !== '';
    case 'contains':
      return valStr.toLowerCase().includes(targetStr.toLowerCase());
    case 'not_contains':
      return !valStr.toLowerCase().includes(targetStr.toLowerCase());
    case 'starts_with':
      return valStr.toLowerCase().startsWith(targetStr.toLowerCase());
    case 'ends_with':
      return valStr.toLowerCase().endsWith(targetStr.toLowerCase());
    case 'eq':
      return valStr.toLowerCase() === targetStr.toLowerCase();
    case 'gt':
      return isValNum && isTargetNum && valNum > targetNum;
    case 'gte':
      return isValNum && isTargetNum && valNum >= targetNum;
    case 'lt':
      return isValNum && isTargetNum && valNum < targetNum;
    case 'lte':
      return isValNum && isTargetNum && valNum <= targetNum;
    case 'eq_num':
      return isValNum && isTargetNum && valNum === targetNum;
    case 'not_eq_num':
      return isValNum && isTargetNum && valNum !== targetNum;
    case 'between':
      return isValNum && isTargetNum && isTargetNum2 && valNum >= targetNum && valNum <= targetNum2;
    case 'not_between':
      return isValNum && isTargetNum && isTargetNum2 && (valNum < targetNum || valNum > targetNum2);
    default:
      return false;
  }
}

// セルに適用する最終的な書式オブジェクトを作成
function getCellFormatStyles(screenType, rowIndex, colId, rowData, cellValue) {
  let styleObj = {};
  
  // 1. 個別セル書式をロード
  const cellKey = `${rowIndex}_${colId}`;
  let customStyles = {};
  if (screenType === 'jo') {
    const master = (state.joMasterCellStyles && state.joMasterCellStyles[cellKey]) || {};
    const user = (state.joCellStyles && state.joCellStyles[cellKey]) || {};
    customStyles = Object.assign({}, master, user);
  } else if (screenType === 'ap') {
    const master = (state.apMasterCellStyles && state.apMasterCellStyles[cellKey]) || {};
    const user = (state.apCellStyles && state.apCellStyles[cellKey]) || {};
    customStyles = Object.assign({}, master, user);
  } else if (screenType === 'ag') {
    const master = (state.agMasterCellStyles && state.agMasterCellStyles[cellKey]) || {};
    const user = (state.agCellStyles && state.agCellStyles[cellKey]) || {};
    customStyles = Object.assign({}, master, user);
  } else if (screenType === 'dbmake') {
    const user = (state.dbmakeCellStyles && state.dbmakeCellStyles[cellKey]) || {};
    customStyles = Object.assign({}, user);
  }
  
  if (customStyles.fontWeight) styleObj['font-weight'] = customStyles.fontWeight;
  if (customStyles.fontStyle) styleObj['font-style'] = customStyles.fontStyle;
  if (customStyles.textDecoration) styleObj['text-decoration'] = customStyles.textDecoration;
  
  if (customStyles.textAlign) styleObj['text-align'] = customStyles.textAlign;
  if (customStyles.verticalAlign) styleObj['vertical-align'] = customStyles.verticalAlign;
  
  if (customStyles.whiteSpace) styleObj['white-space'] = customStyles.whiteSpace;
  if (customStyles.overflow) styleObj['overflow'] = customStyles.overflow;
  if (customStyles.textOverflow) styleObj['text-overflow'] = customStyles.textOverflow;
  
  if (customStyles.fontSize) styleObj['font-size'] = customStyles.fontSize;
  
  if (customStyles.color) {
    styleObj['color'] = adjustColorForTheme(customStyles.color, false);
  }
  if (customStyles.bg) {
    styleObj['background-color'] = adjustColorForTheme(customStyles.bg, true);
  }
  
  // 2. 条件付き書式ルールを上書き適用
  const rules = state.conditionalFormats[screenType] || [];
  
  let columns = [];
  let contracts = [];
  let visibleColumnIds = [];
  if (screenType === 'jo') {
    columns = state.joColumns;
    contracts = state.joContracts;
    visibleColumnIds = state.joVisibleColumns;
  } else if (screenType === 'ap') {
    columns = state.apColumns;
    contracts = state.apContracts;
    visibleColumnIds = state.apVisibleColumns;
  } else if (screenType === 'ag') {
    columns = state.agColumns;
    contracts = state.agContracts;
    visibleColumnIds = state.agVisibleColumns;
  }
  
  const cellRowIndex = contracts.findIndex(c => c.customerId === rowIndex);
  const cellColIndex = visibleColumnIds.indexOf(colId);

  if (cellRowIndex !== -1 && cellColIndex !== -1) {
    for (const rule of rules) {
      const range = parseGoogleRange(rule.rangeStr, columns, contracts, visibleColumnIds);
      
      if (cellRowIndex >= range.startRow && cellRowIndex <= range.endRow &&
          cellColIndex >= range.startCol && cellColIndex <= range.endCol) {
        
        if (evaluateCondition(cellValue, rule.operator, rule.value, rule.value2)) {
          if (rule.bg && rule.bg !== 'transparent') {
            styleObj['background-color'] = adjustColorForTheme(rule.bg, true);
          }
          if (rule.color && rule.color !== 'var(--text-primary)') {
            styleObj['color'] = adjustColorForTheme(rule.color, false);
          }
          if (rule.bold) {
            styleObj['font-weight'] = 'bold';
          }
          if (rule.italic) {
            styleObj['font-style'] = 'italic';
          }
          if (rule.underline) {
            styleObj['text-decoration'] = styleObj['text-decoration'] 
              ? styleObj['text-decoration'] + ' underline' 
              : 'underline';
          }
          if (rule.strike) {
            styleObj['text-decoration'] = styleObj['text-decoration']
              ? styleObj['text-decoration'] + ' line-through'
              : 'line-through';
          }
        }
      }
    }
  }
  
  return styleObj;
}

// ==========================================
// 5. ダッシュボード表示制御
// ==========================================
function renderDashboard() {
  // 一時保存件数バッジの更新
  const drafts = state.appointments.filter(a => a.status === 'draft');
  document.getElementById('drafts-count-badge').textContent = drafts.length;

  // 最近の一時保存（下書き）リスト
  const draftsContainer = document.getElementById('dashboard-drafts-container');
  draftsContainer.innerHTML = '';
  
  const recentDrafts = drafts.slice().sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);
  if (recentDrafts.length === 0) {
    draftsContainer.innerHTML = '<div class="empty-state"><span class="empty-state-icon">📁</span><p>一時保存データはありません</p></div>';
  } else {
    recentDrafts.forEach(draft => {
      draftsContainer.appendChild(createAppointmentItem(draft));
    });
  }

  // 最近の正式登録履歴リスト
  const historyContainer = document.getElementById('dashboard-history-container');
  historyContainer.innerHTML = '';
  
  const officials = state.appointments.filter(a => a.status === 'official');
  const recentOfficials = officials.slice().sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);
  if (recentOfficials.length === 0) {
    historyContainer.innerHTML = '<div class="empty-state"><span class="empty-state-icon">📜</span><p>アポイント履歴はありません</p></div>';
  } else {
    recentOfficials.forEach(official => {
      historyContainer.appendChild(createAppointmentItem(official));
    });
  }

  // カスタムマイパターンセレクトボックスの表示
  if (window.renderPatternOptions) {
    window.renderPatternOptions();
  }
}

function createAppointmentItem(appoint) {
  const item = document.createElement('div');
  item.className = 'history-item';

  const dateObj = new Date(appoint.date);
  const formattedDate = `${dateObj.getMonth() + 1}/${dateObj.getDate()} ${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}`;

  const dateDiv = document.createElement('div');
  dateDiv.className = 'item-date';
  dateDiv.textContent = formattedDate;

  // IDと顧客名の表示
  const nameDiv = document.createElement('div');
  nameDiv.className = 'item-name';
  nameDiv.innerHTML = `<span style="font-family: monospace; color: var(--secondary); margin-right: 0.5rem; font-weight: normal;">[ID: ${appoint.id}]</span> ${appoint.customerName || '（未入力）'}`;

  const detailsDiv = document.createElement('div');
  detailsDiv.className = 'item-details';
  detailsDiv.textContent = appoint.memo || '（メモなし）';

  // 本登録IDが紐付いている場合はバッジを表示
  if (appoint.officialId) {
    const linkBadge = document.createElement('span');
    linkBadge.className = 'badge badge-official';
    linkBadge.style.marginRight = '0.5rem';
    linkBadge.textContent = `🔗 ${appoint.officialId}`;
    nameDiv.appendChild(linkBadge);
  }

  // キャンセル（破棄）されたアポイントの場合はバッジ表示
  if (appoint.status === 'cancelled') {
    const cancelBadge = document.createElement('span');
    cancelBadge.className = 'badge';
    cancelBadge.style.background = 'rgba(239, 68, 68, 0.15)';
    cancelBadge.style.color = 'var(--danger)';
    cancelBadge.style.border = '1px solid rgba(239, 68, 68, 0.3)';
    cancelBadge.style.marginLeft = '0.5rem';
    cancelBadge.textContent = '破棄済 (cancelled)';
    nameDiv.appendChild(cancelBadge);
  }

  const actionsDiv = document.createElement('div');
  actionsDiv.className = 'item-actions';

  const actionBtn = document.createElement('button');
  if (appoint.status === 'draft') {
    actionBtn.className = 'btn-outline-primary';
    actionBtn.textContent = '編集';
    actionBtn.addEventListener('click', () => editAppointment(appoint.id));
  } else {
    actionBtn.className = 'btn-secondary';
    actionBtn.textContent = '閲覧';
    actionBtn.addEventListener('click', () => viewAppointmentDetails(appoint.id));
  }

  actionsDiv.appendChild(actionBtn);
  
  item.appendChild(dateDiv);
  item.appendChild(nameDiv);
  item.appendChild(detailsDiv);
  item.appendChild(actionsDiv);

  return item;
}

// 全ての一時保存表示
function renderAllDrafts() {
  const container = document.getElementById('full-drafts-container');
  container.innerHTML = '';
  const drafts = state.appointments.filter(a => a.status === 'draft').sort((a, b) => new Date(b.date) - new Date(a.date));
  
  if (drafts.length === 0) {
    container.innerHTML = '<div class="empty-state"><span class="empty-state-icon">📁</span><p>一時保存データはありません</p></div>';
  } else {
    drafts.forEach(draft => {
      container.appendChild(createAppointmentItem(draft));
    });
  }
}

// 全ての正式登録履歴表示 (破棄済アポイントも履歴の一部として表示する)
function renderAllHistory() {
  const container = document.getElementById('full-history-container');
  container.innerHTML = '';
  const list = state.appointments.filter(a => a.status === 'official' || a.status === 'cancelled').sort((a, b) => new Date(b.date) - new Date(a.date));
  
  if (list.length === 0) {
    container.innerHTML = '<div class="empty-state"><span class="empty-state-icon">📜</span><p>アポイント履歴はありません</p></div>';
  } else {
    list.forEach(appoint => {
      container.appendChild(createAppointmentItem(appoint));
    });
  }
}

// ==========================================
// 6. アポイント登録フォーム制御
// ==========================================



// 既存顧客選択時のUI処理
function selectCustomer(customer) {
  state.selectedExistingCustomer = customer;
  const banner = document.getElementById('existing-customer-banner');
  const form = document.getElementById('appointment-form');
  const nameGroup = document.getElementById('customer-name-group');
  
  if (customer) {
    document.getElementById('ext-info-name').textContent = `${customer.name} (${customer.furigana})`;
    document.getElementById('ext-info-id').textContent = customer.id;
    document.getElementById('ext-info-phone').textContent = customer.phone;
    document.getElementById('ext-info-email').textContent = customer.email;
    document.getElementById('ext-info-corp').textContent = customer.corp || '未登録';
    document.getElementById('ext-info-service').textContent = customer.service || 'なし';
    
    // 顧客IDに紐付く過去のアポイント履歴を取得して表示（ぶら下がりツリー構造）
    const historyListContainer = document.getElementById('ext-info-history-list');
    historyListContainer.innerHTML = '';
    
    const relatedAppoints = state.appointments.filter(
      a => a.customerId === customer.id && a.id !== state.editingAppointId
    ).sort((a, b) => new Date(b.date) - new Date(a.date));

    document.getElementById('ext-info-history').textContent = `${relatedAppoints.length}件`;

    if (relatedAppoints.length === 0) {
      historyListContainer.innerHTML = '<div style="font-size: 0.8rem; color: var(--text-muted); padding: 0.25rem 0;">└─ 過去のアポイント履歴はありません</div>';
    } else {
      relatedAppoints.forEach(appoint => {
        const dateObj = new Date(appoint.date);
        const formattedDate = `${dateObj.getFullYear()}/${dateObj.getMonth() + 1}/${dateObj.getDate()} ${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}`;
        
        const historyItem = document.createElement('div');
        historyItem.style.marginBottom = '0.5rem';
        historyItem.style.fontSize = '0.85rem';
        
        let statusBadge = '';
        if (appoint.status === 'draft') {
          statusBadge = '<span class="badge badge-draft" style="font-size: 0.65rem; padding: 0.05rem 0.25rem; margin-left: 0.5rem;">下書き</span>';
        } else if (appoint.status === 'cancelled') {
          statusBadge = '<span class="badge" style="font-size: 0.65rem; padding: 0.05rem 0.25rem; margin-left: 0.5rem; background: rgba(239, 68, 68, 0.15); color: var(--danger); border: 1px solid rgba(239, 68, 68, 0.3);">破棄済</span>';
        }

        historyItem.innerHTML = `
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div>
              <span style="font-family: monospace; color: var(--secondary); font-weight: bold;">└─ ID: ${appoint.id}</span>
              <span style="color: var(--text-secondary); margin-left: 0.5rem;">(${formattedDate})</span>
              ${statusBadge}
            </div>
            <button type="button" class="btn-text" style="font-size: 0.75rem; text-decoration: underline; color: var(--primary); padding: 0; border: none; background: transparent; cursor: pointer;" onclick="viewAppointmentDetails('${appoint.id}')">詳細</button>
          </div>
          <div style="margin-left: 1.2rem; color: var(--text-muted); font-size: 0.8rem; border-left: 1px dotted var(--border-color); padding-left: 0.5rem; margin-top: 0.1rem; margin-bottom: 0.3rem;">
            ${appoint.memo || '（メモなし）'}
          </div>
        `;
        historyListContainer.appendChild(historyItem);
      });
    }
    
    banner.style.display = 'block';
    const placeholder = document.getElementById('existing-customer-placeholder');
    if (placeholder) placeholder.style.display = 'none';

    // 類似データの検索とレンダリングを追加する
    const searchResults = searchRelatedCrossTables(customer);
    renderConnectionPanel(searchResults, false);

    // 相手の名前基本入力欄をプレフィルし、編集不可に
    const nameInput = document.getElementById('customer-name');
    if (nameInput) {
      nameInput.value = customer.name;
      nameInput.readOnly = true;
      nameInput.required = false; // 既存顧客選択時は required を解除
    }
    if (nameGroup) nameGroup.style.display = 'none';
    if (form) form.style.display = 'block';

    // その他関連IDのプリフィル処理 (ポップアップチップ式) (顧客マスタ情報から直接取得)
    const switchToggleContainer = document.getElementById('id-switch-toggle-container');
    const switchMainBtn = document.getElementById('btn-switch-main-id');
    const switchRelatedBtn = document.getElementById('btn-switch-related-id-view');
    
    let relatedId = customer.relatedCustomerId || '';
    
    // 遅延バインドの検知（新規顧客選択時の処理）：
    // 顧客マスタ上で関連IDがまだ空の場合、他の顧客マスタレコードで関連IDが現在の顧客IDに一致するものを探す
    if (!relatedId) {
      const originCustomer = state.customers.find(
        c => c.id !== customer.id && c.relatedCustomerId && c.relatedCustomerId.split(',').map(x => x.trim()).includes(customer.id)
      );
      if (originCustomer) {
        relatedId = originCustomer.id;
        customer.relatedCustomerId = relatedId;
        syncBiDirectionalRelatedCustomerId(customer.id, relatedId);
      }
    }
    
    const isViewOnly = state.tabs.find(t => t.id === state.activeTabId)?.appointData?.viewOnly || false;
    if (window.renderRelatedCustomerIdLinks) {
      window.renderRelatedCustomerIdLinks(relatedId, isViewOnly);
    }
    
    if (relatedId && switchToggleContainer) {
      switchToggleContainer.style.display = 'flex';
      switchMainBtn.textContent = `メインID (${customer.id})`;
      switchRelatedBtn.textContent = `関連ID (${relatedId})`;
      switchMainBtn.classList.add('active');
      switchRelatedBtn.classList.remove('active');
    } else {
      if (switchToggleContainer) switchToggleContainer.style.display = 'none';
    }

    setFormMode('existing');
  } else {
    banner.style.display = 'none';
    const placeholder = document.getElementById('existing-customer-placeholder');
    
    const nameInput = document.getElementById('customer-name');
    if (state.formMode === 'existing') {
      if (placeholder) placeholder.style.display = 'block';
      if (form) form.style.display = 'none';
      if (nameGroup) nameGroup.style.display = 'none';
      if (nameInput) nameInput.required = false; // 既存時は required を解除
    } else {
      if (placeholder) placeholder.style.display = 'none';
      if (form) form.style.display = 'block';
      if (nameGroup) nameGroup.style.display = 'block';
      if (nameInput) nameInput.required = true; // 新規時は required
    }
    
    if (nameInput) {
      nameInput.value = '';
      nameInput.readOnly = false;
    }
    
    // 関連ID系の表示クリア
    if (window.renderRelatedCustomerIdLinks) {
      window.renderRelatedCustomerIdLinks('', false);
    }
    const switchToggleContainer = document.getElementById('id-switch-toggle-container');
    if (switchToggleContainer) switchToggleContainer.style.display = 'none';
    
    // 関連接続リストと接続データをクリア
    state.connectedLinks = {};
    const connList = document.getElementById('ext-info-connection-list');
    if (connList) connList.innerHTML = '';
  }

  // すでに作成済みのdraftレコードの顧客情報をリアルタイム更新
  if (state.editingAppointId) {
    const appoint = state.appointments.find(a => a.id === state.editingAppointId);
    if (appoint) {
      appoint.customerType = state.formMode;
      appoint.customerId = customer ? customer.id : null;
      appoint.customerName = customer ? customer.name : document.getElementById('customer-name').value.trim();
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(state.appointments));
    }
  }
}

// 新規・既存モードの設定
function setFormMode(mode) {
  state.formMode = mode;
  const toggleNew = document.getElementById('toggle-cust-new');
  const toggleExist = document.getElementById('toggle-cust-existing');
  const selectArea = document.getElementById('top-customer-select-area');

  if (mode === 'new') {
    toggleNew.classList.add('active');
    toggleExist.classList.remove('active');
    if (selectArea) selectArea.style.display = 'none';
    selectCustomer(null);
  } else {
    toggleNew.classList.remove('active');
    toggleExist.classList.add('active');
    if (selectArea) selectArea.style.display = 'flex';
    if (!state.selectedExistingCustomer) {
      openCustomerSearchModal();
    }
  }
}

// ==========================================
// 7. 顧客検索モーダル処理
// ==========================================
function openCustomerSearchModal() {
  document.getElementById('customer-search-modal').classList.add('active');
  document.getElementById('modal-search-input').value = '';
  document.getElementById('modal-search-input').focus();
  renderModalCustomerList(state.customers);
}

function closeModal() {
  document.getElementById('customer-search-modal').classList.remove('active');
}

// モーダル内の顧客リスト描画
function renderModalCustomerList(list) {
  const container = document.getElementById('modal-customer-list');
  container.innerHTML = '';

  if (list.length === 0) {
    container.innerHTML = '<div style="padding: 1.5rem; text-align: center; color: var(--text-muted); font-size: 0.9rem;">一致する顧客は見つかりませんでした</div>';
    return;
  }

  list.forEach(cust => {
    const item = document.createElement('div');
    item.className = 'search-result-item';
    item.innerHTML = `
      <div class="search-result-title">
        ${cust.name} <span style="font-size: 0.75rem; font-weight: normal; color: var(--text-secondary);">(${cust.furigana})</span>
        <span style="font-family: monospace; font-size: 0.8rem; background: rgba(6, 182, 212, 0.15); color: var(--secondary); padding: 0.1rem 0.4rem; border-radius: 4px; float: right;">ID: ${cust.id}</span>
      </div>
      <div class="search-result-sub">会社名: ${cust.corp || 'なし'} | 電話: ${cust.phone} | サービス: ${cust.service}</div>
    `;
    item.addEventListener('click', () => {
      if (typeof targetSearchMode !== 'undefined' && targetSearchMode === 'related') {
        const relatedInput = document.getElementById('ext-info-related-id');
        if (relatedInput) {
          relatedInput.value = cust.id;
          relatedInput.readOnly = true;
          const clearBtn = document.getElementById('btn-clear-related-id');
          if (clearBtn) clearBtn.style.display = 'inline-block';
          
          const switchToggleContainer = document.getElementById('id-switch-toggle-container');
          const switchMainBtn = document.getElementById('btn-switch-main-id');
          const switchRelatedBtn = document.getElementById('btn-switch-related-id-view');
          if (switchToggleContainer && state.selectedExistingCustomer) {
            switchToggleContainer.style.display = 'flex';
            switchMainBtn.textContent = `メインID (${state.selectedExistingCustomer.id})`;
            switchRelatedBtn.textContent = `関連ID (${cust.id})`;
            switchMainBtn.classList.add('active');
            switchRelatedBtn.classList.remove('active');
          }
        }
        
        if (state.editingAppointId) {
          const appoint = state.appointments.find(a => a.id === state.editingAppointId);
          if (appoint && appoint.customerId) {
            syncBiDirectionalRelatedCustomerId(appoint.customerId, cust.id);
          }
        }
        targetSearchMode = 'main';
      } else {
        selectCustomer(cust);
      }
      closeModal();
    });
    container.appendChild(item);
  });
}

// モーダル内検索フィルター
function handleModalSearch(e) {
  const query = e.target.value.trim().toLowerCase();
  if (!query) {
    renderModalCustomerList(state.customers);
    return;
  }

  const filteredMap = new Map();

  // 1. 既存アポイント顧客 (state.customers) からの網羅的な検索
  state.customers.forEach(c => {
    let isMatch = false;

    // 基本情報一致
    if (
      c.id.toLowerCase().includes(query) ||
      c.name.toLowerCase().includes(query) ||
      c.furigana.toLowerCase().includes(query) ||
      c.phone.includes(query) ||
      (c.corp && c.corp.toLowerCase().includes(query))
    ) {
      isMatch = true;
    }

    // JO契約情報との一致
    if (!isMatch && state.joContracts) {
      const associatedJo = state.joContracts.find(jo => 
        (jo.customerPersonalityId && jo.customerPersonalityId === c.id) || 
        (jo.customerId && jo.customerId === c.id)
      );
      if (associatedJo) {
        if (
          (associatedJo.customerId && associatedJo.customerId.toLowerCase().includes(query)) ||
          (associatedJo.customerPersonalityId && associatedJo.customerPersonalityId.toLowerCase().includes(query)) ||
          (associatedJo.corpName && associatedJo.corpName.toLowerCase().includes(query)) ||
          (associatedJo.shopName && associatedJo.shopName.toLowerCase().includes(query)) ||
          (associatedJo.repName && associatedJo.repName.toLowerCase().includes(query))
        ) {
          isMatch = true;
        }
      }
    }

    // 申込者情報との一致
    if (!isMatch && state.apContracts) {
      const associatedAp = state.apContracts.find(ap => ap.customerId === c.id || ap.customerPersonalityId === c.id);
      if (associatedAp) {
        if (
          (associatedAp.customerId && associatedAp.customerId.toLowerCase().includes(query)) ||
          (associatedAp.customerPersonalityId && associatedAp.customerPersonalityId.toLowerCase().includes(query)) ||
          (associatedAp.name && associatedAp.name.toLowerCase().includes(query)) ||
          (associatedAp.phone && associatedAp.phone.includes(query))
        ) {
          isMatch = true;
        }
      }
    }

    // 代理店情報との一致
    if (!isMatch && state.agContracts) {
      const associatedAg = state.agContracts.find(ag => ag.customerId === c.id);
      if (associatedAg) {
        if (
          (associatedAg.customerId && associatedAg.customerId.toLowerCase().includes(query)) ||
          (associatedAg.name && associatedAg.name.toLowerCase().includes(query)) ||
          (associatedAg.company && associatedAg.company.toLowerCase().includes(query))
        ) {
          isMatch = true;
        }
      }
    }

    if (isMatch) {
      filteredMap.set(c.id, { ...c });
    }
  });

  // 2. マスタデータ（JO、代理店、申込者、パートナーDB）から直接名前や法人名で横断検索
  // 検索ワードが2文字以上の場合に動作
  if (query.length >= 2) {
    // J-One情報 (joContracts) から直接検索
    if (state.joContracts) {
      state.joContracts.forEach(jo => {
        const matches = 
          (jo.customerId && jo.customerId.toLowerCase().includes(query)) ||
          (jo.customerPersonalityId && jo.customerPersonalityId.toLowerCase().includes(query)) ||
          (jo.corpName && jo.corpName.toLowerCase().includes(query)) ||
          (jo.shopName && jo.shopName.toLowerCase().includes(query)) ||
          (jo.repName && jo.repName.toLowerCase().includes(query));

        if (matches) {
          const personalityId = jo.customerPersonalityId || jo.customerId;
          if (!filteredMap.has(personalityId)) {
            filteredMap.set(personalityId, {
              id: personalityId,
              name: jo.repName || '未登録',
              furigana: jo.repFurigana || '',
              phone: '',
              email: '',
              corp: jo.corpName || '',
              service: 'JO契約',
              historyCount: 0
            });
          }
        }
      });
    }

    // 代理店情報 (agContracts) から直接検索
    if (state.agContracts) {
      state.agContracts.forEach(ag => {
        const matches = 
          (ag.customerId && ag.customerId.toLowerCase().includes(query)) ||
          (ag.name && ag.name.toLowerCase().includes(query)) ||
          (ag.company && ag.company.toLowerCase().includes(query));

        if (matches) {
          const personalityId = ag.customerId;
          if (!filteredMap.has(personalityId)) {
            filteredMap.set(personalityId, {
              id: personalityId,
              name: ag.name || '未登録',
              furigana: '',
              phone: '',
              email: '',
              corp: ag.company || '',
              service: '代理店',
              historyCount: 0
            });
          }
        }
      });
    }

    // 申込者情報 (apContracts) から直接検索
    if (state.apContracts) {
      state.apContracts.forEach(ap => {
        const matches = 
          (ap.customerId && ap.customerId.toLowerCase().includes(query)) ||
          (ap.customerPersonalityId && ap.customerPersonalityId.toLowerCase().includes(query)) ||
          (ap.name && ap.name.toLowerCase().includes(query)) ||
          (ap.phone && ap.phone.includes(query));

        if (matches) {
          const personalityId = ap.customerPersonalityId || ap.customerId;
          if (!filteredMap.has(personalityId)) {
            filteredMap.set(personalityId, {
              id: personalityId,
              name: ap.name || '未登録',
              furigana: ap.furigana || '',
              phone: ap.phone || '',
              email: ap.email || '',
              corp: '',
              service: '申込者',
              historyCount: 0
            });
          }
        }
      });
    }

    // パートナーDB (dbmakePartners) から直接検索
    if (typeof dbmakePartners !== 'undefined' && dbmakePartners) {
      dbmakePartners.forEach(pt => {
        const matches = 
          (pt.id && pt.id.toLowerCase().includes(query)) ||
          (pt.registeredName && pt.registeredName.toLowerCase().includes(query)) ||
          (pt.representativeName && pt.representativeName.toLowerCase().includes(query));

        if (matches) {
          if (!filteredMap.has(pt.id)) {
            filteredMap.set(pt.id, {
              id: pt.id,
              name: pt.representativeName || '未登録',
              furigana: pt.representativeNameKana || '',
              phone: pt.phoneNumber || '',
              email: pt.email || '',
              corp: pt.registeredName || '',
              service: 'パートナーDB',
              historyCount: 0
            });
          }
        }
      });
    }
  }

  const filtered = Array.from(filteredMap.values());
  renderModalCustomerList(filtered);
}

// ==========================================
// 8. 入力項目の動的追加・削除
// ==========================================

// フィールド種別の日本語名定義
const FIELD_LABELS = {
  furigana: 'フリガナ',
  phone: '電話番号',
  email: 'メールアドレス',
  line: 'LINE名',
  address: '住所',
  corp_info: '法人情報',
  industry: '業種',
  biz_details: '事業内容',
  zoom: 'Zoom URL',
  introducer: '紹介者',
  rep_furigana: '代表者フリガナ',
  corp_furigana: '法人名フリガナ',
  corp_num: '法人番号',
  invoice_num: 'インボイス登録番号',
  rep_birthday: '代表者生年月日'
};

function addCustomField(fieldType, value = '') {
  if (state.addedCustomFields.has(fieldType)) {
    showToast(`「${FIELD_LABELS[fieldType]}」はすでに追加されています。`, 'warning');
    const existingInput = document.getElementById(`custom-field-input-${fieldType}`);
    if (existingInput) existingInput.focus();
    return;
  }

  const container = document.getElementById('custom-fields-list');
  const row = document.createElement('div');
  row.className = 'custom-field-row';
  row.id = `custom-field-row-${fieldType}`;

  let inputHtml = '';

  // 各フィールドタイプに応じたフォームを生成
  switch (fieldType) {
    case 'rep_birthday':
      inputHtml = `<input type="date" id="custom-field-input-rep_birthday" name="rep_birthday" value="${value}">`;
      break;
    case 'phone':
      inputHtml = `<input type="tel" id="custom-field-input-phone" name="phone" value="${value}" placeholder="例: 090-1234-5678">`;
      break;
    case 'email':
      inputHtml = `<input type="email" id="custom-field-input-email" name="email" value="${value}" placeholder="例: sample@example.com">`;
      break;
    case 'zoom':
      inputHtml = `<input type="text" id="custom-field-input-zoom" name="zoom" value="${value}" placeholder="https://zoom.us/j/...">`;
      break;
    case 'corp_info':
      // 法人番号API連携用の特別なHTML
      inputHtml = `
        <div style="background: var(--bg-surface-elevated); padding: 1rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color); width: 100%;">
          <div style="position: relative; margin-bottom: 0.75rem;">
            <label style="font-size: 0.75rem;">法人検索 <span class="api-badge">国税庁API連携シミュレーター</span></label>
            <input type="text" id="corp-search-api-input" placeholder="会社名で検索（例：トヨタ、ソニー）..." style="padding: 0.5rem; font-size: 0.8rem;">
            <div id="corp-api-dropdown" class="search-results-dropdown"></div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; font-size: 0.8rem;">
            <div>
              <label style="font-size: 0.7rem;">正式法人名</label>
              <input type="text" id="corp-info-name" name="corp_name" value="${value.name || ''}" placeholder="会社名" style="padding: 0.4rem; font-size: 0.8rem;">
            </div>
            <div>
              <label style="font-size: 0.7rem;">法人番号</label>
              <input type="text" id="corp-info-code" name="corp_code" value="${value.code || ''}" placeholder="法人番号" readonly style="padding: 0.4rem; font-size: 0.8rem; background: var(--bg-surface); opacity: 0.7;">
            </div>
            <div style="grid-column: span 2;">
              <label style="font-size: 0.7rem;">本店所在地</label>
              <input type="text" id="corp-info-address" name="corp_address" value="${value.address || ''}" placeholder="本店所在地" readonly style="padding: 0.4rem; font-size: 0.8rem; background: var(--bg-surface); opacity: 0.7;">
            </div>
          </div>
        </div>
      `;
      break;
    case 'introducer':
      // 紹介者検索用の特別なHTML
      inputHtml = `
        <div style="background: var(--bg-surface-elevated); padding: 1rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color); width: 100%;">
          <div style="position: relative; margin-bottom: 0.5rem;">
            <label style="font-size: 0.75rem;">紹介者検索 <span class="api-badge" style="background: var(--primary-glow); color: var(--primary); border-color: rgba(99,102,241,0.3)">代理店DB連携</span></label>
            <input type="text" id="introducer-search-input" placeholder="名前で検索（例：田中、高橋）..." style="padding: 0.5rem; font-size: 0.8rem;">
            <div id="introducer-api-dropdown" class="search-results-dropdown"></div>
          </div>
          <div id="introducer-attached-box" style="display: ${value ? 'flex' : 'none'};">
            <!-- 選択された紹介者バッジ -->
            <div class="introducer-display-box" style="width: 100%;">
              <div>
                <span class="badge badge-existing" id="intro-status-badge">${value ? value.status : ''}</span>
                <span class="introducer-name" id="intro-display-name" style="margin-left: 0.5rem;">${value ? value.name : ''}</span>
                <div class="introducer-meta" id="intro-display-meta" style="margin-top: 0.2rem;">
                  所属: ${value ? value.company : ''} | 過去アポイント: ${value ? value.count : 0}件
                </div>
              </div>
              <button type="button" class="btn-text" id="btn-remove-introducer" style="color: var(--danger); font-size: 0.75rem;">解除</button>
            </div>
          </div>
          <input type="hidden" id="custom-field-input-introducer" name="introducer" value="${value ? JSON.stringify(value) : ''}">
        </div>
      `;
      break;
    default:
      inputHtml = `<input type="text" id="custom-field-input-${fieldType}" name="${fieldType}" value="${value}" placeholder="${FIELD_LABELS[fieldType]}を入力">`;
  }

  row.innerHTML = `
    <div class="form-group" style="flex: 1; position: relative;">
      <label>${FIELD_LABELS[fieldType]}</label>
      ${inputHtml}
    </div>
    <button type="button" class="btn-danger btn-icon-only" style="height: 42px; margin-bottom: 0px;" onclick="removeCustomField('${fieldType}')">🗑️</button>
  `;

  container.appendChild(row);
  state.addedCustomFields.add(fieldType);

  // イベント設定
  if (fieldType === 'corp_info') {
    setupCorpApiSearch();
  } else if (fieldType === 'introducer') {
    setupIntroducerSearch(value);
  } else {
    // リアルタイム関連データ検知のトリガーを設定
    const inputEl = document.getElementById(`custom-field-input-${fieldType}`);
    if (inputEl) {
      inputEl.addEventListener('input', (e) => {
        detectRelatedData(fieldType, e.target.value.trim());
        triggerCrossTableSearchOnInput();
      });
    }
  }

  // 相手の名前基本フィールドも監視するため追加
  if (fieldType === 'furigana') {
    const inputEl = document.getElementById(`custom-field-input-furigana`);
    inputEl.addEventListener('input', (e) => {
      detectRelatedData('name_or_furigana', e.target.value.trim());
      triggerCrossTableSearchOnInput();
    });
  }

  // チェックボックスの状態を同期
  const chk = document.getElementById(`chk-field-${fieldType}`);
  if (chk) {
    chk.checked = true;
  }
}

// 相手の名前基本フィールドも監視
document.getElementById('customer-name').addEventListener('input', (e) => {
  if (state.formMode === 'new') {
    detectRelatedData('name_or_furigana', e.target.value.trim());
  }
  triggerCrossTableSearchOnInput();
});

// カスタム項目の削除
function removeCustomField(fieldType) {
  const row = document.getElementById(`custom-field-row-${fieldType}`);
  if (row) {
    row.remove();
    state.addedCustomFields.delete(fieldType);
  }
  
  // チェックボックスの状態を同期
  const chk = document.getElementById(`chk-field-${fieldType}`);
  if (chk) {
    chk.checked = false;
  }
  
  // 紹介者のリセット
  if (fieldType === 'introducer') {
    state.selectedIntroducer = null;
  }

  // 関連アラート非表示チェック（該当項目が消えたら消す）
  checkAlertVisibility();
}

// アラートの表示条件チェック
function checkAlertVisibility() {
  const phoneVal = document.getElementById('custom-field-input-phone')?.value.trim() || '';
  const emailVal = document.getElementById('custom-field-input-email')?.value.trim() || '';
  const nameVal = document.getElementById('customer-name').value.trim();

  if (!phoneVal && !emailVal && !nameVal) {
    document.getElementById('related-data-alert').style.display = 'none';
  }
}

// ==========================================
// 9. API連携および自動補完シミュレーション
// ==========================================

// 法人番号検索APIシミュレーション
function setupCorpApiSearch() {
  const searchInput = document.getElementById('corp-search-api-input');
  const dropdown = document.getElementById('corp-api-dropdown');
  const nameInput = document.getElementById('corp-info-name');
  const codeInput = document.getElementById('corp-info-code');
  const addrInput = document.getElementById('corp-info-address');

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();
    if (!query) {
      dropdown.style.display = 'none';
      return;
    }

    // モックデータで検索
    const matched = MOCK_CORPORATES.filter(c => c.name.toLowerCase().includes(query));
    
    dropdown.innerHTML = '';
    if (matched.length === 0) {
      dropdown.innerHTML = '<div class="search-result-item" style="color: var(--text-muted);">候補が見つかりません</div>';
    } else {
      matched.forEach(corp => {
        const item = document.createElement('div');
        item.className = 'search-result-item';
        item.innerHTML = `
          <div class="search-result-title">${corp.name}</div>
          <div class="search-result-sub">所在地: ${corp.address}</div>
        `;
        item.addEventListener('click', () => {
          nameInput.value = corp.name;
          codeInput.value = corp.code;
          addrInput.value = corp.address;
          searchInput.value = corp.name;
          dropdown.style.display = 'none';
          
          showToast('法人情報を自動補完しました。', 'success');
          
          // 関連データ検知（法人名）
          detectRelatedData('corp', corp.name);
          triggerCrossTableSearchOnInput();
        });
        dropdown.appendChild(item);
      });
    }
    dropdown.style.display = 'block';
  });

  // ドロップダウン外クリックで閉じる
  document.addEventListener('mousedown', (e) => {
    if (e.target !== searchInput && e.target !== dropdown) {
      dropdown.style.display = 'none';
    }
  }, true);
}

// 紹介者検索DBシミュレーション
function setupIntroducerSearch(existingValue = null) {
  const searchInput = document.getElementById('introducer-search-input');
  const dropdown = document.getElementById('introducer-api-dropdown');
  const attachedBox = document.getElementById('introducer-attached-box');
  const hiddenInput = document.getElementById('custom-field-input-introducer');
  const displayName = document.getElementById('intro-display-name');
  const displayMeta = document.getElementById('intro-display-meta');
  const statusBadge = document.getElementById('intro-status-badge');
  const removeBtn = document.getElementById('btn-remove-introducer');

  if (existingValue) {
    state.selectedIntroducer = existingValue;
  }

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();
    if (!query) {
      dropdown.style.display = 'none';
      return;
    }

    const matched = MOCK_INTRODUCERS.filter(i => 
      i.name.toLowerCase().includes(query) || i.company.toLowerCase().includes(query)
    );

    dropdown.innerHTML = '';
    if (matched.length === 0) {
      dropdown.innerHTML = '<div class="search-result-item" style="color: var(--text-muted);">紹介者候補が見つかりません</div>';
    } else {
      matched.forEach(intro => {
        const item = document.createElement('div');
        item.className = 'search-result-item';
        item.innerHTML = `
          <div class="search-result-title">${intro.name} <span class="badge badge-new" style="font-size: 0.65rem; margin-left: 0.5rem; padding: 0.05rem 0.3rem;">類似度: ${intro.similarity}%</span></div>
          <div class="search-result-sub">${intro.company} | アポイント: ${intro.count}回</div>
        `;
        item.addEventListener('click', () => {
          state.selectedIntroducer = intro;
          hiddenInput.value = JSON.stringify(intro);
          displayName.textContent = intro.name;
          displayMeta.textContent = `所属: ${intro.company} | 過去アポイント: ${intro.count}件`;
          statusBadge.textContent = intro.status;
          
          attachedBox.style.display = 'flex';
          searchInput.value = '';
          dropdown.style.display = 'none';
          
          showToast('紹介者を紐付けました。', 'success');
        });
        dropdown.appendChild(item);
      });
    }
    dropdown.style.display = 'block';
  });

  removeBtn.addEventListener('click', () => {
    state.selectedIntroducer = null;
    hiddenInput.value = '';
    attachedBox.style.display = 'none';
  });

  // ドロップダウン外クリックで閉じる
  document.addEventListener('mousedown', (e) => {
    if (e.target !== searchInput && e.target !== dropdown) {
      dropdown.style.display = 'none';
    }
  }, true);
}

// 関連データ検知シミュレーション
function detectRelatedData(fieldType, value) {
  if (state.formMode === 'existing') return; // 既存顧客紐付けモード中は検知不要
  if (!value || value.length < 3) {
    checkAlertVisibility();
    return;
  }

  let matched = null;

  if (fieldType === 'phone') {
    // 電話番号部分一致
    matched = state.customers.find(c => c.phone.replace(/[^0-9]/g, '').includes(value.replace(/[^0-9]/g, '')));
  } else if (fieldType === 'email') {
    // メール完全一致
    matched = state.customers.find(c => c.email.toLowerCase() === value.toLowerCase());
  } else if (fieldType === 'name_or_furigana') {
    // 名前・フリガナ部分一致
    matched = state.customers.find(c => c.name.includes(value) || c.furigana.includes(value));
  } else if (fieldType === 'corp') {
    // 法人名一致
    matched = state.customers.find(c => c.corp && c.corp.includes(value));
  }

  const alertBox = document.getElementById('related-data-alert');
  const alertText = document.getElementById('related-data-alert-text');
  const mergeBtn = document.getElementById('btn-merge-existing');

  if (matched) {
    alertText.textContent = `入力された情報 "${value}" に類似・一致する顧客データ "${matched.name} (${matched.corp || '所属なし'})" が既に存在します。`;
    mergeBtn.dataset.matchedId = matched.id;
    alertBox.style.display = 'flex';
  } else {
    checkAlertVisibility();
  }
}

// 新規追加：4つのテーブル（申込者、JO、代理店、パートナー）を顧客情報で横断検索し類似データを抽出する
function searchRelatedCrossTables(customer) {
  if (!customer) return [];
  
  const results = [];
  const name = (customer.name || '').trim().toLowerCase();
  const furigana = (customer.furigana || '').trim().toLowerCase();
  const phone = (customer.phone || '').replace(/[^0-9]/g, '');
  const email = (customer.email || '').trim().toLowerCase();
  const corp = (customer.corp || '').trim().toLowerCase();

  // 詳細な検索キーの取得
  const repFurigana = (customer.repFurigana || '').trim().toLowerCase();
  const corpFurigana = (customer.corpFurigana || '').trim().toLowerCase();
  const corpNum = (customer.corpNum || '').trim().replace(/[^0-9]/g, '');
  const invoiceNum = (customer.invoiceNum || '').trim().toLowerCase();
  const repBirthday = (customer.repBirthday || '').trim();

  // 確定している顧客ID
  const targetId = customer.id || customer.customerId;

  // 1. 申込者情報 (state.apContracts) から類似検索
  if (state.apContracts) {
    state.apContracts.forEach(ap => {
      const apId = ap.customerId || `AP-${ap.name}`;
      
      // IDが確定している場合は、ID完全一致のみに絞り込む
      if (targetId) {
        if (apId === targetId) {
          results.push({
            type: 'applicant',
            typeLabel: '申込者情報',
            id: apId,
            title: `${ap.name} (${ap.status || '未対応'})`,
            sub: `電話: ${ap.phone || 'なし'} | メール: ${ap.email || 'なし'}`,
            score: 100,
            reasons: '同一人格ID一致',
            original: ap
          });
        }
        return;
      }

      let score = 0;
      let reasons = [];

      const inputQuery = (name || corp || '').trim().toUpperCase();
      if (inputQuery && apId && apId.toUpperCase().includes(inputQuery)) {
        score += 80;
        reasons.push('顧客ID一致');
      }
      
      const apName = (ap.name || '').trim().toLowerCase();
      const apFurigana = (ap.furigana || '').trim().toLowerCase();
      const apPhone = (ap.phone || '').replace(/[^0-9]/g, '');
      const apEmail = (ap.email || '').trim().toLowerCase();

      if (name && apName && (apName.includes(name) || name.includes(apName))) {
        score += 40;
        reasons.push('氏名類似');
      }
      if (furigana && apFurigana && (apFurigana.includes(furigana) || furigana.includes(apFurigana))) {
        score += 30;
        reasons.push('フリガナ類似');
      }
      if (phone && apPhone && (apPhone.includes(phone) || phone.includes(apPhone))) {
        score += 50;
        reasons.push('電話番号一致');
      }
      if (email && apEmail && apEmail === email) {
        score += 60;
        reasons.push('メール完全一致');
      }

      if (score > 0) {
        results.push({
          type: 'applicant',
          typeLabel: '申込者情報',
          id: ap.customerId || `AP-${ap.name}`,
          title: `${ap.name} (${ap.status || '未対応'})`,
          sub: `電話: ${ap.phone || 'なし'} | メール: ${ap.email || 'なし'}`,
          score: score,
          reasons: reasons.join(', '),
          original: ap
        });
      }
    });
  }

  // 2. JO情報 (state.joContracts) から類似検索
  if (state.joContracts) {
    state.joContracts.forEach(jo => {
      const joId = jo.customerPersonalityId || jo.customerId || `JO-${jo.corpName}`;
      
      // IDが確定している場合は、ID完全一致のみに絞り込む
      if (targetId) {
        if (joId === targetId) {
          results.push({
            type: 'jo',
            typeLabel: 'JO情報',
            id: joId,
            title: `${jo.corpName} [${jo.status || '不明'}]`,
            sub: `代表: ${jo.repName || 'なし'} | 店舗: ${jo.shopName || 'なし'} (${jo.shopMedia || ''})`,
            score: 100,
            reasons: '同一人格ID一致',
            original: jo
          });
        }
        return;
      }

      let score = 0;
      let reasons = [];

      const inputQuery = (name || corp || '').trim().toUpperCase();
      if (inputQuery) {
        if (jo.customerId && jo.customerId.toUpperCase().includes(inputQuery)) {
          score += 80;
          reasons.push('顧客番号一致');
        }
        if (jo.customerPersonalityId && jo.customerPersonalityId.toUpperCase().includes(inputQuery)) {
          score += 80;
          reasons.push('顧客ID一致');
        }
      }

      const joCorp = (jo.corpName || '').trim().toLowerCase();
      const joFurigana = (jo.furigana || '').trim().toLowerCase(); // 法人フリガナ
      const joRep = (jo.repName || '').trim().toLowerCase();
      const joRepFurigana = (jo.repFurigana || '').trim().toLowerCase();

      // 法人名
      if (corp && joCorp && (joCorp.includes(corp) || corp.includes(joCorp))) {
        score += 50;
        reasons.push('法人名類似');
      }
      if (name && joCorp && (joCorp.includes(name) || name.includes(joCorp))) {
        score += 40;
        reasons.push('法人名類似(名前から)');
      }
      
      // 法人フリガナ
      if (corpFurigana && joFurigana && (joFurigana.includes(corpFurigana) || corpFurigana.includes(joFurigana))) {
        score += 40;
        reasons.push('法人フリガナ一致');
      }
      if (furigana && joFurigana && (joFurigana.includes(furigana) || joFurigana.includes(joFurigana))) {
        score += 30;
        reasons.push('フリガナ類似(法人)');
      }

      // 代表者名
      if (joRep && name && (joRep.includes(name) || name.includes(joRep))) {
        score += 30;
        reasons.push('代表者名類似');
      }
      
      // 代表者フリガナ
      if (repFurigana && joRepFurigana && (joRepFurigana.includes(repFurigana) || repFurigana.includes(joRepFurigana))) {
        score += 45;
        reasons.push('代表者フリガナ一致');
      }
      if (furigana && joRepFurigana && (joRepFurigana.includes(furigana) || furigana.includes(joRepFurigana))) {
        score += 30;
        reasons.push('フリガナ類似(代表)');
      }

      if (score > 0) {
        results.push({
          type: 'jo',
          typeLabel: 'JO情報',
          id: jo.customerPersonalityId || jo.customerId || `JO-${jo.corpName}`,
          title: `${jo.corpName} [${jo.status || '不明'}]`,
          sub: `代表: ${jo.repName || 'なし'} | 店舗: ${jo.shopName || 'なし'} (${jo.shopMedia || ''})`,
          score: score,
          reasons: reasons.join(', '),
          original: jo
        });
      }
    });
  }

  // 3. 代理店情報 (state.agContracts) から類似検索
  if (state.agContracts) {
    state.agContracts.forEach(ag => {
      const agId = ag.customerId || `AG-${ag.name}`;
      
      // IDが確定している場合は、ID完全一致のみに絞り込む
      if (targetId) {
        if (agId === targetId) {
          results.push({
            type: 'agency',
            typeLabel: '代理店情報',
            id: agId,
            title: `${ag.name} (${ag.status || 'パートナー'})`,
            sub: `提携先: ${ag.company || 'なし'} | アポ数: ${ag.count || '0'}`,
            score: 100,
            reasons: '同一人格ID一致',
            original: ag
          });
        }
        return;
      }

      let score = 0;
      let reasons = [];

      const inputQuery = (name || corp || '').trim().toUpperCase();
      if (inputQuery && agId && agId.toUpperCase().includes(inputQuery)) {
        score += 80;
        reasons.push('顧客ID一致');
      }

      const agName = (ag.name || '').trim().toLowerCase();
      const agCompany = (ag.company || '').trim().toLowerCase();

      // 代表・名前
      if (name && agName && (agName.includes(name) || name.includes(agName))) {
        score += 40;
        reasons.push('代理店名類似');
      }
      
      // 法人・提携会社名
      if (corp && agCompany && (agCompany.includes(corp) || corp.includes(agCompany))) {
        score += 40;
        reasons.push('提携会社名類似');
      }
      if (name && agCompany && (agCompany.includes(name) || name.includes(agCompany))) {
        score += 30;
        reasons.push('提携会社名類似(名前から)');
      }

      if (score > 0) {
        results.push({
          type: 'agency',
          typeLabel: '代理店情報',
          id: ag.customerId || `AG-${ag.name}`,
          title: `${ag.name} (${ag.status || 'パートナー'})`,
          sub: `提携先: ${ag.company || 'なし'} | アポ数: ${ag.count || '0'}`,
          score: score,
          reasons: reasons.join(', '),
          original: ag
        });
      }
    });
  }

  // 4. パートナーDB (dbmakePartners) から類似検索
  if (typeof dbmakePartners !== 'undefined' && dbmakePartners) {
    dbmakePartners.forEach(pt => {
      const ptId = pt.id || `PT-${pt.registeredName}`;
      
      // IDが確定している場合は、ID完全一致のみに絞り込む
      if (targetId) {
        if (ptId === targetId) {
          results.push({
            type: 'partner',
            typeLabel: 'パートナーDB',
            id: ptId,
            title: `${pt.registeredName} [${pt.status || '稼働'}]`,
            sub: `代表: ${pt.representativeName || 'なし'} | 電話: ${pt.phoneNumber || 'なし'}`,
            score: 100,
            reasons: '同一人格ID一致',
            original: pt
          });
        }
        return;
      }

      let score = 0;
      let reasons = [];

      const inputQuery = (name || corp || '').trim().toUpperCase();
      if (inputQuery && ptId && ptId.toUpperCase().includes(inputQuery)) {
        score += 80;
        reasons.push('パートナーID一致');
      }

      const ptName = (pt.registeredName || '').trim().toLowerCase();
      const ptNameKana = (pt.registeredNameKana || '').trim().toLowerCase();
      const ptRep = (pt.representativeName || '').trim().toLowerCase();
      const ptRepKana = (pt.representativeNameKana || '').trim().toLowerCase();
      const ptPhone = (pt.phoneNumber || '').replace(/[^0-9]/g, '');
      const ptEmail = (pt.email || '').trim().toLowerCase();
      
      // 新しいフィールド
      const ptCorpNum = (pt.corpNum || '').trim().replace(/[^0-9]/g, '');
      const ptInvoiceNum = (pt.invoiceNum || '').trim().toLowerCase();
      const ptBirthday = (pt.birthday || '').trim(); // 代表生年月日

      // 登録法人名
      if (corp && ptName && (ptName.includes(corp) || corp.includes(ptName))) {
        score += 50;
        reasons.push('登録法人名類似');
      }
      if (name && ptName && (ptName.includes(name) || name.includes(ptName))) {
        score += 40;
        reasons.push('登録名・法人名類似(名前から)');
      }
      
      // 法人名フリガナ
      if (corpFurigana && ptNameKana && (ptNameKana.includes(corpFurigana) || corpFurigana.includes(ptNameKana))) {
        score += 45;
        reasons.push('登録名フリガナ一致');
      }
      if (furigana && ptNameKana && (ptNameKana.includes(furigana) || ptNameKana.includes(ptNameKana))) {
        score += 30;
        reasons.push('フリガナ類似(登録名)');
      }

      // 代表者名
      if (name && ptRep && (ptRep.includes(name) || name.includes(ptRep))) {
        score += 30;
        reasons.push('代表者名類似');
      }

      // 代表者フリガナ
      if (repFurigana && ptRepKana && (ptRepKana.includes(repFurigana) || repFurigana.includes(ptRepKana))) {
        score += 45;
        reasons.push('代表者フリガナ一致');
      }

      // 電話番号
      if (phone && ptPhone && (ptPhone.includes(phone) || phone.includes(ptPhone))) {
        score += 50;
        reasons.push('電話番号一致');
      }

      // メールアドレス
      if (email && ptEmail && ptEmail === email) {
        score += 60;
        reasons.push('メール完全一致');
      }

      // 法人番号
      if (corpNum && ptCorpNum && (ptCorpNum.includes(corpNum) || corpNum.includes(ptCorpNum))) {
        score += 60;
        reasons.push('法人番号一致');
      }

      // インボイス登録番号
      if (invoiceNum && ptInvoiceNum && (ptInvoiceNum.includes(invoiceNum) || invoiceNum.includes(ptInvoiceNum))) {
        score += 60;
        reasons.push('インボイス番号一致');
      }

      // 代表者生年月日
      if (repBirthday && ptBirthday && ptBirthday === repBirthday) {
        score += 55;
        reasons.push('代表者生年月日一致');
      }

      if (score > 0) {
        results.push({
          type: 'partner',
          typeLabel: 'パートナーDB',
          id: ptId,
          title: `${pt.registeredName} [${pt.status || '稼働'}]`,
          sub: `代表: ${pt.representativeName || 'なし'} | 電話: ${pt.phoneNumber || 'なし'}`,
          score: score,
          reasons: reasons.join(', '),
          original: pt
        });
      }
    });
  }

  return results.sort((a, b) => b.score - a.score);
}

function renderGroupTable(type, items, panel) {
  if (items.length === 0) return false;

  const thStyle = `style="text-align: left !important; width: 180px !important; min-width: 180px !important; padding-right: 1.5rem !important; white-space: nowrap !important; font-weight: 600; color: var(--text-muted);"`;
  const tdStyle = `style="text-align: left !important; color: var(--text-primary) !important; word-break: break-all !important;"`;

  const cardTitleMap = {
    partner: 'パートナーDB',
    applicant: '申込者情報',
    agency: '代理店情報',
    jo: 'JO情報'
  };

  if (type === 'jo') {
    const isConnected = state.connectedLinks && state.connectedLinks[type] === items[0].id;
    let buttonHtml = '';
    if (isViewOnly) {
      if (isConnected) {
        buttonHtml = `<span class="badge badge-official" style="font-size: 0.7rem; padding: 0.15rem 0.4rem;">接続中</span>`;
      }
    } else {
      if (isConnected) {
        buttonHtml = `<button type="button" class="btn-secondary" style="padding: 0.2rem 0.5rem; font-size: 0.7rem;" onclick="toggleTabConnection('${type}', '${items[0].id}', false)">接続解除</button>`;
      } else {
        buttonHtml = `<button type="button" class="btn-outline-primary" style="padding: 0.2rem 0.5rem; font-size: 0.7rem;" onclick="toggleTabConnection('${type}', '${items[0].id}', true)">接続する</button>`;
      }
    }

    const firstJo = items[0].original;
    let commonRows = `
      <tr><th ${thStyle}>J-One顧客番号</th><td ${tdStyle}>${firstJo.customerId || 'ー'}</td></tr>
      <tr><th ${thStyle}>正式法人名</th><td ${tdStyle}>${firstJo.corpName}</td></tr>
      <tr><th ${thStyle}>法人名フリガナ</th><td ${tdStyle}>${firstJo.furigana || 'ー'}</td></tr>
      <tr><th ${thStyle}>代表者名 (フリガナ)</th><td ${tdStyle}>${firstJo.repName} (${firstJo.repFurigana || 'ー'})</td></tr>
    `;

    let shopsHtml = '';
    items.forEach((item, idx) => {
      const jo = item.original;
      shopsHtml += `
        <div class="jo-shop-sub-card" style="margin-top: 0.75rem; padding: 0.65rem; background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-color); border-radius: var(--radius-sm);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.4rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding-bottom: 0.25rem;">
            <span class="badge" style="font-size: 0.7rem; font-weight: bold; background: var(--primary); color: white; padding: 0.15rem 0.45rem; border-radius: 3px;">店舗 #${idx+1} [${jo.shopMedia || '不明'}]</span>
            <span style="font-size: 0.7rem; color: var(--text-secondary);">運営状況: <strong>${jo.status || 'ー'}</strong></span>
          </div>
          <table class="ext-db-detail-table">
            <tr><th ${thStyle}>店舗名</th><td ${tdStyle}>${jo.shopName || 'ー'}</td></tr>
            <tr><th ${thStyle}>店舗URL</th><td ${tdStyle}><a href="${jo.shopUrl}" target="_blank" style="color: var(--primary); text-decoration: underline;">${jo.shopUrl || 'ー'}</a></td></tr>
            <tr><th ${thStyle}>楽天審査</th><td ${tdStyle}>${jo.rakutenPassed || 'ー'}</td></tr>
            <tr><th ${thStyle}>進捗フォルダ</th><td ${tdStyle}>${jo.folder || 'ー'}</td></tr>
            <tr><th ${thStyle}>元帳作成</th><td ${tdStyle}>${jo.ledgerSheet || 'ー'}</td></tr>
            <tr><th ${thStyle}>契約書</th><td ${tdStyle}>${jo.contract || 'ー'}</td></tr>
            <tr><th ${thStyle}>引き渡し日</th><td ${tdStyle}>${jo.handoverDate || 'ー'}</td></tr>
            <tr><th ${thStyle}>報酬発生日</th><td ${tdStyle}>${jo.rewardStartDate || 'ー'}</td></tr>
          </table>
        </div>
      `;
    });

    const detailTable = `
      <div class="ext-db-detail-card">
        <div class="ext-db-detail-card-header">
          <span class="ext-db-detail-card-title">値（${cardTitleMap[type]}）</span>
          ${buttonHtml}
        </div>
        <table class="ext-db-detail-table">
          ${commonRows}
        </table>
        <div style="margin-top: 0.85rem; font-size: 0.75rem; font-weight: bold; color: var(--text-secondary); border-top: 1px dashed var(--border-color); padding-top: 0.5rem; display: flex; align-items: center; gap: 0.35rem;">
          🛍️ 運営店舗一覧 (${items.length}件):
        </div>
        ${shopsHtml}
      </div>
    `;

    panel.innerHTML += detailTable;
  } else {
    items.forEach((item, index) => {
      const isConnected = state.connectedLinks && state.connectedLinks[type] === item.id;
      let buttonHtml = '';
      
      if (isViewOnly) {
        if (isConnected) {
          buttonHtml = `<span class="badge badge-official" style="font-size: 0.7rem; padding: 0.15rem 0.4rem;">接続中</span>`;
        }
      } else {
        if (isConnected) {
          buttonHtml = `<button type="button" class="btn-secondary" style="padding: 0.2rem 0.5rem; font-size: 0.7rem;" onclick="toggleTabConnection('${type}', '${item.id}', false)">接続解除</button>`;
        } else {
          buttonHtml = `<button type="button" class="btn-outline-primary" style="padding: 0.2rem 0.5rem; font-size: 0.7rem;" onclick="toggleTabConnection('${type}', '${item.id}', true)">接続する</button>`;
        }
      }

      let tableRows = '';
      if (type === 'partner') {
        const partner = item.original;
        tableRows = `
          <tr><th ${thStyle}>正式法人名</th><td ${tdStyle}>${partner.registeredName}</td></tr>
          <tr><th ${thStyle}>代表者名 (フリガナ)</th><td ${tdStyle}>${partner.representativeName} (${partner.representativeNameKana || 'ー'})</td></tr>
          <tr><th ${thStyle}>生年月日</th><td ${tdStyle}>${partner.birthday || 'ー'}</td></tr>
          <tr><th ${thStyle}>電話番号</th><td ${tdStyle}>${partner.phoneNumber || 'ー'}</td></tr>
          <tr><th ${thStyle}>メールアドレス</th><td ${tdStyle}>${partner.email || 'ー'}</td></tr>
          <tr><th ${thStyle}>法人番号</th><td ${tdStyle}>${partner.corpNum || 'ー'}</td></tr>
          <tr><th ${thStyle}>インボイス登録番号</th><td ${tdStyle}>${partner.invoiceNum || 'ー'}</td></tr>
          <tr><th ${thStyle}>紹介報酬条件</th><td ${tdStyle}>${partner.reward || 'ー'}</td></tr>
          <tr><th ${thStyle}>取引口座</th><td ${tdStyle}>${partner.bank || ''} ${partner.branch || ''} (${partner.accType || '普通'}) ${partner.accNum || ''} <br/>名義: ${partner.accHolder || 'ー'}</td></tr>
          <tr><th ${thStyle}>備考</th><td ${tdStyle}>${partner.remarks || 'ー'}</td></tr>
        `;
      } else if (type === 'applicant') {
        const applicant = item.original;
        tableRows = `
          <tr><th ${thStyle}>申込氏名 (フリガナ)</th><td ${tdStyle}>${applicant.name} (${applicant.furigana || 'ー'})</td></tr>
          <tr><th ${thStyle}>電話番号</th><td ${tdStyle}>${applicant.phone || 'ー'}</td></tr>
          <tr><th ${thStyle}>メールアドレス</th><td ${tdStyle}>${applicant.email || 'ー'}</td></tr>
          <tr><th ${thStyle}>登録日</th><td ${tdStyle}>${applicant.date || 'ー'}</td></tr>
          <tr><th ${thStyle}>ステータス</th><td ${tdStyle}>${applicant.status || 'ー'}</td></tr>
        `;
      } else if (type === 'agency') {
        const agency = item.original;
        tableRows = `
          <tr><th ${thStyle}>代理店名</th><td ${tdStyle}>${agency.name}</td></tr>
          <tr><th ${thStyle}>所属企業名</th><td ${tdStyle}>${agency.company || 'ー'}</td></tr>
          <tr><th ${thStyle}>実績アポ数</th><td ${tdStyle}>${agency.count || '0'}</td></tr>
          <tr><th ${thStyle}>ステータス</th><td ${tdStyle}>${agency.status || 'ー'}</td></tr>
        `;
      }

      const detailTable = `
        <div class="ext-db-detail-card">
          <div class="ext-db-detail-card-header">
            <span class="ext-db-detail-card-title">値（${cardTitleMap[type]}）</span>
            ${buttonHtml}
          </div>
          <table class="ext-db-detail-table">
            ${tableRows}
          </table>
        </div>
      `;
      panel.innerHTML += detailTable;
    });
  }
}

// 新規アポイント入力中（または編集時）に入力値の変化からリアルタイムに4テーブルを横断検索して候補を出す
function triggerCrossTableSearchOnInput() {
  if (state.selectedExistingCustomer || state.formMode === 'existing') {
    return;
  }
  const nameVal = document.getElementById('customer-name').value.trim();
  const phoneEl = document.getElementById('custom-field-input-phone');
  const phoneVal = phoneEl ? phoneEl.value.trim() : '';
  const emailEl = document.getElementById('custom-field-input-email');
  const emailVal = emailEl ? emailEl.value.trim() : '';
  const corpEl = document.getElementById('corp-info-name');
  const corpVal = corpEl ? corpEl.value.trim() : '';
  
  // 新しい入力フィールド
  const repFuriganaEl = document.getElementById('custom-field-input-rep_furigana');
  const repFuriganaVal = repFuriganaEl ? repFuriganaEl.value.trim() : '';
  const corpFuriganaEl = document.getElementById('custom-field-input-corp_furigana');
  const corpFuriganaVal = corpFuriganaEl ? corpFuriganaEl.value.trim() : '';
  const corpNumEl = document.getElementById('custom-field-input-corp_num');
  const corpNumVal = corpNumEl ? corpNumEl.value.trim() : '';
  const invoiceNumEl = document.getElementById('custom-field-input-invoice_num');
  const invoiceNumVal = invoiceNumEl ? invoiceNumEl.value.trim() : '';
  const repBirthdayEl = document.getElementById('custom-field-input-rep_birthday');
  const repBirthdayVal = repBirthdayEl ? repBirthdayEl.value.trim() : '';
  
  // corp_info からの補完値も考慮
  const corpCodeEl = document.getElementById('corp-info-code');
  const corpCodeVal = corpCodeEl ? corpCodeEl.value.trim() : '';

  if (nameVal.length >= 2 || phoneVal.length >= 4 || emailVal.length >= 3 || corpVal.length >= 2 ||
      repFuriganaVal.length >= 2 || corpFuriganaVal.length >= 2 || corpNumVal.length >= 4 ||
      corpCodeVal.length >= 4 || invoiceNumVal.length >= 4 || repBirthdayVal.length >= 4) {
      
    const tempCustomer = {
      name: nameVal,
      furigana: document.getElementById('custom-field-input-furigana')?.value.trim() || '',
      phone: phoneVal,
      email: emailVal,
      corp: corpVal,
      repFurigana: repFuriganaVal,
      corpFurigana: corpFuriganaVal,
      corpNum: corpNumVal || corpCodeVal,
      invoiceNum: invoiceNumVal,
      repBirthday: repBirthdayVal
    };
    
    const searchResults = searchRelatedCrossTables(tempCustomer);
    
    // パネルを表示状態にする
    const banner = document.getElementById('existing-customer-banner');
    if (banner && banner.style.display === 'none') {
      banner.style.display = 'block';
      const infoGrid = banner.querySelector('.existing-info-grid');
      if (infoGrid) infoGrid.style.display = 'none';
      const historySection = banner.querySelector('.ext-history-section');
      if (historySection) historySection.style.display = 'none';
      const header = banner.querySelector('.existing-info-header');
      if (header) header.style.display = 'none';
      const placeholder = document.getElementById('existing-customer-placeholder');
      if (placeholder) placeholder.style.display = 'none';
    }
    
    renderConnectionPanel(searchResults, false);
  } else {
    if (!state.selectedExistingCustomer) {
      const connList = document.getElementById('ext-info-connection-list');
      if (connList) connList.innerHTML = '';
      
      const banner = document.getElementById('existing-customer-banner');
      if (banner && state.formMode === 'new') {
        banner.style.display = 'none';
        const infoGrid = banner.querySelector('.existing-info-grid');
        if (infoGrid) infoGrid.style.display = 'grid';
        const historySection = banner.querySelector('.ext-history-section');
        if (historySection) historySection.style.display = 'block';
        const header = banner.querySelector('.existing-info-header');
        if (header) header.style.display = 'flex';
      }
    }
  }
}

// 横断検索された接続候補パネルをレンダリングする
function renderConnectionPanel(results, isViewOnly = false) {
  updateDbTabs(results, isViewOnly);
}

// 接続された外部マスタデータベースのタブ表示と内容テーブルを更新する
function updateDbTabs(results = [], isViewOnly = false) {
  const tabsContainer = document.querySelector('.ext-db-tabs-section');
  if (!tabsContainer) return;

  const btnPartner = document.getElementById('tab-btn-partner');
  const btnApplicant = document.getElementById('tab-btn-applicant');
  const btnAgency = document.getElementById('tab-btn-agency');
  const btnJo = document.getElementById('tab-btn-jo');

  const panelPartner = document.getElementById('db-panel-partner');
  const panelApplicant = document.getElementById('db-panel-applicant');
  const panelAgency = document.getElementById('db-panel-agency');
  const panelJo = document.getElementById('db-panel-jo');
  const emptyMsg = document.getElementById('db-panel-empty-message');

  // 一旦非表示
  btnPartner.style.display = 'none';
  btnApplicant.style.display = 'none';
  btnAgency.style.display = 'none';
  btnJo.style.display = 'none';
  
  panelPartner.style.display = 'none';
  panelApplicant.style.display = 'none';
  panelAgency.style.display = 'none';
  panelJo.style.display = 'none';
  
  panelPartner.innerHTML = '';
  panelApplicant.innerHTML = '';
  panelAgency.innerHTML = '';
  panelJo.innerHTML = '';

  // すでにアポイントに接続されているマスタデータは、接続候補リスト(finalResults)から除外して重複表示を防ぐ
  let finalResults = results.filter(r => {
    if (!state.connectedLinks) return true;
    if (r.type === 'partner' && state.connectedLinks.partner === r.id) return false;
    if (r.type === 'applicant' && state.connectedLinks.applicant === r.id) return false;
    if (r.type === 'agency' && state.connectedLinks.agency === r.id) return false;
    if (r.type === 'jo' && state.connectedLinks.jo === r.id) return false;
    return true;
  });

  if (finalResults.length === 0) {
    emptyMsg.style.display = 'block';
    tabsContainer.querySelectorAll('.db-tab-btn').forEach(btn => btn.classList.remove('active'));
    return;
  }

  emptyMsg.style.display = 'none';

  // データソースごとに結果をグループ化する
  const groups = {
    partner: finalResults.filter(r => r.type === 'partner'),
    applicant: finalResults.filter(r => r.type === 'applicant'),
    agency: finalResults.filter(r => r.type === 'agency'),
    jo: finalResults.filter(r => r.type === 'jo')
  };

  const activeTabs = [];

  // グループごとに HTML テーブルと接続用ボタンを生成するヘルパー関数
  function renderGroupTable(type, items, panel) {
    if (items.length === 0) return false;

    items.forEach((item, index) => {
      const isConnected = state.connectedLinks && state.connectedLinks[type] === item.id;
      let buttonHtml = '';
      
      if (isViewOnly) {
        if (isConnected) {
          buttonHtml = `<span class="badge badge-official" style="font-size: 0.7rem; padding: 0.15rem 0.4rem;">接続中</span>`;
        }
      } else {
        if (isConnected) {
          buttonHtml = `<button type="button" class="btn-secondary" style="padding: 0.2rem 0.5rem; font-size: 0.7rem;" onclick="toggleTabConnection('${type}', '${item.id}', false)">接続解除</button>`;
        } else {
          buttonHtml = `<button type="button" class="btn-outline-primary" style="padding: 0.2rem 0.5rem; font-size: 0.7rem;" onclick="toggleTabConnection('${type}', '${item.id}', true)">接続する</button>`;
        }
      }

      let detailTable = '';
      const cardTitleMap = {
        partner: 'パートナーDB',
        applicant: '申込者情報',
        agency: '代理店情報',
        jo: 'ECオーナー情報'
      };
      
      let tableRows = '';
      const thStyle = `style="text-align: left !important; width: 180px !important; min-width: 180px !important; padding-right: 1.5rem !important; white-space: nowrap !important; font-weight: 600; color: var(--text-muted);"`;
      const tdStyle = `style="text-align: left !important; color: var(--text-primary) !important; word-break: break-all !important;"`;

      if (type === 'partner') {
        const partner = item.original;
        tableRows = `
          <tr><th ${thStyle}>パートナーID</th><td ${tdStyle}>${partner.id}</td></tr>
          <tr><th ${thStyle}>正式法人名</th><td ${tdStyle}>${partner.registeredName}</td></tr>
          <tr><th ${thStyle}>代表者名 (フリガナ)</th><td ${tdStyle}>${partner.representativeName} (${partner.representativeNameKana || 'ー'})</td></tr>
          <tr><th ${thStyle}>生年月日</th><td ${tdStyle}>${partner.birthday || 'ー'}</td></tr>
          <tr><th ${thStyle}>電話番号</th><td ${tdStyle}>${partner.phoneNumber || 'ー'}</td></tr>
          <tr><th ${thStyle}>メールアドレス</th><td ${tdStyle}>${partner.email || 'ー'}</td></tr>
          <tr><th ${thStyle}>法人番号</th><td ${tdStyle}>${partner.corpNum || 'ー'}</td></tr>
          <tr><th ${thStyle}>インボイス登録番号</th><td ${tdStyle}>${partner.invoiceNum || 'ー'}</td></tr>
          <tr><th ${thStyle}>紹介報酬条件</th><td ${tdStyle}>${partner.reward || 'ー'}</td></tr>
          <tr><th ${thStyle}>取引口座</th><td ${tdStyle}>${partner.bank || ''} ${partner.branch || ''} (${partner.accType || '普通'}) ${partner.accNum || ''} <br/>名義: ${partner.accHolder || 'ー'}</td></tr>
          <tr><th ${thStyle}>備考</th><td ${tdStyle}>${partner.remarks || 'ー'}</td></tr>
        `;
      } else if (type === 'applicant') {
        const applicant = item.original;
        tableRows = `
          <tr><th ${thStyle}>申込者ID</th><td ${tdStyle}>${applicant.customerId || 'ー'}</td></tr>
          <tr><th ${thStyle}>申込氏名 (フリガナ)</th><td ${tdStyle}>${applicant.name} (${applicant.furigana || 'ー'})</td></tr>
          <tr><th ${thStyle}>電話番号</th><td ${tdStyle}>${applicant.phone || 'ー'}</td></tr>
          <tr><th ${thStyle}>メールアドレス</th><td ${tdStyle}>${applicant.email || 'ー'}</td></tr>
          <tr><th ${thStyle}>登録日</th><td ${tdStyle}>${applicant.date || 'ー'}</td></tr>
          <tr><th ${thStyle}>ステータス</th><td ${tdStyle}>${applicant.status || 'ー'}</td></tr>
        `;
      } else if (type === 'agency') {
        const agency = item.original;
        tableRows = `
          <tr><th ${thStyle}>代理店ID</th><td ${tdStyle}>${agency.customerId || 'ー'}</td></tr>
          <tr><th ${thStyle}>代理店名</th><td ${tdStyle}>${agency.name}</td></tr>
          <tr><th ${thStyle}>所属企業名</th><td ${tdStyle}>${agency.company || 'ー'}</td></tr>
          <tr><th ${thStyle}>実績アポ数</th><td ${tdStyle}>${agency.count || '0'}</td></tr>
          <tr><th ${thStyle}>ステータス</th><td ${tdStyle}>${agency.status || 'ー'}</td></tr>
        `;
      } else if (type === 'jo') {
        const jo = item.original;
        tableRows = `
          <tr><th ${thStyle}>ECオーナーID</th><td ${tdStyle}>${jo.customerId || 'ー'}</td></tr>
          <tr><th ${thStyle}>法人名 (フリガナ)</th><td ${tdStyle}>${jo.corpName} (${jo.furigana || 'ー'})</td></tr>
          <tr><th ${thStyle}>代表者名 (フリガナ)</th><td ${tdStyle}>${jo.repName} (${jo.repFurigana || 'ー'})</td></tr>
          <tr><th ${thStyle}>店舗名 (モール)</th><td ${tdStyle}>${jo.shopName || 'ー'} (${jo.shopMedia || 'ー'})</td></tr>
          <tr><th ${thStyle}>店舗URL</th><td ${tdStyle}><a href="${jo.shopUrl}" target="_blank" style="color: var(--primary); text-decoration: underline;">${jo.shopUrl || 'ー'}</a></td></tr>
          <tr><th ${thStyle}>運営ステータス</th><td ${tdStyle}>${jo.status || 'ー'}</td></tr>
          <tr><th ${thStyle}>楽天審査</th><td ${tdStyle}>${jo.rakutenPassed || 'ー'}</td></tr>
          <tr><th ${thStyle}>進捗フォルダ</th><td ${tdStyle}>${jo.folder || 'ー'}</td></tr>
          <tr><th ${thStyle}>元帳作成</th><td ${tdStyle}>${jo.ledgerSheet || 'ー'}</td></tr>
          <tr><th ${thStyle}>契約書</th><td ${tdStyle}>${jo.contract || 'ー'}</td></tr>
          <tr><th ${thStyle}>引き渡し日</th><td ${tdStyle}>${jo.handoverDate || 'ー'}</td></tr>
          <tr><th ${thStyle}>報酬発生日</th><td ${tdStyle}>${jo.rewardStartDate || 'ー'}</td></tr>
        `;
      }

      detailTable = `
        <div class="ext-db-detail-card">
          <div class="ext-db-detail-card-header">
            <span class="ext-db-detail-card-title">値（${cardTitleMap[type]}）</span>
            ${buttonHtml}
          </div>
          <table class="ext-db-detail-table">
            ${tableRows}
          </table>
        </div>
      `;

      panel.innerHTML += detailTable;
    });

    return true;
  }

  // 各グループを描画し、ヒットした場合はタブボタンを表示する
  if (renderGroupTable('partner', groups.partner, panelPartner)) {
    btnPartner.style.display = 'block';
    activeTabs.push({ type: 'partner', btn: btnPartner, panel: panelPartner });
  }
  if (renderGroupTable('applicant', groups.applicant, panelApplicant)) {
    btnApplicant.style.display = 'block';
    activeTabs.push({ type: 'applicant', btn: btnApplicant, panel: panelApplicant });
  }
  if (renderGroupTable('agency', groups.agency, panelAgency)) {
    btnAgency.style.display = 'block';
    activeTabs.push({ type: 'agency', btn: btnAgency, panel: panelAgency });
  }
  if (renderGroupTable('jo', groups.jo, panelJo)) {
    btnJo.style.display = 'block';
    activeTabs.push({ type: 'jo', btn: btnJo, panel: panelJo });
  }

  // 有効なタブがある場合、デフォルトで最初のタブを表示する
  if (activeTabs.length > 0) {
    const currentlyActiveBtn = tabsContainer.querySelector('.db-tab-btn.active');
    let nextTabToSelect = activeTabs[0];

    // もしすでに開いていたタブがまだ残っていれば、そのタブを開いたままにする
    if (currentlyActiveBtn) {
      const currentTabType = currentlyActiveBtn.dataset.dbTab;
      const remainsActive = activeTabs.find(t => t.type === currentTabType);
      if (remainsActive) {
        nextTabToSelect = remainsActive;
      }
    }

    tabsContainer.querySelectorAll('.db-tab-btn').forEach(btn => btn.classList.remove('active'));

    if (nextTabToSelect) {
      nextTabToSelect.btn.classList.add('active');
      nextTabToSelect.panel.style.display = 'block';
    }
  } else {
    emptyMsg.style.display = 'block';
  }
}

// グローバルで呼び出される接続トグル関数
window.toggleTabConnection = function(type, id, connect) {
  if (!state.connectedLinks) state.connectedLinks = {};
  if (connect) {
    state.connectedLinks[type] = id;
  } else {
    state.connectedLinks[type] = null;
  }
  
  const customerObj = state.selectedExistingCustomer || {
    name: document.getElementById('customer-name').value.trim(),
    phone: document.getElementById('custom-field-input-phone')?.value.trim() || '',
    email: document.getElementById('custom-field-input-email')?.value.trim() || '',
    corp: document.getElementById('corp-info-name')?.value.trim() || '',
    repFurigana: document.getElementById('custom-field-input-rep_furigana')?.value.trim() || '',
    corpFurigana: document.getElementById('custom-field-input-corp_furigana')?.value.trim() || '',
    corpNum: document.getElementById('custom-field-input-corp_num')?.value.trim() || document.getElementById('corp-info-code')?.value.trim() || '',
    invoiceNum: document.getElementById('custom-field-input-invoice_num')?.value.trim() || '',
    repBirthday: document.getElementById('custom-field-input-rep_birthday')?.value.trim() || ''
  };

  const results = searchRelatedCrossTables(customerObj);
  const isViewOnly = state.tabs.find(t => t.id === state.activeTabId)?.appointData?.viewOnly || false;
  updateDbTabs(results, isViewOnly);
};

// ==========================================
// 10. マイパターン適用・保存機能
// ==========================================

// パターンの適用
function applyPattern(patternId) {
  const fields = state.patterns[patternId];
  if (!fields) return;
  
  // 現在追加されているカスタム項目を一旦全消去
  const currentFields = Array.from(state.addedCustomFields);
  currentFields.forEach(fieldType => {
    removeCustomField(fieldType);
  });
  
  // 新しいパターンの項目を追加
  fields.forEach(fieldType => {
    addCustomField(fieldType);
  });
  showToast('マイパターンを適用しました。', 'success');
}

// 現在のカスタム項目のマイパターン保存
function saveCustomPattern() {
  const nameInput = document.getElementById('new-pattern-name');
  const name = nameInput.value.trim();

  if (!name) {
    showToast('パターン名を入力してください。', 'warning');
    return;
  }

  if (state.addedCustomFields.size === 0) {
    showToast('保存する追加項目がありません。', 'warning');
    return;
  }

  const fieldList = Array.from(state.addedCustomFields);
  
  // パターンの保存
  state.patterns[name] = fieldList;
  localStorage.setItem(STORAGE_KEYS.PATTERNS, JSON.stringify(state.patterns));

  nameInput.value = '';
  if (window.renderPatternOptions) {
    window.renderPatternOptions();
  }
  showToast(`パターン「${name}」を登録しました。`, 'success');
}

// 保存済みパターンチップスの描画
function renderCustomPatternChips() {
  if (window.renderPatternOptions) {
    window.renderPatternOptions();
  }
}

// ==========================================
// 11. アポイント保存処理 (一時保存・正式登録)
// ==========================================

// 一時保存（下書き）の処理
function handleSaveDraft() {
  const dateVal = document.getElementById('appoint-date').value;
  const nameVal = document.getElementById('customer-name').value.trim();
  const memoVal = document.getElementById('appoint-memo').value.trim();

  // 一時保存の必須条件検証
  if (!dateVal) {
    showToast('一時保存にはアポイント日時が必須です。', 'error');
    document.getElementById('appoint-date').focus();
    return;
  }
  if (!nameVal) {
    showToast('一時保存には相手の名前または呼称が必須です。', 'error');
    document.getElementById('customer-name').focus();
    return;
  }
  if (!memoVal) {
    showToast('一時保存には内容メモが必須です。', 'error');
    document.getElementById('appoint-memo').focus();
    return;
  }

  saveAppointmentData('draft');
}

// 正式登録の処理
function handleFormSubmit(e) {
  e.preventDefault();
  
  const dateVal = document.getElementById('appoint-date').value;
  const nameVal = document.getElementById('customer-name').value.trim();
  const memoVal = document.getElementById('appoint-memo').value.trim();

  if (!dateVal || !nameVal || !memoVal) {
    showToast('必須項目を入力してください。', 'error');
    return;
  }

  saveAppointmentData('official');
}

// カスタムフォームの送信イベントハンドラ（パートナーDB転送およびCOS内マスタ自動構築）
// カスタムフォームの送信イベントハンドラ（パートナーDB転送およびCOS内マスタ自動構築）
function handleFormSubmitMessage(event) {
  if (!event.data) return;

  // 1. 一時保存データ取得の要求をハンドリング
  if (event.data.type === 'FORM_GET_TEMPORARY_DATA') {
    const { rowId, formTitle } = event.data;
    if (!rowId || !formTitle) return;

    console.log('[Synapse Database] Request received to get temporary data for row:', rowId, 'in table:', formTitle);
    
    let targetTable = state.customTables.find(t => t.name === formTitle);
    if (targetTable) {
      const row = (targetTable.rows || targetTable.data || []).find(r => r.id === rowId);
      if (row) {
        // カラムIDから物理的な回答キー（カラム名）にデコードして返す
        const decodedData = {};
        targetTable.columns.forEach(col => {
          if (row[col.id] !== undefined) {
            decodedData[col.name] = row[col.id];
          }
        });
        
        event.source.postMessage({
          type: 'FORM_TEMPORARY_DATA_RESPONSE',
          rowId: rowId,
          data: decodedData
        }, '*');
        return;
      }
    }
    return;
  }

  // 送信イベント以外はスルー
  if (event.data.type !== 'FORM_SUBMIT') return;

  const { formTitle, data, isTemporary, rowId: clientRowId } = event.data;
  if (!data) return;

  console.log(`%c[Form Submit]%c Received submission for form "${formTitle}" (isTemporary: ${!!isTemporary}, rowId: ${clientRowId}):`, "color: #3b82f6; font-weight: bold;", "color: inherit;", data);

  // ----------------------------------------------------
  // 1. COS内カスタムマスターテーブルへのデータ蓄積・更新
  // ----------------------------------------------------
  let targetTable = state.customTables.find(t => t.name === formTitle);
  let isNewTable = false;

  if (!targetTable) {
    isNewTable = true;
    const tableId = 'table_' + Date.now();
    // 送信データにあるすべてのキーをカラム定義として生成する
    const columns = Object.keys(data).map((key, idx) => ({
      id: 'col_' + Math.random().toString(36).substr(2, 9),
      label: key,
      name: key,
      type: 'text',
      required: idx === 0
    }));

    const defaultWidths = {};
    columns.forEach(col => {
      defaultWidths[col.id] = 120;
    });

    targetTable = {
      id: tableId,
      name: formTitle,
      parentMenuId: 'root', // メニューのルート直下に配置
      columns: columns,
      visibleColumns: columns.map(c => c.id),
      columnWidths: defaultWidths,
      rowHeights: {},
      fixedCol: 'none',
      fixedRow: 'none',
      cellStyles: {},
      rows: []
    };
    state.customTables.push(targetTable);
  } else {
    // 既存テーブルの場合、送信データに新しいキーがあればカラム定義を自動追加
    // 既存のカラム定義が label を持っていなければ補完する
    targetTable.columns.forEach(col => {
      if (!col.label && col.name) col.label = col.name;
    });

    Object.keys(data).forEach(key => {
      const exists = targetTable.columns.some(col => col.name === key || col.label === key);
      if (!exists) {
        const colId = 'col_' + Math.random().toString(36).substr(2, 9);
        targetTable.columns.push({
          id: colId,
          label: key,
          name: key,
          type: 'text'
        });
        if (targetTable.visibleColumns) {
          targetTable.visibleColumns.push(colId);
        }
        if (targetTable.columnWidths) {
          targetTable.columnWidths[colId] = 120;
        }
      }
    });

    // 既存テーブルに必要な他のプロパティが欠落していれば補完する
    if (!targetTable.rows && targetTable.data) {
      targetTable.rows = targetTable.data;
      delete targetTable.data;
    }
    if (!targetTable.rows) targetTable.rows = [];
    if (!targetTable.visibleColumns) targetTable.visibleColumns = targetTable.columns.map(c => c.id);
    if (!targetTable.columnWidths) {
      targetTable.columnWidths = {};
      targetTable.columns.forEach(c => { targetTable.columnWidths[c.id] = 120; });
    }
    if (!targetTable.rowHeights) targetTable.rowHeights = {};
    if (!targetTable.fixedCol) targetTable.fixedCol = 'none';
    if (!targetTable.fixedRow) targetTable.fixedRow = 'none';
    if (!targetTable.cellStyles) targetTable.cellStyles = {};
  }

  // 既存のレコードを上書き更新するか、新規に作成するか
  let targetRow = null;
  let targetRowId = clientRowId;

  if (targetRowId) {
    targetRow = targetTable.rows.find(r => r.id === targetRowId);
  }

  if (targetRow) {
    console.log('[Synapse Database] Updating existing row:', targetRowId);
  } else {
    targetRowId = targetRowId || 'row_' + Date.now();
    targetRow = {
      id: targetRowId
    };
    targetTable.rows.push(targetRow);
  }

  // 各カラムの値として回答データを設定
  targetTable.columns.forEach(col => {
    if (data[col.name] !== undefined) {
      targetRow[col.id] = String(data[col.name]);
    } else if (targetRow[col.id] === undefined) {
      targetRow[col.id] = '';
    }
  });

  // レコードを追加/更新し、LocalStorageへ永続化
  localStorage.setItem(STORAGE_KEYS.CUSTOM_TABLES, JSON.stringify(state.customTables));
  
  // 編集監査ログへ記録
  logCellEdit(targetTable.id, targetRowId, 'all_columns', 'none', JSON.stringify(data));
  console.log(`%c[Synapse Database]%c Saved row (ID: ${targetRowId}) to Custom Master Table "${formTitle}":`, "color: #3b82f6; font-weight: bold;", "color: inherit;", targetRow);

  // もしカスタムテーブルが新設された場合は、サイドメニューを再描画する
  if (isNewTable) {
    renderCustomTableList();
  }

  // 現在表示中のカスタムテーブルがこのテーブルであれば、表示をリアルタイム更新する
  if (state.currentView === 'custom-table-screen' && state.activeCustomTableId === targetTable.id) {
    renderCustomTable(targetTable.id);
  }

  // ----------------------------------------------------
  // 2. パートナーDBへの転送処理（カラムが一致するもののみ）
  // ----------------------------------------------------
  // カラムの日本語名と英語物理キーのマッピング定義
  const mapping = {
    registeredName: ['会社名', '企業名', '登録名', '法人名', '商号', '会社', '企業'],
    registeredNameKana: ['会社名カナ', '企業名カナ', '登録名カナ', 'フリガナ', 'カナ'],
    representativeName: ['代表者名', '代表者', '代表', '代表名'],
    status: ['ステータス', '状態'],
    phoneNumber: ['電話番号', '電話', '連絡先', 'TEL', 'tel'],
    email: ['メールアドレス', 'メール', 'アドレス', 'Email', 'email'],
    corpNum: ['法人番号', 'マイナンバー'],
    invoiceNum: ['インボイス登録番号', 'インボイス番号', '登録番号'],
    zipCode: ['郵便番号', '郵便', '〒'],
    pref: ['都道府県', '県', '都', '道', '府'],
    city: ['市区町村', '市区', '町村'],
    addr1: ['町名・番地・建物名', '町名', '番地', '住所1', '住所'],
    addr2: ['建物名', '部屋番号', 'アパート名', '住所2'],
    bank: ['銀行名', '金融機関名', '銀行', '金融機関'],
    branch: ['支店名', '支店', '店舗名'],
    accType: ['口座種別', '種別', '預金種目'],
    accNum: ['口座番号', '番号'],
    accHolder: ['口座名義', '名義', '口座名義人'],
    reward: ['報酬額', '報酬', '金額'],
    remarks: ['備考', 'その他', 'Remarks', 'remarks']
  };

  // 送信された回答データのキーから、パートナーDBのカラムに該当する値をインテリジェントに抽出するヘルパー
  const getValueByMapping = (field) => {
    // 直接英語物理キーがデータ内にあれば優先する
    if (data[field] !== undefined && data[field] !== '') {
      return String(data[field]).trim();
    }
    // マッピングで定義された日本語キーワードで前方一致/完全一致を検証
    const keys = mapping[field] || [];
    for (const key of keys) {
      // data内のキーを走査し、マッピングキーワードを含むか確認
      const matchedKey = Object.keys(data).find(dk => dk.includes(key));
      if (matchedKey && data[matchedKey] !== undefined && data[matchedKey] !== '') {
        return String(data[matchedKey]).trim();
      }
    }
    return '';
  };

  // 送信された項目の中に、会社名/企業名があるか確認（最低限これがないとパートナーレコードとして不適切）
  const partnerName = getValueByMapping('registeredName');
  if (partnerName) {
    let existingPartner = null;
    
    // カスタムテーブル行に紐づくパートナーIDがある場合はそれを使用
    if (targetRow.partnerId) {
      existingPartner = dbmakePartners.find(p => p.id === targetRow.partnerId);
    }
    
    // ない場合は名前で検索
    if (!existingPartner) {
      existingPartner = dbmakePartners.find(p => p.registeredName === partnerName);
    }

    if (existingPartner) {
      // 既存パートナーの上書き更新
      existingPartner.registeredNameKana = getValueByMapping('registeredNameKana') || existingPartner.registeredNameKana;
      existingPartner.representativeName = getValueByMapping('representativeName') || existingPartner.representativeName;
      existingPartner.phoneNumber = getValueByMapping('phoneNumber') || existingPartner.phoneNumber;
      existingPartner.email = getValueByMapping('email') || existingPartner.email;
      existingPartner.corpNum = getValueByMapping('corpNum') || existingPartner.corpNum;
      existingPartner.invoiceNum = getValueByMapping('invoiceNum') || existingPartner.invoiceNum;
      existingPartner.zipCode = getValueByMapping('zipCode') || existingPartner.zipCode;
      existingPartner.pref = getValueByMapping('pref') || existingPartner.pref;
      existingPartner.city = getValueByMapping('city') || existingPartner.city;
      existingPartner.addr1 = getValueByMapping('addr1') || existingPartner.addr1;
      existingPartner.addr2 = getValueByMapping('addr2') || existingPartner.addr2;
      existingPartner.bank = getValueByMapping('bank') || existingPartner.bank;
      existingPartner.branch = getValueByMapping('branch') || existingPartner.branch;
      existingPartner.accType = getValueByMapping('accType') || existingPartner.accType;
      existingPartner.accNum = getValueByMapping('accNum') || existingPartner.accNum;
      existingPartner.accHolder = getValueByMapping('accHolder') || existingPartner.accHolder;
      existingPartner.reward = getValueByMapping('reward') || existingPartner.reward;
      existingPartner.remarks = getValueByMapping('remarks') || existingPartner.remarks;
      existingPartner.recordedAt = new Date().toISOString();

      targetRow.partnerId = existingPartner.id; // マッピングの記録
      console.log("%c[Backend DB Connection]%c Updated existing Partner DB record.", "color: #10b981; font-weight: bold;", "color: inherit;", existingPartner);
    } else {
      // パートナーの新規作成
      const partnerId = generate8DigitId();
      const newPartner = {
        id: partnerId,
        registeredName: partnerName,
        registeredNameKana: getValueByMapping('registeredNameKana'),
        representativeName: getValueByMapping('representativeName'),
        status: getValueByMapping('status') || 'active',
        phoneNumber: getValueByMapping('phoneNumber'),
        email: getValueByMapping('email'),
        corpNum: getValueByMapping('corpNum'),
        invoiceNum: getValueByMapping('invoiceNum'),
        zipCode: getValueByMapping('zipCode'),
        pref: getValueByMapping('pref'),
        city: getValueByMapping('city'),
        addr1: getValueByMapping('addr1'),
        addr2: getValueByMapping('addr2'),
        bank: getValueByMapping('bank'),
        branch: getValueByMapping('branch'),
        accType: getValueByMapping('accType') || '普通',
        accNum: getValueByMapping('accNum'),
        accHolder: getValueByMapping('accHolder'),
        reward: getValueByMapping('reward') || '0',
        remarks: getValueByMapping('remarks'),
        recordedAt: new Date().toISOString(),
        recordedBy: state.currentUser ? state.currentUser.name : 'System',
        isFavorite: false
      };

      dbmakePartners.push(newPartner);
      targetRow.partnerId = partnerId; // マッピングの記録
      console.log("%c[Backend DB Connection]%c Auto-transferred record to Partner DB successfully.", "color: #10b981; font-weight: bold;", "color: inherit;", newPartner);
    }

    saveDbmakePartners();
    
    // パートナーDB画面が開かれている場合は、リアルタイム再描画
    if (state.currentView === 'dbmake-screen') {
      renderDbmakePartners();
    }
  }

  // ----------------------------------------------------
  // 3. レスポンス送信と通知
  // ----------------------------------------------------
  if (isTemporary) {
    if (event.source) {
      event.source.postMessage({
        type: 'FORM_SUBMIT_TEMPORARY_RESPONSE',
        success: true,
        rowId: targetRowId,
        formTitle: formTitle
      }, '*');
    }
    showToast(`フォーム「${formTitle}」の途中回答を一時保存しました。`, 'success');
  } else {
    showToast(`フォーム「${formTitle}」の回答を受信し、パートナーDBおよびCOSマスタへ保存しました。`, 'success');
  }
}

// 顧客ID同士の双方向自動バインド（相互反映）処理
// 顧客ID同士の双方向自動バインド（相互反映）処理（複数顧客IDカンマ区切り対応）
function syncBiDirectionalRelatedCustomerId(mainCustomerId, targetRelatedCustomerIdString) {
  if (!mainCustomerId) return;
  
  const newRelatedIds = targetRelatedCustomerIdString 
    ? targetRelatedCustomerIdString.split(',').map(id => id.trim()).filter(id => id !== '')
    : [];

  const mainCustomer = state.customers.find(c => c.id === mainCustomerId);
  if (mainCustomer) {
    mainCustomer.relatedCustomerId = targetRelatedCustomerIdString;
  }

  newRelatedIds.forEach(targetId => {
    let targetCustomer = state.customers.find(c => c.id === targetId);
    if (!targetCustomer) {
      let custName = '（未登録顧客）';
      if (state.joContracts) {
        const jo = state.joContracts.find(j => (j.customerPersonalityId || j.customerId) === targetId);
        if (jo) custName = jo.customerName || jo.representative || 'JO登録代表者';
      }
      if (custName === '（未登録顧客）' && state.apContracts) {
        const ap = state.apContracts.find(a => (a.customerPersonalityId || a.customerId) === targetId);
        if (ap) custName = ap.name || '申込者';
      }

      targetCustomer = {
        id: targetId,
        name: custName,
        furigana: '',
        phone: '',
        email: '',
        corp: '',
        service: '関連接続マスタ',
        historyCount: 0,
        relatedCustomerId: ''
      };
      state.customers.push(targetCustomer);
    }

    let ids = targetCustomer.relatedCustomerId 
      ? targetCustomer.relatedCustomerId.split(',').map(id => id.trim()).filter(id => id !== '')
      : [];
    if (!ids.includes(mainCustomerId)) {
      ids.push(mainCustomerId);
      targetCustomer.relatedCustomerId = ids.join(', ');
    }
  });

  state.customers.forEach(cust => {
    if (cust.id !== mainCustomerId) {
      let ids = cust.relatedCustomerId 
        ? cust.relatedCustomerId.split(',').map(id => id.trim()).filter(id => id !== '')
        : [];
      if (ids.includes(mainCustomerId) && !newRelatedIds.includes(cust.id)) {
        ids = ids.filter(id => id !== mainCustomerId);
        cust.relatedCustomerId = ids.join(', ');
      }
    }
  });
  
  localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(state.customers));
}

// アポイントID同士の双方向自動バインド（相互反映）処理
function syncBiDirectionalRelatedAppointmentIds(appointIdA, targetRelatedAppointmentIdsString) {
  if (!appointIdA) return;
  
  const newRelatedAppointIds = targetRelatedAppointmentIdsString 
    ? targetRelatedAppointmentIdsString.split(',').map(id => id.trim()).filter(id => id !== '')
    : [];

  newRelatedAppointIds.forEach(targetId => {
    const targetAppoint = state.appointments.find(a => a.id === targetId && a.status !== 'cancelled');
    if (targetAppoint) {
      let ids = targetAppoint.relatedAppointmentIds 
        ? targetAppoint.relatedAppointmentIds.split(',').map(id => id.trim()).filter(id => id !== '')
        : [];
      if (!ids.includes(appointIdA)) {
        ids.push(appointIdA);
        targetAppoint.relatedAppointmentIds = ids.join(', ');
      }
    }
  });

  state.appointments.forEach(appoint => {
    if (appoint.id !== appointIdA && appoint.status !== 'cancelled') {
      let ids = appoint.relatedAppointmentIds 
        ? appoint.relatedAppointmentIds.split(',').map(id => id.trim()).filter(id => id !== '')
        : [];
      if (ids.includes(appointIdA) && !newRelatedAppointIds.includes(appoint.id)) {
        ids = ids.filter(id => id !== appointIdA);
        appoint.relatedAppointmentIds = ids.join(', ');
      }
    }
  });
  
  localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(state.appointments));
}

// アポイントデータ保存ロジック本体
function saveAppointmentData(status) {
  const dateVal = document.getElementById('appoint-date').value;
  const nameVal = document.getElementById('customer-name').value.trim();
  const memoVal = document.getElementById('appoint-memo').value.trim();

  // 追加項目の値収集
  const customFieldsData = {};
  state.addedCustomFields.forEach(fieldType => {
    if (fieldType === 'corp_info') {
      customFieldsData['corp_info'] = {
        name: document.getElementById('corp-info-name')?.value.trim() || '',
        code: document.getElementById('corp-info-code')?.value.trim() || '',
        address: document.getElementById('corp-info-address')?.value.trim() || ''
      };
    } else if (fieldType === 'introducer') {
      customFieldsData['introducer'] = state.selectedIntroducer;
    } else {
      const inputEl = document.getElementById(`custom-field-input-${fieldType}`);
      if (inputEl) {
        customFieldsData[fieldType] = inputEl.value.trim();
      }
    }
  });

  const appointId = state.editingAppointId; // すでに発行済みの8桁IDを使用

  // 現在アポイントデータに保存されている関連IDを読み取る（インプット要素廃止のため）
  let relatedAppointmentIds = '';
  if (appointId) {
    const currentAppoint = state.appointments.find(a => a.id === appointId);
    if (currentAppoint) {
      relatedAppointmentIds = currentAppoint.relatedAppointmentIds || '';
    }
  }

  const appointData = {
    id: appointId,
    date: dateVal,
    customerType: state.formMode,
    customerId: state.formMode === 'existing' ? state.selectedExistingCustomer.id : null,
    relatedAppointmentIds: relatedAppointmentIds, // 関連アポイントIDを追加
    customerName: nameVal,
    memo: memoVal,
    customFields: customFieldsData,
    connectedLinks: state.connectedLinks || {}, // 接続データを保存
    status: status,
    registeredAt: new Date().toISOString()
  };

  // 既存のアポイントを更新（画面開始時に必ずdraft作成されているため、必ず存在します）
  const index = state.appointments.findIndex(a => a.id === appointId);
  if (index >= 0) {
    state.appointments[index] = appointData;
  } else {
    state.appointments.push(appointData);
  }

  localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(state.appointments));

  // アポイントID同士の双方向自動バインド（相互反映）を適用
  syncBiDirectionalRelatedAppointmentIds(appointId, relatedAppointmentIds);

  // 申込者とJOの顧客番号・顧客IDの同期処理 (同一アポイントに両方接続されている場合)
  if (appointData.connectedLinks && appointData.connectedLinks.applicant && appointData.connectedLinks.jo) {
    const apTargetId = appointData.connectedLinks.applicant;
    const joTargetId = appointData.connectedLinks.jo;

    const apRecord = state.apContracts ? state.apContracts.find(ap => ap.customerId === apTargetId || ap.customerPersonalityId === apTargetId) : null;
    const joRecord = state.joContracts ? state.joContracts.find(jo => jo.customerId === joTargetId || jo.customerPersonalityId === joTargetId) : null;

    if (apRecord && joRecord) {
      const commonCustomerNumber = joRecord.customerId || apRecord.customerId || generateUniqueCustomerNumber();
      const commonPersonalityId = appointData.customerId || apRecord.customerPersonalityId || joRecord.customerPersonalityId || generate8DigitId();

      apRecord.customerId = commonCustomerNumber;
      apRecord.customerPersonalityId = commonPersonalityId;

      joRecord.customerId = commonCustomerNumber;
      joRecord.customerPersonalityId = commonPersonalityId;

      appointData.connectedLinks.applicant = commonCustomerNumber;
      appointData.connectedLinks.jo = commonCustomerNumber;

      localStorage.setItem(STORAGE_KEYS.AP_CONTRACTS, JSON.stringify(state.apContracts));
      localStorage.setItem(STORAGE_KEYS.JO_CONTRACTS, JSON.stringify(state.joContracts));
    }
  } else {
    const personalityId = appointData.customerId;
    if (personalityId) {
      if (appointData.connectedLinks && appointData.connectedLinks.applicant) {
        const apRecord = state.apContracts ? state.apContracts.find(ap => ap.customerId === appointData.connectedLinks.applicant) : null;
        if (apRecord) {
          apRecord.customerPersonalityId = personalityId;
          localStorage.setItem(STORAGE_KEYS.AP_CONTRACTS, JSON.stringify(state.apContracts));
        }
      }
      if (appointData.connectedLinks && appointData.connectedLinks.jo) {
        const joRecord = state.joContracts ? state.joContracts.find(jo => jo.customerId === appointData.connectedLinks.jo) : null;
        if (joRecord) {
          joRecord.customerPersonalityId = personalityId;
          localStorage.setItem(STORAGE_KEYS.JO_CONTRACTS, JSON.stringify(state.joContracts));
        }
      }
    }
  }

  // 既存顧客で正式登録された場合、該当顧客の過去履歴件数(historyCount)をインクリメントする
  if (state.formMode === 'existing' && status === 'official' && state.selectedExistingCustomer) {
    const cust = state.customers.find(c => c.id === state.selectedExistingCustomer.id);
    if (cust) {
      cust.historyCount = (cust.historyCount || 0) + 1;
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(state.customers));
    }
  }

  // 新規顧客で正式登録された場合、顧客DBにも自動追加する
  if (state.formMode === 'new' && status === 'official') {
    const exists = state.customers.some(c => c.name === nameVal);
    if (!exists) {
      const newCust = {
        id: generate8DigitId(), // 以前伝えている要件でのID（8桁暗号学的一意ID）を付与
        name: nameVal,
        furigana: customFieldsData.furigana || '',
        phone: customFieldsData.phone || '',
        email: customFieldsData.email || '',
        corp: customFieldsData.corp_info?.name || '',
        service: 'アポイント経由',
        historyCount: 1
      };
      state.customers.push(newCust);
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(state.customers));
    }
  }

  // 編集状態リセット
  state.editingAppointId = null;
  state.selectedExistingCustomer = null;
  state.selectedIntroducer = null;
  state.isFormDirty = false;

  showToast(status === 'official' ? 'アポイントを正式登録しました。' : 'アポイントを下書き保存（一時保存）しました。', 'success');

  // 現在のタブを閉じる
  const currentTabId = state.activeTabId;
  if (currentTabId) {
    const currentTab = state.tabs.find(t => t.id === currentTabId);
    if (currentTab && currentTab.appointData) {
      currentTab.appointData.isFormDirty = false;
    }
    closeTab(currentTabId);
  }
}

// 下書きアポイントの編集開始
function editAppointment(appointId) {
  const appoint = state.appointments.find(a => a.id === appointId);
  if (!appoint) return;

  const tabId = `edit-${appointId}`;
  const title = `下書き: ${appointId}`;

  const appointData = {
    id: appoint.id,
    date: appoint.date,
    customerType: appoint.customerType,
    customerId: appoint.customerId,
    customerName: appoint.customerName,
    memo: appoint.memo,
    customFields: appoint.customFields || {},
    connectedLinks: appoint.connectedLinks || {}, // 接続データを渡す
    selectedExistingCustomer: appoint.customerType === 'existing' ? state.customers.find(c => c.id === appoint.customerId) : null,
    addedCustomFields: Object.keys(appoint.customFields || {}),
    selectedIntroducer: appoint.customFields?.introducer,
    status: appoint.status,
    viewOnly: false,
    isFormDirty: false
  };

  openTab(tabId, 'appointment-screen', title, appointData);
}

// アポイント詳細の閲覧（履歴など）
function viewAppointmentDetails(appointId) {
  const appoint = state.appointments.find(a => a.id === appointId);
  if (!appoint) return;

  const tabId = `view-${appointId}`;
  const title = `詳細: ${appointId}`;

  const appointData = {
    id: appoint.id,
    date: appoint.date,
    customerType: appoint.customerType,
    customerId: appoint.customerId,
    relatedCustomerId: appoint.relatedCustomerId || '',
    customerName: appoint.customerName,
    memo: appoint.memo,
    customFields: appoint.customFields || {},
    connectedLinks: appoint.connectedLinks || {}, // 接続データを渡す
    selectedExistingCustomer: appoint.customerType === 'existing' ? state.customers.find(c => c.id === appoint.customerId) : null,
    addedCustomFields: Object.keys(appoint.customFields || {}),
    selectedIntroducer: appoint.customFields?.introducer,
    status: appoint.status,
    viewOnly: true,
    isFormDirty: false
  };

  openTab(tabId, 'appointment-screen', title, appointData);
}

// 下書きアポイントの破棄（削除ではなく、ステータスを cancelled に変更して監査証跡を残す）
function handleDeleteDraft() {
  if (!state.editingAppointId) return;

  if (confirm('この下書きアポイントを破棄しますか？（IDはキャンセル状態として保存され、履歴として残ります）')) {
    const appoint = state.appointments.find(a => a.id === state.editingAppointId);
    if (appoint) {
      appoint.status = 'cancelled';
      appoint.registeredAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(state.appointments));
      showToast('下書きを破棄しました（ステータス：無効 / cancelled）。', 'warning');
    }
    
    state.editingAppointId = null;
    state.selectedExistingCustomer = null;
    state.selectedIntroducer = null;
    state.isFormDirty = false;
    
    const currentTabId = state.activeTabId;
    if (currentTabId) {
      const currentTab = state.tabs.find(t => t.id === currentTabId);
      if (currentTab && currentTab.appointData) {
        currentTab.appointData.isFormDirty = false;
      }
      closeTab(currentTabId);
    }
  }
}

// ==========================================
// 12. ユーティリティ機能（トースト通知）
// ==========================================
function showToast(message, type = 'primary') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let icon = 'ℹ️';
  if (type === 'success') icon = '✅';
  if (type === 'warning') icon = '⚠️';
  if (type === 'error') icon = '❌';

  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  container.appendChild(toast);

  // 3秒後にフェードアウトして削除
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

// 汎用クリップボードコピー関数（Secure Contextと非Secure/file://フォールバック両対応）
function copyToClipboard(text) {
  const str = String(text).trim();
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(str).then(() => {
      showToast('コピーしました', 'success');
    }).catch(err => {
      console.error('Failed to copy: ', err);
      fallbackCopyToClipboard(str);
    });
  } else {
    fallbackCopyToClipboard(str);
  }
}

// 同期的なexecCommandフォールバック（User Activation制限下で最も確実に機能する）
function fallbackCopyToClipboard(text) {
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '-1000px';
    textArea.style.left = '-1000px';
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    if (successful) {
      showToast('コピーしました', 'success');
    } else {
      console.error('Fallback execCommand copy failed');
    }
  } catch (err) {
    console.error('Fallback copy error: ', err);
  }
}

// ==========================================
// 13. 本登録ID（正式ID）と過去アポイントIDの紐付け管理
// ==========================================

function renderLinkOfficialScreen() {
  document.getElementById('link-official-form').reset();
  renderLinkSearchAppoints('');
  renderLinkedIdsList();
}

// 本登録ID紐付けのための過去アポイント検索・表示
function renderLinkSearchAppoints(query) {
  const container = document.getElementById('link-appoints-table-body');
  container.innerHTML = '';

  const q = query.toLowerCase();
  
  // 紐付け対象となるのは「正式登録（official）」されたアポイントのみ（下書きや破棄は除く）
  const completedAppoints = state.appointments.filter(a => 
    a.status === 'official' &&
    (q === '' || 
     a.id.includes(q) || 
     a.customerName.toLowerCase().includes(q) || 
     a.memo.toLowerCase().includes(q) ||
     (a.customFields?.phone && a.customFields.phone.includes(q)) ||
     (a.customFields?.email && a.customFields.email.toLowerCase().includes(q))
    )
  );

  if (completedAppoints.length === 0) {
    container.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 1.5rem; color: var(--text-muted);">対象アポイントが見つかりません</td></tr>';
    return;
  }

  completedAppoints.forEach(app => {
    const tr = document.createElement('tr');
    tr.style.borderBottom = '1px solid var(--border-color)';
    
    const dateObj = new Date(app.date);
    const formattedDate = `${dateObj.getMonth() + 1}/${dateObj.getDate()} ${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}`;

    // すでに本登録IDと紐付いている場合はチェック済みにするか、情報を表示
    const isChecked = app.officialId ? 'checked' : '';
    const linkIndicator = app.officialId ? `<span style="font-size: 0.7rem; color: var(--success); display: block; margin-top: 0.2rem;">🔗 ${app.officialId}</span>` : '';

    tr.innerHTML = `
      <td style="padding: 0.5rem 0.75rem; text-align: center;">
        <input type="checkbox" name="link_appoint_checkbox" value="${app.id}" ${isChecked} style="margin: 0; width: 18px; height: 18px;">
      </td>
      <td style="padding: 0.5rem 0.75rem; font-family: monospace; font-weight: 600; color: var(--secondary);">
        ${app.id}
        ${linkIndicator}
      </td>
      <td style="padding: 0.5rem 0.75rem; color: var(--text-secondary);">${formattedDate}</td>
      <td style="padding: 0.5rem 0.75rem; font-weight: 600;">${app.customerName}</td>
      <td style="padding: 0.5rem 0.75rem; color: var(--text-secondary); max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
        ${app.memo}
      </td>
    `;
    container.appendChild(tr);
  });
}

// 紐付け処理実行
function handleLinkSubmit(e) {
  e.preventDefault();
  const officialId = document.getElementById('official-id').value.trim();
  
  if (!officialId) {
    showToast('本登録IDを入力してください。', 'error');
    return;
  }

  const checkboxes = document.querySelectorAll('input[name="link_appoint_checkbox"]:checked');
  if (checkboxes.length === 0) {
    showToast('紐付けるアポイント履歴を最低1つ選択してください。', 'warning');
    return;
  }

  const checkedIds = Array.from(checkboxes).map(cb => cb.value);

  // 最初選択されたアポイントの顧客名を取得（デモ表示用）
  let customerName = '不明';
  const firstApp = state.appointments.find(a => a.id === checkedIds[0]);
  if (firstApp) {
    customerName = firstApp.customerName;
  }

  // 紐付け情報の新規追加・更新
  const existingLinkIndex = state.officialLinks.findIndex(l => l.officialId === officialId);
  
  if (existingLinkIndex >= 0) {
    // 既存の本登録IDに対して、アポイントIDを追加（重複を排除）
    const unionIds = Array.from(new Set([...state.officialLinks[existingLinkIndex].appointmentIds, ...checkedIds]));
    state.officialLinks[existingLinkIndex].appointmentIds = unionIds;
  } else {
    // 新規紐付け
    state.officialLinks.push({
      officialId: officialId,
      customerName: customerName,
      appointmentIds: checkedIds,
      linkedAt: new Date().toISOString()
    });
  }

  // 各アポイントレコードに本登録ID参照を追加
  checkedIds.forEach(id => {
    const app = state.appointments.find(a => a.id === id);
    if (app) {
      app.officialId = officialId;
    }
  });

  localStorage.setItem(STORAGE_KEYS.OFFICIAL_LINKS, JSON.stringify(state.officialLinks));
  localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(state.appointments));

  showToast(`本登録ID ${officialId} に過去アポイント履歴（${checkedIds.length}件）を紐付けました。`, 'success');
  
  // フォーム再表示
  renderLinkOfficialScreen();
}

// 紐付け済みID一覧の描画
function renderLinkedIdsList() {
  const container = document.getElementById('linked-ids-list');
  if (!container) return;
  container.innerHTML = '';

  if (state.officialLinks.length === 0) {
    container.innerHTML = '<div style="padding: 1rem; text-align: center; color: var(--text-muted); font-size: 0.85rem;">紐付けデータはありません</div>';
    return;
  }

  state.officialLinks.forEach(link => {
    const card = document.createElement('div');
    card.className = 'history-item';
    card.style.display = 'block';
    card.style.padding = '0.75rem 1rem';
    card.style.background = 'var(--bg-surface-elevated)';
    card.style.border = '1px solid var(--border-color)';
    card.style.marginBottom = '0.5rem';

    // 紐付けられたアポイントIDのリスト表示
    const idsHtml = link.appointmentIds.map(id => 
      `<span style="font-family: monospace; font-size: 0.75rem; background: var(--bg-surface); padding: 0.1rem 0.3rem; border-radius: 4px; border: 1px solid var(--border-color);">${id}</span>`
    ).join(' ');

    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
        <span class="badge badge-official" style="font-weight: 700;">正式ID: ${link.officialId}</span>
        <span style="font-size: 0.75rem; color: var(--text-muted);">${link.customerName} 様</span>
      </div>
      <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 0.4rem;">
        紐付けられた過去アポイント:
      </div>
      <div style="display: flex; flex-wrap: wrap; gap: 0.25rem;">
        ${idsHtml}
      </div>
    `;
    container.appendChild(card);
  });
}

// 代理店情報の描画
// 代理店情報の描画
function renderAgencyInfo() {
  const listSection = document.querySelector('#agency-info-screen .list-section');
  if (listSection) {
    renderTableControlBar('ag', listSection);
  }

  const tbody = document.getElementById('agency-table-body');
  if (!tbody) return;
  tbody.innerHTML = '';

  const columns = state.agColumns;
  const contracts = state.agContracts;
  
  let filteredContracts = contracts;
  Object.keys(state.agFilters).forEach(colId => {
    const selectedValues = state.agFilters[colId];
    if (selectedValues) {
      filteredContracts = filteredContracts.filter(contract => 
        selectedValues.includes(String(contract[colId] || ''))
      );
    }
  });
  filteredContracts = filteredContracts.filter(contract => {
    const rowAccess = checkRowAccess('agency-info-screen', contract);
    return rowAccess.visible;
  });
  
  const isAdmin = state.currentUser && state.currentUser.id === 'admin';
  const baseVisibleColumnIds = isAdmin ? columns.map(c => c.id) : state.agVisibleColumns;
  const visibleColumnIds = [];
  columns.forEach(col => {
    const access = checkColumnAccess('agency-info-screen', col.id);
    if (access.visible) {
      if (baseVisibleColumnIds.includes(col.id) || access.grayout) {
        visibleColumnIds.push(col.id);
      }
    }
  });
  
  const selectorBtn = document.getElementById('ag-column-selector-btn');
  if (selectorBtn) {
    selectorBtn.style.display = isAdmin ? 'none' : 'block';
  }

  // --- 固定ウィンドウ枠 of ag ---
  const fixedColIds = [];
  if (state.agFixedCol !== 'none') {
    for (let i = 0; i < columns.length; i++) {
      const col = columns[i];
      if (visibleColumnIds.includes(col.id)) {
        fixedColIds.push(col.id);
        if (col.id === state.agFixedCol) {
          break;
        }
      }
    }
  }

  const leftPosMap = {};
  let currentLeft = 50; // 行番号列
  if (fixedColIds.length > 0) {
    fixedColIds.forEach(colId => {
      leftPosMap[colId] = currentLeft;
      const w = state.agColumnWidths[colId] || 120;
      currentLeft += w;
    });
  }

  const fixedRowLimit = state.agFixedRow !== 'none' ? parseInt(state.agFixedRow, 10) : 0;
  const topPosMap = {};
  let currentTop = 54; // ヘッダーの高さ (列記号24px + カラム名30px)
  if (fixedRowLimit > 0) {
    for (let i = 0; i < fixedRowLimit; i++) {
      topPosMap[i] = currentTop;
      const rHeight = state.agRowHeights[i] || 30;
      currentTop += rHeight;
    }
  }

  // ヘッダーの動的生成
  const thead = document.getElementById('agency-table-thead');
  if (thead) {
    thead.innerHTML = '';

    const lettersRow = document.createElement('tr');
    lettersRow.className = 'col-letters-row';
    lettersRow.style.height = '24px';

    const isAllSelected = state.agSelectedRows.size > 0 && state.agSelectedRows.size === filteredContracts.length;
    const cornerTh1 = document.createElement('th');
    cornerTh1.className = 'row-number-col' + (isAllSelected ? ' active-row-header' : '');
    cornerTh1.style.position = 'sticky';
    cornerTh1.style.top = '0px';
    cornerTh1.style.left = '0px';
    cornerTh1.style.zIndex = '30';
    cornerTh1.style.height = '24px';
    cornerTh1.style.lineHeight = '24px';
    cornerTh1.style.padding = '0';
    cornerTh1.style.cursor = 'pointer';
    cornerTh1.addEventListener('click', (e) => {
      e.stopPropagation();
      state.agSelectedCell = null;
      state.agSelectedRow = null;
      state.agSelectedCol = null;
      state.agSelectedRows.clear();
      state.agSelectedCols.clear();
      state.agSelectedCells.clear();
      
      const tbody = document.getElementById('agency-table-body');
      if (tbody) {
        const rows = tbody.querySelectorAll('tr');
        rows.forEach((_, idx) => {
          state.agSelectedRows.add(idx);
        });
      }
      
      renderAgencyInfo();
      syncAgFormatToolbar();
    });
    lettersRow.appendChild(cornerTh1);

    let colIndex = 0;
    columns.forEach(col => {
      if (visibleColumnIds.includes(col.id)) {
        const th = document.createElement('th');
        th.setAttribute('data-col-id', col.id);
        const w = state.agColumnWidths[col.id] || 120;
        th.style.width = `${w}px`;
        th.style.maxWidth = `${w}px`;
        th.style.minWidth = `${w}px`;
        th.style.position = 'sticky';
        th.style.top = '0px';
        th.style.zIndex = '10';
        th.style.height = '24px';
        th.style.lineHeight = '24px';
        th.style.padding = '0';
        th.style.fontSize = '0.75rem';
        th.style.cursor = 'pointer';

        if (fixedColIds.includes(col.id)) {
          th.style.left = `${leftPosMap[col.id]}px`;
          th.style.zIndex = '15';
        }
        if (state.agSelectedCol === col.id || state.agSelectedCols.has(col.id) || isAllSelected) {
          th.classList.add('active-col-header');
        }

        th.textContent = getColumnLetter(colIndex);
        
        // 列選択イベント
        const currentColId = col.id;
        th.addEventListener('mousedown', (e) => {
          if (e.button !== 0) return; // 左クリックのみ
          e.stopPropagation();
          state.isSelectingCols = true;
          if (!e.ctrlKey && !e.metaKey) {
            state.agSelectedCell = null;
            state.agSelectedRange = null;
            state.agSelectedRows.clear();
            state.agSelectedCells.clear();
          }

          if (e.ctrlKey || e.metaKey) {
            // 非連続
            if (state.agSelectedCols.has(currentColId)) {
              state.agSelectedCols.delete(currentColId);
            } else {
              state.agSelectedCols.add(currentColId);
            }
          } else if (e.shiftKey && state.agLastSelectedCol) {
            // 連続
            const visibleCols = columns.filter(c => visibleColumnIds.includes(c.id));
            const startIdx = visibleCols.findIndex(c => c.id === state.agLastSelectedCol);
            const endIdx = visibleCols.findIndex(c => c.id === currentColId);
            if (startIdx !== -1 && endIdx !== -1) {
              state.agSelectedCols.clear();
              const minIdx = Math.min(startIdx, endIdx);
              const maxIdx = Math.max(startIdx, endIdx);
              for (let i = minIdx; i <= maxIdx; i++) {
                state.agSelectedCols.add(visibleCols[i].id);
              }
            }
          } else {
            // 単一選択
            state.agSelectedCols.clear();
            state.agSelectedCols.add(currentColId);
          }
          state.agLastSelectedCol = currentColId;
          if (!e.shiftKey) {
            state.agColumnSelectAnchor = currentColId;
          }
          renderAgencyInfo();
          syncAgFormatToolbar();
        });

        th.addEventListener('mouseenter', () => {
          if (state.isSelectingCols && state.agLastSelectedCol) {
            const visibleCols = columns.filter(c => visibleColumnIds.includes(c.id));
            const startIdx = visibleCols.findIndex(c => c.id === state.agLastSelectedCol);
            const endIdx = visibleCols.findIndex(c => c.id === currentColId);
            if (startIdx !== -1 && endIdx !== -1) {
              state.agSelectedCols.clear();
              const minIdx = Math.min(startIdx, endIdx);
              const maxIdx = Math.max(startIdx, endIdx);
              for (let i = minIdx; i <= maxIdx; i++) {
                state.agSelectedCols.add(visibleCols[i].id);
              }
              renderAgencyInfo();
            }
          }
        });
        th.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (window.logToDebugPanel) {
            window.logToDebugPanel(`contextmenu (ag lettersRow th): col.id=${col.id}`, '#ffd700');
          }
          showCtContextMenu(e.clientX, e.clientY, { id: 'agency-info-screen', name: '代理店マスタ', columns: state.agColumns }, 'col', col.id);
        });

        lettersRow.appendChild(th);
        colIndex++;
      }
    });
    thead.appendChild(lettersRow);

    const namesRow = document.createElement('tr');
    namesRow.className = 'col-names-row';
    namesRow.style.borderBottom = '1px solid var(--border-color)';
    namesRow.style.height = '30px';

    const cornerTh2 = document.createElement('th');
    cornerTh2.className = 'row-number-col' + (isAllSelected ? ' active-row-header' : '');
    cornerTh2.style.position = 'sticky';
    cornerTh2.style.top = '24px';
    cornerTh2.style.zIndex = '25';
    cornerTh2.style.height = '30px';
    cornerTh2.style.lineHeight = '30px';
    cornerTh2.style.padding = '0';
    cornerTh2.style.cursor = 'pointer';
    if (fixedColIds.length > 0) {
      cornerTh2.style.left = '0px';
    }
    cornerTh2.addEventListener('click', (e) => {
      e.stopPropagation();
      state.agSelectedCell = null;
      state.agSelectedRow = null;
      state.agSelectedCol = null;
      state.agSelectedRows.clear();
      state.agSelectedCols.clear();
      state.agSelectedCells.clear();
      
      const tbody = document.getElementById('agency-table-body');
      if (tbody) {
        const rows = tbody.querySelectorAll('tr');
        rows.forEach((_, idx) => {
          state.agSelectedRows.add(idx);
        });
      }
      
      renderAgencyInfo();
      syncAgFormatToolbar();
    });
    namesRow.appendChild(cornerTh2);

    columns.forEach(col => {
      if (visibleColumnIds.includes(col.id)) {
        const th = document.createElement('th');
        th.style.padding = '0.35rem 0.5rem';
        th.title = col.label;
        th.setAttribute('data-col-id', col.id);
        const w = state.agColumnWidths[col.id] || 120;
        th.style.width = `${w}px`;
        th.style.maxWidth = `${w}px`;
        th.style.minWidth = `${w}px`;
        th.style.position = 'sticky';
        th.style.top = '24px';
        th.style.zIndex = '10';
        th.style.height = '30px';
        th.style.boxSizing = 'border-box';
        th.style.cursor = 'pointer';

        if (fixedColIds.includes(col.id)) {
          th.style.left = `${leftPosMap[col.id]}px`;
          th.style.zIndex = '15';
        }
        if (state.agSelectedCol === col.id || state.agSelectedCols.has(col.id)) {
          th.classList.add('active-col-header');
        }

        const isFiltered = state.agFilters[col.id] && state.agFilters[col.id].length > 0;
        const activeClass = isFiltered ? ' filter-btn-active' : '';

        th.innerHTML = `
          <div class="th-filter-container" style="height: 100%; display: flex; align-items: center; justify-content: space-between;">
            <span style="font-size: 0.75rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1;">${col.label}</span>
            <button class="btn-filter-toggle${activeClass}" data-col-id="${col.id}" style="background: transparent; border: none; padding: 0.1rem 0.2rem; color: var(--text-muted); cursor: pointer; font-size: 0.65rem; transition: color 0.2s; margin-left: 2px;">
              ▼
            </button>
          </div>
          <div class="column-resizer"></div>
        `;

        const colAccess = checkColumnAccess('agency-info-screen', col.id);
        if (colAccess.grayout) {
          th.classList.add('grayed-out-access');
          const filterContainer = th.querySelector('.th-filter-container');
          appendInlineGrantBtn(filterContainer, () => {
            grantColumnPermissionDirect('agency-info-screen', col.id);
          });
        }

        const btn = th.querySelector('.btn-filter-toggle');
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          openAgFilterMenu(col.id, col.label, btn, contracts);
        });

        th.addEventListener('mousedown', (e) => {
          if (e.target.classList.contains('btn-filter-toggle') || e.target.closest('.btn-filter-toggle')) return;
          if (e.button !== 0) return; // 左クリックのみ
          e.stopPropagation();
          state.isSelectingCols = true;
          state.agSelectedCell = null;
          state.agSelectedRange = null;
          state.agSelectedRows.clear();

          const currentColId = col.id;
          if (e.ctrlKey || e.metaKey) {
            if (state.agSelectedCols.has(currentColId)) {
              state.agSelectedCols.delete(currentColId);
            } else {
              state.agSelectedCols.add(currentColId);
            }
          } else if (e.shiftKey && state.agLastSelectedCol) {
            const visibleCols = columns.filter(c => visibleColumnIds.includes(c.id));
            const startIdx = visibleCols.findIndex(c => c.id === state.agLastSelectedCol);
            const endIdx = visibleCols.findIndex(c => c.id === currentColId);
            if (startIdx !== -1 && endIdx !== -1) {
              state.agSelectedCols.clear();
              const minIdx = Math.min(startIdx, endIdx);
              const maxIdx = Math.max(startIdx, endIdx);
              for (let i = minIdx; i <= maxIdx; i++) {
                state.agSelectedCols.add(visibleCols[i].id);
              }
            }
          } else {
            state.agSelectedCols.clear();
            state.agSelectedCols.add(currentColId);
          }
          state.agLastSelectedCol = currentColId;
          renderAgencyInfo();
          syncAgFormatToolbar();
        });

        th.addEventListener('mouseenter', () => {
          if (state.isSelectingCols && state.agLastSelectedCol) {
            const visibleCols = columns.filter(c => visibleColumnIds.includes(c.id));
            const startIdx = visibleCols.findIndex(c => c.id === state.agLastSelectedCol);
            const endIdx = visibleCols.findIndex(c => c.id === col.id);
            if (startIdx !== -1 && endIdx !== -1) {
              state.agSelectedCols.clear();
              const minIdx = Math.min(startIdx, endIdx);
              const maxIdx = Math.max(startIdx, endIdx);
              for (let i = minIdx; i <= maxIdx; i++) {
                state.agSelectedCols.add(visibleCols[i].id);
              }
              renderAgencyInfo();
            }
          }
        });

        th.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (window.logToDebugPanel) {
            window.logToDebugPanel(`contextmenu (ag namesRow th): col.id=${col.id}`, '#ffd700');
          }
          showCtContextMenu(e.clientX, e.clientY, { id: 'agency-info-screen', name: '代理店マスタ', columns: state.agColumns }, 'col', col.id);
        });

        initAgColumnResize(th, col.id);
        namesRow.appendChild(th);
      }
    });
    thead.appendChild(namesRow);
  }

  filteredContracts.forEach((contract, index) => {
    const rowAccess = checkRowAccess('agency-info-screen', contract);

    const rowHeight = state.agRowHeights[index] || 30;

    const tr = document.createElement('tr');
    tr.setAttribute('data-row-id', contract.customerId);
    tr.style.borderBottom = '1px solid var(--border-color)';
    tr.style.height = `${rowHeight}px`;
    tr.style.maxHeight = `${rowHeight}px`;
    tr.style.minHeight = `${rowHeight}px`;

    const rowNumTd = document.createElement('td');
    rowNumTd.className = 'row-number-col';
    rowNumTd.style.height = `${rowHeight}px`;
    rowNumTd.style.lineHeight = `${rowHeight}px`;
    rowNumTd.style.padding = '0';
    rowNumTd.style.fontSize = '0.75rem';
    rowNumTd.style.cursor = 'pointer';
    rowNumTd.style.position = 'relative';

    if (rowAccess.grayout) {
      tr.classList.add('grayed-out-access');
      rowNumTd.innerHTML = `${index + 1} <span class="grant-row-btn" style="cursor: pointer; color: var(--primary); font-size: 0.75rem; margin-left: 2px;" title="この行の表示条件を解除（全行表示に更新）">🔓</span>`;
      rowNumTd.querySelector('.grant-row-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        grantRowPermission('agency-info-screen');
      });
    } else {
      rowNumTd.textContent = index + 1;
    }

    const rowResizer = document.createElement('div');
    rowResizer.className = 'row-resizer';
    rowResizer.style.zIndex = '50';
    rowNumTd.appendChild(rowResizer);
    setupMasterRowResize('ag', index, rowResizer);
    setupMasterRowContextMenu('ag', index, rowNumTd);

    if (fixedColIds.length > 0) {
      rowNumTd.style.position = 'sticky';
      rowNumTd.style.left = '0px';
      rowNumTd.style.zIndex = '12';
    }
    if (index < fixedRowLimit) {
      rowNumTd.style.position = 'sticky';
      rowNumTd.style.top = `${topPosMap[index]}px`;
      rowNumTd.style.zIndex = fixedColIds.length > 0 ? '14' : '13';
    }
    if (state.agSelectedRow === index || state.agSelectedRows.has(index)) {
      rowNumTd.classList.add('active-row-header');
    }

    rowNumTd.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return; // 左クリックのみ
      e.stopPropagation();
      state.isSelectingRows = true;

      const currentRowIdx = index;
      if (e.ctrlKey || e.metaKey) {
        // Ctrl: 他の選択を維持してトグル
        if (state.agSelectedRows.has(currentRowIdx)) {
          state.agSelectedRows.delete(currentRowIdx);
        } else {
          state.agSelectedRows.add(currentRowIdx);
        }
      } else if (e.shiftKey && state.agLastSelectedRow !== null) {
        // Shift: 連続選択
        state.agSelectedRows.clear();
        state.agSelectedCols.clear();
        state.agSelectedCells.clear();
        state.agSelectedCell = null;
        state.agSelectedRange = null;

        const minR = Math.min(state.agLastSelectedRow, currentRowIdx);
        const maxR = Math.max(state.agLastSelectedRow, currentRowIdx);
        for (let r = minR; r <= maxR; r++) {
          state.agSelectedRows.add(r);
        }
      } else {
        // 通常
        state.agSelectedCell = null;
        state.agSelectedRange = null;
        state.agSelectedCols.clear();
        state.agSelectedCells.clear();
        state.agSelectedRows.clear();
        state.agSelectedRows.add(currentRowIdx);
      }
      state.agLastSelectedRow = currentRowIdx;
      renderAgencyInfo();
      syncAgFormatToolbar();
    });

    rowNumTd.addEventListener('mouseenter', () => {
      if (state.isSelectingRows && state.agLastSelectedRow !== null) {
        state.agSelectedRows.clear();
        const minR = Math.min(state.agLastSelectedRow, index);
        const maxR = Math.max(state.agLastSelectedRow, index);
        for (let r = minR; r <= maxR; r++) {
          state.agSelectedRows.add(r);
        }
        renderAgencyInfo();
      }
    });
    tr.appendChild(rowNumTd);

    let vColIdx = 0;
    columns.forEach(col => {
      if (visibleColumnIds.includes(col.id)) {
        const val = contract[col.id] || '';
        const td = document.createElement('td');
        td.style.padding = '0.3rem 0.6rem';
        td.style.height = `${rowHeight}px`;
        td.style.maxHeight = `${rowHeight}px`;
        td.style.minHeight = `${rowHeight}px`;
        td.style.boxSizing = 'border-box';
        td.style.fontSize = '0.8rem';
        td.setAttribute('data-col-id', col.id);
        td.setAttribute('data-customer-id', contract.customerId);

        const w = state.agColumnWidths[col.id] || 120;
        td.style.width = `${w}px`;
        td.style.maxWidth = `${w}px`;
        td.style.minWidth = `${w}px`;

        let isSticky = false;
        if (fixedColIds.includes(col.id)) {
          td.style.position = 'sticky';
          td.style.left = `${leftPosMap[col.id]}px`;
          td.style.zIndex = '10';
          isSticky = true;
        }
        if (index < fixedRowLimit) {
          td.style.position = 'sticky';
          td.style.top = `${topPosMap[index]}px`;
          td.style.zIndex = isSticky ? '14' : '9';
          isSticky = true;
        }
        if (isSticky) {
          td.style.backgroundColor = 'var(--bg-surface)';
        }

        const cellKey = `${contract.customerId}_${col.id}`;
        const styleObj = getCellFormatStyles('ag', contract.customerId, col.id, contract, val);

        applyInlineStylesToCell(td, styleObj);

        if (styleObj['background-color']) {
          td.style.backgroundColor = styleObj['background-color'];
        } else if (isSticky) {
          td.style.backgroundColor = 'var(--bg-surface)';
        }

        td.title = String(val);

        // バッジや書式のデフォルト
        let isDropdownRendered = renderMasterDropdownCellMarkup(td, val, col, styleObj);
        if (!isDropdownRendered) {
          if (col.id === 'status') {
            td.innerHTML = `<span class="badge badge-official">${val}</span>`;
            if (styleObj['background-color']) {
              const badgeSpan = td.querySelector('.badge');
              if (badgeSpan) badgeSpan.style.backgroundColor = styleObj['background-color'];
            }
          } else if (col.id === 'name') {
            td.style.fontWeight = styleObj['font-weight'] || '600';
            td.style.color = styleObj['color'] || 'var(--text-primary)';
            td.textContent = val;
          } else if (col.id === 'count') {
            td.style.fontWeight = styleObj['font-weight'] || 'bold';
            td.style.color = styleObj['color'] || 'var(--secondary)';
            td.textContent = val;
          } else {
            td.style.color = styleObj['color'] || 'var(--text-secondary)';
            td.textContent = val;
          }
        }

        let inRange = false;
        if (state.agSelectedRange) {
          const minR = Math.min(state.agSelectedRange.startRow, state.agSelectedRange.endRow);
          const maxR = Math.max(state.agSelectedRange.startRow, state.agSelectedRange.endRow);
          const minC = Math.min(state.agSelectedRange.startCol, state.agSelectedRange.endCol);
          const maxC = Math.max(state.agSelectedRange.startCol, state.agSelectedRange.endCol);
          if (index >= minR && index <= maxR && vColIdx >= minC && vColIdx <= maxC) {
            inRange = true;
          }
        }

        const currentCellKey = `${contract.customerId}_${col.id}`;
        const isSelected = (state.agSelectedCell && 
                            state.agSelectedCell.customerId === contract.customerId && 
                            state.agSelectedCell.colId === col.id) ||
                           state.agSelectedCells.has(currentCellKey);
        if (isSelected) {
          td.classList.add('selected-cell');
        }
        if (state.agSelectedRow === index || state.agSelectedRows.has(index)) {
          td.classList.add('selected-row-cell');
        }
        if (state.agSelectedCol === col.id || state.agSelectedCols.has(col.id)) {
          td.classList.add('selected-col-cell');
        }
        if (inRange) {
          td.classList.add('in-range-cell');
        }

        td.style.cursor = 'pointer';

        const currentRow = index;
        const currentColIdx = vColIdx;

        td.addEventListener('mousedown', (e) => {
          if (e.button !== 0) return; // 左クリックのみ
          e.stopPropagation();

          const isSelect = col.type === 'select' || (col.choices && col.choices.length > 0);
          if (isSelect) {
            startMasterDropdownEdit(td, val, col, contract, index, 'ag');
            return;
          }

          const cellKey = `${contract.customerId}_${col.id}`;

          if (e.ctrlKey || e.metaKey) {
            // Ctrl: 非連続
            if (state.agSelectedCells.has(cellKey)) {
              state.agSelectedCells.delete(cellKey);
            } else {
              state.agSelectedCells.add(cellKey);
            }
            state.agSelectedCell = { customerId: contract.customerId, colId: col.id };
            state.agSelectedRange = null;
          } else if (e.shiftKey && state.agSelectedCell) {
            const activeColId = state.agSelectedCell.colId;
            const visibleCols = columns.filter(c => visibleColumnIds.includes(c.id));
            const activeColIdx = visibleCols.findIndex(c => c.id === activeColId);
            const activeRowIdx = filteredContracts.findIndex(c => c.customerId === state.agSelectedCell.customerId);

            if (activeColIdx !== -1 && activeRowIdx !== -1) {
              state.agSelectedRange = {
                startRow: activeRowIdx,
                startCol: activeColIdx,
                endRow: currentRow,
                endCol: currentColIdx
              };
              state.agSelectedCells.clear();
            }
          } else {
            state.isSelecting = true;
            state.agSelectedRange = {
              startRow: currentRow,
              startCol: currentColIdx,
              endRow: currentRow,
              endCol: currentColIdx
            };
            state.agSelectedRow = null;
            state.agSelectedCol = null;
            state.agSelectedRows.clear();
            state.agSelectedCols.clear();
            state.agColumnSelectAnchor = null;
            state.agColumnSelectLast = null;
            state.agSelectedCell = { customerId: contract.customerId, colId: col.id };
            state.agSelectedCells.clear();
            state.agSelectedCells.add(cellKey);
          }
          renderAgencyInfo();
          syncAgFormatToolbar();
        });

        td.addEventListener('mouseenter', () => {
          if (state.isSelecting && state.agSelectedRange) {
            state.agSelectedRange.endRow = currentRow;
            state.agSelectedRange.endCol = currentColIdx;
            renderAgencyInfo();
            syncAgFormatToolbar();
          }
        });

        td.addEventListener('click', (e) => {
          e.stopPropagation();
          const isSelect = col.type === 'select' || (col.choices && col.choices.length > 0);
          if (isSelect) {
            if (isTableLocked('ag')) return;
            startMasterDropdownEdit(td, val, col, contract, index, 'ag');
          }
        });

        td.addEventListener('dblclick', (e) => {
          if (!isTableLocked('ag')) {
            startMasterCellEdit(td, val, col, contract, index, 'ag');
          } else {
            td.classList.toggle('cell-expanded');
          }
        });

        tr.appendChild(td);
        vColIdx++;
      }
    });
    tbody.appendChild(tr);
  });
  
  updateSelectionStatsWidget();
  adjustOverflowCells(document.querySelector('#agency-info-screen .spreadsheet-table'));
}

// 表示項目の選択ドロップダウンの制御
function setupJoColumnSelectorToggle() {
  const btn = document.getElementById('jo-column-selector-btn');
  const dropdown = document.getElementById('jo-column-selector-dropdown');
  
  if (btn && dropdown) {
    if (btn.dataset.listenerAttached) return;
    btn.dataset.listenerAttached = 'true';

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = dropdown.style.display === 'none' || !dropdown.style.display;
      
      const frameDropdown = document.getElementById('jo-frame-fix-dropdown');
      if (frameDropdown) frameDropdown.style.display = 'none';

      dropdown.style.display = isHidden ? 'block' : 'none';
    });

    // 外側をクリックした際に閉じる
    document.addEventListener('mousedown', (e) => {
      if (!dropdown.contains(e.target) && !btn.contains(e.target)) {
        dropdown.style.display = 'none';
      }
    }, true);
  }
}

// 表示項目の選択ドロップダウンの制御（申込者）
function setupApColumnSelectorToggle() {
  const btn = document.getElementById('ap-column-selector-btn');
  const dropdown = document.getElementById('ap-column-selector-dropdown');
  
  if (btn && dropdown) {
    if (btn.dataset.listenerAttached) return;
    btn.dataset.listenerAttached = 'true';

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = dropdown.style.display === 'none' || !dropdown.style.display;
      const frameDropdown = document.getElementById('ap-frame-fix-dropdown');
      if (frameDropdown) frameDropdown.style.display = 'none';
      dropdown.style.display = isHidden ? 'block' : 'none';
    });

    document.addEventListener('mousedown', (e) => {
      if (!dropdown.contains(e.target) && !btn.contains(e.target)) {
        dropdown.style.display = 'none';
      }
    }, true);
  }
}

// ウィンドウ枠の固定制御（申込者）
function setupApFrameFixControls(columns) {
  const btn = document.getElementById('ap-frame-fix-btn');
  const dropdown = document.getElementById('ap-frame-fix-dropdown');
  const colSelect = document.getElementById('ap-fix-col-select');
  const rowSelect = document.getElementById('ap-fix-row-select');

  if (btn && dropdown && colSelect && rowSelect) {
    if (btn.dataset.listenerAttached) return;
    btn.dataset.listenerAttached = 'true';

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = dropdown.style.display === 'none' || !dropdown.style.display;
      const colDropdown = document.getElementById('ap-column-selector-dropdown');
      if (colDropdown) colDropdown.style.display = 'none';
      dropdown.style.display = isHidden ? 'block' : 'none';
      
      if (isHidden) {
        colSelect.innerHTML = '<option value="none">固定しない</option>';
        let activeColIndex = 0;
        columns.forEach(col => {
          if (state.apVisibleColumns.includes(col.id)) {
            const letter = getColumnLetter(activeColIndex);
            const option = document.createElement('option');
            option.value = col.id;
            option.textContent = `${letter}列 (${col.label}) まで固定`;
            option.selected = state.apFixedCol === col.id;
            colSelect.appendChild(option);
            activeColIndex++;
          }
        });
        rowSelect.value = state.apFixedRow;
      }
    });

    document.addEventListener('mousedown', (e) => {
      if (!dropdown.contains(e.target) && !btn.contains(e.target)) {
        dropdown.style.display = 'none';
      }
    }, true);

    colSelect.addEventListener('change', (e) => {
      state.apFixedCol = e.target.value;
      setSettingItem(STORAGE_KEYS.AP_FIXED_COL, state.apFixedCol);
      renderApplicantInfo();
    });

    rowSelect.addEventListener('change', (e) => {
      state.apFixedRow = e.target.value;
      setSettingItem(STORAGE_KEYS.AP_FIXED_ROW, state.apFixedRow);
      renderApplicantInfo();
    });
  }
}

// 申込者情報の表示項目カスタマイズのチェックボックスを生成
function renderApColumnSelector() {
  setupApColumnSelectorToggle();

  const container = document.getElementById('ap-column-selector');
  if (!container) return;
  container.innerHTML = '';

  const columns = state.apColumns;
  setupApFrameFixControls(columns);

  columns.forEach(col => {
    if (col.required) return;

    const label = document.createElement('label');
    label.style.display = 'inline-flex';
    label.style.alignItems = 'center';
    label.style.gap = '0.4rem';
    label.style.cursor = 'pointer';
    label.style.color = 'var(--text-primary)';
    label.style.userSelect = 'none';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = col.id;
    checkbox.checked = state.apVisibleColumns.includes(col.id);

    checkbox.addEventListener('change', (e) => {
      if (e.target.checked) {
        if (!state.apVisibleColumns.includes(col.id)) {
          state.apVisibleColumns.push(col.id);
        }
      } else {
        state.apVisibleColumns = state.apVisibleColumns.filter(id => id !== col.id);
      }
      setSettingItem(STORAGE_KEYS.AP_VISIBLE_COLUMNS, JSON.stringify(state.apVisibleColumns));
      renderApplicantInfo();
    });

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(col.label));
    container.appendChild(label);
  });
}

// 申込者情報のフィルタメニューを開く
function openApFilterMenu(colId, colLabel, anchorElement, allContracts) {
  const container = document.getElementById('jo-filter-dropdown-container');
  if (!container) return;

  const isAlreadyOpen = container.dataset.activeColId === `ap_${colId}`;
  closeAllFilterMenus();
  if (isAlreadyOpen) return;

  container.dataset.activeColId = `ap_${colId}`;

  const backdrop = document.createElement('div');
  backdrop.className = 'filter-menu-backdrop';
  backdrop.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 999; background: transparent; cursor: default;';
  
  const handleBackdropClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeAllFilterMenus();
  };
  
  backdrop.addEventListener('mousedown', handleBackdropClick, true);
  backdrop.addEventListener('pointerdown', handleBackdropClick, true);
  backdrop.addEventListener('touchstart', handleBackdropClick, true);
  document.body.appendChild(backdrop);

  const rect = anchorElement.getBoundingClientRect();
  const dropdown = document.createElement('div');
  dropdown.className = 'filter-dropdown';
  dropdown.style.top = `${rect.bottom + window.scrollY + 5}px`;
  
  const menuWidth = 240;
  let leftPos = rect.left + window.scrollX;
  if (leftPos + menuWidth > window.innerWidth) {
    leftPos = window.innerWidth - menuWidth - 20;
  }
  dropdown.style.left = `${leftPos}px`;

  const uniqueValues = Array.from(new Set(allContracts.map(c => String(c[colId] || ''))));
  let currentSelection = state.apFilters[colId] ? [...state.apFilters[colId]] : [...uniqueValues];

  dropdown.innerHTML = `
    <div style="font-weight: 600; margin-bottom: 0.25rem; color: var(--text-primary);">${colLabel} でフィルタ</div>
    <input type="text" class="filter-search-input" placeholder="テキストで検索..." />
    <div style="display: flex; gap: 0.5rem; margin: 0.25rem 0;">
      <button class="btn-text" id="filter-btn-select-all" style="padding: 0; font-size: 0.7rem; color: var(--secondary);">すべて選択</button>
      <button class="btn-text" id="filter-btn-clear-all" style="padding: 0; font-size: 0.7rem; color: var(--danger);">すべてクリア</button>
    </div>
    <div class="filter-list" id="filter-list-items"></div>
    <div class="filter-actions">
      <button class="btn-secondary" id="filter-btn-clear" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">フィルタ解除</button>
      <button class="btn-primary" id="filter-btn-apply" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">適用</button>
    </div>
  `;

  container.appendChild(dropdown);

  const searchInput = dropdown.querySelector('.filter-search-input');
  const itemsContainer = dropdown.querySelector('#filter-list-items');
  const selectAllBtn = dropdown.querySelector('#filter-btn-select-all');
  const clearAllBtn = dropdown.querySelector('#filter-btn-clear-all');
  const clearBtn = dropdown.querySelector('#filter-btn-clear');
  const applyBtn = dropdown.querySelector('#filter-btn-apply');

  const col = state.apColumns.find(c => c.id === colId);
  const colorSection = createColorFilterSection(col, (targetVal) => {
    currentSelection = [targetVal];
    if (applyBtn) applyBtn.click();
  });

  if (colorSection && searchInput) {
    dropdown.insertBefore(colorSection, searchInput);
  }

  function renderList(filterQuery = '') {
    itemsContainer.innerHTML = '';
    const filteredVals = uniqueValues.filter(val => 
      val.toLowerCase().includes(filterQuery.toLowerCase())
    );

    if (filteredVals.length === 0) {
      itemsContainer.innerHTML = '<div style="color: var(--text-muted); font-size: 0.75rem; text-align: center; padding: 0.5rem;">候補なし</div>';
      return;
    }

    filteredVals.forEach(val => {
      const itemLabel = document.createElement('label');
      itemLabel.className = 'filter-list-item';
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = val;
      checkbox.checked = currentSelection.includes(val);

      checkbox.addEventListener('change', (e) => {
        if (e.target.checked) {
          if (!currentSelection.includes(val)) currentSelection.push(val);
        } else {
          currentSelection = currentSelection.filter(v => v !== val);
        }
      });

      itemLabel.appendChild(checkbox);
      itemLabel.appendChild(document.createTextNode(val || '(空白)'));
      itemsContainer.appendChild(itemLabel);
    });
  }

  renderList();

  searchInput.addEventListener('input', (e) => {
    renderList(searchInput.value.trim());
  });

  selectAllBtn.addEventListener('click', () => {
    currentSelection = [...uniqueValues];
    renderList(searchInput.value.trim());
  });

  clearAllBtn.addEventListener('click', () => {
    currentSelection = [];
    renderList(searchInput.value.trim());
  });

  clearBtn.addEventListener('click', () => {
    delete state.apFilters[colId];
    closeAllFilterMenus();
    renderApplicantInfo();
  });

  applyBtn.addEventListener('click', () => {
    if (currentSelection.length === uniqueValues.length) {
      delete state.apFilters[colId];
    } else {
      state.apFilters[colId] = currentSelection;
    }
    closeAllFilterMenus();
    renderApplicantInfo();
  });

  const onScrollAction = (e) => {
    if (!dropdown.contains(e.target)) {
      closeAllFilterMenus();
      window.removeEventListener('scroll', onScrollAction, true);
    }
  };
  window.addEventListener('scroll', onScrollAction, true);
}

// カラム幅のドラッグリサイズ設定（申込者）
function initApColumnResize(th, colId) {
  const resizer = th.querySelector('.column-resizer');
  if (!resizer) return;

  resizer.addEventListener('mousedown', (e) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.pageX;
    const startWidth = th.offsetWidth;
    resizer.classList.add('resizing');

    const onMouseMove = (moveEvent) => {
      const dx = moveEvent.pageX - startX;
      const newWidth = Math.max(60, startWidth + dx);
      const cells = document.querySelectorAll(`#applicant-info-screen [data-col-id="${colId}"]`);
      cells.forEach(cell => {
        cell.style.width = `${newWidth}px`;
        cell.style.maxWidth = `${newWidth}px`;
        cell.style.minWidth = `${newWidth}px`;
      });
    };

    const onMouseUp = () => {
      resizer.classList.remove('resizing');
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      const finalWidth = Math.max(60, th.offsetWidth);
      state.apColumnWidths[colId] = finalWidth;
      setSettingItem(STORAGE_KEYS.AP_COLUMN_WIDTHS, JSON.stringify(state.apColumnWidths));
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
}

// 表示項目の選択ドロップダウンの制御（代理店）
function setupAgColumnSelectorToggle() {
  const btn = document.getElementById('ag-column-selector-btn');
  const dropdown = document.getElementById('ag-column-selector-dropdown');
  
  if (btn && dropdown) {
    if (btn.dataset.listenerAttached) return;
    btn.dataset.listenerAttached = 'true';

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = dropdown.style.display === 'none' || !dropdown.style.display;
      const frameDropdown = document.getElementById('ag-frame-fix-dropdown');
      if (frameDropdown) frameDropdown.style.display = 'none';
      dropdown.style.display = isHidden ? 'block' : 'none';
    });

    document.addEventListener('mousedown', (e) => {
      if (!dropdown.contains(e.target) && !btn.contains(e.target)) {
        dropdown.style.display = 'none';
      }
    }, true);
  }
}

// ウィンドウ枠の固定制御（代理店）
function setupAgFrameFixControls(columns) {
  const btn = document.getElementById('ag-frame-fix-btn');
  const dropdown = document.getElementById('ag-frame-fix-dropdown');
  const colSelect = document.getElementById('ag-fix-col-select');
  const rowSelect = document.getElementById('ag-fix-row-select');

  if (btn && dropdown && colSelect && rowSelect) {
    if (btn.dataset.listenerAttached) return;
    btn.dataset.listenerAttached = 'true';

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = dropdown.style.display === 'none' || !dropdown.style.display;
      const colDropdown = document.getElementById('ag-column-selector-dropdown');
      if (colDropdown) colDropdown.style.display = 'none';
      dropdown.style.display = isHidden ? 'block' : 'none';
      
      if (isHidden) {
        colSelect.innerHTML = '<option value="none">固定しない</option>';
        let activeColIndex = 0;
        columns.forEach(col => {
          if (state.agVisibleColumns.includes(col.id)) {
            const letter = getColumnLetter(activeColIndex);
            const option = document.createElement('option');
            option.value = col.id;
            option.textContent = `${letter}列 (${col.label}) まで固定`;
            option.selected = state.agFixedCol === col.id;
            colSelect.appendChild(option);
            activeColIndex++;
          }
        });
        rowSelect.value = state.agFixedRow;
      }
    });

    document.addEventListener('mousedown', (e) => {
      if (!dropdown.contains(e.target) && !btn.contains(e.target)) {
        dropdown.style.display = 'none';
      }
    }, true);

    colSelect.addEventListener('change', (e) => {
      state.agFixedCol = e.target.value;
      setSettingItem(STORAGE_KEYS.AG_FIXED_COL, state.agFixedCol);
      renderAgencyInfo();
    });

    rowSelect.addEventListener('change', (e) => {
      state.agFixedRow = e.target.value;
      setSettingItem(STORAGE_KEYS.AG_FIXED_ROW, state.agFixedRow);
      renderAgencyInfo();
    });
  }
}

// 代理店情報の表示項目カスタマイズのチェックボックスを生成
function renderAgColumnSelector() {
  setupAgColumnSelectorToggle();

  const container = document.getElementById('ag-column-selector');
  if (!container) return;
  container.innerHTML = '';

  const columns = state.agColumns;
  setupAgFrameFixControls(columns);

  columns.forEach(col => {
    if (col.required) return;

    const label = document.createElement('label');
    label.style.display = 'inline-flex';
    label.style.alignItems = 'center';
    label.style.gap = '0.4rem';
    label.style.cursor = 'pointer';
    label.style.color = 'var(--text-primary)';
    label.style.userSelect = 'none';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = col.id;
    checkbox.checked = state.agVisibleColumns.includes(col.id);

    checkbox.addEventListener('change', (e) => {
      if (e.target.checked) {
        if (!state.agVisibleColumns.includes(col.id)) {
          state.agVisibleColumns.push(col.id);
        }
      } else {
        state.agVisibleColumns = state.agVisibleColumns.filter(id => id !== col.id);
      }
      setSettingItem(STORAGE_KEYS.AG_VISIBLE_COLUMNS, JSON.stringify(state.agVisibleColumns));
      renderAgencyInfo();
    });

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(col.label));
    container.appendChild(label);
  });
}

// 表示項目の選択ドロップダウンの制御（パートナーDB）
function setupDbmakeColumnSelectorToggle() {
  const btn = document.getElementById('dbmake-column-selector-btn');
  const dropdown = document.getElementById('dbmake-column-selector-dropdown');
  
  if (btn && dropdown) {
    if (btn.dataset.listenerAttached) return;
    btn.dataset.listenerAttached = 'true';

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = dropdown.style.display === 'none' || !dropdown.style.display;
      const frameDropdown = document.getElementById('dbmake-frame-fix-dropdown');
      if (frameDropdown) frameDropdown.style.display = 'none';
      dropdown.style.display = isHidden ? 'block' : 'none';
    });

    document.addEventListener('mousedown', (e) => {
      if (!dropdown.contains(e.target) && !btn.contains(e.target)) {
        dropdown.style.display = 'none';
      }
    }, true);
  }
}

// ウィンドウ枠の固定制御（パートナーDB）
function setupDbmakeFrameFixControls(columns) {
  const btn = document.getElementById('dbmake-frame-fix-btn');
  const dropdown = document.getElementById('dbmake-frame-fix-dropdown');
  const colSelect = document.getElementById('dbmake-fix-col-select');
  const rowSelect = document.getElementById('dbmake-fix-row-select');

  if (btn && dropdown && colSelect && rowSelect) {
    if (btn.dataset.listenerAttached) return;
    btn.dataset.listenerAttached = 'true';

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = dropdown.style.display === 'none' || !dropdown.style.display;
      const colDropdown = document.getElementById('dbmake-column-selector-dropdown');
      if (colDropdown) colDropdown.style.display = 'none';
      dropdown.style.display = isHidden ? 'block' : 'none';
      
      if (isHidden) {
        colSelect.innerHTML = '<option value="none">固定しない</option>';
        let activeColIndex = 0;
        columns.forEach(col => {
          if (state.dbmakeVisibleColumns.includes(col.id)) {
            const letter = getColumnLetter(activeColIndex);
            const option = document.createElement('option');
            option.value = col.id;
            option.textContent = `${letter}列 (${col.name}) まで固定`;
            option.selected = state.dbmakeFixedCol === col.id;
            colSelect.appendChild(option);
            activeColIndex++;
          }
        });
        rowSelect.value = state.dbmakeFixedRow;
      }
    });

    document.addEventListener('mousedown', (e) => {
      if (!dropdown.contains(e.target) && !btn.contains(e.target)) {
        dropdown.style.display = 'none';
      }
    }, true);

    colSelect.addEventListener('change', (e) => {
      state.dbmakeFixedCol = e.target.value;
      setSettingItem(STORAGE_KEYS.DBMAKE_FIXED_COL, state.dbmakeFixedCol);
      renderDbmakePartners();
    });

    rowSelect.addEventListener('change', (e) => {
      state.dbmakeFixedRow = e.target.value;
      setSettingItem(STORAGE_KEYS.DBMAKE_FIXED_ROW, state.dbmakeFixedRow);
      renderDbmakePartners();
    });
  }
}

// パートナーDBの表示項目カスタマイズのチェックボックスを生成
function renderDbmakeColumnSelector() {
  setupDbmakeColumnSelectorToggle();

  const container = document.getElementById('dbmake-column-selector');
  if (!container) return;
  container.innerHTML = '';

  const columns = state.dbmakeColumns;
  setupDbmakeFrameFixControls(columns);

  columns.forEach(col => {
    // 企業コード (id) は必須とし、非表示不可とする
    if (col.id === 'id') return;

    const label = document.createElement('label');
    label.style.display = 'inline-flex';
    label.style.alignItems = 'center';
    label.style.gap = '0.4rem';
    label.style.cursor = 'pointer';
    label.style.color = 'var(--text-primary)';
    label.style.userSelect = 'none';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = col.id;
    checkbox.checked = state.dbmakeVisibleColumns.includes(col.id);

    checkbox.addEventListener('change', (e) => {
      if (e.target.checked) {
        if (!state.dbmakeVisibleColumns.includes(col.id)) {
          // 元の順番を保って追加するため、columnsの並び順でソートして再生成
          const activeIds = [];
          columns.forEach(c => {
            if (c.id === 'id' || state.dbmakeVisibleColumns.includes(c.id) || c.id === col.id) {
              activeIds.push(c.id);
            }
          });
          state.dbmakeVisibleColumns = activeIds;
        }
      } else {
        state.dbmakeVisibleColumns = state.dbmakeVisibleColumns.filter(id => id !== col.id);
      }
      setSettingItem(STORAGE_KEYS.DBMAKE_VISIBLE_COLUMNS, JSON.stringify(state.dbmakeVisibleColumns));
      renderDbmakePartners();
    });

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(col.name));
    container.appendChild(label);
  });
}

// 代理店情報のフィルタメニューを開く
function openAgFilterMenu(colId, colLabel, anchorElement, allContracts) {
  const container = document.getElementById('jo-filter-dropdown-container');
  if (!container) return;

  const isAlreadyOpen = container.dataset.activeColId === `ag_${colId}`;
  closeAllFilterMenus();
  if (isAlreadyOpen) return;

  container.dataset.activeColId = `ag_${colId}`;

  const backdrop = document.createElement('div');
  backdrop.className = 'filter-menu-backdrop';
  backdrop.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 999; background: transparent; cursor: default;';
  
  const handleBackdropClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeAllFilterMenus();
  };
  
  backdrop.addEventListener('mousedown', handleBackdropClick, true);
  backdrop.addEventListener('pointerdown', handleBackdropClick, true);
  backdrop.addEventListener('touchstart', handleBackdropClick, true);
  document.body.appendChild(backdrop);

  const rect = anchorElement.getBoundingClientRect();
  const dropdown = document.createElement('div');
  dropdown.className = 'filter-dropdown';
  dropdown.style.top = `${rect.bottom + window.scrollY + 5}px`;
  
  const menuWidth = 240;
  let leftPos = rect.left + window.scrollX;
  if (leftPos + menuWidth > window.innerWidth) {
    leftPos = window.innerWidth - menuWidth - 20;
  }
  dropdown.style.left = `${leftPos}px`;

  const uniqueValues = Array.from(new Set(allContracts.map(c => String(c[colId] || ''))));
  let currentSelection = state.agFilters[colId] ? [...state.agFilters[colId]] : [...uniqueValues];

  dropdown.innerHTML = `
    <div style="font-weight: 600; margin-bottom: 0.25rem; color: var(--text-primary);">${colLabel} でフィルタ</div>
    <input type="text" class="filter-search-input" placeholder="テキストで検索..." />
    <div style="display: flex; gap: 0.5rem; margin: 0.25rem 0;">
      <button class="btn-text" id="filter-btn-select-all" style="padding: 0; font-size: 0.7rem; color: var(--secondary);">すべて選択</button>
      <button class="btn-text" id="filter-btn-clear-all" style="padding: 0; font-size: 0.7rem; color: var(--danger);">すべてクリア</button>
    </div>
    <div class="filter-list" id="filter-list-items"></div>
    <div class="filter-actions">
      <button class="btn-secondary" id="filter-btn-clear" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">フィルタ解除</button>
      <button class="btn-primary" id="filter-btn-apply" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">適用</button>
    </div>
  `;

  container.appendChild(dropdown);

  const searchInput = dropdown.querySelector('.filter-search-input');
  const itemsContainer = dropdown.querySelector('#filter-list-items');
  const selectAllBtn = dropdown.querySelector('#filter-btn-select-all');
  const clearAllBtn = dropdown.querySelector('#filter-btn-clear-all');
  const clearBtn = dropdown.querySelector('#filter-btn-clear');
  const applyBtn = dropdown.querySelector('#filter-btn-apply');

  const col = state.agColumns.find(c => c.id === colId);
  const colorSection = createColorFilterSection(col, (targetVal) => {
    currentSelection = [targetVal];
    if (applyBtn) applyBtn.click();
  });

  if (colorSection && searchInput) {
    dropdown.insertBefore(colorSection, searchInput);
  }

  function renderList(filterQuery = '') {
    itemsContainer.innerHTML = '';
    const filteredVals = uniqueValues.filter(val => 
      val.toLowerCase().includes(filterQuery.toLowerCase())
    );

    if (filteredVals.length === 0) {
      itemsContainer.innerHTML = '<div style="color: var(--text-muted); font-size: 0.75rem; text-align: center; padding: 0.5rem;">候補なし</div>';
      return;
    }

    filteredVals.forEach(val => {
      const itemLabel = document.createElement('label');
      itemLabel.className = 'filter-list-item';
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = val;
      checkbox.checked = currentSelection.includes(val);

      checkbox.addEventListener('change', (e) => {
        if (e.target.checked) {
          if (!currentSelection.includes(val)) currentSelection.push(val);
        } else {
          currentSelection = currentSelection.filter(v => v !== val);
        }
      });

      itemLabel.appendChild(checkbox);
      itemLabel.appendChild(document.createTextNode(val || '(空白)'));
      itemsContainer.appendChild(itemLabel);
    });
  }

  renderList();

  searchInput.addEventListener('input', (e) => {
    renderList(searchInput.value.trim());
  });

  selectAllBtn.addEventListener('click', () => {
    currentSelection = [...uniqueValues];
    renderList(searchInput.value.trim());
  });

  clearAllBtn.addEventListener('click', () => {
    currentSelection = [];
    renderList(searchInput.value.trim());
  });

  clearBtn.addEventListener('click', () => {
    delete state.agFilters[colId];
    closeAllFilterMenus();
    renderAgencyInfo();
  });

  applyBtn.addEventListener('click', () => {
    if (currentSelection.length === uniqueValues.length) {
      delete state.agFilters[colId];
    } else {
      state.agFilters[colId] = currentSelection;
    }
    closeAllFilterMenus();
    renderAgencyInfo();
  });

  const onScrollAction = (e) => {
    if (!dropdown.contains(e.target)) {
      closeAllFilterMenus();
      window.removeEventListener('scroll', onScrollAction, true);
    }
  };
  window.addEventListener('scroll', onScrollAction, true);
}

// カラム幅のドラッグリサイズ設定（代理店）
function initAgColumnResize(th, colId) {
  const resizer = th.querySelector('.column-resizer');
  if (!resizer) return;

  resizer.addEventListener('mousedown', (e) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.pageX;
    const startWidth = th.offsetWidth;
    resizer.classList.add('resizing');

    const onMouseMove = (moveEvent) => {
      const dx = moveEvent.pageX - startX;
      const newWidth = Math.max(60, startWidth + dx);
      const cells = document.querySelectorAll(`#agency-info-screen [data-col-id="${colId}"]`);
      cells.forEach(cell => {
        cell.style.width = `${newWidth}px`;
        cell.style.maxWidth = `${newWidth}px`;
        cell.style.minWidth = `${newWidth}px`;
      });
    };

    const onMouseUp = () => {
      resizer.classList.remove('resizing');
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      const finalWidth = Math.max(60, th.offsetWidth);
      state.agColumnWidths[colId] = finalWidth;
      setSettingItem(STORAGE_KEYS.AG_COLUMN_WIDTHS, JSON.stringify(state.agColumnWidths));
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
}

// ウィンドウ枠の固定制御
function setupJoFrameFixControls(columns) {
  const btn = document.getElementById('jo-frame-fix-btn');
  const dropdown = document.getElementById('jo-frame-fix-dropdown');
  const colSelect = document.getElementById('jo-fix-col-select');
  const rowSelect = document.getElementById('jo-fix-row-select');

  if (btn && dropdown && colSelect && rowSelect) {
    if (btn.dataset.listenerAttached) return;
    btn.dataset.listenerAttached = 'true';

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = dropdown.style.display === 'none' || !dropdown.style.display;
      
      const colDropdown = document.getElementById('jo-column-selector-dropdown');
      if (colDropdown) colDropdown.style.display = 'none';

      dropdown.style.display = isHidden ? 'block' : 'none';
      
      if (isHidden) {
        colSelect.innerHTML = '<option value="none">固定しない</option>';
        let activeColIndex = 0;
        columns.forEach(col => {
          if (state.joVisibleColumns.includes(col.id)) {
            const letter = getColumnLetter(activeColIndex);
            const option = document.createElement('option');
            option.value = col.id;
            option.textContent = `${letter}列 (${col.label}) まで固定`;
            option.selected = state.joFixedCol === col.id;
            colSelect.appendChild(option);
            activeColIndex++;
          }
        });
        rowSelect.value = state.joFixedRow;
      }
    });

    document.addEventListener('mousedown', (e) => {
      if (!dropdown.contains(e.target) && !btn.contains(e.target)) {
        dropdown.style.display = 'none';
      }
    }, true);

    colSelect.addEventListener('change', (e) => {
      state.joFixedCol = e.target.value;
      setSettingItem(STORAGE_KEYS.JO_FIXED_COL, state.joFixedCol);
      renderJoInfo();
    });

    rowSelect.addEventListener('change', (e) => {
      state.joFixedRow = e.target.value;
      setSettingItem(STORAGE_KEYS.JO_FIXED_ROW, state.joFixedRow);
      renderJoInfo();
    });
  }
}

// JO情報の表示項目カスタマイズのチェックボックスを生成
function renderJoColumnSelector() {
  setupJoColumnSelectorToggle();

  const container = document.getElementById('jo-column-selector');
  if (!container) return;
  container.innerHTML = '';

  const columns = state.joColumns;

  setupJoFrameFixControls(columns);

  columns.forEach(col => {
    // 必須項目（運営状況、顧客番号、法人名、代表者名）はカスタマイズの項目からなくす
    if (col.required) return;

    const label = document.createElement('label');
    label.style.display = 'inline-flex';
    label.style.alignItems = 'center';
    label.style.gap = '0.4rem';
    label.style.cursor = 'pointer';
    label.style.color = 'var(--text-primary)';
    label.style.userSelect = 'none';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = col.id;
    checkbox.checked = state.joVisibleColumns.includes(col.id);

    checkbox.addEventListener('change', (e) => {
      if (e.target.checked) {
        if (!state.joVisibleColumns.includes(col.id)) {
          state.joVisibleColumns.push(col.id);
        }
      } else {
        state.joVisibleColumns = state.joVisibleColumns.filter(id => id !== col.id);
      }
      setSettingItem(STORAGE_KEYS.JO_VISIBLE_COLUMNS, JSON.stringify(state.joVisibleColumns));
      renderJoInfo();
    });

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(col.label));
    container.appendChild(label);
  });
}

// JO情報のフィルタメニューを開く
function openJoFilterMenu(colId, colLabel, anchorElement, allContracts) {
  const container = document.getElementById('jo-filter-dropdown-container');
  if (!container) return;

  const isAlreadyOpen = container.dataset.activeColId === `jo_${colId}`;
  closeAllFilterMenus();
  if (isAlreadyOpen) return;

  container.dataset.activeColId = `jo_${colId}`;

  const backdrop = document.createElement('div');
  backdrop.className = 'filter-menu-backdrop';
  backdrop.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 999; background: transparent; cursor: default;';
  
  const handleBackdropClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeAllFilterMenus();
  };
  
  backdrop.addEventListener('mousedown', handleBackdropClick, true);
  backdrop.addEventListener('pointerdown', handleBackdropClick, true);
  backdrop.addEventListener('touchstart', handleBackdropClick, true);
  document.body.appendChild(backdrop);

  const rect = anchorElement.getBoundingClientRect();
  const dropdown = document.createElement('div');
  dropdown.className = 'filter-dropdown';
  dropdown.style.top = `${rect.bottom + window.scrollY + 5}px`;
  
  const menuWidth = 240;
  let leftPos = rect.left + window.scrollX;
  if (leftPos + menuWidth > window.innerWidth) {
    leftPos = window.innerWidth - menuWidth - 20;
  }
  dropdown.style.left = `${leftPos}px`;

  const uniqueValues = Array.from(new Set(allContracts.map(c => String(c[colId] || ''))));
  let currentSelection = state.joFilters[colId] ? [...state.joFilters[colId]] : [...uniqueValues];

  dropdown.innerHTML = `
    <div style="font-weight: 600; margin-bottom: 0.25rem; color: var(--text-primary);">${colLabel} でフィルタ</div>
    <input type="text" class="filter-search-input" placeholder="テキストで検索..." />
    <div style="display: flex; gap: 0.5rem; margin: 0.25rem 0;">
      <button class="btn-text" id="filter-btn-select-all" style="padding: 0; font-size: 0.7rem; color: var(--secondary);">すべて選択</button>
      <button class="btn-text" id="filter-btn-clear-all" style="padding: 0; font-size: 0.7rem; color: var(--danger);">すべてクリア</button>
    </div>
    <div class="filter-list" id="filter-list-items"></div>
    <div class="filter-actions">
      <button class="btn-secondary" id="filter-btn-clear" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">フィルタ解除</button>
      <button class="btn-primary" id="filter-btn-apply" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">適用</button>
    </div>
  `;

  container.appendChild(dropdown);

  const searchInput = dropdown.querySelector('.filter-search-input');
  const itemsContainer = dropdown.querySelector('#filter-list-items');
  const selectAllBtn = dropdown.querySelector('#filter-btn-select-all');
  const clearAllBtn = dropdown.querySelector('#filter-btn-clear-all');
  const clearBtn = dropdown.querySelector('#filter-btn-clear');
  const applyBtn = dropdown.querySelector('#filter-btn-apply');

  const col = state.joColumns.find(c => c.id === colId);
  const colorSection = createColorFilterSection(col, (targetVal) => {
    currentSelection = [targetVal];
    if (applyBtn) applyBtn.click();
  });

  if (colorSection && searchInput) {
    dropdown.insertBefore(colorSection, searchInput);
  }

  function renderList(filterQuery = '') {
    itemsContainer.innerHTML = '';
    const filteredVals = uniqueValues.filter(val => 
      val.toLowerCase().includes(filterQuery.toLowerCase())
    );

    if (filteredVals.length === 0) {
      itemsContainer.innerHTML = '<div style="color: var(--text-muted); font-size: 0.75rem; text-align: center; padding: 0.5rem;">候補なし</div>';
      return;
    }

    filteredVals.forEach(val => {
      const itemLabel = document.createElement('label');
      itemLabel.className = 'filter-list-item';
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = val;
      checkbox.checked = currentSelection.includes(val);

      checkbox.addEventListener('change', (e) => {
        if (e.target.checked) {
          if (!currentSelection.includes(val)) currentSelection.push(val);
        } else {
          currentSelection = currentSelection.filter(v => v !== val);
        }
      });

      itemLabel.appendChild(checkbox);
      itemLabel.appendChild(document.createTextNode(val || '(空白)'));
      itemsContainer.appendChild(itemLabel);
    });
  }

  renderList();

  searchInput.addEventListener('input', (e) => {
    renderList(e.target.value.trim());
  });

  selectAllBtn.addEventListener('click', () => {
    currentSelection = [...uniqueValues];
    renderList(searchInput.value.trim());
  });

  clearAllBtn.addEventListener('click', () => {
    currentSelection = [];
    renderList(searchInput.value.trim());
  });

  clearBtn.addEventListener('click', () => {
    delete state.joFilters[colId];
    closeAllFilterMenus();
    renderJoInfo();
  });

  applyBtn.addEventListener('click', () => {
    if (currentSelection.length === uniqueValues.length) {
      delete state.joFilters[colId];
    } else {
      state.joFilters[colId] = currentSelection;
    }
    closeAllFilterMenus();
    renderJoInfo();
  });

  const onScrollAction = (e) => {
    if (!dropdown.contains(e.target)) {
      closeAllFilterMenus();
      window.removeEventListener('scroll', onScrollAction, true);
    }
  };
  window.addEventListener('scroll', onScrollAction, true);
}

// 列番号のアルファベット生成ヘルパー
function getColumnLetter(index) {
  let letter = '';
  while (index >= 0) {
    letter = String.fromCharCode((index % 26) + 65) + letter;
    index = Math.floor(index / 26) - 1;
  }
  return letter;
}

// カラム幅のドラッグリサイズ設定
function initJoColumnResize(th, colId) {
  const resizer = th.querySelector('.column-resizer');
  if (!resizer) return;

  resizer.addEventListener('mousedown', (e) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.pageX;
    const startWidth = th.offsetWidth;
    
    resizer.classList.add('resizing');

    const onMouseMove = (moveEvent) => {
      const dx = moveEvent.pageX - startX;
      const newWidth = Math.max(60, startWidth + dx); // 最小幅60px

      // 同一 colId の全 th, td の幅をリアルタイムで変更
      const cells = document.querySelectorAll(`[data-col-id="${colId}"]`);
      cells.forEach(cell => {
        cell.style.width = `${newWidth}px`;
        cell.style.maxWidth = `${newWidth}px`;
        cell.style.minWidth = `${newWidth}px`;
      });
    };

    const onMouseUp = () => {
      resizer.classList.remove('resizing');
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      const finalWidth = Math.max(60, th.offsetWidth); // 最小幅60px
      state.joColumnWidths[colId] = finalWidth;
      setSettingItem(STORAGE_KEYS.JO_COLUMN_WIDTHS, JSON.stringify(state.joColumnWidths));
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
}

// JO情報の描画
function renderJoInfo() {
  const listSection = document.querySelector('#jo-info-screen .list-section');
  if (listSection) {
    renderTableControlBar('jo', listSection);
  }

  const tbody = document.getElementById('jo-table-body');
  if (!tbody) return;
  tbody.innerHTML = '';

  const columns = state.joColumns;
  const contracts = state.joContracts;
  
  let filteredContracts = contracts;
  Object.keys(state.joFilters).forEach(colId => {
    const selectedValues = state.joFilters[colId];
    if (selectedValues) {
      filteredContracts = filteredContracts.filter(contract => 
        selectedValues.includes(String(contract[colId] || ''))
      );
    }
  });
  filteredContracts = filteredContracts.filter(contract => {
    const rowAccess = checkRowAccess('jo-info-screen', contract);
    return rowAccess.visible;
  });
  
  const isAdmin = state.currentUser && state.currentUser.id === 'admin';
  const baseVisibleColumnIds = isAdmin ? columns.map(c => c.id) : state.joVisibleColumns;
  const visibleColumnIds = [];
  columns.forEach(col => {
    const access = checkColumnAccess('jo-info-screen', col.id);
    if (access.visible) {
      if (baseVisibleColumnIds.includes(col.id) || access.grayout) {
        visibleColumnIds.push(col.id);
      }
    }
  });
  
  const selectorBtn = document.getElementById('jo-column-selector-btn');
  if (selectorBtn) {
    selectorBtn.style.display = isAdmin ? 'none' : 'block';
  }

  // --- 固定ウィンドウ枠の計算ロジック ---
  const fixedColIds = [];
  if (state.joFixedCol !== 'none') {
    for (let i = 0; i < columns.length; i++) {
      const col = columns[i];
      if (visibleColumnIds.includes(col.id)) {
        fixedColIds.push(col.id);
        if (col.id === state.joFixedCol) {
          break;
        }
      }
    }
  }

  // 固定列の left 座標累積位置を計算
  const leftPosMap = {};
  let currentLeft = 50; // 行番号列の幅 (50px)
  if (fixedColIds.length > 0) {
    fixedColIds.forEach(colId => {
      leftPosMap[colId] = currentLeft;
      const w = state.joColumnWidths[colId] || 100;
      currentLeft += w;
    });
  }

  // 固定される行数を取得
  const fixedRowLimit = state.joFixedRow !== 'none' ? parseInt(state.joFixedRow, 10) : 0;
  const topPosMap = {};
  let currentTop = 54; // 列記号行 24px + カラム名行 30px = 合計 54px
  if (fixedRowLimit > 0) {
    for (let i = 0; i < fixedRowLimit; i++) {
      topPosMap[i] = currentTop;
      const rHeight = state.joRowHeights[i] || 30;
      currentTop += rHeight;
    }
  }

  // テーブルヘッダーの動的生成（A, B, C...の列番号行と、通常のカラム名行の2段編成）
  const thead = document.getElementById('jo-table-thead');
  if (thead) {
    thead.innerHTML = '';

    // 行1: アルファベット列記号行 (lettersRow)
    const lettersRow = document.createElement('tr');
    lettersRow.className = 'col-letters-row';
    lettersRow.style.height = '24px';

    // 左上の角セル（行番号ヘッダー用の th）
    const isAllSelected = state.joSelectedRows.size > 0 && state.joSelectedRows.size === filteredContracts.length;
    const cornerTh1 = document.createElement('th');
    cornerTh1.className = 'row-number-col' + (isAllSelected ? ' active-row-header' : '');
    cornerTh1.style.position = 'sticky';
    cornerTh1.style.top = '0px';
    cornerTh1.style.left = '0px';
    cornerTh1.style.zIndex = '30';
    cornerTh1.style.height = '24px';
    cornerTh1.style.lineHeight = '24px';
    cornerTh1.style.padding = '0';
    
    // 角セルをクリックしたら選択状態を全クリア
    cornerTh1.style.cursor = 'pointer';
    cornerTh1.addEventListener('click', (e) => {
      e.stopPropagation();
      state.joSelectedCell = null;
      state.joSelectedRow = null;
      state.joSelectedCol = null;
      state.joSelectedRows.clear();
      state.joSelectedCols.clear();
      state.joSelectedCells.clear();
      
      const tbody = document.getElementById('jo-table-body');
      if (tbody) {
        const rows = tbody.querySelectorAll('tr');
        rows.forEach((_, idx) => {
          state.joSelectedRows.add(idx);
        });
      }
      
      renderJoInfo();
      syncJoFormatToolbar();
    });
    lettersRow.appendChild(cornerTh1);

    // 表示カラム数に応じた列アルファベット記号をレンダリング
    let colIndex = 0;
    columns.forEach(col => {
      if (visibleColumnIds.includes(col.id)) {
        const th = document.createElement('th');
        th.setAttribute('data-col-id', col.id);
        
        // 個別幅の適用
        const w = state.joColumnWidths[col.id] || 100;
        th.style.width = `${w}px`;
        th.style.maxWidth = `${w}px`;
        th.style.minWidth = `${w}px`;
        th.style.position = 'sticky';
        th.style.top = '0px';
        th.style.zIndex = '10';
        th.style.height = '24px';
        th.style.lineHeight = '24px';
        th.style.padding = '0';
        th.style.fontSize = '0.75rem';
        
        th.textContent = getColumnLetter(colIndex);
        
        // 列選択イベント
        th.style.cursor = 'pointer';
        const currentColId = col.id;
        th.addEventListener('mousedown', (e) => {
          if (e.button !== 0) return; // 左クリックのみ
          e.stopPropagation();
          state.isSelectingCols = true;
          if (!e.ctrlKey && !e.metaKey) {
            state.joSelectedCell = null;
            state.joSelectedRange = null;
            state.joSelectedRows.clear();
            state.joSelectedCells.clear();
          }

          if (e.ctrlKey || e.metaKey) {
            // 非連続
            if (state.joSelectedCols.has(currentColId)) {
              state.joSelectedCols.delete(currentColId);
            } else {
              state.joSelectedCols.add(currentColId);
            }
          } else if (e.shiftKey && state.joLastSelectedCol) {
            // 連続
            const visibleCols = columns.filter(c => visibleColumnIds.includes(c.id));
            const startIdx = visibleCols.findIndex(c => c.id === state.joLastSelectedCol);
            const endIdx = visibleCols.findIndex(c => c.id === currentColId);
            if (startIdx !== -1 && endIdx !== -1) {
              state.joSelectedCols.clear();
              const minIdx = Math.min(startIdx, endIdx);
              const maxIdx = Math.max(startIdx, endIdx);
              for (let i = minIdx; i <= maxIdx; i++) {
                state.joSelectedCols.add(visibleCols[i].id);
              }
            }
          } else {
            // 単一選択
            state.joSelectedCols.clear();
            state.joSelectedCols.add(currentColId);
          }
          state.joLastSelectedCol = currentColId;
          if (!e.shiftKey) {
            state.joColumnSelectAnchor = currentColId;
          }
          renderJoInfo();
          syncJoFormatToolbar();
        });

        th.addEventListener('mouseenter', () => {
          if (state.isSelectingCols && state.joLastSelectedCol) {
            const visibleCols = columns.filter(c => visibleColumnIds.includes(c.id));
            const startIdx = visibleCols.findIndex(c => c.id === state.joLastSelectedCol);
            const endIdx = visibleCols.findIndex(c => c.id === currentColId);
            if (startIdx !== -1 && endIdx !== -1) {
              state.joSelectedCols.clear();
              const minIdx = Math.min(startIdx, endIdx);
              const maxIdx = Math.max(startIdx, endIdx);
              for (let i = minIdx; i <= maxIdx; i++) {
                state.joSelectedCols.add(visibleCols[i].id);
              }
              renderJoInfo();
            }
          }
        });

        if (state.joSelectedCols.has(col.id) || isAllSelected) {
          th.classList.add('active-col-header');
        }

        th.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (window.logToDebugPanel) {
            window.logToDebugPanel(`contextmenu (jo lettersRow th): col.id=${col.id}`, '#ffd700');
          }
          showCtContextMenu(e.clientX, e.clientY, { id: 'jo-info-screen', name: '案件マスタ', columns: state.joColumns }, 'col', col.id);
        });

        lettersRow.appendChild(th);
        colIndex++;
      }
    });
    thead.appendChild(lettersRow);

    // 行2: カラム名行
    const namesRow = document.createElement('tr');
    namesRow.className = 'col-names-row';
    namesRow.style.borderBottom = '1px solid var(--border-color)';
    namesRow.style.height = '30px';

    // 行番号ヘッダーセル
    const cornerTh2 = document.createElement('th');
    cornerTh2.className = 'row-number-col' + (isAllSelected ? ' active-row-header' : '');
    cornerTh2.style.position = 'sticky';
    cornerTh2.style.top = '24px';
    cornerTh2.style.zIndex = '25';
    cornerTh2.style.height = '30px';
    cornerTh2.style.lineHeight = '30px';
    cornerTh2.style.padding = '0';
    cornerTh2.style.cursor = 'pointer';
    if (fixedColIds.length > 0) {
      cornerTh2.style.left = '0px';
    }
    cornerTh2.addEventListener('click', (e) => {
      e.stopPropagation();
      state.joSelectedCell = null;
      state.joSelectedRow = null;
      state.joSelectedCol = null;
      state.joSelectedRows.clear();
      state.joSelectedCols.clear();
      state.joSelectedCells.clear();
      
      const tbody = document.getElementById('jo-table-body');
      if (tbody) {
        const rows = tbody.querySelectorAll('tr');
        rows.forEach((_, idx) => {
          state.joSelectedRows.add(idx);
        });
      }
      
      renderJoInfo();
      syncJoFormatToolbar();
    });
    namesRow.appendChild(cornerTh2);

    columns.forEach(col => {
      if (visibleColumnIds.includes(col.id)) {
        const th = document.createElement('th');
        th.style.padding = '0.35rem 0.5rem';
        th.title = col.label; // ツールチップ
        th.setAttribute('data-col-id', col.id);

        // 個別幅の適用
        const w = state.joColumnWidths[col.id] || 100;
        th.style.width = `${w}px`;
        th.style.maxWidth = `${w}px`;
        th.style.minWidth = `${w}px`;
        th.style.position = 'sticky';
        th.style.top = '24px';
        th.style.zIndex = '10';
        th.style.height = '30px';
        th.style.boxSizing = 'border-box';
        
        if (fixedColIds.includes(col.id)) {
          th.style.left = `${leftPosMap[col.id]}px`;
          th.style.zIndex = '15';
        }
        
        const isFiltered = state.joFilters[col.id] && state.joFilters[col.id].length > 0;
        const activeClass = isFiltered ? ' filter-btn-active' : '';

        th.innerHTML = `
          <div class="th-filter-container" style="height: 100%; display: flex; align-items: center; justify-content: space-between;">
            <span style="font-size: 0.75rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1;">${col.label}</span>
            <button class="btn-filter-toggle${activeClass}" data-col-id="${col.id}" style="background: transparent; border: none; padding: 0.1rem 0.2rem; color: var(--text-muted); cursor: pointer; font-size: 0.65rem; transition: color 0.2s; margin-left: 2px;">
              ▼
            </button>
          </div>
          <div class="column-resizer"></div>
        `;

        const colAccess = checkColumnAccess('jo-info-screen', col.id);
        if (colAccess.grayout) {
          th.classList.add('grayed-out-access');
          const filterContainer = th.querySelector('.th-filter-container');
          appendInlineGrantBtn(filterContainer, () => {
            grantColumnPermissionDirect('jo-info-screen', col.id);
          });
        }

        const btn = th.querySelector('.btn-filter-toggle');
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          openJoFilterMenu(col.id, col.label, btn, contracts);
        });

        th.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (window.logToDebugPanel) {
            window.logToDebugPanel(`contextmenu (jo namesRow th): col.id=${col.id}`, '#ffd700');
          }
          showCtContextMenu(e.clientX, e.clientY, { id: 'jo-info-screen', name: '案件マスタ', columns: state.joColumns }, 'col', col.id);
        });

        // ドラッグリサイズ開始設定
        initJoColumnResize(th, col.id);

        namesRow.appendChild(th);
      }
    });
    thead.appendChild(namesRow);
  }

  filteredContracts.forEach((contract, index) => {
    const rowAccess = checkRowAccess('jo-info-screen', contract);

    const rowHeight = state.joRowHeights[index] || 30;

    const tr = document.createElement('tr');
    tr.setAttribute('data-row-id', contract.customerId);
    tr.style.borderBottom = '1px solid var(--border-color)';
    tr.style.height = `${rowHeight}px`;
    tr.style.maxHeight = `${rowHeight}px`;
    tr.style.minHeight = `${rowHeight}px`;
    
    // 行番号セルの追加
    const rowNumTd = document.createElement('td');
    rowNumTd.className = 'row-number-col';
    rowNumTd.style.height = `${rowHeight}px`;
    rowNumTd.style.lineHeight = `${rowHeight}px`;
    rowNumTd.style.padding = '0';
    rowNumTd.style.fontSize = '0.75rem';
    rowNumTd.style.position = 'relative';

    if (rowAccess.grayout) {
      tr.classList.add('grayed-out-access');
      rowNumTd.innerHTML = `${index + 1} <span class="grant-row-btn" style="cursor: pointer; color: var(--primary); font-size: 0.75rem; margin-left: 2px;" title="この行の表示条件を解除（全行表示に更新）">🔓</span>`;
      rowNumTd.querySelector('.grant-row-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        grantRowPermission('jo-info-screen');
      });
    } else {
      rowNumTd.textContent = index + 1;
    }

    const rowResizer = document.createElement('div');
    rowResizer.className = 'row-resizer';
    rowResizer.style.zIndex = '50';
    rowNumTd.appendChild(rowResizer);
    setupMasterRowResize('jo', index, rowResizer);
    setupMasterRowContextMenu('jo', index, rowNumTd);
    
    if (fixedColIds.length > 0) {
      rowNumTd.style.position = 'sticky';
      rowNumTd.style.left = '0px';
      rowNumTd.style.zIndex = '12';
    }
    if (index < fixedRowLimit) {
      rowNumTd.style.position = 'sticky';
      rowNumTd.style.top = `${topPosMap[index]}px`;
      rowNumTd.style.zIndex = fixedColIds.length > 0 ? '14' : '13';
    }

    if (state.joSelectedRows.has(index)) {
      rowNumTd.classList.add('active-row-header');
    }

    rowNumTd.style.cursor = 'pointer';
    rowNumTd.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return; // 左クリックのみ
      e.stopPropagation();
      state.isSelectingRows = true;

      const currentRowIdx = index;
      if (e.ctrlKey || e.metaKey) {
        // Ctrl: 他の選択を維持してトグル
        if (state.joSelectedRows.has(currentRowIdx)) {
          state.joSelectedRows.delete(currentRowIdx);
        } else {
          state.joSelectedRows.add(currentRowIdx);
        }
      } else if (e.shiftKey && state.joLastSelectedRow !== null) {
        // Shift: 連続選択
        state.joSelectedRows.clear();
        state.joSelectedCols.clear();
        state.joSelectedCells.clear();
        state.joSelectedCell = null;
        state.joSelectedRange = null;

        const minR = Math.min(state.joLastSelectedRow, currentRowIdx);
        const maxR = Math.max(state.joLastSelectedRow, currentRowIdx);
        for (let r = minR; r <= maxR; r++) {
          state.joSelectedRows.add(r);
        }
      } else {
        // 通常クリック
        state.joSelectedCell = null;
        state.joSelectedRange = null;
        state.joSelectedCols.clear();
        state.joSelectedCells.clear();
        state.joSelectedRows.clear();
        state.joSelectedRows.add(currentRowIdx);
      }
      state.joLastSelectedRow = currentRowIdx;
      renderJoInfo();
      syncJoFormatToolbar();
    });

    rowNumTd.addEventListener('mouseenter', () => {
      if (state.isSelectingRows && state.joLastSelectedRow !== null) {
        state.joSelectedRows.clear();
        const minR = Math.min(state.joLastSelectedRow, index);
        const maxR = Math.max(state.joLastSelectedRow, index);
        for (let r = minR; r <= maxR; r++) {
          state.joSelectedRows.add(r);
        }
        renderJoInfo();
      }
    });

    tr.appendChild(rowNumTd);

    let vColIdx = 0;
    columns.forEach(col => {
      if (visibleColumnIds.includes(col.id)) {
        const val = contract[col.id] || '';
        const td = document.createElement('td');
        td.style.padding = '0.3rem 0.6rem';
        td.style.height = `${rowHeight}px`;
        td.style.maxHeight = `${rowHeight}px`;
        td.style.minHeight = `${rowHeight}px`;
        td.style.boxSizing = 'border-box';
        td.style.fontSize = '0.8rem';
        td.setAttribute('data-col-id', col.id);
        td.setAttribute('data-customer-id', contract.customerId);

        const w = state.joColumnWidths[col.id] || 100;
        td.style.width = `${w}px`;
        td.style.maxWidth = `${w}px`;
        td.style.minWidth = `${w}px`;
        
        let isSticky = false;
        if (fixedColIds.includes(col.id)) {
          td.style.position = 'sticky';
          td.style.left = `${leftPosMap[col.id]}px`;
          td.style.zIndex = '10';
          isSticky = true;
        }
        if (index < fixedRowLimit) {
          td.style.position = 'sticky';
          td.style.top = `${topPosMap[index]}px`;
          td.style.zIndex = isSticky ? '14' : '9';
          isSticky = true;
        }
        if (isSticky) {
          td.style.backgroundColor = 'var(--bg-surface)';
        }
        
        // --- カスタム書式の適用 ---
        const cellKey = `${contract.customerId}_${col.id}`;
        const styleObj = getCellFormatStyles('jo', contract.customerId, col.id, contract, val);
        
        applyInlineStylesToCell(td, styleObj);
        
        if (styleObj['background-color']) {
          td.style.backgroundColor = styleObj['background-color'];
        } else if (isSticky) {
          td.style.backgroundColor = 'var(--bg-surface)';
        }

        // ツールチップ
        if (col.id !== 'shopUrl') {
          td.title = String(val);
        }

        // デフォルト表示スタイル
        let isDropdownRendered = renderMasterDropdownCellMarkup(td, val, col, styleObj);
        if (!isDropdownRendered) {
          if (col.id === 'status') {
            td.innerHTML = `<span class="badge ${val === '運営中' ? 'badge-official' : (val === '申請中' ? 'badge-new' : 'badge-draft')}">${val}</span>`;
            if (styleObj['background-color']) {
              const badgeSpan = td.querySelector('.badge');
              if (badgeSpan) badgeSpan.style.backgroundColor = styleObj['background-color'];
            }
          } else if (col.id === 'customerId') {
            td.style.fontFamily = 'monospace';
            td.style.fontWeight = styleObj['font-weight'] || 'bold';
            td.style.color = styleObj['color'] || 'var(--secondary)';
            td.textContent = val;
          } else if (col.id === 'corpName' || col.id === 'shopName') {
            td.style.fontWeight = styleObj['font-weight'] || '600';
            td.style.color = styleObj['color'] || 'var(--text-primary)';
            td.textContent = val;
          } else if (col.id === 'furigana' || col.id === 'repFurigana') {
            td.style.color = styleObj['color'] || 'var(--text-secondary)';
            td.style.fontSize = styleObj['font-size'] || '0.75rem';
            td.textContent = val;
          } else if (col.id === 'shopUrl') {
            td.style.color = styleObj['color'] || 'var(--primary)';
            td.style.fontSize = styleObj['font-size'] || '0.75rem';
            if (val) {
              td.innerHTML = `<a href="${val}" target="_blank" style="color: inherit; text-decoration: underline;">URL</a>`;
            } else {
              td.textContent = '';
            }
          } else {
            td.style.color = styleObj['color'] || 'var(--text-secondary)';
            td.textContent = val;
          }
        }

        let inRange = false;
        if (state.joSelectedRange) {
          const minR = Math.min(state.joSelectedRange.startRow, state.joSelectedRange.endRow);
          const maxR = Math.max(state.joSelectedRange.startRow, state.joSelectedRange.endRow);
          const minC = Math.min(state.joSelectedRange.startCol, state.joSelectedRange.endCol);
          const maxC = Math.max(state.joSelectedRange.startCol, state.joSelectedRange.endCol);
          if (index >= minR && index <= maxR && vColIdx >= minC && vColIdx <= maxC) {
            inRange = true;
          }
        }

        // 選択状態の枠線付与
        const currentCellKey = `${contract.customerId}_${col.id}`;
        const isSelected = (state.joSelectedCell && 
                            state.joSelectedCell.customerId === contract.customerId && 
                            state.joSelectedCell.colId === col.id) ||
                           state.joSelectedCells.has(currentCellKey);
        if (isSelected) {
          td.classList.add('selected-cell');
        }
        if (state.joSelectedRow === index || state.joSelectedRows.has(index)) {
          td.classList.add('selected-row-cell');
        }
        if (state.joSelectedCol === col.id || state.joSelectedCols.has(col.id)) {
          td.classList.add('selected-col-cell');
        }
        if (inRange) {
          td.classList.add('in-range-cell');
        }

        td.style.cursor = 'pointer';

        // 範囲選択用の一時変数保持用のスコープ値
        const currentRow = index;
        const currentColIdx = vColIdx;

        td.addEventListener('mousedown', (e) => {
          if (e.target.tagName === 'A') return;
          if (e.button !== 0) return; // 左クリックのみ
          e.stopPropagation();

          const isSelect = col.type === 'select' || (col.choices && col.choices.length > 0);
          if (isSelect) {
            startMasterDropdownEdit(td, val, col, contract, index, 'jo');
            return;
          }

          const cellKey = `${contract.customerId}_${col.id}`;

          if (e.ctrlKey || e.metaKey) {
            // Ctrl: 非連続
            if (state.joSelectedCells.has(cellKey)) {
              state.joSelectedCells.delete(cellKey);
            } else {
              state.joSelectedCells.add(cellKey);
            }
            state.joSelectedCell = { customerId: contract.customerId, colId: col.id };
            state.joSelectedRange = null;
          } else if (e.shiftKey && state.joSelectedCell) {
            const activeColId = state.joSelectedCell.colId;
            const visibleCols = columns.filter(c => visibleColumnIds.includes(c.id));
            const activeColIdx = visibleCols.findIndex(c => c.id === activeColId);
            const activeRowIdx = filteredContracts.findIndex(c => c.customerId === state.joSelectedCell.customerId);

            if (activeColIdx !== -1 && activeRowIdx !== -1) {
              state.joSelectedRange = {
                startRow: activeRowIdx,
                startCol: activeColIdx,
                endRow: currentRow,
                endCol: currentColIdx
              };
              state.joSelectedCells.clear();
            }
          } else {
            state.isSelecting = true;
            state.joSelectedRange = {
              startRow: currentRow,
              startCol: currentColIdx,
              endRow: currentRow,
              endCol: currentColIdx
            };
            state.joSelectedRow = null;
            state.joSelectedCol = null;
            state.joSelectedRows.clear();
            state.joSelectedCols.clear();
            state.joColumnSelectAnchor = null;
            state.joColumnSelectLast = null;
            state.joSelectedCell = { customerId: contract.customerId, colId: col.id };
            state.joSelectedCells.clear();
            state.joSelectedCells.add(cellKey);
          }
          renderJoInfo();
          syncJoFormatToolbar();
        });

        td.addEventListener('mouseenter', () => {
          if (state.isSelecting && state.joSelectedRange) {
            state.joSelectedRange.endRow = currentRow;
            state.joSelectedRange.endCol = currentColIdx;
            renderJoInfo();
            syncJoFormatToolbar();
          }
        });

        td.addEventListener('click', (e) => {
          e.stopPropagation();
          const isSelect = col.type === 'select' || (col.choices && col.choices.length > 0);
          if (isSelect) {
            if (isTableLocked('jo')) return;
            startMasterDropdownEdit(td, val, col, contract, index, 'jo');
          }
        });

        td.addEventListener('dblclick', (e) => {
          if (e.target.tagName === 'A') return;
          if (!isTableLocked('jo')) {
            startMasterCellEdit(td, val, col, contract, index, 'jo');
          } else {
            td.classList.toggle('cell-expanded');
          }
        });

        tr.appendChild(td);
        vColIdx++;
      }
    });
    tbody.appendChild(tr);
  });
  
  updateSelectionStatsWidget();
  adjustOverflowCells(document.querySelector('#jo-info-screen .spreadsheet-table'));
}

// 申込者情報の描画
function renderApplicantInfo() {
  const listSection = document.querySelector('#applicant-info-screen .list-section');
  if (listSection) {
    renderTableControlBar('ap', listSection);
  }

  const tbody = document.getElementById('applicant-table-body');
  if (!tbody) return;
  tbody.innerHTML = '';

  const columns = state.apColumns;
  const contracts = state.apContracts;
  
  let filteredContracts = contracts;
  Object.keys(state.apFilters).forEach(colId => {
    const selectedValues = state.apFilters[colId];
    if (selectedValues) {
      filteredContracts = filteredContracts.filter(contract => 
        selectedValues.includes(String(contract[colId] || ''))
      );
    }
  });
  filteredContracts = filteredContracts.filter(contract => {
    const rowAccess = checkRowAccess('applicant-info-screen', contract);
    return rowAccess.visible;
  });
  
  const isAdmin = state.currentUser && state.currentUser.id === 'admin';
  const baseVisibleColumnIds = isAdmin ? columns.map(c => c.id) : state.apVisibleColumns;
  const visibleColumnIds = [];
  columns.forEach(col => {
    const access = checkColumnAccess('applicant-info-screen', col.id);
    if (access.visible) {
      if (baseVisibleColumnIds.includes(col.id) || access.grayout) {
        visibleColumnIds.push(col.id);
      }
    }
  });
  
  const selectorBtn = document.getElementById('ap-column-selector-btn');
  if (selectorBtn) {
    selectorBtn.style.display = isAdmin ? 'none' : 'block';
  }

  // --- 固定ウィンドウ枠 of ap ---
  const fixedColIds = [];
  if (state.apFixedCol !== 'none') {
    for (let i = 0; i < columns.length; i++) {
      const col = columns[i];
      if (visibleColumnIds.includes(col.id)) {
        fixedColIds.push(col.id);
        if (col.id === state.apFixedCol) {
          break;
        }
      }
    }
  }

  const leftPosMap = {};
  let currentLeft = 50; // 行番号列
  if (fixedColIds.length > 0) {
    fixedColIds.forEach(colId => {
      leftPosMap[colId] = currentLeft;
      const w = state.apColumnWidths[colId] || 120;
      currentLeft += w;
    });
  }

  const fixedRowLimit = state.apFixedRow !== 'none' ? parseInt(state.apFixedRow, 10) : 0;
  const topPosMap = {};
  let currentTop = 54; // ヘッダーの高さ (列記号24px + カラム名30px)
  if (fixedRowLimit > 0) {
    for (let i = 0; i < fixedRowLimit; i++) {
      topPosMap[i] = currentTop;
      const rHeight = state.apRowHeights[i] || 30;
      currentTop += rHeight;
    }
  }

  // ヘッダーの動的生成
  const thead = document.getElementById('applicant-table-thead');
  if (thead) {
    thead.innerHTML = '';

    const lettersRow = document.createElement('tr');
    lettersRow.className = 'col-letters-row';
    lettersRow.style.height = '24px';

    const isAllSelected = state.apSelectedRows.size > 0 && state.apSelectedRows.size === filteredContracts.length;
    const cornerTh1 = document.createElement('th');
    cornerTh1.className = 'row-number-col' + (isAllSelected ? ' active-row-header' : '');
    cornerTh1.style.position = 'sticky';
    cornerTh1.style.top = '0px';
    cornerTh1.style.left = '0px';
    cornerTh1.style.zIndex = '30';
    cornerTh1.style.height = '24px';
    cornerTh1.style.lineHeight = '24px';
    cornerTh1.style.padding = '0';
    cornerTh1.style.cursor = 'pointer';
    cornerTh1.addEventListener('click', (e) => {
      e.stopPropagation();
      state.apSelectedCell = null;
      state.apSelectedRow = null;
      state.apSelectedCol = null;
      state.apSelectedRows.clear();
      state.apSelectedCols.clear();
      state.apSelectedCells.clear();
      
      const tbody = document.getElementById('applicant-table-body');
      if (tbody) {
        const rows = tbody.querySelectorAll('tr');
        rows.forEach((_, idx) => {
          state.apSelectedRows.add(idx);
        });
      }
      
      renderApplicantInfo();
      syncApFormatToolbar();
    });
    lettersRow.appendChild(cornerTh1);

    let colIndex = 0;
    columns.forEach(col => {
      if (visibleColumnIds.includes(col.id)) {
        const th = document.createElement('th');
        th.setAttribute('data-col-id', col.id);
        const w = state.apColumnWidths[col.id] || 120;
        th.style.width = `${w}px`;
        th.style.maxWidth = `${w}px`;
        th.style.minWidth = `${w}px`;
        th.style.position = 'sticky';
        th.style.top = '0px';
        th.style.zIndex = '10';
        th.style.height = '24px';
        th.style.lineHeight = '24px';
        th.style.padding = '0';
        th.style.fontSize = '0.75rem';
        th.style.cursor = 'pointer';

        if (fixedColIds.includes(col.id)) {
          th.style.left = `${leftPosMap[col.id]}px`;
          th.style.zIndex = '15';
        }
        if (state.apSelectedCol === col.id || state.apSelectedCols.has(col.id) || isAllSelected) {
          th.classList.add('active-col-header');
        }

        th.textContent = getColumnLetter(colIndex);
        
        // 列選択イベント
        const currentColId = col.id;
        th.addEventListener('mousedown', (e) => {
          if (e.button !== 0) return; // 左クリックのみ
          e.stopPropagation();
          state.isSelectingCols = true;
          if (!e.ctrlKey && !e.metaKey) {
            state.apSelectedCell = null;
            state.apSelectedRange = null;
            state.apSelectedRows.clear();
            state.apSelectedCells.clear();
          }

          if (e.ctrlKey || e.metaKey) {
            // 非連続
            if (state.apSelectedCols.has(currentColId)) {
              state.apSelectedCols.delete(currentColId);
            } else {
              state.apSelectedCols.add(currentColId);
            }
          } else if (e.shiftKey && state.apLastSelectedCol) {
            // 連続
            const visibleCols = columns.filter(c => visibleColumnIds.includes(c.id));
            const startIdx = visibleCols.findIndex(c => c.id === state.apLastSelectedCol);
            const endIdx = visibleCols.findIndex(c => c.id === currentColId);
            if (startIdx !== -1 && endIdx !== -1) {
              state.apSelectedCols.clear();
              const minIdx = Math.min(startIdx, endIdx);
              const maxIdx = Math.max(startIdx, endIdx);
              for (let i = minIdx; i <= maxIdx; i++) {
                state.apSelectedCols.add(visibleCols[i].id);
              }
            }
          } else {
            // 単一選択
            state.apSelectedCols.clear();
            state.apSelectedCols.add(currentColId);
          }
          state.apLastSelectedCol = currentColId;
          renderApplicantInfo();
          syncApFormatToolbar();
        });

        th.addEventListener('mouseenter', () => {
          if (state.isSelectingCols && state.apLastSelectedCol) {
            const visibleCols = columns.filter(c => visibleColumnIds.includes(c.id));
            const startIdx = visibleCols.findIndex(c => c.id === state.apLastSelectedCol);
            const endIdx = visibleCols.findIndex(c => c.id === currentColId);
            if (startIdx !== -1 && endIdx !== -1) {
              state.apSelectedCols.clear();
              const minIdx = Math.min(startIdx, endIdx);
              const maxIdx = Math.max(startIdx, endIdx);
              for (let i = minIdx; i <= maxIdx; i++) {
                state.apSelectedCols.add(visibleCols[i].id);
              }
              renderApplicantInfo();
            }
          }
        });
        th.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (window.logToDebugPanel) {
            window.logToDebugPanel(`contextmenu (ap lettersRow th): col.id=${col.id}`, '#ffd700');
          }
          showCtContextMenu(e.clientX, e.clientY, { id: 'applicant-info-screen', name: '申込者マスタ', columns: state.apColumns }, 'col', col.id);
        });

        lettersRow.appendChild(th);
        colIndex++;
      }
    });
    thead.appendChild(lettersRow);

    const namesRow = document.createElement('tr');
    namesRow.className = 'col-names-row';
    namesRow.style.borderBottom = '1px solid var(--border-color)';
    namesRow.style.height = '30px';

    const cornerTh2 = document.createElement('th');
    cornerTh2.className = 'row-number-col' + (isAllSelected ? ' active-row-header' : '');
    cornerTh2.style.position = 'sticky';
    cornerTh2.style.top = '24px';
    cornerTh2.style.zIndex = '25';
    cornerTh2.style.height = '30px';
    cornerTh2.style.lineHeight = '30px';
    cornerTh2.style.padding = '0';
    cornerTh2.style.cursor = 'pointer';
    if (fixedColIds.length > 0) {
      cornerTh2.style.left = '0px';
    }
    cornerTh2.addEventListener('click', (e) => {
      e.stopPropagation();
      state.apSelectedCell = null;
      state.apSelectedRow = null;
      state.apSelectedCol = null;
      state.apSelectedRows.clear();
      state.apSelectedCols.clear();
      state.apSelectedCells.clear();
      
      const tbody = document.getElementById('applicant-table-body');
      if (tbody) {
        const rows = tbody.querySelectorAll('tr');
        rows.forEach((_, idx) => {
          state.apSelectedRows.add(idx);
        });
      }
      
      renderApplicantInfo();
      syncApFormatToolbar();
    });
    namesRow.appendChild(cornerTh2);

    columns.forEach(col => {
      if (visibleColumnIds.includes(col.id)) {
        const th = document.createElement('th');
        th.style.padding = '0.35rem 0.5rem';
        th.title = col.label;
        th.setAttribute('data-col-id', col.id);
        const w = state.apColumnWidths[col.id] || 120;
        th.style.width = `${w}px`;
        th.style.maxWidth = `${w}px`;
        th.style.minWidth = `${w}px`;
        th.style.position = 'sticky';
        th.style.top = '24px';
        th.style.zIndex = '10';
        th.style.height = '30px';
        th.style.boxSizing = 'border-box';
        th.style.cursor = 'pointer';

        if (fixedColIds.includes(col.id)) {
          th.style.left = `${leftPosMap[col.id]}px`;
          th.style.zIndex = '15';
        }
        if (state.apSelectedCol === col.id || state.apSelectedCols.has(col.id)) {
          th.classList.add('active-col-header');
        }

        const isFiltered = state.apFilters[col.id] && state.apFilters[col.id].length > 0;
        const activeClass = isFiltered ? ' filter-btn-active' : '';

        th.innerHTML = `
          <div class="th-filter-container" style="height: 100%; display: flex; align-items: center; justify-content: space-between;">
            <span style="font-size: 0.75rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1;">${col.label}</span>
            <button class="btn-filter-toggle${activeClass}" data-col-id="${col.id}" style="background: transparent; border: none; padding: 0.1rem 0.2rem; color: var(--text-muted); cursor: pointer; font-size: 0.65rem; transition: color 0.2s; margin-left: 2px;">
              ▼
            </button>
          </div>
          <div class="column-resizer"></div>
        `;

        const colAccess = checkColumnAccess('applicant-info-screen', col.id);
        if (colAccess.grayout) {
          th.classList.add('grayed-out-access');
          const filterContainer = th.querySelector('.th-filter-container');
          appendInlineGrantBtn(filterContainer, () => {
            grantColumnPermissionDirect('applicant-info-screen', col.id);
          });
        }

        const btn = th.querySelector('.btn-filter-toggle');
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          openApFilterMenu(col.id, col.label, btn, contracts);
        });

        th.addEventListener('mousedown', (e) => {
          if (e.target.classList.contains('btn-filter-toggle') || e.target.closest('.btn-filter-toggle')) return;
          if (e.button !== 0) return; // 左クリックのみ
          e.stopPropagation();
          state.isSelectingCols = true;
          state.apSelectedCell = null;
          state.apSelectedRange = null;
          state.apSelectedRows.clear();

          const currentColId = col.id;
          if (e.ctrlKey || e.metaKey) {
            if (state.apSelectedCols.has(currentColId)) {
              state.apSelectedCols.delete(currentColId);
            } else {
              state.apSelectedCols.add(currentColId);
            }
          } else if (e.shiftKey && state.apLastSelectedCol) {
            const visibleCols = columns.filter(c => visibleColumnIds.includes(c.id));
            const startIdx = visibleCols.findIndex(c => c.id === state.apLastSelectedCol);
            const endIdx = visibleCols.findIndex(c => c.id === currentColId);
            if (startIdx !== -1 && endIdx !== -1) {
              state.apSelectedCols.clear();
              const minIdx = Math.min(startIdx, endIdx);
              const maxIdx = Math.max(startIdx, endIdx);
              for (let i = minIdx; i <= maxIdx; i++) {
                state.apSelectedCols.add(visibleCols[i].id);
              }
            }
          } else {
            state.apSelectedCols.clear();
            state.apSelectedCols.add(currentColId);
          }
          state.apLastSelectedCol = currentColId;
          if (!e.shiftKey) {
            state.apColumnSelectAnchor = currentColId;
          }
          renderApplicantInfo();
          syncApFormatToolbar();
        });

        th.addEventListener('mouseenter', () => {
          if (state.isSelectingCols && state.apLastSelectedCol) {
            const visibleCols = columns.filter(c => visibleColumnIds.includes(c.id));
            const startIdx = visibleCols.findIndex(c => c.id === state.apLastSelectedCol);
            const endIdx = visibleCols.findIndex(c => c.id === col.id);
            if (startIdx !== -1 && endIdx !== -1) {
              state.apSelectedCols.clear();
              const minIdx = Math.min(startIdx, endIdx);
              const maxIdx = Math.max(startIdx, endIdx);
              for (let i = minIdx; i <= maxIdx; i++) {
                state.apSelectedCols.add(visibleCols[i].id);
              }
              renderApplicantInfo();
            }
          }
        });

        th.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (window.logToDebugPanel) {
            window.logToDebugPanel(`contextmenu (ap namesRow th): col.id=${col.id}`, '#ffd700');
          }
          showCtContextMenu(e.clientX, e.clientY, { id: 'applicant-info-screen', name: '申込者マスタ', columns: state.apColumns }, 'col', col.id);
        });

        initApColumnResize(th, col.id);
        namesRow.appendChild(th);
      }
    });
    thead.appendChild(namesRow);
  }

  filteredContracts.forEach((contract, index) => {
    const rowAccess = checkRowAccess('applicant-info-screen', contract);
    const rowHeight = state.apRowHeights[index] || 30;

    const tr = document.createElement('tr');
    tr.setAttribute('data-row-id', contract.customerId);
    tr.style.borderBottom = '1px solid var(--border-color)';
    tr.style.height = `${rowHeight}px`;
    tr.style.maxHeight = `${rowHeight}px`;
    tr.style.minHeight = `${rowHeight}px`;

    const rowNumTd = document.createElement('td');
    rowNumTd.className = 'row-number-col';
    rowNumTd.style.height = `${rowHeight}px`;
    rowNumTd.style.lineHeight = `${rowHeight}px`;
    rowNumTd.style.padding = '0';
    rowNumTd.style.fontSize = '0.75rem';
    rowNumTd.style.cursor = 'pointer';
    rowNumTd.style.position = 'relative';

    if (rowAccess.grayout) {
      tr.classList.add('grayed-out-access');
      rowNumTd.innerHTML = `${index + 1} <span class="grant-row-btn" style="cursor: pointer; color: var(--primary); font-size: 0.75rem; margin-left: 2px;" title="この行の表示条件を解除（全行表示に更新）">🔓</span>`;
      rowNumTd.querySelector('.grant-row-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        grantRowPermission('applicant-info-screen');
      });
    } else {
      rowNumTd.textContent = index + 1;
    }

    const rowResizer = document.createElement('div');
    rowResizer.className = 'row-resizer';
    rowResizer.style.zIndex = '50';
    rowNumTd.appendChild(rowResizer);
    setupMasterRowResize('ap', index, rowResizer);
    setupMasterRowContextMenu('ap', index, rowNumTd);

    if (fixedColIds.length > 0) {
      rowNumTd.style.position = 'sticky';
      rowNumTd.style.left = '0px';
      rowNumTd.style.zIndex = '12';
    }
    if (index < fixedRowLimit) {
      rowNumTd.style.position = 'sticky';
      rowNumTd.style.top = `${topPosMap[index]}px`;
      rowNumTd.style.zIndex = fixedColIds.length > 0 ? '14' : '13';
    }
    if (state.apSelectedRow === index || state.apSelectedRows.has(index)) {
      rowNumTd.classList.add('active-row-header');
    }

    rowNumTd.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return; // 左クリックのみ
      e.stopPropagation();
      state.isSelectingRows = true;

      const currentRowIdx = index;
      if (e.ctrlKey || e.metaKey) {
        // Ctrl: 他の選択を維持してトグル
        if (state.apSelectedRows.has(currentRowIdx)) {
          state.apSelectedRows.delete(currentRowIdx);
        } else {
          state.apSelectedRows.add(currentRowIdx);
        }
      } else if (e.shiftKey && state.apLastSelectedRow !== null) {
        // Shift: 連続選択
        state.apSelectedRows.clear();
        state.apSelectedCols.clear();
        state.apSelectedCells.clear();
        state.apSelectedCell = null;
        state.apSelectedRange = null;

        const minR = Math.min(state.apLastSelectedRow, currentRowIdx);
        const maxR = Math.max(state.apLastSelectedRow, currentRowIdx);
        for (let r = minR; r <= maxR; r++) {
          state.apSelectedRows.add(r);
        }
      } else {
        // 通常
        state.apSelectedCell = null;
        state.apSelectedRange = null;
        state.apSelectedCols.clear();
        state.apSelectedCells.clear();
        state.apSelectedRows.clear();
        state.apSelectedRows.add(currentRowIdx);
      }
      state.apLastSelectedRow = currentRowIdx;
      renderApplicantInfo();
      syncApFormatToolbar();
    });

    rowNumTd.addEventListener('mouseenter', () => {
      if (state.isSelectingRows && state.apLastSelectedRow !== null) {
        state.apSelectedRows.clear();
        const minR = Math.min(state.apLastSelectedRow, index);
        const maxR = Math.max(state.apLastSelectedRow, index);
        for (let r = minR; r <= maxR; r++) {
          state.apSelectedRows.add(r);
        }
        renderApplicantInfo();
      }
    });
    tr.appendChild(rowNumTd);

    let vColIdx = 0;
    columns.forEach(col => {
      if (visibleColumnIds.includes(col.id)) {
        const val = contract[col.id] || '';
        const td = document.createElement('td');
        td.style.padding = '0.3rem 0.6rem';
        td.style.height = `${rowHeight}px`;
        td.style.maxHeight = `${rowHeight}px`;
        td.style.minHeight = `${rowHeight}px`;
        td.style.boxSizing = 'border-box';
        td.style.fontSize = '0.8rem';
        td.setAttribute('data-col-id', col.id);
        td.setAttribute('data-customer-id', contract.customerId);

        const w = state.apColumnWidths[col.id] || 120;
        td.style.width = `${w}px`;
        td.style.maxWidth = `${w}px`;
        td.style.minWidth = `${w}px`;

        let isSticky = false;
        if (fixedColIds.includes(col.id)) {
          td.style.position = 'sticky';
          td.style.left = `${leftPosMap[col.id]}px`;
          td.style.zIndex = '10';
          isSticky = true;
        }
        if (index < fixedRowLimit) {
          td.style.position = 'sticky';
          td.style.top = `${topPosMap[index]}px`;
          td.style.zIndex = isSticky ? '14' : '9';
          isSticky = true;
        }
        if (isSticky) {
          td.style.backgroundColor = 'var(--bg-surface)';
        }

        const cellKey = `${contract.customerId}_${col.id}`;
        const styleObj = getCellFormatStyles('ap', contract.customerId, col.id, contract, val);

        applyInlineStylesToCell(td, styleObj);

        if (styleObj['background-color']) {
          td.style.backgroundColor = styleObj['background-color'];
        } else if (isSticky) {
          td.style.backgroundColor = 'var(--bg-surface)';
        }

        td.title = String(val);

        // バッジや書式のデフォルト
        let isDropdownRendered = renderMasterDropdownCellMarkup(td, val, col, styleObj);
        if (!isDropdownRendered) {
          if (col.id === 'status') {
            td.innerHTML = `<span class="badge ${val === '審査中' ? 'badge-draft' : 'badge-new'}">${val}</span>`;
            if (styleObj['background-color']) {
              const badgeSpan = td.querySelector('.badge');
              if (badgeSpan) badgeSpan.style.backgroundColor = styleObj['background-color'];
            }
          } else if (col.id === 'name') {
            td.style.fontWeight = styleObj['font-weight'] || '600';
            td.style.color = styleObj['color'] || 'var(--text-primary)';
            td.textContent = val;
          } else {
            td.style.color = styleObj['color'] || 'var(--text-secondary)';
            td.textContent = val;
          }
        }

        let inRange = false;
        if (state.apSelectedRange) {
          const minR = Math.min(state.apSelectedRange.startRow, state.apSelectedRange.endRow);
          const maxR = Math.max(state.apSelectedRange.startRow, state.apSelectedRange.endRow);
          const minC = Math.min(state.apSelectedRange.startCol, state.apSelectedRange.endCol);
          const maxC = Math.max(state.apSelectedRange.startCol, state.apSelectedRange.endCol);
          if (index >= minR && index <= maxR && vColIdx >= minC && vColIdx <= maxC) {
            inRange = true;
          }
        }

        const currentCellKey = `${contract.customerId}_${col.id}`;
        const isSelected = (state.apSelectedCell && 
                            state.apSelectedCell.customerId === contract.customerId && 
                            state.apSelectedCell.colId === col.id) ||
                           state.apSelectedCells.has(currentCellKey);
        if (isSelected) {
          td.classList.add('selected-cell');
        }
        if (state.apSelectedRow === index || state.apSelectedRows.has(index)) {
          td.classList.add('selected-row-cell');
        }
        if (state.apSelectedCol === col.id || state.apSelectedCols.has(col.id)) {
          td.classList.add('selected-col-cell');
        }
        if (inRange) {
          td.classList.add('in-range-cell');
        }

        td.style.cursor = 'pointer';

        const currentRow = index;
        const currentColIdx = vColIdx;

        td.addEventListener('mousedown', (e) => {
          if (e.target.tagName === 'A') return;
          if (e.button !== 0) return; // 左クリックのみ
          e.stopPropagation();

          const isSelect = col.type === 'select' || (col.choices && col.choices.length > 0);
          if (isSelect) {
            startMasterDropdownEdit(td, val, col, contract, index, 'ap');
            return;
          }

          const cellKey = `${contract.customerId}_${col.id}`;

          if (e.ctrlKey || e.metaKey) {
            // Ctrl: 非連続
            if (state.apSelectedCells.has(cellKey)) {
              state.apSelectedCells.delete(cellKey);
            } else {
              state.apSelectedCells.add(cellKey);
            }
            state.apSelectedCell = { customerId: contract.customerId, colId: col.id };
            state.apSelectedRange = null;
          } else if (e.shiftKey && state.apSelectedCell) {
            const activeColId = state.apSelectedCell.colId;
            const visibleCols = columns.filter(c => visibleColumnIds.includes(c.id));
            const activeColIdx = visibleCols.findIndex(c => c.id === activeColId);
            const activeRowIdx = filteredContracts.findIndex(c => c.customerId === state.apSelectedCell.customerId);

            if (activeColIdx !== -1 && activeRowIdx !== -1) {
              state.apSelectedRange = {
                startRow: activeRowIdx,
                startCol: activeColIdx,
                endRow: currentRow,
                endCol: currentColIdx
              };
              state.apSelectedCells.clear();
            }
          } else {
            state.isSelecting = true;
            state.apSelectedRange = {
              startRow: currentRow,
              startCol: currentColIdx,
              endRow: currentRow,
              endCol: currentColIdx
            };
            state.apSelectedRow = null;
            state.apSelectedCol = null;
            state.apSelectedRows.clear();
            state.apSelectedCols.clear();
            state.apColumnSelectAnchor = null;
            state.apColumnSelectLast = null;
            state.apSelectedCell = { customerId: contract.customerId, colId: col.id };
            state.apSelectedCells.clear();
            state.apSelectedCells.add(cellKey);
          }
          renderApplicantInfo();
          syncApFormatToolbar();
        });

        td.addEventListener('mouseenter', () => {
          if (state.isSelecting && state.apSelectedRange) {
            state.apSelectedRange.endRow = currentRow;
            state.apSelectedRange.endCol = currentColIdx;
            renderApplicantInfo();
            syncApFormatToolbar();
          }
        });

        td.addEventListener('click', (e) => {
          e.stopPropagation();
          const isSelect = col.type === 'select' || (col.choices && col.choices.length > 0);
          if (isSelect) {
            if (isTableLocked('ap')) return;
            startMasterDropdownEdit(td, val, col, contract, index, 'ap');
          }
        });

        td.addEventListener('dblclick', (e) => {
          if (!isTableLocked('ap')) {
            startMasterCellEdit(td, val, col, contract, index, 'ap');
          } else {
            td.classList.toggle('cell-expanded');
          }
        });

        tr.appendChild(td);
        vColIdx++;
      }
    });
    tbody.appendChild(tr);
  });
  
  updateSelectionStatsWidget();
  adjustOverflowCells(document.querySelector('#applicant-info-screen .spreadsheet-table'));
}

// 選択されているセルの書式情報を取得して、ツールバーのUI表示と同期する（申込者）
function syncApFormatToolbar() {
  let customStyle = {};
  
  if (state.apSelectedCell) {
    const cellKey = `${state.apSelectedCell.customerId}_${state.apSelectedCell.colId}`;
    customStyle = state.apCellStyles[cellKey] || {};
  } else if (state.apSelectedRow !== null) {
    const contract = state.apContracts[state.apSelectedRow];
    if (contract) {
      const firstCol = state.apColumns.find(col => state.apVisibleColumns.includes(col.id));
      if (firstCol) {
        const cellKey = `${contract.customerId}_${firstCol.id}`;
        customStyle = state.apCellStyles[cellKey] || {};
      }
    }
  } else if (state.apSelectedCol !== null) {
    const firstContract = state.apContracts[0];
    if (firstContract) {
      const cellKey = `${firstContract.customerId}_${state.apSelectedCol}`;
      customStyle = state.apCellStyles[cellKey] || {};
    }
  }

  const sizeInput = document.getElementById('ap-font-size-input');
  if (sizeInput) {
    let size = customStyle.fontSize ? parseInt(customStyle.fontSize, 10) : 10;
    sizeInput.value = size;
  }

  const boldBtn = document.getElementById('ap-text-bold');
  if (boldBtn) {
    if (customStyle.fontWeight === 'bold') {
      boldBtn.classList.add('active');
    } else {
      boldBtn.classList.remove('active');
    }
  }

  const italicBtn = document.getElementById('ap-text-italic');
  if (italicBtn) {
    if (customStyle.fontStyle === 'italic') {
      italicBtn.classList.add('active');
    } else {
      italicBtn.classList.remove('active');
    }
  }

  const strikeBtn = document.getElementById('ap-text-strike');
  if (strikeBtn) {
    if (customStyle.textDecoration === 'line-through') {
      strikeBtn.classList.add('active');
    } else {
      strikeBtn.classList.remove('active');
    }
  }

  const colorIndicator = document.getElementById('ap-text-color-indicator');
  if (colorIndicator) {
    const activeColor = customStyle.color || 'var(--text-primary)';
    colorIndicator.style.borderBottomColor = activeColor;
  }

  const bgIndicator = document.getElementById('ap-bg-color-indicator');
  if (bgIndicator) {
    const activeBg = customStyle.bg || 'transparent';
    bgIndicator.style.borderBottomColor = activeBg;
  }

  const aligns = {
    left: document.getElementById('ap-align-left'),
    center: document.getElementById('ap-align-center'),
    right: document.getElementById('ap-align-right')
  };
  const activeAlign = customStyle.textAlign || 'left';
  Object.keys(aligns).forEach(alignKey => {
    const btn = aligns[alignKey];
    if (btn) {
      if (alignKey === activeAlign) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    }
  });

  const valigns = {
    top: document.getElementById('ap-valign-top'),
    middle: document.getElementById('ap-valign-middle'),
    bottom: document.getElementById('ap-valign-bottom')
  };
  const activeValign = customStyle.verticalAlign || 'middle';
  Object.keys(valigns).forEach(valignKey => {
    const btn = valigns[valignKey];
    if (btn) {
      if (valignKey === activeValign) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    }
  });

  const wraps = {
    clip: document.getElementById('ap-wrap-clip'),
    wrap: document.getElementById('ap-wrap-wrap'),
    overflow: document.getElementById('ap-wrap-overflow')
  };
  let activeWrap = 'clip';
  if (customStyle.whiteSpace === 'normal') {
    activeWrap = 'wrap';
  } else if (customStyle.whiteSpace === 'nowrap' && customStyle.overflow === 'visible') {
    activeWrap = 'overflow';
  }
  Object.keys(wraps).forEach(wrapKey => {
    const btn = wraps[wrapKey];
    if (btn) {
      if (wrapKey === activeWrap) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    }
  });
}

function setupApFormatToolbarEvents() {
  const getTargetCellKeys = () => {
    const keys = [];
    const isAdmin = state.currentUser && state.currentUser.id === 'admin';
    const visibleColumnIds = isAdmin ? state.apColumns.map(c => c.id) : state.apVisibleColumns;

    if (state.apSelectedRows && state.apSelectedRows.size > 0) {
      const tbody = document.getElementById('applicant-table-body');
      if (tbody) {
        const rows = tbody.querySelectorAll('tr');
        state.apSelectedRows.forEach(rIdx => {
          const tr = rows[rIdx];
          if (tr) {
            const customerId = tr.getAttribute('data-row-id');
            if (customerId) {
              visibleColumnIds.forEach(colId => {
                keys.push(`${customerId}_${colId}`);
              });
            }
          }
        });
      }
    } else if (state.apSelectedCols && state.apSelectedCols.size > 0) {
      state.apSelectedCols.forEach(colId => {
        state.apContracts.forEach(contract => {
          keys.push(`${contract.customerId}_${colId}`);
        });
      });
    } else if (state.apSelectedRange) {
      const minRow = Math.min(state.apSelectedRange.startRow, state.apSelectedRange.endRow);
      const maxRow = Math.max(state.apSelectedRange.startRow, state.apSelectedRange.endRow);
      const minCol = Math.min(state.apSelectedRange.startCol, state.apSelectedRange.endCol);
      const maxCol = Math.max(state.apSelectedRange.startCol, state.apSelectedRange.endCol);
      
      const visibleCols = state.apColumns.filter(c => visibleColumnIds.includes(c.id));
      
      const tbody = document.getElementById('applicant-table-body');
      if (tbody) {
        const rows = tbody.querySelectorAll('tr');
        for (let r = minRow; r <= maxRow; r++) {
          const tr = rows[r];
          if (tr) {
            const customerId = tr.getAttribute('data-row-id');
            if (customerId) {
              for (let c = minCol; c <= maxCol; c++) {
                const col = visibleCols[c];
                if (col) {
                  keys.push(`${customerId}_${col.id}`);
                }
              }
            }
          }
        }
      }
    } else if (state.apSelectedCell) {
      keys.push(`${state.apSelectedCell.customerId}_${state.apSelectedCell.colId}`);
    } else if (state.apSelectedRow !== null) {
      const tbody = document.getElementById('applicant-table-body');
      if (tbody) {
        const tr = tbody.querySelectorAll('tr')[state.apSelectedRow];
        if (tr) {
          const customerId = tr.getAttribute('data-row-id');
          if (customerId) {
            state.apColumns.forEach(col => {
              if (visibleColumnIds.includes(col.id)) {
                keys.push(`${customerId}_${col.id}`);
              }
            });
          }
        }
      }
    } else if (state.apSelectedCol !== null) {
      state.apContracts.forEach(contract => {
        keys.push(`${contract.customerId}_${state.apSelectedCol}`);
      });
    }
    return keys;
  };

  const applyStyle = (property, value) => {
    const cellKeys = getTargetCellKeys();
    if (cellKeys.length === 0) return;

    const targetStyles = getTargetStyles('ap');

    cellKeys.forEach(cellKey => {
      if (!targetStyles[cellKey]) {
        targetStyles[cellKey] = {};
      }
      
      if (targetStyles[cellKey][property] === value) {
        delete targetStyles[cellKey][property];
      } else {
        targetStyles[cellKey][property] = value;
      }
      
      if (Object.keys(targetStyles[cellKey]).length === 0) {
        delete targetStyles[cellKey];
      }
    });
    
    saveCellStyles('ap');
    renderApplicantInfo();
    syncApFormatToolbar();
  };

  const fontDecBtn = document.getElementById('ap-font-dec');
  const fontIncBtn = document.getElementById('ap-font-inc');

  const applyFontSize = (newSize) => {
    const cellKeys = getTargetCellKeys();
    if (cellKeys.length === 0) return;

    const targetStyles = getTargetStyles('ap');
    const size = Math.max(6, Math.min(24, newSize));

    cellKeys.forEach(cellKey => {
      if (!targetStyles[cellKey]) targetStyles[cellKey] = {};
      
      if (size === 10) {
        delete targetStyles[cellKey].fontSize;
      } else {
        targetStyles[cellKey].fontSize = `${size}pt`;
      }
      
      if (Object.keys(targetStyles[cellKey]).length === 0) delete targetStyles[cellKey];
    });
    
    saveCellStyles('ap');
    renderApplicantInfo();
    syncApFormatToolbar();
  };

  const adjustFontSize = (change) => {
    const cellKeys = getTargetCellKeys();
    if (cellKeys.length === 0) return;

    const targetStyles = getTargetStyles('ap');
    const firstKey = cellKeys[0];
    const currentStyle = targetStyles[firstKey] || {};
    let currentSize = currentStyle.fontSize ? parseInt(currentStyle.fontSize, 10) : 10;
    let newSize = Math.max(6, Math.min(24, currentSize + change));

    applyFontSize(newSize);
  };

  if (fontDecBtn) fontDecBtn.addEventListener('click', () => adjustFontSize(-1));
  if (fontIncBtn) fontIncBtn.addEventListener('click', () => adjustFontSize(1));

  const fontSizeInput = document.getElementById('ap-font-size-input');
  if (fontSizeInput) {
    fontSizeInput.addEventListener('change', (e) => {
      const val = parseInt(e.target.value, 10);
      if (!isNaN(val)) {
        applyFontSize(val);
      }
    });
  }

  const boldBtn = document.getElementById('ap-text-bold');
  if (boldBtn) boldBtn.addEventListener('click', () => applyStyle('fontWeight', 'bold'));

  const italicBtn = document.getElementById('ap-text-italic');
  if (italicBtn) italicBtn.addEventListener('click', () => applyStyle('fontStyle', 'italic'));

  const strikeBtn = document.getElementById('ap-text-strike');
  if (strikeBtn) strikeBtn.addEventListener('click', () => applyStyle('textDecoration', 'line-through'));

  const colorBtn = document.getElementById('ap-text-color-btn');
  const colorDropdown = document.getElementById('ap-color-picker-dropdown');
  if (colorBtn && colorDropdown) {
    colorBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeAllColorPickersExcept(colorDropdown);
      const isHidden = colorDropdown.style.display === 'none' || !colorDropdown.style.display;
      if (isHidden) {
        renderColorPickerContent(colorDropdown);
      }
      colorDropdown.style.display = isHidden ? 'block' : 'none';
    });

    document.addEventListener('mousedown', (e) => {
      if (!colorDropdown.contains(e.target) && !colorBtn.contains(e.target)) {
        colorDropdown.style.display = 'none';
      }
    }, true);
  }

  // 背景色 (カラーピッカー)
  const bgBtn = document.getElementById('ap-bg-color-btn');
  const bgDropdown = document.getElementById('ap-bg-color-picker-dropdown');
  if (bgBtn && bgDropdown) {
    bgBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeAllColorPickersExcept(bgDropdown);
      const isHidden = bgDropdown.style.display === 'none' || !bgDropdown.style.display;
      if (isHidden) {
        renderColorPickerContent(bgDropdown);
      }
      bgDropdown.style.display = isHidden ? 'block' : 'none';
    });

    document.addEventListener('mousedown', (e) => {
      if (!bgDropdown.contains(e.target) && !bgBtn.contains(e.target)) {
        bgDropdown.style.display = 'none';
      }
    }, true);
  }


  // 書式リセット
  setupResetRangePopup(
    'ap',
    'ap-format-reset-btn',
    'ap-reset-range-popup',
    'ap-reset-range-input',
    'ap-reset-range-confirm',
    'ap-reset-all-confirm',
    state.apColumns,
    state.apContracts,
    state.apVisibleColumns
  );

  const alignLeft = document.getElementById('ap-align-left');
  const alignCenter = document.getElementById('ap-align-center');
  const alignRight = document.getElementById('ap-align-right');
  if (alignLeft) alignLeft.addEventListener('click', () => applyStyle('textAlign', 'left'));
  if (alignCenter) alignCenter.addEventListener('click', () => applyStyle('textAlign', 'center'));
  if (alignRight) alignRight.addEventListener('click', () => applyStyle('textAlign', 'right'));

  const valignTop = document.getElementById('ap-valign-top');
  const valignMiddle = document.getElementById('ap-valign-middle');
  const valignBottom = document.getElementById('ap-valign-bottom');
  if (valignTop) valignTop.addEventListener('click', () => applyStyle('verticalAlign', 'top'));
  if (valignMiddle) valignMiddle.addEventListener('click', () => applyStyle('verticalAlign', 'middle'));
  if (valignBottom) valignBottom.addEventListener('click', () => applyStyle('verticalAlign', 'bottom'));

  const wrapClip = document.getElementById('ap-wrap-clip');
  const wrapWrap = document.getElementById('ap-wrap-wrap');
  const wrapOverflow = document.getElementById('ap-wrap-overflow');

  const applyWrapStyle = (wrapType) => {
    const cellKeys = getTargetCellKeys();
    if (cellKeys.length === 0) return;

    const targetStyles = getTargetStyles('ap');

    cellKeys.forEach(cellKey => {
      if (!targetStyles[cellKey]) targetStyles[cellKey] = {};
      
      if (wrapType === 'wrap') {
        targetStyles[cellKey].whiteSpace = 'normal';
        targetStyles[cellKey].overflow = 'visible';
        targetStyles[cellKey].textOverflow = 'clip';
      } else if (wrapType === 'overflow') {
        targetStyles[cellKey].whiteSpace = 'nowrap';
        targetStyles[cellKey].overflow = 'visible';
        targetStyles[cellKey].textOverflow = 'clip';
      } else {
        delete targetStyles[cellKey].whiteSpace;
        delete targetStyles[cellKey].overflow;
        delete targetStyles[cellKey].textOverflow;
      }
      
      if (Object.keys(targetStyles[cellKey]).length === 0) delete targetStyles[cellKey];
    });

    saveCellStyles('ap');
    renderApplicantInfo();
    syncApFormatToolbar();
  };

  if (wrapClip) wrapClip.addEventListener('click', () => applyWrapStyle('clip'));
  if (wrapWrap) wrapWrap.addEventListener('click', () => applyWrapStyle('wrap'));
  if (wrapOverflow) wrapOverflow.addEventListener('click', () => applyWrapStyle('overflow'));
}

// 選択されているセルの書式情報を取得して、ツールバーのUI表示と同期する（代理店）
function syncAgFormatToolbar() {
  let customStyle = {};
  
  if (state.agSelectedCell) {
    const cellKey = `${state.agSelectedCell.customerId}_${state.agSelectedCell.colId}`;
    customStyle = state.agCellStyles[cellKey] || {};
  } else if (state.agSelectedRow !== null) {
    const contract = state.agContracts[state.agSelectedRow];
    if (contract) {
      const firstCol = state.agColumns.find(col => state.agVisibleColumns.includes(col.id));
      if (firstCol) {
        const cellKey = `${contract.customerId}_${firstCol.id}`;
        customStyle = state.agCellStyles[cellKey] || {};
      }
    }
  } else if (state.agSelectedCol !== null) {
    const firstContract = state.agContracts[0];
    if (firstContract) {
      const cellKey = `${firstContract.customerId}_${state.agSelectedCol}`;
      customStyle = state.agCellStyles[cellKey] || {};
    }
  }

  const sizeInput = document.getElementById('ag-font-size-input');
  if (sizeInput) {
    let size = customStyle.fontSize ? parseInt(customStyle.fontSize, 10) : 10;
    sizeInput.value = size;
  }

  const boldBtn = document.getElementById('ag-text-bold');
  if (boldBtn) {
    if (customStyle.fontWeight === 'bold') {
      boldBtn.classList.add('active');
    } else {
      boldBtn.classList.remove('active');
    }
  }

  const italicBtn = document.getElementById('ag-text-italic');
  if (italicBtn) {
    if (customStyle.fontStyle === 'italic') {
      italicBtn.classList.add('active');
    } else {
      italicBtn.classList.remove('active');
    }
  }

  const strikeBtn = document.getElementById('ag-text-strike');
  if (strikeBtn) {
    if (customStyle.textDecoration === 'line-through') {
      strikeBtn.classList.add('active');
    } else {
      strikeBtn.classList.remove('active');
    }
  }

  const colorIndicator = document.getElementById('ag-text-color-indicator');
  if (colorIndicator) {
    const activeColor = customStyle.color || 'var(--text-primary)';
    colorIndicator.style.borderBottomColor = activeColor;
  }

  const bgIndicator = document.getElementById('ag-bg-color-indicator');
  if (bgIndicator) {
    const activeBg = customStyle.bg || 'transparent';
    bgIndicator.style.borderBottomColor = activeBg;
  }

  const aligns = {
    left: document.getElementById('ag-align-left'),
    center: document.getElementById('ag-align-center'),
    right: document.getElementById('ag-align-right')
  };
  const activeAlign = customStyle.textAlign || 'left';
  Object.keys(aligns).forEach(alignKey => {
    const btn = aligns[alignKey];
    if (btn) {
      if (alignKey === activeAlign) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    }
  });

  const valigns = {
    top: document.getElementById('ag-valign-top'),
    middle: document.getElementById('ag-valign-middle'),
    bottom: document.getElementById('ag-valign-bottom')
  };
  const activeValign = customStyle.verticalAlign || 'middle';
  Object.keys(valigns).forEach(valignKey => {
    const btn = valigns[valignKey];
    if (btn) {
      if (valignKey === activeValign) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    }
  });

  const wraps = {
    clip: document.getElementById('ag-wrap-clip'),
    wrap: document.getElementById('ag-wrap-wrap'),
    overflow: document.getElementById('ag-wrap-overflow')
  };
  let activeWrap = 'clip';
  if (customStyle.whiteSpace === 'normal') {
    activeWrap = 'wrap';
  } else if (customStyle.whiteSpace === 'nowrap' && customStyle.overflow === 'visible') {
    activeWrap = 'overflow';
  }
  Object.keys(wraps).forEach(wrapKey => {
    const btn = wraps[wrapKey];
    if (btn) {
      if (wrapKey === activeWrap) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    }
  });
}

function setupAgFormatToolbarEvents() {
  const getTargetCellKeys = () => {
    const keys = [];
    const isAdmin = state.currentUser && state.currentUser.id === 'admin';
    const visibleColumnIds = isAdmin ? state.agColumns.map(c => c.id) : state.agVisibleColumns;

    if (state.agSelectedRows && state.agSelectedRows.size > 0) {
      const tbody = document.getElementById('agency-table-body');
      if (tbody) {
        const rows = tbody.querySelectorAll('tr');
        state.agSelectedRows.forEach(rIdx => {
          const tr = rows[rIdx];
          if (tr) {
            const customerId = tr.getAttribute('data-row-id');
            if (customerId) {
              visibleColumnIds.forEach(colId => {
                keys.push(`${customerId}_${colId}`);
              });
            }
          }
        });
      }
    } else if (state.agSelectedCols && state.agSelectedCols.size > 0) {
      state.agSelectedCols.forEach(colId => {
        state.agContracts.forEach(contract => {
          keys.push(`${contract.customerId}_${colId}`);
        });
      });
    } else if (state.agSelectedRange) {
      const minRow = Math.min(state.agSelectedRange.startRow, state.agSelectedRange.endRow);
      const maxRow = Math.max(state.agSelectedRange.startRow, state.agSelectedRange.endRow);
      const minCol = Math.min(state.agSelectedRange.startCol, state.agSelectedRange.endCol);
      const maxCol = Math.max(state.agSelectedRange.startCol, state.agSelectedRange.endCol);
      
      const visibleCols = state.agColumns.filter(c => visibleColumnIds.includes(c.id));
      
      const tbody = document.getElementById('agency-table-body');
      if (tbody) {
        const rows = tbody.querySelectorAll('tr');
        for (let r = minRow; r <= maxRow; r++) {
          const tr = rows[r];
          if (tr) {
            const customerId = tr.getAttribute('data-row-id');
            if (customerId) {
              for (let c = minCol; c <= maxCol; c++) {
                const col = visibleCols[c];
                if (col) {
                  keys.push(`${customerId}_${col.id}`);
                }
              }
            }
          }
        }
      }
    } else if (state.agSelectedCell) {
      keys.push(`${state.agSelectedCell.customerId}_${state.agSelectedCell.colId}`);
    } else if (state.agSelectedRow !== null) {
      const tbody = document.getElementById('agency-table-body');
      if (tbody) {
        const tr = tbody.querySelectorAll('tr')[state.agSelectedRow];
        if (tr) {
          const customerId = tr.getAttribute('data-row-id');
          if (customerId) {
            state.agColumns.forEach(col => {
              if (visibleColumnIds.includes(col.id)) {
                keys.push(`${customerId}_${col.id}`);
              }
            });
          }
        }
      }
    } else if (state.agSelectedCol !== null) {
      state.agContracts.forEach(contract => {
        keys.push(`${contract.customerId}_${state.agSelectedCol}`);
      });
    }
    return keys;
  };

  const applyStyle = (property, value) => {
    const cellKeys = getTargetCellKeys();
    if (cellKeys.length === 0) return;

    const targetStyles = getTargetStyles('ag');

    cellKeys.forEach(cellKey => {
      if (!targetStyles[cellKey]) {
        targetStyles[cellKey] = {};
      }
      
      if (targetStyles[cellKey][property] === value) {
        delete targetStyles[cellKey][property];
      } else {
        targetStyles[cellKey][property] = value;
      }
      
      if (Object.keys(targetStyles[cellKey]).length === 0) {
        delete targetStyles[cellKey];
      }
    });
    
    saveCellStyles('ag');
    renderAgencyInfo();
    syncAgFormatToolbar();
  };

  const fontDecBtn = document.getElementById('ag-font-dec');
  const fontIncBtn = document.getElementById('ag-font-inc');

  const applyFontSize = (newSize) => {
    const cellKeys = getTargetCellKeys();
    if (cellKeys.length === 0) return;

    const targetStyles = getTargetStyles('ag');
    const size = Math.max(6, Math.min(24, newSize));

    cellKeys.forEach(cellKey => {
      if (!targetStyles[cellKey]) targetStyles[cellKey] = {};
      
      if (size === 10) {
        delete targetStyles[cellKey].fontSize;
      } else {
        targetStyles[cellKey].fontSize = `${size}pt`;
      }
      
      if (Object.keys(targetStyles[cellKey]).length === 0) delete targetStyles[cellKey];
    });
    
    saveCellStyles('ag');
    renderAgencyInfo();
    syncAgFormatToolbar();
  };

  const adjustFontSize = (change) => {
    const cellKeys = getTargetCellKeys();
    if (cellKeys.length === 0) return;

    const targetStyles = getTargetStyles('ag');
    const firstKey = cellKeys[0];
    const currentStyle = targetStyles[firstKey] || {};
    let currentSize = currentStyle.fontSize ? parseInt(currentStyle.fontSize, 10) : 10;
    let newSize = Math.max(6, Math.min(24, currentSize + change));

    applyFontSize(newSize);
  };

  if (fontDecBtn) fontDecBtn.addEventListener('click', () => adjustFontSize(-1));
  if (fontIncBtn) fontIncBtn.addEventListener('click', () => adjustFontSize(1));

  const fontSizeInput = document.getElementById('ag-font-size-input');
  if (fontSizeInput) {
    fontSizeInput.addEventListener('change', (e) => {
      const val = parseInt(e.target.value, 10);
      if (!isNaN(val)) {
        applyFontSize(val);
      }
    });
  }

  const boldBtn = document.getElementById('ag-text-bold');
  if (boldBtn) boldBtn.addEventListener('click', () => applyStyle('fontWeight', 'bold'));

  const italicBtn = document.getElementById('ag-text-italic');
  if (italicBtn) italicBtn.addEventListener('click', () => applyStyle('fontStyle', 'italic'));

  const strikeBtn = document.getElementById('ag-text-strike');
  if (strikeBtn) strikeBtn.addEventListener('click', () => applyStyle('textDecoration', 'line-through'));

  const colorBtn = document.getElementById('ag-text-color-btn');
  const colorDropdown = document.getElementById('ag-color-picker-dropdown');
  if (colorBtn && colorDropdown) {
    colorBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeAllColorPickersExcept(colorDropdown);
      const isHidden = colorDropdown.style.display === 'none' || !colorDropdown.style.display;
      if (isHidden) {
        renderColorPickerContent(colorDropdown);
      }
      colorDropdown.style.display = isHidden ? 'block' : 'none';
    });

    document.addEventListener('mousedown', (e) => {
      if (!colorDropdown.contains(e.target) && !colorBtn.contains(e.target)) {
        colorDropdown.style.display = 'none';
      }
    }, true);
  }

  // 背景色 (カラーピッカー)
  const bgBtn = document.getElementById('ag-bg-color-btn');
  const bgDropdown = document.getElementById('ag-bg-color-picker-dropdown');
  if (bgBtn && bgDropdown) {
    bgBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeAllColorPickersExcept(bgDropdown);
      const isHidden = bgDropdown.style.display === 'none' || !bgDropdown.style.display;
      if (isHidden) {
        renderColorPickerContent(bgDropdown);
      }
      bgDropdown.style.display = isHidden ? 'block' : 'none';
    });

    document.addEventListener('mousedown', (e) => {
      if (!bgDropdown.contains(e.target) && !bgBtn.contains(e.target)) {
        bgDropdown.style.display = 'none';
      }
    }, true);
  }


  // 書式リセット
  setupResetRangePopup(
    'ag',
    'ag-format-reset-btn',
    'ag-reset-range-popup',
    'ag-reset-range-input',
    'ag-reset-range-confirm',
    'ag-reset-all-confirm',
    state.agColumns,
    state.agContracts,
    state.agVisibleColumns
  );

  const alignLeft = document.getElementById('ag-align-left');
  const alignCenter = document.getElementById('ag-align-center');
  const alignRight = document.getElementById('ag-align-right');
  if (alignLeft) alignLeft.addEventListener('click', () => applyStyle('textAlign', 'left'));
  if (alignCenter) alignCenter.addEventListener('click', () => applyStyle('textAlign', 'center'));
  if (alignRight) alignRight.addEventListener('click', () => applyStyle('textAlign', 'right'));

  const valignTop = document.getElementById('ag-valign-top');
  const valignMiddle = document.getElementById('ag-valign-middle');
  const valignBottom = document.getElementById('ag-valign-bottom');
  if (valignTop) valignTop.addEventListener('click', () => applyStyle('verticalAlign', 'top'));
  if (valignMiddle) valignMiddle.addEventListener('click', () => applyStyle('verticalAlign', 'middle'));
  if (valignBottom) valignBottom.addEventListener('click', () => applyStyle('verticalAlign', 'bottom'));

  const wrapClip = document.getElementById('ag-wrap-clip');
  const wrapWrap = document.getElementById('ag-wrap-wrap');
  const wrapOverflow = document.getElementById('ag-wrap-overflow');

  const applyWrapStyle = (wrapType) => {
    const cellKeys = getTargetCellKeys();
    if (cellKeys.length === 0) return;

    const targetStyles = getTargetStyles('ag');

    cellKeys.forEach(cellKey => {
      if (!targetStyles[cellKey]) targetStyles[cellKey] = {};
      
      if (wrapType === 'wrap') {
        targetStyles[cellKey].whiteSpace = 'normal';
        targetStyles[cellKey].overflow = 'visible';
        targetStyles[cellKey].textOverflow = 'clip';
      } else if (wrapType === 'overflow') {
        targetStyles[cellKey].whiteSpace = 'nowrap';
        targetStyles[cellKey].overflow = 'visible';
        targetStyles[cellKey].textOverflow = 'clip';
      } else {
        delete targetStyles[cellKey].whiteSpace;
        delete targetStyles[cellKey].overflow;
        delete targetStyles[cellKey].textOverflow;
      }
      
      if (Object.keys(targetStyles[cellKey]).length === 0) delete targetStyles[cellKey];
    });

    saveCellStyles('ag');
    renderAgencyInfo();
    syncAgFormatToolbar();
  };

  if (wrapClip) wrapClip.addEventListener('click', () => applyWrapStyle('clip'));
  if (wrapWrap) wrapWrap.addEventListener('click', () => applyWrapStyle('wrap'));
  if (wrapOverflow) wrapOverflow.addEventListener('click', () => applyWrapStyle('overflow'));
}
function syncJoFormatToolbar() {
  let customStyle = {};
  
  if (state.joSelectedCell) {
    const cellKey = `${state.joSelectedCell.customerId}_${state.joSelectedCell.colId}`;
    
    const master = (state.joMasterCellStyles && state.joMasterCellStyles[cellKey]) || {};
    const user = (state.joCellStyles && state.joCellStyles[cellKey]) || {};
    customStyle = Object.assign({}, master, user);
  } else if (state.joSelectedRow !== null) {
    const contract = state.joContracts[state.joSelectedRow];
    if (contract) {
      const firstCol = state.joColumns.find(col => state.joVisibleColumns.includes(col.id));
      if (firstCol) {
        const cellKey = `${contract.customerId}_${firstCol.id}`;
        const master = (state.joMasterCellStyles && state.joMasterCellStyles[cellKey]) || {};
        const user = (state.joCellStyles && state.joCellStyles[cellKey]) || {};
        customStyle = Object.assign({}, master, user);
      }
    }
  } else if (state.joSelectedCol !== null) {
    const firstContract = state.joContracts[0];
    if (firstContract) {
      const cellKey = `${firstContract.customerId}_${state.joSelectedCol}`;
      const master = (state.joMasterCellStyles && state.joMasterCellStyles[cellKey]) || {};
      const user = (state.joCellStyles && state.joCellStyles[cellKey]) || {};
      customStyle = Object.assign({}, master, user);
    }
  }

  // UIへの反映
  const sizeInput = document.getElementById('jo-font-size-input');
  if (sizeInput) {
    let size = customStyle.fontSize ? parseInt(customStyle.fontSize, 10) : 10;
    sizeInput.value = size;
  }

  const boldBtn = document.getElementById('jo-text-bold');
  if (boldBtn) {
    if (customStyle.fontWeight === 'bold') boldBtn.classList.add('active');
    else boldBtn.classList.remove('active');
  }

  const italicBtn = document.getElementById('jo-text-italic');
  if (italicBtn) {
    if (customStyle.fontStyle === 'italic') italicBtn.classList.add('active');
    else italicBtn.classList.remove('active');
  }

  const strikeBtn = document.getElementById('jo-text-strike');
  if (strikeBtn) {
    if (customStyle.textDecoration === 'line-through') strikeBtn.classList.add('active');
    else strikeBtn.classList.remove('active');
  }

  const colorIndicator = document.getElementById('jo-text-color-indicator');
  if (colorIndicator) {
    const activeColor = customStyle.color || 'var(--text-primary)';
    colorIndicator.style.borderBottomColor = activeColor;
  }

  const bgIndicator = document.getElementById('jo-bg-color-indicator');
  if (bgIndicator) {
    const activeBg = customStyle.bg || 'transparent';
    bgIndicator.style.borderBottomColor = activeBg;
  }

  const aligns = {
    left: document.getElementById('jo-align-left'),
    center: document.getElementById('jo-align-center'),
    right: document.getElementById('jo-align-right')
  };
  const activeAlign = customStyle.textAlign || 'left';
  Object.keys(aligns).forEach(alignKey => {
    const btn = aligns[alignKey];
    if (btn) {
      if (alignKey === activeAlign) btn.classList.add('active');
      else btn.classList.remove('active');
    }
  });

  const valigns = {
    top: document.getElementById('jo-valign-top'),
    middle: document.getElementById('jo-valign-middle'),
    bottom: document.getElementById('jo-valign-bottom')
  };
  const activeValign = customStyle.verticalAlign || 'middle';
  Object.keys(valigns).forEach(valignKey => {
    const btn = valigns[valignKey];
    if (btn) {
      if (valignKey === activeValign) btn.classList.add('active');
      else btn.classList.remove('active');
    }
  });

  const wraps = {
    clip: document.getElementById('jo-wrap-clip'),
    wrap: document.getElementById('jo-wrap-wrap'),
    overflow: document.getElementById('jo-wrap-overflow')
  };
  let activeWrap = 'clip';
  if (customStyle.whiteSpace === 'normal') {
    activeWrap = 'wrap';
  } else if (customStyle.whiteSpace === 'nowrap' && customStyle.overflow === 'visible') {
    activeWrap = 'overflow';
  }
  Object.keys(wraps).forEach(wrapKey => {
    const btn = wraps[wrapKey];
    if (btn) {
      if (wrapKey === activeWrap) btn.classList.add('active');
      else btn.classList.remove('active');
    }
  });
}

function setupJoFormatToolbarEvents() {
  const getTargetCellKeys = () => {
    const keys = [];
    if (state.joSelectedRows && state.joSelectedRows.size > 0) {
      const tbody = document.getElementById('jo-table-body');
      if (tbody) {
        const rows = tbody.querySelectorAll('tr');
        state.joSelectedRows.forEach(rIdx => {
          const tr = rows[rIdx];
          if (tr) {
            const customerId = tr.getAttribute('data-row-id');
            if (customerId) {
              state.joVisibleColumns.forEach(colId => {
                keys.push(`${customerId}_${colId}`);
              });
            }
          }
        });
      }
    } else if (state.joSelectedCols && state.joSelectedCols.size > 0) {
      state.joSelectedCols.forEach(colId => {
        state.joContracts.forEach(contract => {
          keys.push(`${contract.customerId}_${colId}`);
        });
      });
    } else if (state.joSelectedRange) {
      const minRow = Math.min(state.joSelectedRange.startRow, state.joSelectedRange.endRow);
      const maxRow = Math.max(state.joSelectedRange.startRow, state.joSelectedRange.endRow);
      const minCol = Math.min(state.joSelectedRange.startCol, state.joSelectedRange.endCol);
      const maxCol = Math.max(state.joSelectedRange.startCol, state.joSelectedRange.endCol);
      
      const visibleCols = state.joColumns.filter(c => state.joVisibleColumns.includes(c.id));
      
      const tbody = document.getElementById('jo-table-body');
      if (tbody) {
        const rows = tbody.querySelectorAll('tr');
        for (let r = minRow; r <= maxRow; r++) {
          const tr = rows[r];
          if (tr) {
            const customerId = tr.getAttribute('data-row-id');
            if (customerId) {
              for (let c = minCol; c <= maxCol; c++) {
                const col = visibleCols[c];
                if (col) {
                  keys.push(`${customerId}_${col.id}`);
                }
              }
            }
          }
        }
      }
    } else if (state.joSelectedCell) {
      keys.push(`${state.joSelectedCell.customerId}_${state.joSelectedCell.colId}`);
    } else if (state.joSelectedRow !== null) {
      const tbody = document.getElementById('jo-table-body');
      if (tbody) {
        const tr = tbody.querySelectorAll('tr')[state.joSelectedRow];
        if (tr) {
          const customerId = tr.getAttribute('data-row-id');
          if (customerId) {
            state.joColumns.forEach(col => {
              if (state.joVisibleColumns.includes(col.id)) {
                keys.push(`${customerId}_${col.id}`);
              }
            });
          }
        }
      }
    } else if (state.joSelectedCol !== null) {
      state.joContracts.forEach(contract => {
        keys.push(`${contract.customerId}_${state.joSelectedCol}`);
      });
    }
    return keys;
  };

  const applyStyle = (property, value) => {
    const cellKeys = getTargetCellKeys();
    if (cellKeys.length === 0) return;

    const targetStyles = getTargetStyles('jo');

    cellKeys.forEach(cellKey => {
      if (!targetStyles[cellKey]) {
        targetStyles[cellKey] = {};
      }
      
      if (targetStyles[cellKey][property] === value) {
        delete targetStyles[cellKey][property];
      } else {
        targetStyles[cellKey][property] = value;
      }
      
      if (Object.keys(targetStyles[cellKey]).length === 0) {
        delete targetStyles[cellKey];
      }
    });
    
    saveCellStyles('jo');
    renderJoInfo();
    syncJoFormatToolbar();
  };

  // フォントサイズ変更
  const fontDecBtn = document.getElementById('jo-font-dec');
  const fontIncBtn = document.getElementById('jo-font-inc');

  const applyFontSize = (newSize) => {
    const cellKeys = getTargetCellKeys();
    if (cellKeys.length === 0) return;

    const targetStyles = getTargetStyles('jo');
    const size = Math.max(6, Math.min(24, newSize));

    cellKeys.forEach(cellKey => {
      if (!targetStyles[cellKey]) targetStyles[cellKey] = {};
      
      if (size === 10) {
        delete targetStyles[cellKey].fontSize;
      } else {
        targetStyles[cellKey].fontSize = `${size}pt`;
      }
      
      if (Object.keys(targetStyles[cellKey]).length === 0) delete targetStyles[cellKey];
    });
    
    saveCellStyles('jo');
    renderJoInfo();
    syncJoFormatToolbar();
  };

  const adjustFontSize = (change) => {
    const cellKeys = getTargetCellKeys();
    if (cellKeys.length === 0) return;

    const targetStyles = getTargetStyles('jo');
    const firstKey = cellKeys[0];
    const currentStyle = targetStyles[firstKey] || {};
    let currentSize = currentStyle.fontSize ? parseInt(currentStyle.fontSize, 10) : 10;
    let newSize = Math.max(6, Math.min(24, currentSize + change));

    applyFontSize(newSize);
  };

  if (fontDecBtn) fontDecBtn.addEventListener('click', () => adjustFontSize(-1));
  if (fontIncBtn) fontIncBtn.addEventListener('click', () => adjustFontSize(1));

  const fontSizeInput = document.getElementById('jo-font-size-input');
  if (fontSizeInput) {
    fontSizeInput.addEventListener('change', (e) => {
      const val = parseInt(e.target.value, 10);
      if (!isNaN(val)) {
        applyFontSize(val);
      }
    });
  }

  // 太字
  const boldBtn = document.getElementById('jo-text-bold');
  if (boldBtn) boldBtn.addEventListener('click', () => applyStyle('fontWeight', 'bold'));

  // 斜体
  const italicBtn = document.getElementById('jo-text-italic');
  if (italicBtn) italicBtn.addEventListener('click', () => applyStyle('fontStyle', 'italic'));

  // 取り消し線
  const strikeBtn = document.getElementById('jo-text-strike');
  if (strikeBtn) strikeBtn.addEventListener('click', () => applyStyle('textDecoration', 'line-through'));

  // 文字色 (カラーピッカー)
  const colorBtn = document.getElementById('jo-text-color-btn');
  const colorDropdown = document.getElementById('jo-color-picker-dropdown');
  if (colorBtn && colorDropdown) {
    colorBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeAllColorPickersExcept(colorDropdown);
      const isHidden = colorDropdown.style.display === 'none' || !colorDropdown.style.display;
      if (isHidden) {
        renderColorPickerContent(colorDropdown);
      }
      colorDropdown.style.display = isHidden ? 'block' : 'none';
    });

    document.addEventListener('mousedown', (e) => {
      if (!colorDropdown.contains(e.target) && !colorBtn.contains(e.target)) {
        colorDropdown.style.display = 'none';
      }
    }, true);
  }

  // 背景色 (カラーピッカー)
  const bgBtn = document.getElementById('jo-bg-color-btn');
  const bgDropdown = document.getElementById('jo-bg-color-picker-dropdown');
  if (bgBtn && bgDropdown) {
    bgBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeAllColorPickersExcept(bgDropdown);
      const isHidden = bgDropdown.style.display === 'none' || !bgDropdown.style.display;
      if (isHidden) {
        renderColorPickerContent(bgDropdown);
      }
      bgDropdown.style.display = isHidden ? 'block' : 'none';
    });

    document.addEventListener('mousedown', (e) => {
      if (!bgDropdown.contains(e.target) && !bgBtn.contains(e.target)) {
        bgDropdown.style.display = 'none';
      }
    }, true);
  }


  // 書式リセット
  setupResetRangePopup(
    'jo',
    'jo-format-reset-btn',
    'jo-reset-range-popup',
    'jo-reset-range-input',
    'jo-reset-range-confirm',
    'jo-reset-all-confirm',
    state.joColumns,
    state.joContracts,
    state.joVisibleColumns
  );

  // 水平揃え
  const alignLeft = document.getElementById('jo-align-left');
  const alignCenter = document.getElementById('jo-align-center');
  const alignRight = document.getElementById('jo-align-right');
  if (alignLeft) alignLeft.addEventListener('click', () => applyStyle('textAlign', 'left'));
  if (alignCenter) alignCenter.addEventListener('click', () => applyStyle('textAlign', 'center'));
  if (alignRight) alignRight.addEventListener('click', () => applyStyle('textAlign', 'right'));

  // 垂直揃え
  const valignTop = document.getElementById('jo-valign-top');
  const valignMiddle = document.getElementById('jo-valign-middle');
  const valignBottom = document.getElementById('jo-valign-bottom');
  if (valignTop) valignTop.addEventListener('click', () => applyStyle('verticalAlign', 'top'));
  if (valignMiddle) valignMiddle.addEventListener('click', () => applyStyle('verticalAlign', 'middle'));
  if (valignBottom) valignBottom.addEventListener('click', () => applyStyle('verticalAlign', 'bottom'));

  // テキスト折り返し設定
  const wrapClip = document.getElementById('jo-wrap-clip');
  const wrapWrap = document.getElementById('jo-wrap-wrap');
  const wrapOverflow = document.getElementById('jo-wrap-overflow');

  const applyWrapStyle = (wrapType) => {
    const cellKeys = getTargetCellKeys();
    if (cellKeys.length === 0) return;

    const targetStyles = getTargetStyles('jo');

    cellKeys.forEach(cellKey => {
      if (!targetStyles[cellKey]) targetStyles[cellKey] = {};
      
      if (wrapType === 'wrap') {
        targetStyles[cellKey].whiteSpace = 'normal';
        targetStyles[cellKey].overflow = 'visible';
        targetStyles[cellKey].textOverflow = 'clip';
      } else if (wrapType === 'overflow') {
        targetStyles[cellKey].whiteSpace = 'nowrap';
        targetStyles[cellKey].overflow = 'visible';
        targetStyles[cellKey].textOverflow = 'clip';
      } else {
        delete targetStyles[cellKey].whiteSpace;
        delete targetStyles[cellKey].overflow;
        delete targetStyles[cellKey].textOverflow;
      }
      
      if (Object.keys(targetStyles[cellKey]).length === 0) delete targetStyles[cellKey];
    });

    saveCellStyles('jo');
    renderJoInfo();
    syncJoFormatToolbar();
  };

  if (wrapClip) wrapClip.addEventListener('click', () => applyWrapStyle('clip'));
  if (wrapWrap) wrapWrap.addEventListener('click', () => applyWrapStyle('wrap'));
  if (wrapOverflow) wrapOverflow.addEventListener('click', () => applyWrapStyle('overflow'));

  // --- 行・列の追加・削除イベント ---
  const rowAddBtn = document.getElementById('jo-row-add');
  const rowDeleteBtn = document.getElementById('jo-row-delete');
  const colAddBtn = document.getElementById('jo-col-add');
  const colDeleteBtn = document.getElementById('jo-col-delete');

  const generateUniqueJoCustomerId = () => {
    return generateUniqueCustomerNumber();
  };

  if (rowAddBtn) {
    rowAddBtn.addEventListener('click', () => {
      if (isTableLocked('jo')) {
        showToast('テーブルがロックされています。編集するには上部の鍵アイコンでロックを解除してください。', 'warning');
        return;
      }
      const newId = generateUniqueJoCustomerId();
      const newRow = {
        status: '申請中',
        customerId: newId,
        customerPersonalityId: generate8DigitId(),
        corpName: '（新規法人データ）',
        furigana: '',
        repName: '（代表者名）',
        repFurigana: '',
        appType: '新規',
        shopName: '',
        shopMedia: '',
        shopUrl: '',
        folder: '',
        ledgerSheet: '',
        contract: '',
        rakutenPassed: '',
        handoverDate: new Date().toISOString().split('T')[0],
        rewardStartDate: '',
        minGuaranteeStartMonth: '',
        stopMonth: '',
        folderCreated: '',
        statementDetails: ''
      };

      if (state.joSelectedRow !== null) {
        state.joContracts.splice(state.joSelectedRow, 0, newRow);
        showToast(`${state.joSelectedRow + 1}行目の上に行を追加しました。`, 'success');
      } else {
        state.joContracts.push(newRow);
        showToast('末尾に行を追加しました。', 'success');
      }

      localStorage.setItem(STORAGE_KEYS.JO_CONTRACTS, JSON.stringify(state.joContracts));
      state.joSelectedRow = null;
      renderJoInfo();
    });
  }

  if (rowDeleteBtn) {
    rowDeleteBtn.addEventListener('click', () => {
      if (isTableLocked('jo')) {
        showToast('テーブルがロックされています。編集するには上部の鍵アイコンでロックを解除してください。', 'warning');
        return;
      }
      if (state.joSelectedRow === null) {
        showToast('削除する行の行番号（左端の数字）を選択してください。', 'warning');
        return;
      }

      const deletedCustName = state.joContracts[state.joSelectedRow].corpName || '';
      state.joContracts.splice(state.joSelectedRow, 1);
      
      localStorage.setItem(STORAGE_KEYS.JO_CONTRACTS, JSON.stringify(state.joContracts));
      showToast(`${state.joSelectedRow + 1}行目（${deletedCustName}）を削除しました。`, 'success');
      
      state.joSelectedRow = null;
      renderJoInfo();
    });
  }

  if (colAddBtn) {
    colAddBtn.addEventListener('click', () => {
      if (isTableLocked('jo')) {
        showToast('テーブルがロックされています。編集するには上部の鍵アイコンでロックを解除してください。', 'warning');
        return;
      }
      const label = prompt('追加する新しい列（カラム）の名称を入力してください：');
      if (label === null) return;
      const trimmed = label.trim();
      if (!trimmed) {
        showToast('列名を入力してください。', 'warning');
        return;
      }

      const colId = `custom_col_${Date.now()}`;
      const newCol = { id: colId, label: trimmed, required: false };
      
      state.joColumns.push(newCol);
      localStorage.setItem(STORAGE_KEYS.JO_COLUMNS, JSON.stringify(state.joColumns));

      state.joVisibleColumns.push(colId);
      setSettingItem(STORAGE_KEYS.JO_VISIBLE_COLUMNS, JSON.stringify(state.joVisibleColumns));

      showToast(`新しい列「${trimmed}」を追加しました。`, 'success');
      renderJoInfo();
      renderJoColumnSelector();
    });
  }

  if (colDeleteBtn) {
    colDeleteBtn.addEventListener('click', () => {
      if (isTableLocked('jo')) {
        showToast('テーブルがロックされています。編集するには上部の鍵アイコンでロックを解除してください。', 'warning');
        return;
      }
      if (state.joSelectedCol === null) {
        showToast('削除する列（列ヘッダーのA, B, Cや列名）を選択してください。', 'warning');
        return;
      }

      const targetCol = state.joColumns.find(c => c.id === state.joSelectedCol);
      if (!targetCol) return;

      if (targetCol.required) {
        showToast(`必須列「${targetCol.label}」は削除できません。`, 'error');
        return;
      }

      const confirmDelete = confirm(`本当に列「${targetCol.label}」を削除しますか？\n（この列に入力されている全てのセルのデータは削除されます）`);
      if (!confirmDelete) return;

      state.joColumns = state.joColumns.filter(c => c.id !== state.joSelectedCol);
      localStorage.setItem(STORAGE_KEYS.JO_COLUMNS, JSON.stringify(state.joColumns));

      state.joVisibleColumns = state.joVisibleColumns.filter(id => id !== state.joSelectedCol);
      setSettingItem(STORAGE_KEYS.JO_VISIBLE_COLUMNS, JSON.stringify(state.joVisibleColumns));

      state.joContracts.forEach(contract => {
        delete contract[state.joSelectedCol];
        const cellKey = `${contract.customerId}_${state.joSelectedCol}`;
        delete state.joCellStyles[cellKey];
      });
      localStorage.setItem(STORAGE_KEYS.JO_CONTRACTS, JSON.stringify(state.joContracts));
      setSettingItem(STORAGE_KEYS.JO_CELL_STYLES, JSON.stringify(state.joCellStyles));

      showToast(`列「${targetCol.label}」を削除しました。`, 'success');
      state.joSelectedCol = null;
      renderJoInfo();
      renderJoColumnSelector();
    });
  }
}

let editingCFType = null;
let editingCFRuleId = null;

let cfStyleBold = false;
let cfStyleItalic = false;
let cfStyleUnderline = false;
let cfStyleStrike = false;
let cfStyleTextColor = 'var(--text-primary)';
let cfStyleBgColor = 'transparent';

// 選択中の範囲から Googleスタイル文字列 (例: A2:C5) を生成する
function getGoogleRangeStr(screenType) {
  let selRange = null;
  let visibleCols = [];
  let contracts = [];
  if (screenType === 'jo') {
    selRange = state.joSelectedRange;
    visibleCols = state.joColumns.filter(c => state.joVisibleColumns.includes(c.id));
    contracts = state.joContracts;
  } else if (screenType === 'ap') {
    selRange = state.apSelectedRange;
    visibleCols = state.apColumns.filter(c => state.apVisibleColumns.includes(c.id));
    contracts = state.apContracts;
  } else if (screenType === 'ag') {
    selRange = state.agSelectedRange;
    visibleCols = state.agColumns.filter(c => state.agVisibleColumns.includes(c.id));
    contracts = state.agContracts;
  }
  
  if (selRange) {
    const startColLetter = colIndexToLetter(selRange.startCol);
    const endColLetter = colIndexToLetter(selRange.endCol);
    const startRowDisplay = selRange.startRow + 1;
    const endRowDisplay = selRange.endRow + 1;
    return `${startColLetter}${startRowDisplay}:${endColLetter}${endRowDisplay}`;
  }
  
  let selCell = null;
  if (screenType === 'jo') selCell = state.joSelectedCell;
  else if (screenType === 'ap') selCell = state.apSelectedCell;
  else if (screenType === 'ag') selCell = state.agSelectedCell;
  
  if (selCell) {
    const colIdx = visibleCols.findIndex(c => c.id === selCell.colId);
    const rowIdx = contracts.findIndex(c => c.customerId === selCell.customerId);
    if (colIdx !== -1 && rowIdx !== -1) {
      const letter = colIndexToLetter(colIdx);
      return `${letter}${rowIdx + 1}`;
    }
  }
  
  return 'A:A';
}

// プレビューのスタイル更新
function updateCfPreview() {
  const preview = document.getElementById('cf-style-preview');
  if (!preview) return;
  
  preview.style.fontWeight = cfStyleBold ? 'bold' : 'normal';
  preview.style.fontStyle = cfStyleItalic ? 'italic' : 'normal';
  
  const decors = [];
  if (cfStyleUnderline) decors.push('underline');
  if (cfStyleStrike) decors.push('line-through');
  preview.style.textDecoration = decors.length > 0 ? decors.join(' ') : 'none';
  
  preview.style.color = adjustColorForTheme(cfStyleTextColor, false);
  preview.style.backgroundColor = cfStyleBgColor === 'transparent' ? 'transparent' : adjustColorForTheme(cfStyleBgColor, true);
  
  // インジケーター表示の更新
  const textInd = document.getElementById('cf-sidebar-text-color-indicator');
  if (textInd) textInd.style.backgroundColor = cfStyleTextColor;
  const bgInd = document.getElementById('cf-sidebar-bg-color-indicator');
  if (bgInd) bgInd.style.backgroundColor = cfStyleBgColor === 'transparent' ? 'transparent' : cfStyleBgColor;
}

// 条件付き書式パネルを開く
function openConditionalFormattingModal(screenType) {
  editingCFType = screenType;
  editingCFRuleId = null;
  
  const sidebar = document.getElementById('conditional-formatting-sidebar');
  const titleSpan = document.getElementById('rules-screen-name');
  if (!sidebar || !titleSpan) return;
  
  titleSpan.textContent = screenType === 'jo' ? 'JO情報' : screenType === 'ap' ? '申込者情報' : '代理店情報';
  
  sidebar.classList.add('open');
  
  // リストビューを表示
  document.getElementById('cf-rules-list-view').style.display = 'flex';
  document.getElementById('cf-rule-editor-view').style.display = 'none';
  document.getElementById('cf-editor-footer').style.display = 'none';
  
  renderCFRulesSidebarList();
}

// ルール一覧の描画
function renderCFRulesSidebarList() {
  const container = document.getElementById('cf-rules-list-container');
  if (!container) return;
  container.innerHTML = '';
  
  const rules = state.conditionalFormats[editingCFType] || [];
  if (rules.length === 0) {
    container.innerHTML = '<p style="font-size: 0.8rem; color: var(--text-muted); text-align: center; padding: 2rem 0;">ルールはまだありません。</p>';
    return;
  }
  
  const opMap = {
    empty: '空白',
    not_empty: '空白ではない',
    contains: 'を含む',
    not_contains: 'を含まない',
    starts_with: 'で始まる',
    ends_with: 'で終わる',
    eq: '完全一致する',
    gt: 'より大きい',
    gte: '以上',
    lt: 'より小さい',
    lte: '以下',
    eq_num: 'と等しい',
    not_eq_num: 'と等しくない',
    between: 'の間にある',
    not_between: 'の間にない'
  };
  
  rules.forEach((rule) => {
    const card = document.createElement('div');
    card.className = 'rule-item-card';
    card.style.cursor = 'pointer';
    
    // クリックで編集モードへ
    card.addEventListener('click', (e) => {
      if (e.target.closest('.cf-delete-rule-btn')) return; // 削除ボタンの場合はスキップ
      openCFEditor(rule.id);
    });
    
    let previewStyle = '';
    if (rule.bg && rule.bg !== 'transparent') previewStyle += `background-color: ${adjustColorForTheme(rule.bg, true)};`;
    if (rule.color && rule.color !== 'var(--text-primary)') previewStyle += `color: ${adjustColorForTheme(rule.color, false)};`;
    if (rule.bold) previewStyle += 'font-weight: bold;';
    if (rule.italic) previewStyle += 'font-style: italic;';
    const decors = [];
    if (rule.underline) decors.push('underline');
    if (rule.strike) decors.push('line-through');
    if (decors.length > 0) previewStyle += `text-decoration: ${decors.join(' ')};`;
    
    let condText = `値: ${rule.value || ''}`;
    if (rule.operator === 'between' || rule.operator === 'not_between') {
      condText = `${rule.value || ''} と ${rule.value2 || ''} の間`;
    } else if (rule.operator === 'empty' || rule.operator === 'not_empty') {
      condText = '';
    }
    
    card.innerHTML = `
      <div class="rule-item-info">
        <span style="font-size: 0.8rem; font-weight: 600; color: var(--text-primary); display: block;">
          範囲: ${rule.rangeStr || 'ALL'}
        </span>
        <span style="font-size: 0.75rem; color: var(--text-secondary); display: block; margin-top: 2px;">
          条件: ${opMap[rule.operator] || rule.operator} ${condText}
        </span>
      </div>
      <div class="rule-item-preview-container" style="display: flex; align-items: center; gap: 0.5rem;">
        <div class="rule-item-preview" style="${previewStyle}">Aa</div>
        <button class="cf-delete-rule-btn" style="background: none; border: none; color: var(--danger); font-size: 1rem; cursor: pointer; padding: 0.25rem;" title="ルールを削除">🗑️</button>
      </div>
    `;
    
    const deleteBtn = card.querySelector('.cf-delete-rule-btn');
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteCFRule(rule.id);
    });
    
    container.appendChild(card);
  });
}

// エディターを開く (新規または編集)
function openCFEditor(ruleId = null) {
  editingCFRuleId = ruleId;
  
  const rules = state.conditionalFormats[editingCFType] || [];
  const rule = ruleId ? rules.find(r => r.id === ruleId) : null;
  
  const rangeInput = document.getElementById('cf-range-input');
  const opSelect = document.getElementById('cf-rule-op');
  const valSingle = document.getElementById('cf-value-single');
  const valMin = document.getElementById('cf-value-min');
  const valMax = document.getElementById('cf-value-max');
  
  if (rule) {
    // 編集モード
    rangeInput.value = rule.rangeStr || '';
    opSelect.value = rule.operator || 'empty';
    valSingle.value = rule.value || '';
    valMin.value = rule.value || '';
    valMax.value = rule.value2 || '';
    
    cfStyleBold = !!rule.bold;
    cfStyleItalic = !!rule.italic;
    cfStyleUnderline = !!rule.underline;
    cfStyleStrike = !!rule.strike;
    cfStyleTextColor = rule.color || 'var(--text-primary)';
    cfStyleBgColor = rule.bg || 'transparent';
  } else {
    // 新規作成モード
    rangeInput.value = getGoogleRangeStr(editingCFType);
    opSelect.value = 'not_empty';
    valSingle.value = '';
    valMin.value = '';
    valMax.value = '';
    
    cfStyleBold = false;
    cfStyleItalic = false;
    cfStyleUnderline = false;
    cfStyleStrike = false;
    cfStyleTextColor = 'var(--text-primary)';
    cfStyleBgColor = 'transparent';
  }
  
  // ツールバーのボタン状態反映
  updateToolbarButtonState('cf-btn-bold', cfStyleBold);
  updateToolbarButtonState('cf-btn-italic', cfStyleItalic);
  updateToolbarButtonState('cf-btn-underline', cfStyleUnderline);
  updateToolbarButtonState('cf-btn-strike', cfStyleStrike);
  
  // 条件値入力欄の表示制御
  triggerOpFieldsVisibility(opSelect.value);
  
  updateCfPreview();
  
  // エディタービューを表示
  document.getElementById('cf-rules-list-view').style.display = 'none';
  document.getElementById('cf-rule-editor-view').style.display = 'flex';
  document.getElementById('cf-editor-footer').style.display = 'flex';
}

function updateToolbarButtonState(id, isActive) {
  const btn = document.getElementById(id);
  if (btn) {
    if (isActive) btn.classList.add('active');
    else btn.classList.remove('active');
  }
}

function triggerOpFieldsVisibility(op) {
  const singleGrp = document.getElementById('cf-value-single-group');
  const doubleGrp = document.getElementById('cf-value-double-group');
  
  if (op === 'between' || op === 'not_between') {
    singleGrp.style.display = 'none';
    doubleGrp.style.display = 'block';
  } else if (op === 'empty' || op === 'not_empty') {
    singleGrp.style.display = 'none';
    doubleGrp.style.display = 'none';
  } else {
    singleGrp.style.display = 'block';
    doubleGrp.style.display = 'none';
  }
}

// ルールの削除
function deleteCFRule(ruleId) {
  const rules = state.conditionalFormats[editingCFType] || [];
  const idx = rules.findIndex(r => r.id === ruleId);
  if (idx !== -1) {
    rules.splice(idx, 1);
    
    const userId = state.currentUser ? state.currentUser.id : 'guest';
    const saveKey = `SYNAPSE_CF_${editingCFType.toUpperCase()}_${userId}`;
    localStorage.setItem(saveKey, JSON.stringify(rules));
    
    renderCFRulesSidebarList();
    
    if (editingCFType === 'jo') renderJoInfo();
    else if (editingCFType === 'ap') renderApplicantInfo();
    else if (editingCFType === 'ag') renderAgencyInfo();
    
    showToast('ルールを削除しました。', 'success');
  }
}

// 完了保存処理
function saveCFRule() {
  const rangeInput = document.getElementById('cf-range-input').value.trim();
  const operator = document.getElementById('cf-rule-op').value;
  
  if (!rangeInput) {
    showToast('適用範囲を入力してください。', 'warning');
    return;
  }
  
  let val1 = '';
  let val2 = '';
  
  if (operator === 'between' || operator === 'not_between') {
    val1 = document.getElementById('cf-value-min').value.trim();
    val2 = document.getElementById('cf-value-max').value.trim();
    if (!val1 || !val2) {
      showToast('条件の範囲を入力してください。', 'warning');
      return;
    }
  } else if (operator !== 'empty' && operator !== 'not_empty') {
    val1 = document.getElementById('cf-value-single').value.trim();
    if (!val1) {
      showToast('条件の値を入力してください。', 'warning');
      return;
    }
  }
  
  if (!state.conditionalFormats[editingCFType]) {
    state.conditionalFormats[editingCFType] = [];
  }
  const rules = state.conditionalFormats[editingCFType];
  
  const ruleObj = {
    id: editingCFRuleId || Date.now().toString(),
    rangeStr: rangeInput,
    operator: operator,
    value: val1,
    value2: val2,
    bg: cfStyleBgColor,
    color: cfStyleTextColor,
    bold: cfStyleBold,
    italic: cfStyleItalic,
    underline: cfStyleUnderline,
    strike: cfStyleStrike
  };
  
  if (editingCFRuleId) {
    const idx = rules.findIndex(r => r.id === editingCFRuleId);
    if (idx !== -1) rules[idx] = ruleObj;
  } else {
    rules.push(ruleObj);
  }
  
  const userId = state.currentUser ? state.currentUser.id : 'guest';
  const saveKey = `SYNAPSE_CF_${editingCFType.toUpperCase()}_${userId}`;
  localStorage.setItem(saveKey, JSON.stringify(rules));
  
  // パネル状態をリストに戻す
  document.getElementById('cf-rules-list-view').style.display = 'flex';
  document.getElementById('cf-rule-editor-view').style.display = 'none';
  document.getElementById('cf-editor-footer').style.display = 'none';
  
  renderCFRulesSidebarList();
  
  if (editingCFType === 'jo') renderJoInfo();
  else if (editingCFType === 'ap') renderApplicantInfo();
  else if (editingCFType === 'ag') renderAgencyInfo();
  
  showToast('ルールを保存しました。', 'success');
}

// イベントリスナーのセットアップ
document.addEventListener('DOMContentLoaded', () => {
  const closeSidebarBtn = document.getElementById('close-rules-sidebar-btn');
  const sidebar = document.getElementById('conditional-formatting-sidebar');
  if (closeSidebarBtn && sidebar) {
    closeSidebarBtn.addEventListener('click', () => {
      sidebar.classList.remove('open');
    });
  }
  
  const addTrigger = document.getElementById('cf-add-new-rule-trigger');
  if (addTrigger) {
    addTrigger.addEventListener('click', () => {
      openCFEditor(null);
    });
  }
  
  const opSelect = document.getElementById('cf-rule-op');
  if (opSelect) {
    opSelect.addEventListener('change', (e) => {
      triggerOpFieldsVisibility(e.target.value);
    });
  }
  
  // 装飾ツールバーのボタン押下時
  const bindDecorBtn = (id, toggleVarSetter, varGetter) => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener('click', () => {
        const nextState = !varGetter();
        toggleVarSetter(nextState);
        updateToolbarButtonState(id, nextState);
        updateCfPreview();
      });
    }
  };
  
  bindDecorBtn('cf-btn-bold', (val) => cfStyleBold = val, () => cfStyleBold);
  bindDecorBtn('cf-btn-italic', (val) => cfStyleItalic = val, () => cfStyleItalic);
  bindDecorBtn('cf-btn-underline', (val) => cfStyleUnderline = val, () => cfStyleUnderline);
  bindDecorBtn('cf-btn-strike', (val) => cfStyleStrike = val, () => cfStyleStrike);
  
  // カラーピッカーポップアップ表示
  const textColBtn = document.getElementById('cf-sidebar-text-color-btn');
  const textColPicker = document.getElementById('cf-sidebar-text-color-picker');
  const bgColBtn = document.getElementById('cf-sidebar-bg-color-btn');
  const bgColPicker = document.getElementById('cf-sidebar-bg-color-picker');
  
  const alignPopup = (btn, picker) => {
    const rect = btn.getBoundingClientRect();
    picker.style.top = `${rect.bottom + window.scrollY + 4}px`;
    picker.style.left = `${rect.left + window.scrollX}px`;
  };
  
  if (textColBtn && textColPicker) {
    textColBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeAllColorPickersExcept(textColPicker);
      const isHidden = textColPicker.style.display === 'none' || !textColPicker.style.display;
      textColPicker.style.display = isHidden ? 'block' : 'none';
      if (isHidden) alignPopup(textColBtn, textColPicker);
    });
  }
  
  if (bgColBtn && bgColPicker) {
    bgColBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeAllColorPickersExcept(bgColPicker);
      const isHidden = bgColPicker.style.display === 'none' || !bgColPicker.style.display;
      bgColPicker.style.display = isHidden ? 'block' : 'none';
      if (isHidden) alignPopup(bgColBtn, bgColPicker);
    });
  }
  
  // 外部クリックでポップアップ閉じる
  // サイドバー設定ポップアップの制御
  const settingsBtn = document.getElementById('sidebar-settings-btn');
  const settingsPopup = document.getElementById('sidebar-settings-popup');
  if (settingsBtn && settingsPopup) {
    settingsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = settingsPopup.style.display === 'none' || !settingsPopup.style.display;
      settingsPopup.style.display = isHidden ? 'block' : 'none';
    });
  }

  // 外部クリックでポップアップ閉じる
  document.addEventListener('mousedown', (e) => {
    if (textColPicker && !textColPicker.contains(e.target) && !textColBtn.contains(e.target)) {
      textColPicker.style.display = 'none';
    }
    if (bgColPicker && !bgColPicker.contains(e.target) && !bgColBtn.contains(e.target)) {
      bgColPicker.style.display = 'none';
    }
    if (settingsPopup && !settingsPopup.contains(e.target) && !settingsBtn.contains(e.target)) {
      settingsPopup.style.display = 'none';
    }
  }, true);
  
  // キャンセル、完了ボタン
  const cancelBtn = document.getElementById('cf-cancel-btn');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      document.getElementById('cf-rules-list-view').style.display = 'flex';
      document.getElementById('cf-rule-editor-view').style.display = 'none';
      document.getElementById('cf-editor-footer').style.display = 'none';
    });
  }
  
  const saveBtn = document.getElementById('cf-save-btn');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      saveCFRule();
    });
  }

  // 外部クリックで範囲指定リセットポップアップを閉じる、およびテーブル外クリックで選択解除
  document.addEventListener('click', (e) => {
    // もしクリックされた要素がすでにDOMツリー上に存在しない場合（再レンダリングで消滅した場合）、誤判定を防ぐため何もしない
    if (!document.contains(e.target)) return;

    // 1. ポップアップを閉じる処理
    document.querySelectorAll('.reset-range-popup').forEach(popup => {
      const screenType = popup.id.split('-')[0];
      const btn = document.getElementById(`${screenType}-format-reset-btn`);
      if (btn && !btn.contains(e.target) && !popup.contains(e.target)) {
        popup.style.display = 'none';
      }
    });

    // 2. テーブル外クリックによる選択状態解除
    const isInsideTable = e.target.closest('table') || e.target.closest('.custom-table-container');
    const isInsideToolbar = e.target.closest('.toolbar-container') || e.target.closest('.format-toolbar') || e.target.closest('.table-toolbar') || e.target.closest('.action-bar-container');
    const isInsideSidebar = e.target.closest('#conditional-formatting-sidebar');
    const isInsidePopup = e.target.closest('.reset-range-popup') || e.target.closest('.color-picker-dropdown') || e.target.closest('.ct-filter-dropdown');
    const isInsideModal = e.target.closest('#custom-color-modal') || e.target.closest('.modal-overlay') || e.target.closest('.modal');
    const isInsideSettingsPopup = e.target.closest('#sidebar-settings-popup');
    
    if (!isInsideTable && !isInsideToolbar && !isInsideSidebar && !isInsidePopup && !isInsideModal && !isInsideSettingsPopup) {
      if (state.joSelectedCell || state.joSelectedRange || state.joSelectedRow !== null || state.joSelectedCol !== null) {
        state.joSelectedCell = null;
        state.joSelectedRange = null;
        state.joSelectedRow = null;
        state.joSelectedCol = null;
        renderJoInfo();
        syncJoFormatToolbar();
      }
      if (state.apSelectedCell || state.apSelectedRange || state.apSelectedRow !== null || state.apSelectedCol !== null) {
        state.apSelectedCell = null;
        state.apSelectedRange = null;
        state.apSelectedRow = null;
        state.apSelectedCol = null;
        renderApplicantInfo();
        syncApFormatToolbar();
      }
      if (state.agSelectedCell || state.agSelectedRange || state.agSelectedRow !== null || state.agSelectedCol !== null) {
        state.agSelectedCell = null;
        state.agSelectedRange = null;
        state.agSelectedRow = null;
        state.agSelectedCol = null;
        renderAgencyInfo();
        syncAgFormatToolbar();
      }
      if (state.ctSelectedCell || state.ctSelectedRange || (state.ctSelectedRows && state.ctSelectedRows.size > 0) || (state.ctSelectedCols && state.ctSelectedCols.size > 0)) {
        state.ctSelectedCell = null;
        state.ctSelectedRange = null;
        state.ctSelectedRows.clear();
        state.ctSelectedCols.clear();
        if (state.activeCustomTableId) {
          renderCustomTable(state.activeCustomTableId);
          syncCtFormatToolbar();
        }
      }
    }
  });

  initColorPickers();
  initCustomColorModalEvents();
  setupDbmakeEvents();
});

// ============================================================================
// DBmake (パートナーDB管理) 移植機能のダミーデータとコアロジック
// ============================================================================

const DEFAULT_DBMAKE_PARTNERS = [
  {
    id: "P3R4W7Y9",
    registeredName: "株式会社ABCインベストメント",
    registeredNameKana: "カブシキガイシャエービーシーインベストメント",
    representativeName: "山下 健二",
    representativeNameKana: "ヤマシタ ケンジ",
    birthday: "1975-06-20",
    phoneNumber: "03-5555-1234",
    email: "contact@abc-investment.co.jp",
    zipCode: "100-0005",
    pref: "東京都",
    city: "千代田区",
    addr1: "丸の内1-2-3",
    addr2: "丸の内ビル 15F",
    corpNum: "1010001099999",
    invoiceNum: "T1010001099999",
    reward: "紹介報酬: 15%",
    status: "ACTIVE",
    isFavorite: true,
    recordedBy: "admin",
    recordedAt: "2026-06-15T09:00:00.000Z",
    bank: "三菱UFJ銀行",
    branch: "丸の内支店",
    accType: "普通",
    accNum: "9876543",
    accHolder: "カ)エービーシーインベストメント",
    remarks: "大手紹介パートナーです。"
  },
  {
    id: "J6K5M9N7",
    registeredName: "トータルソリューションズ合同会社",
    registeredNameKana: "トータルソリューションズゴウドウガイシャ",
    representativeName: "サラ 鈴木",
    representativeNameKana: "サラ スズキ",
    birthday: "1988-11-12",
    phoneNumber: "06-6222-7777",
    email: "support@totalsolutions.net",
    zipCode: "530-0001",
    pref: "大阪府",
    city: "大阪市北区",
    addr1: "梅田3-3-3",
    addr2: "梅田タワー 20F",
    corpNum: "2020003088888",
    invoiceNum: "T2020003088888",
    reward: "マスタ報酬: 20%",
    status: "ACTIVE",
    isFavorite: false,
    recordedBy: "admin",
    recordedAt: "2026-06-20T10:30:00.000Z",
    bank: "三井住友銀行",
    branch: "梅田支店",
    accType: "普通",
    accNum: "1234567",
    accHolder: "ド)トータルソリューションズ",
    remarks: "関西地区の営業パートナー。"
  },
  {
    id: "E4H7JS6P",
    registeredName: "佐藤商事株式会社",
    registeredNameKana: "サトウショウジカブシキガイシャ",
    representativeName: "佐藤 次郎",
    representativeNameKana: "サトウ ジロウ",
    birthday: "1969-03-30",
    phoneNumber: "052-999-8888",
    email: "sato@sato-shoji.co.jp",
    zipCode: "460-0002",
    pref: "愛知県",
    city: "名古屋市中区",
    addr1: "栄2-2-2",
    addr2: "",
    corpNum: "3030002077777",
    invoiceNum: "",
    reward: "固定紹介料",
    status: "INACTIVE",
    isFavorite: false,
    recordedBy: "admin",
    recordedAt: "2026-06-25T14:00:00.000Z",
    bank: "みずほ銀行",
    branch: "名古屋支店",
    accType: "当座",
    accNum: "7654321",
    accHolder: "サトウショウジ(カ",
    remarks: "現在契約休止中。"
  },
  {
    id: "F7P3MX9W",
    registeredName: "株式会社テストコーポレーション",
    registeredNameKana: "テストコーポレーション",
    representativeName: "山田 太郎",
    representativeNameKana: "ヤマダ タロウ",
    birthday: "1980-01-15",
    phoneNumber: "090-1234-5678",
    email: "yamada@example.com",
    zipCode: "160-0023",
    pref: "東京都",
    city: "新宿区",
    addr1: "西新宿1-1-1",
    addr2: "",
    corpNum: "9010001999999",
    invoiceNum: "T9010001999999",
    reward: "マスタ報酬: JO10%",
    status: "ACTIVE",
    isFavorite: false,
    recordedBy: "admin",
    recordedAt: "2026-06-20T10:00:00.000Z",
    bank: "三井住友銀行",
    branch: "新宿支店",
    accType: "普通",
    accNum: "1234567",
    accHolder: "カ)テストコーポレーション",
    remarks: "既存顧客の山田太郎氏が運営する会社です。パートナーDBにも登録されています。"
  }
];

let dbmakePartners = [];
let dbmakeFilterFav = false;
let dbmakeDuplicateData = null;
let parsedCsvData = [];

function loadDbmakePartners() {
  const data = localStorage.getItem('synapse_dbmake_partners');
  if (data) {
    dbmakePartners = JSON.parse(data);
    let migrated = false;
    dbmakePartners.forEach(p => {
      if (p.id === 'E1001') { p.id = 'P3R4W7Y9'; migrated = true; }
      else if (p.id === 'E1002' || p.id === 'J6K2M9N5') { p.id = 'J6K5M9N7'; migrated = true; }
      else if (p.id === 'E1003' || p.id === 'H7F5Q3W2') { p.id = 'H7F5Q3WY'; migrated = true; }
    });
    if (migrated) {
      localStorage.setItem('synapse_dbmake_partners', JSON.stringify(dbmakePartners));
    }
  } else {
    dbmakePartners = [...DEFAULT_DBMAKE_PARTNERS];
    localStorage.setItem('synapse_dbmake_partners', JSON.stringify(dbmakePartners));
  }
  const userId = getUserIdSuffix();
  state.dbmakeCellStyles = JSON.parse(localStorage.getItem(`SYNAPSE_DBMAKE_CELL_STYLES${userId}`)) || {};
  state.dbmakeRowHeights = JSON.parse(localStorage.getItem(`SYNAPSE_DBMAKE_ROW_HEIGHTS${userId}`)) || {};
}

function saveDbmakePartners() {
  localStorage.setItem('synapse_dbmake_partners', JSON.stringify(dbmakePartners));
  const userId = getUserIdSuffix();
  localStorage.setItem(`SYNAPSE_DBMAKE_CELL_STYLES${userId}`, JSON.stringify(state.dbmakeCellStyles));
}

function openDbmakePage() {
  openTab('dbmake-screen', 'dbmake-screen', '🛢️ パートナーDB');
  console.log("%c[Backend DB Connection]%c Synchronized partner records from external database successfully.", "color: #10b981; font-weight: bold;", "color: inherit;");
  loadDbmakePartners();
  
  const toolbar = document.getElementById('dbmake-format-toolbar');
  if (toolbar) toolbar.style.display = 'none';
  
  renderDbmakeColumnSelector();
  renderDbmakePartners();
}

function renderDbmakePartners() {
  const listSection = document.querySelector('#dbmake-screen .list-section');
  if (listSection) {
    renderTableControlBar('dbmake', listSection);
  }

  const tbody = document.getElementById('dbmake-table-body');
  const thead = document.getElementById('dbmake-table-thead');
  if (!tbody || !thead) return;

  const searchQuery = document.getElementById('dbmake-search-input').value.trim().toLowerCase();
  const statusFilter = document.getElementById('dbmake-status-filter').value;

  const filtered = dbmakePartners.filter(p => {
    const nameMatch = p.registeredName.toLowerCase().includes(searchQuery);
    const kanaMatch = p.registeredNameKana.toLowerCase().includes(searchQuery);
    const repMatch = p.representativeName.toLowerCase().includes(searchQuery);
    const invoiceMatch = (p.invoiceNum || '').toLowerCase().includes(searchQuery);
    const emailMatch = (p.email || '').toLowerCase().includes(searchQuery);
    const searchMatch = !searchQuery || nameMatch || kanaMatch || repMatch || invoiceMatch || emailMatch;

    const statusMatch = statusFilter === 'ALL' || p.status === statusFilter;
    const favMatch = !dbmakeFilterFav || p.isFavorite;

    return searchMatch && statusMatch && favMatch;
  });

  tbody.innerHTML = '';
  thead.innerHTML = '';

  const columns = state.dbmakeColumns;
  const visibleColumnIds = state.dbmakeVisibleColumns;

  // --- 固定ウィンドウ枠 of dbmake ---
  const fixedColIds = [];
  if (state.dbmakeFixedCol !== 'none') {
    for (let i = 0; i < columns.length; i++) {
      const col = columns[i];
      if (visibleColumnIds.includes(col.id)) {
        fixedColIds.push(col.id);
        if (col.id === state.dbmakeFixedCol) {
          break;
        }
      }
    }
  }

  const leftPosMap = {};
  let currentLeft = 50; // 行番号列
  if (fixedColIds.length > 0) {
    fixedColIds.forEach(colId => {
      leftPosMap[colId] = currentLeft;
      const w = state.dbmakeColumnWidths[colId] || 120;
      currentLeft += w;
    });
  }

  const fixedRowLimit = state.dbmakeFixedRow !== 'none' ? parseInt(state.dbmakeFixedRow, 10) : 0;
  const topPosMap = {};
  let currentTop = 54; // ヘッダーの高さ (列記号24px + カラム名30px)
  if (fixedRowLimit > 0) {
    for (let r = 0; r < fixedRowLimit; r++) {
      topPosMap[r] = currentTop;
      const rHeight = state.dbmakeRowHeights[r] || 30;
      currentTop += rHeight;
    }
  }

  // --- ヘッダー生成 (A, B, C... 行 と カラム名行) ---
  const lettersRow = document.createElement('tr');
  lettersRow.style.height = '24px';
  lettersRow.style.backgroundColor = 'var(--bg-surface-elevated)';

  // 行番号ヘッダーセル
  const isAllSelected = state.dbmakeSelectedRows.size > 0 && state.dbmakeSelectedRows.size === filtered.length;
  const cornerTh = document.createElement('th');
  cornerTh.className = 'row-number-col header-corner' + (isAllSelected ? ' active-row-header' : '');
  cornerTh.style.width = '50px';
  cornerTh.style.height = '24px';
  cornerTh.style.position = 'sticky';
  cornerTh.style.left = '0px';
  cornerTh.style.top = '0px';
  cornerTh.style.zIndex = '30';
  cornerTh.style.borderRight = '1px solid var(--border-color)';
  cornerTh.style.borderBottom = '1px solid var(--border-color)';
  cornerTh.style.cursor = 'pointer';
  cornerTh.addEventListener('click', (e) => {
    e.stopPropagation();
    state.dbmakeSelectedCell = null;
    state.dbmakeSelectedRange = null;
    state.dbmakeSelectedRows.clear();
    state.dbmakeSelectedCols.clear();
    state.dbmakeSelectedCells.clear();
    
    const tbody = document.getElementById('dbmake-table-body');
    if (tbody) {
      const rows = tbody.querySelectorAll('tr');
      rows.forEach((_, idx) => {
        state.dbmakeSelectedRows.add(idx);
      });
    }
    
    renderDbmakePartners();
    syncDbmakeFormatToolbar();
  });
  lettersRow.appendChild(cornerTh);

  // アルファベット列記号の追加
  let colIndex = 0;
  columns.forEach(col => {
    if (visibleColumnIds.includes(col.id)) {
      const th = document.createElement('th');
      th.style.textAlign = 'center';
      th.style.fontSize = '0.7rem';
      th.style.fontWeight = 'bold';
      th.style.color = 'var(--text-muted)';
      th.style.borderRight = '1px solid var(--border-color)';
      th.style.borderBottom = '1px solid var(--border-color)';
      th.style.position = 'sticky';
      th.style.top = '0px';
      th.style.zIndex = '20';
      th.style.backgroundColor = 'var(--bg-surface-elevated)';

      if (fixedColIds.includes(col.id)) {
        th.style.left = `${leftPosMap[col.id]}px`;
        th.style.zIndex = '25';
      }
      
      const w = state.dbmakeColumnWidths[col.id] || 120;
      th.style.width = `${w}px`;
      th.style.maxWidth = `${w}px`;
      th.style.minWidth = `${w}px`;

      th.textContent = getColumnLetter(colIndex++);
      
      // 列選択イベント
      th.style.cursor = 'pointer';
      const currentColId = col.id;
      th.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return; // 左クリックのみ
        e.stopPropagation();
        state.isSelectingCols = true;
        if (!e.ctrlKey && !e.metaKey) {
          state.dbmakeSelectedCell = null;
          state.dbmakeSelectedRange = null;
          state.dbmakeSelectedRows.clear();
          state.dbmakeSelectedCells.clear();
        }

        if (e.ctrlKey || e.metaKey) {
          // 非連続
          if (state.dbmakeSelectedCols.has(currentColId)) {
            state.dbmakeSelectedCols.delete(currentColId);
          } else {
            state.dbmakeSelectedCols.add(currentColId);
          }
        } else if (e.shiftKey && state.dbmakeLastSelectedCol) {
          // 連続
          const visibleCols = columns.filter(c => visibleColumnIds.includes(c.id));
          const startIdx = visibleCols.findIndex(c => c.id === state.dbmakeLastSelectedCol);
          const endIdx = visibleCols.findIndex(c => c.id === currentColId);
          if (startIdx !== -1 && endIdx !== -1) {
            state.dbmakeSelectedCols.clear();
            const minIdx = Math.min(startIdx, endIdx);
            const maxIdx = Math.max(startIdx, endIdx);
            for (let i = minIdx; i <= maxIdx; i++) {
              state.dbmakeSelectedCols.add(visibleCols[i].id);
            }
          }
        } else {
          // 単一選択
          state.dbmakeSelectedCols.clear();
          state.dbmakeSelectedCols.add(currentColId);
        }
        state.dbmakeLastSelectedCol = currentColId;
        renderDbmakePartners();
        syncDbmakeFormatToolbar();
      });

      th.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (window.logToDebugPanel) {
          window.logToDebugPanel(`contextmenu (dbmake lettersRow th): col.id=${col.id}`, '#ffd700');
        }
        showCtContextMenu(e.clientX, e.clientY, { id: 'dbmake', name: 'パートナーDB', columns: state.dbmakeColumns }, 'col', col.id);
      });

      th.addEventListener('mouseenter', () => {
        if (state.isSelectingCols && state.dbmakeLastSelectedCol) {
          const visibleCols = columns.filter(c => visibleColumnIds.includes(c.id));
          const startIdx = visibleCols.findIndex(c => c.id === state.dbmakeLastSelectedCol);
          const endIdx = visibleCols.findIndex(c => c.id === currentColId);
          if (startIdx !== -1 && endIdx !== -1) {
            state.dbmakeSelectedCols.clear();
            const minIdx = Math.min(startIdx, endIdx);
            const maxIdx = Math.max(startIdx, endIdx);
            for (let i = minIdx; i <= maxIdx; i++) {
              state.dbmakeSelectedCols.add(visibleCols[i].id);
            }
            renderDbmakePartners();
          }
        }
      });

      if (state.dbmakeSelectedCols.has(col.id) || isAllSelected) {
        th.classList.add('active-col-header');
      }

      lettersRow.appendChild(th);
    }
  });
  thead.appendChild(lettersRow);

  // 通常のカラム名行の追加
  const namesRow = document.createElement('tr');
  namesRow.style.height = '30px';
  namesRow.style.backgroundColor = 'var(--bg-surface-elevated)';

  const namesCornerTh = document.createElement('th');
  namesCornerTh.className = 'row-number-col' + (isAllSelected ? ' active-row-header' : '');
  namesCornerTh.style.width = '50px';
  namesCornerTh.style.height = '30px';
  namesCornerTh.style.position = 'sticky';
  namesCornerTh.style.left = '0px';
  namesCornerTh.style.top = '24px';
  namesCornerTh.style.zIndex = '30';
  namesCornerTh.style.borderRight = '1px solid var(--border-color)';
  namesCornerTh.style.borderBottom = '1px solid var(--border-color)';
  namesCornerTh.style.cursor = 'pointer';
  namesCornerTh.addEventListener('click', (e) => {
    e.stopPropagation();
    state.dbmakeSelectedCell = null;
    state.dbmakeSelectedRange = null;
    state.dbmakeSelectedRows.clear();
    state.dbmakeSelectedCols.clear();
    state.dbmakeSelectedCells.clear();
    
    const tbody = document.getElementById('dbmake-table-body');
    if (tbody) {
      const rows = tbody.querySelectorAll('tr');
      rows.forEach((_, idx) => {
        state.dbmakeSelectedRows.add(idx);
      });
    }
    
    renderDbmakePartners();
    syncDbmakeFormatToolbar();
  });
  namesRow.appendChild(namesCornerTh);

  columns.forEach(col => {
    if (visibleColumnIds.includes(col.id)) {
      const th = document.createElement('th');
      th.style.padding = '0.3rem 0.6rem';
      th.style.fontSize = '0.75rem';
      th.style.fontWeight = '600';
      th.style.color = 'var(--text-secondary)';
      th.style.borderRight = '1px solid var(--border-color)';
      th.style.borderBottom = '1px solid var(--border-color)';
      th.style.position = 'sticky';
      th.style.top = '24px';
      th.style.zIndex = '20';
      th.style.backgroundColor = 'var(--bg-surface-elevated)';
      th.setAttribute('data-col-id', col.id);

      if (fixedColIds.includes(col.id)) {
        th.style.left = `${leftPosMap[col.id]}px`;
        th.style.zIndex = '25';
      }

      const w = state.dbmakeColumnWidths[col.id] || 120;
      th.style.width = `${w}px`;
      th.style.maxWidth = `${w}px`;
      th.style.minWidth = `${w}px`;

      th.textContent = col.name;

      th.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (window.logToDebugPanel) {
          window.logToDebugPanel(`contextmenu (dbmake namesRow th): col.id=${col.id}`, '#ffd700');
        }
        showCtContextMenu(e.clientX, e.clientY, { id: 'dbmake', name: 'パートナーDB', columns: state.dbmakeColumns }, 'col', col.id);
      });

      // リサイザー初期化
      initDbmakeColumnResize(th, col.id);

      namesRow.appendChild(th);
    }
  });
  thead.appendChild(namesRow);

  // --- ボディ行生成 ---

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="${visibleColumnIds.length + 1}" style="text-align: center; padding: 2rem; color: var(--text-muted);">該当するパートナー企業が見つかりません。</td></tr>`;
    return;
  }

  filtered.forEach((p, index) => {
    const tr = document.createElement('tr');
    tr.setAttribute('data-row-id', p.id);
    tr.style.borderBottom = '1px solid var(--border-color)';
    const rowHeight = state.dbmakeRowHeights[index] || 30;
    tr.style.height = `${rowHeight}px`;
    tr.style.maxHeight = `${rowHeight}px`;
    tr.style.minHeight = `${rowHeight}px`;

    // 行番号セル
    const rowNumTd = document.createElement('td');
    rowNumTd.className = 'row-number-col';
    rowNumTd.textContent = index + 1;
    rowNumTd.style.height = `${rowHeight}px`;
    rowNumTd.style.lineHeight = `${rowHeight}px`;
    rowNumTd.style.padding = '0';
    rowNumTd.style.fontSize = '0.75rem';
    rowNumTd.style.backgroundColor = 'var(--bg-surface-elevated)';

    if (fixedColIds.length > 0) {
      rowNumTd.style.position = 'sticky';
      rowNumTd.style.left = '0px';
      rowNumTd.style.zIndex = '12';
    }
    if (index < fixedRowLimit) {
      rowNumTd.style.position = 'sticky';
      rowNumTd.style.top = `${topPosMap[index]}px`;
      rowNumTd.style.zIndex = fixedColIds.length > 0 ? '14' : '13';
    }

    if (state.dbmakeSelectedRows.has(index)) {
      rowNumTd.classList.add('active-row-header');
    }

    // 行選択イベント
    rowNumTd.style.cursor = 'pointer';
    rowNumTd.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return; // 左クリックのみ
      e.stopPropagation();
      state.isSelectingRows = true;

      const currentRowIdx = index;
      if (e.ctrlKey || e.metaKey) {
        // Ctrl: 他の選択を維持してトグル
        if (state.dbmakeSelectedRows.has(currentRowIdx)) {
          state.dbmakeSelectedRows.delete(currentRowIdx);
        } else {
          state.dbmakeSelectedRows.add(currentRowIdx);
        }
      } else if (e.shiftKey && state.dbmakeLastSelectedRow !== null) {
        // Shift: 連続選択
        state.dbmakeSelectedRows.clear();
        state.dbmakeSelectedCols.clear();
        state.dbmakeSelectedCells.clear();
        state.dbmakeSelectedCell = null;
        state.dbmakeSelectedRange = null;

        const minR = Math.min(state.dbmakeLastSelectedRow, currentRowIdx);
        const maxR = Math.max(state.dbmakeLastSelectedRow, currentRowIdx);
        for (let r = minR; r <= maxR; r++) {
          state.dbmakeSelectedRows.add(r);
        }
      } else {
        // 通常
        state.dbmakeSelectedCell = null;
        state.dbmakeSelectedRange = null;
        state.dbmakeSelectedCols.clear();
        state.dbmakeSelectedCells.clear();
        state.dbmakeSelectedRows.clear();
        state.dbmakeSelectedRows.add(currentRowIdx);
      }
      state.dbmakeLastSelectedRow = currentRowIdx;
      renderDbmakePartners();
      syncDbmakeFormatToolbar();
    });

    rowNumTd.addEventListener('mouseenter', () => {
      if (state.isSelectingRows && state.dbmakeLastSelectedRow !== null) {
        state.dbmakeSelectedRows.clear();
        const minR = Math.min(state.dbmakeLastSelectedRow, index);
        const maxR = Math.max(state.dbmakeLastSelectedRow, index);
        for (let r = minR; r <= maxR; r++) {
          state.dbmakeSelectedRows.add(r);
        }
        renderDbmakePartners();
      }
    });
    initDbmakeRowResize(rowNumTd, index);

    rowNumTd.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const currentHeight = state.dbmakeRowHeights[index] || 30;
      const isTargetInSelection = state.dbmakeSelectedRows.has(index);
      const targetRows = isTargetInSelection ? Array.from(state.dbmakeSelectedRows) : [index];
      const label = isTargetInSelection ? `選択された ${targetRows.length} 行` : `行 [ ${index + 1} ]`;
      const newHeightStr = prompt(`${label} の高さを入力してください (px):`, currentHeight);
      if (newHeightStr !== null) {
        const newHeight = parseInt(newHeightStr, 10);
        if (!isNaN(newHeight) && newHeight >= 15) {
          targetRows.forEach(rIdx => {
            state.dbmakeRowHeights[rIdx] = newHeight;
          });
          const userId = getUserIdSuffix();
          localStorage.setItem(`SYNAPSE_DBMAKE_ROW_HEIGHTS${userId}`, JSON.stringify(state.dbmakeRowHeights));
          renderDbmakePartners();
          showToast(`${label} の高さを ${newHeight}px に設定しました。`, 'success');
        } else {
          showToast('無効な数値です（15px以上の数値を入力してください）。', 'error');
        }
      }
    });

    tr.appendChild(rowNumTd);

    let vColIdx = 0;
    columns.forEach(col => {
      if (visibleColumnIds.includes(col.id)) {
        let val = p[col.id] || '';
        if (col.id === 'recordedAt' && val) {
          val = new Date(val).toLocaleDateString('ja-JP');
        }
        if (col.id === 'status') {
          val = val === 'ACTIVE' ? '稼働中' : '停止中';
        }

        const td = document.createElement('td');
        td.style.padding = '0.3rem 0.6rem';
        td.style.height = `${rowHeight}px`;
        td.style.maxHeight = `${rowHeight}px`;
        td.style.minHeight = `${rowHeight}px`;
        td.style.boxSizing = 'border-box';
        td.style.fontSize = '0.8rem';
        td.style.borderRight = '1px solid var(--border-color)';
        td.style.borderBottom = '1px solid var(--border-color)';
        td.setAttribute('data-col-id', col.id);
        td.setAttribute('data-partner-id', p.id);

        const w = state.dbmakeColumnWidths[col.id] || 120;
        td.style.width = `${w}px`;
        td.style.maxWidth = `${w}px`;
        td.style.minWidth = `${w}px`;

        let isSticky = false;
        if (fixedColIds.includes(col.id)) {
          td.style.position = 'sticky';
          td.style.left = `${leftPosMap[col.id]}px`;
          td.style.zIndex = '10';
          isSticky = true;
        }
        if (index < fixedRowLimit) {
          td.style.position = 'sticky';
          td.style.top = `${topPosMap[index]}px`;
          td.style.zIndex = isSticky ? '14' : '9';
          isSticky = true;
        }

        // 書式スタイルの取得と適用
        const cellKey = `${p.id}_${col.id}`;
        const styleObj = getCellFormatStyles('dbmake', p.id, col.id, p, val);

        applyInlineStylesToCell(td, styleObj);

        if (styleObj['background-color']) {
          td.style.backgroundColor = styleObj['background-color'];
        } else {
          td.style.backgroundColor = 'var(--bg-surface)';
        }

        td.title = String(val);

        // 特定カラムの特別レンダリング
        if (col.id === 'id') {
          // 企業コード＋お気に入りスター＋編集削除アクション
          td.style.fontFamily = 'monospace';
          td.style.fontWeight = 'bold';
          td.style.display = 'flex';
          td.style.alignItems = 'center';
          td.style.justifyContent = 'space-between';
          
          const starClass = p.isFavorite ? 'active' : '';
          const starChar = p.isFavorite ? '★' : '☆';
           td.innerHTML = `
            <span class="dbmake-id-text" data-id="${val}" style="cursor: pointer; text-decoration: underline; color: var(--primary);" title="クリックして企業コードをコピー">${val}</span>
            <div style="display: flex; gap: 4px; align-items: center; user-select: none;">
              <span class="fav-star ${starClass}" style="font-size: 0.95rem; cursor: default; opacity: 0.7;">${starChar}</span>
            </div>
          `;

          const idSpan = td.querySelector('.dbmake-id-text');
          if (idSpan) {
            idSpan.addEventListener('click', (e) => {
              e.stopPropagation();
              navigator.clipboard.writeText(val).then(() => {
                showToast(`企業コード ${val} をコピーしました。`, 'success');
              });
            });
          }
        } else {
          let isDropdownRendered = renderMasterDropdownCellMarkup(td, val, col, styleObj);
          if (!isDropdownRendered) {
            if (col.id === 'status') {
              td.innerHTML = `<span class="dbmake-status-badge ${p.status === 'ACTIVE' ? 'active' : 'inactive'}">${val}</span>`;
              if (styleObj['background-color']) {
                const badge = td.querySelector('.dbmake-status-badge');
                if (badge) badge.style.backgroundColor = styleObj['background-color'];
              }
            } else {
              td.textContent = val;
            }
          }
        }

        // 行・列選択のハイライト
        if (state.dbmakeSelectedRows.has(index)) {
          td.classList.add('selected-row-cell');
        }
        if (state.dbmakeSelectedCols.has(col.id)) {
          td.classList.add('selected-col-cell');
        }

        // 範囲選択枠のクラス付与
        let inRange = false;
        if (state.dbmakeSelectedRange) {
          const minR = Math.min(state.dbmakeSelectedRange.startRow, state.dbmakeSelectedRange.endRow);
          const maxR = Math.max(state.dbmakeSelectedRange.startRow, state.dbmakeSelectedRange.endRow);
          const minC = Math.min(state.dbmakeSelectedRange.startCol, state.dbmakeSelectedRange.endCol);
          const maxC = Math.max(state.dbmakeSelectedRange.startCol, state.dbmakeSelectedRange.endCol);

          if (index >= minR && index <= maxR && vColIdx >= minC && vColIdx <= maxC) {
            inRange = true;
            td.classList.add('selected-range');
            
            // 四辺の境界線スタイルクラス
            if (index === minR) td.classList.add('sel-top');
            if (index === maxR) td.classList.add('sel-bottom');
            if (vColIdx === minC) td.classList.add('sel-left');
            if (vColIdx === maxC) td.classList.add('sel-right');
          }
        }

        const currentCellKey = `${p.id}_${col.id}`;
        const isCurrentCell = (state.dbmakeSelectedCell && 
                               state.dbmakeSelectedCell.partnerId === p.id && 
                               state.dbmakeSelectedCell.colId === col.id) ||
                              state.dbmakeSelectedCells.has(currentCellKey);
        if (isCurrentCell) {
          td.classList.add('selected-cell');
        }

        // --- マウスイベントハンドラ (ドラッグ選択用) ---
        const cellColIdx = vColIdx;
        td.addEventListener('mousedown', (e) => {
          if (e.target.closest('input') || e.target.closest('button') || e.target.closest('.fav-star')) return;
          e.stopPropagation();

          const isSelect = col.type === 'select' || (col.choices && col.choices.length > 0);
          if (isSelect) {
            startMasterDropdownEdit(td, val, col, p, index, 'dbmake');
            return;
          }

          const cellKey = `${p.id}_${col.id}`;

          if (e.ctrlKey || e.metaKey) {
            // Ctrl: 非連続
            if (state.dbmakeSelectedCells.has(cellKey)) {
              state.dbmakeSelectedCells.delete(cellKey);
            } else {
              state.dbmakeSelectedCells.add(cellKey);
            }
            state.dbmakeSelectedCell = { row: index, col: cellColIdx, colId: col.id, partnerId: p.id };
            state.dbmakeSelectedRange = null;
          } else {
            state.isSelecting = true;
            state.dbmakeSelectedCell = { row: index, col: cellColIdx, colId: col.id, partnerId: p.id };
            state.dbmakeSelectedRange = { startRow: index, startCol: cellColIdx, endRow: index, endCol: cellColIdx };
            state.dbmakeSelectedRow = null;
            state.dbmakeSelectedCol = null;
            state.dbmakeSelectedRows.clear();
            state.dbmakeSelectedCols.clear();
            state.dbmakeSelectedCells.clear();
            state.dbmakeSelectedCells.add(cellKey);

            // 他のシートの選択をクリア
            state.joSelectedCell = null; state.joSelectedRange = null; state.joSelectedCells.clear();
            state.apSelectedCell = null; state.apSelectedRange = null; state.apSelectedCells.clear();
            state.agSelectedCell = null; state.agSelectedRange = null; state.agSelectedCells.clear();
          }

          renderDbmakePartners();
          syncDbmakeFormatToolbar();
        });

        td.addEventListener('mouseenter', () => {
          if (state.isSelecting && state.dbmakeSelectedRange) {
            state.dbmakeSelectedRange.endRow = index;
            state.dbmakeSelectedRange.endCol = cellColIdx;
            renderDbmakePartners();
          }
        });

        td.addEventListener('click', (e) => {
          e.stopPropagation();
          const isSelect = col.type === 'select' || (col.choices && col.choices.length > 0);
          if (isSelect) {
            if (isTableLocked('dbmake')) return;
            startMasterDropdownEdit(td, val, col, p, index, 'dbmake');
          }
        });

        td.addEventListener('dblclick', (e) => {
          if (!isTableLocked('dbmake')) {
            startMasterCellEdit(td, val, col, p, index, 'dbmake');
          } else {
            td.classList.toggle('cell-expanded');
          }
        });


        tr.appendChild(td);
        vColIdx++;
      }
    });
    tbody.appendChild(tr);
  });

  // Write/Edit events are disabled in read-only mode
  updateSelectionStatsWidget();
  adjustOverflowCells(document.querySelector('#partners-db-screen .spreadsheet-table'));
}

function initDbmakeColumnResize(th, colId) {
  const resizer = document.createElement('div');
  resizer.className = 'column-resizer';
  resizer.style.zIndex = '50';
  th.appendChild(resizer);

  resizer.addEventListener('mousedown', (e) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.pageX;
    const startWidth = th.offsetWidth;

    const onMouseMove = (moveEvent) => {
      const newWidth = Math.max(50, startWidth + (moveEvent.pageX - startX));
      state.dbmakeColumnWidths[colId] = newWidth;

      const ths = document.querySelectorAll(`#dbmake-spreadsheet-table th[data-col-id="${colId}"]`);
      const tds = document.querySelectorAll(`#dbmake-spreadsheet-table td[data-col-id="${colId}"]`);

      ths.forEach(el => {
        el.style.width = `${newWidth}px`;
        el.style.maxWidth = `${newWidth}px`;
        el.style.minWidth = `${newWidth}px`;
      });
      tds.forEach(el => {
        el.style.width = `${newWidth}px`;
        el.style.maxWidth = `${newWidth}px`;
        el.style.minWidth = `${newWidth}px`;
      });
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      const userId = getUserIdSuffix();
      localStorage.setItem(`SYNAPSE_DBMAKE_COL_WIDTHS${userId}`, JSON.stringify(state.dbmakeColumnWidths));
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
}

function initDbmakeRowResize(el, rowIndex) {
  const resizer = document.createElement('div');
  resizer.className = 'row-resizer';
  resizer.style.zIndex = '50';
  el.style.position = 'relative';
  el.appendChild(resizer);

  resizer.addEventListener('mousedown', (e) => {
    e.preventDefault();
    e.stopPropagation();

    const startY = e.pageY;
    const startHeight = el.offsetHeight;

    const onMouseMove = (moveEvent) => {
      const newHeight = Math.max(20, startHeight + (moveEvent.pageY - startY));
      state.dbmakeRowHeights[rowIndex] = newHeight;

      const tr = el.parentElement;
      if (tr) {
        tr.style.height = `${newHeight}px`;
        tr.style.maxHeight = `${newHeight}px`;
        tr.style.minHeight = `${newHeight}px`;
        
        Array.from(tr.children).forEach(cell => {
          cell.style.height = `${newHeight}px`;
          cell.style.maxHeight = `${newHeight}px`;
          cell.style.minHeight = `${newHeight}px`;
        });
      }
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      const userId = getUserIdSuffix();
      localStorage.setItem(`SYNAPSE_DBMAKE_ROW_HEIGHTS${userId}`, JSON.stringify(state.dbmakeRowHeights));
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
}

function syncDbmakeFormatToolbar() {
  const toolbar = document.getElementById('dbmake-format-toolbar');
  if (!toolbar) return;

  const boldBtn = document.getElementById('dbmake-text-bold');
  const italicBtn = document.getElementById('dbmake-text-italic');
  const strikeBtn = document.getElementById('dbmake-text-strike');
  const alignLeft = document.getElementById('dbmake-align-left');
  const alignCenter = document.getElementById('dbmake-align-center');
  const alignRight = document.getElementById('dbmake-align-right');
  const valignTop = document.getElementById('dbmake-valign-top');
  const valignMiddle = document.getElementById('dbmake-valign-middle');
  const valignBottom = document.getElementById('dbmake-valign-bottom');
  const sizeInput = document.getElementById('dbmake-font-size-input');

  if (!state.dbmakeSelectedCell) return;

  const cellKey = `${state.dbmakeSelectedCell.partnerId}_${state.dbmakeSelectedCell.colId}`;
  const styles = state.dbmakeCellStyles[cellKey] || {};

  if (boldBtn) boldBtn.classList.toggle('active', styles.fontWeight === 'bold');
  if (italicBtn) italicBtn.classList.toggle('active', styles.fontStyle === 'italic');
  if (strikeBtn) strikeBtn.classList.toggle('active', styles.textDecoration === 'line-through');
  if (sizeInput) sizeInput.value = styles.fontSize ? parseInt(styles.fontSize, 10) : 10;

  if (alignLeft) alignLeft.classList.toggle('active', styles.textAlign === 'left');
  if (alignCenter) alignCenter.classList.toggle('active', styles.textAlign === 'center');
  if (alignRight) alignRight.classList.toggle('active', styles.textAlign === 'right');

  if (valignTop) valignTop.classList.toggle('active', styles.verticalAlign === 'top');
  if (valignMiddle) valignMiddle.classList.toggle('active', styles.verticalAlign === 'middle');
  if (valignBottom) valignBottom.classList.toggle('active', styles.verticalAlign === 'bottom');
}

function applyDbmakeStyle(property, value) {
  if (!state.dbmakeSelectedCell && !state.dbmakeSelectedRange && (!state.dbmakeSelectedRows || state.dbmakeSelectedRows.size === 0) && (!state.dbmakeSelectedCols || state.dbmakeSelectedCols.size === 0)) return;

  const applyToCell = (partnerId, colId) => {
    const cellKey = `${partnerId}_${colId}`;
    if (!state.dbmakeCellStyles[cellKey]) {
      state.dbmakeCellStyles[cellKey] = {};
    }
    const current = state.dbmakeCellStyles[cellKey][property];
    if (current === value) {
      delete state.dbmakeCellStyles[cellKey][property];
    } else {
      state.dbmakeCellStyles[cellKey][property] = value;
    }
  };

  const searchQuery = document.getElementById('dbmake-search-input').value.trim().toLowerCase();
  const statusFilter = document.getElementById('dbmake-status-filter').value;
  const filtered = dbmakePartners.filter(p => {
    const nameMatch = p.registeredName.toLowerCase().includes(searchQuery);
    const kanaMatch = p.registeredNameKana.toLowerCase().includes(searchQuery);
    const repMatch = p.representativeName.toLowerCase().includes(searchQuery);
    const invoiceMatch = (p.invoiceNum || '').toLowerCase().includes(searchQuery);
    const emailMatch = (p.email || '').toLowerCase().includes(searchQuery);
    const searchMatch = !searchQuery || nameMatch || kanaMatch || repMatch || invoiceMatch || emailMatch;
    const statusMatch = statusFilter === 'ALL' || p.status === statusFilter;
    const favMatch = !dbmakeFilterFav || p.isFavorite;
    return searchMatch && statusMatch && favMatch;
  });

  if (state.dbmakeSelectedRows && state.dbmakeSelectedRows.size > 0) {
    state.dbmakeSelectedRows.forEach(rIdx => {
      const partner = filtered[rIdx];
      if (partner) {
        state.dbmakeVisibleColumns.forEach(colId => {
          applyToCell(partner.id, colId);
        });
      }
    });
  } else if (state.dbmakeSelectedCols && state.dbmakeSelectedCols.size > 0) {
    state.dbmakeSelectedCols.forEach(colId => {
      filtered.forEach(partner => {
        applyToCell(partner.id, colId);
      });
    });
  } else if (state.dbmakeSelectedRange) {
    const minR = Math.min(state.dbmakeSelectedRange.startRow, state.dbmakeSelectedRange.endRow);
    const maxR = Math.max(state.dbmakeSelectedRange.startRow, state.dbmakeSelectedRange.endRow);
    const minC = Math.min(state.dbmakeSelectedRange.startCol, state.dbmakeSelectedRange.endCol);
    const maxC = Math.max(state.dbmakeSelectedRange.startCol, state.dbmakeSelectedRange.endCol);

    for (let r = minR; r <= maxR; r++) {
      const partner = filtered[r];
      if (partner) {
        for (let c = minC; c <= maxC; c++) {
          const colId = state.dbmakeVisibleColumns[c];
          if (colId) applyToCell(partner.id, colId);
        }
      }
    }
  } else if (state.dbmakeSelectedCell) {
    applyToCell(state.dbmakeSelectedCell.partnerId, state.dbmakeSelectedCell.colId);
  }

  saveDbmakePartners();
  renderDbmakePartners();
  syncDbmakeFormatToolbar();
}

function openDbmakePartnerModal(id = null) {
  const modal = document.getElementById('dbmake-partner-modal');
  const title = document.getElementById('dbmake-partner-modal-title');
  const form = document.getElementById('dbmake-partner-form');

  if (!modal || !form) return;

  form.reset();
  document.getElementById('dbmake-partner-id').value = '';

  modal.querySelectorAll('.modal-tab-btn').forEach(btn => btn.classList.remove('active'));
  modal.querySelectorAll('.modal-tab-content').forEach(content => content.style.display = 'none');
  modal.querySelector('.modal-tab-btn[data-target="dbmake-tab-basic"]').classList.add('active');
  document.getElementById('dbmake-tab-basic').style.display = 'block';

  if (id) {
    title.textContent = 'パートナー情報の編集';
    const p = dbmakePartners.find(x => x.id === id);
    if (p) {
      document.getElementById('dbmake-partner-id').value = p.id;
      document.getElementById('dbmake-partner-name').value = p.registeredName;
      document.getElementById('dbmake-partner-name-kana').value = p.registeredNameKana;
      document.getElementById('dbmake-partner-rep').value = p.representativeName;
      document.getElementById('dbmake-partner-status').value = p.status;
      document.getElementById('dbmake-partner-phone').value = p.phoneNumber || '';
      document.getElementById('dbmake-partner-email').value = p.email || '';
      document.getElementById('dbmake-partner-corpnum').value = p.corpNum || '';
      document.getElementById('dbmake-partner-invoicenum').value = p.invoiceNum || '';
      document.getElementById('dbmake-partner-zip').value = p.zipCode || '';
      document.getElementById('dbmake-partner-pref').value = p.pref || '';
      document.getElementById('dbmake-partner-city').value = p.city || '';
      document.getElementById('dbmake-partner-addr1').value = p.addr1 || '';
      document.getElementById('dbmake-partner-addr2').value = p.addr2 || '';
      document.getElementById('dbmake-partner-bank').value = p.bank || '';
      document.getElementById('dbmake-partner-branch').value = p.branch || '';
      document.getElementById('dbmake-partner-acctype').value = p.accType || '普通';
      document.getElementById('dbmake-partner-accnum').value = p.accNum || '';
      document.getElementById('dbmake-partner-accholder').value = p.accHolder || '';
      document.getElementById('dbmake-partner-reward').value = p.reward || '';
      document.getElementById('dbmake-partner-remarks').value = p.remarks || '';
    }
  } else {
    title.textContent = '新規パートナー企業登録';
  }

  modal.classList.add('active');
}

function checkDuplicates(name, corpNum, excludeId = null) {
  return dbmakePartners.filter(p => {
    if (excludeId && p.id === excludeId) return false;
    const nameMatch = name && p.registeredName.trim() === name.trim();
    const corpNumMatch = corpNum && p.corpNum && p.corpNum.trim() === corpNum.trim();
    return nameMatch || corpNumMatch;
  });
}

function savePartnerData(data) {
  const idx = dbmakePartners.findIndex(x => x.id === data.id);
  if (idx !== -1) {
    dbmakePartners[idx] = {
      ...dbmakePartners[idx],
      ...data,
      recordedBy: state.currentUser ? state.currentUser.id : 'admin',
      recordedAt: new Date().toISOString()
    };
  } else {
    dbmakePartners.push({
      ...data,
      isFavorite: false,
      recordedBy: state.currentUser ? state.currentUser.id : 'admin',
      recordedAt: new Date().toISOString()
    });
  }
  saveDbmakePartners();
  renderDbmakePartners();
  showToast('パートナー情報を保存しました。', 'success');
  document.getElementById('dbmake-partner-modal').classList.remove('active');
}

function showDuplicateModal(duplicateList, dataToSave) {
  const modal = document.getElementById('dbmake-duplicate-modal');
  const listContainer = document.getElementById('dbmake-dup-list');
  if (!modal || !listContainer) return;

  listContainer.innerHTML = '';
  duplicateList.forEach(p => {
    const card = document.createElement('div');
    card.className = 'dbmake-dup-card';
    card.innerHTML = `
      <h4>${p.registeredName} (コード: ${p.id})</h4>
      <p>代表者: ${p.representativeName} | 法人番号: ${p.corpNum || '未登録'}</p>
      <p>メール: ${p.email || '未登録'} | 電話: ${p.phoneNumber || '未登録'}</p>
    `;
    listContainer.appendChild(card);
  });

  dbmakeDuplicateData = dataToSave;
  modal.classList.add('active');
}

function parseCSV(text) {
  const lines = [];
  let row = [""];
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i+1];

    if (inQuotes) {
      if (c === '"') {
        if (next === '"') {
          row[row.length - 1] += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        row[row.length - 1] += c;
      }
    } else {
      if (c === '"') {
        inQuotes = true;
      } else if (c === ',') {
        row.push("");
      } else if (c === '\r' || c === '\n') {
        lines.push(row);
        row = [""];
        if (c === '\r' && next === '\n') {
          i++;
        }
      } else {
        row[row.length - 1] += c;
      }
    }
  }
  if (row.length > 1 || row[0] !== "") {
    lines.push(row);
  }
  return lines;
}

function processCSVFile(file) {
  const reader = new FileReader();
  reader.onload = function(e) {
    const text = e.target.result;
    const rows = parseCSV(text);

    const errorContainer = document.getElementById('dbmake-csv-error-container');
    const errorList = document.getElementById('dbmake-csv-error-list');
    const importBtn = document.getElementById('dbmake-csv-modal-import');

    errorList.innerHTML = '';
    errorContainer.style.display = 'none';
    importBtn.disabled = true;
    parsedCsvData = [];

    if (rows.length < 2) {
      errorList.innerHTML = '<li>CSVファイルが空か、ヘッダー行しかありません。</li>';
      errorContainer.style.display = 'block';
      return;
    }

    const errors = [];
    const tempParsed = [];

    rows.slice(1).forEach((row, index) => {
      if (row.length === 1 && row[0] === "") return;

      const rowNum = index + 2;
      
      const pName = row[0] ? row[0].trim() : '';
      const pKana = row[1] ? row[1].trim() : '';
      const pRep = row[2] ? row[2].trim() : '';
      const pPhone = row[3] ? row[3].trim() : '';
      const pEmail = row[4] ? row[4].trim() : '';
      const pCorp = row[5] ? row[5].trim() : '';
      const pInvoice = row[6] ? row[6].trim() : '';

      if (!pName) errors.push(`行 ${rowNum}: 企業名/パートナー名は必須項目です。`);
      if (!pKana) errors.push(`行 ${rowNum}: フリガナは必須項目です。`);
      if (!pRep) errors.push(`行 ${rowNum}: 代表者名は必須項目です。`);

      if (pCorp && !/^\d{13}$/.test(pCorp)) {
        errors.push(`行 ${rowNum}: 法人番号は13桁の半角数字で入力してください。`);
      }
      if (pInvoice && !/^T\d{13}$/.test(pInvoice)) {
        errors.push(`行 ${rowNum}: インボイス登録番号はT+13桁の半角数字で入力してください。`);
      }

      tempParsed.push({
        registeredName: pName,
        registeredNameKana: pKana,
        representativeName: pRep,
        phoneNumber: pPhone,
        email: pEmail,
        corpNum: pCorp,
        invoiceNum: pInvoice,
        status: 'ACTIVE'
      });
    });

    if (errors.length > 0) {
      errors.forEach(err => {
        const li = document.createElement('li');
        li.textContent = err;
        errorList.appendChild(li);
      });
      errorContainer.style.display = 'block';
    } else {
      parsedCsvData = tempParsed;
      importBtn.disabled = false;
      showToast('CSVファイルの検証が完了しました。', 'success');
    }
  };
  reader.readAsText(file, 'UTF-8');
}

function setupDbmakeEvents() {
  const newBtn = document.getElementById('dbmake-new-partner-btn');
  if (newBtn) {
    newBtn.addEventListener('click', () => openDbmakePartnerModal());
  }

  const searchInput = document.getElementById('dbmake-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', () => renderDbmakePartners());
  }

  const statusFilter = document.getElementById('dbmake-status-filter');
  if (statusFilter) {
    statusFilter.addEventListener('change', () => renderDbmakePartners());
  }

  const favFilterBtn = document.getElementById('dbmake-fav-filter-btn');
  const favFilterIcon = document.getElementById('dbmake-fav-filter-icon');
  if (favFilterBtn) {
    favFilterBtn.addEventListener('click', () => {
      dbmakeFilterFav = !dbmakeFilterFav;
      if (dbmakeFilterFav) {
        favFilterBtn.classList.add('active');
        if (favFilterIcon) favFilterIcon.textContent = '★';
      } else {
        favFilterBtn.classList.remove('active');
        if (favFilterIcon) favFilterIcon.textContent = '☆';
      }
      renderDbmakePartners();
    });
  }

  // --- 書式ツールバーイベント登録 ---
  const boldBtn = document.getElementById('dbmake-text-bold');
  const italicBtn = document.getElementById('dbmake-text-italic');
  const strikeBtn = document.getElementById('dbmake-text-strike');
  const alignLeft = document.getElementById('dbmake-align-left');
  const alignCenter = document.getElementById('dbmake-align-center');
  const alignRight = document.getElementById('dbmake-align-right');
  const valignTop = document.getElementById('dbmake-valign-top');
  const valignMiddle = document.getElementById('dbmake-valign-middle');
  const valignBottom = document.getElementById('dbmake-valign-bottom');
  const fontDec = document.getElementById('dbmake-font-dec');
  const fontInc = document.getElementById('dbmake-font-inc');

  if (boldBtn) boldBtn.addEventListener('click', () => applyDbmakeStyle('fontWeight', 'bold'));
  if (italicBtn) italicBtn.addEventListener('click', () => applyDbmakeStyle('fontStyle', 'italic'));
  if (strikeBtn) strikeBtn.addEventListener('click', () => applyDbmakeStyle('textDecoration', 'line-through'));

  if (alignLeft) alignLeft.addEventListener('click', () => applyDbmakeStyle('textAlign', 'left'));
  if (alignCenter) alignCenter.addEventListener('click', () => applyDbmakeStyle('textAlign', 'center'));
  if (alignRight) alignRight.addEventListener('click', () => applyDbmakeStyle('textAlign', 'right'));

  if (valignTop) valignTop.addEventListener('click', () => applyDbmakeStyle('verticalAlign', 'top'));
  if (valignMiddle) valignMiddle.addEventListener('click', () => applyDbmakeStyle('verticalAlign', 'middle'));
  if (valignBottom) valignBottom.addEventListener('click', () => applyDbmakeStyle('verticalAlign', 'bottom'));

  const changeFontSize = (delta) => {
    if (!state.dbmakeSelectedCell && !state.dbmakeSelectedRange) return;
    const sizeInput = document.getElementById('dbmake-font-size-input');
    if (!sizeInput) return;
    
    let currentVal = parseInt(sizeInput.value, 10) || 10;
    let newVal = Math.min(24, Math.max(6, currentVal + delta));
    sizeInput.value = newVal;

    applyDbmakeStyle('fontSize', `${newVal}pt`);
  };
  if (fontDec) fontDec.addEventListener('click', () => changeFontSize(-1));
  if (fontInc) fontInc.addEventListener('click', () => changeFontSize(1));

  const dbmakeFontSizeInput = document.getElementById('dbmake-font-size-input');
  if (dbmakeFontSizeInput) {
    dbmakeFontSizeInput.addEventListener('change', (e) => {
      if (!state.dbmakeSelectedCell && !state.dbmakeSelectedRange) return;
      const val = parseInt(e.target.value, 10);
      if (!isNaN(val)) {
        const size = Math.min(24, Math.max(6, val));
        applyDbmakeStyle('fontSize', `${size}pt`);
      }
    });
  }

  // 折り返し設定ボタン
  const wrapClip = document.getElementById('dbmake-wrap-clip');
  const wrapWrap = document.getElementById('dbmake-wrap-wrap');
  const wrapOverflow = document.getElementById('dbmake-wrap-overflow');

  if (wrapClip) {
    wrapClip.addEventListener('click', () => {
      applyDbmakeStyle('whiteSpace', 'nowrap');
      applyDbmakeStyle('overflow', 'hidden');
      applyDbmakeStyle('textOverflow', 'ellipsis');
    });
  }
  if (wrapWrap) {
    wrapWrap.addEventListener('click', () => {
      applyDbmakeStyle('whiteSpace', 'normal');
      applyDbmakeStyle('overflow', 'visible');
      applyDbmakeStyle('textOverflow', 'clip');
    });
  }
  if (wrapOverflow) {
    wrapOverflow.addEventListener('click', () => {
      applyDbmakeStyle('whiteSpace', 'nowrap');
      applyDbmakeStyle('overflow', 'visible');
      applyDbmakeStyle('textOverflow', 'clip');
    });
  }

  // カラーピッカーポップアップ
  const textColorBtn = document.getElementById('dbmake-text-color-btn');
  const textColorPicker = document.getElementById('dbmake-color-picker-dropdown');
  const bgColorBtn = document.getElementById('dbmake-bg-color-btn');
  const bgColorPicker = document.getElementById('dbmake-bg-color-picker-dropdown');

  if (textColorBtn && textColorPicker) {
    textColorBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeAllColorPickersExcept(textColorPicker);
      textColorPicker.style.display = textColorPicker.style.display === 'none' || !textColorPicker.style.display ? 'block' : 'none';
    });
  }
  if (bgColorBtn && bgColorPicker) {
    bgColorBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeAllColorPickersExcept(bgColorPicker);
      bgColorPicker.style.display = bgColorPicker.style.display === 'none' || !bgColorPicker.style.display ? 'block' : 'none';
    });
  }

  const partnerModal = document.getElementById('dbmake-partner-modal');
  const partnerClose = document.getElementById('dbmake-partner-modal-close');
  const partnerCancel = document.getElementById('dbmake-partner-modal-cancel');
  
  const closeModal = () => partnerModal.classList.remove('active');
  if (partnerClose) partnerClose.addEventListener('click', closeModal);
  if (partnerCancel) partnerCancel.addEventListener('click', closeModal);

  if (partnerModal) {
    partnerModal.querySelectorAll('.modal-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetId = e.target.dataset.target;
        partnerModal.querySelectorAll('.modal-tab-btn').forEach(b => b.classList.remove('active'));
        partnerModal.querySelectorAll('.modal-tab-content').forEach(c => c.style.display = 'none');
        
        e.target.classList.add('active');
        const targetContent = document.getElementById(targetId);
        if (targetContent) targetContent.style.display = 'block';
      });
    });
  }

  const form = document.getElementById('dbmake-partner-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const id = document.getElementById('dbmake-partner-id').value;
      const registeredName = document.getElementById('dbmake-partner-name').value.trim();
      const registeredNameKana = document.getElementById('dbmake-partner-name-kana').value.trim();
      const representativeName = document.getElementById('dbmake-partner-rep').value.trim();
      const status = document.getElementById('dbmake-partner-status').value;
      const phoneNumber = document.getElementById('dbmake-partner-phone').value.trim();
      const email = document.getElementById('dbmake-partner-email').value.trim();
      const corpNum = document.getElementById('dbmake-partner-corpnum').value.trim();
      const invoiceNum = document.getElementById('dbmake-partner-invoicenum').value.trim();
      const zipCode = document.getElementById('dbmake-partner-zip').value.trim();
      const pref = document.getElementById('dbmake-partner-pref').value.trim();
      const city = document.getElementById('dbmake-partner-city').value.trim();
      const addr1 = document.getElementById('dbmake-partner-addr1').value.trim();
      const addr2 = document.getElementById('dbmake-partner-addr2').value.trim();
      const bank = document.getElementById('dbmake-partner-bank').value.trim();
      const branch = document.getElementById('dbmake-partner-branch').value.trim();
      const accType = document.getElementById('dbmake-partner-acctype').value;
      const accNum = document.getElementById('dbmake-partner-accnum').value.trim();
      const accHolder = document.getElementById('dbmake-partner-accholder').value.trim();
      const reward = document.getElementById('dbmake-partner-reward').value.trim();
      const remarks = document.getElementById('dbmake-partner-remarks').value.trim();

      if (corpNum && !/^\d{13}$/.test(corpNum)) {
        alert('法人番号は13桁の半角数字で入力してください。');
        return;
      }
      if (invoiceNum && !/^T\d{13}$/.test(invoiceNum)) {
        alert('インボイス登録番号はT+13桁の半角数字で入力してください。');
        return;
      }

      const generatedId = id || generate8DigitId();
      const partnerData = {
        id: generatedId,
        registeredName,
        registeredNameKana,
        representativeName,
        status,
        phoneNumber,
        email,
        corpNum,
        invoiceNum,
        zipCode,
        pref,
        city,
        addr1,
        addr2,
        bank,
        branch,
        accType,
        accNum,
        accHolder,
        reward,
        remarks
      };

      const duplicates = checkDuplicates(registeredName, corpNum, id);
      if (duplicates.length > 0) {
        showDuplicateModal(duplicates, partnerData);
      } else {
        savePartnerData(partnerData);
      }
    });
  }

  const zipSearchBtn = document.getElementById('dbmake-zip-search-btn');
  if (zipSearchBtn) {
    zipSearchBtn.addEventListener('click', () => {
      const zip = document.getElementById('dbmake-partner-zip').value.trim().replace('-', '');
      if (zip.length !== 7) {
        alert('郵便番号はハイフンなしの7桁で入力してください。');
        return;
      }
      const mockZips = {
        '1000001': { pref: '東京都', city: '千代田区', addr1: '千代田' },
        '1000005': { pref: '東京都', city: '千代田区', addr1: '丸の内' },
        '5300001': { pref: '大阪府', city: '大阪市北区', addr1: '梅田' },
        '4600002': { pref: '愛知県', city: '名古屋市中区', addr1: '栄' }
      };
      const hit = mockZips[zip];
      if (hit) {
        document.getElementById('dbmake-partner-pref').value = hit.pref;
        document.getElementById('dbmake-partner-city').value = hit.city;
        document.getElementById('dbmake-partner-addr1').value = hit.addr1;
      } else {
        document.getElementById('dbmake-partner-pref').value = '東京都';
        document.getElementById('dbmake-partner-city').value = '中央区';
        document.getElementById('dbmake-partner-addr1').value = '日本橋';
      }
    });
  }

  const dupModal = document.getElementById('dbmake-duplicate-modal');
  const dupClose = document.getElementById('dbmake-dup-modal-close');
  const dupSkip = document.getElementById('dbmake-dup-skip-btn');
  const dupOverwrite = document.getElementById('dbmake-dup-overwrite-btn');

  const closeDupModal = () => {
    dupModal.classList.remove('active');
    dbmakeDuplicateData = null;
  };
  if (dupClose) dupClose.addEventListener('click', closeDupModal);
  if (dupSkip) dupSkip.addEventListener('click', () => {
    closeDupModal();
    showToast('登録をスキップしました。', 'info');
  });
  if (dupOverwrite) {
    dupOverwrite.addEventListener('click', () => {
      if (dbmakeDuplicateData) {
        const dupInDb = dbmakePartners.find(p => 
          p.registeredName === dbmakeDuplicateData.registeredName || 
          (p.corpNum && p.corpNum === dbmakeDuplicateData.corpNum)
        );
        if (dupInDb) {
          dbmakeDuplicateData.id = dupInDb.id;
        }
        savePartnerData(dbmakeDuplicateData);
        closeDupModal();
      }
    });
  }

  const csvBtn = document.getElementById('dbmake-csv-import-btn');
  const csvModal = document.getElementById('dbmake-csv-modal');
  const csvClose = document.getElementById('dbmake-csv-modal-close');
  const csvCancel = document.getElementById('dbmake-csv-modal-cancel');
  
  if (csvBtn && csvModal) {
    csvBtn.addEventListener('click', () => {
      document.getElementById('dbmake-csv-error-container').style.display = 'none';
      document.getElementById('dbmake-csv-modal-import').disabled = true;
      parsedCsvData = [];
      csvModal.classList.add('active');
    });
  }

  const closeCsvModal = () => csvModal.classList.remove('active');
  if (csvClose) csvClose.addEventListener('click', closeCsvModal);
  if (csvCancel) csvCancel.addEventListener('click', closeCsvModal);

  const dropzone = document.getElementById('dbmake-csv-dropzone');
  const fileInput = document.getElementById('dbmake-csv-file-input');

  if (dropzone && fileInput) {
    dropzone.addEventListener('click', () => fileInput.click());
    
    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });

    ['dragleave', 'drop'].forEach(evtName => {
      dropzone.addEventListener(evtName, () => dropzone.classList.remove('dragover'));
    });

    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      const files = e.dataTransfer.files;
      if (files.length > 0 && files[0].name.endsWith('.csv')) {
        processCSVFile(files[0]);
      } else {
        alert('CSVファイル(.csv)をアップロードしてください。');
      }
    });

    fileInput.addEventListener('change', (e) => {
      const files = e.target.files;
      if (files.length > 0) {
        processCSVFile(files[0]);
      }
    });
  }

  const csvImportExecBtn = document.getElementById('dbmake-csv-modal-import');
  if (csvImportExecBtn) {
    csvImportExecBtn.addEventListener('click', () => {
      if (parsedCsvData.length === 0) return;

      let importCount = 0;
      let skipCount = 0;

      parsedCsvData.forEach(item => {
        const dups = checkDuplicates(item.registeredName, item.corpNum);
        if (dups.length > 0) {
          skipCount++;
        } else {
          const generatedId = generate8DigitId();
          dbmakePartners.push({
            ...item,
            id: generatedId,
            isFavorite: false,
            recordedBy: state.currentUser ? state.currentUser.id : 'admin',
            recordedAt: new Date().toISOString()
          });
          importCount++;
        }
      });

      saveDbmakePartners();
      renderDbmakePartners();
      closeCsvModal();

      let msg = `${importCount} 件のパートナー情報を一括登録しました。`;
      if (skipCount > 0) {
        msg += ` (重複した ${skipCount} 件はスキップしました)`;
      }
      showToast(msg, 'success');
    });
  }
}

// ==========================================
// 📊 選択セルの統計情報表示ロジック
// ==========================================

function parseDateStringForStats(str) {
  // YYYY年MM月DD日 または YYYY-MM-DD または YYYY/MM/DD
  const regexJp = /^(\d{4})[年/-](\d{1,2})[月/-](\d{1,2})日?$/;
  const match = str.match(regexJp);
  if (match) {
    const y = parseInt(match[1], 10);
    const m = parseInt(match[2], 10) - 1;
    const d = parseInt(match[3], 10);
    const date = new Date(y, m, d);
    if (!isNaN(date.getTime())) return date;
  }
  
  const parsed = Date.parse(str);
  if (!isNaN(parsed)) {
    if (/^\d+$/.test(str) && str.length < 5) return null;
    return new Date(parsed);
  }
  
  return null;
}

function formatDateToYMD(date) {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return `${y}年${m}月${d}日`;
}

function formatNumberForStats(num) {
  if (Number.isInteger(num)) {
    return num.toLocaleString();
  }
  return Number(num.toFixed(2)).toLocaleString();
}

function updateSelectionStatsWidget() {
  const widget = document.getElementById('selection-stats-widget');
  const displayVal = document.getElementById('stats-display-value');
  const dropdownMenu = document.getElementById('stats-dropdown-menu');
  if (!widget || !displayVal || !dropdownMenu) return;

  const activeTableBodyId = {
    'jo-info-screen': 'jo-table-body',
    'applicant-info-screen': 'applicant-table-body',
    'agency-info-screen': 'agency-table-body',
    'custom-table-screen': 'ct-table-body',
    'dbmake-screen': 'dbmake-table-body'
  }[state.currentView];

  if (!activeTableBodyId) {
    widget.style.display = 'none';
    dropdownMenu.style.display = 'none';
    return;
  }

  const tbody = document.getElementById(activeTableBodyId);
  if (!tbody) {
    widget.style.display = 'none';
    dropdownMenu.style.display = 'none';
    return;
  }

  // 行番号セルを除く、選択されているセル要素をすべて取得
  const selectedTds = Array.from(tbody.querySelectorAll('td.selected-cell, td.selected-row-cell, td.selected-col-cell, td.in-range-cell, td.selected-range'))
    .filter(td => !td.classList.contains('row-number-col'));

  if (selectedTds.length < 2) {
    widget.style.display = 'none';
    dropdownMenu.style.display = 'none';
    return;
  }

  // 統計値の計算
  let totalCells = selectedTds.length;
  let filledCells = 0;
  let numberValues = [];
  let dateValues = [];

  selectedTds.forEach(td => {
    let text = '';
    const input = td.querySelector('input, select');
    if (input) {
      text = input.value.trim();
    } else {
      text = td.textContent.trim();
    }

    if (text !== '') {
      filledCells++;

      const dateParsed = parseDateStringForStats(text);
      if (dateParsed) {
        dateValues.push(dateParsed);
      }

      const numText = text.replace(/[,￥円%]/g, '').trim();
      const numParsed = parseFloat(numText);
      if (!isNaN(numParsed) && isFinite(numParsed)) {
        numberValues.push(numParsed);
      }
    }
  });

  const stats = {
    count: totalCells,
    filled: filledCells
  };

  if (dateValues.length > 0) {
    stats.min = formatDateToYMD(new Date(Math.min(...dateValues)));
    stats.max = formatDateToYMD(new Date(Math.max(...dateValues)));
  }

  if (numberValues.length > 0) {
    const sum = numberValues.reduce((a, b) => a + b, 0);
    const avg = sum / numberValues.length;
    stats.sum = formatNumberForStats(sum);
    stats.avg = formatNumberForStats(avg);

    // 中央値の計算
    const sorted = [...numberValues].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    const medianVal = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    stats.median = formatNumberForStats(medianVal);

    if (dateValues.length === 0) {
      stats.min = formatNumberForStats(Math.min(...numberValues));
      stats.max = formatNumberForStats(Math.max(...numberValues));
    }
  }

  // ドロップダウンメニューの生成
  const items = [];
  
  // 平均値 (数値がある場合のみ)
  if (stats.avg !== undefined) {
    items.push({ type: 'avg', label: '平均値', value: stats.avg });
  }
  // 最小値
  if (stats.min !== undefined) {
    items.push({ type: 'min', label: '最小値', value: stats.min });
  }
  // 最大値
  if (stats.max !== undefined) {
    items.push({ type: 'max', label: '最大値', value: stats.max });
  }
  // 中央値 (数値がある場合のみ)
  if (stats.median !== undefined) {
    items.push({ type: 'median', label: '中央値', value: stats.median });
  }
  // 合計値 (数値がある場合のみ)
  if (stats.sum !== undefined) {
    items.push({ type: 'sum', label: '合計値', value: stats.sum });
  }
  // カウント
  items.push({ type: 'count', label: 'カウント', value: stats.count });
  // 個数
  items.push({ type: 'filled', label: '個数', value: stats.filled });

  // dropdownのHTML描画
  dropdownMenu.innerHTML = '';
  items.forEach(item => {
    const div = document.createElement('div');
    div.className = `stats-menu-item${state.defaultStatsType === item.type ? ' active' : ''}`;
    div.innerHTML = `
      <span>${item.label}: ${item.value}</span>
      ${state.defaultStatsType === item.type ? '<span class="check-mark">✓</span>' : ''}
    `;
    div.addEventListener('click', (e) => {
      e.stopPropagation();
      state.defaultStatsType = item.type;
      dropdownMenu.style.display = 'none';
      updateSelectionStatsWidget();
    });
    dropdownMenu.appendChild(div);
  });

  // メインインジケーターテキストの更新
  const activeItem = items.find(it => it.type === state.defaultStatsType) || items.find(it => it.type === 'filled');
  displayVal.textContent = `${activeItem.label}: ${activeItem.value} ▼`;
  widget.style.display = 'block';
}

// ドロップダウンメニューのクリック切り替え制御
document.addEventListener('DOMContentLoaded', () => {
  const displayVal = document.getElementById('stats-display-value');
  const dropdownMenu = document.getElementById('stats-dropdown-menu');
  if (displayVal && dropdownMenu) {
    displayVal.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = dropdownMenu.style.display === 'none' || !dropdownMenu.style.display;
      dropdownMenu.style.display = isHidden ? 'block' : 'none';
    });

    document.addEventListener('click', () => {
      dropdownMenu.style.display = 'none';
    });
  }
});


// ==========================================
// ⌨️ セル選択を軸にした上下左右（+Shift/Ctrl）移動・拡張ロジック
// ==========================================

function getActiveSheetData(prefix) {
  const isAdmin = state.currentUser && state.currentUser.id === 'admin';

  if (prefix === 'jo') {
    const query = document.getElementById('jo-search-input')?.value.trim().toLowerCase() || '';
    const status = document.getElementById('jo-status-filter')?.value || 'ALL';
    const favoriteOnly = !!state.joFilterFav;

    const filtered = state.joContracts.filter(c => {
      const cust = state.customers.find(cust => cust.id === c.customerId);
      const custName = cust ? cust.name.toLowerCase() : '';
      const repName = c.representativeName?.toLowerCase() || '';
      const matchSearch = !query || custName.includes(query) || repName.includes(query) || c.customerId.toLowerCase().includes(query);
      const matchStatus = status === 'ALL' || c.status === status;
      const matchFav = !favoriteOnly || c.isFavorite;
      return matchSearch && matchStatus && matchFav;
    });

    const columns = state.joColumns;
    const baseVisible = isAdmin ? columns.map(c => c.id) : state.joVisibleColumns;
    const visibleColIds = [];
    columns.forEach(col => {
      const access = checkColumnAccess('jo-info-screen', col.id);
      if (access.visible && (baseVisible.includes(col.id) || access.grayout)) {
        visibleColIds.push(col.id);
      }
    });

    return {
      rows: filtered,
      rowIdKey: 'customerId',
      cols: visibleColIds
    };
  }

  if (prefix === 'ap') {
    const query = document.getElementById('ap-search-input')?.value.trim().toLowerCase() || '';
    const status = document.getElementById('ap-status-filter')?.value || 'ALL';
    const favoriteOnly = !!state.apFilterFav;

    const filtered = state.apContracts.filter(c => {
      const cust = state.customers.find(cust => cust.id === c.customerId);
      const custName = cust ? cust.name.toLowerCase() : '';
      const repName = c.representativeName?.toLowerCase() || '';
      const matchSearch = !query || custName.includes(query) || repName.includes(query) || c.customerId.toLowerCase().includes(query);
      const matchStatus = status === 'ALL' || c.status === status;
      const matchFav = !favoriteOnly || c.isFavorite;
      return matchSearch && matchStatus && matchFav;
    });

    const columns = state.apColumns;
    const baseVisible = isAdmin ? columns.map(c => c.id) : state.apVisibleColumns;
    const visibleColIds = [];
    columns.forEach(col => {
      const access = checkColumnAccess('applicant-info-screen', col.id);
      if (access.visible && (baseVisible.includes(col.id) || access.grayout)) {
        visibleColIds.push(col.id);
      }
    });

    return {
      rows: filtered,
      rowIdKey: 'customerId',
      cols: visibleColIds
    };
  }

  if (prefix === 'ag') {
    const query = document.getElementById('ag-search-input')?.value.trim().toLowerCase() || '';
    const status = document.getElementById('ag-status-filter')?.value || 'ALL';
    const favoriteOnly = !!state.agFilterFav;

    const filtered = state.agContracts.filter(c => {
      const cust = state.customers.find(cust => cust.id === c.customerId);
      const custName = cust ? cust.name.toLowerCase() : '';
      const repName = c.representativeName?.toLowerCase() || '';
      const matchSearch = !query || custName.includes(query) || repName.includes(query) || c.customerId.toLowerCase().includes(query);
      const matchStatus = status === 'ALL' || c.status === status;
      const matchFav = !favoriteOnly || c.isFavorite;
      return matchSearch && matchStatus && matchFav;
    });

    const columns = state.agColumns;
    const baseVisible = isAdmin ? columns.map(c => c.id) : state.agVisibleColumns;
    const visibleColIds = [];
    columns.forEach(col => {
      const access = checkColumnAccess('agency-screen', col.id);
      if (access.visible && (baseVisible.includes(col.id) || access.grayout)) {
        visibleColIds.push(col.id);
      }
    });

    return {
      rows: filtered,
      rowIdKey: 'customerId',
      cols: visibleColIds
    };
  }

  if (prefix === 'ct') {
    if (!state.activeCustomTableId) return null;
    const tbl = state.customTables.find(t => t.id === state.activeCustomTableId);
    if (!tbl) return null;

    const query = document.getElementById('ct-search-input')?.value.trim().toLowerCase() || '';
    let filteredRows = [...tbl.rows];
    if (query) {
      filteredRows = filteredRows.filter(r => {
        return tbl.columns.some(col => {
          const val = String(r.cells[col.id] || '').toLowerCase();
          return val.includes(query);
        });
      });
    }
    if (state.ctSortColId) {
      const isAsc = state.ctSortAsc;
      filteredRows.sort((a, b) => {
        const valA = String(a.cells[state.ctSortColId] || '');
        const valB = String(b.cells[state.ctSortColId] || '');
        return valA.localeCompare(valB, 'ja', { numeric: true }) * (isAsc ? 1 : -1);
      });
    }

    const visibleColIds = tbl.columns.filter(c => tbl.visibleColumns.includes(c.id)).map(c => c.id);

    return {
      rows: filteredRows,
      rowIdKey: 'id',
      cols: visibleColIds
    };
  }

  if (prefix === 'dbmake') {
    const searchQuery = document.getElementById('dbmake-search-input')?.value.trim().toLowerCase() || '';
    const statusFilter = document.getElementById('dbmake-status-filter')?.value || 'ALL';
    const filtered = dbmakePartners.filter(p => {
      const nameMatch = p.registeredName.toLowerCase().includes(searchQuery);
      const kanaMatch = p.registeredNameKana.toLowerCase().includes(searchQuery);
      const repMatch = p.representativeName.toLowerCase().includes(searchQuery);
      const invoiceMatch = (p.invoiceNum || '').toLowerCase().includes(searchQuery);
      const emailMatch = (p.email || '').toLowerCase().includes(searchQuery);
      const searchMatch = !searchQuery || nameMatch || kanaMatch || repMatch || invoiceMatch || emailMatch;
      const statusMatch = statusFilter === 'ALL' || p.status === statusFilter;
      const favMatch = !dbmakeFilterFav || p.isFavorite;
      return searchMatch && statusMatch && favMatch;
    });

    return {
      rows: filtered,
      rowIdKey: 'id',
      cols: state.dbmakeVisibleColumns
    };
  }

  return null;
}

function handleSpreadsheetArrowKey(prefix, event) {
  const sheetData = getActiveSheetData(prefix);
  if (!sheetData || sheetData.rows.length === 0 || sheetData.cols.length === 0) return;

  const { rows, rowIdKey, cols } = sheetData;

  let selectedCell = null;
  let selectedRange = null;

  if (prefix === 'jo') {
    selectedCell = state.joSelectedCell;
    selectedRange = state.joSelectedRange;
  } else if (prefix === 'ap') {
    selectedCell = state.apSelectedCell;
    selectedRange = state.apSelectedRange;
  } else if (prefix === 'ag') {
    selectedCell = state.agSelectedCell;
    selectedRange = state.agSelectedRange;
  } else if (prefix === 'ct') {
    selectedCell = state.ctSelectedCell;
    selectedRange = state.ctSelectedRange;
  } else if (prefix === 'dbmake') {
    selectedCell = state.dbmakeSelectedCell;
    selectedRange = state.dbmakeSelectedRange;
  }

  if (!selectedCell) return;

  let anchorRowIdx = -1;
  let anchorColIdx = -1;

  if (prefix === 'dbmake') {
    anchorRowIdx = rows.findIndex(r => r.id === selectedCell.partnerId);
    anchorColIdx = cols.indexOf(selectedCell.colId);
  } else if (prefix === 'ct') {
    anchorRowIdx = rows.findIndex(r => r.id === selectedCell.rowId);
    anchorColIdx = cols.indexOf(selectedCell.colId);
  } else {
    anchorRowIdx = rows.findIndex(r => r.customerId === selectedCell.customerId);
    anchorColIdx = cols.indexOf(selectedCell.colId);
  }

  if (anchorRowIdx === -1 || anchorColIdx === -1) return;

  event.preventDefault();

  let currRowIdx = anchorRowIdx;
  let currColIdx = anchorColIdx;

  if (selectedRange) {
    currRowIdx = selectedRange.endRow;
    currColIdx = selectedRange.endCol;
  }

  let targetRowIdx = currRowIdx;
  let targetColIdx = currColIdx;

  const key = event.key;
  const isShift = event.shiftKey;
  const isCtrl = event.ctrlKey || event.metaKey;

  const getCellValue = (rIdx, cIdx) => {
    const row = rows[rIdx];
    const colId = cols[cIdx];
    if (!row || !colId) return '';
    if (prefix === 'ct') {
      return String(row.cells[colId] || '').trim();
    }
    return String(row[colId] || '').trim();
  };

  const getNextBoundary = (startR, startC, dirR, dirC) => {
    let r = startR;
    let c = startC;
    const startVal = getCellValue(r, c);
    
    const nextR = r + dirR;
    const nextC = c + dirC;
    if (nextR < 0 || nextR >= rows.length || nextC < 0 || nextC >= cols.length) {
      return { r, c };
    }
    
    const nextVal = getCellValue(nextR, nextC);
    
    if (startVal === '') {
      while (r >= 0 && r < rows.length && c >= 0 && c < cols.length) {
        if (getCellValue(r, c) !== '') return { r, c };
        r += dirR;
        c += dirC;
      }
      return { r: Math.max(0, Math.min(rows.length - 1, r - dirR)), c: Math.max(0, Math.min(cols.length - 1, c - dirC)) };
    } else if (nextVal === '') {
      r += dirR;
      c += dirC;
      while (r >= 0 && r < rows.length && c >= 0 && c < cols.length) {
        if (getCellValue(r, c) !== '') return { r, c };
        r += dirR;
        c += dirC;
      }
      return { r: Math.max(0, Math.min(rows.length - 1, r - dirR)), c: Math.max(0, Math.min(cols.length - 1, c - dirC)) };
    } else {
      while (r >= 0 && r < rows.length && c >= 0 && c < cols.length) {
        const nextCellVal = getCellValue(r + dirR, c + dirC);
        if (nextCellVal === '') return { r, c };
        r += dirR;
        c += dirC;
      }
      return { r: Math.max(0, Math.min(rows.length - 1, r - dirR)), c: Math.max(0, Math.min(cols.length - 1, c - dirC)) };
    }
  };

  let dirR = 0;
  let dirC = 0;
  if (key === 'ArrowUp') dirR = -1;
  else if (key === 'ArrowDown') dirR = 1;
  else if (key === 'ArrowLeft') dirC = -1;
  else if (key === 'ArrowRight') dirC = 1;

  if (isCtrl) {
    const boundary = getNextBoundary(currRowIdx, currColIdx, dirR, dirC);
    targetRowIdx = boundary.r;
    targetColIdx = boundary.c;
  } else {
    targetRowIdx = Math.max(0, Math.min(rows.length - 1, currRowIdx + dirR));
    targetColIdx = Math.max(0, Math.min(cols.length - 1, currColIdx + dirC));
  }

  if (isShift) {
    const newRange = {
      startRow: anchorRowIdx,
      startCol: anchorColIdx,
      endRow: targetRowIdx,
      endCol: targetColIdx
    };

    if (prefix === 'jo') {
      state.joSelectedRange = newRange;
      state.joSelectedRow = null;
      state.joSelectedCol = null;
      state.joSelectedRows.clear();
      state.joSelectedCols.clear();
      renderJoInfo();
      syncJoFormatToolbar();
    } else if (prefix === 'ap') {
      state.apSelectedRange = newRange;
      state.apSelectedRow = null;
      state.apSelectedCol = null;
      state.apSelectedRows.clear();
      state.apSelectedCols.clear();
      renderApplicantInfo();
      syncApFormatToolbar();
    } else if (prefix === 'ag') {
      state.agSelectedRange = newRange;
      state.agSelectedRow = null;
      state.agSelectedCol = null;
      state.agSelectedRows.clear();
      state.agSelectedCols.clear();
      renderAgencyInfo();
      syncAgFormatToolbar();
    } else if (prefix === 'ct') {
      state.ctSelectedRange = newRange;
      state.ctSelectedRows.clear();
      state.ctSelectedCols.clear();
      updateCtSelectionHighlight();
      syncCtFormatToolbar();
    } else if (prefix === 'dbmake') {
      state.dbmakeSelectedRange = newRange;
      state.dbmakeSelectedRow = null;
      state.dbmakeSelectedCol = null;
      state.dbmakeSelectedRows.clear();
      state.dbmakeSelectedCols.clear();
      renderDbmakePartners();
      syncDbmakeFormatToolbar();
    }
  } else {
    const targetRow = rows[targetRowIdx];
    const targetColId = cols[targetColIdx];

    if (prefix === 'jo') {
      state.joSelectedCell = { customerId: targetRow.customerId, colId: targetColId };
      state.joSelectedRange = null;
      state.joSelectedRow = null;
      state.joSelectedCol = null;
      state.joSelectedRows.clear();
      state.joSelectedCols.clear();
      renderJoInfo();
      syncJoFormatToolbar();
    } else if (prefix === 'ap') {
      state.apSelectedCell = { customerId: targetRow.customerId, colId: targetColId };
      state.apSelectedRange = null;
      state.apSelectedRow = null;
      state.apSelectedCol = null;
      state.apSelectedRows.clear();
      state.apSelectedCols.clear();
      renderApplicantInfo();
      syncApFormatToolbar();
    } else if (prefix === 'ag') {
      state.agSelectedCell = { customerId: targetRow.customerId, colId: targetColId };
      state.agSelectedRange = null;
      state.agSelectedRow = null;
      state.agSelectedCol = null;
      state.agSelectedRows.clear();
      state.agSelectedCols.clear();
      renderAgencyInfo();
      syncAgFormatToolbar();
    } else if (prefix === 'ct') {
      state.ctSelectedCell = { rowId: targetRow.id, colId: targetColId };
      state.ctSelectedRange = null;
      state.ctSelectedRows.clear();
      state.ctSelectedCols.clear();
      updateCtSelectionHighlight();
      syncCtFormatToolbar();
    } else if (prefix === 'dbmake') {
      state.dbmakeSelectedCell = { row: targetRowIdx, col: targetColIdx, colId: targetColId, partnerId: targetRow.id };
      state.dbmakeSelectedRange = null;
      state.dbmakeSelectedRow = null;
      state.dbmakeSelectedCol = null;
      state.dbmakeSelectedRows.clear();
      state.dbmakeSelectedCols.clear();
      renderDbmakePartners();
      syncDbmakeFormatToolbar();
    }
  }
}

// Shift + 左右矢印キーによる列選択の拡張ヘルパー関数
function expandColumnSelection(prefix, tbodyId, allColumns, visibleColIds, selectedColsSet, lastColKey, renderFunc, syncFunc, event) {
  let currentColId = null;
  const activeEl = document.activeElement;
  
  if (activeEl && activeEl.tagName === 'INPUT' && activeEl.closest(`#${tbodyId}`)) {
    const td = activeEl.closest('td');
    if (td) currentColId = td.getAttribute('data-col-id');
  } else if (selectedColsSet.size > 0) {
    currentColId = state[lastColKey] || Array.from(selectedColsSet)[0];
  }
  
  if (currentColId) {
    event.preventDefault();
    
    const anchorKey = `${prefix}ColumnSelectAnchor`;
    if (!state[anchorKey]) {
      state[anchorKey] = currentColId;
    }
    if (!state[lastColKey]) {
      state[lastColKey] = currentColId;
    }
    
    const anchorIdx = visibleColIds.indexOf(state[anchorKey]);
    let lastIdx = visibleColIds.indexOf(state[lastColKey]);
    
    if (anchorIdx !== -1 && lastIdx !== -1) {
      if (event.key === 'ArrowLeft') {
        if (lastIdx > 0) lastIdx--;
      } else if (event.key === 'ArrowRight') {
        if (lastIdx < visibleColIds.length - 1) lastIdx++;
      }
      
      const newLastCol = visibleColIds[lastIdx];
      state[lastColKey] = newLastCol;
      
      if (prefix === 'jo') {
        state.joSelectedCell = null;
        state.joSelectedRow = null;
        state.joSelectedRows.clear();
      } else if (prefix === 'ap') {
        state.apSelectedCell = null;
        state.apSelectedRow = null;
        state.apSelectedRows.clear();
      } else if (prefix === 'ag') {
        state.agSelectedCell = null;
        state.agSelectedRow = null;
        state.agSelectedRows.clear();
      } else if (prefix === 'ct') {
        state.ctSelectedCell = null;
        state.ctSelectedRange = null;
        state.ctSelectedRows.clear();
      } else if (prefix === 'dbmake') {
        state.dbmakeSelectedCell = null;
        state.dbmakeSelectedRange = null;
        state.dbmakeSelectedRows.clear();
      }
      
      selectedColsSet.clear();
      
      const startIdx = Math.min(anchorIdx, lastIdx);
      const endIdx = Math.max(anchorIdx, lastIdx);
      
      for (let i = startIdx; i <= endIdx; i++) {
        selectedColsSet.add(visibleColIds[i]);
      }
      
      renderFunc();
      syncFunc();
    }
  }
}

// ==========================================
// 14. ショートカットキーによるセルコピー (Ctrl+C / Cmd+C)
// ==========================================
window.addEventListener('keydown', (e) => {
  // セルが選択されている場合、上下左右キー（Shift/Ctrl連動含む）でのセル移動・拡張を処理
  const activeScreen = state.currentView;
  const isCellSelected = {
    'jo-info-screen': !!state.joSelectedCell,
    'applicant-info-screen': !!state.apSelectedCell,
    'agency-info-screen': !!state.agSelectedCell,
    'custom-table-screen': !!state.ctSelectedCell,
    'dbmake-screen': !!state.dbmakeSelectedCell
  }[activeScreen];

  if (isCellSelected && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
    if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA' || document.activeElement.tagName === 'SELECT') {
      return;
    }
    if (activeScreen === 'jo-info-screen') {
      handleSpreadsheetArrowKey('jo', e);
    } else if (activeScreen === 'applicant-info-screen') {
      handleSpreadsheetArrowKey('ap', e);
    } else if (activeScreen === 'agency-info-screen') {
      handleSpreadsheetArrowKey('ag', e);
    } else if (activeScreen === 'custom-table-screen' && state.activeCustomTableId) {
      handleSpreadsheetArrowKey('ct', e);
    } else if (activeScreen === 'dbmake-screen') {
      handleSpreadsheetArrowKey('dbmake', e);
    }
    return;
  }

  // Shift + 左右矢印キーによる列選択の拡張 (全スプレッドシート画面対応)
  if (e.shiftKey && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
    const activeScreen = state.currentView;
    if (activeScreen === 'jo-info-screen') {
      expandColumnSelection('jo', 'jo-table-body', state.joColumns, state.joVisibleColumns, state.joSelectedCols, 'joLastSelectedCol', renderJoInfo, syncJoFormatToolbar, e);
    } else if (activeScreen === 'applicant-info-screen') {
      const isAdmin = state.currentUser && state.currentUser.id === 'admin';
      const baseVisible = isAdmin ? state.apColumns.map(c => c.id) : state.apVisibleColumns;
      const visibleColIds = [];
      state.apColumns.forEach(col => {
        const access = checkColumnAccess('applicant-info-screen', col.id);
        if (access.visible && (baseVisible.includes(col.id) || access.grayout)) {
          visibleColIds.push(col.id);
        }
      });
      expandColumnSelection('ap', 'applicant-table-body', state.apColumns, visibleColIds, state.apSelectedCols, 'apLastSelectedCol', renderApplicantInfo, syncApFormatToolbar, e);
    } else if (activeScreen === 'agency-info-screen') {
      const isAdmin = state.currentUser && state.currentUser.id === 'admin';
      const baseVisible = isAdmin ? state.agColumns.map(c => c.id) : state.agVisibleColumns;
      const visibleColIds = [];
      state.agColumns.forEach(col => {
        const access = checkColumnAccess('agency-screen', col.id);
        if (access.visible && (baseVisible.includes(col.id) || access.grayout)) {
          visibleColIds.push(col.id);
        }
      });
      expandColumnSelection('ag', 'agency-table-body', state.agColumns, visibleColIds, state.agSelectedCols, 'agLastSelectedCol', renderAgencyInfo, syncAgFormatToolbar, e);
    } else if (activeScreen === 'custom-table-screen' && state.activeCustomTableId) {
      const tbl = state.customTables.find(t => t.id === state.activeCustomTableId);
      if (tbl) {
        const visibleColIds = tbl.columns.filter(c => tbl.visibleColumns.includes(c.id)).map(c => c.id);
        expandColumnSelection('ct', 'ct-table-body', tbl.columns, visibleColIds, state.ctSelectedCols, 'ctColumnSelectLast', () => {
          updateCtSelectionHighlight();
        }, syncCtFormatToolbar, e);
      }
    } else if (activeScreen === 'dbmake-screen') {
      expandColumnSelection('dbmake', 'dbmake-table-body', state.dbmakeColumns, state.dbmakeVisibleColumns, state.dbmakeSelectedCols, 'dbmakeLastSelectedCol', renderDbmakePartners, syncDbmakeFormatToolbar, e);
    }
  }

  // Ctrl + A (または Cmd + A) 全選択
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {
    if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA' || document.activeElement.tagName === 'SELECT') {
      return;
    }

    const activeScreen = state.currentView;
    if (!activeScreen) return;

    e.preventDefault();

    if (activeScreen === 'jo-info-screen') {
      state.joSelectedCell = null;
      state.joSelectedRow = null;
      state.joSelectedCol = null;
      state.joSelectedRows.clear();
      state.joSelectedCols.clear();
      state.joSelectedCells.clear();
      const tbody = document.getElementById('jo-table-body');
      if (tbody) {
        tbody.querySelectorAll('tr').forEach((_, idx) => state.joSelectedRows.add(idx));
      }
      renderJoInfo();
      syncJoFormatToolbar();
    } else if (activeScreen === 'applicant-info-screen') {
      state.apSelectedCell = null;
      state.apSelectedRow = null;
      state.apSelectedCol = null;
      state.apSelectedRows.clear();
      state.apSelectedCols.clear();
      state.apSelectedCells.clear();
      const tbody = document.getElementById('applicant-table-body');
      if (tbody) {
        tbody.querySelectorAll('tr').forEach((_, idx) => state.apSelectedRows.add(idx));
      }
      renderApplicantInfo();
      syncApFormatToolbar();
    } else if (activeScreen === 'agency-info-screen') {
      state.agSelectedCell = null;
      state.agSelectedRow = null;
      state.agSelectedCol = null;
      state.agSelectedRows.clear();
      state.agSelectedCols.clear();
      state.agSelectedCells.clear();
      const tbody = document.getElementById('agency-table-body');
      if (tbody) {
        tbody.querySelectorAll('tr').forEach((_, idx) => state.agSelectedRows.add(idx));
      }
      renderAgencyInfo();
      syncAgFormatToolbar();
    } else if (activeScreen === 'custom-table-screen' && state.activeCustomTableId) {
      state.ctSelectedCell = null;
      state.ctSelectedRange = null;
      state.ctSelectedCols.clear();
      state.ctSelectedRows.clear();
      state.ctSelectedCells.clear();
      const tbody = document.getElementById('ct-table-body');
      if (tbody) {
        tbody.querySelectorAll('.ct-row-select-checkbox').forEach(cb => {
          cb.checked = true;
          state.ctSelectedRows.add(cb.value);
        });
      }
      const allCb = document.getElementById('ct-select-all-rows');
      if (allCb) allCb.checked = true;
      updateCtSelectionHighlight();
      syncCtFormatToolbar();
    } else if (activeScreen === 'dbmake-screen') {
      state.dbmakeSelectedCell = null;
      state.dbmakeSelectedRange = null;
      state.dbmakeSelectedRows.clear();
      state.dbmakeSelectedCols.clear();
      state.dbmakeSelectedCells.clear();
      const tbody = document.getElementById('dbmake-table-body');
      if (tbody) {
        tbody.querySelectorAll('tr').forEach((_, idx) => state.dbmakeSelectedRows.add(idx));
      }
      renderDbmakePartners();
      syncDbmakeFormatToolbar();
    }
  }

  // Ctrl + C (または Cmd + C)
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
    // 入力フィールド、テキストエリア、または選択中のセル編集インプットにフォーカスがある場合はデフォルト挙動を優先
    if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
      return;
    }

    const activeScreen = state.currentView; // 'jo-info-screen', 'applicant-info-screen', 'agency-info-screen', 'dbmake-screen'
    if (!activeScreen) return;

    let copyText = '';

    if (activeScreen === 'jo-info-screen') {
      copyText = getSelectedTableText('jo', activeScreen, state.joSelectedCell, state.joSelectedRange, state.joColumns);
    } else if (activeScreen === 'applicant-info-screen') {
      copyText = getSelectedTableText('ap', activeScreen, state.apSelectedCell, state.apSelectedRange, state.apColumns);
    } else if (activeScreen === 'agency-info-screen') {
      copyText = getSelectedTableText('ag', activeScreen, state.agSelectedCell, state.agSelectedRange, state.agColumns);
    } else if (activeScreen === 'dbmake-screen') {
      copyText = getSelectedTableText('dbmake', activeScreen, state.dbmakeSelectedCell, state.dbmakeSelectedRange, state.dbmakeColumns);
    }

    if (copyText) {
      e.preventDefault();
      copyToClipboard(copyText);
    }
  }
});

// 現在選択されているセルのテキストをTSV形式（タブ区切り）で取得するヘルパー
function getSelectedTableText(type, activeScreen, selectedCell, selectedRange, columns) {
  const tbody = document.querySelector(`#${activeScreen} tbody`) || document.getElementById('dbmake-table-body');
  if (!tbody) return '';

  const rows = tbody.querySelectorAll('tr');

  // 0. 非連続複数セル選択 (Ctrl) がある場合
  const selectedCtds = Array.from(tbody.querySelectorAll('td.selected-cell')).filter(td => !td.classList.contains('row-number-col'));
  if (selectedCtds.length > 1) {
    let minRow = Infinity;
    let maxRow = -Infinity;
    let minCol = Infinity;
    let maxCol = -Infinity;

    rows.forEach((tr, rIdx) => {
      const tds = Array.from(tr.querySelectorAll('td')).filter(td => !td.classList.contains('row-number-col'));
      tds.forEach((td, cIdx) => {
        if (td.classList.contains('selected-cell')) {
          minRow = Math.min(minRow, rIdx);
          maxRow = Math.max(maxRow, rIdx);
          minCol = Math.min(minCol, cIdx);
          maxCol = Math.max(maxCol, cIdx);
        }
      });
    });

    if (minRow !== Infinity) {
      let textLines = [];
      for (let r = minRow; r <= maxRow; r++) {
        const tr = rows[r];
        const tds = Array.from(tr.querySelectorAll('td')).filter(td => !td.classList.contains('row-number-col'));
        let lineCells = [];
        for (let c = minCol; c <= maxCol; c++) {
          if (c < tds.length) {
            const td = tds[c];
            if (td.classList.contains('selected-cell')) {
              let cellText = td.innerText || td.textContent || '';
              cellText = cellText.replace(/[☆★]/g, '').trim();
              lineCells.push(cellText);
            } else {
              lineCells.push('');
            }
          } else {
            lineCells.push('');
          }
        }
        textLines.push(lineCells.join('\t'));
      }
      return textLines.join('\n');
    }
  }

  // 1. ドラッグやShift選択による範囲選択がある場合
  if (selectedRange) {
    const startRow = Math.min(selectedRange.startRow, selectedRange.endRow);
    const endRow = Math.max(selectedRange.startRow, selectedRange.endRow);
    const startCol = Math.min(selectedRange.startCol, selectedRange.endCol);
    const endCol = Math.max(selectedRange.startCol, selectedRange.endCol);

    let textLines = [];

    for (let r = startRow; r <= endRow; r++) {
      if (r >= rows.length) continue;
      const tr = rows[r];
      const tds = tr.querySelectorAll('td');
      const dataTds = Array.from(tds).filter(td => !td.classList.contains('row-number-col'));

      let lineCells = [];
      for (let c = startCol; c <= endCol; c++) {
        if (c >= dataTds.length) continue;
        const td = dataTds[c];
        let cellText = td.innerText || td.textContent || '';
        cellText = cellText.replace(/[☆★]/g, '').trim();
        lineCells.push(cellText);
      }
      textLines.push(lineCells.join('\t'));
    }
    return textLines.join('\n');
  }

  // 2. 単一セル選択がある場合
  if (selectedCell) {
    if (selectedCell.row < rows.length) {
      const tr = rows[selectedCell.row];
      const tds = tr.querySelectorAll('td');
      const dataTds = Array.from(tds).filter(td => !td.classList.contains('row-number-col'));
      if (selectedCell.col < dataTds.length) {
        let cellText = dataTds[selectedCell.col].innerText || dataTds[selectedCell.col].textContent || '';
        cellText = cellText.replace(/[☆★]/g, '').trim();
        return cellText;
      }
    }
  }

  return '';
}

// ==========================================
// 15. ホーム画面 グローバル横断マスタ検索機能
// ==========================================

// 横断検索実行ロジック本体
function executeGlobalMasterSearch(query) {
  if (!query) return [];

  const cleanQuery = query.toLowerCase().trim();
  const matchedCustomersMap = new Map();

  const addMatch = (customerId, name, corp, sourceName) => {
    if (!customerId) return;
    if (matchedCustomersMap.has(customerId)) {
      const match = matchedCustomersMap.get(customerId);
      if (!match.sources.includes(sourceName)) {
        match.sources.push(sourceName);
      }
    } else {
      matchedCustomersMap.set(customerId, {
        id: customerId,
        name: name || '（氏名未設定）',
        corp: corp || '（法人名未設定）',
        sources: [sourceName]
      });
    }
  };

  // 1. 顧客マスタ (state.customers) からの検索
  state.customers.forEach(c => {
    const idMatch = c.id && c.id.toLowerCase() === cleanQuery;
    const nameMatch = c.name && c.name.toLowerCase().includes(cleanQuery);
    const furiganaMatch = c.furigana && c.furigana.toLowerCase().includes(cleanQuery);
    const corpMatch = c.corp && c.corp.toLowerCase().includes(cleanQuery);

    if (idMatch || nameMatch || furiganaMatch || corpMatch) {
      addMatch(c.id, c.name, c.corp, '顧客基本マスタ');
    }
  });

  // 2. JO契約 (state.joContracts) からの検索
  if (state.joContracts) {
    state.joContracts.forEach(jo => {
      const pid = jo.customerPersonalityId || jo.customerId;
      const cidMatch = jo.customerId && jo.customerId.toLowerCase() === cleanQuery;
      const pidMatch = pid && pid.toLowerCase() === cleanQuery;
      const corpMatch = jo.corpName && jo.corpName.toLowerCase().includes(cleanQuery);
      const corpKanaMatch = jo.corpFurigana && jo.corpFurigana.toLowerCase().includes(cleanQuery);
      const repMatch = jo.representative && jo.representative.toLowerCase().includes(cleanQuery);
      const repKanaMatch = jo.repFurigana && jo.repFurigana.toLowerCase().includes(cleanQuery);

      if (cidMatch || pidMatch || corpMatch || corpKanaMatch || repMatch || repKanaMatch) {
        addMatch(pid, repMatch ? jo.representative : (jo.customerName || jo.representative), jo.corpName, 'JO契約マスタ');
      }
    });
  }

  // 3. 申込者情報 (state.apContracts) からの検索
  if (state.apContracts) {
    state.apContracts.forEach(ap => {
      const pid = ap.customerPersonalityId || ap.customerId;
      const cidMatch = ap.customerId && ap.customerId.toLowerCase() === cleanQuery;
      const pidMatch = pid && pid.toLowerCase() === cleanQuery;
      const nameMatch = ap.name && ap.name.toLowerCase().includes(cleanQuery);
      const furiganaMatch = ap.furigana && ap.furigana.toLowerCase().includes(cleanQuery);
      const corpMatch = ap.corpName && ap.corpName.toLowerCase().includes(cleanQuery);

      if (cidMatch || pidMatch || nameMatch || furiganaMatch || corpMatch) {
        addMatch(pid, ap.name, ap.corpName, '申込者契約マスタ');
      }
    });
  }

  // 4. 代理店情報 (state.agentContracts) からの検索
  if (state.agentContracts) {
    state.agentContracts.forEach(ag => {
      const pid = ag.customerPersonalityId;
      const pidMatch = pid && pid.toLowerCase() === cleanQuery;
      const nameMatch = ag.name && ag.name.toLowerCase().includes(cleanQuery);
      const furiganaMatch = ag.furigana && ag.furigana.toLowerCase().includes(cleanQuery);
      const corpMatch = ag.corpName && ag.corpName.toLowerCase().includes(cleanQuery);

      if (pidMatch || nameMatch || furiganaMatch || corpMatch) {
        addMatch(pid, ag.name, ag.corpName, '代理店契約マスタ');
      }
    });
  }

  // 5. パートナー情報 (dbmakePartners) からの検索
  if (typeof dbmakePartners !== 'undefined' && dbmakePartners) {
    dbmakePartners.forEach(pt => {
      const pid = pt.id;
      const pidMatch = pid && pid.toLowerCase() === cleanQuery;
      const nameMatch = pt.representativeName && pt.representativeName.toLowerCase().includes(cleanQuery);
      const corpMatch = pt.registeredName && pt.registeredName.toLowerCase().includes(cleanQuery);

      if (pidMatch || nameMatch || corpMatch) {
        addMatch(pid, pt.representativeName, pt.registeredName, 'パートナー契約マスタ');
      }
    });
  }

  return Array.from(matchedCustomersMap.values());
}

// 複数検索結果のドロップダウン描画
function renderGlobalSearchResults(results) {
  const container = document.getElementById('global-search-results');
  if (!container) return;
  container.innerHTML = '';

  if (results.length === 0) {
    container.style.display = 'none';
    return;
  }

  results.forEach(res => {
    const item = document.createElement('div');
    item.className = 'global-search-result-item';
    
    const badgeText = res.sources.join(' / ');

    item.innerHTML = `
      <div>
        <div class="item-title">${res.name}</div>
        <div class="item-subtitle">${res.corp !== '（法人名未設定）' ? res.corp : ''}</div>
        <div style="margin-top: 0.2rem; display: flex; gap: 0.4rem; align-items: center;">
          <span class="item-id">${res.id}</span>
          <span class="item-badge" style="font-size: 0.6rem;">${badgeText}</span>
        </div>
      </div>
      <span style="font-size: 0.8rem; color: var(--primary); font-weight: bold;">詳細 ➔</span>
    `;

    item.addEventListener('click', () => {
      container.style.display = 'none';
      document.getElementById('global-search-input').value = '';
      openCustomerDetailTab(res.id);
    });

    container.appendChild(item);
  });

  container.style.display = 'flex';
}

// 検索アクションのハンドラ
function triggerGlobalSearch() {
  const inputEl = document.getElementById('global-search-input');
  const emptyMsg = document.getElementById('global-search-empty-msg');
  const resultsContainer = document.getElementById('global-search-results');
  if (!inputEl) return;

  const query = inputEl.value.trim();
  if (emptyMsg) emptyMsg.style.display = 'none';
  if (resultsContainer) resultsContainer.style.display = 'none';

  if (!query) {
    showToast('検索キーワードを入力してください。', 'warning');
    return;
  }

  const results = executeGlobalMasterSearch(query);

  if (results.length === 0) {
    if (emptyMsg) emptyMsg.style.display = 'block';
    showToast('該当するマスタ情報が見つかりませんでした。', 'warning');
  } else if (results.length === 1) {
    inputEl.value = '';
    openCustomerDetailTab(results[0].id);
    showToast(`${results[0].name} の顧客マスタ詳細を開きました。`, 'success');
  } else {
    renderGlobalSearchResults(results);
    showToast(`${results.length} 件のマスタ情報がヒットしました。選択してください。`, 'info');
  }
}

// アプリ起動時およびイベント登録
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('global-search-input');
  const searchBtn = document.getElementById('global-search-btn');

  if (searchInput && searchBtn) {
    searchBtn.addEventListener('click', triggerGlobalSearch);
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        triggerGlobalSearch();
      }
    });

    document.addEventListener('click', (e) => {
      const resultsContainer = document.getElementById('global-search-results');
      if (resultsContainer && !resultsContainer.contains(e.target) && e.target !== searchInput && e.target !== searchBtn) {
        resultsContainer.style.display = 'none';
      }
    });

    document.addEventListener('copy', (e) => {
      if (state.currentView === 'dbmake-screen') {
        let copyText = '';
        if (state.dbmakeSelectedRange) {
          const minR = Math.min(state.dbmakeSelectedRange.startRow, state.dbmakeSelectedRange.endRow);
          const maxR = Math.max(state.dbmakeSelectedRange.startRow, state.dbmakeSelectedRange.endRow);
          const minC = Math.min(state.dbmakeSelectedRange.startCol, state.dbmakeSelectedRange.endCol);
          const maxC = Math.max(state.dbmakeSelectedRange.startCol, state.dbmakeSelectedRange.endCol);

          const visibleColumnIds = state.dbmakeVisibleColumns || [
            'id', 'registeredName', 'registeredNameKana', 'representativeName', 'representativeNameKana',
            'birthday', 'phoneNumber', 'email', 'zipCode', 'pref', 'city', 'addr1', 'addr2',
            'corpNum', 'invoiceNum', 'reward', 'status', 'recordedBy', 'recordedAt',
            'bank', 'branch', 'accType', 'accNum', 'accHolder', 'remarks'
          ];
          const visibleCols = [
            { id: 'id' }, { id: 'registeredName' }, { id: 'registeredNameKana' },
            { id: 'representativeName' }, { id: 'representativeNameKana' }, { id: 'birthday' },
            { id: 'phoneNumber' }, { id: 'email' }, { id: 'zipCode' }, { id: 'pref' },
            { id: 'city' }, { id: 'addr1' }, { id: 'addr2' }, { id: 'corpNum' },
            { id: 'invoiceNum' }, { id: 'reward' }, { id: 'status' }, { id: 'recordedBy' },
            { id: 'recordedAt' }, { id: 'bank' }, { id: 'branch' }, { id: 'accType' },
            { id: 'accNum' }, { id: 'accHolder' }, { id: 'remarks' }
          ].filter(c => visibleColumnIds.includes(c.id));

          const searchQuery = document.getElementById('dbmake-search-input') ? document.getElementById('dbmake-search-input').value.trim().toLowerCase() : '';
          const statusFilter = document.getElementById('dbmake-status-filter') ? document.getElementById('dbmake-status-filter').value : 'ALL';
          const filtered = dbmakePartners.filter(p => {
            const nameMatch = p.registeredName.toLowerCase().includes(searchQuery);
            const kanaMatch = p.registeredNameKana.toLowerCase().includes(searchQuery);
            const repMatch = p.representativeName.toLowerCase().includes(searchQuery);
            const invoiceMatch = (p.invoiceNum || '').toLowerCase().includes(searchQuery);
            const emailMatch = (p.email || '').toLowerCase().includes(searchQuery);
            const searchMatch = !searchQuery || nameMatch || kanaMatch || repMatch || invoiceMatch || emailMatch;
            const statusMatch = statusFilter === 'ALL' || p.status === statusFilter;
            const favMatch = !dbmakeFilterFav || p.isFavorite;
            return searchMatch && statusMatch && favMatch;
          });

          const rowsText = [];
          for (let r = minR; r <= maxR; r++) {
            const colsText = [];
            for (let c = minC; c <= maxC; c++) {
              const col = visibleCols[c];
              const partner = filtered[r];
              if (partner && col) {
                let val = partner[col.id] || '';
                if (col.id === 'recordedAt' && val) {
                  val = new Date(val).toLocaleDateString('ja-JP');
                }
                if (col.id === 'status') {
                  val = val === 'ACTIVE' ? '稼働中' : '停止中';
                }
                colsText.push(val);
              }
            }
            rowsText.push(colsText.join('\t'));
          }
          copyText = rowsText.join('\n');
        } else if (state.dbmakeSelectedCell) {
          const partner = dbmakePartners.find(p => p.id === state.dbmakeSelectedCell.partnerId);
          const colId = state.dbmakeSelectedCell.colId;
          if (partner) {
            copyText = partner[colId] || '';
            if (colId === 'recordedAt' && copyText) {
              copyText = new Date(copyText).toLocaleDateString('ja-JP');
            }
            if (colId === 'status') {
              copyText = copyText === 'ACTIVE' ? '稼働中' : '停止中';
            }
          }
        }

        if (copyText) {
          e.clipboardData.setData('text/plain', copyText);
          e.preventDefault();
        }
      }
    });
  }
});

// 権限ロールによって閲覧不可なタブを自動で閉じるクリーンアップ関数
function removeRestrictedTabsForRole(role) {
  if (role === 'support') {
    const beforeLen = state.tabs.length;
    state.tabs = state.tabs.filter(t => t.type !== 'agency-info-screen');
    if (state.activeTabId === 'agency-info-screen') {
      state.activeTabId = null;
      switchView('mypage-screen');
    }
    if (beforeLen !== state.tabs.length) {
      renderTabs();
    }
  }
}

// ==========================================
// 🔑 詳細権限管理 &なりすましプレビュー機能 & 操作ログ
// ==========================================

const ALL_ACCOUNTS = [
  { id: 'sales_01', name: '営業担当A (sales_01)' },
  { id: 'sales_02', name: '営業担当B (sales_02)' },
  { id: 'support_01', name: '開設サポートA (support_01)' }
];

function setupPermissionFeatures() {
  // ホーム画面の管理者パネルボタンイベント
  const panelFormBtn = document.getElementById('admin-panel-form-btn');
  if (panelFormBtn) {
    panelFormBtn.addEventListener('click', () => {
      openTab('form-customize-tab', 'form-customize-screen', '📋 フォーム作成');
    });
  }

  const panelTableBtn = document.getElementById('admin-panel-table-btn');
  if (panelTableBtn) {
    panelTableBtn.addEventListener('click', () => {
      openTab('table-creator-tab', 'table-creator-screen', '📊 テーブル作成');
    });
  }

  const panelPermBtn = document.getElementById('admin-panel-perm-btn');
  if (panelPermBtn) {
    panelPermBtn.addEventListener('click', () => {
      openTab('permission-settings-tab', 'permission-settings-screen', '🔑 権限設定');
      initPermissionSettingsScreen();
    });
  }

  const panelAuditBtn = document.getElementById('admin-panel-audit-btn');
  if (panelAuditBtn) {
    panelAuditBtn.addEventListener('click', () => {
      openTab('audit-log-tab', 'audit-log-screen', '📊 操作ログ履歴');
      initAuditLogScreen();
    });
  }

  const panelPartnerBtn = document.getElementById('admin-panel-partner-btn');
  if (panelPartnerBtn) {
    panelPartnerBtn.addEventListener('click', () => {
      openDbmakePage();
    });
  }

  // ホーム画面のフォルダ管理アプリアイコンクリック時のモーダル表示
  const panelFolderBtn = document.getElementById('admin-panel-folder-btn');
  const folderManagerModal = document.getElementById('folder-manager-modal');
  const folderManagerClose = document.getElementById('folder-manager-modal-close');

  if (panelFolderBtn && folderManagerModal) {
    panelFolderBtn.addEventListener('click', () => {
      folderManagerModal.classList.add('active');
      renderModalFolderTree();
    });
  }

  if (folderManagerClose && folderManagerModal) {
    folderManagerClose.addEventListener('click', () => {
      folderManagerModal.classList.remove('active');
    });
    folderManagerModal.addEventListener('click', (e) => {
      if (e.target === folderManagerModal) {
        folderManagerModal.classList.remove('active');
      }
    });
  }

  // ポップアップ内 インライン新規フォルダ作成パネルの制御
  const createFolderBtn = document.getElementById('modal-folder-create-btn');
  const inlinePanel = document.getElementById('inline-folder-creation-panel');
  const inlineInput = document.getElementById('inline-folder-name-input');
  const inlineSubmit = document.getElementById('inline-folder-submit-btn');
  const inlineCancel = document.getElementById('inline-folder-cancel-btn');

  if (createFolderBtn && inlinePanel && !createFolderBtn.dataset.bound) {
    createFolderBtn.dataset.bound = 'true';
    
    // 作成ボタンを押すとインラインフォームを展開してフォーカス
    createFolderBtn.addEventListener('click', () => {
      inlinePanel.style.display = 'block';
      if (inlineInput) {
        inlineInput.value = '';
        inlineInput.focus();
      }
    });

    if (inlineCancel) {
      inlineCancel.addEventListener('click', () => {
        inlinePanel.style.display = 'none';
      });
    }

    const handleCreateFolder = () => {
      const name = inlineInput ? inlineInput.value.trim() : '';
      if (!name) {
        showToast('フォルダ名を入力してください。', 'warning');
        return;
      }

      const folderId = 'cacc_' + Date.now();
      state.customAccordions.push({
        id: folderId,
        name: name,
        parentMenuId: 'root'
      });
      saveCustomAccordions();

      state.permissions.folders[folderId] = ['admin'];
      savePermissions();

      inlinePanel.style.display = 'none';
      renderCustomTableList();
      renderModalFolderTree();
      showToast(`新規フォルダ「${name}」を作成しました。`, 'success');
    };

    if (inlineSubmit) {
      inlineSubmit.addEventListener('click', handleCreateFolder);
    }
    if (inlineInput) {
      inlineInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleCreateFolder();
        }
      });
    }
  }

  // 初回ロード時のフォルダ設定リスト・ツリーの構築
  renderModalFolderTree();

  // 旧アコーディオン追加・遷移ボタン用の退避的バインド（メニューからは隠れています）
  const addFolderBtnOld = document.getElementById('add-custom-accordion-btn');
  if (addFolderBtnOld) {
    addFolderBtnOld.addEventListener('click', () => {
      const name = prompt('追加するフォルダの名前を入力してください：');
      if (!name || !name.trim()) return;
      
      const folderId = 'cacc_' + Date.now();
      state.customAccordions.push({
        id: folderId,
        name: name.trim()
      });
      saveCustomAccordions();
      
      state.permissions.folders[folderId] = ['admin'];
      savePermissions();

      updateParentSelectDropdowns();
      renderCustomTableList();
      showToast(`フォルダ「${name.trim()}」を追加しました。`, 'success');
    });
  }

  const menuPermissionBtn = document.getElementById('menu-permission-settings');
  if (menuPermissionBtn) {
    menuPermissionBtn.addEventListener('click', () => {
      openTab('permission-settings-tab', 'permission-settings-screen', '🔑 権限設定');
      initPermissionSettingsScreen();
    });
  }

  const menuAuditBtn = document.getElementById('menu-audit-log');
  if (menuAuditBtn) {
    menuAuditBtn.addEventListener('click', () => {
      openTab('audit-log-tab', 'audit-log-screen', '📊 操作ログ履歴');
      initAuditLogScreen();
    });
  }

  const endPreviewBtn = document.getElementById('end-preview-btn');
  if (endPreviewBtn) {
    endPreviewBtn.addEventListener('click', () => {
      endImpersonationPreview();
    });
  }
}

function getFolderMenuPath(accId) {
  const path = [];
  const visited = new Set();
  let current = state.customAccordions.find(a => a.id === accId);
  while (current) {
    if (visited.has(current.id)) {
      console.warn("[Folder Path] Circular reference break:", current.id);
      path.unshift(`[循環:${current.name}]`);
      break;
    }
    visited.add(current.id);
    path.unshift(current.name);
    current = state.customAccordions.find(a => a.id === current.parentMenuId);
  }
  return path.join(' ＞ ');
}

function updateParentSelectDropdowns() {
  const tcSelect = document.getElementById('tc-table-parent');
  const ctSelect = document.getElementById('ct-table-parent-select');
  
  const options = [
    { value: 'agency-info', text: '代理店情報' },
    { value: 'jo-info', text: 'JO情報' },
    { value: 'applicant-info', text: '申込者情報' },
    { value: 'appoint', text: 'アポイント情報' },
    { value: 'root', text: 'ルート直下' }
  ];

  state.customAccordions.forEach(acc => {
    options.push({ value: acc.id, text: getFolderMenuPath(acc.id) });
  });

  const renderOpts = (selectEl) => {
    if (!selectEl) return;
    const currentVal = selectEl.value;
    selectEl.innerHTML = '';
    options.forEach(opt => {
      const el = document.createElement('option');
      el.value = opt.value;
      el.textContent = opt.text;
      selectEl.appendChild(el);
    });
    selectEl.value = currentVal || 'root';
  };

  renderOpts(tcSelect);
  renderOpts(ctSelect);
}

function updateAdminFolderAddDropdown() {
  const selectEl = document.getElementById('modal-folder-parent-select');
  if (!selectEl) return;
  const currentVal = selectEl.value;
  selectEl.innerHTML = '<option value="root">ルート直下</option>';
  
  state.customAccordions.forEach(acc => {
    const el = document.createElement('option');
    el.value = acc.id;
    el.textContent = getFolderMenuPath(acc.id);
    selectEl.appendChild(el);
  });
  selectEl.value = currentVal || 'root';
}

function renderAdminPanelFolderList() {
  const tbody = document.getElementById('modal-folder-list-tbody');
  const emptyDiv = document.getElementById('modal-folder-list-empty');
  if (!tbody) return;

  tbody.innerHTML = '';
  
  if (!state.customAccordions || state.customAccordions.length === 0) {
    if (emptyDiv) emptyDiv.style.display = 'block';
    return;
  }
  if (emptyDiv) emptyDiv.style.display = 'none';

  state.customAccordions.forEach(acc => {
    const tr = document.createElement('tr');
    tr.style.borderBottom = '1px solid var(--border-color)';

    // フォルダ名セル
    const tdName = document.createElement('td');
    tdName.style.padding = '0.75rem 0.5rem';
    
    const inputName = document.createElement('input');
    inputName.type = 'text';
    inputName.value = acc.name;
    inputName.style.width = '90%';
    inputName.style.padding = '0.3rem 0.5rem';
    inputName.style.fontSize = '0.85rem';
    inputName.style.border = '1px solid var(--border-color)';
    inputName.style.borderRadius = 'var(--radius-sm)';
    inputName.style.background = 'var(--bg-surface-elevated)';
    inputName.style.color = 'var(--text-primary)';
    inputName.style.outline = 'none';
    
    tdName.appendChild(inputName);

    // 親フォルダセル
    const tdParent = document.createElement('td');
    tdParent.style.padding = '0.75rem 0.5rem';
    
    const selectParent = document.createElement('select');
    selectParent.style.width = '90%';
    selectParent.style.padding = '0.3rem 0.5rem';
    selectParent.style.fontSize = '0.85rem';
    selectParent.style.border = '1px solid var(--border-color)';
    selectParent.style.borderRadius = 'var(--radius-sm)';
    selectParent.style.background = 'var(--bg-surface-elevated)';
    selectParent.style.color = 'var(--text-primary)';
    selectParent.style.cursor = 'pointer';
    selectParent.style.outline = 'none';

    // 選択肢の生成（自身とその子孫を除外）
    const options = [
      { value: 'root', text: 'ルート直下' }
    ];

    // 自身の子孫かどうか判定する関数
    const isDescendant = (parentAccId, childAccId) => {
      let current = state.customAccordions.find(a => a.id === childAccId);
      while (current) {
        if (current.parentMenuId === parentAccId) return true;
        current = state.customAccordions.find(a => a.id === current.parentMenuId);
      }
      return false;
    };

    state.customAccordions.forEach(otherAcc => {
      if (otherAcc.id === acc.id) return; // 自分自身は除外
      if (isDescendant(acc.id, otherAcc.id)) return; // 自分の子孫フォルダは除外（循環参照防止）
      options.push({ value: otherAcc.id, text: getFolderMenuPath(otherAcc.id) });
    });

    options.forEach(opt => {
      const el = document.createElement('option');
      el.value = opt.value;
      el.textContent = opt.text;
      selectParent.appendChild(el);
    });

    selectParent.value = acc.parentMenuId || 'root';
    tdParent.appendChild(selectParent);

    // 操作ボタンセル
    const tdActions = document.createElement('td');
    tdActions.style.padding = '0.75rem 0.5rem';
    tdActions.style.textAlign = 'center';
    
    const saveBtn = document.createElement('button');
    saveBtn.className = 'btn-primary';
    saveBtn.style.padding = '0.3rem 0.6rem';
    saveBtn.style.fontSize = '0.8rem';
    saveBtn.style.marginRight = '0.5rem';
    saveBtn.textContent = '保存';
    saveBtn.title = 'フォルダ名や配置場所の変更を確定して保存';
    saveBtn.addEventListener('click', () => {
      const newName = inputName.value.trim();
      if (!newName) {
        showToast('フォルダ名を入力してください。', 'warning');
        return;
      }
      const newParent = selectParent.value;
      
      // 循環参照の厳格な検証
      if (newParent === acc.id) {
        showToast('自分自身を親フォルダに指定することはできません。', 'warning');
        return;
      }
      if (isDescendant(acc.id, newParent)) {
        showToast('子孫フォルダを親フォルダに指定することはできません。', 'warning');
        return;
      }

      // 名前の変更と配置先の更新
      acc.name = newName;
      acc.parentMenuId = newParent;
      
      saveCustomAccordions();
      renderCustomTableList();
      updateParentSelectDropdowns();
      updateAdminFolderAddDropdown();
      renderAdminPanelFolderList();
      renderModalFolderTree();
      showToast('フォルダ設定を保存しました。', 'success');
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.style.padding = '0.3rem 0.6rem';
    deleteBtn.style.fontSize = '0.8rem';
    deleteBtn.style.border = 'none';
    deleteBtn.style.color = '#fff';
    deleteBtn.style.borderRadius = 'var(--radius-sm)';
    deleteBtn.style.marginLeft = '0.3rem';
    
    if (acc.isSystem) {
      deleteBtn.style.background = 'var(--text-muted)';
      deleteBtn.style.cursor = 'not-allowed';
      deleteBtn.disabled = true;
      deleteBtn.title = 'システム標準フォルダは削除できません';
    } else {
      deleteBtn.style.background = '#ef4444';
      deleteBtn.style.cursor = 'pointer';
      deleteBtn.title = 'このフォルダを削除します';
    }
    
    deleteBtn.textContent = '削除';
    deleteBtn.addEventListener('click', () => {
      if (acc.isSystem) return;
      if (confirm(`フォルダ「${acc.name}」を削除しますか？\n※中のテーブルはルート直下に移動されます。`)) {
        deleteCustomAccordion(acc.id);
      }
    });

    tdActions.appendChild(saveBtn);
    tdActions.appendChild(deleteBtn);

    tr.appendChild(tdName);
    tr.appendChild(tdParent);
    tr.appendChild(tdActions);

    tbody.appendChild(tr);
  });

  // モーダル内のドラッグ＆ドロップ用ツリーを再描画
  renderModalFolderTree();
}

// ================= アプリ内カスタムダイアログ (confirm / prompt の代替) =================
function showAppConfirm(title, message, onOk) {
  const overlay = document.getElementById('custom-dialog-overlay');
  const titleEl = document.getElementById('custom-dialog-title');
  const msgEl = document.getElementById('custom-dialog-message');
  const inputContainer = document.getElementById('custom-dialog-input-container');
  const okBtn = document.getElementById('custom-dialog-ok-btn');
  const cancelBtn = document.getElementById('custom-dialog-cancel-btn');

  if (!overlay) {
    if (confirm(message)) onOk();
    return;
  }

  titleEl.textContent = title || '❓ 確認';
  msgEl.textContent = message || '';
  inputContainer.style.display = 'none';

  overlay.style.display = 'flex';
  overlay.classList.add('active');

  const closeDialog = () => {
    overlay.style.display = 'none';
    overlay.classList.remove('active');
  };

  okBtn.onclick = () => {
    closeDialog();
    if (onOk) onOk();
  };
  cancelBtn.onclick = closeDialog;
}

function showAppPrompt(title, message, defaultValue, onOk) {
  const overlay = document.getElementById('custom-dialog-overlay');
  const titleEl = document.getElementById('custom-dialog-title');
  const msgEl = document.getElementById('custom-dialog-message');
  const inputContainer = document.getElementById('custom-dialog-input-container');
  const inputEl = document.getElementById('custom-dialog-input');
  const okBtn = document.getElementById('custom-dialog-ok-btn');
  const cancelBtn = document.getElementById('custom-dialog-cancel-btn');

  if (!overlay) {
    const res = prompt(message, defaultValue);
    if (res !== null) onOk(res);
    return;
  }

  titleEl.textContent = title || '✏️ 入力';
  msgEl.textContent = message || '';
  inputContainer.style.display = 'block';
  inputEl.value = defaultValue || '';

  overlay.style.display = 'flex';
  overlay.classList.add('active');

  setTimeout(() => {
    inputEl.focus();
    inputEl.select();
  }, 50);

  const closeDialog = () => {
    overlay.style.display = 'none';
    overlay.classList.remove('active');
  };

  const handleOk = () => {
    const val = inputEl.value.trim();
    closeDialog();
    if (val && onOk) onOk(val);
  };

  okBtn.onclick = handleOk;
  cancelBtn.onclick = closeDialog;
  inputEl.onkeydown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleOk();
    }
  };
}

// 右クリックコンテキストメニューの状態管理
let activeContextMenuTarget = null;

function hideContextMenu() {
  const menu = document.getElementById('folder-context-menu');
  if (menu) menu.style.display = 'none';
  activeContextMenuTarget = null;
}

function showContextMenu(x, y, type, targetObj) {
  const menu = document.getElementById('folder-context-menu');
  if (!menu) return;

  activeContextMenuTarget = { type, targetObj };
  
  // 削除ボタンの可否
  const delBtn = document.getElementById('ctx-delete');
  if (delBtn) {
    if (type === 'folder' && targetObj.isSystem) {
      delBtn.style.display = 'none';
    } else if (type === 'item' && ['agency-info-screen', 'jo-info-screen', 'applicant-info-screen', 'appointment-new', 'appointment-existing', 'drafts-view-screen', 'history-view-screen', 'official-id-link'].includes(targetObj.id)) {
      delBtn.style.display = 'none';
    } else {
      delBtn.style.display = 'flex';
    }
  }

  // 「最上位階層に戻す」ボタンの可否（別の配下に入っている場合のみ表示）
  const moveRootBtn = document.getElementById('ctx-move-root');
  if (moveRootBtn) {
    const parentId = normalizeFolderId(targetObj.parentMenuId || 'root');
    moveRootBtn.style.display = (parentId !== 'root') ? 'flex' : 'none';
  }

  // 画面枠外にはみ出さないように配置
  menu.style.display = 'block';
  const menuWidth = menu.offsetWidth || 160;
  const menuHeight = menu.offsetHeight || 120;
  const posX = (x + menuWidth > window.innerWidth) ? window.innerWidth - menuWidth - 10 : x;
  const posY = (y + menuHeight > window.innerHeight) ? window.innerHeight - menuHeight - 10 : y;

  menu.style.left = `${posX}px`;
  menu.style.top = `${posY}px`;
}

// コンテキストメニューのイベント初期化 (1回のみ)
function initContextMenuEvents() {
  const menu = document.getElementById('folder-context-menu');
  if (!menu || menu.dataset.initialized) return;
  menu.dataset.initialized = 'true';

  document.addEventListener('click', (e) => {
    if (!e.target.closest('#folder-context-menu')) hideContextMenu();
  });

  const renameBtn = document.getElementById('ctx-rename');
  if (renameBtn) {
    renameBtn.addEventListener('click', () => {
      if (!activeContextMenuTarget) return;
      const { type, targetObj } = activeContextMenuTarget;
      hideContextMenu();

      showAppPrompt(
        '名前の変更',
        `新しい${type === 'folder' ? 'フォルダ名' : '名前'}を入力してください:`,
        targetObj.name,
        (newName) => {
          if (newName && newName !== targetObj.name) {
            targetObj.name = newName;
            if (type === 'folder') {
              saveCustomAccordions();
            } else {
              saveCustomTables();
            }
            renderCustomTableList();
            renderModalFolderTree();
            showToast('名前を変更しました。', 'success');
          }
        }
      );
    });
  }

  const moveRootBtn = document.getElementById('ctx-move-root');
  if (moveRootBtn) {
    moveRootBtn.addEventListener('click', () => {
      if (!activeContextMenuTarget) return;
      const { type, targetObj } = activeContextMenuTarget;
      hideContextMenu();

      targetObj.parentMenuId = 'root';
      if (type === 'folder') {
        saveCustomAccordions();
      } else {
        saveCustomTables();
      }
      renderCustomTableList();
      renderModalFolderTree();
      showToast(`「${targetObj.name}」を最上位（親フォルダ階層）に戻しました。`, 'success');
    });
  }

  const delBtn = document.getElementById('ctx-delete');
  if (delBtn) {
    delBtn.addEventListener('click', () => {
      if (!activeContextMenuTarget) return;
      const { type, targetObj } = activeContextMenuTarget;
      hideContextMenu();

      if (type === 'folder') {
        deleteCustomAccordion(targetObj.id);
      } else if (type === 'item') {
        showAppConfirm('削除の確認', `「${targetObj.name}」を削除しますか？`, () => {
          deleteCustomTable(targetObj.id);
        });
      }
    });
  }
}

function renderModalFolderTree() {
  const container = document.getElementById('modal-folder-tree-container');
  const rootDropzone = document.getElementById('modal-tree-root-dropzone');
  if (!container) return;

  ensureStandardAccordionsInState();
  ensureStandardTablesInState();
  initContextMenuEvents();

  container.innerHTML = '';

  // 検索フィルターバインド
  const searchInput = document.getElementById('modal-folder-search-input');
  const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : '';
  if (searchInput && !searchInput.dataset.bound) {
    searchInput.dataset.bound = 'true';
    searchInput.addEventListener('input', () => {
      renderModalFolderTree();
    });
  }

  // 1. ルートドロップゾーンのイベント設定
  if (rootDropzone) {
    rootDropzone.innerHTML = '📥 ここにドラッグ＆ドロップして 🏠 最上位（親フォルダ階層）へ取り出す';
    rootDropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      rootDropzone.style.borderColor = 'var(--primary)';
      rootDropzone.style.background = 'rgba(var(--primary-rgb), 0.1)';
      rootDropzone.style.color = 'var(--primary)';
    });
    rootDropzone.addEventListener('dragleave', () => {
      rootDropzone.style.borderColor = 'var(--border-color)';
      rootDropzone.style.background = 'var(--bg-surface-elevated)';
      rootDropzone.style.color = 'var(--text-primary)';
    });
    rootDropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      rootDropzone.style.borderColor = 'var(--border-color)';
      rootDropzone.style.background = 'var(--bg-surface-elevated)';
      rootDropzone.style.color = 'var(--text-primary)';

      const dragSourceId = e.dataTransfer.getData('text/plain');
      const dragType = e.dataTransfer.getData('application/cos-type');
      if (!dragSourceId) return;

      if (dragType === 'folder') {
        const acc = state.customAccordions.find(a => a.id === dragSourceId);
        if (acc) {
          acc.parentMenuId = 'root';
          saveCustomAccordions();
          showToast(`フォルダ「${acc.name}」を最上位（親フォルダ階層）に取り出しました。`, 'success');
        }
      } else if (dragType === 'table') {
        const tbl = state.customTables.find(t => t.id === dragSourceId);
        if (tbl) {
          tbl.parentMenuId = 'root';
          saveCustomTables();
          showToast(`「${tbl.name}」を最上位（親フォルダ階層）に取り出しました。`, 'success');
        }
      }

      renderCustomTableList();
      renderModalFolderTree();
    });
  }

  // 2. 再帰的ツリーノードレンダラー (開閉トグル ＋ 右クリックメニュー ＋ 検索フィルタ)
  const renderTreeNode = (parentId, indentLevel, targetContainer) => {
    const targetParentId = normalizeFolderId(parentId);

    // フォルダの抽出
    let childFolders = state.customAccordions.filter(acc => normalizeFolderId(acc.parentMenuId || 'root') === targetParentId);
    
    childFolders.forEach(acc => {
      // 検索一致判定（子要素に検索語が含まれるかも含む）
      if (searchTerm && !acc.name.toLowerCase().includes(searchTerm)) {
        const hasMatchingChild = state.customTables.some(t => normalizeFolderId(t.parentMenuId) === acc.id && t.name.toLowerCase().includes(searchTerm)) ||
                                 state.customAccordions.some(a => normalizeFolderId(a.parentMenuId) === acc.id && a.name.toLowerCase().includes(searchTerm));
        if (!hasMatchingChild) return;
      }

      const folderNode = document.createElement('div');
      folderNode.className = 'tree-node-item';
      folderNode.style.marginLeft = `${indentLevel * 1.1}rem`;
      folderNode.style.padding = '0.35rem 0.6rem';
      folderNode.style.margin = '0.2rem 0';
      folderNode.style.borderRadius = 'var(--radius-sm)';
      folderNode.style.border = '1px solid var(--border-color)';
      folderNode.style.background = 'var(--bg-surface)';
      folderNode.style.cursor = 'grab';
      folderNode.style.display = 'flex';
      folderNode.style.alignItems = 'center';
      folderNode.style.gap = '0.4rem';
      folderNode.style.fontSize = '0.83rem';
      folderNode.style.fontWeight = '600';
      folderNode.style.transition = 'all 0.15s ease';
      
      // 開閉トグル矢印ボタン (検索語がある時以外は初期は親フォルダのみ見せて配下は閉じる ▶)
      const toggleArrow = document.createElement('span');
      toggleArrow.textContent = searchTerm ? '▼' : '▶';
      toggleArrow.style.cssText = 'cursor: pointer; font-size: 0.65rem; color: var(--text-muted); width: 14px; text-align: center; display: inline-block; user-select: none;';
      
      // フォルダ管理内は全フォルダのアイコンを 📁 (フォルダマーク) で固定表示
      const folderLabel = document.createElement('span');
      folderLabel.innerHTML = `<span class="user-custom-icon user-custom-icon-emoji">📁</span> <span>${acc.name}</span>`;
      folderLabel.style.cursor = 'pointer';
      folderLabel.style.display = 'flex';
      folderLabel.style.alignItems = 'center';
      folderLabel.style.gap = '0.35rem';

      folderNode.appendChild(toggleArrow);
      folderNode.appendChild(folderLabel);

      // 右クリック（コンテキスト）メニュー
      folderNode.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        e.stopPropagation();
        showContextMenu(e.clientX, e.clientY, 'folder', acc);
      });

      // ドラッグ属性
      folderNode.draggable = true;
      folderNode.addEventListener('dragstart', (e) => {
        e.stopPropagation();
        e.dataTransfer.setData('text/plain', acc.id);
        e.dataTransfer.setData('application/cos-type', 'folder');
        folderNode.style.opacity = '0.5';
      });
      folderNode.addEventListener('dragend', () => {
        folderNode.style.opacity = '1';
      });

      // ドロップゾーン（フォルダの上にドロップして配属する）
      folderNode.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const dragSourceId = e.dataTransfer.getData('text/plain');
        const dragType = e.dataTransfer.getData('application/cos-type');
        
        if (dragSourceId === acc.id) return;
        
        if (dragType === 'folder') {
          const isDescendant = (parentAccId, childAccId) => {
            let current = state.customAccordions.find(a => a.id === childAccId);
            while (current) {
              if (current.parentMenuId === parentAccId) return true;
              current = state.customAccordions.find(a => a.id === current.parentMenuId);
            }
            return false;
          };
          if (isDescendant(dragSourceId, acc.id)) return;
        }

        folderNode.style.background = 'rgba(var(--primary-rgb), 0.15)';
        folderNode.style.borderColor = 'var(--primary)';
      });
      folderNode.addEventListener('dragleave', () => {
        folderNode.style.background = 'var(--bg-surface)';
        folderNode.style.borderColor = 'var(--border-color)';
      });
      folderNode.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        folderNode.style.background = 'var(--bg-surface)';
        folderNode.style.borderColor = 'var(--border-color)';

        const dragSourceId = e.dataTransfer.getData('text/plain');
        const dragType = e.dataTransfer.getData('application/cos-type');
        
        if (!dragSourceId || dragSourceId === acc.id) return;

        if (dragType === 'folder') {
          const srcAcc = state.customAccordions.find(a => a.id === dragSourceId);
          if (srcAcc) {
            srcAcc.parentMenuId = acc.id;
            saveCustomAccordions();
            showToast(`フォルダ「${srcAcc.name}」を「${acc.name}」配下に配置しました。`, 'success');
          }
        } else if (dragType === 'table') {
          const srcTbl = state.customTables.find(t => t.id === dragSourceId);
          if (srcTbl) {
            srcTbl.parentMenuId = acc.id;
            saveCustomTables();
            showToast(`「${srcTbl.name}」を「${acc.name}」配下に配置しました。`, 'success');
          }
        }

        renderCustomTableList();
        renderModalFolderTree();
      });

      targetContainer.appendChild(folderNode);

      // 配下の子要素を格納するコンテナ (検索語がある時以外は初期状態は非表示 none で親のみ表示)
      const childContainer = document.createElement('div');
      childContainer.className = 'modal-tree-child-container';
      childContainer.style.display = searchTerm ? 'block' : 'none';
      targetContainer.appendChild(childContainer);

      // 開閉クリックイベントの設定
      const toggleExpand = (e) => {
        if (e) e.stopPropagation();
        const isHidden = childContainer.style.display === 'none';
        childContainer.style.display = isHidden ? 'block' : 'none';
        toggleArrow.textContent = isHidden ? '▼' : '▶';
      };

      toggleArrow.addEventListener('click', toggleExpand);
      folderLabel.addEventListener('click', toggleExpand);

      // 子要素（子フォルダ・所属テーブル・サブメニュー項目）を再帰的描画
      renderTreeNode(acc.id, indentLevel + 1, childContainer);
    });

    // 所属テーブル・サブメニュー項目の抽出
    let childTables = state.customTables.filter(t => normalizeFolderId(t.parentMenuId || 'root') === targetParentId);

    childTables.forEach(tbl => {
      if (searchTerm && !tbl.name.toLowerCase().includes(searchTerm)) return;

      const tableNode = document.createElement('div');
      tableNode.className = 'tree-node-item';
      tableNode.style.marginLeft = `${indentLevel * 1.1}rem`;
      tableNode.style.padding = '0.3rem 0.5rem';
      tableNode.style.margin = '0.15rem 0';
      tableNode.style.borderRadius = 'var(--radius-sm)';
      tableNode.style.border = '1px solid rgba(var(--border-color-rgb), 0.6)';
      tableNode.style.background = 'var(--bg-surface)';
      tableNode.style.cursor = 'grab';
      tableNode.style.display = 'flex';
      tableNode.style.alignItems = 'center';
      tableNode.style.gap = '0.35rem';
      tableNode.style.fontSize = '0.8rem';
      tableNode.style.transition = 'all 0.15s ease';
      
      // テーブル項目は直感的なデータテーブルマーク 📊 / その他機能画面項目は 📝
      const isSub = ['appointment-new', 'appointment-existing', 'drafts-view-screen', 'history-view-screen', 'official-id-link'].includes(tbl.id);
      const itemIcon = isSub ? '📝' : '📊';

      tableNode.innerHTML = `<span class="user-custom-icon user-custom-icon-emoji">${itemIcon}</span> <span>${tbl.name}</span>`;

      // 右クリック（コンテキスト）メニュー
      tableNode.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        e.stopPropagation();
        showContextMenu(e.clientX, e.clientY, 'item', tbl);
      });

      // テーブルはドラッグのみ可能
      tableNode.draggable = true;
      tableNode.addEventListener('dragstart', (e) => {
        e.stopPropagation();
        e.dataTransfer.setData('text/plain', tbl.id);
        e.dataTransfer.setData('application/cos-type', 'table');
        tableNode.style.opacity = '0.5';
      });
      tableNode.addEventListener('dragend', () => {
        tableNode.style.opacity = '1';
      });

      targetContainer.appendChild(tableNode);
    });
  };

  // ルートからツリー構築を開始
  renderTreeNode('root', 0, container);
}

function renderPermissionTree() {
  const treeContainer = document.getElementById('permission-tree');
  if (!treeContainer) return;
  treeContainer.innerHTML = '';

  const createTreeItem = (label, type, targetId, children = [], extra = {}) => {
    const item = document.createElement('div');
    item.className = 'tree-item';
    item.style.paddingLeft = '0.75rem';
    item.style.marginTop = '0.25rem';

    const header = document.createElement('div');
    header.className = 'tree-header';
    header.style.display = 'flex';
    header.style.alignItems = 'center';
    header.style.cursor = 'pointer';
    header.style.padding = '0.3rem 0.5rem';
    header.style.borderRadius = 'var(--radius-sm)';
    header.style.fontSize = '0.85rem';
    header.style.color = 'var(--text-secondary)';
    header.style.transition = 'background 0.2s';
    
    header.addEventListener('mouseenter', () => header.style.background = 'var(--bg-surface-elevated)');
    header.addEventListener('mouseleave', () => {
      if (state.activePermissionTarget?.targetId !== targetId) {
        header.style.background = 'none';
      }
    });

    header.addEventListener('click', () => {
      treeContainer.querySelectorAll('.tree-header').forEach(h => {
        h.style.background = 'none';
        h.style.color = 'var(--text-secondary)';
      });
      header.style.background = 'rgba(26, 115, 232, 0.15)';
      header.style.color = 'var(--primary)';

      state.activePermissionTarget = { type, targetId, label, extra };
      
      if (type === 'folder') {
        switchPermissionTab('folder-tab');
      } else if (type === 'table') {
        switchPermissionTab('table-tab');
      } else if (type === 'column') {
        switchPermissionTab('column-tab');
      }
      renderPermissionSettingsDetails();
    });

    const icon = document.createElement('span');
    icon.style.marginRight = '0.4rem';
    if (type === 'folder') icon.textContent = '📁';
    else if (type === 'table') icon.textContent = '📋';
    else if (type === 'column') icon.textContent = '🧱';
    header.appendChild(icon);

    const span = document.createElement('span');
    span.textContent = label;
    header.appendChild(span);
    item.appendChild(header);

    if (children.length > 0) {
      const childContainer = document.createElement('div');
      childContainer.className = 'tree-children';
      childContainer.style.paddingLeft = '0.75rem';
      childContainer.style.borderLeft = '1px dashed var(--border-color)';
      childContainer.style.marginLeft = '0.6rem';
      children.forEach(child => childContainer.appendChild(child));
      item.appendChild(childContainer);
    }

    return item;
  };

  const folders = [
    {
      id: 'appoint-accordion',
      name: 'アポイント情報',
      tables: []
    },
    {
      id: 'agency-accordion',
      name: '代理店情報',
      tables: [
        { id: 'agency-info-screen', name: '📊 基本マスタ', columns: state.agColumns }
      ]
    },
    {
      id: 'jo-accordion',
      name: 'JO情報',
      tables: [
        { id: 'jo-info-screen', name: '📊 基本マスタ', columns: state.joColumns }
      ]
    },
    {
      id: 'applicant-accordion',
      name: '申込者情報',
      tables: [
        { id: 'applicant-info-screen', name: '📊 基本マスタ', columns: state.apColumns }
      ]
    },
  ];

  state.customAccordions.forEach(acc => {
    folders.push({
      id: acc.id,
      name: `カスタムフォルダ: ${getFolderMenuPath(acc.id)}`,
      tables: state.customTables.filter(t => t.parentMenuId === acc.id)
    });
  });

  const rootTables = state.customTables.filter(t => !t.parentMenuId || t.parentMenuId === 'root' || t.parentMenuId === 'custom-tables');
  if (rootTables.length > 0) {
    folders.push({
      id: 'root-folder-pseudo',
      name: 'ルート直下テーブル',
      tables: rootTables
    });
  }

  folders.forEach(f => {
    const tableNodes = [];
    f.tables.forEach(t => {
      const colNodes = [];
      const cols = t.columns || [];
      cols.forEach(c => {
        colNodes.push(createTreeItem(c.label || c.name, 'column', `${t.id}::${c.id}`, [], { tableId: t.id, columnId: c.id }));
      });
      tableNodes.push(createTreeItem(t.name, 'table', t.id, colNodes));
    });
    
    treeContainer.appendChild(createTreeItem(f.name, 'folder', f.id, tableNodes));
  });
}

function switchPermissionTab(tabId) {
  const screen = document.getElementById('permission-settings-screen');
  if (!screen) return;
  screen.querySelectorAll('.tab-btn').forEach(btn => {
    if (btn.dataset.tab === tabId) btn.classList.add('active');
    else btn.classList.remove('active');
  });

  screen.querySelectorAll('.tab-pane').forEach(pane => {
    if (pane.id === tabId) pane.classList.add('active');
    else pane.classList.remove('active');
  });
}

function renderPermissionSettingsDetails() {
  const target = state.activePermissionTarget;
  if (!target) {
    showPermissionEmptyState();
    return;
  }

  if (target.type === 'folder') {
    const pane = document.getElementById('folder-tab');
    pane.innerHTML = `
      <h3>📁 フォルダー閲覧権限設定</h3>
      <p style="color:var(--text-muted); font-size:0.85rem; margin-bottom:1rem;">対象フォルダー: <strong>${target.label}</strong></p>
      <div class="permission-checkbox-list" style="display:flex; flex-direction:column; gap:0.5rem; background:rgba(255,255,255,0.02); padding:1rem; border-radius:var(--radius-sm); border:1px solid var(--border-color);">
        ${ALL_ACCOUNTS.map(acc => {
          const allowed = state.permissions.folders[target.targetId] || [];
          const checked = allowed.includes(acc.id) ? 'checked' : '';
          return `
            <label style="display:flex; align-items:center; gap:0.5rem; cursor:pointer;">
              <input type="checkbox" class="folder-perm-cb" data-user-id="${acc.id}" ${checked}>
              <span>${acc.name}</span>
            </label>
          `;
        }).join('')}
      </div>
      <button class="btn-primary" id="save-folder-perm-btn" style="margin-top:1rem; padding:0.5rem 1rem;">設定を保存</button>
    `;

    document.getElementById('save-folder-perm-btn').addEventListener('click', () => {
      const allowed = [];
      pane.querySelectorAll('.folder-perm-cb').forEach(cb => {
        if (cb.checked) allowed.push(cb.dataset.userId);
      });
      state.permissions.folders[target.targetId] = allowed;
      savePermissions();
      renderCustomTableList();
      showToast('フォルダー権限を保存しました。', 'success');
    });
  }

  if (target.type === 'table') {
    const pane = document.getElementById('table-tab');
    pane.innerHTML = `
      <h3>📋 テーブル閲覧権限設定</h3>
      <p style="color:var(--text-muted); font-size:0.85rem; margin-bottom:1rem;">対象テーブル: <strong>${target.label}</strong></p>
      <div class="permission-checkbox-list" style="display:flex; flex-direction:column; gap:0.5rem; background:rgba(255,255,255,0.02); padding:1rem; border-radius:var(--radius-sm); border:1px solid var(--border-color);">
        ${ALL_ACCOUNTS.map(acc => {
          const allowed = state.permissions.tables[target.targetId] || [];
          const checked = allowed.includes(acc.id) ? 'checked' : '';
          return `
            <label style="display:flex; align-items:center; gap:0.5rem; cursor:pointer;">
              <input type="checkbox" class="table-perm-cb" data-user-id="${acc.id}" ${checked}>
              <span>${acc.name}</span>
            </label>
          `;
        }).join('')}
      </div>
      <button class="btn-primary" id="save-table-perm-btn" style="margin-top:1rem; padding:0.5rem 1rem;">設定を保存</button>
    `;

    document.getElementById('save-table-perm-btn').addEventListener('click', () => {
      const allowed = [];
      pane.querySelectorAll('.table-perm-cb').forEach(cb => {
        if (cb.checked) allowed.push(cb.dataset.userId);
      });
      state.permissions.tables[target.targetId] = allowed;
      savePermissions();
      renderCustomTableList();
      showToast('テーブル権限を保存しました。', 'success');
    });

    renderRowFilterSettings(target.targetId);
  }

  if (target.type === 'column') {
    const pane = document.getElementById('column-tab');
    const tableId = target.extra.tableId;
    const colId = target.extra.columnId;

    pane.innerHTML = `
      <h3>🧱 カラム閲覧権限設定</h3>
      <p style="color:var(--text-muted); font-size:0.85rem; margin-bottom:1rem;">対象カラム: <strong>${target.label}</strong> (テーブル ID: ${tableId})</p>
      <div class="permission-checkbox-list" style="display:flex; flex-direction:column; gap:0.5rem; background:rgba(255,255,255,0.02); padding:1rem; border-radius:var(--radius-sm); border:1px solid var(--border-color);">
        ${ALL_ACCOUNTS.map(acc => {
          const tableCols = state.permissions.columns[tableId] || {};
          const allowed = tableCols[colId] || [];
          const isSetup = Object.keys(tableCols).includes(colId);
          const checked = (!isSetup || allowed.includes(acc.id)) ? 'checked' : '';
          
          return `
            <label style="display:flex; align-items:center; gap:0.5rem; cursor:pointer;">
              <input type="checkbox" class="col-perm-cb" data-user-id="${acc.id}" ${checked}>
              <span>${acc.name}</span>
            </label>
          `;
        }).join('')}
      </div>
      <button class="btn-primary" id="save-col-perm-btn" style="margin-top:1rem; padding:0.5rem 1rem;">設定を保存</button>
    `;

    document.getElementById('save-col-perm-btn').addEventListener('click', () => {
      const allowed = [];
      pane.querySelectorAll('.col-perm-cb').forEach(cb => {
        if (cb.checked) allowed.push(cb.dataset.userId);
      });
      if (!state.permissions.columns[tableId]) state.permissions.columns[tableId] = {};
      state.permissions.columns[tableId][colId] = allowed;
      savePermissions();
      renderCustomTableList();
      showToast('カラム権限を保存しました。', 'success');
    });
  }
}

function showPermissionEmptyState() {
  const panes = ['folder-tab', 'table-tab', 'column-tab', 'row-filter-tab'];
  panes.forEach(pid => {
    const pane = document.getElementById(pid);
    if (pane) {
      pane.innerHTML = `
        <div style="text-align:center; padding:3rem; color:var(--text-muted);">
          <p style="font-size:1.5rem; margin-bottom:0.5rem;">👈 ターゲット未選択</p>
          <p>左側の権限ツリーから、設定したいフォルダ、テーブル、またはカラムを選択してください。</p>
        </div>
      `;
    }
  });
}

function renderRowFilterSettings(tableId) {
  const pane = document.getElementById('row-filter-tab');
  if (!pane) return;

  let columns = [];
  if (tableId === 'agency-info-screen') columns = state.agColumns;
  else if (tableId === 'jo-info-screen') columns = state.joColumns;
  else if (tableId === 'applicant-info-screen') columns = state.apColumns;
  else {
    const tbl = state.customTables.find(t => t.id === tableId || `custom-table-${t.id}` === tableId);
    if (tbl) columns = tbl.columns;
  }

  pane.innerHTML = `
    <h3>🔍 行表示ワード制限設定（関連ワード制限）</h3>
    <p style="color:var(--text-muted); font-size:0.85rem; margin-bottom:1rem;">対象テーブルに対するユーザーごとの表示抽出フィルタを設定します。</p>
    
    <div id="row-filter-users-accordion" style="display:flex; flex-direction:column; gap:1rem;">
      ${ALL_ACCOUNTS.map(acc => {
        const filterSetting = (state.permissions.rowFilters[tableId] || {})[acc.id] || { matchType: 'OR', rules: [] };
        return `
          <div class="user-filter-card" style="border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1rem; background:rgba(255,255,255,0.01);">
            <h4 style="margin-bottom:0.75rem; border-bottom:1px solid var(--border-color); padding-bottom:0.25rem; color:var(--text-primary);">${acc.name}</h4>
            
            <div style="display:flex; align-items:center; gap:1rem; margin-bottom:1rem;">
              <span style="font-size:0.85rem;">結合条件:</span>
              <label style="display:inline-flex; align-items:center; gap:0.25rem; cursor:pointer;">
                <input type="radio" name="matchtype-${acc.id}" value="OR" ${filterSetting.matchType === 'OR' ? 'checked' : ''}>
                <span>いずれかに一致 (OR)</span>
              </label>
              <label style="display:inline-flex; align-items:center; gap:0.25rem; cursor:pointer;">
                <input type="radio" name="matchtype-${acc.id}" value="AND" ${filterSetting.matchType === 'AND' ? 'checked' : ''}>
                <span>すべてに一致 (AND)</span>
              </label>
            </div>

            <div class="rules-list" id="rules-list-${acc.id}" style="display:flex; flex-direction:column; gap:0.5rem; margin-bottom:0.75rem;">
            </div>

            <button class="btn-secondary add-rule-row-btn" data-user-id="${acc.id}" style="padding:0.25rem 0.5rem; font-size:0.8rem;">＋ 条件を追加</button>
          </div>
        `;
      }).join('')}
    </div>
    <button class="btn-primary" id="save-row-filter-btn" style="margin-top:1.5rem; padding:0.5rem 1.2rem;">行フィルタ設定を保存</button>
  `;

  ALL_ACCOUNTS.forEach(acc => {
    const listContainer = document.getElementById(`rules-list-${acc.id}`);
    const filterSetting = (state.permissions.rowFilters[tableId] || {})[acc.id] || { matchType: 'OR', rules: [] };
    
    const addRuleRow = (ruleData = { columnId: '', word: '' }) => {
      const row = document.createElement('div');
      row.className = 'rule-row';
      row.style.display = 'flex';
      row.style.alignItems = 'center';
      row.style.gap = '0.5rem';

      const select = document.createElement('select');
      select.className = 'rule-col-select';
      select.style.padding = '0.25rem';
      select.style.fontSize = '0.85rem';
      columns.forEach(col => {
        const opt = document.createElement('option');
        opt.value = col.id;
        opt.textContent = col.label || col.name;
        if (col.id === ruleData.columnId) opt.selected = true;
        select.appendChild(opt);
      });

      const opSpan = document.createElement('span');
      opSpan.textContent = 'が';
      opSpan.style.fontSize = '0.85rem';

      const valInput = document.createElement('input');
      valInput.type = 'text';
      valInput.className = 'rule-word-input';
      valInput.value = ruleData.word || '';
      valInput.placeholder = 'キーワード';
      valInput.style.padding = '0.25rem';
      valInput.style.fontSize = '0.85rem';
      valInput.style.flex = '1';

      const endSpan = document.createElement('span');
      endSpan.textContent = 'を含む';
      endSpan.style.fontSize = '0.85rem';

      const removeBtn = document.createElement('button');
      removeBtn.className = 'btn-danger';
      removeBtn.innerHTML = '🗑️';
      removeBtn.style.padding = '0.2' + 'rem 0.4rem';
      removeBtn.style.fontSize = '0.8rem';
      removeBtn.addEventListener('click', () => row.remove());

      row.appendChild(select);
      row.appendChild(opSpan);
      row.appendChild(valInput);
      row.appendChild(endSpan);
      row.appendChild(removeBtn);
      listContainer.appendChild(row);
    };

    if (filterSetting.rules && filterSetting.rules.length > 0) {
      filterSetting.rules.forEach(r => addRuleRow(r));
    }

    const addBtn = pane.querySelector(`.add-rule-row-btn[data-user-id="${acc.id}"]`);
    addBtn.addEventListener('click', () => {
      addRuleRow();
    });
  });

  document.getElementById('save-row-filter-btn').addEventListener('click', () => {
    if (!state.permissions.rowFilters[tableId]) state.permissions.rowFilters[tableId] = {};

    ALL_ACCOUNTS.forEach(acc => {
      const container = document.getElementById(`rules-list-${acc.id}`);
      const matchType = pane.querySelector(`input[name="matchtype-${acc.id}"]:checked`).value;
      const rules = [];

      container.querySelectorAll('.rule-row').forEach(row => {
        const columnId = row.querySelector('.rule-col-select').value;
        const word = row.querySelector('.rule-word-input').value.trim();
        if (columnId && word) {
          rules.push({ columnId, word });
        }
      });

      if (rules.length > 0) {
        state.permissions.rowFilters[tableId][acc.id] = { matchType, rules };
      } else {
        delete state.permissions.rowFilters[tableId][acc.id];
      }
    });

    savePermissions();
    renderCustomTableList();
    showToast('行フィルタ設定を保存しました。', 'success');
  });
}

function renderPermissionSummary() {
  const pane = document.getElementById('summary-tab');
  if (!pane) return;

  const tables = [
    { id: 'appoint-accordion', name: 'アポイント情報（フォルダ）', type: 'folder' },
    { id: 'agency-accordion', name: '代理店情報（フォルダ）', type: 'folder' },
    { id: 'agency-info-screen', name: '🏢 代理店・基本マスタ', type: 'table' },
    { id: 'jo-accordion', name: 'JO情報（フォルダ）', type: 'folder' },
    { id: 'jo-info-screen', name: '💼 JO・基本マスタ', type: 'table' },
    { id: 'applicant-accordion', name: '申込者情報（フォルダ）', type: 'folder' },
    { id: 'applicant-info-screen', name: '👥 申込者・基本マスタ', type: 'table' },

  ];

  state.customAccordions.forEach(acc => {
    tables.push({ id: acc.id, name: `📁 ${getFolderMenuPath(acc.id)}（フォルダ）`, type: 'folder' });
  });

  state.customTables.forEach(t => {
    tables.push({ id: t.id, name: `📋 ${t.name}`, type: 'table' });
  });

  pane.innerHTML = `
    <h3>📊 権限設定サマリー</h3>
    <p style="color:var(--text-muted); font-size:0.85rem; margin-bottom:1rem;">各ユーザーに付与されている詳細権限を一元的に確認・管理できます。</p>
    
    <div style="overflow-x:auto; background:var(--bg-surface); border:1px solid var(--border-color); border-radius:var(--radius-md);">
      <table style="width:100%; border-collapse:collapse; text-align:left; font-size:0.85rem;">
        <thead>
          <tr style="background:var(--bg-surface-elevated); border-bottom:2px solid var(--border-color);">
            <th style="padding:0.75rem 1rem;">対象要素</th>
            <th style="padding:0.75rem 1rem;">種別</th>
            ${ALL_ACCOUNTS.map(acc => `<th style="padding:0.75rem 1rem; text-align:center;">${acc.name}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${tables.map(t => {
            return `
              <tr style="border-bottom:1px solid var(--border-color);">
                <td style="padding:0.6rem 1rem; font-weight:bold; color:var(--text-primary);">${t.name}</td>
                <td style="padding:0.6rem 1rem; color:var(--text-secondary);">${t.type === 'folder' ? '📂 フォルダ' : '📄 テーブル'}</td>
                ${ALL_ACCOUNTS.map(acc => {
                  let hasAccess = false;
                  let detailText = '';

                  if (t.type === 'folder') {
                    const allowed = state.permissions.folders[t.id] || [];
                    hasAccess = allowed.includes(acc.id);
                  } else {
                    const allowed = state.permissions.tables[t.id] || [];
                    hasAccess = allowed.includes(acc.id);

                    if (hasAccess) {
                      const rowF = (state.permissions.rowFilters[t.id] || {})[acc.id];
                      if (rowF && rowF.rules && rowF.rules.length > 0) {
                        detailText = `<div style="font-size:0.75rem; color:var(--secondary); margin-top:2px;">🔍 行制限: ${rowF.rules.length}件 (${rowF.matchType})</div>`;
                      }

                      const colP = state.permissions.columns[t.id];
                      if (colP) {
                        const colsNotAllowed = Object.keys(colP).filter(cid => !colP[cid].includes(acc.id));
                        if (colsNotAllowed.length > 0) {
                          detailText += `<div style="font-size:0.75rem; color:var(--primary); margin-top:2px;">🧱 カラム非表示: ${colsNotAllowed.length}列</div>`;
                        }
                      }
                    }
                  }

                  return `
                    <td style="padding:0.6rem 1rem; text-align:center;">
                      ${hasAccess ? '<span style="color:#10b981; font-weight:bold;">🟢 閲覧可</span>' : '<span style="color:#ef4444;">🔴 閲覧不可</span>'}
                      ${detailText}
                    </td>
                  `;
                }).join('')}
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function startImpersonationPreview(targetUserId, mode) {
  state.previewUserId = targetUserId;
  state.previewMode = mode;
  
  const bar = document.getElementById('preview-warning-bar');
  if (bar) {
    const userLabel = ALL_ACCOUNTS.find(a => a.id === targetUserId)?.name || targetUserId;
    const modeLabel = mode === 'grayout' ? 'デバッグ（グレー表示）' : '完全再現（非表示）';
    
    document.getElementById('preview-target-user-label').textContent = `${userLabel} (${modeLabel})`;
    bar.style.display = 'flex';
  }

  renderCustomTableList();
  
  if (state.currentView === 'jo-info-screen') renderJoInfo();
  else if (state.currentView === 'applicant-info-screen') renderApplicantInfo();
  else if (state.currentView === 'agency-info-screen') renderAgencyInfo();
  else if (state.currentView === 'custom-table-screen' && state.activeCustomTableId) {
    renderCustomTable(state.activeCustomTableId);
  }

  showToast(`なりすましプレビューを開始しました：${targetUserId}`, 'info');
}

function endImpersonationPreview() {
  state.previewUserId = null;
  state.previewMode = null;

  const bar = document.getElementById('preview-warning-bar');
  if (bar) {
    bar.style.display = 'none';
  }

  renderCustomTableList();

  if (state.currentView === 'jo-info-screen') renderJoInfo();
  else if (state.currentView === 'applicant-info-screen') renderApplicantInfo();
  else if (state.currentView === 'agency-info-screen') renderAgencyInfo();
  else if (state.currentView === 'custom-table-screen' && state.activeCustomTableId) {
    renderCustomTable(state.activeCustomTableId);
  }

  showToast('プレビューを終了し、通常の管理者ビューに戻りました。', 'success');
}

function initPermissionSettingsScreen() {
  const runBtn = document.getElementById('run-impersonation-preview-btn');
  if (runBtn) {
    const newRunBtn = runBtn.cloneNode(true);
    runBtn.parentNode.replaceChild(newRunBtn, runBtn);

    newRunBtn.addEventListener('click', () => {
      const userSelect = document.getElementById('impersonation-user-select');
      const modeSelect = document.getElementById('impersonation-mode-select');
      if (!userSelect || !modeSelect) return;
      
      const targetUser = userSelect.value;
      const mode = modeSelect.value;
      
      if (!targetUser) {
        showToast('対象ユーザーを選択してください。', 'warning');
        return;
      }

      startImpersonationPreview(targetUser, mode);
    });
  }

  const screen = document.getElementById('permission-settings-screen');
  if (screen) {
    screen.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tabId = btn.dataset.tab;
        switchPermissionTab(tabId);
        if (tabId === 'summary-tab') {
          renderPermissionSummary();
        } else {
          renderPermissionSettingsDetails();
        }
      });
    });
  }

  // 💡 権限画面モード切り替えリスナーのバインド
  const modeTreeBtn = document.getElementById('perm-mode-tree-btn');
  const modeMatrixBtn = document.getElementById('perm-mode-matrix-btn');
  const modeUserBtn = document.getElementById('perm-mode-user-btn');

  const containerTree = document.getElementById('perm-view-tree-container');
  const containerMatrix = document.getElementById('perm-view-matrix-container');
  const containerUser = document.getElementById('perm-view-user-container');

  const switchPermMode = (mode) => {
    [modeTreeBtn, modeMatrixBtn, modeUserBtn].forEach(btn => {
      if (btn) btn.classList.remove('active');
    });
    [containerTree, containerMatrix, containerUser].forEach(c => {
      if (c) c.style.display = 'none';
    });

    if (mode === 'tree') {
      if (modeTreeBtn) modeTreeBtn.classList.add('active');
      if (containerTree) containerTree.style.display = 'flex';
      renderPermissionTree();
      showPermissionEmptyState();
    } else if (mode === 'matrix') {
      if (modeMatrixBtn) modeMatrixBtn.classList.add('active');
      if (containerMatrix) containerMatrix.style.display = 'block';
      renderPermissionMatrix();
    } else if (mode === 'user') {
      if (modeUserBtn) modeUserBtn.classList.add('active');
      if (containerUser) containerUser.style.display = 'flex';
      renderUserBasedPermissionList();
    }
  };

  if (modeTreeBtn) modeTreeBtn.addEventListener('click', () => switchPermMode('tree'));
  if (modeMatrixBtn) modeMatrixBtn.addEventListener('click', () => switchPermMode('matrix'));
  if (modeUserBtn) modeUserBtn.addEventListener('click', () => switchPermMode('user'));

  // デフォルト起動時はデータツリー別設定
  switchPermMode('tree');
}

// 🔑 全フォルダ・テーブル情報収集用共通ヘルパー
function getAllFoldersAndTables() {
  const list = [
    { type: 'folder', id: 'appoint-accordion', name: '📁 アポイント情報（フォルダ）' },
    { type: 'folder', id: 'agency-accordion', name: '📁 代理店情報（フォルダ）' },
    { type: 'table', id: 'agency-info-screen', name: '📋 代理店 基本マスタ（テーブル）', parentId: 'agency-accordion' },
    { type: 'folder', id: 'jo-accordion', name: '📁 JO情報（フォルダ）' },
    { type: 'table', id: 'jo-info-screen', name: '📋 JO 基本マスタ（テーブル）', parentId: 'jo-accordion' },
    { type: 'folder', id: 'applicant-accordion', name: '📁 申込者情報（フォルダ）' },
    { type: 'table', id: 'applicant-info-screen', name: '📋 申込者 基本マスタ（テーブル）', parentId: 'applicant-accordion' }
  ];

  state.customAccordions.forEach(acc => {
    list.push({ type: 'folder', id: acc.id, name: `📁 カスタム: ${getFolderMenuPath(acc.id)}（フォルダ）` });
  });

  state.customTables.forEach(t => {
    list.push({ type: 'table', id: t.id, name: `📋 カスタム: ${t.name}（テーブル）`, parentId: t.parentMenuId || 'root', columns: t.columns || [] });
  });

  return list;
}

// 🔑 テーブル別アクセス制御行列 (マトリクス) の描画
function renderPermissionMatrix() {
  const table = document.getElementById('perm-matrix-grid-table');
  const tbody = document.getElementById('perm-matrix-grid-tbody');
  if (!table || !tbody) return;

  // 横軸ヘッダー生成 (全アカウント)
  const thead = table.querySelector('thead') || document.createElement('thead');
  thead.innerHTML = '';
  const trHead = document.createElement('tr');
  
  const thTarget = document.createElement('th');
  thTarget.textContent = '対象フォルダ / テーブル';
  trHead.appendChild(thTarget);

  ALL_ACCOUNTS.forEach(acc => {
    const th = document.createElement('th');
    th.textContent = acc.name;
    th.style.textAlign = 'center';
    th.style.fontSize = '0.8rem';
    trHead.appendChild(th);
  });
  thead.appendChild(trHead);
  if (!table.querySelector('thead')) {
    table.appendChild(thead);
  }

  // 縦軸ボディ生成
  tbody.innerHTML = '';
  const items = getAllFoldersAndTables();

  items.forEach(item => {
    const tr = document.createElement('tr');
    tr.style.borderBottom = '1px solid var(--border-color)';

    const tdName = document.createElement('td');
    tdName.textContent = item.name;
    tdName.style.padding = '0.4rem 0.5rem';
    tdName.style.fontSize = '0.8rem';
    if (item.type === 'folder') {
      tdName.style.fontWeight = 'bold';
      tdName.style.color = 'var(--text-primary)';
      tr.style.background = 'rgba(255,255,255,0.015)';
    } else {
      tdName.style.paddingLeft = '1.5rem';
      tdName.style.color = 'var(--text-secondary)';
    }
    tr.appendChild(tdName);

    ALL_ACCOUNTS.forEach(acc => {
      const td = document.createElement('td');
      td.style.textAlign = 'center';
      td.style.padding = '0.4rem';

      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.className = `matrix-cb-${item.type}`;
      cb.dataset.itemId = item.id;
      cb.dataset.userId = acc.id;

      if (item.type === 'folder') {
        const allowed = state.permissions.folders[item.id] || [];
        cb.checked = allowed.includes(acc.id);
      } else {
        const allowed = state.permissions.tables[item.id] || [];
        cb.checked = allowed.includes(acc.id);
      }

      td.appendChild(cb);
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });

  // 保存ボタン
  const saveBtn = document.getElementById('save-perm-matrix-btn');
  if (saveBtn) {
    const newSaveBtn = saveBtn.cloneNode(true);
    saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);
    newSaveBtn.addEventListener('click', () => {
      const newFoldersPerm = {};
      const newTablesPerm = {};

      tbody.querySelectorAll('.matrix-cb-folder').forEach(cb => {
        if (cb.checked) {
          if (!newFoldersPerm[cb.dataset.itemId]) newFoldersPerm[cb.dataset.itemId] = [];
          newFoldersPerm[cb.dataset.itemId].push(cb.dataset.userId);
        }
      });

      tbody.querySelectorAll('.matrix-cb-table').forEach(cb => {
        if (cb.checked) {
          if (!newTablesPerm[cb.dataset.itemId]) newTablesPerm[cb.dataset.itemId] = [];
          newTablesPerm[cb.dataset.itemId].push(cb.dataset.userId);
        }
      });

      items.forEach(item => {
        if (item.type === 'folder') {
          state.permissions.folders[item.id] = newFoldersPerm[item.id] || [];
        } else {
          state.permissions.tables[item.id] = newTablesPerm[item.id] || [];
        }
      });

      savePermissions();
      renderCustomTableList();
      showToast('行列のアクセス権限を保存しました。', 'success');
      renderPermissionMatrix();
    });
  }
}

// 🔑 ユーザー別一括設定の描画
function renderUserBasedPermissionList(activeUserId = null) {
  const userListContainer = document.getElementById('perm-user-list-select');
  const selectedTitle = document.getElementById('perm-user-selected-title');
  const configArea = document.getElementById('perm-user-config-area');
  const saveBtn = document.getElementById('save-user-based-perm-btn');
  
  if (!userListContainer || !configArea || !selectedTitle) return;

  userListContainer.innerHTML = '';
  ALL_ACCOUNTS.forEach(acc => {
    const btn = document.createElement('button');
    btn.className = 'btn btn-secondary';
    btn.style.width = '100%';
    btn.style.textAlign = 'left';
    btn.style.padding = '0.4rem 0.6rem';
    btn.style.fontSize = '0.8rem';
    btn.style.marginBottom = '0.2rem';
    btn.textContent = `👤 ${acc.name} (${acc.id})`;
    
    if (activeUserId === acc.id) {
      btn.style.background = 'rgba(26, 115, 232, 0.15)';
      btn.style.borderColor = 'var(--primary)';
      btn.style.color = 'var(--primary)';
    }

    btn.addEventListener('click', () => {
      renderUserBasedPermissionList(acc.id);
    });

    userListContainer.appendChild(btn);
  });

  if (!activeUserId) {
    selectedTitle.textContent = 'ユーザーを選択してください';
    configArea.style.display = 'none';
    if (saveBtn) saveBtn.style.display = 'none';
    return;
  }

  const activeUser = ALL_ACCOUNTS.find(a => a.id === activeUserId);
  selectedTitle.textContent = `👤 ユーザー設定: ${activeUser.name} (${activeUser.id})`;
  configArea.style.display = 'flex';
  if (saveBtn) saveBtn.style.display = 'block';

  const items = getAllFoldersAndTables();

  // A. フォルダ・テーブル閲覧チェックボックス群の描画
  const tablesContainer = document.getElementById('perm-user-tables-checkboxes');
  tablesContainer.innerHTML = '';
  items.forEach(item => {
    const label = document.createElement('label');
    label.style.display = 'flex';
    label.style.alignItems = 'center';
    label.style.gap = '0.4rem';
    label.style.cursor = 'pointer';
    label.style.padding = '0.2rem';
    
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.className = `user-view-cb-${item.type}`;
    cb.dataset.itemId = item.id;

    if (item.type === 'folder') {
      const allowed = state.permissions.folders[item.id] || [];
      cb.checked = allowed.includes(activeUserId);
    } else {
      const allowed = state.permissions.tables[item.id] || [];
      cb.checked = allowed.includes(activeUserId);
    }

    const span = document.createElement('span');
    span.textContent = item.name;
    span.style.fontSize = '0.75rem';
    if (item.type === 'folder') {
      span.style.fontWeight = 'bold';
    }

    label.appendChild(cb);
    label.appendChild(span);
    tablesContainer.appendChild(label);
  });

  // B. 表示カラム権限の描画
  const columnsContainer = document.getElementById('perm-user-columns-container');
  columnsContainer.innerHTML = '';

  const tables = items.filter(i => i.type === 'table');
  tables.forEach(t => {
    let cols = [];
    if (t.id === 'agency-info-screen') cols = state.agColumns;
    else if (t.id === 'jo-info-screen') cols = state.joColumns;
    else if (t.id === 'applicant-info-screen') cols = state.apColumns;
    else {
      cols = t.columns || [];
    }

    if (cols.length === 0) return;

    const divTable = document.createElement('div');
    divTable.style.border = '1px solid var(--border-color)';
    divTable.style.borderRadius = 'var(--radius-sm)';
    divTable.style.padding = '0.5rem 0.75rem';
    divTable.style.background = 'rgba(255,255,255,0.005)';

    const h4 = document.createElement('h4');
    h4.textContent = t.name;
    h4.style.fontSize = '0.8rem';
    h4.style.margin = '0 0 0.4rem 0';
    h4.style.color = 'var(--text-secondary)';
    divTable.appendChild(h4);

    const divCols = document.createElement('div');
    divCols.style.display = 'grid';
    divCols.style.gridTemplateColumns = 'repeat(auto-fill, minmax(180px, 1fr))';
    divCols.style.gap = '0.4rem';

    cols.forEach(c => {
      const label = document.createElement('label');
      label.style.display = 'flex';
      label.style.alignItems = 'center';
      label.style.gap = '0.35rem';
      label.style.cursor = 'pointer';

      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.className = `user-col-cb-${t.id}`;
      cb.dataset.colId = c.id;

      const tableCols = state.permissions.columns[t.id] || {};
      const allowed = tableCols[c.id] || [];
      const isSetup = Object.keys(tableCols).includes(c.id);
      cb.checked = (!isSetup || allowed.includes(activeUserId));

      const span = document.createElement('span');
      span.textContent = c.label || c.name;
      span.style.fontSize = '0.75rem';

      label.appendChild(cb);
      label.appendChild(span);
      divCols.appendChild(label);
    });

    divTable.appendChild(divCols);
    columnsContainer.appendChild(divTable);
  });

  // C. 行フィルタ条件の描画
  const filtersContainer = document.getElementById('perm-user-filters-container');
  filtersContainer.innerHTML = '';

  tables.forEach(t => {
    const divFilter = document.createElement('div');
    divFilter.style.display = 'flex';
    divFilter.style.alignItems = 'center';
    divFilter.style.gap = '0.75rem';
    divFilter.style.border = '1px solid var(--border-color)';
    divFilter.style.borderRadius = 'var(--radius-sm)';
    divFilter.style.padding = '0.4rem 0.6rem';
    divFilter.style.background = 'rgba(255,255,255,0.005)';

    const span = document.createElement('span');
    span.textContent = t.name;
    span.style.fontSize = '0.75rem';
    span.style.width = '240px';
    span.style.overflow = 'hidden';
    span.style.textOverflow = 'ellipsis';
    span.style.whiteSpace = 'nowrap';
    span.style.color = 'var(--text-secondary)';
    divFilter.appendChild(span);

    const input = document.createElement('input');
    input.type = 'text';
    input.className = `user-filter-input-${t.id}`;
    input.placeholder = '制限ワードを入力（カンマ区切り。例: 運営中, 一時停止）';
    input.style.flex = '1';
    input.style.padding = '0.25rem 0.5rem';
    input.style.fontSize = '0.75rem';
    input.style.border = '1px solid var(--border-color)';
    input.style.borderRadius = 'var(--radius-sm)';
    input.style.background = 'var(--bg-surface)';
    input.style.color = 'var(--text-primary)';
    input.style.outline = 'none';

    const tableFilters = state.permissions.rowFilters[t.id] || {};
    input.value = tableFilters[activeUserId] || '';

    divFilter.appendChild(input);
    filtersContainer.appendChild(divFilter);
  });

  // 保存処理
  if (saveBtn) {
    const newSaveBtn = saveBtn.cloneNode(true);
    saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);
    newSaveBtn.addEventListener('click', () => {
      // 閲覧権限の更新
      items.forEach(item => {
        const cb = tablesContainer.querySelector(`.user-view-cb-${item.type}[data-item-id="${item.id}"]`);
        if (cb) {
          const allowed = (item.type === 'folder' ? state.permissions.folders[item.id] : state.permissions.tables[item.id]) || [];
          const index = allowed.indexOf(activeUserId);
          
          if (cb.checked) {
            if (index === -1) allowed.push(activeUserId);
          } else {
            if (index !== -1) allowed.splice(index, 1);
          }

          if (item.type === 'folder') {
            state.permissions.folders[item.id] = allowed;
          } else {
            state.permissions.tables[item.id] = allowed;
          }
        }
      });

      // 表示カラムの更新
      tables.forEach(t => {
        const cbs = columnsContainer.querySelectorAll(`.user-col-cb-${t.id}`);
        if (cbs.length > 0) {
          if (!state.permissions.columns[t.id]) state.permissions.columns[t.id] = {};
          
          cbs.forEach(cb => {
            const colId = cb.dataset.colId;
            const allowed = state.permissions.columns[t.id][colId] || [];
            const index = allowed.indexOf(activeUserId);

            if (cb.checked) {
              const isSetup = Object.keys(state.permissions.columns[t.id]).includes(colId);
              if (isSetup && index === -1) {
                allowed.push(activeUserId);
              }
            } else {
              const isSetup = Object.keys(state.permissions.columns[t.id]).includes(colId);
              if (!isSetup) {
                const defaultAllowed = ALL_ACCOUNTS.map(a => a.id).filter(uid => uid !== activeUserId);
                state.permissions.columns[t.id][colId] = defaultAllowed;
              } else {
                if (index !== -1) {
                  allowed.splice(index, 1);
                }
              }
            }
          });
        }
      });

      // 行フィルタの更新
      tables.forEach(t => {
        const input = filtersContainer.querySelector(`.user-filter-input-${t.id}`);
        if (input) {
          if (!state.permissions.rowFilters[t.id]) state.permissions.rowFilters[t.id] = {};
          const val = input.value.trim();
          if (val) {
            state.permissions.rowFilters[t.id][activeUserId] = val;
          } else {
            delete state.permissions.rowFilters[t.id][activeUserId];
          }
        }
      });

      savePermissions();
      renderCustomTableList();
      showToast(`${activeUser.name} の権限設定を一括保存しました。`, 'success');
      renderUserBasedPermissionList(activeUserId);
    });
  }
}

function initAuditLogScreen() {
  renderAuditLogs();

  const applyBtn = document.getElementById('audit-log-filter-btn');
  if (applyBtn) {
    const newApplyBtn = applyBtn.cloneNode(true);
    applyBtn.parentNode.replaceChild(newApplyBtn, applyBtn);
    newApplyBtn.addEventListener('click', () => renderAuditLogs());
  }

  const resetBtn = document.getElementById('audit-log-reset-btn');
  if (resetBtn) {
    const newResetBtn = resetBtn.cloneNode(true);
    resetBtn.parentNode.replaceChild(newResetBtn, resetBtn);
    newResetBtn.addEventListener('click', () => {
      const userFilter = document.getElementById('audit-log-filter-user');
      const tableFilter = document.getElementById('audit-log-filter-table');
      const wordFilter = document.getElementById('audit-log-filter-word');
      if (userFilter) userFilter.value = '';
      if (tableFilter) tableFilter.value = '';
      if (wordFilter) wordFilter.value = '';
      renderAuditLogs();
    });
  }
}

function renderAuditLogs() {
  const tbody = document.getElementById('audit-log-table-body');
  if (!tbody) return;
  tbody.innerHTML = '';

  const userVal = document.getElementById('audit-log-filter-user')?.value.trim().toLowerCase();
  const tableVal = document.getElementById('audit-log-filter-table')?.value.trim().toLowerCase();
  const wordVal = document.getElementById('audit-log-filter-word')?.value.trim().toLowerCase();

  const filtered = state.auditLogs.filter(log => {
    if (userVal && !String(log.userId || '').toLowerCase().includes(userVal)) return false;
    if (tableVal && !String(log.tableName || '').toLowerCase().includes(tableVal)) return false;
    
    if (wordVal) {
      const matchWord = 
        String(log.oldValue || '').toLowerCase().includes(wordVal) ||
        String(log.newValue || '').toLowerCase().includes(wordVal) ||
        String(log.columnName || '').toLowerCase().includes(wordVal);
      if (!matchWord) return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center; padding:2rem; color:var(--text-muted);">操作ログ履歴がありません。</td>
      </tr>
    `;
    return;
  }

  filtered.forEach(log => {
    const tr = document.createElement('tr');
    tr.style.borderBottom = '1px solid var(--border-color)';
    tr.style.height = '35px';

    const formatDate = (ts) => {
      if (!ts) return '';
      const d = new Date(ts);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const h = String(d.getHours()).padStart(2, '0');
      const min = String(d.getMinutes()).padStart(2, '0');
      const s = String(d.getSeconds()).padStart(2, '0');
      const ms = String(d.getMilliseconds()).padStart(3, '0');
      return `${y}-${m}-${day} ${h}:${min}:${s}.${ms}`;
    };

    tr.innerHTML = `
      <td style="padding:0.5rem 1rem; color:var(--text-muted); font-size:0.8rem; font-family:monospace;">${formatDate(log.timestamp)}</td>
      <td style="padding:0.5rem 1rem; font-weight:bold; color:var(--text-primary);">${log.userId}</td>
      <td style="padding:0.5rem 1rem; color:var(--text-secondary);">${log.tableName}</td>
      <td style="padding:0.5rem 1rem; color:var(--text-muted); font-family:monospace;">${log.columnName} (行 ID: ${log.rowId})</td>
      <td style="padding:0.5rem 1rem; color:var(--text-secondary); background:rgba(239, 68, 68, 0.05); text-decoration:line-through; font-family:monospace; max-width:200px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${log.oldValue}">${log.oldValue || '(空)'}</td>
      <td style="padding:0.5rem 1rem; color:var(--text-primary); background:rgba(16, 185, 129, 0.05); font-weight:bold; font-family:monospace; max-width:200px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${log.newValue}">${log.newValue || '(空)'}</td>
    `;
    tbody.appendChild(tr);
  });
}

/* ============================================================================
   🏷️ ドロップダウン (データの入力規則) 設定サイドバー制御
   ============================================================================ */

const VALIDATION_PALETTE_COLORS = [
  '#64748b', // グレー (slate)
  '#3b82f6', // ブルー
  '#10b981', // グリーン
  '#eab308', // イエロー
  '#f97316', // オレンジ
  '#ef4444', // レッド
  '#8b5cf6', // パープル
  '#ec4899', // ピンク
  '#06b6d4', // ティール
  '#6366f1', // インディゴ
  '#0284c7', // スカイブルー
  '#84cc16'  // ライム
];

let activeValidationState = {
  tbl: null,
  colId: null,
  choices: []
};

function hexToRgba(hex, alpha) {
  hex = (hex || '#64748b').replace('#', '');
  if (hex.length === 3) {
    hex = hex.split('').map(x => x + x).join('');
  }
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
window.hexToRgba = hexToRgba;

function normalizeColChoices(col) {
  if (!col.choices) {
    col.choices = [];
  }
  col.choices = col.choices.map((c, idx) => {
    if (typeof c === 'string') {
      return {
        value: c,
        color: VALIDATION_PALETTE_COLORS[idx % VALIDATION_PALETTE_COLORS.length],
        textColor: '#ffffff'
      };
    }
    if (c && typeof c === 'object') {
      return {
        value: c.value || '',
        color: c.color || VALIDATION_PALETTE_COLORS[idx % VALIDATION_PALETTE_COLORS.length],
        textColor: c.textColor || '#ffffff'
      };
    }
    return { value: '', color: '#64748b', textColor: '#ffffff' };
  });
  
  if (!col.dropdownStyle) {
    col.dropdownStyle = 'chip-outline';
  }
}
window.normalizeColChoices = normalizeColChoices;

function openValidationSidebar(tbl, colId) {
  if (window.logToDebugPanel) window.logToDebugPanel(`openValidationSidebar called: tbl=${tbl.id}, colId=${colId}`, '#00ff00');
  const sidebar = document.getElementById('validation-sidebar');
  if (!sidebar) {
    if (window.logToDebugPanel) window.logToDebugPanel('ERR: validation-sidebar DOM element not found', '#ff4444');
    return;
  }

  const col = tbl.columns.find(c => c.id === colId);
  if (!col) {
    if (window.logToDebugPanel) window.logToDebugPanel(`ERR: colId=${colId} not found in columns of tbl=${tbl.id}`, '#ff4444');
    return;
  }

  // 既存データから選択肢（チップ）を自動抽出してプリセット
  if (!col.choices || col.choices.length === 0) {
    const uniqueVals = new Set();
    if (tbl.rows && tbl.rows.length > 0) {
      tbl.rows.forEach(row => {
        const val = String(row[colId] || '').trim();
        if (val && val !== 'ー' && val !== '-' && val !== 'undefined' && val !== 'null') {
          uniqueVals.add(val);
        }
      });
    }

    if (uniqueVals.size > 0) {
      col.choices = Array.from(uniqueVals).map((val, idx) => {
        // 代表的なステータス値に基づく自動着色
        let color = VALIDATION_PALETTE_COLORS[idx % VALIDATION_PALETTE_COLORS.length];
        if (val.includes('申請中') || val.includes('ACTIVE') || val.includes('有効') || val.includes('承認中')) {
          color = '#3b82f6'; // 青 (Blue)
        } else if (val.includes('一時停止') || val.includes('INACTIVE') || val.includes('無効') || val.includes('停止') || val.includes('保留')) {
          color = '#f97316'; // オレンジ (Orange)
        } else if (val.includes('運営中') || val.includes('完了') || val.includes('確定') || val.includes('正常') || val.includes('アクティブ')) {
          color = '#10b981'; // 緑 (Green)
        } else if (val.includes('削除') || val.includes('却下') || val.includes('非承認') || val.includes('エラー') || val.includes('異常')) {
          color = '#ef4444'; // 赤 (Red)
        }
        return { value: val, color: color, textColor: '#ffffff' };
      });

      // 既存データが存在する場合は、基準を「リスト（ドロップダウン）」にし、スタイルを「チップ」に自動切り替え
      col.type = 'select';
      col.dropdownStyle = 'chip-outline';
    }
  }

  normalizeColChoices(col);

  activeValidationState.tbl = tbl;
  activeValidationState.colId = colId;
  activeValidationState.choices = col.choices.map(c => ({ ...c }));

  const rangeInput = document.getElementById('validation-range-input');
  if (rangeInput) {
    rangeInput.value = `${tbl.name}!${col.label}`;
  }

  // 基準（コラムタイプ）のセット
  const criteriaSelect = document.getElementById('validation-criteria-select');
  if (criteriaSelect) {
    let typeVal = 'text';
    if (col.type === 'select') typeVal = 'list';
    else if (col.type === 'date') typeVal = 'date';
    else if (col.type === 'number') typeVal = 'number';
    criteriaSelect.value = typeVal;
    updateValidationSidebarUi(typeVal);
  }

  // 日付表示形式のセット
  const dateFormatSelect = document.getElementById('validation-date-format-select');
  const customDateFormatInput = document.getElementById('validation-custom-date-format');
  if (col.type === 'date') {
    if (dateFormatSelect) {
      dateFormatSelect.value = col.dateFormat || 'YYYY/MM/DD';
      if (customDateFormatInput) {
        customDateFormatInput.value = col.customDateFormat || '';
        customDateFormatInput.style.display = dateFormatSelect.value === 'custom' ? 'block' : 'none';
      }
    }
  }

  const styleVal = col.dropdownStyle === 'arrow' ? 'arrow' : 'chip';
  const styleRadio = document.getElementById(`validation-style-${styleVal}`);
  if (styleRadio) styleRadio.checked = true;

  const chipTypeVal = col.dropdownStyle === 'chip-fill' ? 'fill' : 'outline';
  const chipTypeRadio = document.getElementById(`validation-chip-${chipTypeVal}`);
  if (chipTypeRadio) chipTypeRadio.checked = true;

  const chipContainer = document.getElementById('validation-chip-type-container');
  if (chipContainer) {
    chipContainer.style.display = styleVal === 'chip' ? 'block' : 'none';
  }

  const advContent = document.getElementById('validation-advanced-content');
  const advToggle = document.getElementById('validation-advanced-toggle');
  if (advContent) advContent.style.display = 'none';
  if (advToggle) {
    const arrow = advToggle.querySelector('.toggle-arrow');
    if (arrow) arrow.textContent = '▶';
  }

  renderValidationChoices();

  sidebar.style.display = 'flex';
  sidebar.offsetHeight; // 強制リフロー（アニメーションおよび初期描画の競合バグ防止）
  sidebar.style.transform = 'translateX(0)';

  if (window.logToDebugPanel) {
    const computed = window.getComputedStyle(sidebar);
    const rect = sidebar.getBoundingClientRect();
    window.logToDebugPanel(`Sidebar STATE: display=${sidebar.style.display}, transform=${sidebar.style.transform}, computedDisplay=${computed.display}, computedTransform=${computed.transform}, computedZIndex=${computed.zIndex}, visibility=${computed.visibility}, rect=[x:${Math.round(rect.left)},y:${Math.round(rect.top)},w:${Math.round(rect.width)},h:${Math.round(rect.height)}]`, '#00ff00');
  }

  const contextMenu = document.getElementById('ct-context-menu');
  if (contextMenu) contextMenu.style.display = 'none';
}

function updateValidationSidebarUi(criteria) {
  const optionsSection = document.getElementById('validation-options-section');
  const advancedSection = document.getElementById('validation-advanced-section');
  const dateFormatSection = document.getElementById('validation-date-format-section');

  if (criteria === 'list') {
    if (optionsSection) optionsSection.style.display = 'block';
    if (advancedSection) advancedSection.style.display = 'block';
    if (dateFormatSection) dateFormatSection.style.display = 'none';
  } else if (criteria === 'date') {
    if (optionsSection) optionsSection.style.display = 'none';
    if (advancedSection) advancedSection.style.display = 'none';
    if (dateFormatSection) dateFormatSection.style.display = 'block';
  } else {
    if (optionsSection) optionsSection.style.display = 'none';
    if (advancedSection) advancedSection.style.display = 'none';
    if (dateFormatSection) dateFormatSection.style.display = 'none';
  }
}

function closeValidationSidebar() {
  const sidebar = document.getElementById('validation-sidebar');
  if (sidebar) {
    sidebar.style.transform = 'translateX(100%)';
    setTimeout(() => {
      sidebar.style.display = 'none';
    }, 300);
  }
  const palette = document.getElementById('validation-color-palette');
  if (palette) palette.style.display = 'none';
}

function renderValidationChoices() {
  const container = document.getElementById('validation-choices-list');
  if (!container) return;
  container.innerHTML = '';

  activeValidationState.choices.forEach((choice, idx) => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'validation-choice-item';
    itemDiv.setAttribute('data-index', idx);

    const dragIcon = document.createElement('div');
    dragIcon.className = 'validation-choice-drag';
    dragIcon.textContent = '⋮⋮';
    itemDiv.appendChild(dragIcon);

    const colorBtn = document.createElement('div');
    colorBtn.className = 'validation-choice-color-btn';
    colorBtn.style.backgroundColor = choice.color || '#6366f1';
    colorBtn.title = '背景色';
    colorBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showColorPalette(colorBtn, idx, 'color');
    });
    itemDiv.appendChild(colorBtn);

    const textColorBtn = document.createElement('div');
    textColorBtn.className = 'validation-choice-color-btn';
    textColorBtn.style.backgroundColor = choice.textColor || '#ffffff';
    textColorBtn.style.border = '1px solid var(--border-color)';
    textColorBtn.style.color = '#333333';
    textColorBtn.style.display = 'flex';
    textColorBtn.style.alignItems = 'center';
    textColorBtn.style.justifyContent = 'center';
    textColorBtn.style.fontSize = '10px';
    textColorBtn.style.fontWeight = 'bold';
    textColorBtn.style.marginLeft = '4px';
    textColorBtn.textContent = 'A';
    textColorBtn.title = '文字色';
    textColorBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showColorPalette(textColorBtn, idx, 'textColor');
    });
    itemDiv.appendChild(textColorBtn);

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'validation-choice-input';
    input.value = choice.value;
    input.placeholder = 'オプション名を入力';
    input.addEventListener('input', (e) => {
      activeValidationState.choices[idx].value = e.target.value;
    });
    itemDiv.appendChild(input);

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'validation-choice-remove';
    removeBtn.innerHTML = '&times;';
    removeBtn.addEventListener('click', () => {
      activeValidationState.choices.splice(idx, 1);
      renderValidationChoices();
    });
    itemDiv.appendChild(removeBtn);

    container.appendChild(itemDiv);
  });
}

function showColorPalette(targetBtn, choiceIndex, colorProperty = 'color') {
  const palette = document.getElementById('validation-color-palette');
  if (!palette) return;

  palette.innerHTML = '';
  // 文字色選択の場合は白と黒をパレットの先頭に追加して選択しやすくする
  const colors = colorProperty === 'textColor' 
    ? ['#ffffff', '#000000', ...VALIDATION_PALETTE_COLORS]
    : VALIDATION_PALETTE_COLORS;

  colors.forEach(color => {
    const circle = document.createElement('div');
    circle.className = 'palette-color-circle';
    circle.style.backgroundColor = color;
    circle.style.border = color === '#ffffff' ? '1px solid #ccc' : 'none';
    circle.addEventListener('click', () => {
      activeValidationState.choices[choiceIndex][colorProperty] = color;
      targetBtn.style.backgroundColor = color;
      palette.style.display = 'none';
    });
    palette.appendChild(circle);
  });

  const rect = targetBtn.getBoundingClientRect();
  palette.style.top = `${rect.bottom + window.scrollY + 4}px`;
  palette.style.left = `${rect.left + window.scrollX - 45}px`;
  palette.style.display = 'grid';

  const closePalette = (e) => {
    if (!palette.contains(e.target) && e.target !== targetBtn) {
      palette.style.display = 'none';
      document.removeEventListener('mousedown', closePalette, true);
    }
  };
  setTimeout(() => {
    document.addEventListener('mousedown', closePalette, true);
  }, 0);
}

function saveAndRenderValidation(tbl) {
  const tableId = tbl.id;
  const suffix = getUserIdSuffix();
  
  if (tableId === 'jo-info-screen') {
    localStorage.setItem(STORAGE_KEYS.JO_COLUMNS, JSON.stringify(state.joColumns));
    renderJoInfo();
  } else if (tableId === 'applicant-info-screen') {
    localStorage.setItem(STORAGE_KEYS.AP_COLUMNS, JSON.stringify(state.apColumns));
    renderApplicantInfo();
  } else if (tableId === 'agency-info-screen') {
    localStorage.setItem(STORAGE_KEYS.AG_COLUMNS, JSON.stringify(state.agColumns));
    renderAgencyInfo();
  } else if (tableId === 'dbmake') {
    localStorage.setItem(`SYNAPSE_DBMAKE_COLUMNS${suffix}`, JSON.stringify(state.dbmakeColumns));
    renderDbmakePartners();
  } else {
    saveCustomTables();
    renderCustomTable(tableId);
  }
}

function setupValidationSidebarEvents() {
  document.getElementById('validation-sidebar-close-btn')?.addEventListener('click', closeValidationSidebar);

  // 基準（コラムタイプ）切り替えイベント
  document.getElementById('validation-criteria-select')?.addEventListener('change', (e) => {
    updateValidationSidebarUi(e.target.value);
  });

  // 日付の表示形式切り替えイベント
  document.getElementById('validation-date-format-select')?.addEventListener('change', (e) => {
    const customInput = document.getElementById('validation-custom-date-format');
    if (customInput) {
      customInput.style.display = e.target.value === 'custom' ? 'block' : 'none';
    }
  });

  document.getElementById('validation-submit-btn')?.addEventListener('click', () => {
    if (!activeValidationState.tbl || !activeValidationState.colId) return;

    const tbl = activeValidationState.tbl;
    const col = tbl.columns.find(c => c.id === activeValidationState.colId);
    if (!col) return;

    const criteria = document.getElementById('validation-criteria-select')?.value;

    if (criteria === 'list') {
      col.type = 'select';
      col.choices = activeValidationState.choices
        .filter(c => c.value.trim() !== '')
        .map(c => ({ value: c.value.trim(), color: c.color, textColor: c.textColor || '#ffffff' }));

      const styleVal = document.querySelector('input[name="validation-display-style"]:checked')?.value;
      if (styleVal === 'arrow') {
        col.dropdownStyle = 'arrow';
      } else {
        const chipType = document.querySelector('input[name="validation-chip-type"]:checked')?.value;
        col.dropdownStyle = chipType === 'fill' ? 'chip-fill' : 'chip-outline';
      }
    } else if (criteria === 'date') {
      col.type = 'date';
      col.dateFormat = document.getElementById('validation-date-format-select')?.value || 'YYYY/MM/DD';
      if (col.dateFormat === 'custom') {
        col.customDateFormat = document.getElementById('validation-custom-date-format')?.value.trim() || 'YYYY-MM-DD';
      } else {
        col.customDateFormat = '';
      }
      col.choices = [];
    } else if (criteria === 'number') {
      col.type = 'number';
      col.choices = [];
    } else {
      col.type = 'text';
      col.choices = [];
    }

    saveAndRenderValidation(tbl);
    closeValidationSidebar();
    showToast('列の入力規則を更新しました。', 'success');
  });

  document.getElementById('validation-remove-btn')?.addEventListener('click', () => {
    if (!activeValidationState.tbl || !activeValidationState.colId) return;

    const tbl = activeValidationState.tbl;
    const col = tbl.columns.find(c => c.id === activeValidationState.colId);
    if (!col) return;

    // タイプを text に戻す（規則削除＝初期状態のテキストタイプ）
    col.type = 'text';
    col.choices = [];
    col.dropdownStyle = 'chip-outline';
    col.dateFormat = '';
    col.customDateFormat = '';

    saveAndRenderValidation(tbl);
    closeValidationSidebar();
    showToast('入力規則を削除しました。', 'success');
  });

  document.getElementById('validation-add-choice-btn')?.addEventListener('click', () => {
    const nextColor = VALIDATION_PALETTE_COLORS[activeValidationState.choices.length % VALIDATION_PALETTE_COLORS.length];
    activeValidationState.choices.push({
      value: '',
      color: nextColor
    });
    renderValidationChoices();
  });

  const advToggle = document.getElementById('validation-advanced-toggle');
  const advContent = document.getElementById('validation-advanced-content');
  if (advToggle && advContent) {
    advToggle.addEventListener('click', () => {
      const isHidden = advContent.style.display === 'none';
      advContent.style.display = isHidden ? 'block' : 'none';
      const arrow = advToggle.querySelector('.toggle-arrow');
      if (arrow) {
        arrow.textContent = isHidden ? '▼' : '▶';
      }
    });
  }

  const styleRadios = document.querySelectorAll('input[name="validation-display-style"]');
  const chipContainer = document.getElementById('validation-chip-type-container');
  styleRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      if (chipContainer) {
        chipContainer.style.display = e.target.value === 'chip' ? 'block' : 'none';
      }
    });
  });
}

