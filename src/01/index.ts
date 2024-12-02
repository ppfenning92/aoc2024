import { intSort, sumReducer, toInt, transposeMatrix } from '../utils';
import { prepare } from '../utils/fetch-challenge';
import { Res } from '../utils/types';

const EX1_RES = '11';
const EX1_DAT = `
3   4
4   3
2   5
1   3
3   9
3   3`;

console.log(intSort([2, 4, 3, 1]));

const one = async (data: string): Promise<Res> => {
  const lines = data
    .split('\n')
    .filter(Boolean)
    .map((l) =>
      l
        .split(' ')
        .map((c) => c.trim())
        .filter(Boolean)
        .map(toInt)
    );

  const [left, right] = transposeMatrix(lines).map(intSort);

  const diffs = [];

  for (let i = 0; i < left.length; i++) {
    diffs.push(Math.abs(left[i] - right[i]));
  }

  return diffs.reduce(sumReducer);
};

const EX2_RES = '31';
const EX2_DAT = EX1_DAT;

const two = async (data: string): Promise<Res> => {
  const lines = data
    .split('\n')
    .filter(Boolean)
    .map((l) =>
      l
        .split(' ')
        .map((c) => c.trim())
        .filter(Boolean)
        .map(toInt)
    );

  const [left, right] = transposeMatrix(lines);

  const counts = new Map();
  right.forEach((el) => {
    counts.set(el, (counts.get(el) ?? 0) + 1);
  });

  const similar = left.map((el) => el * (isNaN(counts.get(el)) ? 0 : counts.get(el)));

  console.log(similar);

  return similar.reduce(sumReducer);
};

export const run = async (day: string) => {
  const data = await prepare(day);

  if (!EX1_RES || !EX1_DAT) {
    console.error('Part 1 not ready yet');
    return;
  }

  const EX1_SOL = await one(EX1_DAT);

  if (EX1_SOL != EX1_RES) {
    const msg = `Part 1 failed!\nExpected: ${EX1_RES} - Received: ${EX1_SOL}`;
    console.error(msg);
    return;
  }

  console.log('PART 1:', await one(data));

  if (!EX2_RES || !EX2_DAT) {
    console.error('Part 2 not ready yet');
    return;
  }

  const EX2_SOL = await two(EX2_DAT);

  if (EX2_SOL != EX2_RES) {
    const msg = `Part 2 failed!\nExpected: ${EX2_RES} - Received: ${EX2_SOL}`;
    console.error(msg);
    return;
  }

  console.log('PART 2:', await two(data));

  console.log(`DONE: 🎉`);

  process.exit(0);
};
