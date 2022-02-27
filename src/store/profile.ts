import _ from "lodash";
import type { Operators } from "src/lib/game";
import { get } from "svelte/store";
import { persisted } from "../util/persited";

const DEFAULT_LEVELS = {
  "++": 15,
  "+-": 12,
  "--": 9,
  "-+": 6,
  "+*": 3,
  "*+": 2,
  "-*": 1,
  "*-": 0,
  "**": 0,
};

export const levels = persisted("levels", DEFAULT_LEVELS);

export function getListing() {
  return _.entries(get(levels)).map(([ops, lvl]) => {
    return {
      operators: ops.split("") as Operators[],
      levelUnlocked: lvl,
    };
  });
}
