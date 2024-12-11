import { toInt } from '../utils';
import { prepare } from '../utils/fetch-challenge';
import { Res } from '../utils/types';

const EX1_RES = '1928';
const EX1_DAT = `2333133121414131402`;

const one = async (data: string): Promise<Res> => {
    const parsed = data.split('').map(toInt);

    const disk = [];
    let idx = 0;
    let ID = 0;
    while (idx < parsed.length - 0) {
        const fileSize = parsed[idx];
        const freeAfter = parsed[idx + 1];
        disk.push(...Array(fileSize).fill(ID));
        if (freeAfter === undefined) {
            break;
        }
        if (freeAfter) {
            disk.push(...Array(freeAfter ?? 0).fill(null));
        }
        ID += 1;
        idx += 2;
    }
    let max = Infinity;
    for (let i = 0; i < max; i++) {
        if (disk[i] === null) {
            const lastBlockIndex = disk.findLastIndex((el) => el !== null);
            if (lastBlockIndex > -1) {
                disk[i] = disk[lastBlockIndex];
                disk[lastBlockIndex] = null;
                max = lastBlockIndex;
            }
        }
        // console.log(disk.map((el) => (el !== null ? el : '.')).join(''));
    }

    return disk.filter((b) => b !== null).reduce((cksum, b, idx) => (cksum += b * idx), 0);
};

const EX2_RES = 2858;
const EX2_DAT = EX1_DAT;
const findFile = (disk: (number | null)[], size: number, stop: number) => {
    let idx = disk.length - 1;
    let currentID = null;
    let file = [];
    while (idx > stop) {
        if (disk[idx] !== null) {
            currentID = currentID ?? disk[idx];

            if (currentID === disk[idx]) {
                file.push(idx);
            } else {
                if (file.length <= size) {
                    console.log('found file ID', currentID, file);
                    return file;
                }
                // new file
                console.log(file);

                currentID == disk[idx];
            }
        } else {
            if (currentID) {
                // end of file
                currentID = null;
            }
        }
        idx -= 1;
    }
};
const two = async (data: string): Promise<Res> => {
    const parsed = data.split('').map(toInt);

    const disk = [];
    let idx = 0;
    let ID = 0;
    while (idx < parsed.length - 0) {
        const fileSize = parsed[idx];
        const freeAfter = parsed[idx + 1];
        disk.push(...Array(fileSize).fill(ID));
        if (freeAfter === undefined) {
            break;
        }
        if (freeAfter) {
            disk.push(...Array(freeAfter ?? 0).fill(null));
        }
        ID += 1;
        idx += 2;
    }

    // console.log(disk.map((b) => (b === null ? '.' : b)).join(''));
    let block = disk.length - 1;
    let file = [];
    let currentID = null;
    const triedFile = new Set<number | null>([null]);
    while (block >= 0) {
        if (file.length === 0 && disk[block] !== null) {
            file.push(block);
            currentID = disk[block];
            block -= 1;
            continue;
        }
        if (disk[block] === currentID) {
            file.push(block);
            block -= 1;
            continue;
        }

        // console.log('found File id', currentID, file, block);
        if (triedFile.has(currentID)) {
            // console.log('already tried file', currentID);
            file = [];
            continue;
        }
        triedFile.add(currentID);
        currentID = null;
        let freeStart = null;
        let freeEnd = null;

        for (let s = 0; s < block; s++) {
            if (disk[s] === null && disk[s - 1] !== null) {
                freeStart = s;
            }
            if (disk[s] !== null && disk[s - 1] === null) {
                freeEnd = s - 1;
            }
            if (freeEnd && freeStart) {
                if (freeEnd - freeStart + 1 >= file.length) {
                    // console.log('move');

                    for (let i = 0; i < file.length; i++) {
                        disk[freeStart + i] = disk[file[i]];
                        disk[file[i]] = null;
                    }
                    file = [];
                    // console.log(disk.map((b) => (b === null ? '.' : b)).join(''));
                    block += 1;
                    break;
                }

                currentID = null;
                freeStart = null;
                freeEnd = null;
            }
        }
        file = [];
        block -= 1;
    }

    return disk.reduce((cksum, b, idx) => {
        if (cksum === null) {
            return cksum;
        }
        return cksum + b * idx;
    }, 0);
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
