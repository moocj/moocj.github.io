// The engine for the terminal. Takes a line of text and returns objects
// that describe what should appear.

// method that tries to determine whether an incorrectly typed thing was a 'typo'
function editDistance(from, to) {
  const table = Array.from({ length: from.length + 1 }, (_, row) =>
    Array.from({ length: to.length + 1 }, (_, col) => (row === 0 ? col : col === 0 ? row : 0)),
  );

  for (let row = 1; row <= from.length; row += 1) {
    for (let col = 1; col <= to.length; col += 1) {
      const swappedNeighbours =
        row > 1 && col > 1 && from[row - 1] === to[col - 2] && from[row - 2] === to[col - 1]
          ? table[row - 2][col - 2] + 1
          : Infinity;

      table[row][col] = Math.min(
        table[row - 1][col] + 1,
        table[row][col - 1] + 1,
        table[row - 1][col - 1] + (from[row - 1] === to[col - 1] ? 0 : 1),
        swappedNeighbours,
      );
    }
  }

  return table[from.length][to.length];
}

function nearestName(word, names) {
  const allowance = word.length > 4 ? 2 : 1;
  let best = null;

  for (const name of names) {
    const distance = editDistance(word, name);
    if (distance <= allowance && (best === null || distance < best.distance)) {
      best = { name, distance };
    }
  }

  return best === null ? null : best.name;
}

export function createEngine({ clock, commands }) {
  return {
    run(input) {
      const typed = input.trim();
      if (typed === "") return { lines: [], effect: null };

      const [name, ...args] = typed.split(/\s+/);
      const command = commands.find((candidate) => candidate.name === name);

      if (!command) {
        const lines = [{ kind: "error", text: `command not found: ${name}` }];
        const nearest = nearestName(
          name,
          commands.map((candidate) => candidate.name),
        );
        if (nearest !== null) lines.push({ kind: "error", text: `did you mean: ${nearest}?` });
        return { lines, effect: null };
      }
      return command.run({ args, clock, commands });
    },
  };
}
