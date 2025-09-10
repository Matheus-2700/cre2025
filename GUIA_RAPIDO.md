# 🚀 Guia Rápido - CRE Canoinhas

## ⚡ Início Rápido

### 1. Configuração Básica (5 minutos)
```bash
# 1. Extrair arquivos
unzip cre-canoinhas-app-html-css-js.zip

# 2. Servir localmente
cd cre-canoinhas-app-html-css-js
python -m http.server 8000

# 3. Acessar no navegador
# http://localhost:8000
```

### 2. Configurar Google Sheets (15 minutos)
1. **Criar planilha** com cabeçalhos específicos
2. **Apps Script** → Colar código fornecido
3. **Executar** `initialSetup`
4. **Publicar** como aplicativo web
5. **Copiar URL** e configurar no `js/script.js`

### 3. Deploy em Produção (10 minutos)
```bash
# Upload para servidor
scp -r * user@servidor:/var/www/html/cre-canoinhas/

# Ou usar GitHub Pages / Netlify / Vercel
```

## 🔧 Modificações Comuns

### Alterar Cores
```css
/* css/style.css - linha ~15 */
:root {
    --primary-blue: #SUA_COR;
    --primary-green: #SUA_COR;
}
```

### Adicionar Campo
```html
<!-- index.html -->
<div class="form-group">
    <label for="novo-campo">Novo Campo *</label>
    <input type="text" id="novo-campo" name="novoCampo" required>
</div>
```

```javascript
// js/googleSheets.js - adicionar em prepareDataForSubmission
NovoCampo: formData.novoCampo || '',
```

### Trocar Logo
```bash
# Substituir arquivo mantendo o nome
cp novo-logo.jpg img/logo.jpg
```

## 🐛 Solução Rápida de Problemas

| Problema | Solução |
|----------|---------|
| Página em branco | Verificar console do navegador |
| Formulário não envia | Verificar URL do Google Apps Script |
| Dados não aparecem | Verificar cabeçalhos da planilha |
| Erro de permissão | Executar `initialSetup` novamente |

## 📁 Estrutura de Arquivos

```
cre-canoinhas-app-html-css-js/
├── index.html              # Página principal
├── css/style.css           # Estilos
├── js/script.js            # Lógica principal
├── js/googleSheets.js      # Integração Google Sheets
├── img/logo.jpg            # Logo
├── DOCUMENTACAO_COMPLETA.md # Documentação detalhada
└── GUIA_RAPIDO.md          # Este arquivo
```

## 🔗 Links Importantes

- **Google Sheets**: [sheets.google.com](https://sheets.google.com)
- **Apps Script**: [script.google.com](https://script.google.com)
- **Documentação Completa**: `DOCUMENTACAO_COMPLETA.md`

## 📞 Suporte

- **Documentação Completa**: Consulte `DOCUMENTACAO_COMPLETA.md`
- **Problemas Técnicos**: Verificar console do navegador
- **Dúvidas**: Consultar seção FAQ da documentação completa

