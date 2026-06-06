# Analisador de Risco

## Rodar localmente

Sem Google configurado, o servidor usa a estimativa local:

```bash
npm start
```

Abra:

```text
http://localhost:4180/index.html
```

## Conectar ao Google Custom Search

Crie uma Programmable Search Engine e uma API key no Google Cloud. Depois rode:

```bash
GOOGLE_API_KEY="sua_api_key" GOOGLE_CSE_ID="seu_search_engine_id" npm start
```

O front-end chama:

```text
POST /api/historico-equipes
```

Exemplo de entrada:

```json
{ "equipes": "Bahia x Vitoria" }
```

Exemplo de saída:

```json
{
  "score": 0.78,
  "origem": "google-custom-search",
  "resumo": "Google Custom Search retornou resultados...",
  "links": [
    { "label": "Resultado", "url": "https://..." }
  ]
}
```

As chaves ficam somente no servidor. Nao coloque `GOOGLE_API_KEY` no HTML.

## Configurar login

Defina as credenciais como variaveis de ambiente:

```bash
APP_USERNAME="seu_usuario" APP_PASSWORD="sua_senha" npm start
```

Em nuvem, configure `APP_USERNAME` e `APP_PASSWORD` no painel de variaveis de ambiente. Nao coloque usuario ou senha no `index.html`.

## Publicar no Render

1. Suba esta pasta `outputs` para um repositorio GitHub.
2. No Render, escolha **New** > **Web Service**.
3. Conecte o repositorio.
4. Use as configuracoes:

```text
Runtime: Node
Build Command: npm install
Start Command: npm start
```

5. Em **Environment**, adicione:

```text
GOOGLE_API_KEY=sua_api_key
GOOGLE_CSE_ID=seu_search_engine_id
APP_USERNAME=seu_usuario
APP_PASSWORD=sua_senha
```

6. Clique em **Deploy**.

O Render vai gerar uma URL publica com HTTPS, acessivel pelo iPhone sem depender do Mac ligado.

## Publicar no Railway

1. Suba esta pasta para GitHub.
2. No Railway, crie um novo projeto a partir do repositorio.
3. Configure as variaveis:

```text
GOOGLE_API_KEY=sua_api_key
GOOGLE_CSE_ID=seu_search_engine_id
APP_USERNAME=seu_usuario
APP_PASSWORD=sua_senha
```

4. O Railway detecta `package.json` e roda `npm start`.

## Arquivos importantes

```text
index.html     Interface do analisador
server.js      Servidor Node e API /api/historico-equipes
package.json   Scripts de start/deploy
render.yaml    Configuracao opcional para Render
Procfile       Compatibilidade com plataformas que usam Procfile
```
