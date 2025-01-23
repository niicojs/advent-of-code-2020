import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getDataLines, lcm, timer } from '../utils.js';

consola.wrapAll();

const day = getCurrentDay();

consola.start('Starting day ' + day);
const t = timer();

const lines = getDataLines();
const ids = lines
  .at(1)
  .split(',')
  .map((id, i) => [id, i])
  .filter(([id]) => id !== 'x')
  .map(([id, i]) => [+id, i]);

let step = 1;

let i = 1;
while (ids.length > 0) {
  const [bus, offset] = ids.shift();
  while ((i + offset) % bus !== 0) {
    i += step;
  }
  step *= bus;
}

let answer = i;

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
