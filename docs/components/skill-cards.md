# Skill Cards

Skill Cards are a headless, system-agnostic card component for displaying skill-style data. Each card shows a label, an ability tag, a modifier value, and an optional proficiency level. No frontmatter integration or automatic modifier calculation is performed — you supply the exact values to display.

::: warning
Headless component support is limited but will continue to improve in future releases.
:::

::: tip When to use Skill Cards vs. Character Sheet Skills
The [Character Sheet Skills](/character-sheet/skills) block integrates with frontmatter and automatically calculates skill modifiers from your ability scores, proficiency bonus, and any bonuses you define. Use it when you want full D&D 5e skill mechanics.

**Skill Cards** display whatever values you provide with no calculations or frontmatter dependency. Use them when you want full control over what is shown, or when working outside standard D&D 5e skills.
:::

## Example

````yaml
```skill-cards
items:
  - label: Perception
    ability: Wis
    modifier: 5
    proficiency: proficient
  - label: Stealth
    ability: Dex
    modifier: 8
    proficiency: expert
  - label: History
    ability: Int
    modifier: 1
    proficiency: half
  - label: Athletics
    ability: Str
    modifier: 3
```
````

## Configuration

| Property | Type  | Description                          |
| -------- | ----- | ------------------------------------ |
| `items`  | Array | List of skill card items to display  |

### Item Object

| Property      | Type   | Description                                                                      |
| ------------- | ------ | -------------------------------------------------------------------------------- |
| `label`       | String | The skill name to display                                                        |
| `ability`     | String | The associated ability (e.g. Wis, Dex, Str)                                      |
| `modifier`    | Number | The modifier value to display                                                    |
| `proficiency` | String | Proficiency level: `"proficient"`, `"expert"`, `"half"`, or omit for no proficiency |
