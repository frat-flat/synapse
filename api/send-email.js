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

  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = process.env.SMTP_SECURE === 'true';

  // Fallback for development / unconfigured state
  if (!host || !port || !user || !pass) {
    console.warn('[SMTP Warning] SMTP environment variables are not fully configured. Simulated mail sending.');
    return res.status(200).json({
      success: true,
      simulated: true,
      message: 'SMTP settings not configured. Simulated sending successfully to: ' + to
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: host,
      port: parseInt(port, 10),
      secure: secure,
      auth: {
        user: user,
        pass: pass
      }
    });

    const mailOptions = {
      from: `"${process.env.SMTP_FROM_NAME || 'Synapse'}" <${process.env.SMTP_FROM || user}>`,
      to: to,
      subject: subject,
      text: text,
      html: html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('[SMTP Success] Mail sent successfully:', info.messageId);
    
    return res.status(200).json({
      success: true,
      messageId: info.messageId
    });
  } catch (error) {
    console.error('[SMTP Error] Failed to send email:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
