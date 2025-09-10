/**
 * Serviço para integração com Google Sheets
 * Baseado no exemplo: https://github.com/levinunnink/html-form-to-google-sheet
 */

class GoogleSheetsService {
    constructor() {
        // URL do Google Apps Script que será configurado
        // Esta URL deve ser obtida após publicar o Google Apps Script
        this.scriptUrl = '';
        
        // Configurar a URL do script aqui ou via variável de ambiente
        // Exemplo: this.scriptUrl = 'https://script.google.com/macros/s/SEU_SCRIPT_ID/exec';
    }

    /**
     * Configura a URL do Google Apps Script
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
        const requiredFields = ['nome', 'email', 'idade', 'genero', 'escola', 'cidade', 'anoEscolar', 'turno', 'interesseEnsinoSuperior', 'orientacaoProfissional'];
        
        for (const field of requiredFields) {
            if (!formData[field] || formData[field].trim() === '') {
                throw new Error(`Campo obrigatório não preenchido: ${field}`);
            }
        }

        // Validação de formato de e-mail
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            throw new Error('Formato de e-mail inválido');
        }

        // Validação de idade
        const idade = parseInt(formData.idade);
        if (isNaN(idade) || idade < 10 || idade > 99) {
            throw new Error('Idade deve ser um número entre 10 e 99');
        }
    }

    /**
     * Prepara os dados para envio, formatando conforme necessário
     * @param {Object} formData - Dados brutos do formulário
     * @returns {Object} - Dados formatados para envio
     */
    prepareDataForSubmission(formData) {
        const prepared = {
            // Campos básicos (devem corresponder aos headers da planilha)
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
            InstituicaoPreferencia: formData.instituicaoPreferencia || '',
            MotivoNao: formData.motivoNao || '',
            PlanosFuturos: formData.planosFuturos || '',
            OrientacaoProfissional: formData.orientacaoProfissional || '',
            TipoApoio: formData.tipoApoio || '',
            Comentarios: formData.comentarios || ''
        };

        // Remove campos vazios para não poluir a planilha
        Object.keys(prepared).forEach(key => {
            if (prepared[key] === '') {
                delete prepared[key];
            }
        });

        return prepared;
    }

    /**
     * Método utilitário para testar a conexão com o Google Sheets
     * @returns {Promise} - Promise com o resultado do teste
     */
    async testConnection() {
        if (!this.scriptUrl) {
            return {
                success: false,
                message: 'URL do Google Apps Script não configurada'
            };
        }

        try {
            const testData = {
                nome: 'Teste de Conexão',
                email: 'teste@exemplo.com',
                idade: '25',
                genero: 'Teste',
                escola: 'Escola Teste',
                cidade: 'Cidade Teste',
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

// Exporta a classe para uso em outros arquivos
// Para uso em HTML, a classe estará disponível globalmente
window.GoogleSheetsService = GoogleSheetsService;

