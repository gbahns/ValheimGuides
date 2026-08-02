---
description: Screenshot a page in this static-HTML Valheim guides site to visually verify a CSS/layout change. Use whenever you'd otherwise eyeball a diff to a *.html page in this repo (row spacing, colors, fonts, filter bars, etc).
---

# Screenshot a guide page

This repo is plain static HTML/CSS/JS (no dev server, no build step).
Open pages directly via a `file://` URL.

## Command

Run this as its **own, standalone Bash call** — do not prefix or chain
it with `&&`, `;`, a leading `rm`, `cd`, or a variable assignment on a
previous line. The project's `.claude/settings.json` allowlists the
exact prefix `npx --yes playwright screenshot`, so the command must
*start* with that string or it'll require manual approval again.

```
npx --yes playwright screenshot --viewport-size=1400,900 --full-page "file:///c:/Dev/Apps/ValheimGuides/<page>.html" "<scratchpad>/<name>.png"
```

- Use `--full-page` when you need to see the whole table/page; omit it
  for a quick above-the-fold check (faster, smaller image).
- Write the output PNG to the session scratchpad directory, not `/tmp`.
- Then `Read` the PNG file to actually look at it — capturing it isn't
  enough, view it before reporting anything about the visual result.

## First-time setup (already done in this repo's environment)

`npx playwright screenshot` needs the headless Chromium binary. It's
already installed under `~/AppData/Local/ms-playwright` on this
machine. If it's ever missing on a fresh machine, install just the
headless shell (much smaller than the full browser download):

```
npx --yes playwright install chromium-headless-shell
```

That command is NOT in the permission allowlist (it mutates the
system by downloading a binary) — it needs one manual approval, which
is expected and fine since it's a one-time setup step.

## Comparing two pages

Screenshot each with its own standalone call, then `Read` both images
in the same turn to compare them side by side.
