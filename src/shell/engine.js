// The engine for the terminal. Takes a line of text and returns objects
// that describe what should appear.

export function createEngine({ clock, commands }) {
  return {
    run(input) {
      const typed = input.trim();
      if (typed === "") return { lines: [], effect: null };

      const [name, ...args] = typed.split(/\s+/);
      const command = commands.find((candidate) => candidate.name === name);

      if (!command) {
        return { lines: [{ kind: "error", text: `command not found: ${name}` }], effect: null };
      }

      return command.run({ args, clock, commands });
    },
  };
}
