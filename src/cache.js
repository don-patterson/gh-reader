const now = () => new Date().getTime() / 1000;

const minutesSince = unixTimestamp => {
  return Math.floor((now() - unixTimestamp) / 60);
};

export class Cache {
  /* Just a plain cache that remembers things for a short while.
   * If it gets too big, it deletes keys in insertion order.
   *
   * This is only meant to live long enough to keep a single page
   * app from spamming github while you click back and forth, so it
   * hasn't been really tested under demanding circumstances.
   */
  constructor({maxSize = 15, expiryMinutes = 15, defaultFetch = () => null}) {
    this.maxSize = maxSize;
    this.expiryMinutes = expiryMinutes;
    this.defaultFetch = defaultFetch;
    this.items = new Map();
  }

  _clean = () => {
    while (this.items.size > this.maxSize) {
      const keyToDelete = this.items.keys().next().value;
      this.items.delete(keyToDelete);
    }
  };

  set = (key, value) => {
    setTimeout(this._clean, 0);
    this.items.set(key, {timestamp: now(), value});
    return value;
  };

  get = async (key, fetchLatest = this.defaultFetch) => {
    const cached = this.items.get(key);
    if (
      cached === undefined ||
      minutesSince(cached.timestamp) > this.expiryMinutes
    ) {
      return this.set(key, await fetchLatest(key));
    }
    return cached.value;
  };
}
