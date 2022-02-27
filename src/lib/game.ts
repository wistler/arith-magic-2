import _ from "lodash";
import { randomInRange } from "../util/range";
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

const SelectionRules = {
  linear: function (active: Coord[], next: Coord) {
    if (active.length < 2) return true;
    if (
      _.isEqual(diff(active.at(-2), active.at(-1)), diff(active.at(-1), next))
    ) {
      return true;
    }
    return false;
  },
};

export type SelectionRuleTypes = keyof typeof SelectionRules;

function getActiveSelection(gameState: GameBoardStateType): Coord[] {
  return gameState.board
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
  const activeSelection = getActiveSelection(gameState);
  console.debug({ activeSelection, next });
  if (SelectionRules[rule](activeSelection, next)) {
    return activeSelection.length + 1;
  }
  return -1;
}

export function getBoardSpec(level: number) {
  let boardSize = 7;
  let minTile = 0;
  let maxTile = 9;

  if (level <= 3) boardSize = 3;
  else if (level <= 6) boardSize = 4;
  else if (level <= 9) boardSize = 5;
  else if (level <= 12) boardSize = 6;

  minTile = Math.max(level - 3, 0);
  maxTile = Math.max(9 + level - 3, 9);

  return { boardSize, minTile, maxTile };
}

export function makeBoard(level: number): TileStateType[][] {
  let { boardSize, minTile, maxTile } = getBoardSpec(level);

  let nTiles = boardSize * boardSize;
  let pool = [];
  while (pool.length < nTiles) {
    pool = pool.concat(_.range(minTile, maxTile));
  }
  pool = _.shuffle(pool);

  let board: Array<Array<TileStateType>> = [];
  for (let i = 0; i < boardSize; i++) {
    let row: Array<TileStateType> = [];
    for (let j = 0; j < boardSize; j++) {
      row.push({
        label: "" + pool.pop(),
        hilite: "normal",
        selectionIndex: -1,
      });
    }
    board.push(row);
  }
  return board;
}
