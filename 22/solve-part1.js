import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getRawData, timer } from '../utils.js';

consola.wrapAll();

const day = getCurrentDay();

consola.start('Starting day ' + day);
const t = timer();

const raw = getRawData().trim();
const data = raw
  .split(/\r?\n\r?\n/)
  .map((x) => x.split(/\r?\n/))
  .map(([name, ...rest]) => [name.slice(0, -1), rest.map((r) => +r)]);

const deck1 = data[0][1];
const deck2 = data[1][1];
while (deck1.length > 0 && deck2.length > 0) {
  const one = deck1.shift();
  const two = deck2.shift();
  if (one > two) {
    deck1.push(one);
    deck1.push(two);
  } else {
    deck2.push(two);
    deck2.push(one);
  }
}
const winner = (deck1.length > 0 ? deck1 : deck2).reverse();

let answer = 0;

for (let i = 0; i < winner.length; i++) {
  answer += (i + 1) * winner[i];
}

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
