# Skill Cards

Skill Cards are a headless, system-agnostic card component for displaying skill-style data. Each card shows a label, an ability tag, a modifier value, and an optional proficiency level. No automatic modifier calculation is performed — you supply the exact values to display. All text and numeric properties support [dynamic content](/concepts/dynamic-content) templates for frontmatter integration and calculations.

::: info System-Agnostic Components
System-agnostic component support is limited but will continue to improve in future releases. Join the [discussion on GitHub](https://github.com/hay-kot/obsidian-dnd-ui-toolkit/discussions/56) to share feedback and ideas.
:::

::: tip When to use Skill Cards vs. D&D 5e Skills
The [D&D 5e Skills](/character-sheet/skills) block integrates with frontmatter and automatically calculates skill modifiers from your ability scores, proficiency bonus, and any bonuses you define. Use it when you want full D&D 5e skill mechanics.

**Skill Cards** display whatever values you provide with no automatic calculations. They support [dynamic content](/concepts/dynamic-content) templates for pulling values from frontmatter and performing calculations. Use them when you want full control over what is shown, or when working outside D&D 5e.
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

## Configuration

| Property | Type  | Default  | Description                         |
| -------- | ----- | -------- | ----------------------------------- |
| `items`  | Array | Required | List of skill card items to display |

### Item Object

| Property      | Type   | Default | Description                                                                         |
| ------------- | ------ | ------- | ----------------------------------------------------------------------------------- |
| `label` †     | String | —       | The skill name to display                                                           |
| `ability` †   | String | —       | The associated ability (e.g. Wis, Dex, Str)                                         |
| `modifier` †  | Number | —       | The modifier value to display                                                       |
| `proficiency` | String | —       | Proficiency level: `"proficient"`, `"expert"`, `"half"`, or omit for no proficiency |

† Supports [dynamic content](/concepts/dynamic-content) templates

## Dynamic Content Example

::: v-pre
Use frontmatter values to drive skill card display. When frontmatter changes, the cards update automatically.

```yaml
---
arcana_mod: 4
blade_mod: 3
codex_mod: 5
---
```

````yaml
```skill-cards
items:
  - label: Arcana
    ability: Knowledge
    modifier: '{{ frontmatter.arcana_mod }}'
    proficiency: proficient
  - label: Blade
    ability: Strength
    modifier: '{{ frontmatter.blade_mod }}'
    proficiency: proficient
  - label: Codex
    ability: Knowledge
    modifier: '{{ frontmatter.codex_mod }}'
    proficiency: expert
```
````

:::
