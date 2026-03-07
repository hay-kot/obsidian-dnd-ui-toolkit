---
level: 7
proficiency_bonus: 3
---

# Health Points

Tests the `healthpoints` code block which tracks HP, hit dice, temporary HP, and death saves. Each component needs a unique `state_key`.

## Basic Health

Single class with default settings.

```healthpoints
state_key: test_health_basic
health: 45
hitdice:
  dice: d10
  value: 5
```

## Multiclass Health

Multiple hit dice types for a multiclass character.

```healthpoints
state_key: test_health_multi
health: 58
hitdice:
  - dice: d10
    value: 5
  - dice: d8
    value: 3
```

## Custom Label

Custom label instead of default "Hit Points".

```healthpoints
state_key: test_health_label
health: 30
label: "Vitality"
hitdice:
  dice: d6
  value: 4
```

## No Death Saves

Health tracker with death saves disabled.

```healthpoints
state_key: test_health_no_death
health: 80
death_saves: false
hitdice:
  dice: d12
  value: 8
```

## Always Show Death Saves

Death saves visible at any HP level, not just at 0 HP.

```healthpoints
state_key: test_health_always_death
health: 40
death_saves: "always"
hitdice:
  dice: d8
  value: 5
```

## Minimal

Health only, no hit dice.

```healthpoints
state_key: test_health_minimal
health: 20
```

## Template Hit Dice

Hit dice count derived from character level via frontmatter. Change the `level` in frontmatter to see the hit dice count update.

```ability
abilities:
  strength: 14
  dexterity: 12
  constitution: 16
  intelligence: 10
  wisdom: 13
  charisma: 8
```

```healthpoints
state_key: test_health_template_hd
health: "{{add (multiply frontmatter.level 8) (multiply (modifier abilities.constitution) frontmatter.level)}}"
hitdice:
  dice: d8
  value: "{{frontmatter.level}}"
```

## Event Buttons for Reset

Use these buttons to test rest-based HP reset.

```event-btns
items:
  - name: Short Rest
    value: short-rest
  - name: Long Rest
    value: long-rest
```
