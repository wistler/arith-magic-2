import { KeyboardLayout, LetterProps, TileLayout } from "./@types";

export default {
  title: "Wordle",
  menu: {
    start: "Start",
    settings: "Settings",
  },
};

export const Letters: Record<string, LetterProps> = {
  Q: { value: 1, count: 2, keyboardRow: 1 },
  W: { value: 1, count: 2, keyboardRow: 1 },
  E: { value: 1, count: 2, keyboardRow: 1 },
  R: { value: 1, count: 2, keyboardRow: 1 },
  T: { value: 1, count: 2, keyboardRow: 1 },
  Y: { value: 1, count: 2, keyboardRow: 1 },
  U: { value: 1, count: 2, keyboardRow: 1 },
  I: { value: 1, count: 2, keyboardRow: 1 },
  O: { value: 1, count: 2, keyboardRow: 1 },
  P: { value: 1, count: 2, keyboardRow: 1 },

  A: { value: 1, count: 2, keyboardRow: 2 },
  S: { value: 1, count: 2, keyboardRow: 2 },
  D: { value: 1, count: 2, keyboardRow: 2 },
  F: { value: 1, count: 2, keyboardRow: 2 },
  G: { value: 1, count: 2, keyboardRow: 2 },
  H: { value: 1, count: 2, keyboardRow: 2 },
  J: { value: 1, count: 2, keyboardRow: 2 },
  K: { value: 1, count: 2, keyboardRow: 2 },
  L: { value: 1, count: 2, keyboardRow: 2 },

  Z: { value: 1, count: 2, keyboardRow: 3 },
  X: { value: 1, count: 2, keyboardRow: 3 },
  C: { value: 1, count: 2, keyboardRow: 3 },
  V: { value: 1, count: 2, keyboardRow: 3 },
  B: { value: 1, count: 2, keyboardRow: 3 },
  N: { value: 1, count: 2, keyboardRow: 3 },
  M: { value: 1, count: 2, keyboardRow: 3 },
};

export const TileConfig: TileLayout = {
  aspectRatio: 1.0,
};

export const Keyboard: KeyboardLayout = {
  columns: 22,
  defaultKeyWidth: 2,
  rows: [
    {
      keys: ["", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    },
    {
      keys: ["", "", "", "A", "S", "D", "F", "G", "H", "J", "K", "L"],
    },
    {
      keys: [
        { ch: "DEL", keyWidth: 3 },
        "",
        "Z",
        "X",
        "C",
        "V",
        "B",
        "N",
        "M",
        "",
        { ch: "ENT", keyWidth: 3 },
      ],
    },
  ],
};

export const Words = ["SAMPLE"];
