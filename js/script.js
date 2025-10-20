const USE_PROXY = true; // ou true, se quiser usar o proxy

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
const googleSheetsService = new GoogleSheetsService();
googleSheetsService.setScriptUrl('https://script.google.com/macros/s/AKfycbyHmuupWMkNL5xEuMG_XsRyBCX1OmkVtBHpykvy8upfrXrDR27JQyAYDFXZstUR7pIy2A/exec');

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

    for (let [key, value] of formData.entries()) {
        if (data[key]) {
            if (!Array.isArray(data[key])) data[key] = [data[key]];
            data[key].push(value);
        } else {
            data[key] = value;
        }
    }

    ['cursoInteresse','fatorMotivacao','motivoNaoInteresse','acoesInteresseSuperior'].forEach(key => {
        if (Array.isArray(data[key])) data[key] = data[key].join(', ');
    });

    if (currentUser) data.email = currentUser.email;

    if (data.genero !== "Outro") delete data.generoOutro;
    if (data.escola !== "Outra Escola") delete data.escolaOutra;
    if (data.cidade !== "Outra Cidade") delete data.cidadeOutra;

    if (data.interesseEnsinoSuperior === "Sim") {
        delete data.motivoNaoInteresse;
        delete data.motivoNaoInteresseOutro;
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
    }

    if (!data.cursoInteresse || !data.cursoInteresse.includes('Outro')) delete data.cursoInteresseOutro;
    if (!data.fatorMotivacao || !data.fatorMotivacao.includes('Outro')) delete data.fatorMotivacaoOutro;
    if (!data.motivoNaoInteresse || !data.motivoNaoInteresse.includes('Outro')) delete data.motivoNaoInteresseOutro;
    if (!data.acoesInteresseSuperior || !data.acoesInteresseSuperior.includes('Outro')) delete data.acoesInteresseSuperiorOutro;

    return data;
}

// ==================== Função de envio ====================
surveyForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
        if (!currentUser) throw new Error("Usuário não autenticado. Faça login.");

        // Validação de campos obrigatórios
        const interesse = document.querySelector("input[name='interesseEnsinoSuperior']:checked");
        if (interesse) {
            if (interesse.value === "Sim" && document.querySelectorAll("input[name='cursoInteresse']:checked").length === 0) {
                throw new Error("Selecione pelo menos um curso de interesse.");
            }
            if (interesse.value === "Não" && document.querySelectorAll("input[name='motivoNaoInteresse']:checked").length === 0) {
                throw new Error("Selecione pelo menos um motivo para não cursar.");
            }
            if (interesse.value === "Ainda estou em dúvida" && document.querySelectorAll("input[name='orientacaoProfissional']:checked").length === 0) {
                throw new Error("Selecione pelo menos uma opção de orientação profissional.");
            }
        }

        const data = collectFormData();

        if (!googleSheetsService.scriptUrl) {
            console.log("Dados do formulário:", data);
            alert("Formulário validado com sucesso!");
            surveyForm.reset();
            showPage(homePage);
            return;
        }

        // Chamada ao serviço Google Sheets
        // Exemplo: escolher runtime dinamicamente
        let result;
        if (USE_PROXY) { // variável booleana sua
  // garanta que prepared tenha secret se proxy exigir
        data.secret = googleSheetsService.secret;
        result = await sendToProxy(data);
        } else {
        result = await sendDirectToAppsScript(data);
        }


const mensagem = 
    typeof result.message === 'string'
        ? result.message
        : JSON.stringify(result.message, null, 2);

if (result.success) {
    alert(mensagem);
    surveyForm.reset();
    showPage(homePage);
} else {
    throw new Error(mensagem);
}

    } catch (error) {
        console.error("Erro ao enviar o formulário:", error);
        alert("Erro inesperado:\n" + (error?.message || String(error)));
    }
});
