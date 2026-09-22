import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { projects } from "../data/projects.js";

const root = fileURLToPath(new URL("../../", import.meta.url));
const source = readFileSync(`${root}src/shell/projects-app.js`, "utf8");

describe("the projects window", () => {
  it("carries no copy of the content it shows", () => {
    for (const project of projects) {
      expect(source, `${project.title} is not written into the window`).not.toContain(
        project.title,
      );
      expect(source, `${project.title}'s text is not written into the window`).not.toContain(
        project.description,
      );
    }
  });

  it("is given the projects rather than importing them itself", () => {
    expect(source).not.toMatch(/^import /m);
  });
});
