import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getDataLines, mod, timer } from '../utils.js';

consola.wrapAll();

const day = getCurrentDay();

consola.start('Starting day ' + day);
const t = timer();

const [cardkey, doorkey] = getDataLines().map(Number);

function loop(x, subject) {
  return mod(x * subject, 20201227);
}

function getLoopSizes() {
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

  return [cardsize, doorsize];
}

const [cardsize, doorsize] = getLoopSizes();
// consola.log({ cardsize, doorsize });

function transform(subject, size) {
  let val = 1;
  for (let i = 0; i < size; i++) {
    val = loop(val, subject);
  }
  return val;
}

const answer = transform(doorkey, cardsize);

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
