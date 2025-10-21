// ==========================================
// SCRIPT.JS - VERSÃO CORRIGIDA
// CRE Canoinhas - Formulário de Pesquisa
// ==========================================

// ==================== Elementos de navegação ====================
const homePage = document.getElementById("home-page");
const formPage = document.getElementById("form-page");
const startSurveyBtn = document.getElementById("start-survey-btn");
const backToHomeBtn = document.getElementById("back-to-home-btn");
const surveyForm = document.getElementById("survey-form");

// ==================== Elementos de autenticação ====================
const loginSection = document.getElementById("login-section");
const authenticatedSection = document.getElementById("authenticated-section");
const logoutBtn = document.getElementById("logout-btn");
const userPicture = document.getElementById("user-picture");
const userName = document.getElementById("user-name");
const userEmail = document.getElementById("user-email");

// ==================== Variável global ====================
let currentUser = null;

// ==================== Campos condicionais ====================
const generoOutroRadio = document.getElementById("genero-outro");
const generoOutroText = document.getElementById("genero-outro-text");

const escolaSelect = document.getElementById("escola");
const escolaOutraText = document.getElementById("escola-outra-text");
const cidadeSelect = document.getElementById("cidade");
const cidadeOutraText = document.getElementById("cidade-outra-text");

const interesseEnsinoSuperiorRadios = document.querySelectorAll("input[name='interesseEnsinoSuperior']");
const perguntasSimDiv = document.getElementById("perguntas-sim");
const perguntasNaoDiv = document.getElementById("perguntas-nao");
const orientacaoProfissionalSection = document.getElementById("orientacao-profissional-section");

// Campos "Outro" e checkboxes
const cursoInteresseCheckboxes = document.querySelectorAll("input[name='cursoInteresse']");
const cursoInteresseOutroCheck = document.getElementById("curso-outro-check");
const cursoInteresseOutroText = document.getElementById("curso-interesse-outro-text");

const fatorMotivacaoCheckboxes = document.querySelectorAll("input[name='fatorMotivacao']");
const fatorMotivacaoOutroCheck = document.getElementById("fator-outro-check");
const fatorMotivacaoOutroText = document.getElementById("fator-motivacao-outro-text");

const motivoNaoInteresseCheckboxes = document.querySelectorAll("input[name='motivoNaoInteresse']");
const motivoNaoInteresseOutroCheck = document.getElementById("motivo-nao-outro-check");
const motivoNaoInteresseOutroText = document.getElementById("motivo-nao-outro-text");

const acoesInteresseSuperiorCheckboxes = document.querySelectorAll("input[name='acoesInteresseSuperior']");
const acoesInteresseSuperiorOutroCheck = document.getElementById("acao-outra-check");
const acoesInteresseSuperiorOutroText = document.getElementById("acoes-interesse-superior-outro-text");

// ==================== Serviço Google Sheets ====================
// IMPORTANTE: Substitua pela URL do seu Google Apps Script
googleSheetsService.setScriptUrl('https://script.google.com/macros/s/AKfycbyhT08GqHbNiWclmPSx7KHzWsiU0KS62If5TT6rhCXEoPCzcPqPfSO-jsT0LozT4NTw0Q/exec');

// ==================== Funções de autenticação Google ====================
function handleCredentialResponse(response) {
    const responsePayload = decodeJwtResponse(response.credential);
    currentUser = {
        id: responsePayload.sub,
        name: responsePayload.name,
        email: responsePayload.email,
        picture: responsePayload.picture
    };
    showAuthenticatedUser();
}

function decodeJwtResponse(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
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
    if (formPage.classList.contains("active")) {
        showPage(homePage);
    }
}

function showPage(pageToShow) {
    homePage.classList.remove("active");
    formPage.classList.remove("active");
    pageToShow.classList.add("active");
}

// ==================== Navegação ====================
startSurveyBtn.addEventListener("click", () => {
    if (!currentUser) {
        alert("Por favor, faça login com sua conta Google primeiro.");
        return;
    }
    showPage(formPage);
});

backToHomeBtn.addEventListener("click", () => showPage(homePage));
logoutBtn.addEventListener("click", logout);

// ==================== Lógica de campos condicionais ====================
document.querySelectorAll("input[name='genero']").forEach(radio => {
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

cidadeSelect.addEventListener("change", () => {
    if (cidadeSelect.value === "Outra Cidade") {
        cidadeOutraText.classList.remove("hidden");
        cidadeOutraText.setAttribute("required", "");
    } else {
        cidadeOutraText.classList.add("hidden");
        cidadeOutraText.removeAttribute("required");
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

        perguntasSimDiv.querySelectorAll("input[type='text']").forEach(el => el.removeAttribute("required"));
        perguntasNaoDiv.querySelectorAll("input[type='text'], textarea").forEach(el => el.removeAttribute("required"));
        orientacaoProfissionalSection.querySelectorAll("input[type='radio']").forEach(el => el.removeAttribute("required"));

        if (radio.value === "Sim") {
            perguntasSimDiv.classList.remove("hidden");
        } else if (radio.value === "Não") {
            perguntasNaoDiv.classList.remove("hidden");
            orientacaoProfissionalSection.classList.remove("hidden");
            orientacaoProfissionalSection.querySelectorAll("input[name='orientacaoProfissional']").forEach(el => el.setAttribute("required", ""));
        } else if (radio.value === "Ainda estou em dúvida") {
            orientacaoProfissionalSection.classList.remove("hidden");
            orientacaoProfissionalSection.querySelectorAll("input[name='orientacaoProfissional']").forEach(el => el.setAttribute("required", ""));
        }
    });
});

// ==================== Função de coleta de dados ====================
function collectFormData() {
    const formData = new FormData(surveyForm);
    const data = {};

    // Coleta todos os dados do formulário
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

    // Converte arrays em strings separadas por vírgula
    ['cursoInteresse', 'fatorMotivacao', 'motivoNaoInteresse', 'acoesInteresseSuperior'].forEach(key => {
        if (Array.isArray(data[key])) {
            data[key] = data[key].join(', ');
        }
    });

    // Adiciona email do usuário autenticado
    if (currentUser) {
        data.email = currentUser.email;
    }

    // Remove campos condicionais não aplicáveis
    if (data.genero !== "Outro") {
        delete data.generoOutro;
    }
    if (data.escola !== "Outra Escola") {
        delete data.escolaOutra;
    }
    if (data.cidade !== "Outra Cidade") {
        delete data.cidadeOutra;
    }

    // Remove campos baseados no interesse em ensino superior
    if (data.interesseEnsinoSuperior === "Sim") {
        delete data.motivoNaoInteresse;
        delete data.motivoNaoInteresseOutro;
        delete data.interesseTecnico;
    } else if (data.interesseEnsinoSuperior === "Não") {
        delete data.cursoInteresse;
        delete data.cursoInteresseOutro;
        delete data.fatorMotivacao;
        delete data.fatorMotivacaoOutro;
    } else {
        delete data.motivoNaoInteresse;
        delete data.motivoNaoInteresseOutro;
        delete data.cursoInteresse;
        delete data.cursoInteresseOutro;
        delete data.fatorMotivacao;
        delete data.fatorMotivacaoOutro;
        delete data.interesseTecnico;
    }

    // Remove campos "Outro" não preenchidos
    if (!data.cursoInteresse || !data.cursoInteresse.includes('Outro')) {
        delete data.cursoInteresseOutro;
    }
    if (!data.fatorMotivacao || !data.fatorMotivacao.includes('Outro')) {
        delete data.fatorMotivacaoOutro;
    }
    if (!data.motivoNaoInteresse || !data.motivoNaoInteresse.includes('Outro')) {
        delete data.motivoNaoInteresseOutro;
    }
    if (!data.acoesInteresseSuperior || !data.acoesInteresseSuperior.includes('Outra')) {
        delete data.acoesInteresseSuperiorOutro;
    }

    return data;
}

// ==================== Função de envio do formulário ====================
surveyForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
        // Verifica autenticação
        if (!currentUser) {
            throw new Error("Usuário não autenticado. Faça login primeiro.");
        }

        // Validações adicionais
        const interesse = document.querySelector("input[name='interesseEnsinoSuperior']:checked");
        
        if (interesse) {
            if (interesse.value === "Sim") {
                const cursosChecked = document.querySelectorAll("input[name='cursoInteresse']:checked");
                if (cursosChecked.length === 0) {
                    throw new Error("Por favor, selecione pelo menos um curso de interesse.");
                }
            }
            
            if (interesse.value === "Não") {
                const motivosChecked = document.querySelectorAll("input[name='motivoNaoInteresse']:checked");
                if (motivosChecked.length === 0) {
                    throw new Error("Por favor, selecione pelo menos um motivo.");
                }
            }
        }

        // Coleta os dados
        const formDataObj = collectFormData();
        
        console.log("📋 Dados coletados:", formDataObj);

        // Verifica se o serviço está configurado
        if (!googleSheetsService.isConfigured) {
            console.warn("⚠️ Google Sheets não configurado. Exibindo dados no console.");
            console.log("Dados que seriam enviados:", formDataObj);
            alert("Formulário validado com sucesso!\n\nDados exibidos no console do navegador (F12).");
            surveyForm.reset();
            showPage(homePage);
            return;
        }

        // Exibe loading
        const submitBtn = surveyForm.querySelector("button[type='submit']");
        const originalText = submitBtn.textContent;
        submitBtn.textContent = "Enviando...";
        submitBtn.disabled = true;

        // Envia para o Google Sheets
        const result = await googleSheetsService.submitForm(formDataObj);

        // Sucesso
        console.log("✅ Formulário enviado com sucesso:", result);
        alert("Formulário enviado com sucesso!\n\nObrigado por participar da pesquisa.");
        
        // Reset e volta para home
        surveyForm.reset();
        showPage(homePage);

        // Restaura botão
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;

    } catch (error) {
        console.error("❌ Erro ao enviar formulário:", error);
        
        // Restaura botão em caso de erro
        const submitBtn = surveyForm.querySelector("button[type='submit']");
        if (submitBtn) {
            submitBtn.textContent = "Enviar Formulário";
            submitBtn.disabled = false;
        }

        // Exibe erro amigável
        let errorMessage = "Erro ao enviar o formulário.";
        
        if (error.message) {
            errorMessage = error.message;
        }
        
        alert(errorMessage + "\n\nPor favor, tente novamente. Se o problema persistir, contate o suporte.");
    }
});

// ==================== Log de inicialização ====================
console.log("✅ Script carregado com sucesso");
console.log("🔧 Google Sheets configurado:", googleSheetsService.isConfigured);