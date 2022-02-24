export type LetterGroups = "vowel" | "consonent";

export type LetterProps = {
  value: number;
  count: number;
  group?: LetterGroups;
  keyboardRow?: number;
  hasFullForm?: boolean;

  /**
   * References:
   * https://docs.microsoft.com/en-us/typography/script-development/tamil
   * https://docs.microsoft.com/en-us/typography/script-development/kannada
   * https://docs.microsoft.com/en-us/typography/script-development/devanagari
   */
  combinationRules?: {
    canMergeOver?: (string | LetterGroups)[];
    cannotMergeOver?: (string | LetterGroups)[];
    postForm?: string;
  };
};

export type TileLayout = {
  aspectRatio: number
}

export type KeyboardLayout = {
  columns: number,
  defaultKeyWidth: number,
  rows: {
    keys: ({ ch: string, keyWidth?: number } | string )[],
    offset?: boolean,
  }[], 
}
