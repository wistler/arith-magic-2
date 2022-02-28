import _ from "lodash";
import { persisted } from "../util/persited";
import { makeBoard, Operators } from "../lib/game";
import { derived, writable } from "svelte/store";

export type TileHiliteType = "normal" | "hint" | "disabled";
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
