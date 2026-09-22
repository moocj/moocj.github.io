import { describe, expect, it } from "vitest";

import { commands } from "./commands.js";
import { createEngine } from "./engine.js";

// What the real registry says, and what the user sees when they read it.

const FAKE_NOW = "2026-09-20T18:30:00.000Z";
const clock = () => new Date(FAKE_NOW);
const engine = createEngine({ clock, commands });

const linesOf = (input) => engine.run(input).lines;
const textsOf = (input) => linesOf(input).map((line) => line.text);

describe("the registry", () => {
  it("gives every command a name, a description and something to run", () => {
    for (const command of commands) {
      expect(command.name).toMatch(/^[a-z]+$/);
      expect(command.description).not.toBe("");
      expect(typeof command.run).toBe("function");
    }
  });

  it("does not use the same name twice", () => {
    const names = commands.map((command) => command.name);

    expect(new Set(names).size).toBe(names.length);
  });

  it("runs every command without falling over", () => {
    for (const command of commands) {
      const result = engine.run(command.name);

      expect(Array.isArray(result.lines)).toBe(true);
      expect(result).toHaveProperty("effect");
    }
  });

  it("describes itself from the registry, lined up in one column", () => {
    const texts = textsOf("help");
    const column = texts[0].indexOf(commands[0].description);

    expect(texts).toHaveLength(commands.length);
    // The column has to clear the longest name, or two of them run together.
    expect(column).toBeGreaterThan(Math.max(...commands.map((command) => command.name.length)));

    for (const [index, command] of commands.entries()) {
      expect(texts[index]).toBe(`${command.name.padEnd(column)}${command.description}`);
    }
  });

  it("lists a command that was only ever added to the registry", () => {
    const extra = {
      name: "extra",
      description: "A command that exists only in this test",
      run: () => ({ lines: [], effect: null }),
    };
    const withExtra = createEngine({ clock, commands: [...commands, extra] });

    const texts = withExtra.run("help").lines.map((line) => line.text);

    expect(texts).toHaveLength(commands.length + 1);
    expect(texts.at(-1)).toContain("A command that exists only in this test");
  });
});

describe("what the terminal claims about the site", () => {
  it("lists exactly the files that cat can read", () => {
    const named = textsOf("ls")[0].split(/\s+/).filter(Boolean);

    expect(named.length).toBeGreaterThan(0);
    for (const name of named) {
      const contents = linesOf(`cat ${name}`);

      expect(contents.length).toBeGreaterThan(0);
      expect(contents.every((line) => line.kind === "output")).toBe(true);
    }
  });

  it("says the same thing about the projects however you ask", () => {
    expect(textsOf("projects")).toEqual(textsOf("cat projects.txt"));
  });

  it("says the same thing about contacting you however you ask", () => {
    expect(textsOf("contact")).toEqual(textsOf("cat contact.txt"));
  });

  it("prints the date the clock was holding, in UTC", () => {
    expect(textsOf("date")).toEqual(["2026-09-20T18:30:00Z"]);
  });

  it("does not claim to know who the visitor is", () => {
    expect(textsOf("whoami")).toEqual(["guest"]);
  });

  it("asks for the screen to be cleared without printing anything", () => {
    expect(engine.run("clear")).toEqual({ lines: [], effect: "clear" });
  });
});

describe("how the terminal says no", () => {
  it("answers an unknown command with an error, and names a near miss when it has one", () => {
    expect(linesOf("nonsense")).toEqual([{ kind: "error", text: "command not found: nonsense" }]);
    expect(textsOf("hlep")).toEqual(["command not found: hlep", "did you mean: help?"]);
  });

  it("tells you how to find a file when cat is given none", () => {
    expect(linesOf("cat")).toEqual([{ kind: "error", text: "cat: which file? try ls" }]);
  });

  it("names the file it could not find", () => {
    expect(linesOf("cat nope.txt")).toEqual([
      { kind: "error", text: "cat: no such file: nope.txt" },
    ]);
  });

  it("says nothing when there is nothing to say", () => {
    expect(linesOf("")).toEqual([]);
    expect(linesOf("   ")).toEqual([]);
  });

  it("never prints an error as ordinary output", () => {
    const errors = ["nonsense", "cat", "cat nope.txt"].flatMap(linesOf);

    expect(errors).not.toHaveLength(0);
    expect(errors.every((line) => line.kind === "error")).toBe(true);
  });
});
