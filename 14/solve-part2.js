import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getDataLines, sum, timer } from '../utils.js';

consola.wrapAll();

const day = getCurrentDay();

consola.start('Starting day ' + day);
const t = timer();

let mask = [];
let mem = new Map();

function decode(mask, addr) {
  let v = BigInt(addr);
  for (let idx = 0; idx < mask.length; idx++) {
    const [i, c] = mask[idx];
    if (c === 'X') {
      return decode(mask.slice(idx + 1), v | i).concat(
        decode(mask.slice(idx + 1), v & ~i)
      );
    }
    if (c === '1') v = v | i;
  }
  return [v];
}

const lines = getDataLines();
for (const line of lines) {
  if (line.startsWith('mask = ')) {
    mask = line
      .split(' = ')[1]
      .split('')
      .reverse()
      .map((c, i) => [i, c])
      .filter(([, c]) => c !== '0')
      .map(([i, c]) => [2n ** BigInt(i), c]);
  } else {
    let [dest, val] = line
      .match(/mem\[(\d+)\] = (\d+)/)
      .slice(1)
      .map(Number);

    for (const addr of decode(mask, dest)) {
      mem.set(addr, val);
    }
  }
}

let answer = sum(mem.values());

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
