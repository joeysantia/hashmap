export default class HashMap {
  constructor(capacity = 5) {
    this.buckets = [];
    this.size = 0;
    this.capacity = capacity;
  }

  get(key) {
    let cur = this.buckets[this.hash(key)];

    while (cur) {
      if (cur.key === key) {
        return cur.value;
      }

      cur = cur.next;
    }

    return null;
  }

  set(key, value) {
    let cur = this.buckets[this.hash(key)];

    while (cur) {
      if (cur.key === key) {
        cur.value = value;
        return;
      }
    }

    this.size++;
    if (this.isAtCapacity()) {
      this.resize(this.capacity * this.size);
    }

    const idx = this.hash(key);
    this.buckets[idx] = new Node(key, value, this.buckets[idx]);
  }

  has(key) {
    if (this.size === 0) return false;
    let cur = this.buckets[this.hash(key)];

    while (cur) {
      if (cur.key === key) return true;

      cur = cur.next;
    }

    return false;
  }

  remove(key) {
    if (!this.has(key)) return;

    this.size--;
    if (this.isNearEmpty()) {
      this.resize(this.size / this.capacity);
    }

    let cur = this.buckets[this.hash(key)];
    if (cur.key === key) {
      this.buckets[this.hash(key)] = cur.next;
      return;
    }

    while (cur.next) {
      if (cur.next.key === key) {
        cur.next = cur.next.next;
        return;
      }

      cur = cur.next;
    }
  }

  length() {
    return this.size;
  }

  clear() {
    this.buckets = [];
    this.size = 0;
  }

  keys() {
    let keys = [];

    for (const head of this.buckets) {
      let cur = head;

      while (cur) {
        keys.push(cur.key);

        cur = cur.next;
      }
    }

    return keys;
  }

  values() {
    let values = [];

    for (const head of this.buckets) {
      let cur = head;

      while (cur) {
        values.push(cur.value);
        cur = cur.next;
      }
    }

    return values;
  }

  entries() {
    let entries = [];

    for (const head of this.buckets) {
      let cur = head;

      while (cur) {
        entries.push({ key: cur.key, value: cur.value });
        cur = cur.next;
      }
    }

    return entries;
  }

  isAtCapacity() {
    return this.size / this.buckets.length >= this.capacity;
  }

  isNearEmpty() {
    return this.size / this.buckets.length <= 1 / this.capacity;
  }

  resize(capacity) {
    const entries = this.entries();
    this.buckets = new Array(capacity);

    for (const { key, value } of entries) {
      this.set(key, value);
    }
  }

  hash(key) {
    const n = this.buckets.length;
    if (typeof key === "function" || typeof key === "symbol") {
      throw new Error("Invalid key type");
    }
    if (typeof key === "number") return key % n;
    if (typeof key === "bigint") return key % BigInt(n);

    if (typeof key === "boolean") return Number(key) % n;
    if (typeof key === "string") {
      let hash = 0;

      for (let i = 0; i < key.length; i++) {
        hash = 31 * hash + key.charCodeAt(i);
      }
      return hash % n;
    }
    if (typeof key === "object") {
      let hash = BigInt(0);

      for (const k in key) {
        hash += BigInt(this.hash(key[k]));
      }

      return hash % BigInt(n);
    }
  }
}

class Node {
  constructor(key = null, value = null, next = null) {
    this.key = key;
    this.value = value;
    this.next = next;
  }
}
