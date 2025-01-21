import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getDataLines, manhattan, timer } from '../utils.js';

consola.wrapAll();

const day = getCurrentDay();

consola.start('Starting day ' + day);
const t = timer();

const values = getDataLines().map((l) => [l[0], +l.slice(1)]);

let dir = [1, 0];
let pos = [0, 0];

function turn(d, n) {
  const turns = n / 90;
  for (let i = 0; i < turns; i++) {
    if (d === 'L') dir = [dir[1], -dir[0]];
    if (d === 'R') dir = [-dir[1], dir[0]];
  }
  return dir;
}

for (const [d, n] of values) {
  if (d === 'F') pos = [pos[0] + n * dir[0], pos[1] + n * dir[1]];
  if (d === 'N') pos = [pos[0], pos[1] - n];
  if (d === 'S') pos = [pos[0], pos[1] + n];
  if (d === 'E') pos = [pos[0] + n, pos[1]];
  if (d === 'W') pos = [pos[0] - n, pos[1]];

  if (d === 'R') turn(d, n);
  if (d === 'L') turn(d, n);
}

let answer = manhattan([0, 0], pos);

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
