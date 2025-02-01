import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getRawData, memoize, timer } from '../utils.js';

consola.wrapAll();

const day = getCurrentDay();

consola.start('Starting day ' + day);
const t = timer();

const hash = (deck1, deck2) => [deck1.join(','), deck2.join(',')].join('-');

const raw = getRawData().trim();
const data = raw
  .split(/\r?\n\r?\n/)
  .map((x) => x.split(/\r?\n/))
  .map(([name, ...rest]) => [name.slice(0, -1), rest.map((r) => +r)]);

const cache = new Map();

const game = (deck1, deck2) => {
  const history = new Set();
  while (deck1.length > 0 && deck2.length > 0) {
    if (history.has(hash(deck1, deck2))) return [1, deck1];

    history.add(hash(deck1, deck2));
    const one = deck1.shift();
    const two = deck2.shift();
    if (one <= deck1.length && two <= deck2.length) {
      const [res] = game(deck1.slice(0, one), deck2.slice(0, two));
      if (res === 1) {
        deck1.push(one);
        deck1.push(two);
      } else {
        deck2.push(two);
        deck2.push(one);
      }
    } else {
      if (one > two) {
        deck1.push(one);
        deck1.push(two);
      } else {
        deck2.push(two);
        deck2.push(one);
      }
    }
  }
  const win = deck1.length > 0 ? [1, deck1] : [2, deck2];
  return win;
};

let [_, deck] = game(data[0][1], data[1][1]);

deck = deck.reverse();

let answer = 0;
for (let i = 0; i < deck.length; i++) {
  answer += (i + 1) * deck[i];
}

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
