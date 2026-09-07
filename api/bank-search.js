// Vercel Serverless Function: api/bank-search.js
// 全銀協 統一金融機関コード・支店コード 最新リアルタイム照会エンドポイント (Zengin Code API)

let cachedBanks = null;
let cachedBanksTime = 0;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24時間キャッシュ

const cachedBranches = new Map(); // bankCode -> { data, time }
const BRANCH_CACHE_TTL_MS = 24 * 60 * 60 * 1000;

function normalizeStr(str) {
  if (!str) return '';
  return String(str)
    .normalize('NFKC')
    .trim()
    .toLowerCase();
}

function hiraToKata(str) {
  if (!str) return '';
  return str.replace(/[\u3041-\u3096]/g, ch => String.fromCharCode(ch.charCodeAt(0) + 0x60));
}

function kataToHira(str) {
  if (!str) return '';
  return str.replace(/[\u30a1-\u30f6]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0x60));
}

function getOfficialBankName(bank) {
  if (!bank || !bank.name) return '';
  const name = String(bank.name).trim();
  const code = String(bank.code || '').padStart(4, '0');
  const codeNum = parseInt(code, 10);

  if (name.endsWith('銀行') || name.endsWith('信用金庫') || name.endsWith('信用組合') || name.endsWith('労働金庫')) {
    return name;
  }
  if (name.endsWith('信金')) return name.replace(/信金$/, '信用金庫');
  if (name.endsWith('信組')) return name.replace(/信組$/, '信用組合');
  if (name.endsWith('労金')) return name.replace(/労金$/, '労働金庫');
  if (name.endsWith('農協')) return name.replace(/農協$/, '農業協同組合');
  if (name.endsWith('信連')) return name.replace(/信連$/, '信用農業協同組合連合会');
  if (name.endsWith('信漁連')) return name.replace(/信漁連$/, '信用漁業協同組合連合会');

  if (codeNum < 1000) return name + '銀行';
  if (codeNum >= 1000 && codeNum < 2000) return name + '信用金庫';
  if (codeNum >= 2000 && codeNum < 3000) return name + '信用組合';
  if (codeNum >= 2950 && codeNum <= 2999) return name + '労働金庫';
  return name;
}

async function getLatestBanks() {
  const now = Date.now();
  if (cachedBanks && (now - cachedBanksTime < CACHE_TTL_MS)) {
    return cachedBanks;
  }

  try {
    const res = await fetch('https://zengin-code.github.io/api/banks.json', {
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      cachedBanks = await res.json();
      cachedBanksTime = now;
      return cachedBanks;
    }
  } catch (err) {
    console.error('[Bank API] Failed to fetch latest banks from Zengin Code:', err);
    if (cachedBanks) return cachedBanks;
  }

  return cachedBanks || {};
}

async function getLatestBranches(bankCode) {
  if (!bankCode) return {};
  const cleanCode = String(bankCode).padStart(4, '0');
  const now = Date.now();
  const cached = cachedBranches.get(cleanCode);
  if (cached && (now - cached.time < BRANCH_CACHE_TTL_MS)) {
    return cached.data;
  }

  try {
    const res = await fetch(`https://zengin-code.github.io/api/branches/${cleanCode}.json`, {
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      const data = await res.json();
      cachedBranches.set(cleanCode, { data, time: now });
      return data;
    }
  } catch (err) {
    console.error(`[Bank API] Failed to fetch branches for bank ${cleanCode}:`, err);
    if (cached) return cached.data;
  }

  return cached ? cached.data : {};
}

module.exports = async (req, res) => {
  if (!res.status) {
    res.status = function(code) {
      res.statusCode = code;
      return res;
    };
  }
  if (!res.json) {
    res.json = function(data) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify(data));
      return res;
    };
  }

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

  const { query, name, code, bankCode, branch, all } = req.query || {};

  try {
    // 1. 支店一覧の検索リクエスト
    if (bankCode) {
      const branchesObj = await getLatestBranches(bankCode);
      const branchQuery = (branch || query || '').trim();
      const branchList = Object.values(branchesObj);

      if (!branchQuery) {
        const shouldReturnAll = all === '1' || all === 'true';
        return res.status(200).json({
          success: true,
          bankCode,
          total: branchList.length,
          branches: shouldReturnAll ? branchList : branchList.slice(0, 50)
        });
      }

      const cleanBq = normalizeStr(branchQuery);
      const kataBq = hiraToKata(cleanBq);
      const hiraBq = kataToHira(cleanBq);
      const cleanBqNoSuffix = cleanBq.replace(/支店|出張所|営業部|支社|本店/, '');
      const cleanBqIsDigit = /^\d+$/.test(cleanBq);
      const cleanCodePadded = cleanBqIsDigit ? cleanBq.padStart(3, '0') : '';

      const exactMatches = [];
      const prefixMatches = [];
      const partialMatches = [];

      for (const b of branchList) {
        const bName = normalizeStr(b.name);
        const bKana = normalizeStr(b.kana);
        const bHira = normalizeStr(b.hira);
        const bCode = String(b.code || '').padStart(3, '0');

        // コード完全一致または名称・読み完全一致
        if (bCode === cleanBq || (cleanCodePadded && bCode === cleanCodePadded) || bName === cleanBq || bKana === kataBq || bHira === hiraBq) {
          exactMatches.push({ ...b, code: bCode });
          continue;
        }
        // コード前方一致または名称前方一致
        if (bCode.startsWith(cleanBq) || bName.startsWith(cleanBq) || bKana.startsWith(kataBq)) {
          prefixMatches.push({ ...b, code: bCode });
          continue;
        }
        // 部分一致
        if (bCode.includes(cleanBq) || bName.includes(cleanBq) || bKana.includes(kataBq) || bHira.includes(hiraBq)) {
          partialMatches.push({ ...b, code: bCode });
          continue;
        }
        if (cleanBqNoSuffix.length >= 1 && (bName.includes(cleanBqNoSuffix) || bKana.includes(cleanBqNoSuffix))) {
          partialMatches.push({ ...b, code: bCode });
          continue;
        }
      }

      const matchedBranches = [...exactMatches, ...prefixMatches, ...partialMatches];

      return res.status(200).json({
        success: true,
        bankCode,
        total: matchedBranches.length,
        branches: matchedBranches.slice(0, 30)
      });
    }

    // 2. 金融機関（銀行）の検索リクエスト
    const banksObj = await getLatestBanks();
    const bankList = Object.values(banksObj);
    const searchTarget = (query || name || code || '').trim();

    if (!searchTarget) {
      const sorted = [...bankList]
        .map(b => {
          const off = getOfficialBankName(b);
          return {
            ...b,
            code: String(b.code || '').padStart(4, '0'),
            officialName: off,
            displayName: off
          };
        })
        .sort((a, b) => String(a.code).localeCompare(String(b.code)));
      return res.status(200).json({
        success: true,
        total: sorted.length,
        banks: sorted
      });
    }

    const cleanTarget = normalizeStr(searchTarget);
    const kataTarget = hiraToKata(cleanTarget);
    const hiraTarget = kataToHira(cleanTarget);
    const cleanNoType = cleanTarget.replace(/銀行|信用金庫|信金|労働金庫|労金|信組|信用組合|農協|農業協同組合/, '');

    const hasBank = cleanTarget.includes('銀行');
    const hasShinkin = cleanTarget.includes('信金') || cleanTarget.includes('信用金庫');
    const hasShinkumi = cleanTarget.includes('信組') || cleanTarget.includes('信用組合');

    const matches = [];

    for (const b of bankList) {
      const bCode = String(b.code || '').padStart(4, '0');
      const officialName = getOfficialBankName(b);
      const rawName = normalizeStr(b.name);
      const offName = normalizeStr(officialName);
      const bKana = normalizeStr(b.kana);
      const bHira = normalizeStr(b.hira);
      const bRoma = normalizeStr(b.roma);

      let score = -1;

      // コード完全一致
      if (bCode === cleanTarget) {
        score = 100;
      }
      // 正式名称・生名称・カナ・ひらがな完全一致
      else if (offName === cleanTarget || rawName === cleanTarget || bKana === kataTarget || bHira === hiraTarget) {
        score = 90;
      }
      // 単体名で正式名称が一致 (例: 入力「広島」に対して officialName「広島銀行」)
      else if (cleanNoType && offName === cleanNoType + '銀行' && !hasShinkin && !hasShinkumi) {
        score = 85;
      }
      // 前方一致
      else if (offName.startsWith(cleanTarget) || rawName.startsWith(cleanTarget) || bKana.startsWith(kataTarget) || bHira.startsWith(hiraTarget)) {
        score = 80;
      }
      // cleanNoTypeで前方一致
      else if (cleanNoType.length >= 2 && (offName.startsWith(cleanNoType) || rawName.startsWith(cleanNoType) || bKana.startsWith(hiraToKata(cleanNoType)))) {
        score = 70;
        if (hasShinkin && !offName.includes('信用金庫')) score -= 40;
        if (hasBank && !offName.endsWith('銀行')) score -= 40;
      }
      // 部分一致
      else if (offName.includes(cleanTarget) || rawName.includes(cleanTarget) || bKana.includes(kataTarget) || bHira.includes(hiraTarget) || bRoma.includes(cleanTarget)) {
        score = 60;
      }
      else if (cleanNoType.length >= 2 && (offName.includes(cleanNoType) || bKana.includes(hiraToKata(cleanNoType)))) {
        score = 50;
        if (hasShinkin && !offName.includes('信用金庫')) score -= 40;
        if (hasBank && !offName.endsWith('銀行')) score -= 40;
      }

      if (score > 10) {
        matches.push({
          ...b,
          code: bCode,
          name: b.name,
          officialName,
          displayName: officialName,
          score
        });
      }
    }

    matches.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.code.localeCompare(b.code);
    });

    return res.status(200).json({
      success: true,
      query: searchTarget,
      total: matches.length,
      banks: matches.slice(0, 30)
    });

  } catch (err) {
    console.error('[Bank Search API Error]', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to search bank data.'
    });
  }
};
