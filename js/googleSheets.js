/**
 * @class GoogleSheetsService
 * @description Classe para gerenciar a integração e o envio de dados de um formulário HTML
 * para uma planilha do Google Sheets através de um Google Apps Script.
 *
 * Funcionalidades:
 * - Configuração da URL do script.
 * - Validação de dados do formulário no lado do cliente.
 * - Preparação e formatação dos dados para envio.
 * - Tratamento de campos de múltipla escolha (checkboxes).
 * - Envio assíncrono dos dados usando a API Fetch.
 * - Teste de conexão com o script.
 *
 * @version 2.0 (Revisado e Corrigido)
 */
class GoogleSheetsService {
    constructor() {
        this.scriptUrl = '';
        this.isConfigured = false;
        console.log('✅ GoogleSheetsService iniciado.');
    }

    /**
     * Configura a URL do Google Apps Script.
     * @param {string} url - A URL completa do aplicativo web publicado.
     */
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

    /**
     * Valida os dados do formulário antes do envio.
     * @param {object} formData - Objeto com os dados do formulário.
     * @returns {boolean} - Retorna true se os dados são válidos.
     * @throws {Error} - Lança um erro se a validação falhar.
     */
    validateFormData(formData) {
        // Adicione aqui os campos que são obrigatórios no seu formulário
        const requiredFields = [
            'nome', 'idade', 'genero', 'cidade', 'escola', 
            'anoEscolar', 'turno', 'interesseEnsinoSuperior'
        ];

        for (const field of requiredFields) {
            if (!formData[field]) {
                // Lança um erro com uma mensagem amigável para o usuário
                throw new Error(`O campo "${field}" é obrigatório.`);
            }
        }

        // Validação de formato de e-mail (se houver um campo de e-mail)
        if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
            throw new Error('O formato do e-mail é inválido.');
        }

        console.log('✅ Dados do formulário validados com sucesso.');
        return true;
    }

    /**
     * Prepara os dados para serem enviados, garantindo que os nomes das chaves
     * correspondam EXATAMENTE aos cabeçalhos da planilha.
     * @param {object} formData - Objeto bruto dos dados do formulário.
     * @returns {object} - Objeto formatado e pronto para envio.
     */
    prepareDataForSubmission(formData) {
        console.log('📋 Dados brutos recebidos para preparação:', formData);

        const preparedData = {
            // Garanta que cada chave aqui seja IDÊNTICA ao cabeçalho na sua planilha
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
            
            // Tratamento especial para campos de múltipla escolha (checkbox)
            'CursoInteresse': Array.isArray(formData.cursoInteresse) ? formData.cursoInteresse.join(', ') : (formData.cursoInteresse || ''),
            'FatorMotivacao': Array.isArray(formData.fatorMotivacao) ? formData.fatorMotivacao.join(', ') : (formData.fatorMotivacao || ''),
            'MotivoNaoInteresse': Array.isArray(formData.motivoNaoInteresse) ? formData.motivoNaoInteresse.join(', ') : (formData.motivoNaoInteresse || ''),
            'AcoesInteresseSuperior': Array.isArray(formData.acoesInteresseSuperior) ? formData.acoesInteresseSuperior.join(', ') : (formData.acoesInteresseSuperior || ''),

            'CursoInteresseOutro': formData.cursoInteresseOutro || '',
            'FatorMotivacaoOutro': formData.fatorMotivacaoOutro || '',
            'MotivoNaoInteresseOutro': formData.motivoNaoInteresseOutro || '',
            'AcoesInteresseSuperiorOutro': formData.acoesInteresseSuperiorOutro || '',
            
            'InteresseTecnico': formData.interesseTecnico || '',
            'OrientacaoProfissional': formData.orientacaoProfissional || '',
            'ParticipouOrientacao': formData.participouOrientacao || '',
            'SugestoesGerais': formData.sugestoesGerais || ''
        };

        console.log('📤 Dados formatados prontos para envio:', preparedData);
        return preparedData;
    }

    /**
     * Envia os dados do formulário para o Google Apps Script.
     * @param {object} formData - Os dados brutos do formulário.
     * @returns {Promise<object>} - Uma promessa que resolve com a resposta do servidor.
     */
    async submitForm(formData) {
        if (!this.isConfigured) {
            return Promise.reject({ status: 'error', message: 'URL do Google Sheets não configurada.' });
        }

        try {
            // 1. Validar os dados
            this.validateFormData(formData);

            // 2. Preparar os dados para o formato correto
            const preparedData = this.prepareDataForSubmission(formData);
            
            // 3. Criar o corpo da requisição
            const body = new FormData();
            for (const key in preparedData) {
                body.append(key, preparedData[key]);
            }

            // 4. Enviar a requisição
            console.log('📤 Enviando dados para o Google Apps Script...');
            const response = await fetch(this.scriptUrl, {
                method: 'POST',
                body: body,
            });

            // 5. Processar a resposta
            if (!response.ok) {
                throw new Error(`Erro na rede: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('✅ Resposta do servidor recebida:', result);

            if (result.status === 'error') {
                throw new Error(`Erro retornado pelo Google Apps Script: ${result.message}`);
            }

            return result;

        } catch (error) {
            console.error('❌ Erro durante o envio do formulário:', error.message);
            // Rejeita a promessa para que o erro possa ser tratado no 'script.js'
            return Promise.reject({ status: 'error', message: error.message });
        }
    }
}
