// Terminal history

export function createHistory() {
  const entries = []; // the line that is being typed
  let cursor = 0;
  let draft = "";

  return {
    add(line) {
      // line is what the user just typed
      draft = "";
      const typed = line.trim();

      if (typed === "") {
        cursor = entries.length;
        return;
      }

      if (entries.at(-1) !== typed) entries.push(typed);
      cursor = entries.length;
    },

    older(current) {
      if (cursor === entries.length) draft = current;
      if (cursor === 0) return null; // already at oldest entry

      cursor -= 1;
      return entries[cursor];
    },

    newer() {
      if (cursor === entries.length) return null; // nothing new

      cursor += 1;
      return cursor === entries.length ? draft : entries[cursor];
    },
  };
}
