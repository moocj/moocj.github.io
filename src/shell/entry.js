import { createTerminal } from "./adapter.js";
import { createShell } from "./shell.js";

const terminal = createTerminal({ app: document.querySelector('[data-app="terminal"]') });

// Right now opens to terminal since only one app, when icons appear will set to show nothing on default
const shell = createShell({ apps: [terminal], defaultApp: terminal.name });
shell.start();
