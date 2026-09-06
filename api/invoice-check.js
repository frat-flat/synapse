// Vercel Serverless Function: api/invoice-check.js
// 国税庁 適格請求書発行事業者公表システムWeb-API (ver 1) 中継エンドポイント

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

  const { num } = req.query || {};

  if (!num || typeof num !== 'string' || num.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Query parameter "num" is required.'
    });
  }

  // アプリケーションIDの解決（複数キー名への対応）
  const appId =
    process.env.INVOICE_API_APP_ID ||
    process.env.INVOICE_APP_ID ||
    process.env.HOUJIN_BANGOU_APP_ID ||
    process.env.HOUJIN_BANGOU_API_KEY ||
    process.env.APPLICATION_ID ||
    process.env.APP_ID;

  if (!appId) {
    return res.status(200).json({
      success: false,
      error: 'INVOICE_API_APP_ID is not configured in environment variables.',
      fallback: true,
      exists: false
    });
  }

  try {
    let cleanNum = num.trim().toUpperCase();
    if (!cleanNum.startsWith('T') && /^\d{13}$/.test(cleanNum)) {
      cleanNum = 'T' + cleanNum;
    }

    if (!/^T\d{13}$/.test(cleanNum)) {
      return res.status(200).json({
        success: false,
        error: 'Invalid invoice registration number format. Must be T + 13 digits.',
        exists: false
      });
    }

    // 国税庁インボイス公表システムWeb-APIの呼び出し
    // type=21: JSON形式
    const params = new URLSearchParams({
      id: appId,
      number: cleanNum,
      type: '21'
    });

    const apiUrl = `https://web-api.invoice-kohyo.nta.go.jp/1/num?${params.toString()}`;
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json, text/plain, */*'
      }
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      return res.status(200).json({
        success: false,
        error: `Invoice API error (${response.status}): ${errText}`,
        fallback: true,
        exists: false
      });
    }

    const data = await response.json();
    const announcements = data.announcement || [];

    if (announcements.length === 0) {
      return res.status(200).json({
        success: true,
        exists: false,
        message: '該当する適格請求書発行事業者は見つかりませんでした。'
      });
    }

    const info = announcements[0];
    const isCancelled = !!info.disposalDate || !!info.expireDate;

    return res.status(200).json({
      success: true,
      exists: true,
      data: {
        registratedNumber: info.registratedNumber || cleanNum,
        name: info.name || '',
        address: info.address || '',
        registrationDate: info.registrationDate || '',
        updateDate: info.updateDate || '',
        status: isCancelled ? 'inactive' : 'active',
        statusLabel: isCancelled ? '失効・取消済' : '適格請求書発行事業者',
        disposalDate: info.disposalDate || null,
        expireDate: info.expireDate || null
      }
    });
  } catch (error) {
    console.error('Error in invoice-check API:', error);
    return res.status(200).json({
      success: false,
      error: error.message || 'Internal server error during invoice search.',
      fallback: true,
      exists: false
    });
  }
};
