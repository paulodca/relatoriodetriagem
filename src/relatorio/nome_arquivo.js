/**
 * Nome do arquivo: relatorio_triagem_<TRIBUNAL>_<OJ>_<AAAA-MM-DD>_<HHhMM>.pdf
 * Sem ':' nem '/' (proibidos em nome de arquivo no Windows).
 */

function slug(texto) {
  return String(texto || '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[ªº]/g, '')
    .replace(/[^A-Za-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
}

/** "9ª Turma - Cadeira 4" → "9T-4C"; fora do padrão → versão simplificada do nome. */
export function siglaOrgao(descricao) {
  const m = String(descricao || '').match(/(\d+)\s*[ªaº]?\s*Turma.*?Cadeira\s*(\d+)/i);
  if (m) return `${m[1]}T-${m[2]}C`;
  const t = String(descricao || '').match(/(\d+)\s*[ªaº]?\s*Turma/i);
  if (t) return `${t[1]}T`;
  return slug(descricao) || 'semOJ';
}

/** Um único órgão no lote → sua sigla; mais de um → "variosOJ". */
export function siglaDoLote(descricoes) {
  const distintas = Array.from(new Set((descricoes || []).map(d => String(d || '').trim()).filter(Boolean)));
  if (distintas.length === 0) return 'semOJ';
  if (distintas.length > 1) return 'variosOJ';
  return siglaOrgao(distintas[0]);
}

/** "pje.trt2.jus.br" → "TRT2". */
export function siglaTribunal(hostname) {
  const m = String(hostname || '').match(/\b(trt\d+|tst|csjt)\b/i);
  return m ? m[1].toUpperCase() : (slug(String(hostname || '').split('.')[0]).toUpperCase() || 'PJE');
}

const dois = n => String(n).padStart(2, '0');

/** Data/hora LOCAL: "2026-11-04_14h32". */
export function carimboDataHora(data) {
  return `${data.getFullYear()}-${dois(data.getMonth() + 1)}-${dois(data.getDate())}_${dois(data.getHours())}h${dois(data.getMinutes())}`;
}

export function nomeArquivoRelatorio({ hostname, descricoesOJ, data }) {
  return `relatorio_triagem_${siglaTribunal(hostname)}_${siglaDoLote(descricoesOJ)}_${carimboDataHora(data)}.pdf`;
}
