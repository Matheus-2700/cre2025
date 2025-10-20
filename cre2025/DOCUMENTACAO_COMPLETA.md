# 📚 Documentação Completa - Aplicação CRE Canoinhas

## 🎯 Visão Geral do Projeto

Esta aplicação web foi desenvolvida especificamente para o CRE (Coordenadoria Regional de Educação) Canoinhas, utilizando apenas **HTML, CSS e JavaScript puro**. O objetivo é coletar dados educacionais dos estudantes da região através de um formulário digital responsivo e intuitivo.

### 🏗️ Arquitetura da Aplicação

A aplicação segue uma arquitetura simples e eficiente:

```
cre-canoinhas-app-html-css-js/
├── index.html              # Página principal (SPA - Single Page Application)
├── css/
│   └── style.css          # Estilos CSS responsivos
├── js/
│   ├── script.js          # Lógica principal da aplicação
│   └── googleSheets.js    # Serviço de integração com Google Sheets
└── img/
    └── logo.jpg           # Logo do CRE Canoinhas
```

### 🎨 Características Técnicas

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Responsividade**: Design adaptável para desktop, tablet e mobile
- **Compatibilidade**: Todos os navegadores modernos (Chrome, Firefox, Safari, Edge)
- **Dependências**: Nenhuma (100% vanilla JavaScript)
- **Integração**: Google Sheets via Google Apps Script

---

## 🚀 Guia de Instalação e Configuração

### Pré-requisitos

- Servidor web (Apache, Nginx, ou qualquer servidor HTTP)
- Navegador web moderno
- Conta Google (para configuração do Google Sheets)

### Instalação Local

1. **Download dos Arquivos**
   ```bash
   # Extrair o projeto em um diretório do servidor web
   unzip cre-canoinhas-app-html-css-js.zip
   cd cre-canoinhas-app-html-css-js
   ```

2. **Configuração do Servidor**
   ```bash
   # Para desenvolvimento local com Python
   python -m http.server 8000
   
   # Para desenvolvimento local com Node.js
   npx serve .
   
   # Para Apache/Nginx, copie os arquivos para o diretório web
   cp -r * /var/www/html/cre-canoinhas/
   ```

3. **Acesso à Aplicação**
   - Abra o navegador e acesse: `http://localhost:8000`
   - Ou o endereço configurado no seu servidor

### Configuração do Google Sheets

A aplicação está preparada para integrar com Google Sheets. Siga os passos detalhados na seção "Integração com Google Sheets" deste documento.

---


## 📁 Estrutura Detalhada dos Arquivos

### `index.html` - Página Principal

Este arquivo contém toda a estrutura HTML da aplicação, implementada como uma Single Page Application (SPA). A página é dividida em duas seções principais:

#### Seção 1: Página Inicial (`#home-page`)
- **Header**: Logo e título do CRE Canoinhas
- **Conteúdo Principal**: Apresentação da pesquisa educacional
- **Cards Informativos**: Para Estudantes, Ensino Superior, Orientação
- **Informações Importantes**: Lista de instruções para o usuário
- **Call-to-Action**: Botão "Iniciar Pesquisa"
- **Footer**: Informações institucionais

#### Seção 2: Formulário (`#form-page`)
- **Cabeçalho**: Título do formulário e botão voltar
- **Dados Pessoais**: Nome, e-mail, telefone, idade, gênero
- **Dados Acadêmicos**: Escola, cidade, ano escolar, turno
- **Interesse em Ensino Superior**: Perguntas condicionais
- **Orientação Profissional**: Seção de apoio e orientação
- **Botão de Envio**: Submissão do formulário

### `css/style.css` - Estilos CSS

O arquivo CSS está organizado em seções lógicas para facilitar a manutenção:

#### Variáveis CSS (Custom Properties)
```css
:root {
    --primary-blue: #2E5BBA;
    --primary-green: #28A745;
    --secondary-blue: #1E3A8A;
    --light-blue: #E3F2FD;
    --white: #FFFFFF;
    --gray-light: #F8F9FA;
    --gray-medium: #6C757D;
    --gray-dark: #343A40;
    --border-radius: 8px;
    --box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    --transition: all 0.3s ease;
}
```

#### Seções de Estilo
1. **Reset e Base**: Normalização e estilos base
2. **Layout Principal**: Grid e flexbox para estrutura
3. **Componentes**: Botões, cards, formulários
4. **Responsividade**: Media queries para diferentes dispositivos
5. **Animações**: Transições e efeitos visuais

### `js/script.js` - Lógica Principal

Este arquivo contém toda a lógica de funcionamento da aplicação:

#### Principais Funcionalidades
1. **Navegação entre Páginas**
   ```javascript
   function showPage(pageToShow) {
       homePage.classList.remove("active");
       formPage.classList.remove("active");
       pageToShow.classList.add("active");
   }
   ```

2. **Campos Condicionais**
   - Gênero "Outro" → Campo de texto adicional
   - Escola "Outra Escola" → Campo de texto adicional
   - Cidade "Outra Cidade" → Campo de texto adicional
   - Interesse "Sim" → Perguntas sobre curso e instituição
   - Interesse "Não" → Perguntas sobre motivos e planos

3. **Validação de Formulário**
   - Campos obrigatórios
   - Formato de e-mail
   - Tratamento de erros
   - Feedback visual para o usuário

4. **Envio de Dados**
   - Coleta de dados do formulário
   - Integração com Google Sheets
   - Estados de loading
   - Mensagens de sucesso/erro

### `js/googleSheets.js` - Integração Google Sheets

Classe especializada para comunicação com Google Sheets:

#### Métodos Principais
- `setScriptUrl(url)`: Configura a URL do Google Apps Script
- `submitForm(formData)`: Envia dados para a planilha
- `validateFormData(formData)`: Valida dados antes do envio
- `prepareDataForSubmission(formData)`: Formata dados para envio
- `testConnection()`: Testa a conexão com Google Sheets

---

## 🎨 Guia de Personalização Visual

### Alterando Cores da Identidade Visual

Para modificar as cores da aplicação, edite as variáveis CSS no arquivo `css/style.css`:

```css
:root {
    /* Cores Primárias - Modifique aqui */
    --primary-blue: #2E5BBA;      /* Azul principal */
    --primary-green: #28A745;     /* Verde principal */
    --secondary-blue: #1E3A8A;    /* Azul secundário */
    
    /* Cores de Apoio */
    --light-blue: #E3F2FD;        /* Azul claro para fundos */
    --white: #FFFFFF;             /* Branco */
    --gray-light: #F8F9FA;        /* Cinza claro */
    --gray-medium: #6C757D;       /* Cinza médio */
    --gray-dark: #343A40;         /* Cinza escuro */
}
```

### Substituindo o Logo

1. Substitua o arquivo `img/logo.jpg` pelo logo oficial do CRE Canoinhas
2. Mantenha as dimensões recomendadas: 120x120 pixels
3. Formatos aceitos: JPG, PNG, SVG

### Modificando Textos e Labels

Todos os textos estão no arquivo `index.html` e podem ser facilmente modificados:

```html
<!-- Exemplo: Alterando o título principal -->
<h1>CRE Canoinhas</h1>
<p>Coordenadoria Regional de Educação</p>
<p>Pesquisa Educacional - Ensino Superior</p>
```

### Ajustando Layout Responsivo

O layout utiliza CSS Grid e Flexbox. Para modificar breakpoints:

```css
/* Tablet */
@media (max-width: 768px) {
    /* Estilos para tablet */
}

/* Mobile */
@media (max-width: 480px) {
    /* Estilos para mobile */
}
```

---


## 🔗 Integração com Google Sheets

### Passo 1: Criar a Planilha Google

1. **Acesse o Google Sheets**
   - Vá para [sheets.google.com](https://sheets.google.com)
   - Clique em "Criar nova planilha"

2. **Configure os Cabeçalhos**
   Na primeira linha (linha 1), adicione os seguintes cabeçalhos nas colunas correspondentes:

   | A | B | C | D | E | F | G | H | I | J |
   |---|---|---|---|---|---|---|---|---|---|
   | Data | Nome | Email | Telefone | Idade | Genero | GeneroOutro | Escola | EscolaOutra | Cidade |

   | K | L | M | N | O | P | Q | R | S | T |
   |---|---|---|---|---|---|---|---|---|---|
   | CidadeOutra | AnoEscolar | Turno | InteresseEnsinoSuperior | CursoInteresse | InstituicaoPreferencia | MotivoNao | PlanosFuturos | OrientacaoProfissional | TipoApoio |

   | U |
   |---|
   | Comentarios |

3. **Salve a Planilha**
   - Dê um nome descritivo: "CRE Canoinhas - Pesquisa Educacional"
   - Anote o ID da planilha (encontrado na URL)

### Passo 2: Criar o Google Apps Script

1. **Abrir o Editor de Script**
   - Na planilha, clique em "Extensões" → "Apps Script"
   - Isso abrirá o editor do Google Apps Script

2. **Substituir o Código**
   Apague o código padrão e cole o seguinte:

   ```javascript
   // Configurações
   const sheetName = 'Planilha1'; // Nome da aba da planilha
   const scriptProp = PropertiesService.getScriptProperties();

   // Função de configuração inicial (executar uma vez)
   function initialSetup() {
     const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
     scriptProp.setProperty('key', activeSpreadsheet.getId());
   }

   // Função principal que recebe os dados do formulário
   function doPost(e) {
     const lock = LockService.getScriptLock();
     lock.tryLock(10000);

     try {
       const doc = SpreadsheetApp.openById(scriptProp.getProperty('key'));
       const sheet = doc.getSheetByName(sheetName);

       const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
       const nextRow = sheet.getLastRow() + 1;

       const newRow = headers.map(function(header) {
         return header === 'Data' ? new Date() : e.parameter[header];
       });

       sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);

       return ContentService
         .createTextOutput(JSON.stringify({ 'result': 'success', 'row': nextRow }))
         .setMimeType(ContentService.MimeType.JSON);
     }
     catch (e) {
       return ContentService
         .createTextOutput(JSON.stringify({ 'result': 'error', 'error': e }))
         .setMimeType(ContentService.MimeType.JSON);
     }
     finally {
       lock.releaseLock();
     }
   }
   ```

3. **Salvar o Projeto**
   - Clique em "Salvar" (Ctrl+S)
   - Dê um nome ao projeto: "CRE Canoinhas Form Handler"

### Passo 3: Executar a Configuração Inicial

1. **Executar initialSetup**
   - No editor, selecione a função `initialSetup`
   - Clique em "Executar" (▶️)
   - Autorize as permissões quando solicitado

2. **Autorizar Permissões**
   - Clique em "Revisar permissões"
   - Selecione sua conta Google
   - Clique em "Avançado" → "Ir para [nome do projeto] (não seguro)"
   - Clique em "Permitir"

### Passo 4: Publicar como Aplicativo Web

1. **Criar Nova Implantação**
   - Clique em "Implantar" → "Nova implantação"
   - Clique no ícone de engrenagem e selecione "Aplicativo da web"

2. **Configurar a Implantação**
   - **Descrição**: "CRE Canoinhas Form Handler"
   - **Executar como**: "Eu"
   - **Quem tem acesso**: "Qualquer pessoa"
   - Clique em "Implantar"

3. **Copiar a URL**
   - Copie a "URL do aplicativo da web"
   - Esta URL será usada na aplicação JavaScript

### Passo 5: Configurar a Aplicação

1. **Editar o arquivo JavaScript**
   Abra o arquivo `js/script.js` e localize a linha:
   ```javascript
   // googleSheetsService.setScriptUrl('https://script.google.com/macros/s/SEU_SCRIPT_ID/exec');
   ```

2. **Descomentar e Configurar**
   Remova o `//` e substitua pela URL real:
   ```javascript
   googleSheetsService.setScriptUrl('https://script.google.com/macros/s/SUA_URL_AQUI/exec');
   ```

### Passo 6: Testar a Integração

1. **Teste Local**
   - Abra a aplicação no navegador
   - Preencha o formulário com dados de teste
   - Envie o formulário

2. **Verificar na Planilha**
   - Acesse a planilha Google
   - Verifique se os dados foram inseridos corretamente
   - A coluna "Data" deve ser preenchida automaticamente

### Solução de Problemas Comuns

#### Erro: "Script function not found"
- Verifique se a função `doPost` está correta no Apps Script
- Certifique-se de que o projeto foi salvo

#### Erro: "Permission denied"
- Execute novamente a função `initialSetup`
- Verifique as permissões do Apps Script

#### Dados não aparecem na planilha
- Verifique se os cabeçalhos estão exatamente como especificado
- Confirme se a URL do script está correta no JavaScript

#### Erro de CORS
- Certifique-se de que a implantação está configurada como "Qualquer pessoa"
- Verifique se a URL está acessível publicamente

---


## 🔧 Guia de Manutenção e Desenvolvimento

### Adicionando Novos Campos ao Formulário

#### Passo 1: Modificar o HTML
1. **Localizar a seção apropriada** no `index.html`
2. **Adicionar o novo campo** seguindo o padrão existente:

```html
<!-- Exemplo: Adicionando campo "Curso Atual" -->
<div class="form-group">
    <label for="curso-atual">Curso Atual *</label>
    <input type="text" id="curso-atual" name="cursoAtual" placeholder="Digite seu curso atual" required>
</div>
```

#### Passo 2: Atualizar o CSS (se necessário)
Se o novo campo precisar de estilos específicos, adicione no `css/style.css`:

```css
/* Estilos específicos para o novo campo */
#curso-atual {
    /* Estilos personalizados */
}
```

#### Passo 3: Modificar o JavaScript
1. **Atualizar validações** no `js/googleSheets.js`:
```javascript
validateFormData(formData) {
    const requiredFields = [
        'nome', 'email', 'idade', 'genero', 'escola', 
        'cidade', 'anoEscolar', 'turno', 'interesseEnsinoSuperior', 
        'orientacaoProfissional', 'cursoAtual' // Novo campo
    ];
    // ... resto da validação
}
```

2. **Atualizar preparação de dados**:
```javascript
prepareDataForSubmission(formData) {
    const prepared = {
        // ... campos existentes
        CursoAtual: formData.cursoAtual || '', // Novo campo
    };
    // ... resto da função
}
```

#### Passo 4: Atualizar a Planilha Google
1. Adicionar nova coluna na planilha com o cabeçalho `CursoAtual`
2. Atualizar o Google Apps Script se necessário

### Modificando Validações

#### Validações de Formato
Para adicionar novas validações, edite o método `validateFormData` em `js/googleSheets.js`:

```javascript
validateFormData(formData) {
    // ... validações existentes
    
    // Exemplo: Validação de CPF
    if (formData.cpf && !this.isValidCPF(formData.cpf)) {
        throw new Error('CPF inválido');
    }
    
    // Exemplo: Validação de telefone
    if (formData.telefone && !this.isValidPhone(formData.telefone)) {
        throw new Error('Formato de telefone inválido');
    }
}

// Métodos auxiliares de validação
isValidCPF(cpf) {
    // Implementar validação de CPF
    return /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf);
}

isValidPhone(phone) {
    // Implementar validação de telefone
    return /^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(phone);
}
```

### Adicionando Novas Páginas

#### Estrutura HTML
Para adicionar uma nova página, siga o padrão SPA:

```html
<!-- Nova página no index.html -->
<div id="nova-pagina" class="page">
    <div class="container">
        <h2>Título da Nova Página</h2>
        <!-- Conteúdo da página -->
        <button onclick="showPage(homePage)">Voltar</button>
    </div>
</div>
```

#### JavaScript para Navegação
Adicione a nova página no `js/script.js`:

```javascript
// Adicionar referência à nova página
const novaPagina = document.getElementById("nova-pagina");

// Atualizar função showPage
function showPage(pageToShow) {
    homePage.classList.remove("active");
    formPage.classList.remove("active");
    novaPagina.classList.remove("active"); // Nova linha
    pageToShow.classList.add("active");
}

// Adicionar botão de navegação
document.getElementById("btn-nova-pagina").addEventListener("click", () => {
    showPage(novaPagina);
});
```

### Otimização de Performance

#### Minificação de Arquivos
Para produção, considere minificar os arquivos CSS e JavaScript:

```bash
# Usando ferramentas online ou CLI
# CSS
csso css/style.css --output css/style.min.css

# JavaScript
uglifyjs js/script.js --output js/script.min.js
uglifyjs js/googleSheets.js --output js/googleSheets.min.js
```

#### Compressão de Imagens
Otimize as imagens para web:

```bash
# Usando ImageMagick
convert img/logo.jpg -quality 85 -resize 120x120 img/logo-optimized.jpg
```

#### Cache do Navegador
Configure headers de cache no servidor web:

```apache
# Apache .htaccess
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType image/png "access plus 1 month"
    ExpiresByType image/jpg "access plus 1 month"
</IfModule>
```

### Debugging e Logs

#### Console do Navegador
Para debugar problemas, use o console do navegador:

```javascript
// Adicionar logs temporários
console.log('Dados do formulário:', formData);
console.error('Erro ao enviar:', error);

// Verificar elementos DOM
console.log('Elemento encontrado:', document.getElementById('campo-id'));
```

#### Logs do Google Apps Script
No Google Apps Script, adicione logs para debugging:

```javascript
function doPost(e) {
    console.log('Dados recebidos:', e.parameter);
    
    try {
        // ... código principal
        console.log('Dados inseridos na linha:', nextRow);
    } catch (error) {
        console.error('Erro no script:', error);
    }
}
```

### Backup e Versionamento

#### Backup dos Arquivos
Mantenha backups regulares:

```bash
# Criar backup com timestamp
tar -czf backup-cre-$(date +%Y%m%d-%H%M%S).tar.gz cre-canoinhas-app-html-css-js/
```

#### Controle de Versão
Use Git para versionamento:

```bash
# Inicializar repositório
git init
git add .
git commit -m "Versão inicial da aplicação CRE Canoinhas"

# Para atualizações
git add .
git commit -m "Descrição das mudanças"
```

#### Backup da Planilha Google
1. Acesse a planilha no Google Sheets
2. Clique em "Arquivo" → "Fazer download" → "Microsoft Excel (.xlsx)"
3. Mantenha backups regulares dos dados

---


## 🔒 Segurança e Privacidade

### Proteção de Dados

#### Validação Client-Side
A aplicação implementa validações no frontend para:
- Formato de e-mail válido
- Campos obrigatórios preenchidos
- Tipos de dados corretos (idade numérica)

#### Sanitização de Dados
O Google Apps Script automaticamente sanitiza os dados recebidos, mas é recomendado:

```javascript
// Exemplo de sanitização adicional no Apps Script
function sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
}
```

#### HTTPS
**Importante**: Sempre use HTTPS em produção para proteger os dados em trânsito:
- Configure certificado SSL no servidor
- Force redirecionamento HTTP → HTTPS
- Use URLs HTTPS para o Google Apps Script

#### Privacidade dos Dados
- Os dados são armazenados no Google Sheets da conta institucional
- Acesso restrito aos administradores autorizados
- Não há cookies ou tracking de terceiros
- Dados pessoais tratados conforme LGPD

### Configurações de Segurança Recomendadas

#### Google Apps Script
```javascript
// Adicionar verificação de origem (opcional)
function doPost(e) {
    const allowedOrigins = [
        'https://cre-canoinhas.edu.br',
        'https://www.cre-canoinhas.edu.br'
    ];
    
    const origin = e.parameter.origin;
    if (allowedOrigins.includes(origin)) {
        // Processar dados
    } else {
        return ContentService.createTextOutput('Acesso negado');
    }
}
```

#### Servidor Web
```apache
# Apache - Adicionar ao .htaccess
Header always set X-Frame-Options DENY
Header always set X-Content-Type-Options nosniff
Header always set X-XSS-Protection "1; mode=block"
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
```

---

## 🚀 Deploy e Hospedagem

### Opções de Hospedagem

#### 1. Servidor Web Tradicional (Apache/Nginx)
```bash
# Copiar arquivos para o servidor
scp -r cre-canoinhas-app-html-css-js/ user@servidor:/var/www/html/

# Configurar permissões
chmod -R 644 /var/www/html/cre-canoinhas-app-html-css-js/
chmod 755 /var/www/html/cre-canoinhas-app-html-css-js/
```

#### 2. GitHub Pages (Gratuito)
```bash
# Criar repositório no GitHub
git init
git add .
git commit -m "Deploy inicial"
git branch -M main
git remote add origin https://github.com/usuario/cre-canoinhas.git
git push -u origin main

# Ativar GitHub Pages nas configurações do repositório
```

#### 3. Netlify (Gratuito)
1. Acesse [netlify.com](https://netlify.com)
2. Arraste a pasta do projeto para o deploy
3. Configure domínio personalizado se necessário

#### 4. Vercel (Gratuito)
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
cd cre-canoinhas-app-html-css-js
vercel
```

### Configuração de Domínio

#### DNS
Configure os registros DNS para apontar para o servidor:

```
Tipo: A
Nome: cre-canoinhas (ou @)
Valor: IP_DO_SERVIDOR

Tipo: CNAME
Nome: www
Valor: cre-canoinhas.edu.br
```

#### SSL/TLS
Configure certificado SSL gratuito:

```bash
# Let's Encrypt com Certbot
sudo certbot --apache -d cre-canoinhas.edu.br -d www.cre-canoinhas.edu.br
```

### Monitoramento

#### Google Analytics (Opcional)
Para acompanhar o uso da aplicação:

```html
<!-- Adicionar antes do </head> no index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

#### Logs do Servidor
Configure logs para monitorar acessos e erros:

```apache
# Apache
CustomLog /var/log/apache2/cre-canoinhas-access.log combined
ErrorLog /var/log/apache2/cre-canoinhas-error.log
```

---

## ❓ FAQ - Perguntas Frequentes

### Problemas Técnicos

**Q: A página não carrega ou aparece em branco**
A: Verifique:
- Console do navegador para erros JavaScript
- Se todos os arquivos estão no servidor
- Se o servidor web está funcionando
- Se não há erros de sintaxe no código

**Q: O formulário não envia os dados**
A: Verifique:
- Se a URL do Google Apps Script está configurada
- Se o script está publicado como "Qualquer pessoa"
- Se não há erros no console do navegador
- Se a conexão com internet está funcionando

**Q: Os dados não aparecem na planilha**
A: Verifique:
- Se os cabeçalhos da planilha estão corretos
- Se a função `initialSetup` foi executada
- Se há erros no log do Google Apps Script
- Se as permissões estão configuradas corretamente

### Personalização

**Q: Como alterar as cores da aplicação?**
A: Edite as variáveis CSS no início do arquivo `css/style.css`:
```css
:root {
    --primary-blue: #SUA_COR_AZUL;
    --primary-green: #SUA_COR_VERDE;
}
```

**Q: Como adicionar novos campos?**
A: Siga os passos na seção "Adicionando Novos Campos ao Formulário" desta documentação.

**Q: Como mudar o logo?**
A: Substitua o arquivo `img/logo.jpg` mantendo o mesmo nome e formato.

### Manutenção

**Q: Como fazer backup dos dados?**
A: 
- Planilha: Google Sheets → Arquivo → Fazer download
- Aplicação: Copie todos os arquivos do servidor
- Use controle de versão (Git) para o código

**Q: Como atualizar a aplicação?**
A: 
1. Faça backup dos arquivos atuais
2. Substitua os arquivos no servidor
3. Teste todas as funcionalidades
4. Verifique se a integração com Google Sheets continua funcionando

**Q: A aplicação funciona offline?**
A: Não, a aplicação precisa de internet para:
- Carregar fontes do Google Fonts
- Enviar dados para o Google Sheets
- Validações que dependem de conexão

### Suporte

**Q: Onde encontrar ajuda adicional?**
A: 
- Documentação do Google Apps Script: [developers.google.com/apps-script](https://developers.google.com/apps-script)
- MDN Web Docs: [developer.mozilla.org](https://developer.mozilla.org)
- Stack Overflow para problemas específicos

**Q: Como reportar bugs ou sugerir melhorias?**
A: Entre em contato com a equipe de desenvolvimento responsável pela manutenção da aplicação.

---

## 📞 Contato e Suporte

### Equipe de Desenvolvimento
- **Desenvolvedor Principal**: [Nome do desenvolvedor]
- **E-mail de Suporte**: [email@cre-canoinhas.edu.br]
- **Telefone**: [Telefone de contato]

### Documentação Técnica
- **Versão da Documentação**: 1.0
- **Data de Criação**: Setembro 2025
- **Última Atualização**: Setembro 2025

### Recursos Adicionais
- **Repositório de Código**: [URL do repositório se aplicável]
- **Manual do Usuário**: [Link para manual do usuário]
- **Vídeos Tutoriais**: [Links para tutoriais em vídeo]

---

## 📝 Changelog

### Versão 1.0 (Setembro 2025)
- ✅ Implementação inicial da aplicação
- ✅ Design responsivo com identidade visual do CRE
- ✅ Formulário completo com validações
- ✅ Integração com Google Sheets
- ✅ Documentação completa para a equipe

### Próximas Versões (Planejadas)
- 🔄 Implementação de relatórios automáticos
- 🔄 Dashboard de visualização de dados
- 🔄 Notificações por e-mail
- 🔄 Exportação de dados em diferentes formatos

---

**© 2025 CRE Canoinhas - Coordenadoria Regional de Educação**

*Esta documentação foi criada para facilitar a manutenção e evolução da aplicação pela equipe de desenvolvimento. Mantenha-a sempre atualizada conforme as modificações realizadas no sistema.*

