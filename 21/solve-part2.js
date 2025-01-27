import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getDataLines, timer } from '../utils.js';

consola.wrapAll();

const day = getCurrentDay();

consola.start('Starting day ' + day);
const t = timer();

const lines = getDataLines()
  .map((line) => line.split(' (contains '))
  .map(([a, b]) => [a.split(' '), b.slice(0, -1).split(', ')]);

function findallergens() {
  const possible = new Map();
  for (const [ingredients, allergens] of lines) {
    for (const allergen of allergens) {
      if (!possible.has(allergen)) possible.set(allergen, new Set(ingredients));
      else
        possible.set(
          allergen,
          possible.get(allergen).intersection(new Set(ingredients))
        );
    }
  }

  const done = new Set();
  while (possible.values().some((set) => set.size !== 1)) {
    for (const [allergen, set] of possible) {
      if (done.has(allergen)) continue;
      if (set.size === 1) {
        for (const [a, p] of possible) {
          if (a === allergen) continue;
          p.delete([...set][0]);
        }
        done.add(allergen);
      } else {
      }
    }
  }

  const map = new Map();
  for (const [allergen, set] of possible) {
    map.set(allergen, [...set][0]);
  }

  return map;
}

const where = findallergens();

const answer = [...where.keys()]
  .sort()
  .map((a) => where.get(a))
  .join(',');

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
