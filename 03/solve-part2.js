import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getDataLines, getGrid, timer } from '../utils.js';

consola.wrapAll();

const day = getCurrentDay();
consola.start('Starting day ' + day);
const t = timer();

const grid = getGrid(getDataLines());
const [W, H] = [grid[0].length, grid.length];

function howmanytrees([dx, dy]) {
  let [x, y] = [0, 0];
  let res = 0;
  while (y < grid.length) {
    if (grid[y][x] === '#') res++;
    x = (x + dx) % W;
    y = y + dy;
  }

  return res;
}

let answer = 1;
for (let dir of [
  [1, 1],
  [3, 1],
  [5, 1],
  [7, 1],
  [1, 2],
]) {
  answer *= howmanytrees(dir);
}

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
