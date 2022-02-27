import _ from "lodash";
import type { GameBoardStateType } from "../store/game";

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
