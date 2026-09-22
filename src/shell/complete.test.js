import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { complete } from "./complete.js";

// Completion reads a name and, if it has one, an optional `completes()` — so the
// fixture needs nothing else, and nothing should can break because a description
// changed.
const registry = [
  { name: "cat", completes: () => ["about.txt", "contact.txt"] },
  { name: "clear" },
  { name: "contact" },
  { name: "help" },
];

describe("completing a line", () => {
  it("finishes the name when there is only one it could be", () => {
    expect(complete("he", registry)).toEqual({ line: "help ", listing: [] });
    expect(complete("ca", registry)).toEqual({ line: "cat ", listing: [] });
  });

  it("lists them when there is more than one", () => {
    expect(complete("c", registry)).toEqual({
      line: "c",
      listing: ["cat", "clear", "contact"],
    });
  });

  it("extends as far as the candidates agree before it lists them", () => {
    const files = [{ name: "cat", completes: () => ["about.txt", "about.md"] }];

    expect(complete("cat ab", files)).toEqual({ line: "cat about.", listing: [] });
    expect(complete("cat about.", files)).toEqual({
      line: "cat about.",
      listing: ["about.md", "about.txt"],
    });
  });

  it("leaves the line alone when nothing matches", () => {
    expect(complete("zzz", registry)).toEqual({ line: "zzz", listing: [] });
    expect(complete("cat zzz", registry)).toEqual({ line: "cat zzz", listing: [] });
  });

  it("finishes an argument once the command is typed", () => {
    expect(complete("cat ab", registry)).toEqual({ line: "cat about.txt ", listing: [] });
    expect(complete("cat ", registry)).toEqual({
      line: "cat ",
      listing: ["about.txt", "contact.txt"],
    });
  });

  it("offers no arguments for a command that does not describe any", () => {
    expect(complete("help ", registry)).toEqual({ line: "help ", listing: [] });
    expect(complete("ecoh ", registry)).toEqual({ line: "ecoh ", listing: [] });
  });

  it("never reaches for the browser, the clock or randomness", () => {
    const source = readFileSync(fileURLToPath(new URL("./complete.js", import.meta.url)), "utf8");

    for (const banned of ["document", "window", "localStorage", "Date", "Math.random"]) {
      expect(source).not.toContain(banned);
    }
  });
});
