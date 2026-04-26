# Promodo Social Time Credit

A compact Tampermonkey userscript focused on a simple MVP flow: start and stop. It adds a draggable control panel to the page, tracks social credit in the background, and can block focus when time reaches zero on social sites.

## Features

- Draggable floating panel
- Start and stop controls only (MVP)
- Social credit accrues off social sites and decreases on social sites
- Persistent state via Tampermonkey storage
- Full-screen warning overlay on supported social sites when time runs out

## Screenshot

![Promodo Social Time Credit UI](assets/screenshot.svg)

## Installation

1. Install the Tampermonkey extension in your browser.
2. Open Tampermonkey and create a new userscript.
3. Paste the contents of `script.js` into the editor.
4. Save the script and enable it.

## Usage

- Press `PLAY` to start tracking.
- Press `STOP` to pause tracking.
- While running: time increases on non-social sites and decreases on social sites.
- Drag the panel by clicking anywhere except the buttons.

## Files

- `script.js` - the Tampermonkey userscript
- `assets/screenshot.svg` - visual preview used in this README

## Notes

This script is designed to run on any website through Tampermonkey. It does not require a separate build step.