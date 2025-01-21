import { consola } from 'consola';
import clipboard from 'clipboardy';
import {
  count,
  enumGrid,
  getCurrentDay,
  getDataLines,
  getGrid,
  getNeighbors,
  inGridRange,
  newGrid,
  printGrid,
  timer,
} from '../utils.js';

consola.wrapAll();

const day = getCurrentDay();

consola.start('Starting day ' + day);
const t = timer();

const grid = getGrid(getDataLines());
const [W, H] = [grid[0].length, grid.length];

function round(grid) {
  const g = newGrid(H, W, '.');
  for (const { x, y, cell } of enumGrid(grid)) {
    const neighbors = getNeighbors(x, y).filter(([nx, ny]) =>
      inGridRange(grid, nx, ny)
    );
    const vals = neighbors.map(([nx, ny]) => grid[ny][nx]);
    if (cell === 'L' && vals.every((v) => v !== '#')) {
      g[y][x] = '#';
    } else if (cell === '#' && vals.filter((v) => v === '#').length >= 4) {
      g[y][x] = 'L';
    } else {
      g[y][x] = cell;
    }
  }

  return g;
}

let answer = 0;
let done = new Set();
let g = grid;
while (true) {
  g = round(g);
  const hash = g.map((row) => row.join('')).join('');
  if (done.has(hash)) {
    answer = count(hash, '#');
    break;
  }
  done.add(hash);
}

printGrid(g);

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
