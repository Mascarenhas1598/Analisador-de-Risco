# Ancora do Projeto

Estado ancorado como versao atual do **Analisador de Risco - NM Engenharia e Consultoria**.

## Marco salvo

- Interface com identidade visual da NM Engenharia e Consultoria.
- Login sem credenciais expostas na tela ou no HTML.
- Credenciais configuradas por variaveis de ambiente `APP_USERNAME` e `APP_PASSWORD`.
- API local para historico de equipes.
- Preparacao para Google Custom Search por `GOOGLE_API_KEY` e `GOOGLE_CSE_ID`.
- Calculo de risco por regressao logistica.
- Modelo Ba-Vi calibrado com base historica real, restrito a Bahia x Vitoria/Vitoria x Bahia em Arena Fonte Nova/Fonte Nova ou Barradao.
- Modelo geral mantido para demais jogos.
- Todas as variaveis do formulario impactam o risco final.
- Regra de seguranca privada 1/100 aplicada.
- Resultado com medidor, barras por variavel e top fatores.
- Plano operacional recomendado no resultado e no PDF.
- Historico local de analises com reabertura e limpeza.
- Cenario ajustado apos mitigacao.
- Acoes recomendadas por fase do espetaculo esportivo.
- Botao para baixar PDF com template institucional.
- PDF em paginas A4 reais: primeira pagina ate grafico/fatores, demais paginas com plano operacional, mitigacao e detalhes.
- Rodape institucional mantido somente na ultima pagina do PDF.
- Deploy preparado para Render/Railway.

## URL local validada

```text
http://localhost:4182/index.html
```

## Pacote do projeto

```text
analisador-de-risco-projeto.zip
```
