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
const escolaSelect = document.getElementById("escola");
const escolaOutraText = document.getElementById("escola-outra-text");
const cidadeSelect = document.getElementById("cidade");
const cidadeOutraText = document.getElementById("cidade-outra-text");
const interesseEnsinoSuperiorRadios = document.querySelectorAll("input[name=\"interesseEnsinoSuperior\"]");
const perguntasSimDiv = document.getElementById("perguntas-sim");
const perguntasNaoDiv = document.getElementById("perguntas-nao");

// Instância do serviço Google Sheets
const googleSheetsService = new GoogleSheetsService();

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
generoOutroRadio.addEventListener("change", () => {
    if (generoOutroRadio.checked) {
        generoOutroText.classList.remove("hidden");
        generoOutroText.setAttribute("required", "");
    } else {
        generoOutroText.classList.add("hidden");
        generoOutroText.removeAttribute("required");
    }
});

// Adicionar event listeners para todos os radios de gênero
document.querySelectorAll("input[name=\"genero\"]").forEach(radio => {
    radio.addEventListener("change", () => {
        if (radio.value !== "Outro") {
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

cidadeSelect.addEventListener("change", () => {
    if (cidadeSelect.value === "Outra Cidade") {
        cidadeOutraText.classList.remove("hidden");
        cidadeOutraText.setAttribute("required", "");
    } else {
        cidadeOutraText.classList.add("hidden");
        cidadeOutraText.removeAttribute("required");
    }
});

interesseEnsinoSuperiorRadios.forEach(radio => {
    radio.addEventListener("change", () => {
        perguntasSimDiv.classList.add("hidden");
        perguntasNaoDiv.classList.add("hidden");

        // Remove required de todos os campos condicionais primeiro
        perguntasSimDiv.querySelectorAll("input, textarea").forEach(el => el.removeAttribute("required"));
        perguntasNaoDiv.querySelectorAll("input, textarea").forEach(el => el.removeAttribute("required"));

        if (radio.value === "Sim") {
            perguntasSimDiv.classList.remove("hidden");
            perguntasSimDiv.querySelectorAll("input, textarea").forEach(el => el.setAttribute("required", ""));
        } else if (radio.value === "Não") {
            perguntasNaoDiv.classList.remove("hidden");
            perguntasNaoDiv.querySelectorAll("input, textarea").forEach(el => el.setAttribute("required", ""));
        }
    });
});

// Função para coletar dados do formulário
function collectFormData() {
    const formData = new FormData(surveyForm);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }

    // Adiciona o e-mail do usuário autenticado
    if (currentUser) {
        data.email = currentUser.email;
    }

    // Lógica para campos condicionais que podem não ter sido preenchidos
    if (data.genero !== "Outro") {
        delete data.generoOutro;
    }
    if (data.escola !== "Outra Escola") {
        delete data.escolaOutra;
    }
    if (data.cidade !== "Outra Cidade") {
        delete data.cidadeOutra;
    }
    if (data.interesseEnsinoSuperior !== "Sim") {
        delete data.cursoInteresse;
        delete data.instituicaoPreferencia;
    }
    if (data.interesseEnsinoSuperior !== "Não") {
        delete data.motivoNao;
        delete data.planosFuturos;
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

