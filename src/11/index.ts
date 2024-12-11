import { prepare } from '../utils/fetch-challenge';
import { Res } from '../utils/types';

const EX1_RES = '55312';
const EX1_DAT = `125 17`;
// 0
// 1
// 2024
// 20,24
// 2,0,2,4
// 4048,1,4048,8096
// 40,48,2024,40,48,80,96
// 4,0,4,8,20,24,4,0,4,8,0,9,6
//
//
// 5 127 680267 39260 0 26    3553  5851995
// x x   x1,x2  x     1 x1,x2 x1,x2 x

const one = async (data: string): Promise<Res> => {
  const stones = data.trim().split(' ');

  for (let step = 1; step <= 25; step++) {
    for (let i = 0; i < stones.length; i++) {
      const stone = stones[i];
      if (stone === '0') {
        stones[i] = '1';
      } else if (stone.length % 2 === 0) {
        const left = stone.slice(0, stone.length / 2);
        const right = stone.slice(stone.length / 2);

        stones[i] = left;
        stones.splice(i + 1, 0, parseInt(right, 10).toString());
        i += 1;
      } else {
        stones[i] = (parseInt(stones[i], 10) * 2024).toString();
      }
    }
  }
  return stones.length;
};

const EX2_RES = '';
const EX2_DAT = '';

const two = async (data: string): Promise<Res> => {
  const stones = data.trim().split(' ');

  for (let step = 1; step <= 25; step++) {
    return '';
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
