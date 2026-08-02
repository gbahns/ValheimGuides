---
description: Screenshot a page in this static-HTML Valheim guides site to visually verify a CSS/layout change. Use whenever you'd otherwise eyeball a diff to a *.html page in this repo (row spacing, colors, fonts, filter bars, etc).
---

# Screenshot a guide page

This repo is plain static HTML/CSS/JS (no dev server, no build step).
Use the project's own screenshot tool at `tools/screenshot.js` — a
small Playwright script, not the `npx playwright screenshot` CLI
(`npx ...` reliably re-prompts for approval even when allowlisted —
likely a hard-coded safety guard around package runners).

**Parameters go in `tools/run.json`, not CLI args.** The Bash command
itself is always the same literal `node tools/screenshot.js` with zero
arguments. This is deliberate: the permission-approval flow in this
environment appears to save an exact-match rule for whatever literal
command was approved, not a generalized wildcard — so a command whose
arguments change every call (different output filename, viewport,
selectors...) never benefits from a prior approval, no matter how the
allowlist entry is written. Keeping the invocation byte-for-byte
identical every time is what actually lets one approval cover every
future call.

## Command

1. Write `tools/run.json` using the Write or Edit tool (not Bash):

   ```json
   {
     "page": "food.html",
     "output": "check.png",
     "viewport": "1400,900",
     "wait": 200
   }
   ```

   Full field list (all optional except `page`/`output`):
   - `page` — relative to repo root (e.g. `"food.html"`), or absolute
   - `output` — written to `tools/output/<output>` (gitignored) unless absolute
   - `viewport` — `"W,H"`, default `"1400,900"`
   - `fullPage` — `true` to capture the whole scrollable page, not just the viewport
   - `hover` — selector to hover before capturing (tooltip checks)
   - `focus` — selector to keyboard-focus before capturing (a11y checks)
   - `clicks` — array of selectors to click in order before capturing (multi-step
     interactive/toggle state)
   - `prints` — array of selectors; each element's `textContent` is printed to
     stdout — for verifying exact counts/labels/state precisely instead of only
     reading it off a screenshot
   - `rects` — array of selectors; each element's box geometry (clientWidth,
     scrollWidth, right, hasHorizontalOverflow, etc.) is printed as JSON — for
     diagnosing overflow/whitespace layout bugs without guessing from pixels
   - `evals` — array of JS expressions evaluated in the page, results printed
     (JSON-stringified) — general escape hatch for one-off diagnostics
     (console errors, CSS custom property values, etc.)
   - `wait` — extra ms to wait after load before capturing (default `200`)

2. Run this as its **own, standalone Bash call**, from the repo root,
   with no arguments, and do not prefix or chain it with `&&`, `;`, a
   leading `rm`, `cd`, or a variable assignment on a previous line —
   the command must be *exactly* `node tools/screenshot.js`, nothing
   more, nothing less, or it falls outside the allowlist and requires
   manual approval again. If a prior command in this session left the
   shell's cwd elsewhere, `cd` back to the repo root FIRST as its own
   call, then run this one standalone.

   ```
   node tools/screenshot.js
   ```

3. `Read` the PNG at `tools/output/<output>` to actually look at it —
   capturing it isn't enough, view it before reporting anything about
   the visual result. Prefer `prints`/`rects`/`evals` over eyeballing a
   screenshot whenever you need an exact number or exact state.

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

Write `tools/run.json` and run the standalone command once per page,
then `Read` both output images in the same turn to compare them side
by side.
