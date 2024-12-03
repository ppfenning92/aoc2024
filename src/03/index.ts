import { sumReducer } from '../utils';
import { prepare } from '../utils/fetch-challenge';
import { Res } from '../utils/types';

const EX1_RES = '161';
const EX1_DAT = `xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))`;

const one = async (data: string): Promise<Res> => {
  const re = /(?<mul>(mul\(\d{1,3},\d{1,3}\)))/g;
  const matches = data.match(re);

  // console.log(matches);

  const muls = matches?.map((m) => {
    const [l, r] = m
      .replaceAll(/\D+/g, ' ')
      .trim()
      .split(' ')
      .map((d) => parseInt(d, 10));

    return l * r;
  });

  return muls?.reduce(sumReducer) ?? 0;
};

const EX2_RES = '48';
const EX2_DAT = `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`;

const two = async (data: string): Promise<Res> => {
  // const clean = data.replaceAll(/[^mul()don't\d,]/g, '_');

  // console.log(clean);

  const cleaner = data.match(/(mul\(\d{1,3},\d{1,3}\))|don't\(\)|do\(\)/g);
  // console.log(cleaner);

  let _do = true;

  let res = 0;

  cleaner?.forEach((mul) => {
    if (mul === 'do()') {
      _do = true;
      return;
    }

    if (mul === `don't()`) {
      _do = false;
      return;
    }

    if (!_do) return;

    const [l, r] = mul
      .replaceAll(/\D+/g, ' ')
      .trim()
      .split(' ')
      .map((d) => parseInt(d, 10));

    res += l * r;
  });

  return res;
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
