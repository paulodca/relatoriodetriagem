# Relatório de Triagem — PJe 2º Grau

Um clique no PJe e o navegador baixa um **PDF completo** com todos os processos que estão na
caixa **Triagem** do seu gabinete. Sem planilha, sem tela de filtros, sem arquivo para carregar.

O PDF serve para imprimir e consultar, ou para enviar à sua IA preferida (ChatGPT, Gemini,
Claude etc.) e pedir as análises que quiser.

> Sucessor simplificado do projeto [triagempje](https://github.com/paulodca/triagempje).
> O motor de classificação é o mesmo; só a "casca" mudou.

---

## Como usar (3 passos)

**1. Instale o botão (só uma vez)**
Abra a página de instalação (https://paulodca.github.io/relatoriodetriagem/), mostre a barra de favoritos (`Ctrl+Shift+B`) e **arraste** o
botão "Relatório de Triagem" para ela.

**2. Abra o PJe**
Entre no PJe 2º Grau com seu login, escolha a Turma/Cadeira certa e deixe a página aberta
(qualquer tela do PJe serve).

**3. Clique no botão**
Clique em "Relatório de Triagem" na barra de favoritos. Um aviso no centro da tela mostra o
andamento e o tempo decorrido. **Não feche a aba nem mude de página** até o PDF baixar (pode
usar outras abas e programas enquanto isso). Ao terminar, o PDF é baixado sozinho, com um nome como:

```
Relatório de Triagem - 9ª Turma - Cadeira 4 (TRT-2) - 04-11-2026 às 14h32.pdf
```

(órgão julgador, tribunal, dia e hora em que o relatório foi gerado)

---

## O que vem no PDF

Alertas (Fazenda Pública sem MPT, processos físicos, sindicatos), lista por reclamada, lotes
de processos parecidos e uma **ficha de cada processo**. Tem sumário clicável e marcadores na
barra lateral do leitor de PDF. Detalhes em
[`documentacao/CONTEUDO_DO_RELATORIO.md`](documentacao/CONTEUDO_DO_RELATORIO.md).

## Quais processos entram

Os processos da caixa **Triagem** (Painel Global, agrupamento 12) **sem responsável**
atribuído, na Turma/Cadeira que estiver selecionada no PJe no momento do clique. Se nenhum
estiver sem responsável, entram todos os da caixa.

## Privacidade

- O botão usa a **sua própria sessão** do PJe. Nenhum dado de processo sai do seu computador:
  o PDF é montado dentro do navegador.
- Só o **programa** vem da internet (GitHub Pages); os **dados** não vão para lugar nenhum.
- Antes de montar o PDF, são descartados CPF, e-mail, telefone, data de nascimento e
  filiação (LGPD, art. 6º, III).
- Em processo com **segredo de justiça**, o nome das partes não aparece no PDF.

## Problemas comuns

| O que aconteceu | O que fazer |
|---|---|
| "Abra no PJe" | Você clicou fora do PJe. Abra o PJe e clique de novo. |
| "Não consegui carregar o gerador" | Rede ou bloqueio do tribunal. Tente de novo; se persistir, avise o responsável. |
| "Não está logado" | Faça login no PJe nesta aba e clique de novo. |
| PDF veio com "Processos não lidos" | O PJe falhou em alguns processos mesmo após novas tentativas. Rode de novo mais tarde. |
| "A caixa Triagem está vazia" | Confira a Turma/Cadeira selecionada no PJe. |

---

## Para quem mantém o projeto

- Código em `src/`, testes em `tests/` (`npm test`), empacotamento com `node build.mjs`
  (gera `docs/relatorio.js`, `docs/index.html` e `docs/bookmarklet.txt`; a pasta `docs/` é
  publicada pelo GitHub Pages). Depois de mudar o código: `node build.mjs`, commit e push.
- O teste com dados reais (`tests/relatorio_fixture.test.mjs`) lê a amostra do projeto antigo
  (`../PROJETO_TRIAGEM/triagem_copy.json`) ou o arquivo em `TRIAGEM_FIXTURE`; dados reais
  **nunca** entram neste repositório. Sem o arquivo, o teste é pulado.
- Ajustes de comportamento (quantos processos em paralelo, novas tentativas, filtro "sem
  responsável") ficam em `src/config.js`.
- O que sai em cada seção do PDF está descrito em `documentacao/CONTEUDO_DO_RELATORIO.md`. Altere o
  documento primeiro, depois o código.
