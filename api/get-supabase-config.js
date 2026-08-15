module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
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

  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  const partnerUrl = process.env.PARTNER_SUPABASE_URL;
  const partnerAnonKey = process.env.PARTNER_SUPABASE_ANON_KEY;
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const googleApiKey = process.env.GOOGLE_API_KEY;

  if (!url || !anonKey) {
    return res.status(200).json({
      success: false,
      error: 'Supabase configuration is not set in environment variables.'
    });
  }

  return res.status(200).json({
    success: true,
    url: url,
    anonKey: anonKey,
    partnerUrl: partnerUrl || null,
    partnerAnonKey: partnerAnonKey || null,
    googleClientId: googleClientId || null,
    googleApiKey: googleApiKey || null
  });
};
