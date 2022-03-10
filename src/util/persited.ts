import _ from "lodash";
import { writable, Writable } from "svelte/store";

function mergeState(hydrated: any, def: any): any {
  if (_.isArray(def) || _.isString(def) || _.isNumber(def) || _.isBoolean(def)) {
    return hydrated !== undefined && hydrated !== null ? hydrated : def;
  }
  return { ...def, ...hydrated };
}

export function persisted<T>(key: string, def: T, mergeFn: (saved: T, def: T) => T = undefined): Writable<T> {
  const prev = localStorage.getItem(key);
  const store = writable((mergeFn || mergeState)(JSON.parse(prev), def));
  store.subscribe((val) => {
    localStorage.setItem(key, JSON.stringify(val));
  });
  return store;
}
