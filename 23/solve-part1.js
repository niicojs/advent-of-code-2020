import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getRawData, timer } from '../utils.js';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv[2] === 'real';

consola.start('Starting day ' + day);
const t = timer();

const values = getRawData().trim().split('').map(Number);
const min = Math.min(...values);
const max = Math.max(...values);

function move() {
  let current = values[0] - 1;
  const v = values.splice(1, 3);

  let idx = -1;
  while ((idx = values.findIndex((v) => v === current)) < 0) {
    current--;
    if (current < min) current = max;
  }
  values.splice(idx + 1, 0, ...v);

  values.push(values.shift());
}

for (let i = 0; i < 100; i++) move();

const one = values.findIndex((v) => v === 1);
let answer = values.slice(one + 1).join('') + values.slice(0, one).join('');

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
