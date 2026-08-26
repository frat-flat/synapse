const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
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

  const { to, subject, text, html } = req.body;

  if (!to || !subject || (!text && !html)) {
    return res.status(400).json({ success: false, error: 'Missing required fields (to, subject, text/html)' });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const fromName = process.env.SMTP_FROM_NAME || 'Synapse';
  const fromEmail = process.env.SMTP_FROM || 'onboarding@resend.dev';

  // Fallback for development / unconfigured state
  if (!resendApiKey) {
    console.warn('[Resend Warning] RESEND_API_KEY is not configured. Simulated mail sending.');
    return res.status(200).json({
      success: true,
      simulated: true,
      message: 'Resend API key not configured. Simulated sending successfully to: ' + to
    });
  }

  try {
    // Standard Node.js fetch implementation for serverless compatibility without external SDK dependencies
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`
      },
      body: JSON.stringify({
        from: `"${fromName}" <${fromEmail}>`,
        to: [to],
        subject: subject,
        html: html,
        text: text
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Resend API Error (Status: ${response.status})`);
    }

    console.log('[Resend Success] Mail sent successfully:', data.id);
    
    return res.status(200).json({
      success: true,
      messageId: data.id
    });
  } catch (error) {
    console.error('[Resend Error] Failed to send email:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
