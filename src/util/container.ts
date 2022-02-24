import { isFunction } from 'lodash';

export type Sub<T> = (update: T, prev?: T) => void;
export type Notifier<T> = (s: Sub<T>) => void;
export type Consumer<T> = <R>(fn: (s: T) => R) => R;
export type Getter<T> = () => T;
export type SetterArgFn<T> = (s: T) => Partial<T>;
export type Setter<T> = (valueOrSetter: Partial<T> | SetterArgFn<T>) => void;

export type Container<T> = [Consumer<T>, Getter<T>, Setter<T>, Notifier<T>, Notifier<T>];

export function createContainer<T>(initValue: T): Container<T> {
  let __prop: T = initValue;
  const __subs: Sub<T>[] = [];

  function map<Q>(fn: (s: T) => Q): Q {
    return fn(__prop);
  }

  function get() {
    return __prop;
  }

  function set(setter: Partial<T> | ((state: T) => Partial<T>)) {
    const __old_prop = get();
    if (isFunction(setter)) {
      const s = setter(__old_prop);
      __prop = { ...__prop, ...s };
    } else {
      __prop = { ...__prop, ...setter };
    }
    __subs.forEach((s) => s(__prop, __old_prop));
  }

  function sub(s: Sub<T>) {
    __subs.push(s);
    // TODO make notify on sub configurable by caller ?
    s(get());
  }

  function unsub(s: Sub<T>) {
    __subs.slice(__subs.indexOf(s), 1);
  }

  return [map, get, set, sub, unsub];
}
