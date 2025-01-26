import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getRawData, timer } from '../utils.js';

consola.wrapAll();

const day = getCurrentDay();

consola.start('Starting day ' + day);
const t = timer();

const raw = getRawData().trim();
const blocks = raw.split(/\r?\n\r?\n/);

const names = blocks
  .map((b) => b.split(/\r?\n/)[0])
  .map((n) => +n.slice(5, -1));

const images = blocks.map((b) =>
  b
    .split(/\r?\n/)
    .slice(1)
    .map((l) => l.split(''))
);

for (let i = 0; i < names.length; i++) {
  images[i].name = names[i];
}

const size = images[0].length;

function overlap(img1, img2, dir) {
  for (let i = 0; i < size; i++) {
    if (dir === 'bottom' && img1[0][i] !== img2[size - 1][i]) return false;
    if (dir === 'top' && img1[size - 1][i] !== img2[0][i]) return false;
    if (dir === 'left' && img1[i][0] !== img2[i][size - 1]) return false;
    if (dir === 'right' && img1[i][size - 1] !== img2[i][0]) return false;
  }
  return true;
}

function anyoverlap(img1, img2) {
  for (let dir of ['top', 'bottom', 'left', 'right']) {
    if (overlap(img1, img2, dir)) return dir;
  }

  return null;
}

function rotate(img) {
  const res = [];
  for (let i = 0; i < size; i++) {
    res.push([]);
    for (let j = 0; j < size; j++) {
      res[i][j] = img[size - 1 - j][i];
    }
  }
  res.name = img.name;
  return res;
}

function verticalflip(img) {
  const res = [];
  for (let i = 0; i < size; i++) {
    res.push([]);
    for (let j = 0; j < size; j++) {
      res[i][j] = img[i][size - 1 - j];
    }
  }
  res.name = img.name;
  return res;
}

function horizontalflip(img) {
  const res = [];
  for (let i = 0; i < size; i++) {
    res.push([]);
    for (let j = 0; j < size; j++) {
      res[i][j] = img[size - 1 - i][j];
    }
  }
  res.name = img.name;
  return res;
}

function* possibilites(img) {
  let hfimg = horizontalflip(img);
  yield hfimg;
  for (let i = 0; i < 3; i++) {
    hfimg = rotate(hfimg);
    yield hfimg;
  }
  let vfimg = verticalflip(hfimg);
  yield vfimg;
  for (let i = 0; i < 3; i++) {
    vfimg = rotate(vfimg);
    yield vfimg;
  }
}

function arrange(done, left, rules = []) {
  if (left.length === 0) return { fixed: done, rules };

  for (let i = 0; i < left.length; i++) {
    for (const img of possibilites(left[i])) {
      for (const current of done) {
        const dir = anyoverlap(current, img);
        if (dir) {
          left.splice(i, 1);
          const next = arrange([...done, img], left, [
            ...rules,
            [dir, current.name, img.name],
          ]);
          if (next) return next;
          left.splice(i, 0, img);
        }
      }
    }
  }
}

let { rules } = arrange([images[0]], images.slice(1));
rules = rules.map(([dir, a, b]) => {
  if (dir === 'right') return ['left', b, a];
  if (dir === 'bottom') return ['top', b, a];
  return [dir, a, b];
});

const grid = new Map();
grid.set(rules[0][1], [0, 0]);

const left = rules.slice(0);
while (left.length > 0) {
  let [dir, a, b] = left.shift();
  if (!grid.has(a) && !grid.has(b)) {
    left.push([dir, a, b]);
    continue;
  }
  if (grid.has(a)) {
    const [x, y] = grid.get(a);
    if (dir === 'left') grid.set(b, [x - 1, y]);
    if (dir === 'top') grid.set(b, [x, y - 1]);
  } else {
    const [x, y] = grid.get(b);
    if (dir === 'left') grid.set(a, [x + 1, y]);
    if (dir === 'top') grid.set(a, [x, y + 1]);
  }
}

let [minx, miny] = [Infinity, Infinity];
let [maxx, maxy] = [0, 0];
for (const [x, y] of grid.values()) {
  minx = Math.min(minx, x);
  miny = Math.min(miny, y);
  maxx = Math.max(maxx, x);
  maxy = Math.max(maxy, y);
}

let answer = 1;
for (const [key, [x, y]] of grid.entries()) {
  if (x === minx && y === miny) answer *= key;
  if (x === minx && y === maxy) answer *= key;
  if (x === maxx && y === miny) answer *= key;
  if (x === maxx && y === maxy) answer *= key;
}

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
