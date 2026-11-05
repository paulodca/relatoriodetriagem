/*
 * Caixinha flutuante no canto da tela do PJe: andamento, conclusão e erro.
 * Só textContent (nunca innerHTML com dado do PJe).
 */

const ID = 'relatorio-triagem-overlay';

function el(doc, tag, estilo, texto) {
  const n = doc.createElement(tag);
  if (estilo) n.style.cssText = estilo;
  if (texto !== undefined) n.textContent = texto;
  return n;
}

const ESTILO_BOTAO = 'margin:8px 8px 0 0;padding:6px 12px;border:0;border-radius:6px;cursor:pointer;' +
  'font:600 12px system-ui,sans-serif;';

export function criarOverlay(doc = document) {
  const antigo = doc.getElementById(ID);
  if (antigo) antigo.remove();

  const caixa = el(doc, 'div',
    'position:fixed;top:16px;right:16px;z-index:2147483647;width:340px;background:#0f172a;color:#fff;' +
    'padding:14px 18px;border-radius:12px;font:14px/1.45 system-ui,-apple-system,sans-serif;' +
    'box-shadow:0 12px 32px rgba(0,0,0,.45);border:1px solid #334155;');
  caixa.id = ID;
  const titulo = el(doc, 'div', 'font-weight:800;color:#facc15;margin-bottom:6px;', 'Relatório de Triagem: não feche esta aba');
  const msg = el(doc, 'div', 'font-size:13px;margin-bottom:8px;white-space:pre-line;', 'Iniciando...');
  const trilho = el(doc, 'div', 'background:#1e293b;border-radius:6px;overflow:hidden;height:6px;');
  const barra = el(doc, 'div', 'background:#38bdf8;width:0%;height:100%;transition:width .2s;');
  const acoes = el(doc, 'div', '');
  trilho.appendChild(barra);
  caixa.append(titulo, msg, trilho, acoes);
  doc.body.appendChild(caixa);

  const botao = (texto, cor, acao) => {
    const b = el(doc, 'button', ESTILO_BOTAO + `background:${cor};color:#0f172a;`, texto);
    b.type = 'button';
    b.addEventListener('click', acao);
    acoes.appendChild(b);
    return b;
  };

  return {
    status(texto, pct) {
      msg.textContent = texto;
      if (typeof pct === 'number') barra.style.width = Math.max(0, Math.min(100, pct)) + '%';
    },
    concluir(texto, { baixarDeNovo, baixarDados } = {}) {
      titulo.textContent = 'Relatório de Triagem: pronto';
      titulo.style.color = '#4ade80';
      msg.textContent = texto;
      barra.style.width = '100%';
      barra.style.background = '#4ade80';
      acoes.textContent = '';
      if (baixarDeNovo) botao('Baixar o PDF de novo', '#e2e8f0', baixarDeNovo);
      if (baixarDados) botao('Dados brutos (.txt)', '#94a3b8', baixarDados);
      botao('Fechar', '#64748b', () => caixa.remove());
    },
    erro(texto) {
      titulo.textContent = 'Relatório de Triagem: erro';
      titulo.style.color = '#f87171';
      msg.textContent = texto;
      barra.style.background = '#f87171';
      acoes.textContent = '';
      botao('Fechar', '#64748b', () => caixa.remove());
    }
  };
}
