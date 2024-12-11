import { Queue, Stack } from 'typescript-collections';
import { getAdjacentCoords, parseMatrix, toInt } from '../utils';
import { prepare } from '../utils/fetch-challenge';
import { Res } from '../utils/types';

const EX1_RES = '36';
const EX1_DAT = `
89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732
`;

const coordsRepr = (point: number[]) => {
    return point.join('-');
};

const trails = (map: number[][], [start_row, start_col]: [number, number], seen: Set<string>) => {
    // dfs
    const queue: Queue<[number, number]> = new Queue();
    queue.enqueue([start_row, start_col]);

    const nines: Set<string> = new Set();

    while (queue.size() > 0) {
        const [row, col] = queue.dequeue() ?? [];

        if (row === undefined || col === undefined) {
            continue;
        }
        const currentKey = coordsRepr([row, col]);
        if (seen.has(currentKey)) {
            continue;
        }
        if (map[row][col] === 9) {
            nines.add(currentKey);
        }

        seen.add(currentKey);

        const adj = getAdjacentCoords(row, col, map.length - 1, map[0].length - 1, false);

        Object.values(adj).forEach(([r, c]) => {
            if (map[r][c] === map[row][col] + 1) {
                queue.enqueue([r, c]);
            }
        });
    }
    return nines.size;
};

const one = async (data: string): Promise<Res> => {
    const map = parseMatrix(data, toInt) as number[][];
    const heads: [number, number][] = [];

    for (let row = 0; row < map.length; row++) {
        for (let col = 0; col < map[row].length; col++) {
            if (map[row][col] === 0) {
                heads.push([row, col]);
            }
        }
    }

    let total = 0;

    for (const [r, c] of heads) {
        const seen = new Set<string>();
        total += trails(map, [r, c], seen);
    }

    return total;
};

const EX2_RES = 81;
const EX2_DAT = EX1_DAT;

const distictTrails = (
    map: number[][],
    [start_row, start_col]: [number, number],
    seen: Set<string>
) => {
    // DFS with queue (BFS-like)   const queue: Queue<[number, number]> = new Queue();
    const queue: Queue<[number, number]> = new Queue();
    queue.enqueue([start_row, start_col]);

    const nines: Set<string> = new Set();
    const pathCount: Map<string, number> = new Map(); // To track distinct paths to each cell

    // Initialize start position's path count
    const startKey = coordsRepr([start_row, start_col]);
    pathCount.set(startKey, 1);

    while (queue.size() > 0) {
        const [row, col] = queue.dequeue() ?? [];

        if (row === undefined || col === undefined) {
            continue;
        }
        const currentKey = coordsRepr([row, col]);

        // Skip if already visited
        if (seen.has(currentKey)) {
            continue;
        }

        // If current cell is a 9, increment the path count for it
        if (map[row][col] === 9) {
            nines.add(currentKey);
        }

        seen.add(currentKey);

        const adj = getAdjacentCoords(row, col, map.length - 1, map[0].length - 1, false);

        // For each adjacent cell, update its path count if the condition is met
        Object.values(adj).forEach(([r, c]) => {
            if (map[r][c] === map[row][col] + 1) {
                const adjKey = coordsRepr([r, c]);

                // Add to the queue if not already seen
                if (!seen.has(adjKey)) {
                    queue.enqueue([r, c]);
                }

                // Update the path count for the adjacent cell
                pathCount.set(
                    adjKey,
                    (pathCount.get(adjKey) || 0) + (pathCount.get(currentKey) || 0)
                );
            }
        });
    }

    // Calculate the total distinct routes to all reachable 9's
    let totalPaths = 0;
    nines.forEach((nineKey) => {
        totalPaths += pathCount.get(nineKey) || 0;
    });

    return totalPaths;
};
const two = async (data: string): Promise<Res> => {
    const map = parseMatrix(data, toInt) as number[][];
    const heads: [number, number][] = [];

    for (let row = 0; row < map.length; row++) {
        for (let col = 0; col < map[row].length; col++) {
            if (map[row][col] === 0) {
                heads.push([row, col]);
            }
        }
    }

    let total = 0;

    for (const [r, c] of heads) {
        const seen = new Set<string>();
        total += distictTrails(map, [r, c], seen);
    }

    return total;
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
