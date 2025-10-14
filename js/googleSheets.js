/**
 * Serviço para integração com Google Sheets
 * Baseado no exemplo: https://github.com/levinunnink/html-form-to-google-sheet
 */

class GoogleSheetsService {
    constructor() {
        // URL do Google Apps Script publicado (como "Web App")
        this.scriptUrl = 'https://script.google.com/macros/s/AKfycbzpyTTYdQq4WoN_OewHVK2ftkQphi0pEjj4OkveqV3P3-O7ZtRLJm3e3krXwO-C_Uvb/exec';
        
        // Token secreto definido no Apps Script (para segurança)
        this.secret = 'CRE2025_ugvkey';
    }

    /**
     * Define uma nova URL do Google Apps Script (opcional)
     * @param {string} url - URL do Google Apps Script publicado
     */
    setScriptUrl(url) {
        this.scriptUrl = url;
    }

    /**
     * Envia os dados do formulário para o Google Sheets
     * @param {Object} formData - Dados do formulário
     * @returns {Promise<Object>} - Resultado do envio
     */
    async submitForm(formData) {
        if (!this.scriptUrl) {
            throw new Error('URL do Google Apps Script não configurada. Use setScriptUrl() primeiro.');
        }

        try {
            // Adiciona o token secreto
            formData.secret = this.secret;

            // Valida os dados obrigatórios
            this.validateFormData(formData);

            // Prepara os dados para envio
            const dataToSend = this.prepareDataForSubmission(formData);

            // Usa URLSearchParams em vez de FormData (melhor compatibilidade com Apps Script)
            const formBody = new URLSearchParams();
            Object.keys(dataToSend).forEach(key => {
                formBody.append(key, dataToSend[key]);
            });

            // Envia os dados via POST
            const response = await fetch(this.scriptUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                },
                body: formBody.toString()
            });

            // Verifica o status da resposta
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }

            // Tenta ler a resposta como JSON
            const result = await response.json().catch(() => null);

            if (result && result.result === 'success') {
                return {
                    success: true,
                    message: 'Dados enviados com sucesso!',
                    row: result.row
                };
            } else {
                throw new Error(result?.error || 'Erro desconhecido no servidor.');
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
     * Valida os campos obrigatórios do formulário
     * @param {Object} formData - Dados do formulário
     */
    validateFormData(formData) {
        const requiredFields = [
            'nome', 'idade', 'genero', 'escola', 
            'cidade', 'anoEscolar', 'turno', 'interesseEnsinoSuperior'
        ];

        // Exige campo extra se o aluno não tiver interesse claro em ensino superior
        if (
            formData.interesseEnsinoSuperior === 'Não' ||
            formData.interesseEnsinoSuperior === 'Ainda estou em dúvida'
        ) {
            requiredFields.push('orientacaoProfissional');
        }

        for (const field of requiredFields) {
            if (!formData[field] || String(formData[field]).trim() === '') {
                throw new Error(`Campo obrigatório não preenchido: ${field}`);
            }
        }
    }

    /**
     * Prepara os dados para envio ao servidor
     * @param {Object} formData - Dados brutos do formulário
     * @returns {Object} - Dados tratados e formatados
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
            SugestoesGerais: formData.sugestoesGerais || '',
            secret: this.secret
        };

        // Remove campos vazios
        Object.keys(prepared).forEach(key => {
            if (prepared[key] === '') delete prepared[key];
        });

        return prepared;
    }

    /**
     * Testa a conexão com o Google Sheets
     * @returns {Promise<Object>} - Resultado do teste
     */
    async testConnection() {
        try {
            const testData = {
                nome: 'Teste de Conexão',
                idade: '25',
                genero: 'Masculino',
                escola: 'Escola Exemplo',
                cidade: 'Cidade Exemplo',
                anoEscolar: '1º Ano do Ensino Médio',
                turno: 'Matutino',
                interesseEnsinoSuperior: 'Sim',
                orientacaoProfissional: 'Sim, tenho interesse'
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
