import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getDataLines, nums, timer } from '../utils.js';

consola.wrapAll();

const day = getCurrentDay();

consola.start('Starting day ' + day);
const t = timer();

const lines = getDataLines(true);
const ranges = [];
while (lines.length > 0) {
  const line = lines.shift();
  if (line === 'your ticket:') break;
  const [key, val] = line.split(': ');
  const [one, two] = val.split(' or ');
  ranges.push([one.split('-').map(Number), two.split('-').map(Number), key]);
}
const ticket = nums(lines.shift());
const others = lines.slice(1).map((line) => nums(line));

const possible = Array(ticket.length)
  .fill(0)
  .map(() => new Set(ranges.map(([, , key]) => key)));

const isValid = (val) => {
  for (const [[a, b], [c, d]] of ranges) {
    if ((val >= a && val <= b) || (val >= c && val <= d)) return true;
  }
  return false;
};

let valid = others.filter((ticket) => ticket.every((t) => isValid(t)));

// remove obvious possibilites
for (const ticket of valid) {
  for (let i = 0; i < ticket.length; i++) {
    const val = ticket[i];
    for (const [[a, b], [c, d], key] of ranges) {
      if (!((val >= a && val <= b) || (val >= c && val <= d))) {
        possible[i].delete(key);
      }
    }
  }
}

// remove impossible
while (possible.some((set) => set.size > 1)) {
  const ok = possible.filter((set) => set.size === 1);
  for (const s of ok) {
    const key = s.values().next().value;
    for (const set of possible) {
      if (set.size > 1 && set.has(key)) {
        set.delete(key);
      }
    }
  }
}

const mapping = possible
  .map((set) => set.values().next().value)
  .map((v, i) => [v, i])
  .filter(([v]) => v.startsWith('departure'));

let answer = mapping.reduce((acc, [, i]) => acc * ticket[i], 1);

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
