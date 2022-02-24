/* eslint-disable @typescript-eslint/no-explicit-any */
import { Promiser } from './promiser';
type Consumer<T> = (item: T) => void;

export class SimpleMutex {
  private obj: Promiser<any>;
  constructor() {
    this.obj = new Promiser<any>();
  }
  public lock() {
    return this.obj.get();
  }
  public release() {
    this.obj.onfulfil(true);
  }
}

export class ManagedQueue<T> {
  private __queue: T[] = [];
  private __lock: Promise<any> | undefined = undefined;
  private conflictChecker: (newItem: T, record: T) => boolean;

  constructor(conflictChecker: (newItem: T, record: T) => boolean) {
    this.conflictChecker = conflictChecker;
  }

  async add(newItem: T): Promise<boolean> {
    // await lock
    await this.__lock;

    // acquire lock
    const mutex = new SimpleMutex();
    this.__lock = mutex.lock();

    let added = false;
    if (!this.__queue.some((record) => this.conflictChecker(newItem, record))) {
      this.__queue.push(newItem);
      added = true;
    }

    // release lock
    mutex.release();

    return added;
  }

  /**
   * caller must release the lock, when done.
   */
  async lock(): Promise<SimpleMutex> {
    await this.__lock;

    // acquire lock
    const mutex = new SimpleMutex();
    this.__lock = mutex.lock();

    return mutex;
  }

  queue() {
    return this.__queue;
  }

  async consumeAll(consumer: Consumer<T>): Promise<void> {
    // await lock
    await this.__lock;

    // acquire lock
    const mutex = new SimpleMutex();
    this.__lock = mutex.lock();

    this.__queue.forEach(consumer);
    this.__queue.splice(0);

    // release lock
    mutex.release();
  }
}
