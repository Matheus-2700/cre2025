document.addEventListener('DOMContentLoaded', () => {

    // ==================== Serviço Google Sheets ====================
    const googleSheetsService = new GoogleSheetsService();
    googleSheetsService.setScriptUrl('https://script.google.com/macros/s/AKfycbxvbCRuhlScKOhXw2zef9_xv9E1DsgBt2Hk1WptAJcUOcnsp5SDnjsAx-sYN17Z4hWkZg/exec');

    // ==================== Elementos de navegação ====================
    const homePage = document.getElementById("home-page");
    const formPage = document.getElementById("form-page");
    const startSurveyBtn = document.getElementById("start-survey-btn");
    const backToHomeBtn = document.getElementById("back-to-home-btn");
    const surveyForm = document.getElementById("survey-form");

    // ==================== Elementos de autenticação ====================
    const loginSectionGlobal = document.getElementById("login-section");
    const authenticatedSectionGlobal = document.getElementById("authenticated-section");
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

    // ==================== Utilitárias ====================
    function isVisible(el) {
        if (!el) return false;
        const rects = el.getClientRects();
        if (!rects || rects.length === 0) return false;
        const style = window.getComputedStyle(el);
        if (style && (style.visibility === 'hidden' || style.display === 'none')) return false;
        return true;
    }

    function setSectionVisibility(section, visible) {
        if (!section) return;
        const controls = section.querySelectorAll("input, select, textarea, button");
        if (visible) {
            section.classList.remove("hidden");
            controls.forEach(el => {
                el.disabled = false;
                if (el.dataset.origRequired === "true") {
                    el.required = true;
                    delete el.dataset.origRequired;
                }
            });
        } else {
            controls.forEach(el => {
                if (el.required) {
                    el.dataset.origRequired = "true";
                }
                el.required = false;
                el.disabled = true;
            });
            section.classList.add("hidden");
        }
    }

    // Aplica visibilidade inicial
    setSectionVisibility(generoOutroText, !generoOutroText?.classList?.contains("hidden"));
    setSectionVisibility(escolaOutraText, !escolaOutraText?.classList?.contains("hidden"));
    setSectionVisibility(cidadeOutraText, !cidadeOutraText?.classList?.contains("hidden"));
    setSectionVisibility(perguntasSimDiv, !perguntasSimDiv?.classList?.contains("hidden"));
    setSectionVisibility(perguntasNaoDiv, !perguntasNaoDiv?.classList?.contains("hidden"));
    setSectionVisibility(orientacaoProfissionalSection, !orientacaoProfissionalSection?.classList?.contains("hidden"));
    setSectionVisibility(cursoInteresseOutroText, !cursoInteresseOutroText?.classList?.contains("hidden"));

    function showPage(pageToShow) {
        if (!homePage || !formPage) return;
        homePage.classList.remove("active");
        formPage.classList.remove("active");
        pageToShow.classList.add("active");
        
        // Rola para o topo da página suavemente
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // ==================== Navegação ====================
    if (startSurveyBtn) {
        startSurveyBtn.addEventListener("click", () => {
            if (!window.currentUser) {
                alert("Por favor, faça login com sua conta Google primeiro.");
                return;
            }
            showPage(formPage);
        });
    }
    if (backToHomeBtn) {
        backToHomeBtn.addEventListener("click", () => showPage(homePage));
    }
    if (logoutBtn) {
        logoutBtn.addEventListener("click", window.logout);
    }

    // ==================== Lógica de campos condicionais ====================
    document.querySelectorAll("input[name='genero']").forEach(radio => {
        radio.addEventListener("change", () => {
            const showOutro = generoOutroRadio && generoOutroRadio.checked;
            setSectionVisibility(generoOutroText, showOutro);
            if (showOutro) {
                const input = generoOutroText.querySelector("input, textarea");
                if (input) input.required = true;
            }
        });
    });

    if (escolaSelect) {
        escolaSelect.addEventListener("change", () => {
            const show = escolaSelect.value && escolaSelect.value.toLowerCase().includes("outra");
            setSectionVisibility(escolaOutraText, show);
            if (show) {
                const input = escolaOutraText.querySelector("input, textarea");
                if (input) input.required = true;
            }
        });
    }

    if (cidadeSelect) {
        cidadeSelect.addEventListener("change", () => {
            const show = cidadeSelect.value && cidadeSelect.value.toLowerCase().includes("outra");
            setSectionVisibility(cidadeOutraText, show);
            if (show) {
                const input = cidadeOutraText.querySelector("input, textarea");
                if (input) input.required = true;
            }
        });
    }

    // ==================== LÓGICA CORRIGIDA PARA INTERESSE EM ENSINO SUPERIOR ====================
    interesseEnsinoSuperiorRadios.forEach(radio => {
        radio.addEventListener("change", () => {
            // Esconder todas as seções primeiro
            setSectionVisibility(perguntasSimDiv, false);
            setSectionVisibility(perguntasNaoDiv, false);
            setSectionVisibility(orientacaoProfissionalSection, false);

            if (radio.value === "Sim") {
                // Apenas perguntas sobre cursos e motivação
                setSectionVisibility(perguntasSimDiv, true);
            } else if (radio.value === "Não") {
                // Perguntas sobre motivos de não interesse + orientação profissional
                setSectionVisibility(perguntasNaoDiv, true);
                setSectionVisibility(orientacaoProfissionalSection, true);
            } else if (radio.value === "Ainda estou em dúvida") {
                // Perguntas sobre cursos/motivação + orientação profissional
                setSectionVisibility(perguntasSimDiv, true);
                setSectionVisibility(orientacaoProfissionalSection, true);
            }

            console.log('📊 Interesse selecionado:', radio.value);
        });
    });

    if (cursoInteresseOutroCheck) {
        cursoInteresseOutroCheck.addEventListener("change", () => {
            setSectionVisibility(cursoInteresseOutroText, cursoInteresseOutroCheck.checked);
            if (cursoInteresseOutroCheck.checked) {
                const input = cursoInteresseOutroText.querySelector("input, textarea");
                if (input) input.required = true;
            }
        });
    }

    // ==================== Handler de submit ====================
    if (surveyForm) {
        surveyForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            // Limpeza preventiva de campos required invisíveis
            const requiredControls = Array.from(document.querySelectorAll('[required]'));
            requiredControls.forEach(control => {
                if (!isVisible(control)) {
                    if (control.type === 'radio' && control.name) {
                        const group = document.querySelectorAll(`input[type="radio"][name="${control.name}"]`);
                        group.forEach(r => {
                            if (r.required) r.dataset.origRequired = "true";
                            r.required = false;
                        });
                    } else {
                        if (control.required) control.dataset.origRequired = "true";
                        control.required = false;
                    }
                }
            });

            const submitBtn = surveyForm.querySelector("button[type='submit']");
            const originalText = submitBtn ? submitBtn.textContent : "";

            try {
                if (!window.currentUser) throw new Error("Usuário não autenticado.");

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
                if (window.currentUser) data.email = window.currentUser.email;

                console.log("📋 Dados coletados:", data);

                if (submitBtn) {
                    submitBtn.textContent = "Enviando...";
                    submitBtn.disabled = true;
                }

                const result = await googleSheetsService.submitForm(data);

                console.log("✅ Formulário enviado com sucesso:", result);
                alert("Formulário enviado com sucesso!\nObrigado por participar!");

                surveyForm.reset();

                // Restaurar visibilidades padrão
                setSectionVisibility(generoOutroText, false);
                setSectionVisibility(escolaOutraText, false);
                setSectionVisibility(cidadeOutraText, false);
                setSectionVisibility(perguntasSimDiv, false);
                setSectionVisibility(perguntasNaoDiv, false);
                setSectionVisibility(orientacaoProfissionalSection, false);
                setSectionVisibility(cursoInteresseOutroText, false);

                showPage(homePage);

            } catch (error) {
                console.error("❌ Erro ao enviar formulário:", error);
                alert(error.message || "Ocorreu um erro.");
            } finally {
                // Restaurar requireds guardados
                const allControls = Array.from(document.querySelectorAll('input, select, textarea'));
                allControls.forEach(control => {
                    if (control.dataset.origRequired === "true") {
                        control.required = true;
                        delete control.dataset.origRequired;
                    }
                });

                if (submitBtn) {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            }
        });
    }

    console.log("✅ Script carregado e DOM pronto.");
});

// ==================== Funções de autenticação Google ====================
window.currentUser = null;

function handleCredentialResponse(response) {
    const responsePayload = decodeJwtResponse(response.credential);
    window.currentUser = {
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
        if (loginSection) loginSection.classList.add("hidden");
        if (authenticatedSection) authenticatedSection.classList.remove("hidden");
        if (userPicture && window.currentUser.picture) userPicture.src = window.currentUser.picture;
        if (userName) userName.textContent = window.currentUser.name || "";
        if (userEmail) userEmail.textContent = window.currentUser.email || "";
    }
}

function logout() {
    const loginSection = document.getElementById("login-section");
    const authenticatedSection = document.getElementById("authenticated-section");
    const formPage = document.getElementById("form-page");
    const homePage = document.getElementById("home-page");

    window.currentUser = null;
    if (loginSection) loginSection.classList.remove("hidden");
    if (authenticatedSection) authenticatedSection.classList.add("hidden");
    if (formPage && formPage.classList.contains("active") && homePage) {
        homePage.classList.add("active");
        formPage.classList.remove("active");
    }
}