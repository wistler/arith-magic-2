/**
 * This provides a mechanism to pass a promise around, so that it can be
 * resolved/rejectd by another entity.
 */
export class Promiser<T> {
  private promise: Promise<T>;
  private resolve: (value?: T | PromiseLike<T> | undefined) => void = () => null;
  private reject: (reason?: unknown) => void = () => null;

  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }

  get(): Promise<T> {
    return this.promise;
  }

  onfulfil(data: T) {
    this.resolve(data);
  }

  onrejected(reason: unknown) {
    this.reject(reason);
  }
}
