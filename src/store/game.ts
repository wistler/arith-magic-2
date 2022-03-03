import _ from "lodash";
import { persisted } from "../util/persited";
import {
  checkAnswer,
  Coord,
  getActiveSelection,
  getNextSelectionIndex,
  makeBoard,
  Operators,
} from "../lib/game";
import { derived, get, writable } from "svelte/store";

export type TileHiliteType =
  | "normal"
  | "hint"
  | "disabled"
  | "selected"
  | "target"
  | "incorrect";
export type TileStateType = {
  label: string;
  hilite: TileHiliteType;
  selectionIndex: number;
};

export type GameBoardStateType = {
  level: number;
  operators: Operators[];
  board: Array<Array<TileStateType>>;
  targets: number[];
  solved: number[];
};

export const gameState = persisted<GameBoardStateType>(
  "gameState",
  {} as GameBoardStateType
);

export const activeSelection = writable([] as number[]);
export const selectionMade = writable(false);

export function newGame(ops: Operators[], level: number) {
  const { board, targets } = makeBoard(ops, level);
  const newState: GameBoardStateType = {
    level,
    operators: ops,
    board,
    targets,
    solved: [],
  };

  gameState.set(newState);
}

export const target = derived(gameState, ({ targets, solved }) => {
  return targets[solved.length];
});

export const isSelectionCorrect = writable({
  complete: false,
  correct: false,
});

export function addToSelection({ row, col }: Coord) {
  const next: Coord = { row, col };
  const $gameState = get(gameState);
  const { board } = $gameState;

  if (board[row][col].selectionIndex >= 0) {
    return;
  }

  const nextSelectionIndex = getNextSelectionIndex($gameState, next, "linear");
  if (nextSelectionIndex === -1) return;

  switch (board[row][col].hilite) {
    case "normal":
    case "hint":
      gameState.update(($$gameState) => {
        const board = $$gameState.board;
        board[row][col].selectionIndex = nextSelectionIndex;
        return {
          ...$$gameState,
          board,
        };
      });
      activeSelection.update(($activeSelection) => [
        ...$activeSelection,
        +$gameState.board[row][col].label,
      ]);
      break;
  }
}

export function removeFromSelection({ row, col }: Coord) {
  const next: Coord = { row, col };
  const $gameState = get(gameState);
  const { board } = $gameState;

  if (board[row][col].selectionIndex == -1) return;

  const chain = getActiveSelection(board);
  const last = chain.at(-1);

  if (last.row === row && last.col === col) {
    gameState.update(($$gameState) => {
      const board = $$gameState.board;
      board[last.row][last.col].selectionIndex = -1;
      return {
        ...$$gameState,
        board,
      };
    });
    activeSelection.update(($activeSelection) => $activeSelection.slice(0, -1));
  }
}

/**
 * validate selection and fire timed events
 *
 * Because the timing itself should be UI's responsibility, we'll
 * return a function that needs to be run next.
 */
export function validateSelection():
  | {
      complete: false;
      correct?: undefined;
      afterAnimation?: undefined;
    }
  | {
      complete: true;
      correct: boolean;
      afterAnimation: () => void;
    } {
  const $gameState = get(gameState);
  const $activeSelection = get(activeSelection);
  const $target = get(target);

  if ($activeSelection.length < $gameState.operators.length + 1) {
    clearSelection();
    return {
      complete: false,
    };
  }

  // a complete selection was made, do not clear it here.
  const complete = $activeSelection.length === $gameState.operators.length + 1;
  const correct = checkAnswer($activeSelection, $gameState.operators, $target);
  isSelectionCorrect.set({ complete, correct });

  return {
    complete: true,
    correct,
    afterAnimation() {
      clearSelection();
    },
  };
}

function clearSelection() {
  const $gameState = get(gameState);

  const board = $gameState.board;
  for (let i = 0; i < board.length; i++) {
    const row = board[i];
    for (let j = 0; j < row.length; j++) {
      if (board[i][j].selectionIndex >= 0) {
        board[i][j].selectionIndex = -1;
      }
    }
  }
  gameState.set({ ...$gameState, board });
  activeSelection.set([]);
  selectionMade.set(false);
  isSelectionCorrect.set({ complete: false, correct: false });
}
