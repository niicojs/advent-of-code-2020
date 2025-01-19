import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getDataLines, timer } from '../utils.js';

consola.wrapAll();

const day = getCurrentDay();
consola.start('Starting day ' + day);
const t = timer();

const rules = new Map();

const lines = getDataLines();
for (const line of lines) {
  const [color, contents] = line.split(' bags contain ');
  if (contents === 'no other bags.') continue;

  rules.set(color, []);
  for (const part of contents
    .split(', ')
    .map((c) => c.replace(' bags', '').replace(' bag', '').replace('.', ''))) {
    const idx = part.indexOf(' ');
    const [n, bag] = [part.slice(0, idx), part.slice(idx + 1)];
    rules.get(color).push([+n, bag]);
  }
}

function count(color) {
  let res = 1;
  if (rules.has(color)) {
    for (const [n, c] of rules.get(color)) {
      res += n * count(c);
    }
  }
  return res;
}

let answer = count('shiny gold') - 1;

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
