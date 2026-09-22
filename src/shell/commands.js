// Everything command that the terminal can run.

const ABOUT =
  " I am a 20 year old computer science student at the University of Nottingham. I enjoy all areas of computer science, with a particular interest in AI, ML and cyber security. I also, outside of formal learning, enjoy mathematics and its various relationships to computer science.";
const EMAIL = "jackcmoocarme@gmail.com";
const PROJECT_LINES = [
  "Project one type-test - A simple typing test game that allows the user to test their typing speed against pre-determined word sets or importing their own words.",
  "Project two PLACEHOLDER - DESCRIPTION",
  "Project three PLACEHOLDER - DESCRIPTION",
];

// Creating a "files" that imitates a file system for the terminal
const FILES = {
  "about.txt": [ABOUT],
  "contact.txt": [EMAIL],
  "projects.txt": PROJECT_LINES,
};

const asOutput = (texts) => texts.map((text) => ({ kind: "output", text }));

export const commands = [
  {
    name: "help",
    description: "List the commands the terminal knows",
    run: ({ commands: registry }) => {
      const col = Math.max(...registry.map((command) => command.name.length)) + 2;
      return {
        lines: registry.map((command) => ({
          kind: "output",
          text: `${command.name.padEnd(col)}${command.description}`,
        })),
        effect: null,
      };
    },
  },
  {
    name: "whoami",
    description: "Print who the terminal thinks you are",
    run: () => ({ lines: asOutput(["guest"]), effect: null }),
  },
  {
    name: "ls",
    description: "List the files you can read with cat",
    run: () => ({ lines: asOutput([Object.keys(FILES).join("  ")]), effect: null }),
  },
  {
    name: "cat",
    description: "Prints a file: cat about.txt",
    completes: () => Object.keys(FILES),
    run: ({ args }) => {
      if (args.length === 0) {
        return { lines: [{ kind: "error", text: "cat: which file? try ls" }], effect: null };
      }

      const file = FILES[args[0]];
      if (!file) {
        return { lines: [{ kind: "error", text: `cat: no such file: ${args[0]}` }], effect: null };
      }

      return { lines: asOutput(file), effect: null };
    },
  },
  {
    name: "projects",
    description: "The projects I have built/am building",
    run: () => ({ lines: asOutput(PROJECT_LINES), effect: null }),
  },
  {
    name: "contact",
    description: "A way to contact me",
    run: () => ({ lines: asOutput([EMAIL]), effect: null }),
  },
  {
    name: "date",
    description: "Print the current date and time, in UTC",
    run: ({ clock }) => ({
      lines: asOutput([`${clock().toISOString().slice(0, 19)}Z`]),
      effect: null,
    }),
  },
  {
    name: "clear",
    description: "Clear the screen",
    run: () => ({ lines: [], effect: "clear" }),
  },
];
