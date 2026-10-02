# Cheat Sheet

Quick reference for working on this website with Claude Code and git.

## Ask Claude (just type it in the chat)

| What you want | What to type |
|---|---|
| Save and upload your changes | `commit and push my changes` |
| Only save a snapshot (no upload) | `commit my changes` |
| See what changed since the last save | `what did I change?` |
| See the history of saves | `show me the git history` |
| Undo changes you haven't saved yet | `undo my changes to style.css` |
| Go back to an older version | `go back to the version from yesterday` |
| Open the website | `open the website` |
| Change something | `make the background blue`, `add a section about my hobbies` |

## Git commands (for the Terminal app)

Open **Terminal** (Cmd + Space → "Terminal") and go to the project first:

```
cd ~/Desktop/ClaudeCode
```

| Command | What it does |
|---|---|
| `git status` | Shows which files changed and what's not saved yet |
| `git diff` | Shows the exact lines that changed |
| `git add .` | Selects all changed files for the next save |
| `git commit -m "Describe the change"` | Saves a snapshot with a message |
| `git push` | Uploads your saved snapshots to GitHub |
| `git pull` | Downloads changes from GitHub (e.g. edits made on the website) |
| `git log --oneline` | Lists all saved snapshots, newest first |
| `git restore <file>` | Throws away unsaved changes in one file (careful: can't be undone) |

### The usual routine

```
git add .
git commit -m "Change header color"
git push
```

## Other useful things

| What | How |
|---|---|
| View the website | `open index.html` in Terminal, or double-click `index.html` in Finder |
| See your project on GitHub | https://github.com/sebbyvogel/ClaudeCodeStarterPublic |
| Run a command from the Claude chat | Type `!` before it, e.g. `! git status` (not for commands that ask for a password; use Terminal for those) |
| Stop Claude while it's working | Press `Esc` |
| Start a fresh conversation | Type `/clear` |
| Get help with Claude Code | Type `/help` |

## Words to know

- **Commit**: a saved snapshot of your project, with a short message.
- **Push**: upload your commits to GitHub.
- **Pull**: download new commits from GitHub.
- **Repository (repo)**: your project folder plus its full history.
- **Token**: the password replacement GitHub uses for git. Your Mac has it saved.
