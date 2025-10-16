class GoogleSheetsService {
    constructor() {
        this.scriptUrl = 'https://script.google.com/macros/s/AKfycbxi3i2XDhWhy_Bl95Gvj5KBtD2Io2sbiXbI1w8JebotJk6yGO6XrS1_FCsM4UAWgmwj/exec';
        this.secret = 'CRE2025_ugvkey';
    }

    setScriptUrl(url) {
        this.scriptUrl = url;
    }

    async submitForm(formData) {
        if (!this.scriptUrl) {
            return {
                success: false,
                message: 'URL do Google Apps Script não configurada.'
            };
        }

        try {
            // Adiciona o token secreto
            formData.secret = this.secret;

            // Validação dos dados obrigatórios
            this.validateFormData(formData);

            // Prepara os dados
            const dataToSend = this.prepareDataForSubmission(formData);

            // Prepara o body
            const formBody = new URLSearchParams();
            Object.keys(dataToSend).forEach(key => formBody.append(key, dataToSend[key]));

            // Faz o fetch
            const response = await fetch(this.scriptUrl, {
                method: 'POST',
                mode: 'cors', // garante CORS
                headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
                body: formBody.toString()
            });

            // Tenta ler JSON; se falhar, lê texto
            let result;
            try {
                result = await response.json();
            } catch(e) {
                const text = await response.text();
                throw new Error(`Resposta inválida do servidor: ${text}`);
            }

            // Verifica o resultado
            if (result && result.result === 'success') {
                return { success: true, message: 'Dados enviados com sucesso!', row: result.row };
            } else {
                throw new Error(result?.error || 'Erro desconhecido no servidor.');
            }

        } catch (error) {
            // Converte qualquer erro para string legível
            const mensagemErro = error?.message || (typeof error === 'object' ? JSON.stringify(error) : String(error));
            return { success: false, message: mensagemErro };
        }
    }

    validateFormData(formData) {
        const requiredFields = ['nome', 'idade', 'genero', 'escola', 'cidade', 'anoEscolar', 'turno', 'interesseEnsinoSuperior'];

        if (formData.interesseEnsinoSuperior === 'Não' || formData.interesseEnsinoSuperior === 'Ainda estou em dúvida') {
            requiredFields.push('orientacaoProfissional');
        }

        for (const field of requiredFields) {
            if (!formData[field] || String(formData[field]).trim() === '') {
                throw new Error(`Campo obrigatório não preenchido: ${field}`);
            }
        }
    }

    prepareDataForSubmission(formData) {
        const prepared = {
            Nome: formData.nome || '',
            Email: formData.email || '',
            Telefone: formData.telefone || '',
            Idade: formData.idade || '',
            Genero: formData.genero || '',
            GeneroOutro: formData.generoOutro || '',
            Escola: formData.escola || '',
            EscolaOutra: formData.escolaOutra || '',
            Cidade: formData.cidade || '',
            CidadeOutra: formData.cidadeOutra || '',
            AnoEscolar: formData.anoEscolar || '',
            Turno: formData.turno || '',
            InteresseEnsinoSuperior: formData.interesseEnsinoSuperior || '',
            CursoInteresse: formData.cursoInteresse || '',
            CursoInteresseOutro: formData.cursoInteresseOutro || '',
            FatorMotivacao: formData.fatorMotivacao || '',
            FatorMotivacaoOutro: formData.fatorMotivacaoOutro || '',
            MotivoNaoInteresse: formData.motivoNaoInteresse || '',
            MotivoNaoInteresseOutro: formData.motivoNaoInteresseOutro || '',
            InteresseTecnico: formData.interesseTecnico || '',
            OrientacaoProfissional: formData.orientacaoProfissional || '',
            ParticipouOrientacao: formData.participouOrientacao || '',
            AcoesInteresseSuperior: formData.acoesInteresseSuperior || '',
            AcoesInteresseSuperiorOutro: formData.acoesInteresseSuperiorOutro || '',
            SugestoesGerais: formData.sugestoesGerais || '',
            secret: this.secret
        };

        Object.keys(prepared).forEach(key => {
            if (prepared[key] === '') delete prepared[key];
        });

        return prepared;
    }

    async testConnection() {
        try {
