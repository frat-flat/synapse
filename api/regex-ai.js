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

    // clientApiKey または userKey または apiKey からクライアントキーを取得
    const clientApiKey = (typeof body.clientApiKey === 'string' && body.clientApiKey.trim())
      ? body.clientApiKey.trim()
      : (typeof body.userKey === 'string' && body.userKey.trim())
        ? body.userKey.trim()
        : (typeof body.apiKey === 'string' && body.apiKey.trim())
          ? body.apiKey.trim()
          : '';

    if (mode !== 'diagnose_question' && mode !== 'form_global_concierge') {
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
      if (mode === 'form_global_concierge') {
        const fallbackAdvice = generateFallbackGlobalAdvice(body.formSummary, message);
        return res.status(200).json({
          success: true,
          isConfigured: false,
          model: 'local-fallback',
          globalAdvice: fallbackAdvice,
          advice: fallbackAdvice
        });
      }

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
    // A. mode === 'form_global_concierge' -> フォーム全体設定のトータルプロデュース・最適化
    // B. mode === 'diagnose_question' -> 質問のリアルタイム診断（おすすめ設定JSON返却）
    // C. mode === 'consult_question' || mode === 'chat' || questionがある || prompt形式の相談 -> Synapse専属AIコンシェルジュ
    // D. それ以外（mode === 'regex' など） -> GoogleスプレッドシートRE2正規表現アシスタント
    const isConsultMode = (mode === 'consult_question' || mode === 'chat' || (mode !== 'diagnose_question' && (question || typeof body.prompt === 'string' || !/正規表現/.test(message)))) && mode !== 'form_global_concierge';

    if (mode === 'form_global_concierge') {
      systemInstructionText = `
あなたはWebフォーム構築基盤「Synapse（シナプス）」の専属チーフ・フォームデザイナー＆AIアーキテクトです。
フォーム作成者から提供される「フォームの設問構成」「現在のタイトル・説明文」「任意の自由要望・質問プロンプト」を多角的に分析し、
回答者の離脱を最小限に抑え、信頼感と回答完了率を最大化する【フォームの全体設定】（タイトル、説明文、サブタイトル、テーマカラー、所要時間目安、注意事項アラート等）および【質問に対する回答・アドバイス】と【おすすめの設問構成案】をトータルプロデュースしてください。

【デザイン・設計ルール】
0. 質問に対する回答 (aiReply):
   - 作成者からの要望・質問に対して、プロとしての具体的で心強い回答・解説・アドバイス（100〜200文字程度）。
1. タイトル (title):
   - 簡潔で目的が一目で伝わり、公式感・信頼感のある日本語表記（20文字前後目安）。
2. 説明文 (description):
   - 回答者に向けた丁寧な案内文。目的、入力の所要時間、必要な事前準備、安心感を与える文言を含める。改行を活用して読みやすく構成（100〜250文字）。
3. サブタイトル・キャッチコピー (subtitle):
   - フォーム上部に小さく添える魅力的なキャッチ（例: "最短3分で完了 / 法人・個人事業主様向けお申込手続き"、"24時間受付 / 専任スタッフが翌営業日以内にご連絡"）。
4. おすすめテーマカラー (theme):
   - フォームの用途（ビジネス・B2B、採用、セミナー、顧客アンケート、医療・士業、クリエイティブ等）に最適な配色ペアを決定。
   - primaryColor: ボタンやヘッダーアクセントの主色（16進数カラーコード、例: #1a73e8, #0f766e, #4338ca, #ea580c, #0284c7 などコントラストの高い美しい色）。
   - backgroundColor: フォーム全体の背景色（白または微細なニュアンス色、例: #f8fafc, #f0fdf4, #fdfbf7, #f1f5f9 等）。
   - colorLabel: その配色の印象・名称（例: "ビジネス・ロイヤルブルー & クリーンホワイト"）。
5. 所要時間目安 (estimatedTime):
   - 設問数やセクション数から推定される無理のない回答時間（例: "目安 2〜3分"、"目安 3〜5分"）。
6. 注意事項アラート文 (alertText):
   - 回答者が事前に知っておくべき重要事項（例: "※ インボイス登録番号や口座情報の入力箇所がございますので、お手元にお控えをご用意ください。"）。
7. おすすめ設問構成案 (suggestedQuestions):
   - そのフォームの目的を達成するために含めるべき必須・推奨設問を3〜5個考案（title, type: "text"|"radio"|"checkbox"|"select"|"textarea"|"date", required: boolean, description: string, options: string[]）。
8. 出力は必ず以下のJSONフォーマットのみ（マークダウンのコードブロックなし、生のJSON文字列のみ）:
{
  "aiReply": "作成者からの質問・要望に対する丁寧なアドバイス回答文",
  "recommendationTitle": "短く魅力的な提案タイトル（適切な絵文字付き、例: 💼 インボイス登録状況回収・高信頼フォーム構成）",
  "explanation": "なぜこの設定・配色・構成を推奨するかの解説（1〜2文）",
  "title": "推奨フォームタイトル",
  "description": "推奨フォーム説明文",
  "subtitle": "推奨サブタイトル",
  "theme": {
    "primaryColor": "#1a73e8",
    "backgroundColor": "#f8fafc",
    "colorLabel": "信頼のビジネスブルー & クリーンホワイト"
  },
  "estimatedTime": "目安 2〜3分",
  "alertText": "推奨注意事項アラート文",
  "items": [
    "タイトル・説明文: 目的を明快に伝え、離脱を防ぐ丁寧な文脈に最適化",
    "配色: 信頼感を醸成する「ビジネスブルー」を適用",
    "所要時間・注意事項: 設問内容から算出した適切な目安と事前案内を提示"
  ],
  "suggestedQuestions": [
    {
      "title": "設問タイトル",
      "type": "radio",
      "required": true,
      "description": "設問の補足説明",
      "options": ["選択肢1", "選択肢2"]
    }
  ]
}
`.trim();

      const formSummary = body.formSummary || {};
      const userReq = message ? `\n【作成者からの個別要望・プロンプト】\n${message}\n` : '';

      let structureText = `
【現在のフォーム構成】
- 現在のタイトル: ${formSummary.title || '（無題のフォーム）'}
- 現在の説明文: ${formSummary.description || '（なし）'}
- セクション数: ${Array.isArray(formSummary.sections) ? formSummary.sections.length : 0}
- 全設問一覧:
`.trim();

      if (Array.isArray(formSummary.sections)) {
        formSummary.sections.forEach((sec, sIdx) => {
          structureText += `\n[セクション ${sIdx + 1}: ${sec.title || '無題'}]`;
          (sec.questions || []).forEach(q => {
            structureText += `\n  - ${q.title || '設問'} (${q.type || 'text'})`;
          });
        });
      }

      contents.push({
        role: 'user',
        parts: [{ text: `${structureText}${userReq}\n\n上記フォームに最も適した全体設定をプロデュースし、指定JSON形式で出力してください。` }]
      });

    } else if (mode === 'diagnose_question') {
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
        maxOutputTokens: 3500,
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
      if (mode === 'form_global_concierge') {
        const fallbackAdvice = generateFallbackGlobalAdvice(body.formSummary, message);
        return res.status(200).json({
          success: true,
          isConfigured: true,
          model: 'local-fallback',
          globalAdvice: fallbackAdvice,
          advice: fallbackAdvice
        });
      }
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
      if (mode === 'form_global_concierge') {
        const fallbackAdvice = generateFallbackGlobalAdvice(body.formSummary, message);
        return res.status(200).json({
          success: true,
          isConfigured: true,
          model: successfulModel,
          globalAdvice: fallbackAdvice,
          advice: fallbackAdvice
        });
      }
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
      } else if (mode === 'form_global_concierge') {
        const jsonMatch = cleanJsonStr.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            parsedResult = JSON.parse(jsonMatch[0]);
          } catch(e) {}
        }
      } else {
        // JSON形式から外れていた場合の正規表現フォールバック抽出
        const patternMatch = cleanJsonStr.match(/`(\^[^`]+\$)`/);
        parsedResult = {
          reply: cleanJsonStr,
          pattern: patternMatch ? patternMatch[1] : ''
        };
      }
    }

    if (mode === 'form_global_concierge') {
      if (!parsedResult || typeof parsedResult !== 'object' || !parsedResult.title) {
        parsedResult = generateFallbackGlobalAdvice(body.formSummary, message);
      }
      if (!parsedResult.aiReply) {
        parsedResult.aiReply = parsedResult.explanation || 'ご要望に合わせて最適なフォーム設定と構成案を考案いたしました。';
      }
      return res.status(200).json({
        success: true,
        isConfigured: true,
        model: successfulModel,
        globalAdvice: parsedResult,
        advice: parsedResult
      });
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

function generateFallbackGlobalAdvice(summary, userPrompt) {
  const currentTitle = (summary && summary.title) || '';
  const promptText = (userPrompt || '').toLowerCase();
  let hasRecruit = /採用|応募|求人|エントリー|履歴書|職歴|学歴|志望動機/.test(promptText);
  let hasSurvey = /アンケート|満足度|評価|感想|ご意見/.test(promptText);
  let hasSeminar = /セミナー|説明会|ウェビナー|イベント|参加/.test(promptText);
  let hasInvoice = /インボイス|適格請求書|登録番号|税務|消費税|免税|課税/.test(promptText);

  if (summary && Array.isArray(summary.sections)) {
    summary.sections.forEach(s => {
      (s.questions || []).forEach(q => {
        const t = (q.title || '').toLowerCase();
        if (/採用|応募|エントリー|履歴書|職歴|学歴|志望動機/.test(t)) hasRecruit = true;
        if (/満足度|アンケート|評価|感想|ご意見/.test(t)) hasSurvey = true;
        if (/セミナー|ウェビナー|説明会|イベント|参加/.test(t)) hasSeminar = true;
        if (/インボイス|適格請求書|登録番号|税務|消費税/.test(t)) hasInvoice = true;
      });
    });
  }

  let advice = {
    aiReply: "設問構成と目的に合わせた最適なフォーム全体設定と構成案を考案いたしました。以下の推奨設定やおすすめ設問をご確認ください。",
    recommendationTitle: "🏢 B2B向け高信頼フォーム構成（AIトータルプロデュース）",
    explanation: "設問構成と利用目的に合わせた高品質な設定案を考案しました。回答者の離脱を防ぎ、信頼感を醸成します。",
    title: (currentTitle && currentTitle !== '無題のフォーム' && currentTitle !== '新しいフォーム') ? currentTitle : "【公式】法人様向け 導入相談・お問い合わせフォーム",
    subtitle: "最短3分で入力完了 / 専任スタッフが迅速にご案内いたします",
    description: "製品・サービスの導入検討や御見積のご依頼、各種ご相談を承っております。\n以下のフォームに必要事項をご記入の上、お気軽にご送信ください。担当者より迅速にご連絡差し上げます。",
    theme: {
      primaryColor: "#1a73e8",
      backgroundColor: "#f8fafc",
      colorLabel: "信頼感と気品あるロイヤルブルー & クリーンホワイト"
    },
    estimatedTime: "目安 3〜5分",
    alertText: "※ ご入力いただいたご連絡先宛に、担当者より1営業日以内にご連絡差し上げます。",
    items: [
      "タイトル・説明文: 目的を明快に伝え、離脱を防ぐ丁寧な導入文に最適化",
      "配色: 信頼感を醸成する「ロイヤルブルー」を適用",
      "所要時間・注意事項: 設問内容から算出した適切な目安と事前案内を提示"
    ],
    suggestedQuestions: [
      {
        title: "会社名・法人名（屋号）",
        type: "text",
        required: true,
        description: "正式な会社名または屋号をご記入ください。",
        dataKey: "company_name"
      },
      {
        title: "ご担当者様 氏名",
        type: "text",
        required: true,
        description: "氏名（漢字）をご入力ください。",
        dataKey: "representative_name"
      },
      {
        title: "ご連絡先メールアドレス",
        type: "text",
        required: true,
        description: "確認メールおよび回答控えをお送りいたします。",
        dataKey: "email"
      },
      {
        title: "お問い合わせ・ご相談種別",
        type: "radio",
        required: true,
        description: "ご相談の内容に最も近い項目を選択してください。",
        options: ["サービス導入のご相談", "資料請求・お見積り", "事業連携・パートナーシップ", "その他"]
      }
    ]
  };

  if (hasInvoice) {
    advice.aiReply = "インボイス制度（適格請求書等保存方式）に対応した事業者登録確認フォームの構成案を作成しました。登録状況の判定（登録済・申請中・免税）、Tから始まる13桁の登録番号の回収、正式事業者名、および税務・個人情報取扱い同意までスムーズに完了できる導線をご提案します。";
    advice.recommendationTitle = "💼 インボイス登録状況・適格請求書発行事業者 確認フォーム最適化（AIプロデュース）";
    advice.explanation = "課税・免税事業者の適切な分岐、13桁の登録番号の正確な回収、および税務・法令遵守に関する同意を確実に取得できる高信頼設計です。";
    advice.title = (currentTitle && !/無題|新しいフォーム/.test(currentTitle)) ? currentTitle : "インボイス制度対応 適格請求書発行事業者 登録確認フォーム";
    advice.subtitle = "適格請求書発行事業者の登録状況確認および事業者番号のご提出手続き";
    advice.description = "いつもお取引いただき誠にありがとうございます。\nインボイス制度の導入に伴い、貴社の適格請求書発行事業者としての登録状況および登録番号の確認を実施しております。\nお手数をおかけいたしますが、以下の項目をご確認・ご入力の上、ご提出くださいますようお願い申し上げます。";
    advice.theme = {
      primaryColor: "#0f766e",
      backgroundColor: "#f8fafc",
      colorLabel: "信頼感と厳格さを兼ね備えたエグゼクティブ・ティール & クリーンホワイト"
    };
    advice.estimatedTime = "目安 2〜3分";
    advice.alertText = "※ 適格請求書発行事業者の「登録通知書」または国税庁公表サイトの登録番号（T+13桁）をお手元にご準備ください。";
    advice.items = [
      "タイトル・説明文: 目的（インボイス制度対応の登録情報回収）を明確にし、安心感を醸成",
      "配色: 法令・税務・B2B手続きにふさわしい誠実なエグゼクティブティール",
      "事前準備案内: 登録通知書（T+13桁）の準備を促すアラートを設置",
      "設問構成: 登録状況の分岐、13桁の番号入力、個人情報・税務情報の取扱い同意項目を推奨"
    ];
    advice.suggestedQuestions = [
      {
        title: "適格請求書発行事業者（インボイス発行事業者）の登録状況",
        type: "radio",
        required: true,
        description: "貴社の現在のインボイス登録状況をご選択ください。",
        options: ["登録済み（登録番号あり）", "申請中（番号未着）", "免税事業者（未登録・登録予定なし）"]
      },
      {
        title: "インボイス登録番号（T＋13桁の半角数字）",
        type: "text",
        required: true,
        description: "国税庁から通知された適格請求書発行事業者の登録番号を入力してください。（例: T1234567890123）",
        dataKey: "invoice_number"
      },
      {
        title: "事業者名（屋号または法人名）",
        type: "text",
        required: true,
        description: "登録通知書に記載されている正式名称をご記入ください。",
        dataKey: "company_name"
      },
      {
        title: "個人情報保護方針および税務情報の取扱いへの同意",
        type: "checkbox",
        required: true,
        description: "ご入力いただいた事業者情報および登録番号は、適格請求書発行事業者公表システムとの照合および仕入税額控除の確認目的のみに使用いたします。",
        options: ["プライバシーポリシーおよび税務情報の取扱いに同意する"]
      }
    ];
  } else if (hasRecruit) {
    advice.aiReply = "採用エントリー・応募者向けのフォーム構成案を作成しました。応募者の安心感を高め、熱意を引き出す丁寧なトーンと、スムーズな入力導線をご提案します。";
    advice.recommendationTitle = "🎓 採用エントリー・選考アンケート最適化（AIプロデュース）";
    advice.explanation = "求職者が安心して熱意を伝えられる、清潔感と親しみやすさのある構成を考案しました。";
    advice.title = (currentTitle && !/無題|新しいフォーム/.test(currentTitle)) ? currentTitle : "【公式】採用エントリー・事前アンケートフォーム";
    advice.subtitle = "あなたの可能性をお聞かせください / 応募受付中";
    advice.description = "弊社の採用情報にご関心をお寄せいただき、誠にありがとうございます。\n以下の各項目をご入力の上、送信してください。ご提出いただいた内容は選考の参考とさせていただきます。";
    advice.theme = {
      primaryColor: "#0284c7",
      backgroundColor: "#f8fafc",
      colorLabel: "爽やかで誠実なスカイブルー & クリーンホワイト"
    };
    advice.estimatedTime = "目安 3〜5分";
    advice.alertText = "※ 職務経歴や志望動機等の入力項目がございます。送信前に今一度内容をご確認ください。";
    advice.items = [
      "タイトル・説明文: 応募者の安心感を高め、熱意を引き出す丁寧なトーン",
      "配色: 誠実さと若々しさを表現する「スカイブルー」",
      "案内文: 選考プロセスを安心して進められるガイダンス"
    ];
    advice.suggestedQuestions = [
      {
        title: "お名前（漢字フルネーム）",
        type: "text",
        required: true,
        description: "例: 山田 太郎",
        dataKey: "representative_name"
      },
      {
        title: "メールアドレス",
        type: "text",
        required: true,
        description: "選考結果のご連絡先をご入力ください。",
        dataKey: "email"
      },
      {
        title: "希望職種・ポジション",
        type: "radio",
        required: true,
        options: ["エンジニア / 開発", "営業 / フィールドセールス", "マーケティング / 企画", "バックオフィス / 事務"]
      },
      {
        title: "志望動機・自己PR",
        type: "textarea",
        required: true,
        description: "これまでのご経験や弊社で挑戦したいことをご自由にご記入ください。"
      }
    ];
  } else if (hasSeminar) {
    advice.aiReply = "セミナー・説明会参加受付向けのフォーム構成案を作成しました。参加への心理的ハードルを下げ、当日参加URLの送付案内を明快にする導線をご提案します。";
    advice.recommendationTitle = "📅 セミナー・イベント参加受付最適化（AIプロデュース）";
    advice.explanation = "申込の心理的ハードルを下げ、当日参加率を最大化する案内構成を考案しました。";
    advice.title = (currentTitle && !/無題|新しいフォーム/.test(currentTitle)) ? currentTitle : "セミナー・オンライン説明会 参加申込受付フォーム";
    advice.subtitle = "定員になり次第締切 / 参加無料・オンライン開催";
    advice.description = "当セミナーへの参加お申し込みフォームです。\n必要事項をご入力の上、送信してください。お申し込み完了後、登録メールアドレス宛に参加URLをお送りいたします。";
    advice.theme = {
      primaryColor: "#0f766e",
      backgroundColor: "#f0fdf4",
      colorLabel: "知性的で安心感のあるティールグリーン & ソフトホワイト"
    };
    advice.estimatedTime = "目安 2〜3分";
    advice.alertText = "※ 参加URLの自動送信用として、お間違いのないメールアドレスをご入力ください。";
    advice.items = [
      "タイトル・説明文: 参加ハードルを下げ、参加案内を明確化",
      "配色: 集中力と安心感を高める「ティールグリーン」",
      "案内文: 参加URLの送付について事前に周知"
    ];
    advice.suggestedQuestions = [
      {
        title: "お名前",
        type: "text",
        required: true,
        description: "参加者様のお名前をご入力ください。",
        dataKey: "representative_name"
      },
      {
        title: "メールアドレス（参加URL送信用）",
        type: "text",
        required: true,
        description: "Zoom等の参加リンクをお届けいたします。",
        dataKey: "email"
      },
      {
        title: "ご希望の参加日程",
        type: "radio",
        required: true,
        options: ["第1回: 10月15日(火) 14:00〜15:00", "第2回: 10月22日(火) 14:00〜15:00", "アーカイブ動画配信を希望"]
      },
      {
        title: "セミナーで聞いてみたい内容・事前質問",
        type: "textarea",
        required: false,
        description: "当日講師より回答させていただく場合がございます。"
      }
    ];
  } else if (hasSurvey) {
    advice.aiReply = "顧客満足度・アンケート向けのフォーム構成案を作成しました。回答者の負担を軽減し、率直なフィードバックが集まりやすい親しみやすい導線をご提案します。";
    advice.recommendationTitle = "📊 顧客満足度・アンケート最適化（AIプロデュース）";
    advice.explanation = "回答への心理的負担を和らげ、率直なフィードバックが集まりやすい親しみやすい構成です。";
    advice.title = (currentTitle && !/無題|新しいフォーム/.test(currentTitle)) ? currentTitle : "サービスご利用・ご満足度アンケート";
    advice.subtitle = "1〜2分で回答完了 / サービス向上のためご協力をお願いいたします";
    advice.description = "いつもサービスをご利用いただき誠にありがとうございます。\n今後のより良いサービス改善・機能向上のため、率直なご意見・ご感想をお聞かせいただけますと幸いです。";
    advice.theme = {
      primaryColor: "#ea580c",
      backgroundColor: "#fdfbf7",
      colorLabel: "親しみやすく回答しやすいウォームオレンジ & アイボリー"
    };
    advice.estimatedTime = "目安 1〜3分";
    advice.alertText = "※ ご回答いただいた内容は統計的に処理され、サービス改善以外の目的には使用いたしません。";
    advice.items = [
      "タイトル・説明文: 回答者の負担を減らし、感謝を伝えるトーン",
      "配色: 親近感と温かみを与える「ウォームオレンジ」",
      "プライバシー: データの取扱いに関する安心感を明記"
    ];
    advice.suggestedQuestions = [
      {
        title: "全体的なサービスの総合満足度",
        type: "radio",
        required: true,
        options: ["大変満足", "やや満足", "普通", "やや不満", "大変不満"]
      },
      {
        title: "特に満足している点・良かった機能（複数選択可）",
        type: "checkbox",
        required: false,
        options: ["操作の使いやすさ", "デザインの美しさ", "サポートの迅速さ", "価格・コストパフォーマンス"]
      },
      {
        title: "今後の改善点やご要望",
        type: "textarea",
        required: false,
        description: "率直なご意見をお聞かせください。"
      }
    ];
  }

  if (/明るく|親しみ|カジュアル/.test(promptText)) {
    advice.theme.primaryColor = "#ea580c";
    advice.theme.backgroundColor = "#fffbeb";
    advice.theme.colorLabel = "明るく親しみやすいビタミンオレンジ & ソフトクリーム";
  } else if (/厳格|高級|シック|黒|士業/.test(promptText)) {
    advice.theme.primaryColor = "#1e293b";
    advice.theme.backgroundColor = "#f8fafc";
    advice.theme.colorLabel = "重厚で格調高いディープスレート & クリーンホワイト";
  } else if (/緑|エコ|自然|安心/.test(promptText)) {
    advice.theme.primaryColor = "#16a34a";
    advice.theme.backgroundColor = "#f0fdf4";
    advice.theme.colorLabel = "自然と健康をイメージするフォレストグリーン & ペールミント";
  }

  return advice;
}

