import _ from "lodash";
import { persisted } from "../util/persited";
import { makeBoard, Operators } from "../lib/game";

export type TileHiliteType = "normal" | "hint" | "disabled";
export type TileStateType = {
  label: string;
  hilite: TileHiliteType;
  selectionIndex: number;
};

export type GameBoardStateType = {
  level: number;
  board: Array<Array<TileStateType>>;
  targets: number[];
  solved: number[];
};

export const gameState = persisted<GameBoardStateType>(
  "gameState",
  {} as GameBoardStateType
);

export function newGame(ops: Operators[], level: number) {
  const { board, targets } = makeBoard(ops, level);
  const newState: GameBoardStateType = {
    level,
    board,
    targets,
    solved: [],
  };

  gameState.set(newState);
}
