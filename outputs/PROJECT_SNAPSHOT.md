# Snapshot do Projeto

Projeto salvo neste ponto como **Analisador de Risco**.

Ultima instancia local validada:

```text
http://localhost:4182/index.html
```

Estado ancorado em `PROJECT_ANCHOR.md`.

## Estado funcional

- Interface web em `index.html`.
- Identidade visual da NM Engenharia e Consultoria aplicada no login e cabecalho do app.
- Logo otimizada em `assets/nm-logo.png`.
- Servidor Node em `server.js`.
- API local `POST /api/historico-equipes`.
- Simulacao de historico de equipes com scores locais.
- Preparacao para Google Custom Search via `GOOGLE_API_KEY` e `GOOGLE_CSE_ID`.
- Calculo de risco por regressao logistica.
- Resultado visual com medidor de risco, barras por variavel e top 3 fatores de maior contribuicao.
- Resumo de acoes recomendadas para mitigacao gerado apos a analise, organizado por fase do espetaculo esportivo.
- Plano operacional recomendado incluido no resultado e no PDF, com decisao operacional, nivel de resposta, efetivo recomendado, pontos criticos e acoes obrigatorias.
- Historico local de analises anteriores incluido na interface, com armazenamento no navegador, reabertura de analises e limpeza do historico.
- Fases contempladas: montagem, pre-entrada, entrada, jogo, evacuacao e fechamento.
- Cenario ajustado apos mitigacao, mantendo fatores nao controlaveis e simulando reducao de risco em variaveis acionaveis.
- Indicacao de fatores de baixa pressao, como rivalidade zerada, conflito zerado ou cobertura de seguranca adequada.
- Botao para baixar PDF da analise gerado no dispositivo do usuario, sem armazenamento no servidor.
- Relatorio PDF com layout institucional da NM Engenharia e Consultoria, titulo "Analise de Risco" e referencia do jogo preenchida a partir da aba/campo "Equipes envolvidas".
- Campo "Data" incluido no formulario logo abaixo de "Local do evento" e exibido no cabecalho do PDF abaixo da referencia do jogo.
- Captura do PDF ajustada para renderizar o relatorio em area temporaria visivel, aguardar imagens/fontes e evitar pagina em branco.
- Layout do PDF alinhado para proporcao A4, com largura fixa de captura, margens internas reduzidas e blocos de analise redimensionados para melhor encaixe na pagina.
- Exportacao PDF refinada para computador: captura realizada manualmente com `html2canvas` e montagem do PDF com `jsPDF`, evitando o clone automatico do `html2pdf` que podia gerar paginas em branco.
- Layout institucional do PDF reaplicado conforme documento de referencia: barra azul lateral, canto superior azul, logo em destaque, titulo "Analise de Risco", linha laranja, jogo em italico, local/data em texto discreto, conteudo fluido e rodape alinhado.
- Ajuste fino de simetria do PDF: margens A4 refinadas, cabecalho proporcional, area de conteudo alinhada, medidor/barras com colunas estaveis e rodape com espacamento regular.
- Paginacao do PDF reconfigurada com paginas A4 reais: pagina 1 encerra no grafico/fatores; pagina 2 inicia plano operacional e primeiras fases; pagina 3 concentra fases restantes, cenario ajustado e detalhes, evitando cortes de texto.
- Geracao de PDF sem fallback por impressao do navegador, para evitar arquivos sem template, cabecalho/rodape do navegador e URL da pagina.
- Submit da analise tratado de forma defensiva para garantir que os fatores sejam coletados sempre a partir do formulario `riskForm`.
- Todas as variaveis do formulario de analise impactam a regressao:
  - equipes envolvidas: gera `historicoEquipesScore`;
  - local do evento: gera `complexidadeLocal`;
  - publico estimado: gera `publico`;
  - rivalidade entre equipes: gera `rivalidadeEquipes`;
  - posicao de tabela: gera `posicaoTabela`;
  - tipo de campeonato: gera `tipoCampeonato`;
  - dia de semana: gera `diaSemana`;
  - meteorologia: gera `meteorologia`;
  - conflitos torcida x clube: gera `conflitoTorcidaClube`;
  - segurancas privados: gera `riscoSeguranca` pela referencia 1 seguranca / 100 torcedores;
  - observacoes: gera `sinaisObservacoes`.
- Login configurado por variaveis de ambiente `APP_USERNAME` e `APP_PASSWORD`, sem exibicao na tela principal e sem credenciais no HTML.
- Deploy preparado para Render/Railway.

## Arquivos principais

- `index.html`: tela do analisador.
- `server.js`: servidor e API.
- `package.json`: scripts Node.
- `render.yaml`: configuracao opcional do Render.
- `Procfile`: compatibilidade com plataformas que usam Procfile.
- `README.md`: instrucoes de execucao, Google Custom Search e deploy.

## Como rodar localmente

```bash
npm start
```

Abra:

```text
http://localhost:4180/index.html
```

## Como rodar com Google Custom Search

```bash
GOOGLE_API_KEY="sua_api_key" GOOGLE_CSE_ID="seu_search_engine_id" npm start
```
