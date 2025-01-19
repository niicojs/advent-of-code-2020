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

function tryexec() {
  const done = new Set();

  let acc = 0;
  for (let ptr = 0; ptr < instructions.length; ) {
    if (done.has(ptr)) return [false, acc];
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

  return [true, acc];
}

let answer = 0;
for (let i = 0; i < instructions.length; i++) {
  if (['jmp', 'nop'].includes(instructions[i][0])) {
    instructions[i][0] = instructions[i][0] === 'jmp' ? 'nop' : 'jmp';
    const [ok, acc] = tryexec();
    if (ok) {
      answer = acc;
      break;
    }
    instructions[i][0] = instructions[i][0] === 'jmp' ? 'nop' : 'jmp';
  }
}

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
