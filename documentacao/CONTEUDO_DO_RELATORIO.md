# Conteúdo do Relatório de Triagem (PDF)

Este documento é a **especificação** do PDF. Para mudar o que sai no relatório, altere aqui
primeiro e depois o código (`src/relatorio/`).

## Princípios

1. **Redundância de propósito.** O PDF não tem filtro nenhum. Por isso o mesmo processo
   aparece em **todas** as seções a que pertence (ex.: um processo da Fazenda sem MPT que
   está num lote aparece na seção de Fazenda, na de lotes, na da reclamada e na sua ficha).
2. **Legível por IA.** Todo dado está escrito em texto, no formato `Rótulo: valor`. Nada é
   informado só por cor, ícone ou posição na página. Quem quiser pode jogar o PDF numa IA e
   pedir análises.
3. **Navegável.** Sumário clicável na página 2, marcadores na barra lateral do leitor de PDF
   e índice por número de processo com link para a ficha.
4. **Sem dado pessoal desnecessário.** Sem CPF, e-mail, telefone, data de nascimento,
   filiação ou nome de advogado. Em **segredo de justiça**, as partes aparecem como
   `SEGREDO DE JUSTIÇA` em todas as seções.

## Formato

- A4, fonte Helvetica.
- Em todas as páginas: cabeçalho com tribunal, Turma/Cadeira e data/hora de geração; rodapé
  com `pág. X de Y`.
- Nome do arquivo: `relatorio_triagem_<TRIBUNAL>_<OJ>_<AAAA-MM-DD>_<HHhMM>.pdf`.
  - `<OJ>`: "9ª Turma - Cadeira 4" vira `9T-4C`. Se o texto do órgão não seguir esse padrão,
    usa uma versão simplificada do nome; se o lote misturar órgãos, usa `variosOJ`.
  - Hora local do computador, no momento em que o relatório foi gerado.

## Seções (nesta ordem)

### 1. Capa
- Tribunal (ex.: TRT-2), Turma/Cadeira, data e hora de geração.
- Critério: "Caixa Triagem, processos sem responsável".
- Quantos processos estavam na caixa, quantos entraram no relatório, quantos falharam.

### 2. Sumário
Lista das seções com número de página. Cada linha é um link.

### 3. Resumo em números
- Total de processos.
- Conhecimento × Execução.
- Quantidade por classe (ROT, AP, AIRO, ...).
- Fazenda Pública (total) e Fazenda Pública **sem MPT**.
- Com sindicato.
- Processos físicos migrados.
- Em segredo de justiça.
- Número de lotes e de processos em lote.

### 4. Fazenda Pública sem MPT
Processos com ente público (administração direta, autarquia, fundação) em que o Ministério
Público do Trabalho não está cadastrado. Providência: retificar a autuação.
Para cada um: `CNJ`, `Classe`, `Partes`, `Ente público`.

### 5. Processos físicos migrados
Processos cujo número começa com `0` (acervo físico migrado para o PJe) ou com termo de
migração. Servem para verificar **prevenção** depois.
Para cada um: `CNJ`, `Classe`, `Partes`, `Ano do CNJ`.

### 6. Processos com sindicato
Sindicato, federação ou confederação em algum polo.
Para cada um: `CNJ`, `Classe`, `Partes`, `Sindicato` e em qual polo.

### 7. Listagem por reclamada
**Reclamada** = empresa ou ente (qualquer parte que não seja pessoa física nem sindicato) no polo
**ativo ou passivo**: no 2º grau a empresa muitas vezes é a recorrente (133 de 322 processos da
amostra real). Filiais com a mesma raiz de CNPJ contam como a mesma reclamada.
Ordem: quem tem mais processos primeiro, cada uma com **todos** os seus processos
(`Nome`, `CNPJ(s)`, `Quantidade`; por processo: `Nº de ordem`, `CNJ`, `Classe`, `Entrada`,
`Reclamante`). No fim, as reclamadas com **um único processo**, em ordem alfabética, uma por linha.
Processos em segredo de justiça não entram nesta seção (revelaria a empresa).

### 8. Lotes (mesma reclamada + mesmo advogado)
Grupo de 2 ou mais processos com **a mesma reclamada** e **o mesmo cadastro de OAB** de um
advogado **do lado do trabalhador** (o advogado da empresa não conta: juntaria todos os
processos dela). O nome do advogado não aparece, só "mesmo cadastro de OAB". Quando o mesmo
grupo de processos aparece por mais de uma reclamada ou OAB, vira um lote só, com todas as
reclamadas no título. Segredo de justiça fica de fora.
Para cada lote: `Lote nº`, `Reclamada(s)`, `Quantidade`, `Assuntos em comum` e a lista de
processos (`Nº de ordem`, `CNJ`, `Classe`, `Entrada`, `Reclamante`).

### 9. Ficha de cada processo
Uma ficha por processo, em ordem de **entrada na triagem** (mais antigo primeiro). Campos
curtos ficam lado a lado na mesma linha, separados por `|`. Campos:

- `Nº de ordem` (1, 2, 3...: o mesmo número usado no índice)
- `CNJ`
- `Classe` e `Fase` (Conhecimento/Execução)
- `Entrada na triagem` (data e hora)
- `Autuação (2º grau)`
- `Relator`
- `Recorrente(s)` / `Recorrido(s)` (ou Agravante/Agravado, Impetrante/Impetrado, conforme a
  classe)
- `Assuntos`: **todos** os cadastrados no PJe, com o principal marcado
- `Valor da causa`
- `Justiça gratuita`: sim/não
- `Tutela/liminar`: sim/não
- `Prioridade (PJe)`: sim/não (indicador `prioridadeProcessual` da listagem do PJe; a
  conferir na prática qual prioridade ele representa)
- `Alertas`: por extenso, ex.: "Fazenda Pública sem MPT; Processo físico migrado;
  Sindicato no polo ativo; Lote nº 3; Segredo de justiça". Se não houver: "nenhum".

### 10. Índice por número de processo
Todos os CNJs em ordem numérica, cada um com `Nº de ordem` e link para a ficha.

### 11. Processos não lidos (só se houver)
Processos em que o PJe falhou mesmo após novas tentativas: `CNJ` e motivo do erro.

## O que ficou de fora (decisão de 2026-11-04)
- Recuperação Judicial e Massa Falida: sem uso prático na triagem.
- Tempestividade: exige baixar a lista de documentos de cada processo (lento) e é imprecisa
  sem a data da intimação.
