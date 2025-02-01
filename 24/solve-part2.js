import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getDataLines, nums, timer } from '../utils.js';

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

function neighbors([x, y]) {
  return [
    [x + 1, y],
    [x - 1, y],
    [x + 0.5, y + 0.5],
    [x - 0.5, y + 0.5],
    [x + 0.5, y - 0.5],
    [x - 0.5, y - 0.5],
  ];
}

const lines = getDataLines()
  .map((l) => Array.from(l.matchAll(/(e|se|ne|sw|nw|w)/g)).map(([v]) => v))
  .map(position);

const key = (x, y) => `${x},${y}`;

function addNeighbors(tiles, tile) {
  for (const [nx, ny] of neighbors(tile)) {
    const k = key(nx, ny);
    if (!tiles.has(k)) tiles.set(k, false);
  }
}

let tiles = new Map();
for (const [x, y] of lines) {
  tiles.set(key(x, y), !(tiles.get(key(x, y)) || false));
  addNeighbors(tiles, [x, y]);
}

function tomorrow() {
  const newtiles = new Map();
  for (const t of tiles.keys()) {
    const [x, y] = t.split(',').map(Number);
    const flipped = neighbors([x, y]).filter(([nx, ny]) =>
      tiles.get(key(nx, ny))
    ).length;
    const k = key(x, y);
    if (tiles.get(k)) {
      if (flipped === 0 || flipped > 2) newtiles.set(k, false);
      else newtiles.set(k, true);
    } else {
      if (flipped === 2) newtiles.set(k, true);
      else newtiles.set(k, false);
    }
    addNeighbors(newtiles, [x, y]);
  }
  return newtiles;
}

function count(tiles) {
  return Array.from(tiles.values()).filter((v) => v).length;
}

for (let i = 0; i < 100; i++) tiles = tomorrow(tiles);

let answer = count(tiles);

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
