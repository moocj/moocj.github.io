import { createTerminal } from "./adapter.js";
import { createShell } from "./shell.js";
import { createStorage } from "./storage.js";
import { renderProjects } from "../render/projects.js";
import { createCommands } from "./commands.js";
import { projects } from "../data/projects.js";
import { site } from "../data/site.js";

renderProjects();

const commands = createCommands({ site, projects });
const terminal = createTerminal({
  app: document.querySelector('[data-app="terminal"]'),
  commands,
});

const storage = createStorage(window.localStorage);

// Right now opens to terminal since only one app, when icons appear will set to show nothing on default
const shell = createShell({ apps: [terminal], defaultApp: terminal.name, storage });
shell.start();
