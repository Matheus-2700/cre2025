/**
 * Serviço para integração com Google Sheets
 * Baseado no exemplo: https://github.com/levinunnink/html-form-to-google-sheet
 */
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
            throw new Error('URL do Google Apps Script não configurada. Use setScriptUrl() primeiro.');
        }

        try {
            // Adiciona o token secreto
            formData.secret = this.secret;

            // Validação dos dados obrigatórios
            this.validateFormData(formData);

            // Prepara os dados
            const dataToSend = this.prepareDataForSubmission(formData);

            // Transforma em formato compatível com Apps Script
            const formBody = new URLSearchParams();
            Object.keys(dataToSend).forEach(key => {
                formBody.append(key, dataToSend[key]);
            });

            // Envia a requisição
            const response = await fetch(this.scriptUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                },
                body: formBody.toString()
            });

            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }

            const result = await response.json().catch(() => null);

            if (result && result.result === 'success') {
                alert('Dados enviados com sucesso!');
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

            const mensagemErro =
                error?.message ||
                (typeof error === 'object' && error !== null
                    ? JSON.stringify(error, null, 2)
                    : String(error));

            alert('Erro ao enviar dados:\n' + mensagemErro);

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
