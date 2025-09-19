document.addEventListener("DOMContentLoaded", () => {
    const escolasPorCidade = {
        "Canoinhas": ["Cedup Vidal Ramos", "Ceja de Canoinhas", "EEB Almirante Barroso", "EEB Irma Maria Felicitas", "EEB João José de S Cabral", "EEB Julia Baleoli Zaniolo", "EEB Professor Manoel da S Quadros", "EEB Rodolfo Zipperer", "EEB Santa Cruz", "Eef Sagrado Coracao de Jesus", "Ud Presidio Regional de Canoinhas"],
        "Três Barras": ["EEB Colombo Machado Salles", "EEB Frei Menandro Kamps", "EEB General Osorio", "Ud de Tres Barras"],
        "Bela Vista do Toldo": ["EEB Estanislau Schumann"],
        "Major Vieira": ["EEB Luiz Davet", "Ud de Major Vieira"],
        "Irineópolis": ["EEB Horacio Nunes"],
        "Porto União": ["EEB Antonio Gonzaga", "EEB Cel Cid Gonzaga", "EEB Nilo Pecanha","EEB Balduíno Cardoso", "EEB Professor Clementino Britto", "EEB Professor Germano Wagenfuhr", "Ud de Porto Uniao", "Ud Presidio Regional de Porto Uniao"]
    };

    const cidadeSelect = document.getElementById("cidade");
    const escolaSelect = document.getElementById("escola");

    if (cidadeSelect && escolaSelect) {
        cidadeSelect.addEventListener("change", function () {
            const cidadeSelecionada = this.value;
            escolaSelect.innerHTML = '<option value="">Selecione uma escola</option>';

            if (escolasPorCidade[cidadeSelecionada]) {
                escolasPorCidade[cidadeSelecionada].forEach((escola) => {
                    const option = document.createElement("option");
                    option.value = escola;
                    option.textContent = escola;
                    escolaSelect.appendChild(option);
                });

                const outra = document.createElement("option");
                outra.value = "Outra Escola";
                outra.textContent = "Outra Escola";
                escolaSelect.appendChild(outra);
            }
        });
    }
});