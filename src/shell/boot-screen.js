// Create the visual bootscreen

import { HOLD, LINE_DELAY } from "./boot.js";
import { shouldBoot } from "./boot.js";

export function createBootScreen({ desktop, lines, delay = LINE_DELAY, hold = HOLD }) {
  const boot = desktop.querySelector("[data-desktop-boot]");
  const surface = desktop.querySelector(".desktop__surface");
  let timers = [];
  let up = null;

  function finish(onDone) {
    // TODO
  }

  function play({ seen, onDone }) {
    if (
      !shouldBoot({
        reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        seen,
      })
    ) {
      onDone();
      return false;
    }
    up = () => finish(onDone);
    desktop.addEventListener("keydown", up, { capture: true });
    desktop.addEventListener("click", up);
    return true;
  }

  return { play };
}
