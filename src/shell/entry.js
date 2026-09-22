import { createTerminal } from "./adapter.js";
import { createShell } from "./shell.js";
import { createStorage } from "./storage.js";

const terminal = createTerminal({ app: document.querySelector('[data-app="terminal"]') });

const storage = createStorage(window.localStorage);

// Right now opens to terminal since only one app, when icons appear will set to show nothing on default
const shell = createShell({ apps: [terminal], defaultApp: terminal.name, storage });
shell.start();
