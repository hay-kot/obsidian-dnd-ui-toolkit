# Ability Cards

Ability Cards are a headless, system-agnostic card component for displaying ability-style data. Each card shows a label, a value, and an optional sublabel. No frontmatter integration or modifier calculation is performed — you supply the exact values to display.

::: info System-Agnostic Components
System-agnostic component support is limited but will continue to improve in future releases. Join the [discussion on GitHub](https://github.com/hay-kot/obsidian-dnd-ui-toolkit/discussions/56) to share feedback and ideas.
:::

::: tip When to use Ability Cards vs. D&D 5e Ability Scores
The [D&D 5e Ability Scores](/character-sheet/ability-scores) block integrates with frontmatter, automatically calculates modifiers from raw scores, and supports proficiency and bonuses for saving throws. Use it when you want full D&D 5e ability score mechanics.

**Ability Cards** display whatever values you provide with no calculations or frontmatter dependency. Use them when you want full control over what is shown, or when working outside D&D 5e.
:::

<DaggerHeartAbilityDemo />

## Example

This example shows Dagger Heart traits, but Ability Cards work with any TTRPG system.

````yaml
```ability-cards
items:
  - label: Agility
    value: '+2'
    sublabel: Evasion 14
  - label: Strength
    value: '+1'
    sublabel: Threshold 5
  - label: Finesse
    value: '+3'
    sublabel: Attack +5
  - label: Instinct
    value: '+0'
    sublabel: Reaction 12
  - label: Presence
    value: '+2'
    sublabel: Influence 14
  - label: Knowledge
    value: '+1'
    sublabel: Recall 13
```
````

## Configuration

| Property | Type  | Default  | Description                           |
| -------- | ----- | -------- | ------------------------------------- |
| `items`  | Array | Required | List of ability card items to display |

### Item Object

| Property   | Type          | Default | Description                              |
| ---------- | ------------- | ------- | ---------------------------------------- |
| `label`    | String        | —       | The main label for the card              |
| `value`    | String/Number | —       | The value to display                     |
| `sublabel` | String        | —       | Optional additional text below the value |
