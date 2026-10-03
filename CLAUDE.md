# CLAUDE.md

Notes for Claude Code about this project.

## About

A small personal website. Sebastian's first project with Claude Code.

## Stack

Plain HTML, CSS and JavaScript. No frameworks, no build step, no dependencies.

## Files

- `index.html`: page content and structure
- `style.css`: styling, including colors as CSS variables in `:root` and a dark mode
- `script.js`: small interactive bits (live clock, footer year, click counter, loads matches from the API)
- `api/matches.json`: static JSON API with FC Bayern matches (sample data)
- `images/`: pictures used on the page (FC Bayern logo from Wikimedia Commons)

## Running it

Run `python3 -m http.server 8000` in this folder, then open http://localhost:8000. A local server is needed because browsers block `fetch()` for files opened directly (`file://`). Refresh after changes.

## Guidelines

- Keep it simple and beginner-friendly. Explain changes in plain language.
- Don't add frameworks or build tools unless asked.
- Make sure the page still works on phones and in dark mode.
