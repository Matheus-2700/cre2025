// ==========================================
// SERVIÇO DE INTEGRAÇÃO COM GOOGLE SHEETS
// Versão Corrigida - Outubro 2025
// ==========================================

class GoogleSheetsService {
    constructor() {
        this.scriptUrl = '';
        this.isConfigured = false;
    }

    /**
     * Configura a URL do Google Apps Script
     * @param {string} url - URL do script publicado
     */
    setScriptUrl(url) {
        if (!url || typeof url !== 'string') {
            console.error('URL inválida fornecida para GoogleSheetsService');
            return false;
        }
        this.scriptUrl = url;
        this.isConfigured = true;
        console.log('✅ Google Sheets configurado com sucesso');
        return true;
    }

    /**
     * Valida os dados do formulário antes do envio
     * @param {Object} formData - Dados do formulário
     * @returns {boolean}
     */
    validateFormData(formData) {
        const requiredFields = ['nome', 'email', 'idade', 'genero', 'escola', 
                               'cidade', 'anoEscolar', 'turno', 'interesseEnsinoSuperior'];
        
        for (let field of requiredFields) {
            if (!formData[field] || formData[field].trim() === '') {
                throw new Error(`Campo obrigatório não preenchido: ${field}`);
            }
        }

        // Valida formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            throw new Error('Formato de email inválido');
        }

        return true;
    }

    /**
     * Prepara os dados para envio com capitalização correta
     * @param {Object} formData - Dados brutos do formulário
     * @returns {Object}
     */
    prepareDataForSubmission(formData) {
        return {
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
            SugestoesGerais: formData.sugestoesGerais || ''
        };
    }

    /**
     * Envia os dados do formulário para o Google Sheets
     * @param {Object} formData - Dados do formulário
     * @returns {Promise}
     */
    async submitForm(formData) {
        // Verifica se o serviço está configurado
        if (!this.isConfigured || !this.scriptUrl) {
            throw new Error('Serviço não configurado. Configure a URL do Google Apps Script primeiro.');
        }

        try {
            // Valida os dados
            this.validateFormData(formData);
            
            // Prepara os dados para envio
            const dataToSend = this.prepareDataForSubmission(formData);
            
            console.log('📤 Enviando dados:', dataToSend);

            // Faz a requisição com configuração corrigida
            const response = await fetch(this.scriptUrl, {
                method: 'POST',
                mode: 'no-cors', // IMPORTANTE: isso evita erros de CORS
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataToSend),
                redirect: 'follow'
            });

            // Com no-cors, não podemos ler a resposta, então assumimos sucesso
            console.log('✅ Dados enviados com sucesso');
            return {
                status: 'success',
                message: 'Formulário enviado com sucesso!'
            };

        } catch (error) {
            console.error('❌ Erro ao enviar formulário:', error);
            throw error;
        }
    }

    /**
     * Testa a conexão com o Google Apps Script
     * @returns {Promise}
     */
    async testConnection() {
        if (!this.isConfigured || !this.scriptUrl) {
            return {
                success: false,
                message: 'URL do script não configurada'
            };
        }

        try {
            const response = await fetch(this.scriptUrl, {
                method: 'GET',
                mode: 'no-cors'
            });

            return {
                success: true,
                message: 'Conexão estabelecida com sucesso'
            };
        } catch (error) {
            return {
                success: false,
                message: 'Erro ao conectar: ' + error.message
            };
        }
    }
}

// Exporta uma instância única do serviço
const googleSheetsService = new GoogleSheetsService();

// Torna disponível globalmente
if (typeof window !== 'undefined') {
    window.googleSheetsService = googleSheetsService;
}