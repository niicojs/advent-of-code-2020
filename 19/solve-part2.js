import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getRawData, timer } from '../utils.js';

consola.wrapAll();

const day = getCurrentDay();

consola.start('Starting day ' + day);
const t = timer();

const raw = getRawData().trim();
const [rawrules, rawinput] = raw.split(/\r?\n\r?\n/);
const input = rawinput.split(/\r?\n/);

const rules = {};
for (const r of rawrules.split(/\r?\n/)) {
  const [id, rule] = r.split(': ');
  rules[id] = rule;
}

rules['8'] = '42 | 42 8';
rules['11'] = '42 31 | 42 11 31';

const genregex = (rule, max = 15) => {
  if (max === 0) return '';
  if (rule === '8') return `(${genregex('42', max - 1)})+`;

  const r = rules[rule];
  if (r[0] === '"') return r[1];
  const [r1, r2] = r.split(' | ');
  if (!r2)
    return r1
      .split(' ')
      .map((r) => genregex(r, max - 1))
      .join('');

  const one = r1
    .split(' ')
    .map((r) => genregex(r, max - 1))
    .join('');
  const two = r2
    .split(' ')
    .map((r) => genregex(r, max - 1))
    .join('');
  return `((${one})|(${two}))`;
};

const regex = genregex('0');

let answer = 0;
for (const line of input) {
  const m = line.match('^' + regex + '$');
  if (m) answer++;
}

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
