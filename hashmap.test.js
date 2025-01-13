import HashMap from "./hashmap";

const values = ["hi", 1, true, { key: "value" }];
let map;

beforeEach(() => {
  map = new HashMap();
});

describe("constructor", () => {
  it("creates a HashMap instance with an empty array", () => {
    expect(map.buckets).toEqual([]);
  });

  it("creates a HashMap instance with a size of zero", () => {
    expect(map.size).toEqual(0);
  });
});

describe("get function", () => {
  it("accesses a an existing value in the map", () => {
    map.set("key", "value");
    expect(map.get("key")).toEqual("value");
  });

  it("returns null when a key does not exist in the map", () => {
    map.set("key", "value");
    expect(map.get("another key")).toEqual(null);
  });
});

describe("set function", () => {
  it("adds a new key-value pair to the map", () => {
    map.set("key", "value");
    const val = map.buckets[map.hash("key")].value;
    expect(val).toEqual("value");
  });

  it("updates existing key-value pair", () => {
    map.set("key", "value");
    map.set("key", "new value");
    const val = map.buckets[map.hash("key")].value;
    expect(val).toEqual("new value");
  });
});

describe("has function", () => {
  it("returns true when a key-value pair exists in the map", () => {
    map.set("key", "value");
    expect(map.has("key")).toBeTruthy();
  });

  it("returns false when a key-value pair does not exist in the map", () => {
    map.set("key", "value");
    expect(map.has("another key")).toBeFalsy();
  });
});

describe("remove function", () => {
  it("removes a key-value pair from the map", () => {
    map.set("key", "value");
    map.remove("key");

    expect(map.has("key")).toBeFalsy();
  });

  it("does not remove a key-value that is not in the map", () => {
    map.set("key", "value");
    map.remove("another key");

    expect(map.size).toEqual(1);
    expect(map.has("key")).toBeTruthy();
    expect(map.has("another key")).toBeFalsy();
  });
});

describe("length function", () => {
  it("returns a length of 0 if the map is empty", () => {
    expect(map.length()).toEqual(0);
  });

  it("returns a length equal to the number of key-value pairs", () => {
    for (let i = 0; i < values.length; i++) {
      map.set(i, values[i]);
    }

    expect(map.length()).toEqual(values.length);
  });
});

describe("clear function", () => {
  it("removes all key-value pairs from the map", () => {
    for (let i = 0; i < values.length; i++) {
      map.set(i, values[i]);
    }
    map.clear();

    expect(map.length()).toEqual(0);
    expect(map.has("hi")).toBeFalsy();
    expect(map.has(1)).toBeFalsy();
    expect(map.has(true)).toBeFalsy();
    expect(map.has({ key: "value" })).toBeFalsy();
  });
});

describe("keys function", () => {
  it("returns an empty array if the map is emtpy", () => {
    expect(map.keys()).toEqual([]);
  });

  it("returns an array of keys from the key-value pairs in the map", () => {
    for (let i = 0; i < values.length; i++) {
      map.set(i, values[i]);
    }

    expect(map.keys()).toEqual([0, 1, 2, 3]);
  });
});

describe("values function", () => {
  it("returns an empty array if the map is emtpy", () => {
    expect(map.values()).toEqual([]);
  });

  it("returns an array of values from the key-value pairs in the map", () => {
    for (let i = 0; i < values.length; i++) {
      map.set(i, values[i]);
    }

    expect(map.values()).toEqual(values);
  });
});

describe("entries function", () => {
  it("returns an empty array if the map is emtpy", () => {
    expect(map.entries()).toEqual([]);
  });
  it("returns an array of key-value pairs in the map", () => {
    for (let i = 0; i < values.length; i++) {
      map.set(i, values[i]);
    }

    const expectedEntries = [
      { key: 0, value: "hi" },
      { key: 1, value: 1 },
      { key: 2, value: true },
      { key: 3, value: { key: "value" } },
    ];

    expect(map.entries()).toEqual(expectedEntries);
  });
});

describe("isAtCapacity function", () => {
  it("returns true if the ratio of entries to array length is at capacity", () => {
    map.buckets = new Array(5);
    map.size = 25;

    expect(map.isAtCapacity()).toBeTruthy();
  });

  it("returns true if the ratio of entries to array length is above capacity", () => {
    map.buckets = new Array(5);
    map.size = 500;

    expect(map.isAtCapacity()).toBeTruthy();
  });

  it("returns false if the ratio of entries to array length is below capacity", () => {
    map.buckets = new Array(5);
    map.size = 5;

    expect(map.isAtCapacity()).toBeFalsy();
  });
});

describe("isNearEmpty function", () => {
  it("returns true if the ratio of entries to array length is equal to inverse capacity", () => {
    map.buckets = new Array(25);
    map.size = 5;

    expect(map.isNearEmpty()).toBeTruthy();
  });

  it("returns true if the ratio of entries to array length is below inverse capacity", () => {
    map.buckets = new Array(25);
    map.size = 2;

    expect(map.isNearEmpty()).toBeTruthy();
  });

  it("returns false if the ratio of entries to array length is above inverse capacity", () => {
    map.buckets = new Array(5);
    map.size = 5;

    expect(map.isAtCapacity()).toBeFalsy();
  });
});

describe("resize function", () => {
  it("maps the same key-value pairs onto a differently sized array", () => {
    let copy = new HashMap()

    for (let i = 0; i < values.length; i++) {
      map.set(i, values[i])
      copy.set(i, values[i])
    }

    copy.resize(copy.capacity * copy.size)
    expect(copy.entries()).toEqual(map.entries())

  })
});

describe("hash function", () => {
  //default map capacity
  const n = 5;
  it("does not accept functions", () => {
    const key = () => {};

    expect(() => map.hash(key)).toThrow("Invalid key type");
  });

  it("does not accept sumbols", () => {
    const key = Symbol();

    expect(() => map.hash(key)).toThrow("Invalid key type");
  });

  it("hashes numbers", () => {
    map.buckets = new Array(n);
    const num = 22;

    expect(map.hash(num)).toBeGreaterThanOrEqual(0);
    expect(map.hash(num)).toBeLessThan(5);
  });

  it("hashes bigInt", () => {
    map.buckets = new Array(n);
    const num = BigInt("12340092836740912863409182630948162039486120938461");

    expect(map.hash(num)).toBeGreaterThanOrEqual(0);
    expect(map.hash(num)).toBeLessThan(5);
  });

  it("hashes booleans", () => {
    map.buckets = new Array(n);
    const bool = true;

    expect(map.hash(bool)).toBeGreaterThanOrEqual(0);
    expect(map.hash(bool)).toBeLessThan(5);
  });

  it("hashes strings", () => {
    map.buckets = new Array(n);
    const str = "This is a string";

    expect(map.hash(str)).toBeGreaterThanOrEqual(0);
    expect(map.hash(str)).toBeLessThan(5);
  });

  it("hashes arrays", () => {
    map.buckets = new Array(n);
    const arr = [1, 2, "3", true];

    expect(map.hash(arr)).toBeGreaterThanOrEqual(0);
    expect(map.hash(arr)).toBeLessThan(5);
  });

  it("hashes objects", () => {
    map.buckets = new Array(n);
    const obj = {
      name: "John",
      age: 23,
      books: [
        {
          title: "Tale of Two Cities",
          author: "Charles Dickens",
        },
      ],
      id: BigInt("19832764918276349812763987612394"),
    };

    expect(map.hash(obj)).toBeGreaterThanOrEqual(0);
    expect(map.hash(obj)).toBeLessThan(5);
  });
});
