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
- Seletor de idioma com bandeiras no canto superior direito da tela, permitindo alternar entre portugues, ingles e espanhol.
- Preferencia de idioma salva no navegador por `localStorage` e reaplicada automaticamente ao reabrir o sistema.
- Traducao local aplicada aos textos fixos da interface e aos principais blocos gerados na analise, incluindo risco, tipicidades, validacao, plano operacional e PDF.
- Logo otimizada em `assets/nm-logo.png`.
- Servidor Node em `server.js`.
- API local `POST /api/historico-equipes`.
- Simulacao de historico de equipes com scores locais.
- Preparacao para Google Custom Search via `GOOGLE_API_KEY` e `GOOGLE_CSE_ID`.
- Calculo de risco por regressao logistica.
- Modelo especifico Ba-Vi calibrado com base historica real `outputs/data/NM-BAxVI.xlsx`, aplicavel somente a Bahia x Vitoria/Vitoria x Bahia em Arena Fonte Nova/Fonte Nova ou Barradao.
- Nova base historica geral do Bahia integrada em `outputs/data/BASE-DADOS-NM.xlsx` e `outputs/data/BASE-DADOS-NM.xls`, contendo 324 jogos ate abril de 2024.
- Modelo Bahia geral calibrado criado a partir do recorte nao Ba-Vi da base-mãe: 283 jogos, 52 riscos altos, aplicavel a jogos do Bahia em Salvador sem recorte especifico do classico.
- Regra de prioridade metodologica: Bahia x Vitoria usa o modelo Ba-Vi; demais jogos do Bahia em Arena/Fonte Nova, Pituacu ou Barradao usam modelo Bahia geral; outros jogos usam modelo geral.
- Protecao contra falso positivo: Vitoria da Conquista nao aciona o modelo Ba-Vi.
- Modelo geral preservado para todos os demais jogos sem base historica especifica.
- Resultado visual com medidor de risco, barras por variavel e top 3 fatores de maior contribuicao.
- Painel "Probabilidade por tipicidade de incidente" incluido logo abaixo do risco geral, exibindo percentuais estimados e destacando prioridades de atencao da seguranca.
- Tipicidades avaliadas: invasao de campo, arremesso de objetos, uso de sinalizadores, ingresso de objetos perfurocortantes, briga de torcidas no entorno, briga de torcida na area interna e danos a estrutura do estadio.
- As probabilidades por tipicidade sao modulo complementar ao risco geral: usam variaveis pre-jogo, historico disponivel e evidencias da busca assistida, sem substituir a regressao logistica principal.
- Busca assistida agora gera evidencia externa por tipicidade, exibida em cada linha do painel de incidentes como "Ext. X%", sem criar um indice unico que infle todas as ocorrencias.
- A evidencia externa e aplicada apenas ao tipo de incidente compatível com as fontes retornadas: briga no entorno, arremesso de objetos, sinalizadores, objetos perfurocortantes, briga interna, danos estruturais ou invasao de campo.
- Classificacao da evidencia externa revisada para exigir contexto nas categorias com maior risco de sobreposicao, como briga no entorno, briga interna, arremesso de objetos e dano estrutural.
- Quando Google Custom Search nao estiver conectado ou nao houver fontes relevantes para aquela tipicidade, o indice externo da categoria fica em 0% e o sistema informa isso no resultado.
- Plano operacional passou a incorporar as tipicidades prioritarias nos pontos criticos e nas acoes obrigatorias.
- Resumo de acoes recomendadas para mitigacao gerado apos a analise, organizado por fase do espetaculo esportivo.
- Plano operacional recomendado incluido no resultado e no PDF, com decisao operacional, nivel de resposta, efetivo recomendado, pontos criticos e acoes obrigatorias.
- Historico local de analises anteriores incluido na interface, com armazenamento no navegador, reabertura de analises e limpeza do historico.
- Fases contempladas: montagem, pre-entrada, entrada, jogo, evacuacao e fechamento.
- Cenario ajustado apos mitigacao, mantendo fatores nao controlaveis e simulando reducao de risco em variaveis acionaveis.
- Indicacao de fatores de baixa pressao, como rivalidade zerada, conflito zerado ou cobertura de seguranca adequada.
- Botao para baixar PDF da analise gerado no dispositivo do usuario, sem armazenamento no servidor.
- Relatorio PDF com layout institucional da NM Engenharia e Consultoria, titulo "Analise de Risco" e referencia do jogo preenchida a partir da aba/campo "Equipes envolvidas".
- Campo "Data" incluido no formulario logo abaixo de "Local do evento" e exibido no cabecalho do PDF abaixo da referencia do jogo.
- Meteorologia automatica incluida: API `/api/previsao-tempo` consulta Open-Meteo por local/data, classifica em favoravel/instavel/chuva/severa e preenche o campo "Meteorologia prevista".
- Locais reconhecidos para meteorologia: Arena Fonte Nova/Fonte Nova, Barradao/Manoel Barradas, Pituacu e fallback Salvador-BA.
- Meteorologia corrigida com fallback automatico: se a data estiver fora da janela do Open-Meteo ou a consulta externa falhar, o sistema retorna estimativa climatica local de Salvador por mes, identificada como `estimativa-local`.
- Estimativa automatica de publico incluida: usa equipes, local, capacidade do estadio, historico/rivalidade, campeonato, dia da semana, tabela e meteorologia para sugerir publico estimado.
- Campo "Capacidade maxima declarada" incluido abaixo de "Local do evento", preenchido automaticamente pelo nome do estadio.
- API `POST /api/capacidade-local` incluida: usa base local para estadios conhecidos e busca assistida/Google Custom Search quando configurado para apoiar capacidade maxima declarada e media historica operacional estimada.
- Estimativa de publico passou a usar capacidade maxima declarada e media historica operacional estimada do local como base, recebendo ajustes por equipes, historico, rivalidade, campeonato, dia, horario, clima, tabela, alcool e torcida unica.
- Efetivo de seguranca privada automatizado pela referencia 1/100: calcula minimo recomendado, deficit ou sobra operacional e alimenta a analise final.
- Campo "Dia de semana" preenchido automaticamente a partir da data do jogo.
- Novas variaveis pre-jogo incluidas no formulario e na regressao com pesos conservadores: horario da partida, mandante, venda/liberacao de alcool, JECRIM, torcida unica e protocolo de policiamento.
- Variavel pre-jogo "Historico de objetos proibidos da torcida (0 a 1)" incluida no formulario e na regressao, mantendo o mesmo padrao matematico das demais variaveis.
- Variavel pre-jogo "Relacao entre torcidas" incluida com opcoes nao informada, neutra, aliada, rivalidade/inimizade e inimizade historica com registros.
- A relacao entre torcidas entra na regressao com coeficientes moderados: modelo geral 0.28, Bahia geral 0.22 e Ba-Vi 0.18, para evitar dupla contagem em jogos que ja possuem rivalidade/historico forte.
- A relacao entre torcidas tambem ajusta tipicidades relacionais, principalmente briga no entorno e briga interna, e reforca arremesso apenas de forma pequena quando ha inimizade historica.
- Painel "Padrao matematico das variaveis pre-jogo" incluido no resultado, exibindo valor normalizado, coeficiente e contribuicao de cada variavel no logit.
- As novas variaveis aparecem nos detalhes da analise, no grafico de contribuicao e nas validacoes operacionais, mantendo ocorrencias reais apenas na secao Pos-evento.
- Validacao operacional automatica incluida: gera alertas criticos/atencao/OK para deficit de efetivo, rivalidade elevada, jogo decisivo, meteorologia adversa, grande publico com deficit, conflito torcida x clube e sinais criticos nas observacoes.
- Painel "Validacao operacional automatica" exibido no resultado e incorporado ao PDF antes do plano operacional.
- Aba/secao "Pos-evento" incluida para registrar publico real, segurancas reais, incidentes, atendimentos medicos, atrasos de entrada, tempo de evacuacao, ocorrencia grave e observacoes.
- Comparacao previsto x realizado incluida: calcula risco observado, diferenca para o risco previsto, compara publico/seguranca planejados x reais e gera aprendizados para calibracao futura.
- Captura do PDF ajustada para renderizar o relatorio em area temporaria visivel, aguardar imagens/fontes e evitar pagina em branco.
- Layout do PDF alinhado para proporcao A4, com largura fixa de captura, margens internas reduzidas e blocos de analise redimensionados para melhor encaixe na pagina.
- Exportacao PDF refinada para computador: captura realizada manualmente com `html2canvas` e montagem do PDF com `jsPDF`, evitando o clone automatico do `html2pdf` que podia gerar paginas em branco.
- Layout institucional do PDF reaplicado conforme documento de referencia: barra azul lateral, canto superior azul, logo em destaque, titulo "Analise de Risco", linha laranja, jogo em italico, local/data em texto discreto, conteudo fluido e rodape alinhado.
- Ajuste fino de simetria do PDF: margens A4 refinadas, cabecalho proporcional, area de conteudo alinhada, medidor/barras com colunas estaveis e rodape com espacamento regular.
- Rodape do PDF corrigido com linha laranja fixa, blocos laterais alinhados e bloco institucional central padronizado no fim de cada pagina A4.
- Rodape do PDF mantido somente na ultima pagina do documento para liberar espaco nas paginas anteriores.
- Conteudo das paginas do PDF limitado a area util acima do rodape; detalhes tecnicos movidos para pagina propria para evitar sobreposicao com rodape.
- Paginacao do PDF reconfigurada com paginas A4 reais: pagina 1 encerra no grafico/fatores; pagina 2 inicia plano operacional e primeiras fases; pagina 3 concentra fases restantes, cenario ajustado e detalhes, evitando cortes de texto.
- Geracao de PDF sem fallback por impressao do navegador, para evitar arquivos sem template, cabecalho/rodape do navegador e URL da pagina.
- Submit da analise tratado de forma defensiva para garantir que os fatores sejam coletados sempre a partir do formulario `riskForm`.
- Todas as variaveis do formulario de analise impactam a regressao:
  - equipes envolvidas: gera `historicoEquipesScore`;
  - local do evento: gera `complexidadeLocal`;
  - publico estimado: gera `publico`;
  - rivalidade entre equipes: gera `rivalidadeEquipes`;
  - relacao entre torcidas: gera `relacaoTorcidas`;
  - posicao de tabela: gera `posicaoTabela`;
  - tipo de campeonato: gera `tipoCampeonato`;
  - dia de semana: gera `diaSemana`;
  - meteorologia: gera `meteorologia`;
  - conflitos torcida x clube: gera `conflitoTorcidaClube`;
  - historico de objetos proibidos da torcida: gera `historicoObjetosProibidos`;
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
