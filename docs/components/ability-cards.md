# Ability Cards

Ability Cards are a headless, system-agnostic card component for displaying ability-style data. Each card shows a label, a value, and an optional sublabel. No frontmatter integration or modifier calculation is performed — you supply the exact values to display.

::: warning
Headless component support is limited but will continue to improve in future releases.
:::

::: tip When to use Ability Cards vs. Character Sheet Ability Scores
The [Character Sheet Ability Scores](/character-sheet/ability-scores) block integrates with frontmatter, automatically calculates modifiers from raw scores, and supports proficiency and bonuses for saving throws. Use it when you want full D&D 5e ability score mechanics.

**Ability Cards** display whatever values you provide with no calculations or frontmatter dependency. Use them when you want full control over what is shown, or when working outside standard D&D 5e ability scores.
:::

## Example

````yaml
```ability-cards
items:
  - label: Strength
    value: '+3'
    sublabel: Save +5
  - label: Dexterity
    value: '+2'
    sublabel: Save +2
  - label: Constitution
    value: '+1'
    sublabel: Save +3
  - label: Intelligence
    value: '+4'
    sublabel: Save +6
  - label: Wisdom
    value: '+0'
    sublabel: Save +0
  - label: Charisma
    value: '-1'
    sublabel: Save -1
```
````

## Configuration

| Property | Type  | Description                          |
| -------- | ----- | ------------------------------------ |
| `items`  | Array | List of ability card items to display |

### Item Object

| Property   | Type          | Description                              |
| ---------- | ------------- | ---------------------------------------- |
| `label`    | String        | The main label for the card              |
| `value`    | String/Number | The value to display                     |
| `sublabel` | String        | Optional additional text below the value |
