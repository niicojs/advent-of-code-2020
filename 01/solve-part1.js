import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getDataLines, timer } from '../utils.js';

consola.wrapAll();

const day = getCurrentDay();
consola.start('Starting day ' + day);
const t = timer();

const values = getDataLines().map((l) => +l);

let answer = 0;
for (let i = 0; i < values.length; i++) {
  for (let j = i + 1; j < values.length; j++) {
    if (values[i] + values[j] === 2020) {
      answer = values[i] * values[j];
      break;
    }
  }
}

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
