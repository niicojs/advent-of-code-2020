import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getDataLines, timer } from '../utils.js';

consola.wrapAll();

const day = getCurrentDay();
consola.start('Starting day ' + day);
const t = timer();

let idx = 0;
const data = [{}];

const fields = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'];

const lines = getDataLines(false);
for (const line of lines) {
  if (line === '') {
    data.push({});
    idx++;
    continue;
  }
  for (const v of line.split(' ')) {
    const [key, value] = v.split(':');
    data[idx][key] = value;
  }
}

let answer = 0;
for (const password of data) {
  if (fields.every((key) => key in password)) {
    answer++;
  }
}

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
