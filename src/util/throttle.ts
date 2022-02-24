import { isEqual } from 'lodash';
import { Container, createContainer } from './container';

export type TickFnType = () => { tick: number; tickDuration: number };
export type LimitType = { type: 'speed'; minDelayMS: number } | { type: 'freq'; maxRateHz: number };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type LimiterStateType = { lastValue: any; lastEventTick: number };

/**
 * This is a MAX SPEED / MAX FREQ / MIN DELAY limiter.
 * Returns a fn() that returns `true` if invoked within the set limits.
 *
 * There is a possible need to persist this state data (for very slow events?) across server restart, so adding a persistnce hook.
 */
export function createLimiter(
  limit: LimitType,
  getTick: TickFnType,
  container: Container<LimiterStateType> | undefined = undefined,
) {
  const [, getState, setState] =
    container ||
    createContainer<LimiterStateType>({
      lastValue: undefined,
      lastEventTick: 0,
    });
  const minDelay = limit.type === 'freq' ? 1000 / limit.maxRateHz : limit.minDelayMS;

  return function limiter<V>(value: V | undefined | null): boolean {
    const { tick, tickDuration } = getTick();
    const { lastValue, lastEventTick: lastAllowedTick } = getState();

    const now = tick * tickDuration;
    const delay = now - lastAllowedTick;

    let allowed = false;

    if (delay > minDelay) {
      allowed = true;
    } else if (!(value === lastValue || isEqual(value, lastValue))) {
      allowed = true;
    }

    if (allowed) {
      setState({
        lastValue: value,
        lastEventTick: now,
      });
    }

    return allowed;
  };
}

type Consumer<T> = (arg: T) => void;
type Map<T, V> = (t: T) => V | undefined | null;

export function speedLimit<T>(limit: LimitType, getTick: TickFnType) {
  const limiter = createLimiter(limit, getTick);
  return <V>(fn: Consumer<T>, limitBy: Map<T, V> = () => undefined): Consumer<T> =>
    (event: T) =>
      limiter<V>(limitBy(event)) && fn(event);
}

export function limitCheck<V>({
  value,
  limit,
  state: limiterState,
  tick,
  tickDuration,
}: {
  value?: V | null;
  limit: LimitType;
  state: LimiterStateType;
  tick: number;
  tickDuration: number;
}): boolean {
  const { lastValue, lastEventTick } = limiterState;
  const minDelay = limit.type === 'freq' ? 1000 / limit.maxRateHz : limit.minDelayMS;

  const delay = (tick - lastEventTick) * tickDuration;

  let allowed = false;

  if (delay >= minDelay) {
    allowed = true;
  } else if (!(value === lastValue || isEqual(value, lastValue))) {
    allowed = true;
  }

  return allowed;
}
