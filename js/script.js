// Lógica de navegação entre páginas
const homePage = document.getElementById("home-page");
const formPage = document.getElementById("form-page");
const startSurveyBtn = document.getElementById("start-survey-btn");
const backToHomeBtn = document.getElementById("back-to-home-btn");
const surveyForm = document.getElementById("survey-form");

// Elementos de autenticação Google
const loginSection = document.getElementById("login-section");
const authenticatedSection = document.getElementById("authenticated-section");
const logoutBtn = document.getElementById("logout-btn");
const userPicture = document.getElementById("user-picture");
const userName = document.getElementById("user-name");
const userEmail = document.getElementById("user-email");

// Variável global para armazenar dados do usuário autenticado
let currentUser = null;

// Elementos condicionais do formulário
const generoOutroRadio = document.getElementById("genero-outro");
const generoOutroText = document.getElementById("genero-outro-text");
const generoNaoResponderRadio = document.getElementById("genero-nao-responder");

const escolaSelect = document.getElementById("escola");
const escolaOutraText = document.getElementById("escola-outra-text");
const cidadeSelect = document.getElementById("cidade");
const cidadeOutraText = document.getElementById("cidade-outra-text");

const interesseEnsinoSuperiorRadios = document.querySelectorAll("input[name=\"interesseEnsinoSuperior\"]");
const perguntasSimDiv = document.getElementById("perguntas-sim");
const perguntasNaoDiv = document.getElementById("perguntas-nao");
const orientacaoProfissionalSection = document.getElementById("orientacao-profissional-section");

// Campos para 'Interesse em Ensino Superior - Sim'
const cursoInteresseCheckboxes = document.querySelectorAll("input[name=\"cursoInteresse\"]");
const cursoInteresseOutroCheck = document.getElementById("curso-outro-check");
const cursoInteresseOutroText = document.getElementById("curso-interesse-outro-text");

const fatorMotivacaoCheckboxes = document.querySelectorAll("input[name=\"fatorMotivacao\"]");
const fatorMotivacaoOutroCheck = document.getElementById("fator-outro-check");
const fatorMotivacaoOutroText = document.getElementById("fator-motivacao-outro-text");

// Campos para 'Interesse em Ensino Superior - Não'
const motivoNaoInteresseCheckboxes = document.querySelectorAll("input[name=\"motivoNaoInteresse\"]");
const motivoNaoInteresseOutroCheck = document.getElementById("motivo-nao-outro-check");
const motivoNaoInteresseOutroText = document.getElementById("motivo-nao-outro-text");

// Campos para 'Orientação Profissional e Apoio'
const acoesInteresseSuperiorCheckboxes = document.querySelectorAll("input[name=\"acoesInteresseSuperior\"]");
const acoesInteresseSuperiorOutroCheck = document.getElementById("acao-outra-check");
const acoesInteresseSuperiorOutroText = document.getElementById("acoes-interesse-superior-outro-text");

// Instância do serviço Google Sheets
const googleSheetsService = new GoogleSheetsService();
googleSheetsService.setScriptUrl('https://script.google.com/macros/s/AKfycbyEKs_RPyCnyjLT0hqL47RLrjgAgGtBMuiRvUbqipRCjh1ak8s_1BnONiL5qrHdvytK/exec');
// Configurar a URL do Google Apps Script aqui
// IMPORTANTE: Substitua pela URL real após configurar o Google Apps Script
// googleSheetsService.setScriptUrl('https://script.google.com/macros/s/SEU_SCRIPT_ID/exec');

// Funções de autenticação Google
function handleCredentialResponse(response) {
    // Decodifica o JWT token do Google
    const responsePayload = decodeJwtResponse(response.credential);
    
    // Armazena os dados do usuário
    currentUser = {
        id: responsePayload.sub,
        name: responsePayload.name,
        email: responsePayload.email,
        picture: responsePayload.picture
    };
    
    // Atualiza a interface
    showAuthenticatedUser();
}

function decodeJwtResponse(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

function showAuthenticatedUser() {
    if (currentUser) {
        loginSection.classList.add("hidden");
        authenticatedSection.classList.remove("hidden");
        authenticatedSection.classList.add("show");
        
        userPicture.classList.remove("hidden");  
        userPicture.src = currentUser.picture;
        userName.textContent = currentUser.name;
        userEmail.textContent = currentUser.email;

    }
}

function logout() {
    currentUser = null;
    loginSection.classList.remove("hidden");
    authenticatedSection.classList.add("hidden");
    
    // Volta para a página inicial se estiver no formulário
    if (formPage.classList.contains("active")) {
        showPage(homePage);
    }
}

// Função para mostrar uma página e esconder as outras
function showPage(pageToShow) {
    homePage.classList.remove("active");
    formPage.classList.remove("active");
    pageToShow.classList.add("active");
}

// Event Listeners para navegação
startSurveyBtn.addEventListener("click", () => {
    // Verifica se o usuário está autenticado
    if (!currentUser) {
        alert("Por favor, faça login com sua conta Google primeiro.");
        return;
    }
    showPage(formPage);
});

backToHomeBtn.addEventListener("click", () => {
    showPage(homePage);
});

// Event listener para logout
logoutBtn.addEventListener("click", logout);

// Lógica para campos condicionais
document.querySelectorAll("input[name=\"genero\"]").forEach(radio => {
    radio.addEventListener("change", () => {
        if (generoOutroRadio.checked) {
            generoOutroText.classList.remove("hidden");
            generoOutroText.setAttribute("required", "");
        } else {
            generoOutroText.classList.add("hidden");
            generoOutroText.removeAttribute("required");
        }
    });
});

escolaSelect.addEventListener("change", () => {
    if (escolaSelect.value === "Outra Escola") {
        escolaOutraText.classList.remove("hidden");
        escolaOutraText.setAttribute("required", "");
    } else {
        escolaOutraText.classList.add("hidden");
        escolaOutraText.removeAttribute("required");
    }
});

cursoInteresseCheckboxes.forEach(checkbox => {
    checkbox.addEventListener("change", () => {
        if (cursoInteresseOutroCheck.checked) {
            cursoInteresseOutroText.classList.remove("hidden");
            cursoInteresseOutroText.setAttribute("required", "");
        } else {
            cursoInteresseOutroText.classList.add("hidden");
            cursoInteresseOutroText.removeAttribute("required");
        }
    });
});

fatorMotivacaoCheckboxes.forEach(checkbox => {
    checkbox.addEventListener("change", () => {
        if (fatorMotivacaoOutroCheck.checked) {
            fatorMotivacaoOutroText.classList.remove("hidden");
            fatorMotivacaoOutroText.setAttribute("required", "");
        } else {
            fatorMotivacaoOutroText.classList.add("hidden");
            fatorMotivacaoOutroText.removeAttribute("required");
        }
    });
});

cidadeSelect.addEventListener("change", () => {
    if (cidadeSelect.value === "Outra Cidade") {
        cidadeOutraText.classList.remove("hidden");
        cidadeOutraText.setAttribute("required", "");
    } else {
        cidadeOutraText.classList.add("hidden");
        cidadeOutraText.removeAttribute("required");
    }
});

motivoNaoInteresseCheckboxes.forEach(checkbox => {
    checkbox.addEventListener("change", () => {
        if (motivoNaoInteresseOutroCheck.checked) {
            motivoNaoInteresseOutroText.classList.remove("hidden");
            motivoNaoInteresseOutroText.setAttribute("required", "");
        } else {
            motivoNaoInteresseOutroText.classList.add("hidden");
            motivoNaoInteresseOutroText.removeAttribute("required");
        }
    });
});

acoesInteresseSuperiorCheckboxes.forEach(checkbox => {
    checkbox.addEventListener("change", () => {
        if (acoesInteresseSuperiorOutroCheck.checked) {
            acoesInteresseSuperiorOutroText.classList.remove("hidden");
            acoesInteresseSuperiorOutroText.setAttribute("required", "");
        } else {
            acoesInteresseSuperiorOutroText.classList.add("hidden");
            acoesInteresseSuperiorOutroText.removeAttribute("required");
        }
    });
});

interesseEnsinoSuperiorRadios.forEach(radio => {
    radio.addEventListener("change", () => {
        perguntasSimDiv.classList.add("hidden");
        perguntasNaoDiv.classList.add("hidden");
        orientacaoProfissionalSection.classList.add("hidden");

        // Remove required de todos os campos condicionais primeiro
        // Para checkboxes, o required é aplicado ao grupo, não individualmente
        perguntasSimDiv.querySelectorAll("input[type='text']").forEach(el => el.removeAttribute("required"));
        perguntasNaoDiv.querySelectorAll("input[type='text'], textarea").forEach(el => el.removeAttribute("required"));
        orientacaoProfissionalSection.querySelectorAll("input[type='radio']").forEach(el => el.removeAttribute("required"));

        if (radio.value === "Sim") {
            perguntasSimDiv.classList.remove("hidden");
            // Apenas o campo 'Outro' de curso e fator de motivação precisa de required se selecionado
        } else if (radio.value === "Não") {
            perguntasNaoDiv.classList.remove("hidden");
            // Apenas o campo 'Outro' de motivo precisa de required se selecionado
        } else if (radio.value === "Ainda estou em dúvida") {
            orientacaoProfissionalSection.classList.remove("hidden");
            // Adiciona required aos campos da seção de orientação profissional
            orientacaoProfissionalSection.querySelector("input[name='orientacaoProfissional']").setAttribute("required", "");
        }
    });
});

// Função para coletar dados do formulário
function collectFormData() {
    const formData = new FormData(surveyForm);
    const data = {};

    // Coleta todos os valores, agrupando checkboxes
    for (let [key, value] of formData.entries()) {
        if (data[key]) {
            if (!Array.isArray(data[key])) {
                data[key] = [data[key]];
            }
            data[key].push(value);
        } else {
            data[key] = value;
        }
    }

    // Converte arrays de checkboxes em strings separadas por vírgula
    ['cursoInteresse', 'fatorMotivacao', 'motivoNaoInteresse', 'acoesInteresseSuperior'].forEach(key => {
        if (Array.isArray(data[key])) {
            data[key] = data[key].join(', ');
        }
    });

    // Adiciona o e-mail do usuário autenticado
    if (currentUser) {
        data.email = currentUser.email;
    }

    // Lógica para limpar campos condicionais não preenchidos
    if (data.genero !== "Outro") {
        delete data.generoOutro;
    }
    if (data.escola !== "Outra Escola") {
        delete data.escolaOutra;
    }
    if (data.cidade !== "Outra Cidade") {
        delete data.cidadeOutra;
    }

    if (data.interesseEnsinoSuperior === "Sim") {
        delete data.motivoNaoInteresse;
        delete data.motivoNaoInteresseOutro;
        delete data.interesseTecnico;
    } else if (data.interesseEnsinoSuperior === "Não") {
        delete data.cursoInteresse;
        delete data.cursoInteresseOutro;
        delete data.fatorMotivacao;
        delete data.fatorMotivacaoOutro;
    } else { // Em dúvida
        delete data.motivoNaoInteresse;
        delete data.motivoNaoInteresseOutro;
        delete data.interesseTecnico;
        delete data.cursoInteresse;
        delete data.cursoInteresseOutro;
        delete data.fatorMotivacao;
        delete data.fatorMotivacaoOutro;
    }

    // Limpa campos "Outro" se a opção não estiver selecionada
    if (!data.cursoInteresse || !data.cursoInteresse.includes('Outro')) {
        delete data.cursoInteresseOutro;
    }
    if (!data.fatorMotivacao || !data.fatorMotivacao.includes('Outro')) {
        delete data.fatorMotivacaoOutro;
    }
    if (!data.motivoNaoInteresse || !data.motivoNaoInteresse.includes('Outro')) {
        delete data.motivoNaoInteresseOutro;
    }
    if (!data.acoesInteresseSuperior || !data.acoesInteresseSuperior.includes('Outro')) {
        delete data.acoesInteresseSuperiorOutro;
    }

    return data;
}

// Função para mostrar loading
function showLoading(show = true) {
    const submitBtn = surveyForm.querySelector('button[type="submit"]');
    if (show) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';
    } else {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar Formulário';
    }
}

// Função para mostrar mensagens ao usuário
function showMessage(message, isError = false) {
    // Remove mensagem anterior se existir
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Cria nova mensagem
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${isError ? 'error' : 'success'}`;
    messageDiv.textContent = message;
    
    // Adiciona estilos inline para a mensagem
    messageDiv.style.cssText = `
        padding: 15px;
        margin: 20px 0;
        border-radius: 5px;
        text-align: center;
        font-weight: bold;
        ${isError ? 
            'background-color: #fee; color: #c33; border: 1px solid #fcc;' : 
            'background-color: #efe; color: #363; border: 1px solid #cfc;'
        }
    `;

    // Insere a mensagem antes do botão de envio
    const submitBtn = surveyForm.querySelector('button[type="submit"]');
    submitBtn.parentNode.insertBefore(messageDiv, submitBtn);

    // Remove a mensagem após 5 segundos
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

// Lógica de envio do formulário
surveyForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // Previne o envio padrão do formulário

    try {
        // Verifica se o usuário está autenticado
        if (!currentUser) {
            throw new Error("Usuário não autenticado. Por favor, faça login novamente.");
        }

                // Validação obrigatória das perguntas condicionais
        const interesse = document.querySelector("input[name='interesseEnsinoSuperior']:checked");

        if (interesse) {
            if (interesse.value === "Sim") {
                const checkedCursos = document.querySelectorAll("input[name='cursoInteresse']:checked");
                if (checkedCursos.length === 0) {
                    showMessage("Por favor, selecione pelo menos um curso de interesse.", true);
                    return; // bloqueia envio
                }
            } else if (interesse.value === "Não") {
                const checkedMotivos = document.querySelectorAll("input[name='motivoNaoInteresse']:checked");
                if (checkedMotivos.length === 0) {
                    showMessage("Por favor, selecione pelo menos um motivo para não cursar.", true);
                    return;
                }
            } else if (interesse.value === "Ainda estou em dúvida") {
                const checkedOrientacao = document.querySelectorAll("input[name='orientacaoProfissional']:checked");
                if (checkedOrientacao.length === 0) {
                    showMessage("Por favor, selecione pelo menos uma opção de orientação profissional.", true);
                    return;
                }
            }
        }

        
        showLoading(true);
        
        // Coleta os dados do formulário
        const data = collectFormData();

        // Verifica se a URL do Google Apps Script foi configurada
        if (!googleSheetsService.scriptUrl) {
            // Se não foi configurada, simula o envio
            console.log("Dados do formulário para envio:", data);
            showMessage("Formulário validado com sucesso! (Configurar Google Sheets para envio real)");
            
            // Limpa o formulário e volta para a página inicial após 2 segundos
            setTimeout(() => {
                surveyForm.reset();
                showPage(homePage);
            }, 2000);
            
            return;
        }

        // Envia os dados para o Google Sheets
        const result = await googleSheetsService.submitForm(data);
        
        if (result.success) {
            showMessage(result.message);
            
            // Limpa o formulário e volta para a página inicial após 2 segundos
            setTimeout(() => {
                surveyForm.reset();
                showPage(homePage);
            }, 2000);
        } else {
            throw new Error(result.message);
        }

    } catch (error) {
        console.error('Erro ao enviar formulário:', error);
        showMessage(error.message, true);
    } finally {
        showLoading(false);
    }
});

// Inicializa a página inicial ao carregar
document.addEventListener("DOMContentLoaded", () => {
    showPage(homePage);
});

