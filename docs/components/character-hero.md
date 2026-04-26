# Character hero

The `character-hero` code block combines a **player line**, a **full-width badges** row (under the heading, spanning the whole block), then a **two-column** row: **portrait** on the left and **healthpoints** on the right (including focus/investiture resources). It is meant for a top-of-sheet “hero” layout so you do not have to juggle multiple separate blocks for the same section.

## Example

````yaml
```character-hero
heading: "Player name: {{ frontmatter.player_name }}"
portrait: "[[path/to/portrait.png]]"
badges:
  items:
    - label: Level
      value: "1"
    - label: Paths
      value: [ "Envoy (Mentor)", "Scholar (Strategist)" ]
    - label: Lifting Capacity
      value: 100 lb
  dense: false
healthpoints: |
  state_key: din_health
  health: 24
  hitdice:
    dice: d6
    value: 3
  resources:
    - key: focus
      label: Focus
      max: 10
      current: 8
    - key: investiture
      label: Investiture
      max: 12
      current: 6
```
````

Use `portrait: https://...` for an external image URL, or a vault path / `[[wiki link]]` to a file in the vault (png/jpg/gif/webp supported).

`heading` and badge fields support the same [dynamic content](/concepts/dynamic-content) `{{ ... }}` templates as other components; the heading updates when frontmatter changes (if it contains templates).

## Configuration

| Property     | Type   | Description |
| ------------ | ------ | ----------- |
| `heading`    | String | One line of text above the two-column area (e.g. player name). |
| `portrait`   | String | URL, `[[file]]` link, or path to an image in the vault. |
| `badges`     | Object | Same shape as the [badges](/components/badges) block: `items`, optional `dense`, `grid`. Rendered full width under the heading. |
| `healthpoints` | String or object | Same fields as a [`healthpoints`](/character-sheet/healthpoints) code block, including `resources` for focus/investiture. Shown in the **right** column next to the portrait. Use a `|` multiline string or a nested object. |

**Badges** sit directly under the heading and use the full width. **Health** sits only in the right column beside the portrait. For a two-column *attributes* layout, use [Attribute Cards](/components/attribute-cards) in another block below the hero if needed.
