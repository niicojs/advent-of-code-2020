import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getDataLines, timer } from '../utils.js';

consola.wrapAll();

const day = getCurrentDay();
consola.start('Starting day ' + day);
const t = timer();

const revrules = new Map();

const lines = getDataLines();
for (const line of lines) {
  const [color, contents] = line.split(' bags contain ');
  if (contents === 'no other bags.') continue;

  for (const part of contents
    .split(', ')
    .map((c) => c.replace(' bags', '').replace(' bag', '').replace('.', ''))) {
    const idx = part.indexOf(' ');
    const [n, bag] = [part.slice(0, idx), part.slice(idx + 1)];

    if (!revrules.has(bag)) revrules.set(bag, new Set());
    revrules.get(bag).add(color);
  }
}

function possibilites(color) {
  let res = new Set([color]);
  if (revrules.has(color)) {
    for (const c of revrules.get(color)) {
      res = res.union(possibilites(c));
    }
  }
  return res;
}

let answer = possibilites('shiny gold').size - 1;

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
