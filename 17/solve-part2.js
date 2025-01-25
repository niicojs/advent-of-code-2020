import { consola } from 'consola';
import clipboard from 'clipboardy';
import {
  enumGrid,
  getCurrentDay,
  getDataLines,
  getGrid,
  timer,
} from '../utils.js';

consola.wrapAll();

const day = getCurrentDay();

consola.start('Starting day ' + day);
const t = timer();

const newGrid = () => {
  return Array(size)
    .fill(0)
    .map(() =>
      Array(size)
        .fill(0)
        .map(() =>
          Array(size)
            .fill(0)
            .map(() => Array(size).fill('.'))
        )
    );
};

const start = getGrid(getDataLines());

const size = start.length + 20 + (start.length % 2);
let grid = newGrid();

for (const { x, y, cell } of enumGrid(start)) {
  grid[size / 2][size / 2][size / 2 + y][size / 2 + x] = cell;
}

function getNeighbors(x, y, z, k) {
  let res = [];
  for (let dk = -1; dk <= 1; dk++) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dz = -1; dz <= 1; dz++) {
          if (dk === 0 && dx === 0 && dy === 0 && dz === 0) continue;
          if (
            x + dx >= 0 &&
            x + dx < size &&
            y + dy >= 0 &&
            y + dy < size &&
            z + dz >= 0 &&
            z + dz < size &&
            k + dk >= 0 &&
            k + dk < size
          ) {
            res.push([x + dx, y + dy, z + dz, k + dk]);
          }
        }
      }
    }
  }

  return res;
}

function cycle(grid) {
  const next = newGrid();
  for (let k = 0; k < size; k++) {
    for (let z = 0; z < size; z++) {
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const neighbors = getNeighbors(x, y, z, k);
          const activeNeighbors = neighbors.filter(
            ([nx, ny, nz, nk]) => grid[nk][nz][ny][nx] === '#'
          ).length;

          if (grid[k][z][y][x] === '#') {
            next[k][z][y][x] =
              activeNeighbors === 2 || activeNeighbors === 3 ? '#' : '.';
          } else {
            next[k][z][y][x] = activeNeighbors === 3 ? '#' : '.';
          }
        }
      }
    }
  }

  return next;
}

function count() {
  let res = 0;
  for (let k = 0; k < size; k++) {
    for (let z = 0; z < size; z++) {
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          if (grid[k][z][y][x] === '#') res++;
        }
      }
    }
  }
  return res;
}

for (let i = 0; i < 6; i++) {
  grid = cycle(grid);
}

let answer = count();

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
