export default class Observable<T> {
  private _listeners: Set<() => void>;
  public _value: T;

  constructor(value: T) {
    this._value = value;
    this._listeners = new Set();
  }

  public set(value: T) {
    const needTrigger = this._value !== value;
    this._value = value;
    if (needTrigger) {
      this.emit();
    }
  }

  public get(): T {
    return this._value;
  }

  public subscribe(fn: () => void): () => void {
    this._listeners.add(fn);

    return () => {
      this.unsubscribe(fn);
    };
  }

  public unsubscribe(fn: () => void) {
    this._listeners.delete(fn);
  }

  public emit() {
    this._listeners.forEach((fn) => {
      fn();
    });
  }
}