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
const eyecolors = ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'];

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
  if (fields.some((key) => !password[key])) continue;
  if (+password['byr'] < 1920 || +password['byr'] > 2002) continue;
  if (+password['iyr'] < 2010 || +password['iyr'] > 2020) continue;
  if (+password['eyr'] < 2020 || +password['eyr'] > 2030) continue;

  const hgt = password['hgt'];
  if (!hgt.match(/^(\d{3}cm)|(\d{2}in)$/)) continue;
  if (hgt.endsWith('cm')) {
    if (+hgt.slice(0, 3) < 150 || +hgt.slice(0, 3) > 193) continue;
  } else if (hgt.endsWith('in')) {
    if (+hgt.slice(0, 2) < 59 || +hgt.slice(0, 2) > 76) continue;
  }

  if (!password['hcl'].match(/^#[0-9a-f]{6}$/)) continue;
  if (!eyecolors.includes(password['ecl'])) continue;
  if (!password['pid'].match(/^\d{9}$/)) continue;

  answer++;
}

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
