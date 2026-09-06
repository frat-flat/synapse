// Vercel Serverless Function: api/forms.js
// フォーム定義のクラウド保存・共有エンドポイント (Supabase synapse_storage 連携)

module.exports = async (req, res) => {
  // CORS 設定
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

  const supabaseUrl = process.env.SUPABASE_URL || 'https://uefiuhywfsnrepiouofq.supabase.co';
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlZml1aHl3ZnNucmVwaW91b2ZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5MDMxMTMsImV4cCI6MjA5NjQ3OTExM30.jRluR2-bcMnKf7CSMRM4CtaRlHT4FrBkQWV_lVuWZxQ';

  const STORAGE_KEY = 'synapse_form_customize_all_forms';

  // ==========================================
  // GET: フォームデータの取得
  // ==========================================
  if (req.method === 'GET') {
    try {
      const { id, form_idx } = req.query;

      const fetchUrl = `${supabaseUrl}/rest/v1/synapse_storage?key=eq.${encodeURIComponent(STORAGE_KEY)}&select=value,updated_at`;
      const response = await fetch(fetchUrl, {
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`
        }
      });

      if (!response.ok) {
        return res.status(response.status).json({
          success: false,
          error: `Supabase error: ${response.statusText}`
        });
      }

      const rows = await response.json();
      if (!rows || rows.length === 0 || !rows[0].value) {
        return res.status(200).json({
          success: true,
          forms: [],
          form: null,
          message: 'No forms found on cloud'
        });
      }

      let allForms = rows[0].value;
      if (typeof allForms === 'string') {
        try { allForms = JSON.parse(allForms); } catch(e) {}
      }

      if (!Array.isArray(allForms)) {
        allForms = [allForms];
      }

      // 特定フォームの抽出（id または form_idx）
      let targetForm = null;
      if (id) {
        targetForm = allForms.find(f => f && (f.id === id || f.formId === id));
      }
      if (!targetForm && form_idx !== undefined && form_idx !== null && form_idx !== '') {
        const idx = parseInt(form_idx, 10);
        if (!isNaN(idx) && allForms[idx]) {
          targetForm = allForms[idx];
        }
      }

      return res.status(200).json({
        success: true,
        forms: allForms,
        form: targetForm || (allForms.length > 0 ? allForms[0] : null),
        updated_at: rows[0].updated_at
      });
    } catch (err) {
      console.error('[API forms GET error]', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // ==========================================
  // POST: フォームデータの保存・同期
  // ==========================================
  if (req.method === 'POST') {
    try {
      let body = req.body;
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch(e) {}
      }
      body = body || {};

      let formsToSave = null;

      if (Array.isArray(body.forms)) {
        formsToSave = body.forms;
      } else if (Array.isArray(body.allForms)) {
        formsToSave = body.allForms;
      } else if (Array.isArray(body)) {
        formsToSave = body;
      } else if (body.form && typeof body.form === 'object') {
        // 単一フォームの更新・保存の場合、既存一覧を取得してマージ
        const getUrl = `${supabaseUrl}/rest/v1/synapse_storage?key=eq.${encodeURIComponent(STORAGE_KEY)}&select=value`;
        const getRes = await fetch(getUrl, {
          headers: {
            apikey: supabaseAnonKey,
            Authorization: `Bearer ${supabaseAnonKey}`
          }
        });
        let existingList = [];
        if (getRes.ok) {
          const rows = await getRes.json();
          if (rows && rows[0] && rows[0].value) {
            existingList = Array.isArray(rows[0].value) ? rows[0].value : [rows[0].value];
          }
        }

        const newForm = body.form;
        const targetId = newForm.id || (body.form_idx !== undefined ? `form_${body.form_idx}` : null);
        const existingIdx = targetId ? existingList.findIndex(f => f && f.id === targetId) : -1;

        if (existingIdx !== -1) {
          existingList[existingIdx] = newForm;
        } else if (body.form_idx !== undefined && existingList[body.form_idx]) {
          existingList[body.form_idx] = newForm;
        } else {
          existingList.push(newForm);
        }
        formsToSave = existingList;
      }

      if (!formsToSave) {
        return res.status(400).json({ success: false, error: 'Invalid forms payload' });
      }

      // Supabase synapse_storage へ保存（Upsert）
      const saveUrl = `${supabaseUrl}/rest/v1/synapse_storage`;
      const saveRes = await fetch(saveUrl, {
        method: 'POST',
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
          Prefer: 'resolution=merge-duplicates,return=representation'
        },
        body: JSON.stringify({
          key: STORAGE_KEY,
          value: formsToSave,
          updated_at: new Date().toISOString()
        })
      });

      if (!saveRes.ok) {
        const errText = await saveRes.text();
        console.error('[API forms POST error]', saveRes.status, errText);
        return res.status(saveRes.status).json({ success: false, error: errText });
      }

      return res.status(200).json({
        success: true,
        count: formsToSave.length,
        updated_at: new Date().toISOString()
      });
    } catch (err) {
      console.error('[API forms POST error]', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ success: false, error: 'Method Not Allowed' });
};
