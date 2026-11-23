// Moves VS Code's cursor along with claude-typing's live replay. The hook writes each typing
// point to a file; this watches that file and puts the cursor there at once, which `code -g` can't.
const vscode = require("vscode");
const fs = require("fs");
const os = require("os");
const path = require("path");

// the hook's state folder ($XDG_RUNTIME_DIR/claude-typing, else the temp folder) and its files
const STATE_DIR = path.join(process.env.XDG_RUNTIME_DIR || os.tmpdir(), "claude-typing");
const MARKERS = path.join(STATE_DIR, "vscode-follow"); // one file per open VS Code window
const MARKER = path.join(MARKERS, String(process.pid));
const CURSOR = path.join(STATE_DIR, "cursor");
let want = null; // { file, line, col } the hook asked for last, 0-based

// on start, leave a marker telling the hook to send positions here, and watch for them
function activate(context) {
  fs.mkdirSync(MARKERS, { recursive: true, mode: 0o700 });
  fs.writeFileSync(MARKER, "");
  // the hook swaps the cursor file in with a rename, so watch its folder rather than the file
  const watcher = fs.watch(STATE_DIR, (_, name) => {
    if (!name || name === "cursor") readCursor();
  });
  context.subscriptions.push(
    { dispose: () => watcher.close() },
    vscode.workspace.onDidChangeTextDocument((e) => {
      if (want && samePath(e.document.uri.fsPath, want.file)) place();
    }),
  );
}

// read the newest typing point the hook wrote and remember it
function readCursor() {
  let text;
  try {
    text = fs.readFileSync(CURSOR, "utf8");
  } catch {
    return; // between the hook's writes, or not written yet
  }
  const [file, line, col] = text.split("\n");
  if (!file) return;
  want = { file, line: Number(line) - 1, col: Number(col) - 1 };
  place();
}

function samePath(a, b) {
  a = path.normalize(a);
  b = path.normalize(b);
  return process.platform === "win32" ? a.toLowerCase() === b.toLowerCase() : a === b;
}

// put the cursor on the remembered point in that file's visible editor and scroll to it;
// the file may not have reloaded from disk yet, so this is retried whenever the document changes
function place() {
  const editor = vscode.window.visibleTextEditors.find((e) => samePath(e.document.uri.fsPath, want.file));
  if (!editor) return;
  // clamp to the text VS Code has loaded so far; the retry lands it on the exact spot
  const pos = editor.document.validatePosition(new vscode.Position(want.line, want.col));
  editor.selection = new vscode.Selection(pos, pos);
  editor.revealRange(new vscode.Range(pos, pos), vscode.TextEditorRevealType.InCenterIfOutsideViewport);
}

// on shutdown, remove this window's marker so the hook falls back to the CLI
function deactivate() {
  try {
    fs.unlinkSync(MARKER);
    fs.rmdirSync(MARKERS); // fails while another window still has its marker there, which is fine
  } catch {}
}

module.exports = { activate, deactivate };
