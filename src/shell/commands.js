// Everything command that the terminal can run.

const asOutput = (texts) => texts.map((text) => ({ kind: "output", text }));

export function createCommands({ site, projects }) {
  const FILES = {
    "about.txt": [site.about],
    "contact.txt": [site.email],
    "projects.txt": projects.map((project) => `${project.title} - ${project.description}`),
  };

  return [
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
          return {
            lines: [{ kind: "error", text: `cat: no such file: ${args[0]}` }],
            effect: null,
          };
        }

        return { lines: asOutput(file), effect: null };
      },
    },
    {
      name: "projects",
      description: "The projects I have built/am building",
      run: () => ({ lines: asOutput(FILES["projects.txt"]), effect: null }),
    },
    {
      name: "contact",
      description: "A way to contact me",
      run: () => ({ lines: asOutput([site.email]), effect: null }),
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
}
