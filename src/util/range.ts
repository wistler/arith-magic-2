export function range(start: number, end: number, includeEnd = true): number[] {
  const o = Math.min(start, end);
  const count = Math.abs(start - end) + (includeEnd ? 1 : 0);
  return Array.from(Array(count).keys(), (v) => o + v);
}

export function randomInRange(min: number, max: number) {
  return Math.round(Math.random() * (max - min)) + min;
}

export function roll(n: number, d: number): number {
  return Array(n)
    .fill(1)
    .map(() => randomInRange(1, d))
    .reduce((s, x) => s + x, 0);
}

export function choose<T>(from: T[]): T {
  return from[randomInRange(0, from.length - 1)];
}
