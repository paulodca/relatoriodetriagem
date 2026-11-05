import { processarLoteTriagem } from '../motor/hub_triagem.js';
import { montarRelatorio } from './dados_relatorio.js';
import { gerarPdf } from './pdf.js';

/**
 * Registros coletados (já sanitizados) → { rel, doc }.
 * Mesmo caminho no navegador (main.js) e nos testes com a amostra real.
 */
export function gerarRelatorio({ registros, falhas = [], meta, JsPDF }) {
  const { processos } = processarLoteTriagem(registros.filter(r => r && !r.erro));
  const rel = montarRelatorio({ processos, naoLidos: falhas, meta });
  const doc = gerarPdf(rel, JsPDF);
  return { rel, doc };
}
