# Promodo Social Time Credit

A compact Tampermonkey userscript that combines a Pomodoro timer with a social-credit mode. It adds a draggable control panel to the page, tracks time in the background, and can block focus when the timer reaches zero on social sites.

## Features

- Draggable floating panel
- Social-credit mode and fixed-timer mode
- Play, stop, and reset controls
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

- Select `Social Credit (Hybrid)` to earn credit on non-social pages and spend it on social pages.
- Select `Fixed Timer (Pomodoro)` to count down the chosen preset.
- Use `PLAY`, `STOP`, and `RESET` to control the session.
- Drag the panel by clicking anywhere except the buttons and dropdowns.

## Files

- `script.js` - the Tampermonkey userscript
- `assets/screenshot.svg` - visual preview used in this README

## Notes

This script is designed to run on any website through Tampermonkey. It does not require a separate build step.