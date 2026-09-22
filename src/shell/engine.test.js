import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { createEngine } from "./engine.js";

// The engine hands work to commands but contains none of them, and it never
// touches the browser. So every test here builds its own tiny registry

const FAKE_NOW = "2026-09-20T18:30:00.000Z";
const clock = () => new Date(FAKE_NOW);

const output = (texts) => texts.map((text) => ({ kind: "output", text }));

const help = {
  name: "help",
  description: "List the commands the terminal knows",
  run: () => ({ lines: [], effect: null }),
};

const clear = {
  name: "clear",
  description: "Clear the screen",
  run: () => ({ lines: [], effect: "clear" }),
};

const echo = {
  name: "echo",
  description: "Repeat what you type",
  run: ({ args }) => ({ lines: output(args), effect: null }),
};

const when = {
  name: "when",
  description: "Print the clock the engine handed over",
  run: ({ clock: now }) => ({ lines: output([now().toISOString()]), effect: null }),
};

const commands = [help, clear, echo, when];
const engine = createEngine({ clock, commands });
const textsOf = (input) => engine.run(input).lines.map((line) => line.text);

describe("the terminal engine", () => {
  it("splits the line into a name and its arguments, inventing none", () => {
    expect(engine.run("echo one two").lines).toEqual(output(["one", "two"]));
    // Extra spaces, including leading and trailing ones, are not extra arguments.
    expect(engine.run("  echo   one  two  ").lines).toEqual(output(["one", "two"]));
    // No arguments is an empty list
    expect(engine.run("echo").lines).toEqual([]);
  });

  it("hands the command the clock the engine was given", () => {
    const later = createEngine({ clock: () => new Date("2031-01-01T00:00:00.000Z"), commands });

    expect(textsOf("when")).toEqual([FAKE_NOW]);
    expect(later.run("when").lines[0].text).toBe("2031-01-01T00:00:00.000Z");
  });

  it("reports the effect a command asked for, and null when it asked for none", () => {
    expect(engine.run("clear")).toEqual({ lines: [], effect: "clear" });
    expect(engine.run("echo hi").effect).toBeNull();
  });

  it("does nothing at all for blank input", () => {
    expect(engine.run("")).toEqual({ lines: [], effect: null });
    expect(engine.run("   ")).toEqual({ lines: [], effect: null });
  });

    it("runs a session line by line, one result each, and keeps none of them", () => {   
    const session = ["echo one two", "hlep", "clear", "echo"];                         

    expect(session.map((line) => engine.run(line))).toEqual([                          
      { lines: output(["one", "two"]), effect: null },                                 
      {                                                                                
        lines: [                                                                       
          { kind: "error", text: "command not found: hlep" },                          
          { kind: "error", text: "did you mean: help?" },                              
        ],                                                                             
        effect: null,                                                                  
      },                                                                               
      { lines: [], effect: "clear" },                                                  
      { lines: [], effect: null },                                                     
    ]);                                                                                

    // Asking again gives the same answer: the engine holds no history of its own.
    expect(engine.run("echo one two").lines).toEqual(output(["one", "two"]));          
  });                                                                                  

  it("never reaches for the browser, the clock or randomness", () => {
    const source = readFileSync(fileURLToPath(new URL("./engine.js", import.meta.url)), "utf8");

    for (const banned of ["document", "window", "localStorage", "Date", "Math.random"]) {
      expect(source).not.toContain(banned);
    }
  });
});

describe("near misses", () => {
  it("counts a swapped pair of letters as one edit", () => {
    expect(textsOf("ecoh")).toEqual(["command not found: ecoh", "did you mean: echo?"]);
  });

  it("says nothing at all when nothing is close", () => {
    expect(textsOf("nonsense")).toEqual(["command not found: nonsense"]);
    expect(textsOf("xyz")).toEqual(["command not found: xyz"]);
  });

  it("guesses from the registry it was given, not from a list of its own", () => {
    const onlyEcho = createEngine({ clock, commands: [echo] });

    expect(onlyEcho.run("ecoh").lines[1].text).toBe("did you mean: echo?");
    expect(onlyEcho.run("help").lines).toEqual([
      { kind: "error", text: "command not found: help" },
    ]);
  });
});
