---
description: Screenshot a page in this static-HTML Valheim guides site to visually verify a CSS/layout change. Use whenever you'd otherwise eyeball a diff to a *.html page in this repo (row spacing, colors, fonts, filter bars, etc).
---

# Screenshot a guide page

This repo is plain static HTML/CSS/JS (no dev server, no build step).
Use the project's own screenshot tool at `.claude/tools/screenshot.js`
— a small Playwright script, not the `npx playwright screenshot` CLI.
(`npx ...` reliably re-prompts for approval every single call even
when allowlisted — likely a hard-coded safety guard around package
runners — so don't use it here. This script is a plain `node` call
against a fixed local file, which the allowlist actually honors.)

## Command

Run this as its **own, standalone Bash call**, from the repo root, and
do not prefix or chain it with `&&`, `;`, a leading `rm`, `cd`, or a
variable assignment on a previous line — the project's
`.claude/settings.json` allowlists the exact prefix
`node .claude/tools/screenshot.js`, so the command must *start* with
that string or it requires manual approval again. If a prior command
in this session left the shell's cwd inside `.claude/tools`, `cd` back
to the repo root FIRST as its own call, then run this one standalone.

```
node .claude/tools/screenshot.js <page.html> <output.png> [options]
```

Page path is relative to the repo root (e.g. `food.html`). Output is
written to `.claude/tools/output/<output.png>` (gitignored) unless you
pass an absolute path.

Options:
- `--viewport=W,H` — default `1400,900`
- `--full-page` — capture the whole scrollable page, not just the viewport
- `--hover=<selector>` — hover an element before capturing (tooltip checks)
- `--focus=<selector>` — keyboard-focus an element before capturing (a11y checks)
- `--wait=<ms>` — extra wait after load before capturing (default 200)

Then `Read` the PNG at `.claude/tools/output/<output.png>` to actually
look at it — capturing it isn't enough, view it before reporting
anything about the visual result.

## First-time setup (already done in this repo's environment)

The script needs its own local `playwright` install (kept out of the
site's own dependency tree, since this is a static site with no build
step):

```
cd .claude/tools && npm install
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
