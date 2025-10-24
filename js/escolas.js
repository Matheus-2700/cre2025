document.addEventListener("DOMContentLoaded", () => {
    // ==================== ESCOLAS POR CIDADE ====================
    const escolasPorCidade = {
        "Canoinhas": [
            "Cedup Vidal Ramos", 
            "Ceja de Canoinhas", 
            "EEB Almirante Barroso", 
            "EEB Irma Maria Felicitas", 
            "EEB João José de S Cabral", 
            "EEB Julia Baleoli Zaniolo", 
            "EEB Professor Manoel da S Quadros", 
            "EEB Rodolfo Zipperer", 
            "EEB Santa Cruz", 
            "Eef Sagrado Coracao de Jesus"
        ],
        "Três Barras": [
            "EEB Colombo Machado Salles", 
            "EEB Frei Menandro Kamps", 
            "EEB General Osorio"
        ],
        "Bela Vista do Toldo": [
            "EEB Estanislau Schumann"
        ],
        "Major Vieira": [
            "EEB Luiz Davet"
        ],
        "Irineópolis": [
            "EEB Horacio Nunes"
        ],
        "Porto União": [
            "EEB Antonio Gonzaga", 
            "EEB Balduíno Cardoso", 
            "EEB Cel Cid Gonzaga", 
            "EEB Nilo Pecanha", 
            "EEB Professor Clementino Britto", 
            "EEB Professor Germano Wagenfuhr"
        ]
    };

    // ==================== ELEMENTOS DO DOM ====================
    const cidadeSelect = document.getElementById("cidade");
    const escolaSelect = document.getElementById("escola");

    // ==================== ATUALIZAR ESCOLAS BASEADO NA CIDADE ====================
    if (cidadeSelect && escolaSelect) {
        cidadeSelect.addEventListener("change", function () {
            const cidadeSelecionada = this.value;
            escolaSelect.innerHTML = '<option value="">Selecione uma escola</option>';

            // Se cidade for "Outra Cidade", mostrar apenas "Outra Escola"
            if (cidadeSelecionada === "Outra Cidade") {
                const outra = document.createElement("option");
                outra.value = "Outra Escola";
                outra.textContent = "Outra Escola";
                escolaSelect.appendChild(outra);
                return;
            }

            // Preencher escolas da cidade selecionada
            if (escolasPorCidade[cidadeSelecionada]) {
                escolasPorCidade[cidadeSelecionada].forEach((escola) => {
                    const option = document.createElement("option");
                    option.value = escola;
                    option.textContent = escola;
                    escolaSelect.appendChild(option);
                });

                // Adicionar opção "Outra Escola"
                const outra = document.createElement("option");
                outra.value = "Outra Escola";
                outra.textContent = "Outra Escola";
                escolaSelect.appendChild(outra);
            }
        });
    }

    console.log('✅ Escolas.js carregado');
    console.log('📚 Total de escolas:', Object.values(escolasPorCidade).flat().length);
});