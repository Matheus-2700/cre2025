// Variáveis globais do formulário
let homePage, formPage, startSurveyBtn, backToHomeBtn, surveyForm;
let gsService = new GoogleSheetsService();

// Inicializa os elementos do DOM
function initDOMElements() {
    homePage = document.getElementById("home-page");
    formPage = document.getElementById("form-page");
    startSurveyBtn = document.getElementById("start-survey-btn");
    backToHomeBtn = document.getElementById("back-to-home-btn");
    surveyForm = document.getElementById("survey-form");
}

// Alterna entre páginas
function showPage(pageToShow) {
    homePage.style.display = pageToShow === 'home' ? 'block' : 'none';
    formPage.style.display = pageToShow === 'form' ? 'block' : 'none';
}

// Inicializa eventos de navegação
function initNavigation() {
    startSurveyBtn.addEventListener('click', () => showPage('form'));
    backToHomeBtn.addEventListener('click', () => showPage('home'));
}

// Cria o objeto formData com todos os campos do formulário
function collectFormData() {
    const formData = {
        nome: document.getElementById('nome')?.value || '',
        idade: document.getElementById('idade')?.value || '',
        genero: document.getElementById('genero')?.value || '',
        generoOutro: document.getElementById('generoOutro')?.value || '',
        escola: document.getElementById('escola')?.value || '',
        escolaOutra: document.getElementById('escolaOutra')?.value || '',
        cidade: document.getElementById('cidade')?.value || '',
        cidadeOutra: document.getElementById('cidadeOutra')?.value || '',
        anoEscolar: document.getElementById('anoEscolar')?.value || '',
        turno: document.getElementById('turno')?.value || '',
        interesseEnsinoSuperior: document.getElementById('interesseEnsinoSuperior')?.value || '',
        cursoInteresse: document.getElementById('cursoInteresse')?.value || '',
        cursoInteresseOutro: document.getElementById('cursoInteresseOutro')?.value || '',
        fatorMotivacao: document.getElementById('fatorMotivacao')?.value || '',
        fatorMotivacaoOutro: document.getElementById('fatorMotivacaoOutro')?.value || '',
        motivoNaoInteresse: document.getElementById('motivoNaoInteresse')?.value || '',
        motivoNaoInteresseOutro: document.getElementById('motivoNaoInteresseOutro')?.value || '',
        interesseTecnico: document.getElementById('interesseTecnico')?.value || '',
        orientacaoProfissional: document.getElementById('orientacaoProfissional')?.value || '',
        participouOrientacao: document.getElementById('participouOrientacao')?.value || '',
        acoesInteresseSuperior: document.getElementById('acoesInteresseSuperior')?.value || '',
        acoesInteresseSuperiorOutro: document.getElementById('acoesInteresseSuperiorOutro')?.value || '',
        sugestoesGerais: document.getElementById('sugestoesGerais')?.value || ''
    };
    return formData;
}

// Inicializa envio do formulário
function initFormSubmission() {
    if (!surveyForm) return;

    surveyForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = collectFormData();

        // Mostra mensagem de carregando
        const submitBtn = surveyForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerText;
        submitBtn.innerText = 'Enviando...';
        submitBtn.disabled = true;

        try {
            const result = await gsService.submitForm(formData);

            if (result.success) {
                alert(result.message);
                surveyForm.reset();
                showPage('home');
            } else {
                alert('Erro ao enviar o formulário: ' + result.message);
            }
        } catch (err) {
            alert('Erro inesperado: ' + (err.message || err));
        } finally {
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Inicializa todo o script
function initApp() {
    initDOMElements();
    initNavigation();
    initFormSubmission();
    showPage('home'); // garante que comece na home
}

// Espera o DOM carregar antes de inicializar
document.addEventListener('DOMContentLoaded', initApp);
