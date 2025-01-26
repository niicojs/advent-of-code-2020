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

const genregex = (rule) => {
  const r = rules[rule];
  if (r[0] === '"') return r[1];
  const [r1, r2] = r.split(' | ');
  if (!r2) return r1.split(' ').map(genregex).join('');
  const one = r1.split(' ').map(genregex).join('');
  const two = r2.split(' ').map(genregex).join('');
  return `((${one})|(${two}))`;
};

const regex = genregex('0');

let answer = 0;
for (const line of input) {
  if (line.match('^' + regex + '$')) {
    answer++;
  }
}

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
