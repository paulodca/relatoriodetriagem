/*
 * Ponto de entrada no navegador (carregado pelo favorito, dentro da aba do PJe):
 * coletar → classificar → montar → PDF → download automático.
 */
import { jsPDF } from 'jspdf';
import { CONFIG } from './config.js';
import { coletarTriagem, lerCookie, ErroSessao } from './coleta/coletor.js';
import { gerarRelatorio } from './relatorio/gerar.js';
import { carimboDataHora } from './relatorio/nome_arquivo.js';
import { criarOverlay } from './overlay/overlay.js';

function textoProgresso(p) {
  if (p.fase === 'listagem') return { texto: 'Lendo a lista da caixa Triagem...', pct: 3 };
  if (p.fase === 'repescagem') {
    return { texto: `Tentando de novo os que falharam: ${p.feitos + 1}/${p.total}`, pct: 96 };
  }
  const restante = p.feitos > 0 ? Math.round(((p.total - p.feitos) * p.segundos) / p.feitos) : null;
  const eta = restante !== null && p.feitos >= 10 ? ` | faltam ~${restante}s` : '';
  return {
    texto: `Baixando processos: ${p.feitos}/${p.total}${eta}` + (p.falhas ? `\n(${p.falhas} para tentar de novo no fim)` : ''),
    pct: 5 + Math.round((p.feitos / Math.max(1, p.total)) * 88)
  };
}

function baixarTexto(nome, texto) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([texto], { type: 'text/plain;charset=utf-8' }));
  a.download = nome;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 5000);
}

async function executar() {
  const overlay = criarOverlay(document);
  try {
    const xsrf = lerCookie(document.cookie, 'Xsrf-Token');
    if (!xsrf) throw new ErroSessao('Não encontrei a sessão do PJe nesta aba. Faça login no PJe e clique de novo.');

    const coleta = await coletarTriagem({
      origin: location.origin,
      xsrf,
      aoProgresso: p => { const { texto, pct } = textoProgresso(p); overlay.status(texto, pct); }
    });

    if (coleta.totalNaCaixa === 0) {
      overlay.erro('A caixa Triagem desta Turma/Cadeira está vazia. Confira o órgão selecionado no PJe.');
      return;
    }

    overlay.status('Montando o PDF...', 97);
    await new Promise(r => setTimeout(r, 30)); // deixa a mensagem aparecer
    const geradoEm = new Date();
    const { rel, doc } = gerarRelatorio({
      registros: coleta.registros,
      falhas: coleta.falhas,
      meta: {
        hostname: location.hostname, totalNaCaixa: coleta.totalNaCaixa, criterio: coleta.criterio,
        geradoEm, versao: CONFIG.VERSAO, segundos: coleta.segundos
      },
      JsPDF: jsPDF
    });
    doc.save(rel.nomeArquivo);

    const ndjson = coleta.registros.map(r => JSON.stringify(r)).join('\n') + '\n';
    overlay.concluir(
      `${rel.capa.noRelatorio} processos em ${Math.round(coleta.segundos)}s.` +
      (coleta.falhas.length ? `\n${coleta.falhas.length} não lidos (listados no fim do PDF).` : '') +
      `\nArquivo: ${rel.nomeArquivo}`,
      {
        baixarDeNovo: () => doc.save(rel.nomeArquivo),
        baixarDados: () => baixarTexto(`triagem_dados_${carimboDataHora(geradoEm)}.txt`, ndjson)
      }
    );
  } catch (e) {
    const texto = e instanceof ErroSessao ? e.message : `Algo deu errado: ${(e && e.message) || e}`;
    overlay.erro(texto);
  }
}

if (!window.__relatorioTriagemRodando) {
  window.__relatorioTriagemRodando = true;
  executar().finally(() => { window.__relatorioTriagemRodando = false; });
}
