// Vercel Serverless Function: api/regex-ai.js
// Google Gemini API を中継する正規表現AIアシスタント用エンドポイント

module.exports = async (req, res) => {
  // CORSヘッダーの設定
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  if (origin !== '*') {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-goog-api-key'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const { mode, question, otherQuestions, message, history = [], clientApiKey } = req.body || {};

    if (mode !== 'diagnose_question' && mode !== 'list_models') {
      if (!message || typeof message !== 'string' || message.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Message is required.'
        });
      }
    }

    // 1. APIキーの解決（環境変数優先、大文字小文字の揺れにも対応）
    let envKey =
      process.env.GEMINI_API_KEY ||
      process.env.Gemini_API_Key ||
      process.env.GOOGLE_GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY;

    if (!envKey) {
      const matchedKey = Object.keys(process.env).find(k =>
        /^gemini.*api.*key$/i.test(k) || /^google.*gemini.*key$/i.test(k)
      );
      if (matchedKey) {
        envKey = process.env[matchedKey];
      }
    }

    const apiKey =
      envKey ||
      (typeof clientApiKey === 'string' && clientApiKey.trim() ? clientApiKey.trim() : null);

    if (!apiKey) {
      return res.status(200).json({
        success: false,
        isConfigured: false,
        error: 'GEMINI_API_KEY_NOT_CONFIGURED',
        message: 'Vercelの環境変数に GEMINI_API_KEY が設定されていません。'
      });
    }

    if (mode === 'list_models') {
      const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey)}`;
      const listRes = await fetch(listUrl);
      const listData = await listRes.json();
      return res.status(200).json({ success: listRes.ok, listData });
    }

    // 2. システムプロンプトおよびプロンプトの構築
    let systemInstructionText = '';
    const contents = [];

    if (mode === 'diagnose_question') {
      systemInstructionText = `
あなたはWebフォーム構築基盤「Synapse（シナプス）」の専属AIアーキテクトです。
フォーム作成者が作成・設定中の「質問項目」を分析し、最適な「データベース出力列名（カラムの統一）」「回答の入力規則（バリデーション）」「回答控えメール」の設計案を動的に考案してください。

【Synapseの設計・教育ルール】
1. カラムの統一 (dataKey):
   - 法人名、会社名、屋号、商号は、出力先DBの列名を "company_name" に統一して1列に集約する（法人と個人事業主が別セクションや別質問にあっても同じキーにする）。
   - 代表者名、氏名、個人名は "representative_name" に統一。
   - 住所、本店所在地、現住所、番地などは "street" または "address" に統一。
   - メールアドレスは "email" に統一。
   - 電話番号は "tel" に統一。
   - 郵便番号は "zip_code" に統一。
   - 法人番号・インボイス登録番号は "invoice_number" に統一。
   - その他の独自項目（例: 売上高、加盟プラン、紹介元、生年月日など）は、業務DBで標準的な半角英小文字スネークケース（例: monthly_revenue, partner_plan, referral_source）を自動考案する。
   - 特に出力列を統一する必要がない自由記述やアンケート項目は unifyColumn: false, dataKey: "" とする。

2. 入力規則 (validation):
   - 法人名・会社名: API連携 (category: "api", condition: "corp_name") による国税庁実在法人検索を推奨。
   - 屋号: 未入力時の自動ハイフン補填 (category: "text", condition: "auto_hyphen") を推奨。
   - メールアドレス: メール形式検証 (category: "text", condition: "email") を推奨。
   - 電話番号: RE2完全一致の電話番号パターン (category: "regex", condition: "tel", presetKey: "tel_both", value: "^0\\\\d{1,4}-?\\\\d{1,4}-?\\\\d{3,4}$") を推奨。
   - 郵便番号: API連携 (category: "api", condition: "zip_code") または正規表現 (^\\\\d{3}-?\\\\d{4}$)。
   - インボイス登録番号: API連携 (category: "api", condition: "invoice_number")。
   - 数値・金額: 数値検証 (category: "number", condition: "greater_than_or_equal", value: "0")。
   - 上記に当てはまらない一般的な質問は validation: null とする。

3. 回答控えメール (autoReply):
   - メールアドレスを収集する質問の場合、回答控えメールの自動配信を推奨 (autoReply: true)。それ以外は false。

4. 出力は必ず以下のJSONフォーマットのみ（マークダウンのコードブロックなし）:
{
  "recommendationTitle": "短くわかりやすいタイトル（適切な絵文字付き、例: 🏢 法人名・屋号（company_name列統合 & 実在検証））",
  "explanation": "なぜこの設定を推奨するかの明快な解説（1〜2文）",
  "unifyColumn": true,
  "dataKey": "company_name",
  "validation": {
    "category": "api",
    "condition": "corp_name",
    "errorMessage": "実在する法人名または屋号を入力してください。"
  },
  "autoReply": false,
  "items": [
    "データベース出力列名: <strong>company_name</strong> に統一",
    "入力規則: <strong>API連携 ➔ 実在法人名検索</strong>（国税庁API照会）"
  ]
}
`.trim();

      const questionText = `
【対象の質問項目】
- 質問ID: ${question?.id || 'q'}
- 質問タイトル: ${question?.title || '（無題）'}
- 質問タイプ: ${question?.type || 'text'}
- 質問の説明: ${question?.description || '（なし）'}

【フォーム内の他の質問項目】
${Array.isArray(otherQuestions) && otherQuestions.length > 0 ? otherQuestions.map(oq => `- ${oq.title || '（無題）'} (${oq.type})`).join('\n') : '（他の質問なし）'}
`.trim();

      contents.push({
        role: 'user',
        parts: [{ text: questionText }]
      });

    } else {
      // 2. Googleスプレッドシート（RE2正規表現）に特化したシステムプロンプト
      systemInstructionText = `
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
        parts: [{ text: (message || '').trim() }]
      });
    }

    // 4. Gemini API 呼び出し
    const candidateModels = ['gemini-2.5-flash', 'gemini-flash-latest', 'gemini-2.5-flash-lite'];
    let lastErrorBody = '';
    let lastStatus = 500;
    let response = null;
    let successfulModel = '';

    const requestPayload = {
      systemInstruction: {
        parts: [{ text: systemInstructionText }]
      },
      contents: contents,
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 1000,
        responseMimeType: 'application/json'
      }
    };

    for (const modelName of candidateModels) {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`;

      let resTry = await fetch(`${geminiUrl}?key=${encodeURIComponent(apiKey)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },
        body: JSON.stringify(requestPayload)
      });

      // もしHTTPリファラー制限エラー（referer <empty> are blocked）の場合のみ、Refererヘッダーを付与して再試行
      if (!resTry.ok && resTry.status === 403) {
        try {
          const errCloned = await resTry.clone().text();
          if (errCloned.includes('referer') || errCloned.includes('Referer')) {
            resTry = await fetch(`${geminiUrl}?key=${encodeURIComponent(apiKey)}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': apiKey,
                'Referer': req.headers.referer || req.headers.origin || 'https://synapse-wayway.vercel.app/'
              },
              body: JSON.stringify(requestPayload)
            });
          }
        } catch (retryErr) {
          console.warn('Retry with referer failed:', retryErr);
        }
      }

      if (resTry.ok) {
        response = resTry;
        successfulModel = modelName;
        break;
      } else {
        lastStatus = resTry.status;
        lastErrorBody = await resTry.text();
        console.warn(`[Gemini API] Model ${modelName} failed with ${resTry.status}:`, lastErrorBody);
      }
    }

    if (!response || !response.ok) {
      let detailMsg = '';
      try {
        const parsedErr = JSON.parse(lastErrorBody);
        detailMsg = parsedErr.error?.message || lastErrorBody;
      } catch (e) {
        detailMsg = lastErrorBody;
      }
      return res.status(200).json({
        success: false,
        isConfigured: true,
        error: 'GEMINI_API_REQUEST_FAILED',
        status: lastStatus,
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
      if (mode === 'diagnose_question') {
        parsedResult = null;
      } else {
        // JSON形式から外れていた場合の正規表現フォールバック抽出
        const patternMatch = rawText.match(/`(\^[^`]+\$)`/);
        parsedResult = {
          reply: rawText,
          pattern: patternMatch ? patternMatch[1] : ''
        };
      }
    }

    if (mode === 'diagnose_question') {
      return res.status(200).json({
        success: true,
        isConfigured: true,
        model: successfulModel,
        advice: parsedResult
      });
    }

    return res.status(200).json({
      success: true,
      isConfigured: true,
      model: successfulModel,
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
