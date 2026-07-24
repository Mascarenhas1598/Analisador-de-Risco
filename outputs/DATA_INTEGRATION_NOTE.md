# Nota de Integracao das Bases Historicas

## Bases incluidas

- `outputs/data/NM-BAxVI.xlsx`: recorte especifico Bahia x Vitoria/Vitoria x Bahia, com 41 jogos.
- `outputs/data/BASE-DADOS-NM.xlsx`: base-mae geral do Bahia, com 324 jogos ate abril de 2024.
- `outputs/data/BASE-DADOS-NM.xls`: arquivo original recebido, preservado para auditoria.

## Regra metodologica

O modelo Ba-Vi deve continuar separado e prioritario. Os 41 registros da base Ba-Vi estao contidos integralmente na base-mae, portanto a base geral nao deve substituir o recorte do classico.

Ordem de aplicacao:

1. Bahia x Vitoria ou Vitoria x Bahia em Salvador: `Modelo Ba-Vi calibrado`.
2. Demais jogos do Bahia em Arena/Fonte Nova, Pituacu ou Barradao: `Modelo Bahia geral calibrado`.
3. Outros jogos: `Modelo geral`.

## Cuidados

- `Vitoria da Conquista` nao deve acionar o modelo Ba-Vi.
- Colunas de ocorrencias, como furto, vias de fato, agressao e invasao de gramado, sao dados pos-evento. Elas servem para validacao e recalibracao futura, mas nao devem ser usadas como variaveis preditoras antes do jogo.
- `EFETIVO TOTAL` representa efetivo operacional/policial na base historica e nao deve ser confundido automaticamente com segurancas privados empregados.
- Variaveis pre-jogo aproveitadas no calculo atual: horario da partida, mandante, venda/liberacao de alcool, JECRIM, torcida unica, protocolo de policiamento e historico de objetos proibidos da torcida.
- Essas variaveis entram na regressao com pesos conservadores e auditaveis, para aumentar robustez sem alterar a metodologia de calculo.
- O historico de objetos proibidos deve representar indicio pre-jogo baseado em base historica, busca assistida ou avaliacao operacional documentada. A ocorrencia real do evento segue reservada ao Pos-evento para validacao e calibracao futura.

## Uso recomendado

A base geral deve ser usada para melhorar risco historico de adversarios, publico esperado, validacao pos-evento e calibracao do modelo Bahia geral. O modelo Ba-Vi permanece como recorte especializado para classicos contra o Vitoria.

O modulo de tipicidades deve ser tratado como camada operacional complementar: ele prioriza incidentes provaveis para planejamento de seguranca, mas nao substitui a probabilidade geral da regressao logistica.

A busca assistida/Google Custom Search deve gerar apenas evidencia externa complementar por tipicidade. Essa evidencia aumenta ou nao a probabilidade especifica do incidente compatível com a fonte encontrada, dentro de limite controlado, sem alterar a metodologia principal da regressao logistica do risco geral e sem sobrepor variaveis ja existentes.

Categorias com termos amplos devem exigir contexto operacional para evitar dupla contagem. Exemplo: briga no entorno exige referencia a entorno/rua/arredores; briga interna exige estadio/setor/arquibancada; arremesso exige verbo de arremesso e objeto; dano estrutural exige dano e estrutura/patrimonio.

A variavel `relacaoTorcidas` deve ser tratada como informacao pre-jogo relacional, distinta de rivalidade entre clubes, historico pesquisado e conflito torcida x clube. Ela deve ter peso moderado para melhorar sensibilidade operacional sem produzir falso positivo por dupla contagem.

A estimativa de publico deve priorizar capacidade maxima declarada e media historica operacional estimada do local. A busca assistida pode apoiar a identificacao de capacidade, mas a media historica usada no calculo permanece conservadora e auditavel ate haver base estatistica tratada por estadio.
