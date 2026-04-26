# Attribute Cards

Attribute Cards extend the idea of [Ability Cards](/components/ability-cards) into a **three-realm layout** (for example physical, cognitive, and spiritual). Each realm has two **attribute** cards with a **defense** card in the center. The defense card uses a **shield-shaped** frame (not a plain rectangle). Below each realm, you can list **resource** tracks (health, focus, investiture, etc.) as compact stat-style cards.

You can supply static values, dynamic templates (for example `{{frontmatter.str}}`), or pull from persisted state.
Optionally, each cell can pull its `value` from persisted component state via `value_state`.

::: info System-agnostic
Use this block when you need grouped attributes and a visual distinction for defense, such as Cosmere / Mistborn-style physical–cognitive–spiritual character sheets.
:::

<AttributeCardsDemo />

## Example

Use the `attribute-cards` code block (separate from `ability-cards`, which remains a simple flat grid).

````yaml
```attribute-cards
heading: Attributes
realms:
  - label: Physical
    primary:
      label: Strength
      label_short: STR
      header_value: "+1"
      value: "0"
    defense:
      label: Physical defense
      label_short: PDEF
      header_value: 0
      value: "0"
    secondary:
      label: Speed
      label_short: SPD
      header_value: 0
      value: "0"
    resources:
      - label: Health (maximum)
        value: 10
      - label: Health (current)
        value: 8
      - label: Deflect
        value: "0"
  - label: Cognitive
    primary:
      label: Intellect
      label_short: INT
      header_value: 0
      value: "0"
    defense:
      label: Cognitive defense
      label_short: CDEF
      header_value: 0
      value: "0"
    secondary:
      label: Willpower
      label_short: WIL
      header_value: 0
      value: "0"
    resources:
      - label: Focus (maximum)
        value: 3
      - label: Focus (current)
        value: 2
  - label: Spiritual
    primary:
      label: Awareness
      label_short: AWA
      header_value: 0
      value: "0"
    defense:
      label: Spiritual defense
      label_short: SDEF
      header_value: 0
      value: "0"
    secondary:
      label: Presence
      label_short: PRE
      header_value: 0
      value: "0"
    resources:
      - label: Investiture (maximum)
        value: 5
      - label: Investiture (current)
        value: 3
```
````

## Configuration

| Property  | Type   | Default  | Description                                      |
| --------- | ------ | -------- | ------------------------------------------------ |
| `heading` | String | (none)   | Optional title shown above the realms.           |
| `realms`  | Array  | Required | Each realm: label, `primary`, `defense`, `secondary`, and optional `resources`. |

### Realm object

| Property    | Type   | Default  | Description                                                        |
| ----------- | ------ | -------- | ------------------------------------------------------------------ |
| `label`     | String | Required | Section title (e.g. Physical, Cognitive, Spiritual).               |
| `primary`   | Object | Required | Left attribute card. Same fields as a cell in the table below.     |
| `defense`   | Object | Required | Center **shield** card (defense for this realm).                   |
| `secondary` | Object | Required | Right attribute card.                                            |
| `resources` | Array  | (none)   | Optional list of small resource cards below the three main cards. |

### Cell object (`primary`, `defense`, `secondary`, and each `resources[]` item)

| Property       | Type          | Default | Description                                               |
| -------------- | ------------- | ------- | --------------------------------------------------------- |
| `label`        | String        | —       | Full name (e.g. for tooltips / future use)                |
| `label_short`  | String        | —       | Shown in the card header. Falls back to `label`.          |
| `header_value` | String/Number | —       | Optional value in the header, next to the short label.      |
| `value`        | String/Number | —       | Main value (large, centered; strings recommended for `"+1"`). |
| `value_state`  | Object        | —       | Optional dynamic source for `value` from persisted state (`state_key` + `path`). |
| `sublabel`     | String        | —       | Optional small line under the value.                      |

† `label`, `label_short`, `header_value`, `value`, and `sublabel` support [dynamic content](/concepts/dynamic-content) templates

### `value_state` object

| Property    | Type          | Default | Description |
| ----------- | ------------- | ------- | ----------- |
| `state_key` | String        | Required | Persisted state key (e.g. your `healthpoints` block `state_key`). |
| `path`      | String        | Required | Dot path into state JSON (e.g. `current`, `resources.focus`). |
| `fallback`  | String/Number | `value`  | Used if the state key/path is missing or not numeric/string. |

### Dynamic state example (health/focus/investiture)

````yaml
```attribute-cards
heading: Attributes
realms:
  - label: Physical
    primary: { label: Strength, label_short: STR, value: "0" }
    defense: { label: Physical defense, label_short: PDEF, value: "0" }
    secondary: { label: Speed, label_short: SPD, value: "0" }
    resources:
      - label: Health (current)
        value: 0
        value_state:
          state_key: din_health
          path: current
      - label: Health (maximum)
        value: 24
      - label: Deflect
        value: "0"
  - label: Cognitive
    primary: { label: Intellect, label_short: INT, value: "0" }
    defense: { label: Cognitive defense, label_short: CDEF, value: "0" }
    secondary: { label: Willpower, label_short: WIL, value: "0" }
    resources:
      - label: Focus (current)
        value: 0
        value_state:
          state_key: din_health
          path: resources.focus
      - label: Focus (maximum)
        value: 10
  - label: Spiritual
    primary: { label: Awareness, label_short: AWA, value: "0" }
    defense: { label: Spiritual defense, label_short: SDEF, value: "0" }
    secondary: { label: Presence, label_short: PRE, value: "0" }
    resources:
      - label: Investiture (current)
        value: 0
        value_state:
          state_key: din_health
          path: resources.investiture
      - label: Investiture (maximum)
        value: 12
```
````

## Features

- **Plain ability grid unchanged:** the existing `ability-cards` code block and single-column grid of rectangular cards is unchanged. Use that for Fate, Pathfinder examples, or any layout that does not need three realms and a shield.
- **Defense** is only a presentation wrapper; rules are up to your game.
- On very narrow viewports, the three cards stack vertically in order: primary, defense, secondary.
