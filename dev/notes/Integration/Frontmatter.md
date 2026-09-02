---
level: 10
proficiency_bonus: 4
hp: 72
---

# Frontmatter Integration

Tests dynamic content that reads from frontmatter properties. Change the frontmatter values above to verify components update reactively.

## Ability Source

```ability
abilities:
  strength: 12
  dexterity: 16
  constitution: 14
  intelligence: 20
  wisdom: 10
  charisma: 8
```

## Dynamic Badges

Badges pulling values from frontmatter and computing from abilities.

```badges
items:
  - label: Level
    value: '{{ frontmatter.level }}'
  - label: Prof Bonus
    value: '+{{ frontmatter.proficiency_bonus }}'
  - label: Initiative
    value: '+{{ modifier abilities.dexterity }}'
  - label: AC (Mage Armor)
    value: '{{ add 13 (modifier abilities.dexterity) }}'
  - label: Spell Attack
    value: '+{{ add frontmatter.proficiency_bonus (modifier abilities.intelligence) }}'
  - label: Spell DC
    value: '{{ add 8 frontmatter.proficiency_bonus (modifier abilities.intelligence) }}'
```

## Dynamic Health

Health reading max HP from frontmatter.

```healthpoints
state_key: test_fm_health
health: '{{ frontmatter.hp }}'
hitdice:
  dice: d6
  value: 10
```

## Dynamic Stats

Stats using template expressions.

```stats
items:
  - label: Spell Attack
    value: '+{{ add frontmatter.proficiency_bonus (modifier abilities.intelligence) }}'
  - label: Spell DC
    sublabel: "8 + prof + INT"
    value: '{{ add 8 frontmatter.proficiency_bonus (modifier abilities.intelligence) }}'
  - label: Passive Perception
    value: '{{ add 10 (modifier abilities.wisdom) }}'

grid:
  columns: 3
```

## Skills with Frontmatter Proficiency

Skills use the proficiency_bonus from frontmatter for calculations.

```skills
proficiencies:
  - arcana
  - investigation
  - history
  - perception

expertise:
  - arcana

bonuses:
  - name: Ioun Stone of Insight
    target: investigation
    value: 1
```
