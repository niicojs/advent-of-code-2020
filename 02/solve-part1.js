import { consola } from 'consola';
import clipboard from 'clipboardy';
import { count, getCurrentDay, getDataLines, timer } from '../utils.js';

consola.wrapAll();

const day = getCurrentDay();
consola.start('Starting day ' + day);
const t = timer();

let answer = 0;

const lines = getDataLines();
for (const line of lines) {
  const [rules, password] = line.split(': ');
  const [minmax, c] = rules.split(' ');
  const [min, max] = minmax.split('-').map((n) => +n);
  const cnt = count(password, c);
  if (cnt >= min && cnt <= max) answer++;
}

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
