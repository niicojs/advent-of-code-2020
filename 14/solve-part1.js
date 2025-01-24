import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getDataLines, timer } from '../utils.js';

consola.wrapAll();

const day = getCurrentDay();

consola.start('Starting day ' + day);
const t = timer();

let mask = [];
let mem = new Map();

const lines = getDataLines();
for (const line of lines) {
  if (line.startsWith('mask = ')) {
    mask = line
      .split(' = ')[1]
      .split('')
      .reverse()
      .map((c, i) => [i, c])
      .filter(([, c]) => c !== 'X')
      .map(([i, c]) => [2n ** BigInt(i), +c]);
  } else {
    let [dest, val] = line
      .match(/mem\[(\d+)\] = (\d+)/)
      .slice(1)
      .map(Number);

    let v = BigInt(val);
    for (const [i, c] of mask) {
      if (c === 0) v = v & ~i;
      else v = v | i;
    }
    mem.set(dest, v);
  }
}

let answer = Number(mem.values().reduce((acc, v) => acc + v, 0n));

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
