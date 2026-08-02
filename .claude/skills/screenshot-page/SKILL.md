---
description: Screenshot a page in this static-HTML Valheim guides site to visually verify a CSS/layout change. Use whenever you'd otherwise eyeball a diff to a *.html page in this repo (row spacing, colors, fonts, filter bars, etc).
---

# Screenshot a guide page

This repo is plain static HTML/CSS/JS (no dev server, no build step).
Use the project's own screenshot tool at `tools/screenshot.js` — a
small Playwright script, not the `npx playwright screenshot` CLI.
(`npx ...` reliably re-prompts for approval even when allowlisted —
likely a hard-coded safety guard around package runners — so don't
use it here. This script is a plain `node` call against a fixed local
file, which the allowlist actually honors more reliably. It was
originally under `.claude/tools/`; it was moved to a plain top-level
`tools/` to rule out `.claude/`-path scrutiny as another variable in
that same prompting flakiness — inconclusive so far either way.)

## Command

Run this as its **own, standalone Bash call**, from the repo root, and
do not prefix or chain it with `&&`, `;`, a leading `rm`, `cd`, or a
variable assignment on a previous line — the project's
`.claude/settings.json` allowlists the exact prefix
`node tools/screenshot.js`, so the command must *start* with that
string or it requires manual approval again. If a prior command in
this session left the shell's cwd elsewhere, `cd` back to the repo
root FIRST as its own call, then run this one standalone.

```
node tools/screenshot.js <page.html> <output.png> [options]
```

Page path is relative to the repo root (e.g. `food.html`). Output is
written to `tools/output/<output.png>` (gitignored) unless you pass an
absolute path.

Options:
- `--viewport=W,H` — default `1400,900`
- `--full-page` — capture the whole scrollable page, not just the viewport
- `--hover=<selector>` — hover an element before capturing (tooltip checks)
- `--focus=<selector>` — keyboard-focus an element before capturing (a11y checks)
- `--click=<selector>` — click an element before capturing; repeatable, runs
  in order (e.g. `--click="#foo" --click="#bar"`) — for testing multi-step
  interactive/toggle state
- `--print=<selector>` — print an element's `textContent` to stdout
  (repeatable) — for verifying exact counts/labels/state precisely instead
  of only reading it off a screenshot
- `--wait=<ms>` — extra wait after load before capturing (default 200)

Then `Read` the PNG at `tools/output/<output.png>` to actually look at
it — capturing it isn't enough, view it before reporting anything
about the visual result. Prefer `--print` over eyeballing a screenshot
whenever you need an exact number or exact active/inactive state.

## First-time setup (already done in this repo's environment)

The script needs its own local `playwright` install (kept out of the
site's own dependency tree, since this is a static site with no build
step):

```
cd tools && npm install
```

This reuses the already-downloaded Chromium binary under
`~/AppData/Local/ms-playwright` if present, so it's fast. If that
binary is ever missing on a fresh machine, install it once (needs one
manual approval — it mutates the system by downloading a binary, which
is expected for a one-time setup step):

```
npx --yes playwright install chromium-headless-shell
```

## Comparing two pages

Screenshot each with its own standalone call, then `Read` both images
in the same turn to compare them side by side.
