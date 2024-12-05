import { log } from 'node:util';
import { sumReducer, toInt } from '../utils';
import { prepare } from '../utils/fetch-challenge';
import { Res } from '../utils/types';

const EX1_RES = '143';
const EX1_DAT = `
47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47
`;

const checkSorted = (inp: number[], ord: number[][]) => {
  for (let i = 0; i < inp.length - 1; i++) {
    const el = inp[i];
    const rest = inp.slice(i + 1);

    for (const re of rest) {
      const isOrdered = ord.find(([a, b]) => a === el && b === re);

      if (!isOrdered) {
        return false;
      }
    }
  }
  return true;
};

const one = async (data: string): Promise<Res> => {
  const _data = data.trim().split('\n');
  const sepIndex = _data.indexOf('');
  // console.log(sepIndex);

  const _orders = _data.slice(0, sepIndex);
  const _updates = _data.slice(sepIndex + 1, _data.length);

  const orders = _orders.map((s) => s.split('|').map(toInt));
  const updates = _updates.map((s) => s.split(',').map(toInt));
  // console.log(orders, updates);

  const validUpdates = updates.filter((up) => checkSorted(up, orders));

  const middelEls = validUpdates.map((up) => up[Math.floor(up.length / 2)]);

  return middelEls.reduce(sumReducer);
};

const EX2_RES = '123';
const EX2_DAT = EX1_DAT;

const sorter = (a: number, b: number, orders: number[][]) => {
  const wrong = orders.find(([_a, _b]) => b === _a && _b === a);
  // console.log({ a, b, rel: orders.find(([_a, _b]) => a === _a) });

  return wrong ? 1 : -1;
};
const two = async (data: string): Promise<Res> => {
  const _data = data.trim().split('\n');
  const sepIndex = _data.indexOf('');
  // console.log(sepIndex);

  const _orders = _data.slice(0, sepIndex);
  const _updates = _data.slice(sepIndex + 1, _data.length);

  const orders = _orders.map((s) => s.split('|').map(toInt));
  const updates = _updates.map((s) => s.split(',').map(toInt));
  // console.log(orders, updates);

  const invalidUpdates = updates.filter((up) => !checkSorted(up, orders));

  // console.log(invalidUpdates);

  const sorted = invalidUpdates.map((up) => {
    return up.toSorted((a, b) => sorter(a, b, orders));
  });
  // console.log(sorted);
  const middleEls = sorted.map((up) => up[Math.floor(up.length / 2)]);
  return middleEls.reduce(sumReducer);
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
