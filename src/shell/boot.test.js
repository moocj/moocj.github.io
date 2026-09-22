import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { HOLD, LINE_DELAY, bootDuration, bootLines, shouldBoot } from "./boot.js";
import { createCommands } from "./commands.js";
import { projects } from "../data/projects.js";
import { site } from "../data/site.js";

// the names entry.js builds the apps with
const lines = bootLines({
  site,
  projects,
  apps: ["terminal", "projects"],
  commandCount: createCommands({ site, projects }).length,
});

describe("whether the desktop boots", () => {
  // the whole truth table, and each row is toBe: a 0 or a 1 is not a boolean
  it("boots for a first visit that allows motion", () => {
    expect(shouldBoot({ reducedMotion: false, seen: false })).toBe(true);
  });

  it("stays out of the way for a visitor who asked for less motion", () => {
    expect(shouldBoot({ reducedMotion: true, seen: false })).toBe(false);
  });

  it("stays out of the way for a visitor who has seen it", () => {
    expect(shouldBoot({ reducedMotion: false, seen: true })).toBe(false);
  });

  it("stays out of the way for a visitor who has seen it and wants less motion", () => {
    expect(shouldBoot({ reducedMotion: true, seen: true })).toBe(false);
  });
});

describe("what it prints", () => {
  it("prints whole lines, all of them strings", () => {
    expect(lines).not.toHaveLength(0);

    for (const line of lines) {
      expect(typeof line).toBe("string");
      expect(line.trim()).not.toBe("");
    }
  });

  it("prints nothing it would have to apologise for", () => {
    for (const line of lines) {
      expect(line).not.toContain("undefined");
      expect(line).not.toContain("[object");
    }
  });

  it("prints facts out of src/data, not copy of its own", () => {
    expect(lines).toContain(site.name);
    expect(lines).toContain(`${projects.length} projects`);
    expect(lines).toContain(`contact: ${site.email}`);
    expect(lines).toContain("apps: terminal, projects");
    expect(lines).toContain(`commands: ${createCommands({ site, projects }).length}`);
  });
});

describe("how long it takes", () => {
  it("is a delay per line plus the hold", () => {
    expect(bootDuration(5)).toBe(5 * LINE_DELAY + HOLD);
  });

  it("is comfortably inside three seconds", () => {
    expect(bootDuration(lines.length)).toBeLessThan(3000);
  });
});

describe("boot.js on its own", () => {
  it("never reaches for the browser, the clock or storage", () => {
    const source = readFileSync(fileURLToPath(new URL("./boot.js", import.meta.url)), "utf8");
    const banned = ["document", "window", "localStorage", "matchMedia", "setTimeout", "Date"];

    for (const term of banned) {
      expect(source).not.toContain(term);
    }
  });
});
