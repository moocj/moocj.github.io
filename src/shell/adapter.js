import { commands } from "./commands.js";
import { createEngine } from "./engine.js";

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
    const scrollback = app.querySelector(".terminal_scrollback");
    const input = app.querySelector("#terminal-input");

    function write(text, kind) {
        scrollback.append(makeLine(text, kind));
        scrollback.scrollTop = scrollback.scrollHeight;
    }

    function submit() {
        const entered = input.value;
        input.value = "";
        if (entered.trim() === "") return;

        write(`${PROMPT}${entered}`, "input");
        const result = engine.run(entered);

        if (result.effect === "clear") {
            scrollback.replaceChildren();
            return;
        }

        for (const line of result.lines) write(line.text, line.kind);
    }

    input.addEventListener("keydown", (event) => {
        if (event.key !== "Enter") return;
        submit();
    });

    write("Welcome. Type help to see what this terminal can do.", "output");

    return {
        name: "terminal",
        element: app,
        focus: () => input.focus(),
    };
}