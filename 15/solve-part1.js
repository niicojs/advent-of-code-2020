import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getRawData, nums, timer } from '../utils.js';

consola.wrapAll();

const day = getCurrentDay();

consola.start('Starting day ' + day);
const t = timer();

const values = nums(getRawData().trim());

let turn = values.length;
let ages = new Map(values.slice(0, -1).map((v, i) => [v, i + 1]));
let last = values.at(-1);
while (turn < 2020) {
  const age = ages.get(last);
  ages.set(last, turn);
  turn++;
  if (!age) {
    last = 0;
  } else {
    last = turn - 1 - age;
  }
}

let answer = last;

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
