// Allows for tab completions
// Static based on the available command options

function agreedStart(words) {
  let agreed = 0;
  while (
    words[0][agreed] !== undefined &&
    words.every((word) => word[agreed] === words[0][agreed])
  ) {
    agreed += 1;
  }

  return words[0].slice(0, agreed);
}

// get the words that could come next
function wordsFor(draft, registry) {
  const beforeFrag = draft.slice(0, draft.search(/\S*$/));
  const typed = beforeFrag.trim();

  if (typed === "") return registry.map(({ name }) => name);

  const command = registry.find(({ name }) => name === typed);
  return command?.completes?.() ?? [];
}

export function complete(draft, registry) {
  const frag = draft.slice(draft.search(/\S*$/));
  const before = draft.slice(0, draft.length - frag.length);
  const matches = wordsFor(draft, registry)
    .filter((word) => word.startsWith(frag))
    .sort();

  if (matches.length === 0) return { line: draft, listing: [] };
  if (matches.length === 1) return { line: `${before}${matches[0]} `, listing: [] };

  const agreed = agreedStart(matches);
  if (agreed.length > frag.length) return { line: `${before}${agreed}`, listing: [] };

  return { line: draft, listing: matches };
}
