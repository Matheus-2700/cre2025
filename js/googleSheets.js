/**
 * Serviço para integração com Google Sheets
 * Baseado no exemplo: https://github.com/levinunnink/html-form-to-google-sheet
 */
class GoogleSheetsService {
    constructor() {
        this.scriptUrl = 'https://script.google.com/macros/s/AKfycbxqlaBH-vWlLDjB-R1KenF5kXQ2yflEDrrzQQQIkyfBu76I4xbMwAP5p9gEGt46txP9cA/exec';
    }

    setScriptUrl(url) {
        this.scriptUrl = url;
    }

    async submitForm(formData) {
    if (!this.scriptUrl) {
        throw new Error('URL do Google Apps Script não configurada. Use setScriptUrl() primeiro.');
    }

    try {
        // Adiciona o token secreto (já existente)
        formData.secret = this.secret;

        // Validação dos dados obrigatórios
        this.validateFormData(formData);

        // Prepara os dados (suas chaves Nome/Email/... já aqui)
        const dataToSend = this.prepareDataForSubmission(formData);

        // --- NOVA PARTE: enviar JSON (application/json)
        const response = await fetch(this.scriptUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend)
        });

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        // Apps Script pode responder JSON ou texto — tentamos parsear
        const result = await response.json().catch(async () => {
            const txt = await response.text();
            try { return JSON.parse(txt); } catch { return { raw: txt }; }
        });

        // Ajuste conforme o formato de resposta do seu Apps Script
        // Aqui assumimos o padrão que você usou no doPost: { status:'ok', message:'Salvo' }
        if (result && (result.status === 'ok' || result.result === 'success')) {
            return {
                success: true,
                message: result.message || 'Dados enviados com sucesso!',
                row: result.row || null
            };
        } else {
            throw new Error(result?.message || result?.error || JSON.stringify(result));
        }

    } catch (error) {
        const mensagemErro =
            error?.message ||
            (typeof error === 'object' && error !== null
                ? JSON.stringify(error, null, 2)
                : String(error));

        return {
            success: false,
            message: mensagemErro
        };
    }
}

    validateFormData(formData) {
        const requiredFields = [
            'nome', 'idade', 'genero', 'escola', 
            'cidade', 'anoEscolar', 'turno', 'interesseEnsinoSuperior'
        ];

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

            return await this.submitForm(testData);
        } catch (error) {
            const mensagemErro = error?.message || String(error);
            console.error('Erro no teste de conexão:', mensagemErro);
            return {
                success: false,
                message: `Erro no teste de conexão: ${mensagemErro}`
            };
        }
    }
}

window.GoogleSheetsService = GoogleSheetsService;
