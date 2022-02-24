/* eslint-disable @typescript-eslint/no-explicit-any */
import { transform, isEqual, keys, isObject } from 'lodash';

/**
 * Deep diff between two object, using lodash
 * @param  {Object} object Object compared
 * @param  {Object} base   Object to compare with
 * @return {Object}        Return a new object who represent the diff
 */
export function difference<T>(object: T, base: T) {
  function changes<T>(object: T, base: T) {
    const res = transform<any, any>(object, function (result: any, value, key) {
      if (!isEqual(value, base[key])) {
        if (isObject(value) && isObject(base[key])) {
          const ch = changes(value, base[key]);
          if (keys(ch).length !== 0) {
            result[key] = ch;
            // console.debug({
            //   key: key,
            //   isObject: true,
            //   change: changes(value, base[key]),
            // });
          }
        } else {
          // console.debug({ key: key, isObject: false });
          result[key] = { left: value, right: base[key] };
        }
      }
    });
    return keys(res).length === 0 ? undefined : res;
  }
  return changes(object, base);
}
