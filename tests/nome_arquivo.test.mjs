import test from 'node:test';
import assert from 'node:assert/strict';
import { siglaOrgao, siglaDoLote, siglaTribunal, nomeArquivoRelatorio } from '../src/relatorio/nome_arquivo.js';

test('sigla do órgão julgador', () => {
  assert.equal(siglaOrgao('9ª Turma - Cadeira 4'), '9T-4C');
  assert.equal(siglaOrgao('17ª Turma - Cadeira 3'), '17T-3C');
  assert.equal(siglaOrgao('9a Turma - Cadeira 1'), '9T-1C');
  assert.equal(siglaOrgao('9ª Turma'), '9T');
  assert.equal(siglaOrgao('Seção Especializada em Dissídios Individuais - 3'), 'Secao-Especializada-em-Dissidios-Individ');
  assert.equal(siglaOrgao(''), 'semOJ');
});

test('sigla do lote: um órgão, vários, nenhum', () => {
  assert.equal(siglaDoLote(['9ª Turma - Cadeira 4', '9ª Turma - Cadeira 4 ']), '9T-4C');
  assert.equal(siglaDoLote(['9ª Turma - Cadeira 4', '9ª Turma - Cadeira 3']), 'variosOJ');
  assert.equal(siglaDoLote([]), 'semOJ');
});

test('tribunal pelo endereço do PJe', () => {
  assert.equal(siglaTribunal('pje.trt2.jus.br'), 'TRT2');
  assert.equal(siglaTribunal('pje.trt15.jus.br'), 'TRT15');
  assert.equal(siglaTribunal('localhost'), 'LOCALHOST');
});

test('nome completo, sem caracteres proibidos no Windows', () => {
  const nome = nomeArquivoRelatorio({
    hostname: 'pje.trt2.jus.br', descricoesOJ: ['9ª Turma - Cadeira 4'], data: new Date(2026, 0, 5, 8, 7)
  });
  assert.equal(nome, 'relatorio_triagem_TRT2_9T-4C_2026-01-05_08h07.pdf');
  assert.doesNotMatch(nome, /[\\/:*?"<>|]/);
});
