import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getDataLines, timer } from '../utils.js';

consola.wrapAll();

const day = getCurrentDay();
consola.start('Starting day ' + day);
const t = timer();

let idx = 0;
const data = [null];

const lines = getDataLines(false);
for (const line of lines) {
  if (line === '') {
    data.push(null);
    idx++;
    continue;
  }
  const set = new Set(line.split(''));
  if (data[idx] === null) data[idx] = set;
  else data[idx] = data[idx].intersection(set);
}

let answer = 0;
for (const v of data) {
  if (v) answer += v.size;
}

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
