/**
 * Synapse SMS 配送 API (Vercel Serverless Function)
 * 
 * [本番環境 (Twilio 連携時)]
 * 環境変数に以下を設定することで、本物の携帯電話へSMS送信されます：
 * - TWILIO_ACCOUNT_SID: Twilio アカウントSID (AC...)
 * - TWILIO_AUTH_TOKEN: Twilio 認証トークン
 * - TWILIO_PHONE_NUMBER: 送信元電話番号 (E.164形式: +1... または +81...)
 * 
 * [未設定時 (開発・テストモード)]
 * 環境変数が未設定の場合は、安全にシミュレーションとして動作し、
 * success: true, simulated: true を返します。
 */

export default async function handler(req, res) {
  // CORS ヘッダーの設定
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  try {
    const { to, message, code } = req.body || {};

    if (!to) {
      return res.status(400).json({ error: 'Missing "to" (phone number) parameter.' });
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromPhone = process.env.TWILIO_PHONE_NUMBER;

    // Twilio 環境変数が未設定の場合はシミュレーションとして返却
    if (!accountSid || !authToken || !fromPhone) {
      console.log(`[SMS Simulation] To: ${to}, Code: ${code || 'N/A'}, Message: ${message || 'Auth Code'}`);
      return res.status(200).json({
        success: true,
        simulated: true,
        message: 'Twilio credentials not configured. SMS sending simulated.',
        to: to,
        code: code
      });
    }

    // 日本の電話番号 (090..., 080..., 070...) を国際形式 (+81...) に変換
    let formattedTo = to.replace(/[-\s]/g, '');
    if (formattedTo.startsWith('0')) {
      formattedTo = '+81' + formattedTo.slice(1);
    } else if (!formattedTo.startsWith('+')) {
      formattedTo = '+' + formattedTo;
    }

    const bodyText = message || `【Synapse】認証コードは [ ${code} ] です。5分以内に入力してください。`;

    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const params = new URLSearchParams();
    params.append('To', formattedTo);
    params.append('From', fromPhone);
    params.append('Body', bodyText);

    const authHeader = 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64');

    const twilioRes = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    const result = await twilioRes.json();

    if (!twilioRes.ok) {
      console.error('[Twilio Error]:', result);
      return res.status(twilioRes.status).json({
        error: result.message || 'Failed to send SMS via Twilio',
        code: result.code
      });
    }

    return res.status(200).json({
      success: true,
      messageId: result.sid
    });
  } catch (err) {
    console.error('[SMS Server Error]:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
