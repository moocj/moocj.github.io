import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { commands } from "./commands.js";
import { createEngine } from "./engine.js";

const FAKE_NOW = "2026-09-20T18:30:00.000Z";
const clock = () => new Date(FAKE_NOW);
const engine = createEngine({ clock: () => new Date(FAKE_NOW), commands });

const textsOf = (input) => engine.run(input).lines.map((line) => line.text);

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

describe("near misses", () => {
  // NEW
  it("names the command you probably meant", () => {
    // NEW
    expect(textsOf("hlep")).toEqual(["command not found: hlep", "did you mean: help?"]); // NEW
    expect(textsOf("clera")).toEqual(["command not found: clera", "did you mean: clear?"]); // NEW
  }); // NEW
  // NEW
  it("says nothing at all when nothing is close", () => {
    // NEW
    // NEW: a wrong guess costs more than no guess, so this has to stay silent.
    expect(textsOf("nonsense")).toEqual(["command not found: nonsense"]); // NEW
    expect(textsOf("xyz")).toEqual(["command not found: xyz"]); // NEW
  }); // NEW
  // NEW
  it("guesses from the registry it was given, not from a list of its own", () => {
    // NEW
    const echo = {
      name: "echo",
      description: "Repeat what you type",
      run: () => ({ lines: [], effect: null }),
    }; // NEW
    const onlyEcho = createEngine({ clock, commands: [echo] }); // NEW
    // NEW
    expect(onlyEcho.run("ecoh").lines[1].text).toBe("did you mean: echo?"); // NEW
    // NEW: ...and the real commands are not in there, so they are not suggested.
    expect(onlyEcho.run("help").lines).toEqual([
      { kind: "error", text: "command not found: help" },
    ]); // NEW
  }); // NEW
}); // NEW
