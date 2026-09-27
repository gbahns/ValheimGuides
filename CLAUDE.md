# Working in this repo

A static site: plain HTML pages, Tailwind from the CDN, `shared/chrome.js`
injects the nav (add a page to its `PAGES` list) and `shared/styles.css`
holds the palette. No build step. Published from GitHub on push; the host
serves clean URLs, so `mods.html` is reached as `/mods` and the `.html`
links in the nav redirect there.

## The Mods page is data-driven from outside this repo

- `data/modset.json` and `data/modset.js` are **generated**. Do not edit
  them. They come from `valheim.ps1 dev export` in the server-tools repo
  (`C:\Dev\Apps\valheim-server-tools`, function `Export-ValheimModSet` in
  `src\ValheimServer.psm1`), which reads the same sources as the dev
  dashboard's Development board: the Default SD Gale profile (packages and
  their manifests), the ValheimMods repo (Greg's mods and their manifests),
  `mods.json` there for each mod's side, and what the Bahnsheim server is
  actually running. To add a field to the page, add it to the export first.
- Player-facing fields only. The export deliberately carries no paths, no
  addresses and none of the `why` text from `mods.json`; keep it that way.
- `data/modset.notes.js` is the hand-written overlay, keyed by mod id
  (`Author-Name`): `note` adds a sentence under a mod, `hide` drops it. The
  two shared libraries (JsonDotNET, YamlDotNet) are hidden there.
- The data is loaded with `<script>` tags, not fetched, on purpose: a page
  opened from `file://` cannot fetch JSON but can load a script, so the page
  previews locally. Keep it that way.
- Side vocabulary comes from `mods.json`: `client`, `server`, `both`,
  `optional-server` (shown as "client, server optional"), or `unknown` when
  a package has no entry there. A blank Side pill means a missing entry;
  the fix is an entry in `mods.json`, then `dev refresh` and `dev export`
  (the export reads the board that refresh writes, not `mods.json` itself).
- Refreshing the list after the mod set changes:
  `C:\ValheimServer\scripts\valheim.ps1 dev export -Commit`
  regenerates both data files and commits and pushes them if they changed.
- The page has two views, Table (the default) and Cards, switched with the
  buttons at the right of the title. One flat list; server-only mods sit in
  it with a "server only" pill. The choice and the table sort are remembered in
  localStorage. In the table each row is one line; clicking a row opens a
  popup with the full card, including the links.

## Checking a page

`tools/screenshot.js` renders a page from a file URL using `tools/run.json`
for its parameters (see the comment at its top for why it takes no
arguments). `tools/shot-mods.js` serves the repo over HTTP first, from the
days when the page fetched its data; either works for `mods.html` now.
