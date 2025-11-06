export default async function handler(req, res) {
  // Configurar headers CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Responder requisições OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Aceitar apenas POST
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      status: 'error',
      message: 'Method not allowed. Only POST is accepted.' 
    });
  }

  try {
    // URL do seu Google Apps Script
    const appsScriptUrl = 'https://script.google.com/macros/s/AKfycbx5DpFbUMd_hDwjnZTHALlJ4CpCv2j5qRSKFeZlWC--yHtvLdw1LauQRCzSijGs2lIbDw/exec';

    console.log('🔄 Proxy recebeu requisição');
    console.log('📋 Dados recebidos:', JSON.stringify(req.body, null, 2));

    // Fazer requisição para o Google Apps Script
    const response = await fetch(appsScriptUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });

    // Ler resposta
    const text = await response.text();
    console.log('📨 Resposta do Apps Script:', text);

    // Tentar fazer parse do JSON
    let result;
    try {
      result = JSON.parse(text);
    } catch (parseError) {
      console.warn('⚠️ Resposta não é JSON válido');
      result = { 
        status: response.ok ? 'success' : 'error', 
        raw: text,
        httpStatus: response.status 
      };
    }

    // Retornar resposta com status HTTP apropriado
    return res.status(response.status).json(result);

  } catch (error) {
    console.error('❌ Erro no proxy:', error);
    
    return res.status(500).json({ 
      status: 'error', 
      message: 'Erro ao processar requisição: ' + error.message,
      error: error.toString()
    });
  }
}