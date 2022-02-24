import { capitalize, upperCase, isNumber, isString } from "lodash";
import { FixedPath, freeze, notFrozen, path, PathResult } from "../util/path";
import en, * as EN from "./en";
import ta, * as TN from "./ta";
import hi, * as HI from "./hi";

const strings = {
  en,
  ta,
  hi,
};

const LANG_PROPS = {
  en: EN,
  ta: TN,
  hi: HI,
};

export type LangKey = keyof typeof strings;
type TrKeysType = typeof strings["en"];

let currentLanguage: LangKey = "en";

// infer lang from client request, so each client see in their lang.
export function setLang(langKey: LangKey) {
  currentLanguage = langKey;
}

export function getCurrentLang() {
  return currentLanguage;
}

export function getCurrentLangProps() {
  return LANG_PROPS[currentLanguage];
}

export function getLangProps(lang: LangKey) {
  return LANG_PROPS[lang];
}

export type TranslationOptions = {
  casing: "none" | "capitalize" | "upperCase";
};

export const TrKeys = path<TrKeysType>();
export const k = TrKeys;

export type TranslationKey<T> = PathResult<T>;
export type StringTranslationKey =
  | FixedPath
  | string
  | number
  | {
      key: StringTranslationKey;
      args?: StringTranslationKey[];
    };

function apply(message: string, opts: TranslationOptions) {
  if (opts?.casing) {
    switch (opts.casing) {
      case "capitalize":
        return capitalize(message);
      case "upperCase":
        return upperCase(message);
      case "none":
        return message;
    }
  }
  return message;
}

export function translate(
  key: StringTranslationKey,
  opts?: TranslationOptions
): string {
  if (key === undefined) {
    return "."; // crash-safe; should not happen in PROD.
  }

  if (isNumber(key)) {
    return key.toString();
  }

  if (isString(key)) {
    return apply(key as string, opts);
  }

  if ((key as FixedPath).path !== undefined) {
    if (notFrozen(key)) {
      console.error(key);
      throw new Error("translate() key not frozen");
    }
    const tk = key as FixedPath;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let dict: any = strings[currentLanguage];
    for (const k in tk.path) {
      dict = dict[tk.path[k]];
    }
    return apply(dict, opts);
  }

  const { key: messageKey, args } = key as {
    key: StringTranslationKey;
    args?: StringTranslationKey[];
  };
  let translatedMessage = translate(messageKey, opts);
  args?.forEach((arg) => {
    translatedMessage = translatedMessage.replace("%s", translate(arg, opts));
  });
  return apply(translatedMessage, opts);
}

export function t(key: StringTranslationKey): string {
  if (notFrozen(key)) {
    key = freeze(key);
  }
  return translate(key);
}

/***

console.debug({
  desc: "Freeze Tests",
  test_a: freeze(["one", "two", "tree"]),
  test_b: freeze({ a: 1, b: 2 }),
  test_c: freeze({ a: 1, b: 2, freeze: () => ({ x: 4, y: 6 }) }),
  test_d: freeze("Hello"),
  test_e: freeze(-12.4),
  test_1: TrKeys("tiles")("ground"),
  test_2: freeze(TrKeys("tiles")("ground")),
});

console.debug({
  desc: "Translation Tests",
  test_1: TrKeys("tiles")("ground"),
  test_2: TrKeys("tiles")("ground").freeze(),
});

console.debug({
  desc: "Translation Tests",
  test_1: JSON.stringify(TrKeys("tiles")("ground").freeze()),
  test_2: JSON.parse(JSON.stringify(TrKeys("tiles")("ground").freeze())),
  test_3: JSON.stringify(TrKeys("tiles").freeze()),
  test_4: JSON.parse(JSON.stringify(TrKeys("tiles").freeze())),
});

console.debug({
  desc: "Translation Tests",
  test_4: translate("Non-translated string", { casing: "capitalize" }),
});

console.debug({
  desc: "Translation Tests",
  test_2: translate(freeze(TrKeys("tiles")("ground")), { casing: "capitalize" }),
  test_3: translate(TrKeys("tiles")("ground").freeze(), { casing: "capitalize" }),
});

console.debug({
  desc: "Translation Tests",
  test_3: translate(
    { message: freeze(TrKeys("monsters")("remains")), args: ["hello world"] },
    { casing: "capitalize" }
  ),
  test_4: translate(
    { message: TrKeys("monsters")("remains").freeze(), args: ["hello world"] },
    { casing: "capitalize" }
  ),
});

*/
