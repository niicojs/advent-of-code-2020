import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getDataLines, timer } from '../utils.js';

consola.wrapAll();

const day = getCurrentDay();
consola.start('Starting day ' + day);
const t = timer();

const seats = new Map();
for (let i = 1; i < 127; i++) {
  for (let j = 0; j < 8; j++) {
    seats.set(i * 8 + j, false);
  }
}

const lines = getDataLines();

function decode(seq) {
  let [min, max] = [0, 128];
  for (const c of seq.slice(0, 7)) {
    const mid = (min + max) / 2;
    if (c === 'F') max = mid;
    if (c === 'B') min = mid;
  }
  const row = Math.min(min, max);

  let [x, y] = [0, 8];
  for (const c of seq.slice(7)) {
    const mid = (x + y) / 2;
    if (c === 'L') y = mid;
    if (c === 'R') x = mid;
  }
  const col = Math.min(x, y);

  return [row, col];
}

let answer = 0;
for (const pass of lines) {
  const [row, col] = decode(pass);
  const id = row * 8 + col;
  seats.set(id, true);
}

for (const [id, taken] of seats) {
  if (!taken && seats.get(id - 1) && seats.get(id + 1)) {
    answer = id;
    break;
  }
}

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
