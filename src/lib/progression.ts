import type { Operators } from "./game";

const GamesInOrderOfDifficulty = [
    "++",
    "+-",
    "--",
    "-+",
    "+*",
    "*+",
    "-*",
    "*-",
    "**"
]

export const DEFAULT_LEVELS = {
    "++": 1,
    "+-": 0,
    "--": 0,
    "-+": 0,
    "+*": 0,
    "*+": 0,
    "-*": 0,
    "*-": 0,
    "**": 0,
};

export type LevelsType = typeof DEFAULT_LEVELS

export function unlockLevels(levelsUnlocked: LevelsType, ops: Operators[], level: number): Partial<LevelsType> {
    const key = ops.join("")
    if (level <= levelsUnlocked[key]) {
        // no new unlocks
        return levelsUnlocked;
    }

    const keyIndex = GamesInOrderOfDifficulty.indexOf(key);
    let nextGameInDifficulty = undefined
    if (keyIndex < GamesInOrderOfDifficulty.length - 1) {
        nextGameInDifficulty = GamesInOrderOfDifficulty[keyIndex + 1]
    }

    if (level <= 5 || (nextGameInDifficulty !== undefined && levelsUnlocked[nextGameInDifficulty] > 0)) {
        // no new game type to unlock, just upgrade level
        return {
            ...levelsUnlocked,
            [key]: level,
        }
    }

    // more than 5 levels in current game type unlocks next game type if one is availabel ..
    return {
        [key]: level,
        [nextGameInDifficulty]: 1,
    }
}
