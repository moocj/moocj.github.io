import { commands } from "./commands.js";
import { createEngine } from "./engine.js";
import { createHistory } from "./history.js";
import { complete } from "./complete.js";

const PROMPT = "$ ";

function makeLine(text, kind) {
  const element = document.createElement("p");
  // it has a class name so that it can present errors in different colour to normal output
  element.className = `terminal__line terminal__line--${kind}`;
  element.textContent = text;
  return element;
}

export function createTerminal({
  app,
  engine = createEngine({ clock: () => new Date(), commands }),
}) {
  const scrollback = app.querySelector(".terminal__scrollback");
  const input = app.querySelector("#terminal-input");
  const history = createHistory();

  function write(text, kind) {
    scrollback.append(makeLine(text, kind));
    scrollback.scrollTop = scrollback.scrollHeight;
  }

  function clear() {
    scrollback.replaceChildren();
  }

  function fillInput(line) {
    if (line === null) return;

    input.value = line;
    input.setSelectionRange(line.length, line.length);
  }

  function submit() {
    const entered = input.value;
    input.value = "";
    if (entered.trim() === "") return;

    history.add(entered);
    write(`${PROMPT}${entered}`, "input");
    const result = engine.run(entered);

    if (result.effect === "clear") {
      clear();
      return;
    }

    for (const line of result.lines) write(line.text, line.kind);
  }

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      submit();
      return;
    }

    if (event.key === "Tab") {
      event.preventDefault();
      const { line, listing } = complete(input.value, commands);
      fillInput(line);
      if (listing.length > 0) write(listing.join("  "), "output");
      return;
    }

    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      fillInput(event.key === "ArrowUp" ? history.older(input.value) : history.newer(input.value));
    }
  });

  app.addEventListener("keydown", (event) => {
    if (!event.ctrlKey || event.altKey || event.metaKey || event.key !== "l") return;

    event.preventDefault();
    clear();
  });

  write("Welcome. Type help to see what this terminal can do.", "output");

  return {
    name: "terminal",
    element: app,
    focus: () => input.focus(),
  };
}
