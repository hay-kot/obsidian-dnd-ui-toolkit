# Test Plan

Manual verification for the three changes consolidated on
`chore/integration-testing` (PRs #70, #71, #72). Run `task dev` to build and
install into this vault, then work through each section.

## #70 — Advantage and Disadvantage

Adds optional `advantage`/`disadvantage` maps to the `ability` and `skills`
blocks. Advantage shows a teal up-chevron icon, disadvantage a red down-chevron,
both-or-neither shows an empty slot (which keeps the values column-aligned). Each indicator carries a tooltip naming the ability/skill and which
applies — hover to check the wording, not just the glyph.

- [[Ability Scores]] → *Advantage and Disadvantage*: STR and DEX up-chevron, CON and
  INT down-chevron, WIS and CHA no icon. Confirms full names and 3-letter abbreviations
  both resolve.
- [[Ability Scores]] → *Reactive Advantage*: edit `dexAdvantage`,
  `wisDisadvantage`, or `conAdvantage` in that file's frontmatter and watch the
  indicators change without a reload.
- [[Ability Scores]] → *No Advantage Keys*: no indicators at all.
- [[Skills]] → *Advantage and Disadvantage*: Perception and Stealth up-chevron,
  Athletics and Deception down-chevron, Insight none.
- [[Skills]] → *Reactive Advantage*: edit the frontmatter toggles, indicators
  follow.
- [[Skills]] → *Multi-word Skill Keys*: Sleight of Hand up-chevron, Animal Handling down-chevron.
- Confirm the skill name and modifier are no longer tinted — the icon is now the
  only signal, so the text stays the normal color.
- Tooltips are set to appear instantly (no hover delay); confirm they do.
- Confirm modifier values line up in a column whether or not a row has an icon.
- Regression: the earlier sections of both pages, plus [[Generic/Ability Cards]]
  and [[Generic/Skill Cards]], must render exactly as before — the raw card
  blocks share the same components and take the new props as optional.

## #71 — Checkbox Checked State

The checked fill moved to an `::after` pseudo-element so theme button rules can't
hide it.

- [[Checkbox States]] — full instructions on that page. The important step is
  re-testing under a theme that restyles buttons (LYT Mode), which is where the
  fill previously disappeared.
- Regression: [[Consumables]], [[Health]], and [[Initiative]] behave as before.

## #72 — Store Compliance

Mostly non-visual — manifest, tooling, and release plumbing. What is worth
clicking through in-app:

- Settings → D&D UI Toolkit: no plugin-name heading at the top, option names in
  sentence case ("State file path", not "State File Path"), theme preset and
  color pickers still apply live.
- Disable the plugin and confirm the `--dnd-ui-*` variables are removed — colors
  should revert rather than linger on the document.
- Edit any note and watch the developer console (Cmd+Opt+I): no per-edit log
  noise from the plugin.
- State persistence: check some boxes, reload, confirm they survive. The state
  store no longer falls back to an empty object on a read error, so a transient
  failure can't silently wipe state.
- `manifest.json` `minAppVersion` is now 1.0.0.

## Cross-cutting

- Run all pages in both light and dark mode.
- [[Frontmatter]] and [[Din Thornewood]] exercise the template pipeline that #70
  and #72 both touched (`lib/utils/template.ts`); confirm badges, stats, and
  health still compute.
