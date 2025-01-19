import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getDataLines, timer } from '../utils.js';

consola.wrapAll();

const day = getCurrentDay();
consola.start('Starting day ' + day);
const t = timer();

const instructions = [];
const lines = getDataLines();
for (const line of lines) {
  const [instr, n] = line.split(' ');
  instructions.push([instr, +n]);
}

const done = new Set();

let acc = 0;
for (let ptr = 0; ptr < instructions.length; ) {
  if (done.has(ptr)) break;
  done.add(ptr);

  const [instr, n] = instructions[ptr];
  if (instr === 'acc') {
    acc += n;
    ptr++;
  } else if (instr === 'jmp') {
    ptr += n;
  } else if (instr === 'nop') {
    // do nothing
    ptr++;
  }
}

let answer = acc;

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
