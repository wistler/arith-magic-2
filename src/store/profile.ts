import _ from "lodash";
import type { Operators } from "../lib/game";
import { DEFAULT_LEVELS, unlockLevels } from "../lib/progression";
import { get } from "svelte/store";
import { persisted } from "../util/persited";
import { gameState, isGameOver } from "./game";


export const levels = persisted("levels", DEFAULT_LEVELS);

export function getListing() {
  return _.entries(get(levels)).map(([ops, lvl]) => {
    return {
      operators: ops.split("") as Operators[],
      levelUnlocked: lvl,
    };
  });
}

export function unlockLevel(ops: Operators[], level: number) {
  const key = ops.join("")
  levels.update(($levels) => ({
    ...$levels,
    ...unlockLevels($levels, ops, level)
  }))
  // TODO: How to inform UI that this event just occurred ?
}

console.debug('Profile subscribing to isGameOver ..')
isGameOver.subscribe(($isGameOver) => {
  console.debug(`Profile/isGameOver subscription callback ..${$isGameOver}`)
  if ($isGameOver) {
    const { level, operators } = get(gameState)
    // console.debug({ $isGameOver, level, operators })

    const key = operators.join("")

    const $levels = get(levels);
    if ($levels[key] === level) {
      unlockLevel(operators, level + 1)
    }

  }
})