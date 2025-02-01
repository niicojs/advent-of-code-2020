import { consola } from 'consola';
import clipboard from 'clipboardy';
import TinyQueue from 'tinyqueue';
import {
  getCurrentDay,
  getDataLines,
  getDirectNeighbors,
  getGrid,
  getRawData,
  inGridRange,
  mod,
  nums,
  timer,
} from '../utils.js';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv[2] === 'real';

consola.start('Starting day ' + day);
const t = timer();

const [cardkey, doorkey] = getDataLines().map(Number);

function loop(x, subject) {
  return mod(x * subject, 20201227);
}

let size = 1;
let [cardsize, doorsize] = [0, 0];
let x = 1;
let subject = 7;
while (cardsize === 0 || doorsize === 0) {
  x = loop(x, subject);
  if (x === cardkey) cardsize = size;
  if (x === doorkey) doorsize = size;
  size++;
}

consola.log(cardsize, doorsize)

let answer = 0;

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
