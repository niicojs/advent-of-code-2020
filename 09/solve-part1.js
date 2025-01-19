import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getDataLines, timer } from '../utils.js';

consola.wrapAll();

const day = getCurrentDay();
consola.start('Starting day ' + day);
const t = timer();

const lines = getDataLines().map((l) => +l);
const previous = 25;

function find() {
  for (let i = previous; i < lines.length; i++) {
    const window = lines.slice(i - previous, i);
    let ok = false;
    for (let x = 0; x < window.length; x++) {
      for (let y = x + 1; y < window.length; y++) {
        if (window[x] + window[y] === lines[i]) {
          ok = true;
          break;
        }
      }
      if (ok) break;
    }

    if (!ok) return lines[i];
  }
}

let answer = find();

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
