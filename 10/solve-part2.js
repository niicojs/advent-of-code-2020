import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getDataLines, timer } from '../utils.js';

consola.wrapAll();

const day = getCurrentDay();
consola.start('Starting day ' + day);
const t = timer();

const values = getDataLines()
  .map((l) => +l)
  .sort((a, b) => a - b);
const target = values.at(-1) + 3;
values.push(target);

const ways = new Map();
ways.set(0, 1);

for (const v of values) {
  const w =
    (ways.get(v - 1) || 0) + (ways.get(v - 2) || 0) + (ways.get(v - 3) || 0);
  ways.set(v, w);
}

let answer = ways.get(target);

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
