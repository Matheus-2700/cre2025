# Resumo dos Requisitos do Projeto (HTML, CSS, JavaScript Puro)

## 1. Identidade Visual
- Layout deve remeter ao CRE Canoinhas, utilizando cores azul/verde e um design limpo e institucional.
- A tela inicial deve exibir o logo e o nome do CRE Canoinhas.

## 2. Funcionalidades
- **Formulário Digital**: Replicar a lógica do Google Form original.
  - Seções para **Dados Pessoais** e **Dados Acadêmicos**.
  - Pergunta sobre interesse em cursar **Ensino Superior** com as opções: "Sim", "Não", "Ainda estou em dúvida".
    - Se "Sim": Abre um conjunto de perguntas específicas (visibilidade controlada por JS).
    - Se "Não": Abre outro conjunto de perguntas específicas (visibilidade controlada por JS).
  - Opção para **Gênero**: "Outro" (campo de texto condicional).
  - Opções extras para **Escola**: "Outra Escola" e **Cidade**: "Outra Cidade" (campos de texto condicionais).
  - **Etapa Final**: Seção de "Orientação profissional e apoio".

## 3. Integração de Dados
- As respostas do formulário devem ser enviadas automaticamente para uma Google Planilha (via Google Sheets API) ou para o Google Form original (via API).
  - **Nota**: A integração será feita via JavaScript, provavelmente utilizando `fetch` para um Google Apps Script como intermediário.

## 4. Autenticação
- O envio do formulário só deve ser permitido se o usuário estiver logado com um e-mail institucional da UGV, replicando o comportamento atual do Google Form.
  - **Nota**: Esta validação será implementada em JavaScript no frontend e, idealmente, reforçada no Google Apps Script no backend.

## 5. Estrutura Esperada
- Projeto desenvolvido em **HTML, CSS e JavaScript puro**.
- Estilização utilizando **CSS puro** (sem frameworks como TailwindCSS).
- Navegação entre telas (se houver múltiplas "telas" ou seções) será controlada por **JavaScript** (ex: exibição/ocultação de divs).
- Código limpo, organizado em arquivos separados (HTML para estrutura, CSS para estilo, JS para lógica).
- Comentários explicativos em pontos importantes do código.

## 6. Entregáveis
- Código-fonte completo em HTML, CSS e JavaScript.
- Instruções claras para configuração e execução (abrir `index.html` no navegador).
- Documentação robusta explicando a estrutura, lógica, e integração com Google Sheets/Form, para que o squad possa alterar.
- A aplicação deve ser 100% funcional e testada antes da entrega.

