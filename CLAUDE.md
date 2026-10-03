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
- `api/matches.json`: FC Bayern matches as JSON; served as a static API on GitHub Pages and read/written by the FastAPI server
- `server/main.py`: FastAPI server (GET/POST/PUT/DELETE on `/matches`), also serves the website locally
- `LEARNINGS.md`: Sebastian's learning documentation
- `CHEATSHEET.md`: git and Claude Code commands
- `images/`: pictures used on the page (FC Bayern logo from Wikimedia Commons)

## Running it

Run `.venv/bin/fastapi dev server/main.py` in this folder (Terminal app, it never exits), then open http://localhost:8000 (API docs at /docs). For the website only, `python3 -m http.server 8000` also works. A local server is needed because browsers block `fetch()` for files opened directly (`file://`). Refresh after changes.

## Guidelines

- Keep it simple and beginner-friendly. Explain changes in plain language.
- Don't add frameworks or build tools unless asked.
- Make sure the page still works on phones and in dark mode.
- Update `LEARNINGS.md` whenever Sebastian learns something new (concepts, mistakes and their lessons, progress table, next steps). Keep it focused on the important things.
