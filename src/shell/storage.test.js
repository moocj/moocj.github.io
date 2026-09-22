import { describe, expect, it } from "vitest";

import { createStorage } from "./storage.js";

// A stand-in for window.localStorage: same two methods, nothing else.

function fakeStore(initial = {}) {
  const held = { ...initial };

  return {
    held,
    getItem: (key) => (key in held ? held[key] : null),
    setItem: (key, value) => {
      held[key] = String(value);
    },
  };
}

const brokenStore = {
  getItem: () => {
    throw new Error("storage is not available");
  },
  setItem: () => {
    throw new Error("quota exceeded");
  },
};

describe("what the desktop remembers", () => {
  it("remembers nothing the first time, and says so", () => {
    expect(createStorage(fakeStore()).read()).toEqual({ open: false, app: null, booted: false });
  });

  it("gives back exactly what it was told to remember", () => {
    const store = fakeStore();
    const storage = createStorage(store);

    storage.write({ open: true, app: "terminal", booted: true });

    expect(storage.read()).toEqual({ open: true, app: "terminal", booted: true });
  });

  it("survives a store that is full, disabled or missing", () => {
    const broken = createStorage(brokenStore);

    expect(() => broken.write({ open: true, app: "terminal" })).not.toThrow();
    expect(broken.read()).toEqual({ open: false, app: null, booted: false });
  });

  it("falls back to a bare desktop when the stored value is not what it wrote", () => {
    const storage = createStorage(fakeStore({ "portfolio.desktop": "{ not json at all" }));

    expect(storage.read()).toEqual({ open: false, app: null, booted: false });
  });

  it("only believes the three fields it knows about", () => {
    const store = fakeStore({
      "portfolio.desktop": JSON.stringify({ open: "yes", app: 42, junk: true }),
    });

    expect(createStorage(store).read()).toEqual({ open: false, app: null, booted: false });
  });

  it("writes nothing but the three fields, as a string", () => {
    const store = fakeStore();

    createStorage(store).write({ open: true, app: null, junk: "ignored" });

    expect(store.held["portfolio.desktop"]).toBe('{"open":true,"app":null,"booted":false}');
  });
});
