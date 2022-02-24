import { isArray, isObject, mapValues } from 'lodash';

/**
 * Create a deep path builder for a given type
 */
export function path<T>() {
  /** Returns a function that gets the next path builder */
  function subpath<T, TKey extends keyof T>(parent: string[], key: TKey): PathResult<T[TKey]> {
    const newPath = [...parent, key as string];
    const x = (<TSubKey extends keyof T[TKey]>(subkey: TSubKey) =>
      subpath<T[TKey], TSubKey>(newPath, subkey)) as PathResult<T[TKey]>;
    x.path = newPath;
    x.freeze = () => ({ path: newPath });
    return x;
  }

  return <TKey extends keyof T>(key: TKey) => subpath<T, TKey>([], key);
}

export type PathResult<T> = NotFrozen & {
  <TSubKey extends keyof T>(key: TSubKey): PathResult<T[TSubKey]>;
  /** Gets the resulting path */
  path: string[];
  freeze(): FixedPath;
};

export type FixedPath = Readonly<{ path: readonly string[] }>;

/**
 * If a message is not frozen, it cannot be serialized.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type NotFrozen = { freeze(): any };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function notFrozen(obj: any): obj is NotFrozen {
  return typeof obj.freeze === 'function';
  // return true;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function freeze(source: any) {
  if (isArray(source)) {
    return source.map((s) => freeze(s));
  } else if (isObject(source)) {
    if (notFrozen(source)) {
      return source.freeze();
    } else {
      return mapValues(source, (v) => freeze(v));
    }
  } else {
    return source;
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function removeKey(k, { [k]: _, ...o }) {
  return o;
}
