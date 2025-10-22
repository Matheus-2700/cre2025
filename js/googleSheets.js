/**
 * @class GoogleSheetsService
 * @description Classe para gerenciar a integração e o envio de dados de um formulário HTML
 * para uma planilha do Google Sheets através de um proxy Vercel (resolve CORS).
 *
 * @version 2.4 (Corrigido: Usa proxy /api/proxy-to-sheet para evitar erro de CORS)
 */
class GoogleSheetsService {
    constructor() {
        this.scriptUrl = '';
        this.isConfigured = false;
        this.requiredFields = [];
        this.useProxy = true; // Sempre usar proxy por padrão
        console.log('✅ GoogleSheetsService iniciado.');
    }

    setScriptUrl(url) {
        if (url && url.startsWith('https://script.google.com/macros/s/')) {
            this.scriptUrl = url;
            this.isConfigured = true;
            console.log('🔧 Google Sheets configurado: true');
            console.log('🔄 Usando proxy para evitar erro de CORS');
        } else {
            console.error('❌ URL do Google Apps Script inválida ou não configurada.');
            this.isConfigured = false;
        }
    }

    setRequiredFields(fields = []) {
        if (!Array.isArray(fields)) throw new Error('setRequiredFields espera um array.');
        this.requiredFields = fields;
        console.log('🔒 Campos obrigatórios definidos:', this.requiredFields);
    }

    validateFormData(formData) {
        if (!this.requiredFields || this.requiredFields.length === 0) {
            console.log('ℹ️ Validação de campos obrigatórios ignorada.');
            return true;
        }

        for (const field of this.requiredFields) {
            const val = formData[field];
            if (val === undefined || val === null || (typeof val === 'string' && val.trim() === '') || (Array.isArray(val) && val.length === 0)) {
                throw new Error(`O campo "${field}" é obrigatório.`);
            }
        }

        if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
            throw new Error('O formato do e-mail é inválido.');
        }

        console.log('✅ Dados do formulário validados com sucesso.');
        return true;
    }

    prepareDataForSubmission(formData) {
        console.log('📋 Dados brutos recebidos para preparação:', formData || {});

        const preparedData = {
            'Data': new Date().toISOString(),
            'Nome': formData.nome || '',
            'Email': formData.email || '',
            'Telefone': formData.telefone || '',
            'Idade': formData.idade || '',
            'Genero': formData.genero || '',
            'GeneroOutro': formData.generoOutro || '',
            'Escola': formData.escola || '',
            'EscolaOutra': formData.escolaOutra || '',
            'Cidade': formData.cidade || '',
            'CidadeOutra': formData.cidadeOutra || '',
            'AnoEscolar': formData.anoEscolar || '',
            'Turno': formData.turno || '',
            'InteresseEnsinoSuperior': formData.interesseEnsinoSuperior || '',
            'CursoInteresse': Array.isArray(formData.cursoInteresse) ? formData.cursoInteresse.join(', ') : (formData.cursoInteresse || ''),
            'FatorMotivacao': Array.isArray(formData.fatorMotivacao) ? formData.fatorMotivacao.join(', ') : (formData.fatorMotivacao || ''),
            'MotivoNaoInteresse': Array.isArray(formData.motivoNaoInteresse) ? formData.motivoNaoInteresse.join(', ') : (formData.motivoNaoInteresse || ''),
            'InteresseTecnico': formData.interesseTecnico || '',
            'OrientacaoProfissional': formData.orientacaoProfissional || '',
            'ParticipouOrientacao': formData.participouOrientacao || '',
            'AcoesInteresseSuperior': Array.isArray(formData.acoesInteresseSuperior) ? formData.acoesInteresseSuperior.join(', ') : (formData.acoesInteresseSuperior || ''),
            'SugestoesGerais': formData.sugestoesGerais || ''
        };

        console.log('📤 Dados formatados prontos para envio:', preparedData);
        return preparedData;
    }

    async submitForm(formData) {
        if (!this.isConfigured) {
            return Promise.reject({ status: 'error', message: 'URL do Google Sheets não configurada.' });
        }

        try {
            this.validateFormData(formData || {});
            const preparedData = this.prepareDataForSubmission(formData || {});

            // Usar proxy da Vercel em vez de chamar Apps Script diretamente
            const proxyUrl = '/api/proxy-to-sheet';
            
            console.log('📤 Enviando dados via proxy Vercel...', { 
                proxy: proxyUrl, 
                destination: this.scriptUrl,
                data: preparedData 
            });

            // Enviar dados via proxy
            const response = await fetch(proxyUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(preparedData)
            });

            const text = await response.text();
            let result;
            
            try {
                result = JSON.parse(text);
            } catch {
                console.warn('⚠️ Resposta do servidor não é JSON:', text);
                result = { status: response.ok ? 'ok' : 'error', raw: text, httpStatus: response.status };
            }

            if (!response.ok) {
                console.error('❌ Erro HTTP ao enviar dados:', response.status, response.statusText, result);
                return Promise.reject({ 
                    status: 'error', 
                    message: result.message || 'Erro HTTP: ' + response.status, 
                    raw: result 
                });
            }

            if (result && result.status && result.status.toLowerCase() === 'error') {
                console.error('❌ Apps Script retornou erro:', result);
                return Promise.reject({ 
                    status: 'error', 
                    message: result.message || 'Erro retornado pelo Apps Script', 
                    raw: result 
                });
            }

            console.log('✅ Resposta do servidor recebida:', result);
            return result;

        } catch (error) {
            console.error('❌ Erro durante o envio do formulário:', error?.message || error);
            return Promise.reject({ 
                status: 'error', 
                message: error?.message || String(error) 
            });
        }
    }

    async testConnection() {
        if (!this.isConfigured) return { status: 'error', message: 'URL não configurada' };
        
        try {
            const proxyUrl = '/api/proxy-to-sheet';
            console.log('🧪 Testando conexão via proxy...');
            
            const res = await fetch(proxyUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ test: true })
            });
            
            const text = await res.text();
            try { 
                const result = JSON.parse(text);
                console.log('✅ Teste de conexão:', result);
                return result;
            } catch { 
                console.log('⚠️ Teste retornou:', text);
                return { status: res.ok ? 'ok' : 'error', raw: text }; 
            }
        } catch (err) {
            console.error('❌ Erro no teste de conexão:', err);
            return { status: 'error', message: String(err) };
        }
    }
}