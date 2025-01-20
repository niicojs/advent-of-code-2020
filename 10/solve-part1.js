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

const diffs = new Map();

function find(current) {
  if (values.length === 0) return;

  const a = values.shift();
  const diff = Math.abs(current - a);

  if (diff > 3) throw new Error('not possible');

  if (diffs.has(diff)) {
    diffs.set(diff, diffs.get(diff) + 1);
  } else {
    diffs.set(diff, 1);
  }
  return find(a);
}

find(0);
let answer = diffs.get(1) * diffs.get(3);

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
