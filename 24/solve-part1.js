import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getDataLines, timer } from '../utils.js';

consola.wrapAll();

const day = getCurrentDay();

consola.start('Starting day ' + day);
const t = timer();

function position(path) {
  let [x, y] = [0, 0];
  for (const d of path) {
    if (d === 'e') x++;
    if (d === 'w') x--;
    if (d === 'ne') [x, y] = [x + 0.5, y + 0.5];
    if (d === 'nw') [x, y] = [x - 0.5, y + 0.5];
    if (d === 'se') [x, y] = [x + 0.5, y - 0.5];
    if (d === 'sw') [x, y] = [x - 0.5, y - 0.5];
  }
  return [x, y];
}

const lines = getDataLines()
  .map((l) => Array.from(l.matchAll(/(e|se|ne|sw|nw|w)/g)).map(([v]) => v))
  .map(position);

const key = (x, y) => `${x},${y}`;

const tiles = new Map();
for (const [x, y] of lines) {
  tiles.set(key(x, y), !(tiles.get(key(x, y)) || false));
}

let answer = Array.from(tiles.values()).filter((v) => v).length;

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
