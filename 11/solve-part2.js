import { consola } from 'consola';
import clipboard from 'clipboardy';
import {
  count,
  enumGrid,
  getCurrentDay,
  getDataLines,
  getGrid,
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

const getVue = (grid, x, y) => {
  const res = [];
  let i = 1;
  while (x + i < W && grid[y][x + i] === '.') i++;
  if (x + i < W) res.push(grid[y][x + i]);

  i = 1;
  while (x - i >= 0 && grid[y][x - i] === '.') i++;
  if (x - i >= 0) res.push(grid[y][x - i]);

  let j = 1;
  while (y + j < H && grid[y + j][x] === '.') j++;
  if (y + j < H) res.push(grid[y + j][x]);

  j = 1;
  while (y - j >= 0 && grid[y - j][x] === '.') j++;
  if (y - j >= 0) res.push(grid[y - j][x]);

  [i, j] = [1, 1];
  while (x + i < W && y + j < H && grid[y + j][x + i] === '.') {
    i++;
    j++;
  }
  if (x + i < W && y + j < H) res.push(grid[y + j][x + i]);

  [i, j] = [1, 1];
  while (x - i >= 0 && y - j >= 0 && grid[y - j][x - i] === '.') {
    i++;
    j++;
  }
  if (x - i >= 0 && y - j >= 0) res.push(grid[y - j][x - i]);

  [i, j] = [1, 1];
  while (x - i >= 0 && y + j < H && grid[y + j][x - i] === '.') {
    i++;
    j++;
  }
  if (x - i >= 0 && y + j < H) res.push(grid[y + j][x - i]);

  [i, j] = [1, 1];
  while (x + i < W && y - j >= 0 && grid[y - j][x + i] === '.') {
    i++;
    j++;
  }
  if (x + i < W && y - j >= 0) res.push(grid[y - j][x + i]);

  return res;
};

function round(grid) {
  const g = newGrid(H, W, '.');
  for (const { x, y, cell } of enumGrid(grid)) {
    const vals = getVue(grid, x, y);
    if (cell === 'L' && vals.every((v) => v !== '#')) {
      g[y][x] = '#';
    } else if (cell === '#' && vals.filter((v) => v === '#').length >= 5) {
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
