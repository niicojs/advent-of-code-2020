import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getRawData, timer } from '../utils.js';

consola.wrapAll();

const day = getCurrentDay();

consola.start('Starting day ' + day);
const t = timer();

const values = getRawData().trim().split('').map(Number);

for (let i = Math.max(...values) + 1; i <= 1_000_000; i++) values.push(i);
const max = 1_000_000;
// const max = Math.max(...values);

const list = new Map(values.map((v) => [v, { v, n: null }]));

for (let i = 0; i < values.length; i++) {
  if (i !== values.length - 1) list.get(values[i]).n = list.get(values[i + 1]);
  else list.get(values[i]).n = list.get(values[0]);
}

let current = values[0];

function move() {
  let val = current;
  const c = list.get(val);
  const v = [c.n, c.n.n, c.n.n.n];
  c.n = c.n.n.n.n;

  val--;
  while (v.find((x) => x.v === val)) val--;
  if (val <= 0) val = max;
  while (v.find((x) => x.v === val)) val--;

  const pos = list.get(val);
  v[2].n = pos.n;
  pos.n = v[0];

  current = list.get(current).n.v;
}

for (let i = 0; i < 10000000; i++) {
  move();
}

let answer = list.get(1).n.v * list.get(1).n.n.v;

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
