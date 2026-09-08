// Vercel Serverless Function: api/regex-ai.js
// Google Gemini API を中継する正規表現AIアシスタント用エンドポイント

module.exports = async (req, res) => {
  // CORSヘッダーの設定
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const { message, history = [], clientApiKey } = req.body || {};

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Message is required.'
      });
    }

    // 1. APIキーの解決（環境変数優先、クライアントからの指定があれば予備として利用）
    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      (typeof clientApiKey === 'string' && clientApiKey.trim() ? clientApiKey.trim() : null);

    if (!apiKey) {
      return res.status(200).json({
        success: false,
        isConfigured: false,
        error: 'GEMINI_API_KEY_NOT_CONFIGURED',
        message: 'Vercelの環境変数に GEMINI_API_KEY が設定されていません。'
      });
    }

    // 2. Googleスプレッドシート（RE2正規表現）に特化したシステムプロンプト
    const systemInstructionText = `
あなたはWebフォーム構築システムおよびGoogleスプレッドシートのデータ検証（「正規表現に一致」）に特化した、親切で優秀な正規表現AIアシスタントです。

【重要ルール】
1. Googleスプレッドシートの入力規則は「RE2正規表現」で動作します。lookaround（先読み・後読み: (?=...), (?!...)）やバックリファレンス（\\1）等の高度なPCRE専用構文はスプレッドシートでエラーになるため、絶対に使用せずRE2互換の構文で回答してください。
2. 提案する正規表現パターンは、入力全体と完全一致させるため必ず先頭 \`^\` と末尾 \`$\` を付与してください（例: \`^\\d{3}-\\d{4}$\`）。
3. ユーザーの要望（例: 「ハイフンとスラッシュ両方対応」「何年何月何日という漢字形式も受け付けたい」等）に対し、親切にわかりやすく日本語で解説してください。
4. 出力は必ず以下のJSON形式で行ってください。マークダウンのコードブロックなしで生のJSONのみを出力してください:
{
  "reply": "ユーザーへの親切・丁寧な解説文（Markdown形式。太字やリスト、コードハイライト \`...\` を活用）",
  "pattern": "この要望に最も適した1つの完全正規表現パターン（例: ^\\\\d{4}[-/年]\\\\d{1,2}[-/月]\\\\d{1,2}日?$）。正規表現の提案がない単なる質問回答の場合は空文字列 \\"\\""
}
`.trim();

    // 3. 会話履歴の構築
    const contents = [];

    if (Array.isArray(history)) {
      // 直近の会話（最大6ターン程度）を反映
      const recentHistory = history.slice(-6);
      recentHistory.forEach(item => {
        if (item && item.role && item.text) {
          contents.push({
            role: item.role === 'assistant' || item.role === 'model' ? 'model' : 'user',
            parts: [{ text: item.text }]
          });
        }
      });
    }

    // 現在のメッセージを追加
    contents.push({
      role: 'user',
      parts: [{ text: message.trim() }]
    });

    // 4. Gemini API 呼び出し
    const modelName = 'gemini-1.5-flash';
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${encodeURIComponent(apiKey)}`;

    const refererHeader = req.headers.referer || req.headers.origin || 'https://synapse-wayway.vercel.app/';
    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
        'Referer': refererHeader
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemInstructionText }]
        },
        contents: contents,
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 1000,
          responseMimeType: 'application/json'
        }
      })
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error('[Gemini API Error]', response.status, errBody);
      let detailMsg = '';
      try {
        const parsedErr = JSON.parse(errBody);
        detailMsg = parsedErr.error?.message || errBody;
      } catch (e) {
        detailMsg = errBody;
      }
      return res.status(200).json({
        success: false,
        isConfigured: true,
        error: 'GEMINI_API_REQUEST_FAILED',
        status: response.status,
        message: 'Gemini APIとの通信中にエラーが発生しました。',
        detail: detailMsg
      });
    }

    const data = await response.json();
    const candidate = data.candidates && data.candidates[0];
    const rawText = candidate && candidate.content && candidate.content.parts && candidate.content.parts[0] && candidate.content.parts[0].text;

    if (!rawText) {
      return res.status(200).json({
        success: false,
        error: 'EMPTY_GEMINI_RESPONSE',
        message: 'Geminiからの回答が取得できませんでした。'
      });
    }

    // 5. JSONパース
    let parsedResult = null;
    try {
      parsedResult = JSON.parse(rawText);
    } catch (parseErr) {
      // JSON形式から外れていた場合の正規表現フォールバック抽出
      const patternMatch = rawText.match(/`(\^[^`]+\$)`/);
      parsedResult = {
        reply: rawText,
        pattern: patternMatch ? patternMatch[1] : ''
      };
    }

    return res.status(200).json({
      success: true,
      isConfigured: true,
      model: modelName,
      reply: parsedResult.reply || '',
      pattern: parsedResult.pattern || ''
    });

  } catch (error) {
    console.error('[regex-ai API Exception]', error);
    return res.status(500).json({
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: error.message || '内部エラーが発生しました。'
    });
  }
};
