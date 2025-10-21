// ==========================================
// SCRIPT.JS - VERSÃO COMPLETA, FINAL E ROBUSTA
// ==========================================

// ==================== Módulo Principal da Aplicação ====================
const app = {
    elements: {},
    currentUser: null,
    googleSheetsService: new GoogleSheetsService(),

    init() {
        this.googleSheetsService.setScriptUrl('https://script.google.com/macros/s/AKfycbwZ_67lAZeUyaEQHn448wVAd9A7m-FE_jTzFrGGeQdop-8JuutiK3NE_QULCWsEMBaEQg/exec' );
        this.mapDOMElements();
        this.setupEventListeners();
        console.log("✅ Aplicação iniciada com sucesso.");
        console.log("🔧 Google Sheets configurado:", this.googleSheetsService.isConfigured);
    },

    mapDOMElements() {
        const ids = [
            "home-page", "form-page", "start-survey-btn", "back-to-home-btn", "survey-form",
            "login-section", "authenticated-section", "logout-btn", "user-picture", "user-name", "user-email",
            "genero-outro", "genero-outro-text", "escola", "escola-outra-text", "cidade", "cidade-outra-text",
            "perguntas-sim", "perguntas-nao", "orientacao-profissional-section", "curso-outro-check",
            "curso-interesse-outro-text", "fator-outro-check", "fator-motivacao-outro-text",
            "motivo-nao-outro-check", "motivo-nao-outro-text", "acao-outra-check", "acoes-interesse-superior-outro-text"
        ];
        ids.forEach(id => {
            // Converte o id (ex: "home-page") para uma chave de objeto (ex: "homePage")
            const key = id.replace(/-(\w)/g, (match, letter) => letter.toUpperCase());
            this.elements[key] = document.getElementById(id);
        });

        // Mapeia elementos que usam querySelectorAll
        this.elements.interesseEnsinoSuperiorRadios = document.querySelectorAll("input[name='interesseEnsinoSuperior']");
        this.elements.generoRadios = document.querySelectorAll("input[name='genero']");
        this.elements.cursoInteresseCheckboxes = document.querySelectorAll("input[name='cursoInteresse']");
        this.elements.fatorMotivacaoCheckboxes = document.querySelectorAll("input[name='fatorMotivacao']");
        this.elements.motivoNaoInteresseCheckboxes = document.querySelectorAll("input[name='motivoNaoInteresse']");
        this.elements.acoesInteresseSuperiorCheckboxes = document.querySelectorAll("input[name='acoesInteresseSuperior']");
    },

    setupEventListeners() {
        this.elements.startSurveyBtn.addEventListener("click", () => {
            if (!this.currentUser) {
                alert("Por favor, faça login com sua conta Google primeiro.");
                return;
            }
            this.showPage(this.elements.formPage);
        });

        this.elements.backToHomeBtn.addEventListener("click", () => this.showPage(this.elements.homePage));
        this.elements.logoutBtn.addEventListener("click", () => this.logout());

        // Lógica de campos condicionais
        this.setupConditionalFields();

        // Listener para o envio do formulário
        this.elements.surveyForm.addEventListener("submit", (event) => this.handleFormSubmit(event));
    },

    showPage(pageToShow) {
        this.elements.homePage.classList.remove("active");
        this.elements.formPage.classList.remove("active");
        pageToShow.classList.add("active");
    },
    
    showAuthenticatedUI() {
        if (this.currentUser) {
            this.elements.loginSection.classList.add("hidden");
            this.elements.authenticatedSection.classList.remove("hidden");
            this.elements.userPicture.src = this.currentUser.picture;
            this.elements.userName.textContent = this.currentUser.name;
            this.elements.userEmail.textContent = this.currentUser.email;
        }
    },

    logout() {
        this.currentUser = null;
        this.elements.loginSection.classList.remove("hidden");
        this.elements.authenticatedSection.classList.add("hidden");
        this.showPage(this.elements.homePage);
    },

    setupConditionalFields() {
        const toggleVisibility = (radio, textEl) => {
            if (radio.checked) {
                textEl.classList.remove("hidden");
                textEl.setAttribute("required", "");
            } else {
                textEl.classList.add("hidden");
                textEl.removeAttribute("required");
            }
        };

        this.elements.generoRadios.forEach(radio => {
            radio.addEventListener("change", () => toggleVisibility(this.elements.generoOutro, this.elements.generoOutroText));
        });

        this.elements.cidade.addEventListener("change", () => {
            if (this.elements.cidade.value === "Outra Cidade") {
                this.elements.cidadeOutraText.classList.remove("hidden");
                this.elements.cidadeOutraText.setAttribute("required", "");
            } else {
                this.elements.cidadeOutraText.classList.add("hidden");
                this.elements.cidadeOutraText.removeAttribute("required");
            }
        });
        
        // Repita para outros campos condicionais...
        this.elements.interesseEnsinoSuperiorRadios.forEach(radio => {
            radio.addEventListener("change", () => {
                this.elements.perguntasSim.classList.add("hidden");
                this.elements.perguntasNao.classList.add("hidden");
                this.elements.orientacaoProfissionalSection.classList.add("hidden");

                if (radio.value === "Sim") this.elements.perguntasSim.classList.remove("hidden");
                else if (radio.value === "Não") {
                    this.elements.perguntasNao.classList.remove("hidden");
                    this.elements.orientacaoProfissionalSection.classList.remove("hidden");
                } else if (radio.value === "Ainda estou em dúvida") {
                    this.elements.orientacaoProfissionalSection.classList.remove("hidden");
                }
            });
        });
    },

    collectFormData() {
        const formData = new FormData(this.elements.surveyForm);
        const data = {};
        for (let [key, value] of formData.entries()) {
            if (data[key]) {
                if (!Array.isArray(data[key])) data[key] = [data[key]];
                data[key].push(value);
            } else {
                data[key] = value;
            }
        }
        if (this.currentUser) data.email = this.currentUser.email;
        return data;
    },

    async handleFormSubmit(event) {
        event.preventDefault();
        const submitBtn = this.elements.surveyForm.querySelector("button[type='submit']");
        const originalText = submitBtn.textContent;

        try {
            if (!this.currentUser) throw new Error("Usuário não autenticado. Faça login primeiro.");

            const formDataObj = this.collectFormData();
            console.log("📋 Dados coletados:", formDataObj);

            submitBtn.textContent = "Enviando...";
            submitBtn.disabled = true;

            const result = await this.googleSheetsService.submitForm(formDataObj);

            console.log("✅ Formulário enviado com sucesso:", result);
            alert("Formulário enviado com sucesso!\n\nObrigado por participar da pesquisa.");
            
            this.elements.surveyForm.reset();
            this.showPage(this.elements.homePage);

        } catch (error) {
            console.error("❌ Erro ao enviar formulário:", error);
            alert(error.message || "Ocorreu um erro ao enviar. Tente novamente.");
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }
};

// ==================== Funções Globais para o Google GSI ====================
function handleCredentialResponse(response) {
    const responsePayload = decodeJwtResponse(response.credential);
    app.currentUser = {
        id: responsePayload.sub,
        name: responsePayload.name,
        email: responsePayload.email,
        picture: responsePayload.picture
    };
    app.showAuthenticatedUI();
}

function decodeJwtResponse(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
    return JSON.parse(jsonPayload);
}

// ==================== Ponto de Entrada da Aplicação ====================
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
