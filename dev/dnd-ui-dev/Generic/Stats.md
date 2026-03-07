---
level: 5
proficiency_bonus: 3
---

# Stats

Tests the `stats` code block which displays stat cards in a configurable grid. Supports dynamic content via template variables.

## Ability Source

Provides ability scores for dynamic stat calculations.

```ability
abilities:
  strength: 16
  dexterity: 12
  constitution: 14
  intelligence: 10
  wisdom: 14
  charisma: 8
```

## 3-Column Grid

Standard 3-column stat display with sublabels.

```stats
items:
  - label: Armor Class
    sublabel: Chain Mail + Shield
    value: 18
  - label: Initiative
    value: '+{{ modifier abilities.dexterity }}'
  - label: Speed
    value: '30 ft'

grid:
  columns: 3
```

## 2-Column Grid (Default)

Default 2-column layout.

```stats
items:
  - label: Hit Points
    value: 44
  - label: Hit Dice
    sublabel: d10
    value: 5
```

## 4-Column Grid

Wide grid with many items.

```stats
items:
  - label: STR
    value: '+{{ modifier abilities.strength }}'
  - label: DEX
    value: '+{{ modifier abilities.dexterity }}'
  - label: CON
    value: '+{{ modifier abilities.constitution }}'
  - label: WIS
    value: '+{{ modifier abilities.wisdom }}'

grid:
  columns: 4
```

## Dense Mode

Compact stat cards.

```stats
dense: true
items:
  - label: Prof Bonus
    value: '+{{ frontmatter.proficiency_bonus }}'
  - label: Passive Perception
    value: '{{ add 10 (modifier abilities.wisdom) }}'
  - label: Spell DC
    value: '{{ add 8 frontmatter.proficiency_bonus (modifier abilities.wisdom) }}'

grid:
  columns: 3
```
