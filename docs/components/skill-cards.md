# Skill Cards

Skill Cards are a headless, system-agnostic card component for displaying skill-style data. Each card shows a modifier, label, and ability (in parentheses) on the left, and a five-dot rank display on the right. You can supply static values or templates (including frontmatter and math helpers), while rank dots remain controlled by `rank` / `proficiency`.

::: info System-Agnostic Components
System-agnostic component support is limited but will continue to improve in future releases. Join the [discussion on GitHub](https://github.com/hay-kot/obsidian-dnd-ui-toolkit/discussions/56) to share feedback and ideas.
:::

::: tip When to use Skill Cards vs. D&D 5e Skills
The [D&D 5e Skills](/character-sheet/skills) block integrates with frontmatter and automatically calculates skill modifiers from your ability scores, proficiency bonus, and any bonuses you define. Use it when you want full D&D 5e skill mechanics.

**Skill Cards** display whatever values you provide with no calculations or frontmatter dependency. Use them when you want full control over what is shown, or when working outside D&D 5e.
:::

<DaggerHeartSkillDemo />

## Example

This example shows Dagger Heart domains, but Skill Cards work with any TTRPG system.

````yaml
```skill-cards
items:
  - label: Arcana
    ability: Knowledge
    modifier: 4
    proficiency: proficient
  - label: Blade
    ability: Strength
    modifier: 3
    proficiency: proficient
  - label: Bone
    ability: Instinct
    modifier: 1
  - label: Codex
    ability: Knowledge
    modifier: 5
    proficiency: expert
  - label: Grace
    ability: Agility
    modifier: 3
    proficiency: proficient
  - label: Midnight
    ability: Finesse
    modifier: 4
    proficiency: half
  - label: Sage
    ability: Presence
    modifier: 2
  - label: Splendor
    ability: Presence
    modifier: 3
    proficiency: proficient
  - label: Valor
    ability: Strength
    modifier: 2
```
````

### Using `rank` (0–5)

Set `rank` to control the five-dot display directly. Absent or invalid `proficiency` values are treated as no training (rank 0 for dots). You can use `none` or `unknown` for the same effect when not using `rank`.

| `rank` | Dots (left → right)        |
| ------ | --------------------------- |
| 0      | five empty                  |
| 1      | one filled, four empty      |
| 2      | two filled, three empty     |
| 3      | three filled, two empty     |
| 4      | four filled, one empty      |
| 5      | all five filled              |

If `rank` is present in YAML, it takes precedence over `proficiency` for the dot display. If `rank` is omitted, the plugin maps `proficiency` to rank the same way as before: `half` → 2, `proficient` → 3, `expert` → 5, and no / unknown / `none` / `unknown` → 0.

````yaml
```skill-cards
items:
  - label: Agility
    ability: SPD
    modifier: 0
    rank: 3
  - label: Stealth
    ability: DEX
    modifier: 4
    rank: 0
```
````

## Configuration

| Property | Type  | Default  | Description                         |
| -------- | ----- | -------- | ----------------------------------- |
| `items`  | Array | Required | List of skill card items to display |
| `realms` | Array | Optional | Custom realm columns and skill mapping (agnostic; avoids hardcoded labels). |

### Realm Object (`realms[]`)

| Property | Type          | Default | Description |
| -------- | ------------- | ------- | ----------- |
| `id`     | String        | —       | Required realm key (e.g. `physical`, `cognitive`, `spiritual`, or any custom id). |
| `label`  | String        | `id`    | Optional display label. |
| `skills` | Array<String> | `[]`    | Optional list of skill labels that should map to this realm. Case-insensitive. |

If `realms` is provided:
- Skill cards render one column per realm in the same order as `realms`.
- Each item can optionally set `realm` to place it directly in a realm id.
- If `realm` is omitted, mapping falls back to label matching via each realm's `skills` list.
- If still unmatched, item goes to the first realm.

### Item Object

| Property      | Type   | Default | Description                                                                                                    |
| ------------- | ------ | ------- | -------------------------------------------------------------------------------------------------------------- |
| `label`       | String | —       | The skill name to display                                                                                      |
| `ability`     | String | —       | The associated ability (e.g. Wis, Dex, Str)                                                                    |
| `modifier`    | Number | —       | The modifier value to display (plain number, no leading `+`)                                                 |
| `rank`        | Number | —       | Optional. Integer 0–5: number of filled dots, left to right. When omitted, rank is derived from `proficiency`. |
| `realm`       | String | —       | Optional explicit realm id (when using custom `realms`). |
| `proficiency` | String | —       | Legacy: `"proficient"`, `"expert"`, `"half"`, `"none"`, `"unknown"`, or omit. Used for dots when `rank` is omitted. |

† `label`, `ability`, and `modifier` support [dynamic content](/concepts/dynamic-content) templates. Inside an item template, `rank` is available as a variable.

### Template example (frontmatter + rank)

````yaml
```skill-cards
items:
  - label: Agility
    ability: SPD
    rank: 1
    modifier: "{{add frontmatter.spd rank}}"
```
````

### Agnostic realms example

````yaml
```skill-cards
realms:
  - id: physical
    skills: [agility, athletics, heavy weaponry, light weaponry, stealth, thievery]
  - id: cognitive
    skills: [crafting, deduction, discipline, intimidation, lore, medicine]
  - id: spiritual
    skills: [deception, insight, leadership, perception, persuasion, survival]
items:
  - label: Agility
    ability: SPD
    modifier: 0
    rank: 1
  - label: Crafting
    ability: INT
    modifier: 0
    rank: 2
  - label: _______
    ability: ___
    modifier: 0
    realm: physical
```
````
