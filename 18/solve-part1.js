import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getDataLines, timer } from '../utils.js';

consola.wrapAll();

const day = getCurrentDay();

consola.start('Starting day ' + day);
const t = timer();

const lines = getDataLines();

function findClosingParenthesis(expr, start) {
  let count = 1;
  for (let i = start + 1; i < expr.length; i++) {
    if (expr[i] === '(') count++;
    if (expr[i] === ')') count--;
    if (count === 0) return i;
  }
  return -1;
}

function evaluate(expr) {
  if (expr.match(/^\d+$/)) return Number(expr);

  let left = 0;
  let end = 1;
  if (expr[0] === '(') {
    end = findClosingParenthesis(expr, 0);
    left = evaluate(expr.slice(1, end));
    end++;
  } else {
    end = expr.indexOf(' ');
    left = Number(expr.slice(0, end));
  }

  end++;

  while (end < expr.length) {
    let op = expr[end];
    end += 2;

    if (expr[end] === '(') {
      const idx = findClosingParenthesis(expr, end);
      const right = evaluate(expr.slice(end + 1, idx));
      end = idx + 2;
      if (op === '+') left += right;
      else if (op === '*') left *= right;
      else throw new Error('Unknown operator ' + op);
    } else {
      let idx = expr.indexOf(' ', end);
      if (idx < 0) idx = expr.length;
      const right = Number(expr.slice(end, idx));
      end = idx + 1;
      if (op === '+') left += right;
      else if (op === '*') left *= right;
      else throw new Error('Unknown operator ' + op);
    }
  }

  return left;
}

let answer = 0;
for (const line of lines) {
  answer += evaluate(line);
}

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
