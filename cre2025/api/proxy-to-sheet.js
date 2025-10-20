// api/proxy-to-sheet.js (cole no repo e faça deploy na Vercel)
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // SUA URL DO APPS SCRIPT (já preenchida)
    const appsScriptUrl = 'https://script.google.com/macros/s/AKfycbxqlaBH-vWlLDjB-R1KenF5kXQ2yflEDrrzQQQIkyfBu76I4xbMwAP5p9gEGt46txP9cA/exec';

    // Opção de segurança: use secret via env var (recomendo). Se usar, defina FORMS_SECRET no painel do Vercel.
    const FORBIDDEN = !process.env.FORMS_SECRET ? false :
      (req.body && req.body.secret === process.env.FORMS_SECRET ? false : true);

    if (FORBIDDEN) {
      return res.status(403).json({ error: 'Forbidden: invalid secret' });
    }

    // Encaminha o body para o Apps Script
    const resp = await fetch(appsScriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });

    const text = await resp.text();
    res.status(resp.status).send(text);

  } catch (err) {
    console.error('proxy error:', err);
    res.status(500).json({ error: err.toString() });
  }
}
