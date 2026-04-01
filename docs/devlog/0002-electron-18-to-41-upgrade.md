# 0002 — Electron 18 → 41 Upgrade

**Date**: 2026-04-01
**State**: complete (uncommitted, pending manual test)

## Starting Point

Electron 18.3.15 with `nodeIntegration: true`. The renderer used `require()`
to load a local CommonJS module (midi.js) and access `ipcRenderer` directly.
Six npm audit vulnerabilities in Electron 18's transitive deps (lodash,
semver). Previous session had already updated all other deps and identified
this as the next step.

## Goal

Upgrade to latest Electron (41.1.1), replacing the deprecated
`nodeIntegration: true` pattern with `contextBridge` + preload script. Resolve
the remaining audit vulnerabilities.

## What Happened

**Explored the surface area.** Only two `require()` calls existed in the
renderer: one for midi.js (local module, Web APIs only) and one for
`electron.ipcRenderer` (send/on for a ping/pong test channel). Small scope.

**Created `app/preload.js`.** Nine lines. Exposes `sendPing` and `onPong` via
`contextBridge.exposeInMainWorld` — channel-specific wrappers, not the raw
ipcRenderer object. The renderer can't invent channels or access Electron
internals.

**Converted midi.js to a plain `<script>` tag.** Since it uses zero Node.js
APIs (only Web MIDI API and DOM manipulation), the simplest path was removing
`module.exports.start = start` and loading it via `<script src="./midi.js">`
before the inline script. `start` becomes a global function. No module system
needed.

**Updated main.js.** Removed `nodeIntegration: true`, added
`contextIsolation: true` and `preload` path. Moved `backgroundThrottling` from
webPreferences to top-level BrowserWindow option (deprecated location in modern
Electron). Hardened `loadFile` to use `path.join(__dirname, ...)` instead of
relative path from working directory.

**Updated index.html.** Replaced `require('./midi').start(domStuff)` with
`start(domStuff)`. Replaced `require('electron').ipcRenderer` usage with
`window.electronAPI.sendPing()` and `window.electronAPI.onPong()`.

**Fought prettier vs standard.** An `eslint-disable-line` inline comment got
reformatted by prettier onto its own line, breaking it. Solution:
`eslint-disable-next-line` on the preceding line survives prettier.

## Decisions

- **Plain script tag over ES modules for midi.js.** ES modules would require
  `window.start = start` or converting the inline script to a module too. Plain
  script tag: zero ceremony, function is just global.

- **Channel-specific wrappers over raw ipcRenderer.** Could have exposed
  `ipcRenderer.send` and `ipcRenderer.on` directly, but that leaks the
  ipcRenderer object (via return value of `.on`) and lets the renderer listen on
  arbitrary channels. Wrappers cost nothing and are the Electron-recommended
  pattern.

- **Did not touch pre-existing patterns.** Reviewer flagged ping/pong as dead
  scaffolding, `app.win` as a global side-channel, unconditional DevTools, and
  typos. All pre-existing — not part of this upgrade's scope.

## What's Next

1. Manual test: `npm start`, verify window/video/images, test Clear button for
   IPC ping/pong, connect MIDI device if available.
2. Commit and merge to master.
3. Consider whether the ping/pong IPC channel should be removed or replaced with
   a real channel.
