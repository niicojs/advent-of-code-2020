import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getDataLines, timer } from '../utils.js';

consola.wrapAll();

const day = getCurrentDay();

consola.start('Starting day ' + day);
const t = timer();

const lines = getDataLines();
const time = +lines.at(0);
const ids = lines
  .at(1)
  .split(',')
  .filter((x) => x !== 'x')
  .map(Number);

const nexts = ids.map((id) => time + id - (time % id));
const next = Math.min(...nexts);
const id = ids[nexts.indexOf(next)];

let answer = id * (next - time);

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
