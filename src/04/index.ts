import { argv0 } from 'process';
import { getAdjacentCoords, parseMatrix, printMatrix, toInt } from '../utils';
import { prepare } from '../utils/fetch-challenge';
import { Res } from '../utils/types';
import { log } from 'sys';

const EX1_RES = '18';
const EX1_DAT = `MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX
`;

const one = async (data: string): Promise<Res> => {
  const mat = parseMatrix(data);

  // printMatrix(mat);

  const paths = [];

  for (let row = 0; row < mat.length; row++) {
    for (let col = 0; col < mat[row].length; col++) {
      const char = mat[row][col];

      if (char !== 'X') {
        continue;
      }

      const numRows = mat.length;
      const numCols = mat[0].length;

      if (row + 3 < numRows && col + 3 < numCols) {
        // down-right
        if (
          mat[row + 1][col + 1] === 'M' &&
          mat[row + 2][col + 2] === 'A' &&
          mat[row + 3][col + 3] === 'S'
        ) {
          paths.push(['dr', [row, col]]);
        }
      }

      if (row + 3 < numRows && col - 3 >= 0) {
        // down-left
        if (
          mat[row + 1][col - 1] === 'M' &&
          mat[row + 2][col - 2] === 'A' &&
          mat[row + 3][col - 3] === 'S'
        ) {
          paths.push(['dl', [row, col]]);
        }
      }

      if (row - 3 >= 0 && col - 3 >= 0) {
        // up-left
        if (
          mat[row - 1][col - 1] === 'M' &&
          mat[row - 2][col - 2] === 'A' &&
          mat[row - 3][col - 3] === 'S'
        ) {
          paths.push(['ul', [row, col]]);
        }
      }

      if (row - 3 >= 0 && col + 3 < numCols) {
        // up-right
        if (
          mat[row - 1][col + 1] === 'M' &&
          mat[row - 2][col + 2] === 'A' &&
          mat[row - 3][col + 3] === 'S'
        ) {
          paths.push(['ur', [row, col]]);
        }
      }

      if (col + 3 < numCols) {
        // right
        if (
          mat[row][col + 1] === 'M' &&
          mat[row][col + 2] === 'A' &&
          mat[row][col + 3] === 'S'
        ) {
          paths.push(['r', [row, col]]);
        }
      }

      if (row - 3 >= 0) {
        // up
        if (
          mat[row - 1][col] === 'M' &&
          mat[row - 2][col] === 'A' &&
          mat[row - 3][col] === 'S'
        ) {
          paths.push(['u', [row, col]]);
        }
      }

      if (col - 3 >= 0) {
        // left
        if (
          mat[row][col - 1] === 'M' &&
          mat[row][col - 2] === 'A' &&
          mat[row][col - 3] === 'S'
        ) {
          paths.push(['l', [row, col]]);
        }
      }

      if (row + 3 < numRows) {
        // down
        if (
          mat[row + 1][col] === 'M' &&
          mat[row + 2][col] === 'A' &&
          mat[row + 3][col] === 'S'
        ) {
          paths.push(['d', [row, col]]);
        }
      }
    }
  }
  // console.log(paths.length);
  // paths.forEach((p) => console.log(p));
  return paths.length;
};

const EX2_RES = '9';
const EX2_DAT = `.M.S......
..A..MSMS.
.M.S.MAA..
..A.ASMSM.
.M.S.M....
..........
S.S.S.S.S.
.A.A.A.A..
M.M.M.M.M.
..........`;

const two = async (data: string): Promise<Res> => {
  const mat = parseMatrix(data);

  // printMatrix(mat);

  let count = 0;
  for (let row = 1; row < mat.length - 1; row++) {
    for (let col = 1; col < mat[row].length - 1; col++) {
      const char = mat[row][col];

      if (char !== 'A') {
        continue;
      }

      const adj = getAdjacentCoords(row, col, mat.length - 1, mat[0]?.length - 1, true);

      const tl = adj['top-left'];
      const tr = adj['top-right'];
      const bl = adj['bottom-left'];
      const br = adj['bottom-right'];

      if (!tl || !tr || !bl || !br) {
        continue;
      }

      if (
        mat[tl[0]]?.[tl[1]] === 'M' &&
        mat[br[0]]?.[br[1]] === 'S' &&
        mat[tr[0]]?.[tr[1]] === 'M' &&
        mat[bl[0]]?.[bl[1]] === 'S'
      ) {
        count += 1;
      }

      if (
        mat[tl[0]]?.[tl[1]] === 'S' &&
        mat[br[0]]?.[br[1]] === 'M' &&
        mat[tr[0]]?.[tr[1]] === 'S' &&
        mat[bl[0]]?.[bl[1]] === 'M'
      ) {
        count += 1;
      }

      if (
        mat[bl[0]]?.[bl[1]] === 'M' &&
        mat[tr[0]]?.[tr[1]] === 'S' &&
        mat[tl[0]]?.[tl[1]] === 'M' &&
        mat[br[0]]?.[br[1]] === 'S'
      ) {
        count += 1;
      }

      if (
        mat[bl[0]]?.[bl[1]] === 'S' &&
        mat[tr[0]]?.[tr[1]] === 'M' &&
        mat[tl[0]]?.[tl[1]] === 'S' &&
        mat[br[0]]?.[br[1]] === 'M'
      ) {
        count += 1;
      }
    }
  }
  return count;
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
