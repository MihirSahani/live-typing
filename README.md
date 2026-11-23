# Live Typing

A [Claude Code](https://claude.com/claude-code) plugin that lets you watch Claude's edits being typed out
live in your editor, word by word, with your cursor following the typing.

- **Hook:** after every `Edit`/`Write`, the file is rewound to its old content and the change is re-typed
  at reading speed. Only the changed words are typed; deletions run 4× faster. The file always ends with
  exactly what Claude wrote, with Claude's timestamp.
- **Cursor:** after each keystroke your editor's cursor jumps to the typing point
  (`zed path:line:col` or `code -g path:line:col`).
- **Skill `follow-along`:** makes Claude order its edits so each one makes sense as it appears, and lay out
  step comments in the file before filling them in.

Works with **Zed** and **VS Code** (also `code-oss`, `codium`) when Claude runs inside them (the hook looks
for the editor among its parent processes). Elsewhere the file is still typed on disk, just without the
cursor jumps. Linux, Windows and macOS; needs Python 3.10+ (stdlib only) as `python3`, `python` or `py`.

### Windows

- Install [Git for Windows](https://git-scm.com/download/win): Claude Code runs the hook through Git Bash.
- Install Python from python.org (or `winget install Python.Python.3.13`). The Microsoft Store `python3`
  stub is skipped automatically.
- Make sure the editor's CLI is on `PATH`: `code` (the VS Code installer adds it) or `zed`.

## Install

```
/plugin marketplace add MihirSahani/live-typing
/plugin install live-typing@live-typing
```

or, from a shell:

```bash
claude plugin marketplace add MihirSahani/live-typing
claude plugin install live-typing@live-typing
```

Update later with `/plugin update live-typing`.

## Zed: keep the view stable

Each cursor jump uses Zed's go-to logic, which centres the line by default. So the view only scrolls
when the cursor would leave the screen, add this to Zed's `settings.json`:

```jsonc
"go_to_definition_scroll_strategy": "minimum",
```

(This also makes regular go-to-definition scroll minimally instead of centring.)

Keep **Follow Agent** off in the agent panel: following makes Zed scroll on every agent action.

## Commands

The plugin's `bin/` is on Claude's `PATH`, so you can ask Claude to run these, or run them yourself via
the full path (`~/.claude/plugins/cache/live-typing/live-typing/<version>/bin/claude-typing`; on Windows
run it in Git Bash through `bin/live-typing-hook`, e.g. `live-typing-hook speed 60`):

| Command | What it does |
|---|---|
| `claude-typing speed` | show the typing speed (chars/s, default 30) |
| `claude-typing speed 60` | set it; applies live, even mid-edit |
| `claude-typing off` | turn typing off (also fast-forwards an edit in progress) |
| `claude-typing on` | turn it back on |
| `claude-typing selftest` | run the self-check; prints `ok` |

Speed is stored in `~/.config/claude-typing/speed`; on/off state in `$XDG_RUNTIME_DIR/claude-typing/`.

## Notes

- Claude waits while a change is typed out; a big rewrite takes a while. Use `speed` or `off` if it drags.
- Editing a different file than the last one waits 4 s first, so you can look at the finished file.
- If your editor has the file open with unsaved changes, it will warn about the file changing on disk.
- Don't also keep the same hooks in your own `settings.json`, or each edit is typed twice.

## License

MIT
