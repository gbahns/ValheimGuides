// Hand-written overlay for mods.html, keyed by the mod id used in modset.json
// (Author-Name). modset.json / modset.js are generated; edit THIS file to add
// a player-facing note or to hide a mod from the page.
//   note - one sentence shown under the mod's description, in accent colour
//   hide - true to leave the mod off the page (a library nobody installs by hand, say)
//   client - "group" when the group asks everyone to install a client-side mod; the
//            page then shows it as Required by Group instead of Optional
// It is a script rather than JSON so the page also works opened as a file.
window.MODSET_NOTES = {
  "ValheimModding-JsonDotNET": { "hide": true },
  "ValheimModding-YamlDotNet": { "hide": true }
};
