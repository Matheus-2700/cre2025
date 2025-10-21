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
 * @version 2.1 (Revisado e Corrigido - envio robusto)
 */
class GoogleSheetsService {
    constructor() {
        this.scriptUrl = '';
        this.isConfigured = false;
        // Por padrão não exigimos campos obrigatórios (evita erros por campos condicionais).
        // Use setRequiredFields([...]) se quiser validação.
        this.requiredFields = [];
        console.log('✅ GoogleSheetsService iniciado.');
    }

    /**
     * Configura a URL do Google Apps Script.
     * @param {string} url - A URL completa do aplicativo web publicado.
     */
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

    /**
     * Define os campos obrigatórios (opcional).
     * @param {Array<string>} fields - nomes dos campos conforme você usa no client (ex: 'nome', 'email')
     */
    setRequiredFields(fields = []) {
        if (!Array.isArray(fields)) throw new Error('setRequiredFields espera um array.');
        this.requiredFields = fields;
        console.log('🔒 Campos obrigatórios definidos:', this.requiredFields);
    }

    /**
     * Valida os dados do formulário antes do envio.
     * Se nenhum requiredFields for definido, a validação é ignorada (comportamento seguro).
     * @param {object} formData - Objeto com os dados do formulário.
     * @returns {boolean} - Retorna true se os dados são válidos.
     * @throws {Error} - Lança um erro se a validação falhar (quando requiredFields configurado).
     */
    validateFormData(formData) {
        // Se não definiu requiredFields, não validar (evita erros em campos condicionais)
        if (!this.requiredFields || this.requiredFields.length === 0) {
            console.log('ℹ️ Validação de campos obrigatórios ignorada (requiredFields não definido).');
            return true;
        }

        for (const field of this.requiredFields) {
            // aceita zero/false/0 como valor válido — só considera inválido quando vazio string '' ou undefined/null
            const val = formData[field];
            if (val === undefined || val === null || (typeof val === 'string' && val.trim() === '') || (Array.isArray(val) && val.length === 0)) {
                throw new Error(`O campo "${field}" é obrigatório.`);
            }
        }

        // Validação simples de e-mail
        if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
            throw new Error('O formato do e-mail é inválido.');
        }

        console.log('✅ Dados do formulário validados com sucesso.');
        return true;
    }

    /**
     * Prepara os dados para serem enviados, garantindo que os nomes das chaves
     * correspondam EXATAMENTE aos cabeçalhos da planilha.
     * Mantenha/edite esse mapeamento conforme a primeira linha (cabeçalho) da aba "Dados".
     *
     * @param {object} formData - Objeto bruto dos dados do formulário (ex: { nome: 'Matheus', idade: '18', ... })
     * @returns {object} - Objeto formatado e pronto para envio, com chaves iguais aos cabeçalhos da planilha.
     */
    prepareDataForSubmission(formData) {
        console.log('📋 Dados brutos recebidos para preparação:', formData || {});

        // Mapeamento: chave do objeto formData -> título na planilha (ajuste conforme seu cabeçalho)
        // Se sua planilha tem títulos diferentes, altere os valores do map abaixo.
        const map = {
            nome: 'Nome',
            email: 'Email',
            telefone: 'Telefone',
            idade: 'Idade',
            genero: 'Genero',
            generoOutro: 'GeneroOutro',
            escola: 'Escola',
            escolaOutra: 'EscolaOutra',
            cidade: 'Cidade',
            cidadeOutra: 'CidadeOutra',
            anoEscolar: 'AnoEscolar',
            turno: 'Turno',
            interesseEnsinoSuperior: 'InteresseEnsinoSuperior',
            cursoInteresse: 'CursoInteresse',
            fatorMotivacao: 'FatorMotivacao',
            motivoNaoInteresse: 'MotivoNaoInteresse',
            acoesInteresseSuperior: 'AcoesInteresseSuperior',
            cursoInteresseOutro: 'CursoInteresseOutro',
            fatorMotivacaoOutro: 'FatorMotivacaoOutro',
            motivoNaoInteresseOutro: 'MotivoNaoInteresseOutro',
            acoesInteresseSuperiorOutro: 'AcoesInteresseSuperiorOutro',
            interesseTecnico: 'InteresseTecnico',
            orientacaoProfissional: 'OrientacaoProfissional',
            participouOrientacao: 'ParticipouOrientacao',
            sugestoesGerais: 'SugestoesGerais'
        };

        const prepared = {};
        // Para cada chave do map, popula prepared com valor do formData (ou '' caso não exista)
        Object.keys(map).forEach(inputKey => {
            const sheetKey = map[inputKey];
            const val = formData[inputKey];

            // Se for array (checkboxes), convertemos em duas opções: enviar array de valores (para FormData múltiplo)
            // e também manter uma versão string caso prefira ver tudo em uma célula (não usado aqui).
            if (Array.isArray(val)) {
                // mantemos array para que o builder de FormData saiba tratar
                prepared[sheetKey] = val.slice(); // cópia do array
            } else {
                prepared[sheetKey] = (val !== undefined && val !== null) ? String(val) : '';
            }
        });

        console.log('📤 Dados formatados prontos para envio:', prepared);
        return prepared;
    }

    /**
     * Constrói um FormData a partir do objeto preparado.
     * Se o valor for array, adiciona múltiplas entradas com o mesmo nome (compatível com e.parameters no Apps Script).
     *
     * @param {object} preparedData - objeto resultante de prepareDataForSubmission()
     * @returns {FormData}
     */
    buildFormData(preparedData) {
        const fd = new FormData();
        Object.keys(preparedData).forEach(key => {
            const val = preparedData[key];
            if (Array.isArray(val)) {
                // adiciona múltiplas entradas com mesmo nome
                val.forEach(v => fd.append(key, v === undefined || v === null ? '' : String(v)));
            } else {
                fd.append(key, val === undefined || val === null ? '' : String(val));
            }
        });
        return fd;
    }

    /**
     * Envia os dados do formulário para o Google Apps Script.
     * @param {object} formData - Os dados brutos do formulário (ex: { nome: 'Matheus', idade: '18' })
     * @returns {Promise<object>} - Uma promessa que resolve com a resposta do servidor.
     */
    async submitForm(formData) {
        if (!this.isConfigured) {
            return Promise.reject({ status: 'error', message: 'URL do Google Sheets não configurada.' });
        }

        try {
            // 1. Validação (opcional)
            this.validateFormData(formData || {});

            // 2. Preparar os dados (mapeamento para os cabeçalhos)
            const preparedData = this.prepareDataForSubmission(formData || {});

            // 3. Construir FormData manualmente (garante envio mesmo para campos disable no DOM
            // se você construir o objeto manualmente antes)
            const body = this.buildFormData(preparedData);

            // 4. Enviar a requisição
            console.log('📤 Enviando dados para o Google Apps Script...', { url: this.scriptUrl, bodyPreview: preparedData });
            const response = await fetch(this.scriptUrl, {
                method: 'POST',
                body: body,
            });

            // 5. Tratar resposta com robustez
            const text = await response.text();
            let result;
            try {
                result = JSON.parse(text);
            } catch (err) {
                // Resposta não é JSON — mantém texto bruto
                console.warn('⚠️ Resposta do server não é JSON:', text);
                result = { status: response.ok ? 'ok' : 'error', raw: text, httpStatus: response.status };
            }

            if (!response.ok) {
                console.error('❌ Erro HTTP ao enviar dados:', response.status, response.statusText, result);
                return Promise.reject({ status: 'error', message: result.message || 'Erro HTTP: ' + response.status, raw: result });
            }

            // Se o Apps Script retornou {status:'error'}, propaga para o caller
            if (result && result.status && result.status.toLowerCase() === 'error') {
                console.error('❌ Apps Script retornou erro:', result);
                return Promise.reject({ status: 'error', message: result.message || 'Erro retornado pelo Apps Script', raw: result });
            }

            console.log('✅ Resposta do servidor recebida:', result);
            return result;
        } catch (error) {
            console.error('❌ Erro durante o envio do formulário:', error && error.message ? error.message : error);
            return Promise.reject({ status: 'error', message: (error && error.message) ? error.message : String(error) });
        }
    }

    /**
     * Função utilitária para testar conectividade com o script (faz um POST vazio/pequeno).
     * Útil para verificar se a URL está acessível.
     */
    async testConnection() {
        if (!this.isConfigured) {
            return { status: 'error', message: 'URL não configurada' };
        }
        try {
            const res = await fetch(this.scriptUrl, { method: 'POST', body: new FormData() });
            const text = await res.text();
            try { return JSON.parse(text); } catch (e) { return { status: res.ok ? 'ok' : 'error', raw: text }; }
        } catch (err) {
            return { status: 'error', message: String(err) };
        }
    }
}
