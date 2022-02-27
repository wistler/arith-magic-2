import _ from "lodash";
import { get } from "svelte/store";
import { persisted } from "../util/persited";

export const levels = persisted("levels", {
  "++": 15,
  "+-": 12,
  "--": 9,
  "-+": 6,
  "+*": 3,
  "*+": 2,
  "-*": 1,
  "*-": 0,
  "**": 0,
});

export function getListing() {
  return _.entries(get(levels)).map(([ops, lvl]) => {
    return {
      operators: ops.split(""),
      levelUnlocked: lvl,
    };
  });
}
