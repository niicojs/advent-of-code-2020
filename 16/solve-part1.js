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
  const [_, val] = line.split(': ');
  const [one, two] = val.split(' or ');
  ranges.push([one.split('-').map(Number), two.split('-').map(Number)]);
}
const ticket = nums(lines.shift());
const others = lines.slice(1).map((line) => nums(line));

const isValid = (val) => {
  for (const [[a, b], [c, d]] of ranges) {
    if ((val >= a && val <= b) || (val >= c && val <= d)) return true;
  }
  return false;
};

let invalid = others.filter((ticket) => ticket.some((t) => !isValid(t)));
const answer = invalid
  .flat()
  .filter((t) => !isValid(t))
  .reduce((a, b) => a + b, 0);

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
