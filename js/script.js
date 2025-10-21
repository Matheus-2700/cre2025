document.addEventListener('DOMContentLoaded', () => {

    // ==================== Serviço Google Sheets ====================
    const googleSheetsService = new GoogleSheetsService();
    googleSheetsService.setScriptUrl('https://script.google.com/macros/s/AKfycbwZ_67lAZeUyaEQHn448wVAd9A7m-FE_jTzFrGGeQdop-8JuutiK3NE_QULCWsEMBaEQg/exec' );

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
    const cursoInteresseOutroCheck = document.getElementById("curso-outro-check");
    const cursoInteresseOutroText = document.getElementById("curso-interesse-outro-text");
    // ... (e outros campos que você tinha)

    function showPage(pageToShow) {
        homePage.classList.remove("active");
        formPage.classList.remove("active");
        pageToShow.classList.add("active");
    }

    // ==================== Navegação ====================
    startSurveyBtn.addEventListener("click", () => {
        if (!window.currentUser) { // Usa window.currentUser que é global
            alert("Por favor, faça login com sua conta Google primeiro.");
            return;
        }
        showPage(formPage);
    });

    backToHomeBtn.addEventListener("click", () => showPage(homePage));
    logoutBtn.addEventListener("click", window.logout); // Usa a função global

    // ==================== Lógica de campos condicionais (Sua lógica original) ====================
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
    // ... (toda a sua lógica de campos condicionais que já funcionava)
    interesseEnsinoSuperiorRadios.forEach(radio => {
        radio.addEventListener("change", () => {
            perguntasSimDiv.classList.add("hidden");
            perguntasNaoDiv.classList.add("hidden");
            orientacaoProfissionalSection.classList.add("hidden");

            if (radio.value === "Sim") {
                perguntasSimDiv.classList.remove("hidden");
            } else if (radio.value === "Não") {
                perguntasNaoDiv.classList.remove("hidden");
                orientacaoProfissionalSection.classList.remove("hidden");
            } else if (radio.value === "Ainda estou em dúvida") {
                orientacaoProfissionalSection.classList.remove("hidden");
            }
        });
    });


    // ==================== Função de envio do formulário (Sua lógica original) ====================
    surveyForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const submitBtn = surveyForm.querySelector("button[type='submit']");
        const originalText = submitBtn.textContent;

        try {
            if (!window.currentUser) throw new Error("Usuário não autenticado.");

            const formData = new FormData(surveyForm);
            const data = {};
            for (let [key, value] of formData.entries()) {
                if (data[key]) {
                    if (!Array.isArray(data[key])) data[key] = [data[key]];
                    data[key].push(value);
                } else { data[key] = value; }
            }
            if (window.currentUser) data.email = window.currentUser.email;

            console.log("📋 Dados coletados:", data);

            submitBtn.textContent = "Enviando...";
            submitBtn.disabled = true;

            const result = await googleSheetsService.submitForm(data);

            console.log("✅ Formulário enviado com sucesso:", result);
            alert("Formulário enviado com sucesso!\nObrigado por participar!");
            
            surveyForm.reset();
            showPage(homePage);

        } catch (error) {
            console.error("❌ Erro ao enviar formulário:", error);
            alert(error.message || "Ocorreu um erro.");
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });

    console.log("✅ Script carregado e DOM pronto.");
});

// ==================== Funções de autenticação Google (Globais) ====================
// Deixamos estas funções fora para o Google GSI encontrá-las.
// Elas vão operar em `window.currentUser` para serem verdadeiramente globais.

window.currentUser = null;

function handleCredentialResponse(response) {
    const responsePayload = decodeJwtResponse(response.credential);
    window.currentUser = {
        id: responsePayload.sub, name: responsePayload.name,
        email: responsePayload.email, picture: responsePayload.picture
    };
    showAuthenticatedUser();
}

function decodeJwtResponse(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
    return JSON.parse(jsonPayload);
}

function showAuthenticatedUser() {
    const loginSection = document.getElementById("login-section");
    const authenticatedSection = document.getElementById("authenticated-section");
    const userPicture = document.getElementById("user-picture");
    const userName = document.getElementById("user-name");
    const userEmail = document.getElementById("user-email");

    if (window.currentUser) {
        loginSection.classList.add("hidden");
        authenticatedSection.classList.remove("hidden");
        userPicture.src = window.currentUser.picture;
        userName.textContent = window.currentUser.name;
        userEmail.textContent = window.currentUser.email;
    }
}

function logout() {
    const loginSection = document.getElementById("login-section");
    const authenticatedSection = document.getElementById("authenticated-section");
    const formPage = document.getElementById("form-page");
    const homePage = document.getElementById("home-page");

    window.currentUser = null;
    loginSection.classList.remove("hidden");
    authenticatedSection.classList.add("hidden");
    if (formPage.classList.contains("active")) {
        homePage.classList.add("active");
        formPage.classList.remove("active");
    }
}
