class GoogleSheetsService {
    constructor() {
        this.scriptUrl = '';
        this.isConfigured = false;
        console.log('✅ GoogleSheetsService iniciado.');
    }

    setScriptUrl(url) {
        if (url && url.startsWith('https://script.google.com/macros/s/' )) {
            this.scriptUrl = url;
            this.isConfigured = true;
            console.log('🔧 Google Sheets configurado: true');
        } else {
            console.error('❌ URL do Google Apps Script inválida ou não configurada.');
            this.isConfigured = false;
        }
    }

    validateFormData(formData) {
        const requiredFields = ['nome', 'idade', 'genero', 'cidade', 'escola', 'anoEscolar', 'turno', 'interesseEnsinoSuperior'];
        for (const field of requiredFields) {
            if (!formData[field]) {
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
        console.log('📋 Dados brutos recebidos para preparação:', formData);
        const preparedData = {
            'Nome': formData.nome || '', 'Email': formData.email || '', 'Telefone': formData.telefone || '',
            'Idade': formData.idade || '', 'Genero': formData.genero || '', 'GeneroOutro': formData.generoOutro || '',
            'Escola': formData.escola || '', 'EscolaOutra': formData.escolaOutra || '', 'Cidade': formData.cidade || '',
            'CidadeOutra': formData.cidadeOutra || '', 'AnoEscolar': formData.anoEscolar || '', 'Turno': formData.turno || '',
            'InteresseEnsinoSuperior': formData.interesseEnsinoSuperior || '',
            'CursoInteresse': Array.isArray(formData.cursoInteresse) ? formData.cursoInteresse.join(', ') : (formData.cursoInteresse || ''),
            'FatorMotivacao': Array.isArray(formData.fatorMotivacao) ? formData.fatorMotivacao.join(', ') : (formData.fatorMotivacao || ''),
            'MotivoNaoInteresse': Array.isArray(formData.motivoNaoInteresse) ? formData.motivoNaoInteresse.join(', ') : (formData.motivoNaoInteresse || ''),
            'AcoesInteresseSuperior': Array.isArray(formData.acoesInteresseSuperior) ? formData.acoesInteresseSuperior.join(', ') : (formData.acoesInteresseSuperior || ''),
            'CursoInteresseOutro': formData.cursoInteresseOutro || '', 'FatorMotivacaoOutro': formData.fatorMotivacaoOutro || '',
            'MotivoNaoInteresseOutro': formData.motivoNaoInteresseOutro || '', 'AcoesInteresseSuperiorOutro': formData.acoesInteresseSuperiorOutro || '',
            'InteresseTecnico': formData.interesseTecnico || '', 'OrientacaoProfissional': formData.orientacaoProfissional || '',
            'ParticipouOrientacao': formData.participouOrientacao || '', 'SugestoesGerais': formData.sugestoesGerais || ''
        };
        console.log('📤 Dados formatados prontos para envio:', preparedData);
        return preparedData;
    }

    async submitForm(formData) {
        if (!this.isConfigured) {
            return Promise.reject({ status: 'error', message: 'URL do Google Sheets não configurada.' });
        }
        try {
            this.validateFormData(formData);
            const preparedData = this.prepareDataForSubmission(formData);
            const queryString = new URLSearchParams(preparedData).toString();

            console.log('📤 Enviando dados para o Google Apps Script (formato Query String)...');
            const response = await fetch(this.scriptUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: queryString,
            });

            if (!response.ok) throw new Error(`Erro na rede: ${response.statusText}`);
            const result = await response.json();
            if (result.status === 'error') throw new Error(`Erro retornado pelo Google Apps Script: ${result.message}`);
            
            console.log('✅ Resposta do servidor recebida:', result);
            return result;
        } catch (error) {
            console.error('❌ Erro durante o envio do formulário:', error.message);
            return Promise.reject({ status: 'error', message: error.message });
        }
    }
}
