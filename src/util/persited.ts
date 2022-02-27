import { writable, Writable } from "svelte/store";

export function persisted<T>(key: string, def: T): Writable<T> {
  const prev = localStorage.getItem(key);
  const store = writable(prev ? JSON.parse(prev) : def);
  store.subscribe((val) => {
    localStorage.setItem(key, JSON.stringify(val));
  });
  return store;
}
