# 0001 — Init and dependency updates

**Date**: 2026-04-01

## Starting point

An Electron MIDI groovebox prototype that hadn't been touched in a while.
Dependencies were several major versions behind (electron 18, prettier 2,
standard 14). 25 npm audit vulnerabilities. No CLAUDE.md, README, or project
docs.

## Goal

Bootstrap rude_claude conventions and bring dependencies up to date without
breaking anything.

## What happened

**Init**: Created CLAUDE.md, README.md, JOURNAL.md, docs/, and .claude/hooks.json
via `/rude_claude:init`.

**Dependency updates (conservative)**:
- electron 18.3.7 → 18.3.15 (latest patch, not major — major requires
  architecture changes)
- prettier 2.0.5 → 3.8.1
- standard 14.3.4 → 17.1.2
- eslint-config-prettier removed (wasn't doing anything without an ESLint config)
- Vulnerabilities: 25 → 6 (remaining 6 are all electron 18 transitive deps)

**Formatter conflict resolved**: prettier 3 and standard 17 disagree on
trailing commas and function paren spacing. Fixed by adding `.prettierrc`
(no semis, single quotes, no trailing commas) and reordering the format script
to run prettier first, then standard --fix.

**Simplification pass**: Removed unused variables (`isShown`, `kickOn`,
`snareOn`, `msg`), unused parameters (`kick`, `snare`), unused DOM elements
(`<li id="kick">`, `<li id="snare">`), unused `outputs` iteration, empty CSP
meta tag, and the `eslint-config-prettier` dependency. Fixed a bug where
`'app.window-all-closed'` should have been `'window-all-closed'`.

## Decisions

- **Electron stays on v18 for now.** Upgrading to v41 requires replacing
  `nodeIntegration: true` with `contextBridge` + preload scripts — a real
  refactor, not a version bump. Documented as a TODO.
- **Prettier runs before standard.** Standard --fix is the final authority on
  style. This avoids the two tools fighting over function paren spacing.
- **Removed eslint-config-prettier.** Standard ships its own ESLint internally;
  there's no separate ESLint config for eslint-config-prettier to modify.

## What's next

- Upgrade Electron from v18 to latest (requires preload script + contextBridge
  migration, will resolve remaining 6 vulnerabilities)
- Consider extracting the inline renderer script from index.html to its own file
- Project has no tests — consider adding basic tests for midi.js logic
