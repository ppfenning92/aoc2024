import { prepare } from '../utils/fetch-challenge';
import { Res } from '../utils/types';
import { toInt } from '../utils';

const EX1_RES = '2';
const EX1_DAT = `
7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9
`;

const checkOrderedAndMaxDiff = (arr: number[], diff = 3) => {
  const len = arr.length;
  let mode: 'ASC' | 'DESC' = 'ASC';
  for (let i = 0; i < len - 1; i++) {
    const [el1, el2] = arr.slice(i, i + 2);

    if (i === 0) {
      mode = el1 < el2 ? 'ASC' : 'DESC';
    }

    if (mode === 'ASC') {
      if (el1 >= el2) {
        return false;
      }
    } else {
      if (el1 <= el2) {
        return false;
      }
    }
    if (Math.abs(el1 - el2) > diff) {
      return false;
    }
  }
  return true;
};
const one = async (data: string): Promise<Res> => {
  const lines = data
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      return line.split(' ').map(toInt);
    });

  const safe = lines
    .map((line) => {
      return checkOrderedAndMaxDiff(line);
    })
    .filter(Boolean);

  return safe.length;
};

const EX2_RES = '4';
const EX2_DAT = EX1_DAT;
const checkLineAllowError = (arr: number[], diff = 3) => {
  const len = arr.length;
  let mode: 'ASC' | 'DESC' = 'ASC';
  const errors = [];

  for (let i = 0; i < len - 1; i++) {
    const [el1, el2] = arr.slice(i, i + 2);

    if (i === 0) {
      mode = el1 < el2 ? 'ASC' : 'DESC';
    }

    if (mode === 'ASC') {
      if (el1 >= el2) {
        errors.push(el1);
      }
    } else {
      if (el1 <= el2) {
        errors.push(el1);
      }
    }
    if (Math.abs(el1 - el2) > diff) {
      errors.push(el1);
    }
  }
  return errors;
};
const two = async (data: string): Promise<Res> => {
  const lines = data
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      return line.split(' ').map(toInt);
    });

  const safe = lines.map((line) => {
    const errorless = checkOrderedAndMaxDiff(line);

    if (errorless) {
      return true;
    }

    for (let i = 0; i < line.length; i++) {
      const withoutLevel = line.toSpliced(i, 1);

      const fixed = checkOrderedAndMaxDiff(withoutLevel);

      if (fixed) {
        return true;
      }
    }

    return false;
  });

  return safe.filter(Boolean).length;
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
