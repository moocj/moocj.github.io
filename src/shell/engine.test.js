import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { commands } from "./commands.js";
import { createEngine } from "./engine.js";

const FAKE_NOW = "2026-09-20T18:30:00.000Z";
const engine = createEngine({ clock: () => new Date(FAKE_NOW), commands });

describe("the terminal engine", () => {
  it("answers a whole session and reports every line as an object", () => {
    const session = ["help", "date", "clear", "nonsense", "  ", ""].map((line) => engine.run(line));

    expect(session[0].lines.map((line) => line.text)).toEqual([
      "help    List the commands the terminal knows",
      "date    Print the current date and time, in UTC",
      "clear   Clear the screen",
    ]);
    expect(session[0].effect).toBeNull();
    expect(session[1].lines).toEqual([{ kind: "output", text: "2026-09-20T18:30:00Z" }]);
    expect(session[2]).toEqual({ lines: [], effect: "clear" });
    expect(session[3].lines).toEqual([{ kind: "error", text: "command not found: nonsense" }]);
    // Blank input is not an error and produces nothing at all.
    expect(session[4]).toEqual({ lines: [], effect: null });
    expect(session[5]).toEqual({ lines: [], effect: null });
  });

  it("takes the time from the clock it was given, not the real one", () => {
    const frozen = createEngine({ clock: () => new Date(FAKE_NOW), commands });
    const sameMomentLater = createEngine({
      clock: () => new Date("2031-01-01T00:00:00.000Z"),
      commands,
    });

    expect(frozen.run("date").lines[0].text).toBe("2026-09-20T18:30:00Z");
    expect(sameMomentLater.run("date").lines[0].text).toBe("2031-01-01T00:00:00Z");
  });

  it("splits arguments without inventing any", () => {
    const echo = {
      name: "echo",
      description: "Repeat what you type",
      run: ({ args }) => ({ lines: [{ kind: "output", text: args.join(" ") }], effect: null }),
    };
    const withEcho = createEngine({ clock: () => new Date(FAKE_NOW), commands: [echo] });

    expect(withEcho.run("echo one two").lines[0].text).toBe("one two");
    expect(withEcho.run("echo").lines[0].text).toBe("");
  });

  it("never reaches for the browser, the clock or randomness", () => {
    const source = readFileSync(fileURLToPath(new URL("./engine.js", import.meta.url)), "utf8");

    for (const banned of ["document", "window", "localStorage", "Date", "Math.random"]) {
      expect(source).not.toContain(banned);
    }
  });
});
