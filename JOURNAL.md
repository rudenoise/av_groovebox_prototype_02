## 2026-04-01 — Init

Bootstrapped with `/rude_claude:init`. Next step: explore updating Electron (currently pinned to 18.x) and consider whether the inline renderer script in index.html should move to its own file.

## 2026-04-01 — Dependency updates (conservative)

**Working on**: Bringing dependencies up to date for an Electron MIDI groovebox prototype.
**State**: done

### What happened
Updated all four dependencies to latest compatible versions. Electron stayed on v18 (patch bump to 18.3.15) because upgrading to v41 requires a renderer architecture change (contextBridge/preload). Dev tools (prettier 3, standard 17, eslint-config-prettier 10) all jumped major versions. Standard 17's stricter rules surfaced 4 unused variables which were removed. Prettier 3 and standard disagreed on formatting (trailing commas, function paren spacing), resolved by adding a `.prettierrc` and reordering the format script to run prettier first, then standard --fix.

### What I learned
- Prettier and standard have irreconcilable style differences (function paren spacing). Order matters: prettier first, standard --fix second.
- Electron 18 → 41 is a significant migration because of the nodeIntegration deprecation — it's not just a version bump, it's an architecture change.
- Most of the npm audit vulnerabilities (19 of 25) came from stale dev tool transitive deps, not electron itself.

### What's next
Upgrade Electron from v18 to latest. This requires introducing a preload script and contextBridge to replace the `require()` calls in the renderer.

## 2026-04-01 — Electron 18 → 41 upgrade

**Working on**: Replacing deprecated nodeIntegration with contextBridge/preload for the Electron MIDI groovebox.
**State**: done (uncommitted, on `upgrade-electron` branch, needs manual testing)

### What happened
Upgraded Electron from 18.3.15 to 41.1.1. Created a preload script that exposes channel-specific IPC wrappers via contextBridge (not the raw ipcRenderer). Converted midi.js from CommonJS module to plain script loaded via `<script>` tag — it only uses Web APIs so no bridging needed. Refactored index.html to use `window.electronAPI` instead of `require('electron')`. Moved `backgroundThrottling` out of webPreferences (deprecated there in modern Electron). npm audit now shows 0 vulnerabilities.

### What I learned
- midi.js needed zero Node APIs — making it a plain `<script>` tag was simpler than any module system
- Exposing channel-specific wrappers (sendPing, onPong) is better than raw ipcRenderer — prevents the renderer from inventing channels or accessing the ipcRenderer object
- Prettier reformats `eslint-disable-line` inline comments to their own line, breaking them. `eslint-disable-next-line` on the preceding line survives prettier
- `backgroundThrottling` moved from webPreferences to top-level BrowserWindow options between Electron 18 and 41

### What's next
Manual testing: `npm start`, verify window/video/images render, test ping/pong IPC via the Clear button, connect a MIDI device if available. Then commit and merge.
