/**
 * Ajustes de comportamento do Relatório de Triagem.
 * Altere aqui (e não espalhado pelo código). Depois rode `npm run build`.
 */
export const CONFIG = Object.freeze({
  VERSAO: '1.0.0',

  // Caixa "Triagem" do Painel Global do PJe (mesmo ID no TRT1 e no TRT2).
  AGRUPAMENTO_TRIAGEM: 12,
  TAMANHO_PAGINA_LISTAGEM: 500,

  // true = só processos sem responsável (se nenhum estiver sem, entram todos).
  SOMENTE_SEM_RESPONSAVEL: true,

  // Processos baixados ao mesmo tempo (cada um faz 3 requisições).
  // Se o PJe responder "muitas requisições" (429), o número cai pela metade sozinho.
  CONCORRENCIA: 12,
  CONCORRENCIA_MINIMA: 2,

  // Novas tentativas por requisição que falhar (erro de rede, 429, 5xx), com espera
  // crescente: ESPERA_BASE_MS, 2x, 4x...
  TENTATIVAS: 3,
  ESPERA_BASE_MS: 500,
  TEMPO_LIMITE_REQUISICAO_MS: 30000,

  // Endereço publicado do gerador (o favorito só carrega este arquivo).
  URL_SCRIPT: 'https://paulodca.github.io/relatoriodetriagem/relatorio.js'
});
