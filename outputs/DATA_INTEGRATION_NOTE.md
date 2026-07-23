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

## Uso recomendado

A base geral deve ser usada para melhorar risco historico de adversarios, publico esperado, validacao pos-evento e calibracao do modelo Bahia geral. O modelo Ba-Vi permanece como recorte especializado para classicos contra o Vitoria.
