# Correção para deploy no Render

O erro `ENOENT: no such file or directory, open '/opt/render/project/src/package.json'` acontece quando o Render executa `npm install` na raiz do repositório, mas o `package.json` está apenas dentro da pasta `outputs/`.

Esta versão inclui um `package.json` na raiz que aponta para `outputs/server.js`.

## Configuração recomendada no Render

Use:

```text
Build Command: npm install
Start Command: npm start
```

Nao configure Root Directory, ou deixe vazio.

## Variáveis de ambiente obrigatórias

```text
APP_USERNAME=seu_usuario
APP_PASSWORD=sua_senha
```

## Variáveis opcionais para Google Custom Search

```text
GOOGLE_API_KEY=sua_chave_google
GOOGLE_CSE_ID=seu_cse_id
```

Depois de salvar as configurações, clique em **Manual Deploy** > **Clear build cache & deploy**.
