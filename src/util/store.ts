/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Consumer,
  Getter,
  Setter,
  Notifier,
  createContainer,
} from "./container";

export type StoreOptions = Partial<{
  persistOnUpdate: boolean;
}>;

export type Store<T> = {
  map: Consumer<T>;
  get: Getter<T>;
  update: Setter<Partial<T>>;
  subscribe: Notifier<T>;
  unsubscribe: Notifier<T>;
  key: string;
  options: StoreOptions;
};

export const createStoreCreator =
  <T>(initData?: T) =>
  (key: string, options?: StoreOptions) =>
    createStore(key, options, initData);

export function createStore<T>(
  key: string,
  options?: StoreOptions,
  initValue?: T
): Store<T> {
  const [map, get, set, sub, unsub] = createContainer(initValue);

  const store = {
    key,
    options,
    map,
    get,
    update: set,
    subscribe: sub,
    unsubscribe: unsub,
  };

  if (options?.persistOnUpdate) {
    sub((_, prev) => {
      if (prev == null) {
        return;
      }
      const serialized = serializeStore(store);
      localStorage.setItem(store.key, serialized);
    });
  }

  return store;
}

export function serializeStore<T>(store: Store<T>): string {
  return JSON.stringify(store.get());
}

export function hydrateStore<T>(store: Store<T>, serialized: string): void {
  if (serialized) {
    store.update(JSON.parse(serialized));
  }
}
