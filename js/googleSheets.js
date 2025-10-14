/**
 * Serviço para integração com Google Sheets
 * Baseado no exemplo: https://github.com/levinunnink/html-form-to-google-sheet
 */

class GoogleSheetsService {
    constructor() {
        // URL do Google Apps Script publicado
        this.scriptUrl = 'https://script.google.com/macros/s/AKfycbyEKs_RPyCnyjLT0hqL47RLrjgAgGtBMuiRvUbqipRCjh1ak8s_1BnONiL5qrHdvytK/exec';
        
        // Token secreto definido no Apps Script
        this.secret = 'CRE2025_ugvkey';
    }

    /**
     * Configura a URL do Google Apps Script (opcional)
     * @param {string} url - URL do Google Apps Script publicado
     */
    setScriptUrl(url) {
        this.scriptUrl = url;
    }

    /**
     * Envia os dados do formulário para o Google Sheets
     * @param {Object} formData - Dados do formulário
     * @returns {Promise} - Promise com o resultado do envio
     */
    async submitForm(formData) {
        if (!this.scriptUrl) {
            throw new Error('URL do Google Apps Script não configurada. Use setScriptUrl() primeiro.');
        }

        try {
            // Adiciona token secreto
            formData.secret = this.secret;

            // Validação básica dos dados
            this.validateFormData(formData);

            // Prepara os dados para envio
            const dataToSend = this.prepareDataForSubmission(formData);

            // Cria o FormData para envio
            const formDataToSend = new FormData();
            Object.keys(dataToSend).forEach(key => {
                formDataToSend.append(key, dataToSend[key]);
            });

            // Envia os dados para o Google Apps Script
            const response = await fetch(this.scriptUrl, {
                method: 'POST',
                body: formDataToSend
            });

            // Verifica se a resposta foi bem-sucedida
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }

            // Tenta fazer o parse da resposta JSON
            const result = await response.json();
            
            if (result.result === 'success') {
                return {
                    success: true,
                    message: 'Dados enviados com sucesso!',
                    row: result.row
                };
            } else {
                throw new Error(result.error || 'Erro desconhecido no servidor');
            }

        } catch (error) {
            console.error('Erro ao enviar dados para Google Sheets:', error);
            return {
                success: false,
                message: `Erro ao enviar dados: ${error.message}`
            };
        }
    }

    /**
     * Valida os dados do formulário antes do envio
     * @param {Object} formData - Dados do formulário
     */
    validateFormData(formData) {
        const requiredFields = ['nome', 'idade', 'genero', 'escola', 'cidade', 'anoEscolar', 'turno', 'interesseEnsinoSuperior', 'orientacaoProfissional'];
        
        for (const field of requiredFields) {
            if (!formData[field] || formData[field].trim() === '') {
                throw new Error(`Campo obrigatório não preenchido: ${field}`);
            }
        }

    }

    /**
     * Prepara os dados para envio, formatando conforme necessário
     * @param {Object} formData - Dados brutos do formulário
     * @returns {Object} - Dados formatados para envio
     */
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
            SugestoesGerais: formData.sugestoesGerais || ''
        };

        // Remove campos vazios
        Object.keys(prepared).forEach(key => {
            if (prepared[key] === '') delete prepared[key];
        });

        return prepared;
    }

    /**
     * Método utilitário para testar a conexão com o Google Sheets
     * @returns {Promise} - Promise com o resultado do teste
     */
    async testConnection() {
        try {
            const testData = {
                nome: 'Teste de Conexão',
                idade: '25',
                genero: 'Teste',
                escola: 'Escola Teste',
                cidade: 'Cidade Teste',
                anoEscolar: '1º Ano do Ensino Médio',
                turno: 'Matutino',
                interesseEnsinoSuperior: 'Sim',
                orientacaoProfissional: 'Sim, tenho interesse',
                secret: this.secret
            };

            const result = await this.submitForm(testData);
            return result;

        } catch (error) {
            return {
                success: false,
                message: `Erro no teste de conexão: ${error.message}`
            };
        }
    }
}

// Exporta a classe globalmente
window.GoogleSheetsService = GoogleSheetsService;
