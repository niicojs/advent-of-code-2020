import { consola } from 'consola';
import clipboard from 'clipboardy';
import {
  count,
  getCurrentDay,
  getRawData,
  newGrid,
  printGrid,
  timer,
} from '../utils.js';

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
  for (let i = 0; i < img.length; i++) {
    res.push([]);
    for (let j = 0; j < img.length; j++) {
      res[i][j] = img[img.length - 1 - j][i];
    }
  }
  res.name = img.name;
  return res;
}

function horizontalflip(img) {
  const res = [];
  for (let i = 0; i < img.length; i++) {
    res.push([]);
    for (let j = 0; j < img.length; j++) {
      res[i][j] = img[i][img.length - 1 - j];
    }
  }
  res.name = img.name;
  return res;
}

function verticalflip(img) {
  const res = [];
  for (let i = 0; i < img.length; i++) {
    res.push([]);
    for (let j = 0; j < img.length; j++) {
      res[i][j] = img[img.length - 1 - i][j];
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

function crop(img) {
  const res = [];
  for (let i = 1; i < img.length - 1; i++) {
    res.push([]);
    for (let j = 1; j < img.length - 1; j++) {
      res[i - 1][j - 1] = img[i][j];
    }
  }
  res.name = img.name;
  return res;
}

function generatefinalimage() {
  let { fixed, rules } = arrange([images[0]], images.slice(1));
  const imgmap = new Map(fixed.map((i) => [i.name, i]));

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

  let revgrid = new Map();
  let [minx, miny] = [Infinity, Infinity];
  let [maxx, maxy] = [0, 0];
  for (const [key, [x, y]] of grid.entries()) {
    minx = Math.min(minx, x);
    miny = Math.min(miny, y);
    maxx = Math.max(maxx, x);
    maxy = Math.max(maxy, y);
    revgrid.set(x + ',' + y, key);
  }

  const finalimage = newGrid(
    (maxx - minx + 1) * (size - 2),
    (maxy - miny + 1) * (size - 2),
    '.'
  );

  for (let x = minx; x <= maxx; x++) {
    const xx = (x - minx) * (size - 2);
    for (let y = miny; y <= maxy; y++) {
      const yy = (y - miny) * (size - 2);

      const imgid = revgrid.get(x + ',' + y);
      const img = verticalflip(crop(imgmap.get(imgid)));

      for (let i = 0; i < img.length; i++) {
        for (let j = 0; j < img.length; j++) {
          finalimage[yy + j][xx + i] = img[j][i];
        }
      }
    }
  }

  return finalimage;
}

function isDragon(img, x, y) {
  //                   #
  // #    ##    ##    ###
  //  #  #  #  #  #  #
  if (y < 1 || y >= img.length - 2) return false;
  if (x > img.length - 20) return false;

  if (img[y][x] !== '#') return false;
  if (img[y + 1][x + 1] !== '#') return false;
  if (img[y + 1][x + 4] !== '#') return false;
  if (img[y][x + 5] !== '#') return false;
  if (img[y][x + 6] !== '#') return false;
  if (img[y + 1][x + 7] !== '#') return false;
  if (img[y + 1][x + 10] !== '#') return false;
  if (img[y][x + 11] !== '#') return false;
  if (img[y][x + 12] !== '#') return false;
  if (img[y + 1][x + 13] !== '#') return false;
  if (img[y + 1][x + 16] !== '#') return false;
  if (img[y][x + 17] !== '#') return false;
  if (img[y][x + 18] !== '#') return false;
  if (img[y - 1][x + 18] !== '#') return false;
  if (img[y][x + 19] !== '#') return false;

  return true;
}

function hasDragon(img) {
  let nbdragon = 0;
  for (let x = 0; x < img.length - 20; x++) {
    for (let y = 1; y < img.length - 1; y++) {
      if (isDragon(img, x, y)) nbdragon++;
    }
  }
  return nbdragon;
}

let answer = 0;

const image = generatefinalimage();
for (const img of possibilites(image)) {
  let nbdragon = hasDragon(img);
  if (!nbdragon) continue;

  answer = count(img.map((row) => row.join('')).join(''), '#');
  answer -= nbdragon * 15;

  printGrid(img);
  break;
}

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
