import _ from "lodash";
import { getLangProps, LangKey } from "src/i18n";
import { choose, randomInRange, range } from "src/util/range";
import { derived, get, Readable, writable } from "svelte/store";

export type KeyState = "Missing" | "Correct" | "Misplaced";

const EMPTY_TILE = "";

export type KeyboardState = {
  [k: string]: KeyState;
};

export const lang = writable("ta" as LangKey);
export const target = writable("" as string);
export const maxGuesses = writable(null as number);
export const guesses = writable([] as string[][]);
export const attempt = writable(0);

export const targetTiled = derived(target, (t) => convertToTiles(t, false));
export const wordLength = derived(targetTiled, (t) => t.length);
export const targetTiledMainForms = derived(targetTiled, (t) =>
  t.map(primaryLetterInTile)
);
export const prefilled = derived(targetTiled, ($t) =>
  $t.map(sansPrimaryLetterInTile)
);

export type TileState = {
  letters: string;
  hint: KeyState | "Prefill";
};

function getHint(target: string[], guess: string[], i: number): KeyState {
  const gch = guess[i];

  if (target[i] === gch) {
    return "Correct";
  }

  if (target.indexOf(gch) !== -1) {
    const howManyMatchesInTarget = target.filter((ch) => ch === gch).length;
    const howManyMatchesInGuess = guess.filter((ch) => ch === gch).length;

    if (howManyMatchesInGuess <= howManyMatchesInTarget) {
      return "Misplaced";
    }

    const positions = _.zip(_.range(0, guess.length), target, guess)
      .filter(([_, t, g]) => g === gch)

    const matchingPositions = positions.filter(([_, t, g]) => t === g).length
    const overflowPositions = positions.filter(([_, t, g]) => t !== g).slice(howManyMatchesInTarget - matchingPositions).map(([j]) => j)

    if (overflowPositions.indexOf(i) === -1) {
      return "Misplaced";
    }
  }

  return "Missing";
}

/**
 * Handles undefined
 */
function precedence(k1: KeyState, k2: KeyState): KeyState {
  if (k1 === 'Correct' || k2 === 'Correct') return 'Correct';
  if (k1 === 'Misplaced' || k2 === 'Misplaced') return 'Misplaced';
  return 'Missing';
}

export const usedKeys: Readable<KeyboardState> = derived(
  [targetTiledMainForms, guesses, attempt],
  ([$targetTiledMainForms, $guesses, $attempt]) => {
    if ($guesses.length === 0 || $attempt === 0) return {};

    let $state = get(usedKeys);
    const guess = $guesses[$attempt - 1]
    const updates = guess
      .map((gch, i) => ({
        key: gch,
        value:
          $state[gch] === "Correct"
            ? "Correct"
            : getHint($targetTiledMainForms, guess, i),
      }))
      .reduce((acc, val) => ({ ...acc, [val.key]: precedence(acc[val.key], val.value) }), {}) as KeyboardState

    return updates;
  },
  {} as KeyboardState
);

export const tiles: Readable<TileState[][]> = derived(
  [guesses, maxGuesses, prefilled, attempt, wordLength, targetTiledMainForms],
  ([
    $guesses,
    $maxGuesses,
    $prefilled,
    $attempt,
    $wordLength,
    $targetTiledMainForms,
  ]) => {
    let $tilesState = get(tiles);
    const isNewGame =
      $guesses.length === 0 ||
      $guesses[0].length === 0 ||
      $guesses[0][0] === EMPTY_TILE;
    if (isNewGame) {
      $tilesState = range(0, $maxGuesses, false).map(() =>
        _.times(
          $wordLength,
          _.constant({ letters: EMPTY_TILE, hint: undefined })
        )
      );
    }

    const shouldColorPrevRow = $attempt > 0 && $guesses[$attempt].length == 0; // BUG : deleting all letters in row will update previous row state
    if (shouldColorPrevRow) {
      const guess = $guesses[$attempt - 1];
      $tilesState[$attempt - 1] = _.zip($tilesState[$attempt - 1]).map(
        ([prevState], i) => ({
          ...prevState,
          hint: getHint($targetTiledMainForms, guess, i),
        })
      );
    }

    const guess = $guesses[$attempt] || [];
    // console.debug($attempt, $guesses, guess);
    const guessPadded = guess.concat(
      _.times(get(wordLength) - guess.length, _.constant(EMPTY_TILE))
    );

    $tilesState[$attempt] = _.zip(guessPadded, $prefilled).map(([g, p]) => ({
      letters: g !== EMPTY_TILE ? g + p : p,
      hint: g === EMPTY_TILE ? "Prefill" : undefined,
    }));

    return $tilesState;
  }
);

function primaryLetterInTile(tileLetters: string): string {
  // This should be letter that occupies the main form in the tile
  // For complex letter combinations, this may be more complicated, as there could be prefixes & suffixes.
  return tileLetters.length > 0 ? tileLetters[0] : EMPTY_TILE;
}

function sansPrimaryLetterInTile(tileLetters: string): string {
  return tileLetters.length > 0 ? tileLetters.slice(1) : EMPTY_TILE;
}

export function convertToTiles(word: string, pad = true): string[] {
  const letters = getLangProps(get(lang)).Letters;
  const tiledWord = [...word].reduce((acc, ch, i) => {
    console.debug({ ch, letter: letters[ch], phase: "0", letters });
    if (
      ch in letters &&
      (letters[ch].hasFullForm !== false ||
        letters[ch].combinationRules === undefined)
    ) {
      console.debug({ ch, phase: "A" });
      return [...acc, ch];
    } else {
      let validMergeGroups = _.keys(letters)
        .map((k) => letters[k].combinationRules)
        .find((r) => r?.postForm == ch)?.canMergeOver;

      if (i > 0 && validMergeGroups !== undefined) {
        let prevChar = word[i - 1];
        const prevCharGroup =
          prevChar in letters
            ? letters[prevChar].group
            : _.keys(letters)
              .map((k) => letters[k])
              .find((l) => l.combinationRules?.postForm == ch).group;

        if (validMergeGroups.indexOf(prevCharGroup) !== -1) {
          console.debug({ acc, ch, phase: "B", last: acc[acc.length - 1] });
          return [...acc.slice(0, -1), acc[acc.length - 1] + ch];
        } else {
          console.debug({ word, prevChar, i, validMergeGroups });
          console.error({ ch, phase: "C" });
          return acc;
        }
      } else {
        // Not possible to have non-fullForm char at the start
        console.debug({ ch, letter: letters[ch], phase: "0", letters });
        console.error({ ch, phase: "D" });
        return acc;
      }
    }
  }, []);
  if (pad) {
    const paddedTiledGuess = tiledWord.concat(
      _.times(get(wordLength) - tiledWord.length, _.constant(EMPTY_TILE))
    );
    return paddedTiledGuess;
  } else {
    return tiledWord;
  }
}

export function newGame(tgt: string, tries: number) {
  guesses.set([[]]);
  target.set(tgt);
  maxGuesses.set(tries);
  attempt.set(0);
}

export function keyPress(k: string) {
  const $attempt = get(attempt);
  const $guesses = get(guesses);
  const $wordLength = get(wordLength);
  const $prefilled = get(prefilled);

  // console.debug({ $guesses, $attempt });
  const tiledGuess = $guesses[$attempt];

  if (k === "ENT") {
    // ENTER KEY
    if ($guesses[$attempt].length < $wordLength) {
      console.log("Word is short");
      return;
    }
    // TODO Validate and check win-game condition
    guesses.set([...$guesses, []]);
    attempt.set($attempt + 1);
    return;
  }

  if (k === "DEL") {
    // DELETE KEY
    if ($guesses[$attempt].length > 0) {
      guesses.set([...$guesses.slice(0, -1), tiledGuess.slice(0, -1)]);
    }
    return;
  }

  if ($guesses[$attempt].length >= $wordLength) {
    console.log("Max word size reached");
    return;
  }

  if ($prefilled[tiledGuess.length] !== "") {
    // Validate key combination. Eg: vowels cannot combine with vowels
    const letters = getLangProps(get(lang)).Letters;
    const ch = $prefilled[tiledGuess.length][0];

    let validMergeGroups = _.keys(letters)
      .map((k) => letters[k].combinationRules)
      .find((r) => {
        return r?.postForm == ch;
      })?.canMergeOver;

    if (validMergeGroups.indexOf(letters[k].group) === -1) {
      console.log(`Key [${k}] not compatible with prefill [${ch}]. Ignored.`);
      return;
    }
  }

  guesses.set([...$guesses.slice(0, -1), [...$guesses[$attempt], k]]);
}

export function gameLoaded() {
  const choice = randomInRange(0, 2);
  switch (choice) {
    case 0:
      lang.set("en");
      break;
    case 1:
      lang.set("hi");
      break;
    case 2:
      lang.set("ta");
      break;
  }

  let word: string;
  let tiledWord: string[];
  do {
    // NOTE: बच्चे vs बच्‍चे (the second one has a hidden character)
    word = choose(getLangProps(get(lang)).Words);
    console.debug(`Trying: Word: ${word} ..`);
    tiledWord = convertToTiles(word, false);
  } while (tiledWord.length < 3 || tiledWord.length > 6);

  console.debug(`New Game: Word: ${word}`, tiledWord);
  newGame(word, tiledWord.length + 2);
}
