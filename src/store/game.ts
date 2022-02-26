import _ from "lodash";
import { randomInRange } from "../util/range";

import { derived, get, Readable, writable } from "svelte/store";

export type TileHiliteType = "normal" | "selected" | "hint" | "disabled";
export type TileStateType = {
  label: string;
  hilite: TileHiliteType;
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
    board: undefined,
  };

  let board: Array<Array<TileStateType>> = [];
  let boardSize = 3;
  for (let i = 0; i < boardSize; i++) {
    let row: Array<TileStateType> = [];
    for (let j = 0; j < boardSize; j++) {
      row.push({
        label: randomInRange(0, 9) + "",
        hilite: ["normal", "selected", "hint", "disabled"][
          randomInRange(0, 3)
        ] as TileHiliteType,
      });
    }
    board.push(row);
  }
  newState.board = board;

  gameState.set(newState);
}
