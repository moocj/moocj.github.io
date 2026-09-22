// Create the visual bootscreen

import { HOLD, LINE_DELAY, bootDuration, shouldBoot } from "./boot.js";

export function createBootScreen({ desktop, lines, delay = LINE_DELAY, hold = HOLD }) {
  const boot = desktop.querySelector("[data-desktop-boot]");
  const surface = desktop.querySelector(".desktop__surface");
  let timers = [];
  let up = null;

  function finish(onDone) {
    for (const timer of timers) clearTimeout(timer);
    timers = [];

    // matches the addeventlistener else it stays on
    desktop.removeEventListener("keydown", up, { capture: true });
    desktop.removeEventListener("click", up);

    boot.replaceChildren();
    boot.hidden = true;
    surface.hidden = false;

    onDone();
  }

  function line(text) {
    const element = document.createElement("p");
    element.className = "desktop__boot-line";
    element.textContent = text;
    return element;
  }

  function play({ seen, onDone }) {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!shouldBoot({ reducedMotion, seen })) {
      finish(onDone);
      return false;
    }

    up = () => finish(onDone);

    desktop.addEventListener("keydown", up, { capture: true });
    desktop.addEventListener("click", up);

    boot.hidden = false;
    surface.hidden = true;

    for (const [index, text] of lines.entries()) {
      timers.push(setTimeout(() => boot.append(line(text)), (index + 1) * delay));
    }

    // hold last line longer
    timers.push(setTimeout(() => finish(onDone), bootDuration(lines.length, delay, hold)));

    return true;
  }

  return { play };
}
