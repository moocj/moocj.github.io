# Contributing

## What this is

The source for my portfolio, served from moocj.github.io.

## How to run it

Open "index.html" in a browser.

## Workflow

One ticket, one branch, one pull request. `main` is protected, so work
gets merged in rather than working on that branch.

    feature/<issue>-<slug>     # a new feature
    fix/<issue>-<slug>         # a bug
    docs/<issue>-<slug>        # documentation only
    chore/<issue>-<slug>       # tooling, tracker, config

## Commits

    feat: render the project section from src/data
    fix: correct the pages base path for a project site
    docs: sketch the main page
    chore: pin node 24 in the ci workflow
    refactor: move styles.css under src/
    test: cover tab completion with no matches
    perf: lazy-load the machine behind the toggle
    content: replace any placeholders
    content: tighten the case study opening

## Merging

Merge commits only. Squash and rebase are disabled in the repository settings, and
pushed history is never rewritten.

## Definition of done

- [ ] Every acceptance criterion in the issue is met
- [ ] The PR explains how it was verified, with evidence
- [ ] The PR is merged and the issue is closed
- [ ] The board is updated.


## Where things are

| Path | What belongs there |
|---|---|
| `docs/page-plan.md` | What the page is and how it will work/look. |
| `docs/ideas.md` | Ideas that aren't in scope yet. |
| `docs/progress` | Screenshots of the page as development goes on.. |
| `CHANGELOG.md` | User-facing changes, per release |

## Questions

Open an issue with a 'needs-decision' label until it's been seen.
