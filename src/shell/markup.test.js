import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

// The scripts find their elements by selector, and a selector that matches
// nothing fails silently: the page loads, the script runs, nothing happens.
// So this regression test exists to check for that.

const root = fileURLToPath(new URL("../../", import.meta.url));
const read = (path) => readFileSync(`${root}${path}`, "utf8");

const html = read("index.html");
const css = read("src/styles/site.css");
const scripts = ["src/shell/shell.js", "src/shell/adapter.js", "src/shell/entry.js"]
  .map(read)
  .join("\n");

const SELECTORS = [
  "#desktop",
  "[data-desktop-open]",
  "[data-desktop-close]",
  "[data-app-open]",
  "[data-app-close]",
  '[data-app="terminal"]',
  "#terminal-input",
  ".terminal__scrollback",
];

// what a selector has to look like in the markup for it to find anything.
function matcher(selector) {
  if (selector.startsWith("#")) return new RegExp(`id="${selector.slice(1)}"`);
  if (selector.startsWith(".")) return new RegExp(`class="[^"]*${selector.slice(1)}[" ]`);
  return new RegExp(selector.slice(1, -1));
}

describe("the markup the scripts expect", () => {
  it("has an element for every selector the scripts look for", () => {
    for (const selector of SELECTORS) {
      expect(html, `${selector} is in index.html`).toMatch(matcher(selector));
    }
  });

  it("is the only place the scripts look, so the list above cannot go stale", () => {
    const used = [...scripts.matchAll(/querySelector(?:All)?\(\s*(["'])(.*?)\1\s*\)/g)].map(
      (match) => match[2],
    );

    expect(used).not.toHaveLength(0);
    expect(new Set(used)).toEqual(new Set(SELECTORS));
  });
});

describe("the stylesheet", () => {
  it("still neutralises motion for a visitor who asked for less of it", () => {
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
    expect(css).toContain("transition-duration: 0.01ms !important");
  });
});
