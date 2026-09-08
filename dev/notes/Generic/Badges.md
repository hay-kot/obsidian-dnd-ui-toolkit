---
level: 7
proficiency_bonus: 3
---

# Badges

Tests the `badges` code block which displays key-value pairs in a compact row. Supports dynamic content via template variables.

## Ability Source

Provides ability scores for dynamic badge calculations.

```ability
abilities:
  strength: 10
  dexterity: 14
  constitution: 12
  intelligence: 18
  wisdom: 13
  charisma: 8
```

## Static Badges

Simple static key-value badges.

```badges
items:
  - label: Race
    value: Half-Elf
  - label: Class
    value: Wizard
  - label: Alignment
    value: Neutral Good
```

## Dynamic Badges

Badges using template expressions for computed values.

```badges
items:
  - label: Level
    value: '{{ frontmatter.level }}'
  - label: Initiative
    value: '+{{ modifier abilities.dexterity }}'
  - label: AC
    value: '{{ add 10 (modifier abilities.dexterity) }}'
  - label: Spell Attack
    value: '+{{ add frontmatter.proficiency_bonus (modifier abilities.intelligence) }}'
  - label: Spell DC
    value: '{{ add 8 frontmatter.proficiency_bonus (modifier abilities.intelligence) }}'
```

## Dense Mode

Badges rendered in dense/compact layout.

```badges
dense: true
items:
  - label: HP
    value: '45'
  - label: AC
    value: '16'
  - label: Speed
    value: '30 ft'
  - label: Prof
    value: '+3'
```

## Value Only

Badges without labels.

```badges
items:
  - value: Wizard
  - value: Level 7
  - value: School of Evocation
```

## Reversed

Badges with label and value order reversed.

```badges
items:
  - label: STR
    value: '+0'
    reverse: true
  - label: DEX
    value: '+2'
    reverse: true
  - label: CON
    value: '+1'
    reverse: true
```
