import _, { toNumber } from "lodash";
import type { GameBoardStateType, TileStateType } from "../store/game";

export type Coord = {
  row: number;
  col: number;
};

function diff(c1: Coord, c2: Coord): Coord {
  return {
    row: c2.row - c1.row,
    col: c2.col - c1.col,
  };
}

function sum(c1: Coord, c2: Coord): Coord {
  return {
    row: c1.row + c2.row,
    col: c1.col + c2.col,
  };
}

function scale(c1: Coord, s: number): Coord {
  return {
    row: c1.row * s,
    col: c1.col * s,
  };
}

const SelectionRules = {
  linear: function (active: Coord[], next: Coord) {
    if (active.length === 0) return true;
    const currDelta = diff(active.at(-1), next)
    const isNeighbor = (Math.abs(currDelta.row) <= 1 && Math.abs(currDelta.col) <= 1)
    if (active.length === 1) return isNeighbor;
    if (
      _.isEqual(diff(active.at(-2), active.at(-1)), currDelta)
    ) {
      return true;
    }
    return false;
  },
};

export const SupportedDirectionDeltas = {
  "horizontal-LTR": { row: 0, col: 1 },
  "horizontal-RTL": { row: 0, col: -1 },
  "vertical-downward": { row: +1, col: 0 },
  "vertical-upward": { row: -1, col: 0 },
  "diagonal-downward-right": { row: +1, col: +1 },
  "diagonal-downward-left": { row: +1, col: -1 },
  "diagonal-upward-right": { row: -1, col: +1 },
  "diagonal-upward-left": { row: -1, col: -1 },
};
export type SupportedDirectionTypes = keyof typeof SupportedDirectionDeltas;
const ALL_SUPPORTED_DIRS = _.keys(
  SupportedDirectionDeltas
) as SupportedDirectionTypes[];

export type Operators = "+" | "-" | "*";
const OperatorRules: Record<Operators, (a: number, b: number) => number> = {
  "+": (a: number, b: number) => a + b,
  "-": (a: number, b: number) => a - b,
  "*": (a: number, b: number) => a * b,
};

export type SelectionRuleTypes = keyof typeof SelectionRules;

export function getActiveSelection(
  board: GameBoardStateType["board"]
): Coord[] {
  return board
    .flatMap((row, i) => {
      return row
        .map((t, j) => ({ t, coord: { row: i, col: j } }))
        .filter((tj) => tj.t.selectionIndex >= 0);
    })
    .sort((a, b) => a.t.selectionIndex - b.t.selectionIndex)
    .map((tj) => tj.coord);
}

/**
 * Should check for validity of tiles here
 */
export function getNextSelectionIndex(
  gameState: GameBoardStateType,
  next: Coord,
  rule: SelectionRuleTypes
): number {
  const activeSelection = getActiveSelection(gameState.board);
  // console.debug({ activeSelection, next });
  if (activeSelection.length > gameState.operators.length) {
    return -1;
  }
  if (SelectionRules[rule](activeSelection, next)) {
    return activeSelection.length + 1;
  }
  return -1;
}

const OperatorConstraints: { [k in Operators]: { avoid: number[], easy: number[] } } = {
  '+': { avoid: [], easy: [0] },
  '-': { avoid: [], easy: [0] },
  '*': { avoid: [0], easy: [1] },
}

export function getBoardSpec(level: number) {
  let boardSize = 7;
  let minTile = 0;
  let maxTile = 9;
  let howManyTargets = 5;

  if (level <= 3) boardSize = 3;
  else if (level <= 6) boardSize = 4;
  else if (level <= 9) boardSize = 5;
  else if (level <= 12) boardSize = 6;

  // TODO: extend to negative numbers !
  minTile = Math.max(level - 1, 0);
  maxTile = Math.max(9 + level * 2, 9);

  if (level >= 10) {
    minTile = -minTile
    maxTile = Math.round(maxTile / 2)
  }

  howManyTargets += boardSize - 3

  return { boardSize, minTile, maxTile, howManyTargets };
}

function isCoordInRange(matrix: number[][], coord: Coord) {
  return (
    coord.row >= 0 &&
    coord.col >= 0 &&
    coord.row < matrix.length &&
    coord.col < matrix[0].length
  );
}

function solve(sel: number[], ops: Operators[]): number {
  if (sel.length !== 3 && ops.length !== 2)
    throw Error("Solver only implemented for 3-term expressions.");

  let sol;
  if (ops[1] === "*") {
    sol = OperatorRules[ops[0]](sel[0], OperatorRules[ops[1]](sel[1], sel[2]));
  } else {
    sol = OperatorRules[ops[1]](OperatorRules[ops[0]](sel[0], sel[1]), sel[2]);
  }
  console.debug(
    `solver: ${sel[0]} ${ops[0]} ${sel[1]} ${ops[1]} ${sel[2]} = ${sol}`
  );
  return sol;
}

export function checkAnswer(
  selection: number[],
  ops: Operators[],
  target: number
): boolean {
  if (selection.length !== ops.length + 1) return false;

  return solve(selection, ops) === target;
}

function findAllSolutions(
  matrix: number[][],
  ops: Operators[],
  dirs: SupportedDirectionTypes[]
): {
  [k: number]: number | undefined;
} {
  let solutions: {
    [k: number]: number;
  } = {};
  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[row].length; col++) {
      console.debug(`iterating: [${row}, ${col}] ..`);
      for (let d = 0; d < dirs.length; d++) {
        const delta = SupportedDirectionDeltas[dirs[d]];
        const c2 = sum({ row, col }, scale(delta, ops.length));
        if (!isCoordInRange(matrix, c2)) {
          continue;
        }

        let sel = [matrix[row][col]];
        for (let k = 0; k < ops.length; k++) {
          const ck = sum({ row, col }, scale(delta, k + 1));
          sel.push(matrix[ck.row][ck.col]);
        }
        console.debug(dirs[d]);
        let sol = solve(sel, ops)
        solutions[sol] = (solutions[sol] || 0) + 1;
      }
    }
  }

  return solutions;
}

export function makeBoard(
  ops: Operators[],
  level: number
): { board: TileStateType[][]; targets: number[] } {
  let { boardSize, minTile, maxTile, howManyTargets } = getBoardSpec(level);

  let nTiles = boardSize * boardSize;
  let numBoard: number[][]
  let targets: number[];

  const illegalNumbers = ops.flatMap((op) => {
    if (level <= 5) {
      return OperatorConstraints[op].avoid
    } else {
      return [
        ...OperatorConstraints[op].avoid,
        ...OperatorConstraints[op].easy,
      ]
    }
  })

  let legalNumbers = _.range(minTile, maxTile).filter((n) =>
    illegalNumbers.indexOf(n) === -1
  )

  console.debug({ illegalNumbers, legalNumbers })
  let iterations = 0;
  do {
    let pool = [];

    while (pool.length < nTiles) {
      console.debug({ poolSize: pool.length, nTiles, minTile, maxTile });
      pool = pool.concat(legalNumbers)
    }
    pool = _.shuffle(pool);

    numBoard = [];
    for (let i = 0; i < boardSize; i++) {
      let row = [];
      for (let j = 0; j < boardSize; j++) {
        row.push(pool.pop());
      }
      numBoard.push(row);
    }
    // console.debug({ ALL_SUPPORTED_DIRS });
    const solutions = findAllSolutions(numBoard, ops, ALL_SUPPORTED_DIRS);

    targets = _.keys(solutions)
      .map(toNumber)
      .sort((a, b) => solutions[b] - solutions[a])
      .slice(0, howManyTargets)

    iterations++

    console.warn(`Iteration: ${iterations}`)
    console.table(numBoard);
    console.table(solutions);

    if (targets.length === howManyTargets) {
      console.debug(`Prepared puzzle in ${iterations} iteration(s).`)
      break;
    }

    // console.warn(`Iteration: ${iterations}`)
    // console.table(numBoard);
    // console.table(solutions);

    if (iterations > 10) {
      console.error(`Could not prepare puzzle within iteration limit.`)
      break;
    }

  } while (true);

  let board: Array<Array<TileStateType>> = numBoard.map((row) =>
    row.map((t) => ({
      label: "" + t,
      hilite: "normal",
      selectionIndex: -1,
    }))
  );

  return { board, targets };
}
