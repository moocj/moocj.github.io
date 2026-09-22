// Simulated boot sequence for the desktop

export const LINE_DELAY = 320; // time between each line in the boot sequence
export const HOLD = 400; // time the finished screen stays up

export function shouldBoot({ reducedMotion, seen }) {
  return !reducedMotion && !seen;
}

export function bootLines({ site, projects, apps, commandCount }) {
  return [
    site.name,
    `${projects.length} projects`,
    `contact: ${site.email}`,
    `apps: ${apps.join(", ")}`,
    `commands: ${commandCount}`,
    //site.stack,
  ];
}

export function bootDuration(lineCount, delay = LINE_DELAY, hold = HOLD) {
  return lineCount * delay + hold;
}
