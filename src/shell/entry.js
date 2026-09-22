import { createTerminal } from "./adapter.js";
import { createProjectsApp } from "./projects-app.js";
import { createShell } from "./shell.js";
import { createStorage } from "./storage.js";
import { renderProjects } from "../render/projects.js";
import { createCommands } from "./commands.js";
import { projects } from "../data/projects.js";
import { site } from "../data/site.js";

renderProjects();

const commands = createCommands({ site, projects });

// apps
const terminal = createTerminal({
  app: document.querySelector('[data-app="terminal"]'),
  commands,
});
const projectsApp = createProjectsApp({
  app: document.querySelector('[data-app="projects"]'),
  projects,
});

const storage = createStorage(window.localStorage);

// Right now opens to terminal since only one app, when icons appear will set to show nothing on default
const shell = createShell({ apps: [terminal, projectsApp], defaultApp: terminal.name, storage });

shell.start();
