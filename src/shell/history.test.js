import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { createHistory } from "./history.js";

const historyWith = (...lines) => {
  const history = createHistory();
  for (const line of lines) history.add(line);
  return history;
};

describe("the line history", () => {
  it("walks back through what was typed, newest first", () => {
    const history = historyWith("help", "ls", "cat about.txt");

    expect(history.older("")).toBe("cat about.txt");
    expect(history.older("")).toBe("ls");
    expect(history.older("")).toBe("help");
  });

  it("stays put at the oldest entry instead of erroring", () => {
    const history = historyWith("help");

    expect(history.older("")).toBe("help");
    expect(history.older("")).toBeNull();
    expect(history.older("")).toBeNull();
  });

  it("hands back the half-typed line when you walk forward past the newest", () => {
    const history = historyWith("help");

    expect(history.older("cat ab")).toBe("help");
    expect(history.newer()).toBe("cat ab");
  });

  it("says nothing when there is nothing newer to go to", () => {
    const history = historyWith("help");

    expect(history.newer()).toBeNull();
  });

  it("does not walk anywhere when nothing has been typed yet", () => {
    const history = createHistory();

    expect(history.older("draft")).toBeNull();
    expect(history.newer()).toBeNull();
  });

  it("ignores blank lines and repeats of the last thing typed", () => {
    const history = historyWith("help", "  ", "help", "ls");

    expect(history.older("")).toBe("ls");
    expect(history.older("")).toBe("help");
    expect(history.older("")).toBeNull();
  });

  it("starts again from the end once a new line is entered", () => {
    const history = historyWith("help", "ls");
    history.older("");
    history.older("");
    history.add("date");

    expect(history.older("")).toBe("date");
    expect(history.older("")).toBe("ls");
  });

  it("never reaches for the browser, the clock or randomness", () => {
    const source = readFileSync(fileURLToPath(new URL("./history.js", import.meta.url)), "utf8");

    for (const banned of ["document", "window", "localStorage", "Date", "Math.random"]) {
      expect(source).not.toContain(banned);
    }
  });
});
