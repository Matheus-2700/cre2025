/**
 * @class GoogleSheetsService
 * @description Classe para gerenciar a integração e o envio de dados de um formulário HTML
 * para uma planilha do Google Sheets através de um Google Apps Script.
 *
 * Funcionalidades:
 * - Configuração da URL do script.
 * - Validação de dados do formulário no lado do cliente (opcional).
 * - Preparação e formatação dos dados para envio.
 * - Tratamento de campos de múltipla escolha (checkboxes).
 * - Envio assíncrono dos dados usando a API Fetch.
 * - Teste de conexão com o script.
 *
 * @version 2.2 (Corrigido: map removido)
 */
class GoogleSheetsService {
    constructor() {
        this.scriptUrl = '';
        this.isConfigured = false;
        this.requiredFields = [];
        console.log('✅ GoogleSheetsService iniciado.');
    }

    setScriptUrl(url) {
        if (url && url.startsWith('https://script.google.com/macros/s/')) {
            this.scriptUrl = url;
            this.isConfigured = true;
            console.log('🔧 Google Sheets configurado: true');
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
            console.log('ℹ️ Validação de campos obrigatórios ignorada (requiredFields não definido).');
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

        // Mapeamento: chave do objeto formData -> título na planilha
        const preparedData = {
            'Data': new Date(),
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

    buildFormData(preparedData) {
        const fd = new FormData();
        Object.keys(preparedData).forEach(key => {
            const val = preparedData[key];
            if (Array.isArray(val)) {
                val.forEach(v => fd.append(key, v === undefined || v === null ? '' : String(v)));
            } else {
                fd.append(key, val === undefined || val === null ? '' : String(val));
            }
        });
        return fd;
    }

    async submitForm(formData) {
        if (!this.isConfigured) {
            return Promise.reject({ status: 'error', message: 'URL do Google Sheets não configurada.' });
        }

        try {
            this.validateFormData(formData || {});
            const preparedData = this.prepareDataForSubmission(formData || {});
            const body = this.buildFormData(preparedData);

            console.log('📤 Enviando dados para o Google Apps Script...', { url: this.scriptUrl, bodyPreview: preparedData });
            const response = await fetch(this.scriptUrl, {
                method: 'POST',
                body: body,
            });

            const text = await response.text();
            let result;
            try {
                result = JSON.parse(text);
            } catch (err) {
                console.warn('⚠️ Resposta do server não é JSON:', text);
                result = { status: response.ok ? 'ok' : 'error', raw: text, httpStatus: response.status };
            }

            if (!response.ok || (result && result.status && result.status.toLowerCase() === 'error')) {
                console.error('❌ Erro ao enviar dados:', response.status, result);
                return Promise.reject({ status: 'error', message: result.message || 'Erro no envio', raw: result });
            }

            console.log('✅ Resposta do servidor recebida:', result);
            return result;
        } catch (error) {
            console.error('❌ Erro durante o envio do formulário:', error && error.message ? error.message : error);
            return Promise.reject({ status: 'error', message: (error && error.message) ? error.message : String(error) });
        }
    }

    async testConnection() {
        if (!this.isConfigured) return { status: 'error', message: 'URL não configurada' };
        try {
            const res = await fetch(this.scriptUrl, { method: 'POST', body: new FormData() });
            const text = await res.text();
            try { return JSON.parse(text); } catch (e) { return { status: res.ok ? 'ok' : 'error', raw: text }; }
        } catch (err) {
            return { status: 'error', message: String(err) };
        }
    }
}
