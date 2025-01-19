import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getDataLines, getGrid, timer } from '../utils.js';

consola.wrapAll();

const day = getCurrentDay();
consola.start('Starting day ' + day);
const t = timer();

const grid = getGrid(getDataLines());
const [W, H] = [grid[0].length, grid.length];

let [x, y] = [0, 0];
let [dx, dy] = [3, 1];

let answer = 0;

while (y < grid.length) {
  if (grid[y][x] === '#') answer++;
  x = (x + dx) % W;
  y = y + dy;
}

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
