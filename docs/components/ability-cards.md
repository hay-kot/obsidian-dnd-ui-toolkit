# Ability Cards

Ability Cards are a headless, system-agnostic card component for displaying ability-style data. Each card shows a label, a value, and an optional sublabel. No automatic modifier calculation is performed — you supply the exact values to display. All text properties support [dynamic content](/concepts/dynamic-content) templates for frontmatter integration and calculations.

::: info System-Agnostic Components
System-agnostic component support is limited but will continue to improve in future releases. Join the [discussion on GitHub](https://github.com/hay-kot/obsidian-dnd-ui-toolkit/discussions/56) to share feedback and ideas.
:::

::: tip When to use Ability Cards vs. D&D 5e Ability Scores
The [D&D 5e Ability Scores](/character-sheet/ability-scores) block integrates with frontmatter, automatically calculates modifiers from raw scores, and supports proficiency and bonuses for saving throws. Use it when you want full D&D 5e ability score mechanics.

**Ability Cards** display whatever values you provide with no automatic calculations. They support [dynamic content](/concepts/dynamic-content) templates for pulling values from frontmatter and performing calculations. Use them when you want full control over what is shown, or when working outside D&D 5e.
:::

<DaggerHeartAbilityDemo />

## Example

This example shows Dagger Heart traits, but Ability Cards work with any TTRPG system.

````yaml
```ability-cards
items:
  - label: Agility
    label_short: AGI
    header_value: 14
    value: '+2'
    sublabel: Evasion 14
  - label: Strength
    label_short: STR
    header_value: 12
    value: '+1'
    sublabel: Threshold 5
  - label: Finesse
    label_short: FIN
    header_value: 16
    value: '+3'
    sublabel: Attack +5
  - label: Instinct
    label_short: INS
    header_value: 10
    value: '+0'
    sublabel: Reaction 12
  - label: Presence
    label_short: PRE
    header_value: 14
    value: '+2'
    sublabel: Influence 14
  - label: Knowledge
    label_short: KNO
    header_value: 12
    value: '+1'
    sublabel: Recall 13
```
````

## Configuration

| Property | Type  | Default  | Description                           |
| -------- | ----- | -------- | ------------------------------------- |
| `items`  | Array | Required | List of ability card items to display |

### Item Object

| Property       | Type          | Default | Description                                                    |
| -------------- | ------------- | ------- | -------------------------------------------------------------- |
| `label` †      | String        | —       | The main label for the card                                    |
| `label_short` †| String        | —       | Optional abbreviated label displayed in the card header        |
| `header_value` †| Number       | —       | Optional value displayed in the header next to the label       |
| `value` †      | String/Number | —       | The primary value to display (large, centered)                 |
| `sublabel` †   | String        | —       | Optional additional text below the value                       |

† Supports [dynamic content](/concepts/dynamic-content) templates

## Dynamic Content Example

::: v-pre
Use frontmatter values to drive ability card display. When frontmatter changes, the cards update automatically.

```yaml
---
agility: 14
strength: 12
finesse: 16
---
```

````yaml
```ability-cards
items:
  - label: Agility
    label_short: AGI
    header_value: '{{ frontmatter.agility }}'
    value: '+{{ floor (divide (subtract frontmatter.agility 10) 2) }}'
  - label: Strength
    label_short: STR
    header_value: '{{ frontmatter.strength }}'
    value: '+{{ floor (divide (subtract frontmatter.strength 10) 2) }}'
  - label: Finesse
    label_short: FIN
    header_value: '{{ frontmatter.finesse }}'
    value: '+{{ floor (divide (subtract frontmatter.finesse 10) 2) }}'
```
````

:::
