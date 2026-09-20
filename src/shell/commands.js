// Everything command that the terminal can run.

export const commands = [
    {
        name: "help",
        description: "List the commands the terminal knows",
        run: ({ commands: registry}) => ({
            lines: registry.map((command) => ({
                kind: "output",
                text: `${command.name.padEnd(8)}${command.description}`,
            })),
            effect: null,
        }),
    },
    {
        name: "date",
        description: "Print the current date and time, in UTC",
        run: ({ clock }) => ({
            lines: [{ kind: "output", text: `${clock().toISOString().slice(0, 19)}Z` }],
            effect: null,
        }),
    },
    {
        name: "clear",
        description: "Clear the screen",
        run: () => ({ lines: [], effect: "clear"}),
    },
];

