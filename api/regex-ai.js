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
    const body = req.body || {};
    const mode = body.mode;
    const question = body.question;
    const otherQuestions = body.otherQuestions;
    const history = Array.isArray(body.history) ? body.history : [];

    // message または prompt からユーザーの相談文を取得
    const message = (typeof body.message === 'string' && body.message.trim())
      ? body.message.trim()
      : (typeof body.prompt === 'string' && body.prompt.trim())
        ? body.prompt.trim()
        : '';

    // clientApiKey または userKey からクライアントキーを取得
    const clientApiKey = (typeof body.clientApiKey === 'string' && body.clientApiKey.trim())
      ? body.clientApiKey.trim()
      : (typeof body.userKey === 'string' && body.userKey.trim())
        ? body.userKey.trim()
        : '';

    if (mode !== 'diagnose_question') {
      if (!message || message.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Message or prompt is required.'
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

    const apiKey = envKey || (clientApiKey ? clientApiKey : null);

    if (!apiKey) {
      return res.status(200).json({
        success: false,
        isConfigured: false,
        error: 'GEMINI_API_KEY_NOT_CONFIGURED',
        message: 'Vercelの環境変数に GEMINI_API_KEY が設定されていません。'
      });
    }

    // 2. システムプロンプトおよびプロンプトの構築
    let systemInstructionText = '';
    const contents = [];

    // モード判定:
    // A. mode === 'diagnose_question' -> 質問のリアルタイム診断（おすすめ設定JSON返却）
    // B. mode === 'consult_question' || mode === 'chat' || questionがある || prompt形式の相談 -> Synapse専属AIコンシェルジュ
    // C. それ以外（mode === 'regex' など） -> GoogleスプレッドシートRE2正規表現アシスタント
    const isConsultMode = mode === 'consult_question' || mode === 'chat' || (mode !== 'diagnose_question' && (question || typeof body.prompt === 'string' || !/正規表現/.test(message)));

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

    } else if (isConsultMode) {
      // 💬 Synapse専属AIコンシェルジュ（設計・カラム統一・バリデーション・物理キー相談）
      systemInstructionText = `
あなたはWebフォーム構築基盤「Synapse（シナプス）」の専属AIコンシェルジュ・アーキテクトです。
フォーム作成者からの質問設計、出力カラムの統一（物理キー・dataKey）、入力規則（バリデーション）、API連携、同上（前述と同じ）設定、テーブル設計・運用設計に関する相談に対して、初心者にもわかりやすく親切・的確・専門的に日本語でアドバイスしてください。

【Synapseの設計・推奨方針】
1. カラム名・物理キー（dataKey）の命名規則:
   - 法人情報: company_name（会社名/屋号）、company_kana（カナ）、corp_number（法人番号）、establishment_date（設立日）
   - 代表者情報: representative_name または rep_name（代表者氏名）、representative_kana または rep_kana（代表者カナ）、rep_tel（代表電話）、rep_email（代表メール）
   - 担当者情報: contact_name または pic_name（担当者氏名）、contact_kana（担当者カナ）、contact_tel（担当電話）、contact_email（担当メール）
   - 本店住所: corp_zip または zip_code（郵便番号）、pref（都道府県）、city（市区町村）、street（番地）、building（建物名）
   - 郵送先・送付先住所: shipping_zip または mail_zip（送付先郵便番号）、shipping_pref（送付先都道府県）、shipping_city（送付先市区町村）、shipping_street または shipping_address（送付先住所・番地）、shipping_building（建物名）
   - 口座情報: bank_name（銀行名）、bank_code（金融機関コード）、branch_name（支店名）、branch_code（支店番号）、account_type（口座種別）、account_number（口座番号）、account_holder_kana（口座名義カナ）
   - 命名規則は半角英小文字のスネークケース（例: billing_address, emergency_contact, referral_code）を推奨。

2. 「前述と同じ（同上）」機能とカラム分離について:
   - 代表者と担当者、本店住所と郵送先住所などでカラムを別に分けたい場合は、dataKeyや設問タイトルを分けるだけで、同上チェック時でも送信時にそれぞれの個別カラムへ値が100%独立して記録されます。
   - 逆に同じカラムにまとめたい場合（法人セクションと個人事業主セクションの会社名/屋号など）に「カラム統一」で同じdataKeyを指定します。

3. 回答スタイル:
   - ユーザーの相談に対して直接的かつ具体的に回答してください。
   - おすすめの物理キー名や設定手順をコードハイライト（\`shipping_address\` 等）や箇条書きを用いてわかりやすく提示してください。
   - 出力は必ず以下のJSON形式で行ってください。マークダウンのコードブロックなしで生のJSONのみを出力してください:
{
  "reply": "ユーザーへの親切・具体的・丁寧なアドバイス本文（マークダウン形式。太字やコードハイライト \`...\`、箇条書きを活用）"
}
`.trim();

      // 会話履歴の反映
      if (Array.isArray(history)) {
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

      // 質問文脈の付与
      let userQueryText = message;
      if (question && question.title) {
        userQueryText = `【現在設定中の質問項目】\n- タイトル: ${question.title}\n- 型: ${question.type || 'text'}\n- 現在のカラムキー(dataKey): ${question.dataKey || '（未設定）'}\n- 説明文: ${question.description || '（なし）'}\n\n【相談内容】\n${message}`;
      }

      contents.push({
        role: 'user',
        parts: [{ text: userQueryText }]
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

      // 会話履歴の構築
      if (Array.isArray(history)) {
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
        parts: [{ text: message }]
      });
    }

    // 4. Gemini API 呼び出し
    const candidateModels = ['gemini-3.5-flash', 'gemini-3.5-flash-lite', 'gemini-3.6-flash', 'gemini-3.7-flash'];
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

    // 5. JSONパース（マークダウンコードブロックの剥離処理）
    let parsedResult = null;
    let cleanJsonStr = (rawText || '').trim();
    if (cleanJsonStr.startsWith('```json')) {
      cleanJsonStr = cleanJsonStr.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanJsonStr.startsWith('```')) {
      cleanJsonStr = cleanJsonStr.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    try {
      parsedResult = JSON.parse(cleanJsonStr);
    } catch (parseErr) {
      if (mode === 'diagnose_question') {
        parsedResult = null;
      } else {
        // JSON形式から外れていた場合の正規表現フォールバック抽出
        const patternMatch = cleanJsonStr.match(/`(\^[^`]+\$)`/);
        parsedResult = {
          reply: cleanJsonStr,
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

    const replyText = (parsedResult && typeof parsedResult.reply === 'string' && parsedResult.reply)
      ? parsedResult.reply
      : cleanJsonStr;

    return res.status(200).json({
      success: true,
      isConfigured: true,
      model: successfulModel,
      text: replyText,
      reply: replyText,
      message: replyText,
      pattern: (parsedResult && parsedResult.pattern) || ''
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
