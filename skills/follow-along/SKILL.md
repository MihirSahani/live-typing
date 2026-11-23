---
name: follow-along
description: Make every code change easy for the user to follow while it is typed out live in their editor. Use on ANY task that creates, edits, refactors, fixes, configures or tests code — even one-line changes — and whenever the user says they want to follow, understand, watch or control what is being changed.
---

# Follow-along editing

The user watches every Edit/Write being typed into their editor at reading speed, word by word. You
explain each change with a step comment you type into the code yourself (section 3); it stays as a
normal code comment afterwards. They must understand each change the moment it appears. Optimise for
followability, not speed.

## 1. Map before touching anything
- Goal in one sentence.
- Files involved and how they connect: a small ASCII diagram of the flow (who calls what, where data goes).
- Numbered list of the edits you will make, in order, one line each ("1. `api.ts` — add `/export` route that calls `buildCsv`").
- For anything beyond a trivial change, stop and wait for the user's OK.

## 2. Order edits so each one makes sense when it appears
- Follow the flow outside-in: start where the behaviour begins (entry point, call site, route, config, or a test that states the expected behaviour), then build what it calls, in call order.
- Never type code whose purpose hasn't been shown yet. Before writing a helper, the user must already have seen where it is used.
- One idea per edit. Don't bundle unrelated changes into one Edit.
- Within a file, work top to bottom.
- If this order leaves the code briefly broken (call site before the function exists), say so: "won't run until step 3".

## 3. Step comments: lay out the steps in the file, then fill them in
- **Lay out first.** Before writing any code in a file, type one comment per step at the exact spot where that step's code will go, in the file's comment syntax and indentation:
  `# Step 2: turn rows into CSV text; the /export route from step 1 calls it`
  Use the global step numbers from your map. One Edit per spot, in file order; for a new file, put them in its skeleton Write. A file therefore first shows its whole list of steps (e.g. Step 1, Step 2, Step 3 stacked) before any code appears.
- **Then fill each step, in order.** One Edit per step: change `# Step N: <text>` to `# <text>` (delete only `Step N: `, keep the words exactly) and put the code directly below it in the same Edit. The user sees the label go and the code appear under it.
- Write each comment so it still reads well as a permanent code comment once its label is gone: what this code does and why, in at most two lines. No chat phrasing ("now I'll…").
- When a step removes code, its comment says what goes and why; delete that comment together with the code in the filling Edit, since nothing remains for it to describe.
- Steps that only change config or one-line values may skip the layout comment; narrate them in chat instead.
- Make exactly one Edit/Write per message, with a one-line chat narration before it ("Step 2/4 — `export.ts`: fill in `buildCsv`"). No parallel edits.
- If the plan changes, say so, show the updated step list, and fix the step comments still in the files to match.

## 4. Keep each edit small and readable
- Use Edit on existing files; never rewrite a whole file to change part of it (it would all be retyped).
- Roughly one function or less per Edit. For a new file, first Write its skeleton (structure, signatures), then fill each part with its own Edit.
- Don't reformat, rename or reorder code you aren't changing — it gets typed out too and buries the real change.
- Don't edit files through Bash (`sed`, `cat >`, scripts); those changes are not shown to the user.
- No edits outside the plan.

## 5. Narrate testing and verification
- Before each command (test, build, lint, run): what it checks and what result you expect.
- After it: what the output means in plain words.
- On failure: what the failure tells you, what you'll change, then make the fix narrated as in steps 3–4.

## 6. Recap
Walk the finished flow once more in order with `file:line` pointers, so the user can re-read it. Name anything you did not test.
