import NodeCache from "node-cache";

export class BotCache extends NodeCache {
  constructor(options = {}) {
    super(options);
  }

  find(fn) {
    if (typeof fn !== "function") throw new TypeError(`${fn} is not a function`);

    for (const key of this.keys()) {
      const value = this.get(key);
      if (fn(value, key, this)) return value;
    }

    return undefined;
  }

  filter(fn) {
    if (typeof fn !== "function") throw new TypeError(`${fn} is not a function`);

    const result = new BotCache();

    for (const key of this.keys()) {
      const value = this.get(key);
      if (fn(value, key, this)) result.set(key, value);
    }

    return result;
  }

  reduce(fn, initialValue) {
    if (typeof fn !== "function") throw new TypeError(`${fn} is not a function`);

    let acc = initialValue;
    let started = arguments.length >= 2;

    for (const key of this.keys()) {
      const value = this.get(key);

      if (!started) {
        acc = value;
        started = true;
      } else {
        acc = fn(acc, value, key, this);
      }
    }

    if (!started) throw new TypeError("Reduce of empty collection with no initial value");

    return acc;
  }

  map(fn) {
    if (typeof fn !== "function") throw new TypeError(`${fn} is not a function`);

    const result = new BotCache();

    for (const key of this.keys()) {
      const value = this.get(key);
      result.set(key, fn(value, key, this));
    }

    return result;
  }

  first() {
    const keys = this.keys();
    return keys.length ? this.get(keys[0]) : undefined;
  }

  last() {
    const keys = this.keys();
    return keys.length ? this.get(keys[keys.length - 1]) : undefined;
  }

  random() {
    const keys = this.keys();
    if (!keys.length) return undefined;

    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    return this.get(randomKey);
  }
}
