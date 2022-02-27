import _ from "lodash";
import { randomInRange } from "../util/range";

import { derived, get, Readable, writable } from "svelte/store";
import { makeBoard } from "../lib/game";

export type TileHiliteType = "normal" | "hint" | "disabled";
export type TileStateType = {
  label: string;
  hilite: TileHiliteType;
  selectionIndex: number;
};

export type GameBoardStateType = {
  level: number;
  board: Array<Array<TileStateType>>;
};

export const gameState = writable<GameBoardStateType>({
  level: 0,
  board: undefined,
});

export function newGame(level: number) {
  const newState: GameBoardStateType = {
    level,
    board: makeBoard(level),
  };

  gameState.set(newState);
}
