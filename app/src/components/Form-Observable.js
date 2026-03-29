export default class Observable {
  constructor(value) {
    this._value = value;
    this._listeners = new Set();
  }

  set(value) {
    const needTrigger = this._value !== value;
    this._value = value;
    if (needTrigger) {
      this.emit();
    }
  }

  get() {
    return this._value;
  }

  subscribe(fn) {
    this._listeners.add(fn);
    return () => {
      this.unsubscribe(fn);
    };
  }

  unsubscribe(fn) {
    this._listeners.delete(fn);
  }

  emit() {
    this._listeners.forEach((fn) => {
      fn();
    });
  }
}