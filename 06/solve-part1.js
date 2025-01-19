import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getDataLines, timer } from '../utils.js';

consola.wrapAll();

const day = getCurrentDay();
consola.start('Starting day ' + day);
const t = timer();

let idx = 0;
const data = [{}];

const lines = getDataLines(false);
for (const line of lines) {
  if (line === '') {
    data.push({});
    idx++;
    continue;
  }
  for (const c of line.split('')) {
    data[idx][c] = (data[idx][c] || 0) + 1;
  }
}

let answer = 0;
for (const v of data) {
  answer += Object.keys(v).length;
}

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
