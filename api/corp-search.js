// Vercel Serverless Function: api/corp-search.js
// 国税庁 法人番号システムWeb-API (ver 4) 中継エンドポイント

const PREFECTURE_CODES = {
  '北海道': '01', '青森県': '02', '岩手県': '03', '宮城県': '04', '秋田県': '05',
  '山形県': '06', '福島県': '07', '茨城県': '08', '栃木県': '09', '群馬県': '10',
  '埼玉県': '11', '千葉県': '12', '東京都': '13', '神奈川県': '14', '新潟県': '15',
  '富山県': '16', '石川県': '17', '福井県': '18', '山梨県': '19', '長野県': '20',
  '岐阜県': '21', '静岡県': '22', '愛知県': '23', '三重県': '24', '滋賀県': '25',
  '京都府': '26', '大阪府': '27', '兵庫県': '28', '奈良県': '29', '和歌山県': '30',
  '鳥取県': '31', '島根県': '32', '岡山県': '33', '広島県': '34', '山口県': '35',
  '徳島県': '36', '香川県': '37', '愛媛県': '38', '高知県': '39', '福岡県': '40',
  '佐賀県': '41', '長崎県': '42', '熊本県': '43', '大分県': '44', '宮崎県': '45',
  '鹿児島県': '46', '沖縄県': '47'
};

// CSV行をカラム配列に安全に分割するヘルパー
function parseCSVLine(line) {
  const values = [];
  let inQuotes = false;
  let currentValue = '';

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        currentValue += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      values.push(currentValue.trim());
      currentValue = '';
    } else {
      currentValue += char;
    }
  }
  values.push(currentValue.trim());
  return values;
}

// 半角英数字・記号を全角に変換するヘルパー（国税庁APIの登記商号表記揺れ対応）
function toFullWidth(str) {
  if (!str) return '';
  return str
    .replace(/[A-Za-z0-9]/g, s => String.fromCharCode(s.charCodeAt(0) + 0xFEE0))
    .replace(/ /g, '　')
    .replace(/-/g, '－');
}

// 国税庁APIを1回呼び出すヘルパー
async function queryNtaApi(appId, searchName, prefCode) {
  const params = new URLSearchParams({
    id: appId,
    name: searchName,
    type: '02',
    mode: '2',
    target: '1',
    history: '0',
    close: '0'
  });

  if (prefCode) {
    params.append('pref', prefCode);
  }

  const apiUrl = `https://api.houjin-bangou.nta.go.jp/4/name?${params.toString()}`;
  const response = await fetch(apiUrl, {
    method: 'GET',
    headers: {
      'Accept': 'text/csv, text/plain, */*'
    }
  });

  if (!response.ok) return [];

  const csvText = await response.text();
  const lines = csvText.split(/\r?\n/).filter(l => l.trim().length > 0);
  if (lines.length <= 1) return [];

  const list = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i]);
    if (cols.length >= 10) {
      const corpNum = cols[1]; // 法人番号 (13桁)
      const corpName = cols[6]; // 商号又は名称
      const prefName = cols[9]; // 都道府県
      const cityName = cols[10] || ''; // 市区町村
      const street = cols[11] || ''; // 丁目番地等
      const fullAddress = `${prefName}${cityName}${street}`.trim();
      const regDate = cols[22] || cols[4] || '';
      // 項番35 (0始まりインデックス28): 商号又は名称のフリガナ（全角カタカナ。未登録の場合は空文字）
      const nameKana = (cols.length > 28 && cols[28]) ? cols[28].trim() : '';

      list.push({
        num: corpNum,
        name: corpName,
        nameKana: nameKana,
        pref: prefName,
        address: fullAddress,
        regDate: regDate,
        invoiceNum: `T${corpNum}`
      });
    }
  }
  return list;
}

module.exports = async (req, res) => {
  // CORSヘッダーの設定
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  const { name, pref } = req.query || {};

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Query parameter "name" is required.'
    });
  }

  // アプリケーションIDの解決（複数キー名への対応）
  const appId =
    process.env.HOUJIN_BANGOU_APP_ID ||
    process.env.HOUJIN_BANGOU_API_KEY ||
    process.env.APPLICATION_ID ||
    process.env.APP_ID ||
    process.env.INVOICE_API_APP_ID;

  if (!appId) {
    return res.status(200).json({
      success: false,
      error: 'HOUJIN_BANGOU_APP_ID is not configured in environment variables.',
      fallback: true,
      results: []
    });
  }

  try {
    const rawName = name.trim();
    let prefCode = '';
    if (pref) {
      const p = pref.trim();
      if (/^\d{2}$/.test(p)) {
        prefCode = p;
      } else if (PREFECTURE_CODES[p]) {
        prefCode = PREFECTURE_CODES[p];
      }
    }

    // 検索クエリのバリエーション構築（国税庁の登記商号は全角英数字で登録されているため）
    const searchQueries = new Set();
    searchQueries.add(rawName);

    // 全角に変換したバージョン
    const fullWidthName = toFullWidth(rawName);
    if (fullWidthName !== rawName) {
      searchQueries.add(fullWidthName);
    }

    // 「合同会社」「株式会社」等の法人格を除去したコアワード
    const cleanCore = rawName.replace(/(合同会社|株式会社|有限会社|合名会社|合資会社|ホールディングス|HD)/g, '').trim();
    if (cleanCore && cleanCore.length >= 2) {
      searchQueries.add(cleanCore);
      searchQueries.add(toFullWidth(cleanCore));
    }

    // 国税庁APIへ並行リクエスト
    const queryPromises = Array.from(searchQueries).slice(0, 4).map(q =>
      queryNtaApi(appId, q, prefCode).catch(() => [])
    );

    const responses = await Promise.all(queryPromises);

    // 結果のマージ＆重複排除（法人番号 num をキーとする）
    const seen = new Set();
    const results = [];

    for (const list of responses) {
      for (const item of list) {
        if (!seen.has(item.num)) {
          seen.add(item.num);
          results.push(item);
        }
      }
    }

    return res.status(200).json({
      success: true,
      count: results.length,
      results: results
    });
  } catch (error) {
    console.error('Error in corp-search API:', error);
    return res.status(200).json({
      success: false,
      error: error.message || 'Internal server error during corporate search.',
      fallback: true,
      results: []
    });
  }
};
