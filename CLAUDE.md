# AV Groovebox Prototype 02

A prototype tool for creating audio/visual output by reacting to audio and MIDI inputs.

## Conventions

The rude_claude plugin provides base conventions (loaded automatically via the
plugin's CLAUDE.md). The following are specific to this project:

- Minimal dependencies — avoid adding packages unless absolutely necessary
- No frameworks — use web standards and vanilla JS
- Formatted with Prettier then linted/fixed with StandardJS (run prettier first, standard second)
- Electron main process in `app/main.js`, preload in `app/preload.js`, renderer logic in `app/index.html`
- MIDI handling in `app/midi.js` (loaded as plain `<script>` in renderer)
- Images in `app/img/`, video assets in `app/`

## Development

```sh
npm start          # run the app
npm run watch      # run with auto-restart on file changes (requires entr)
npm run format     # lint and format
```

Tests: none yet.

## TODO
