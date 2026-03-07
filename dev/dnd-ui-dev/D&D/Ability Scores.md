---
proficiency_bonus: 3
level: 7
---

# Ability Scores

Tests the `ability` code block which renders a 6-column grid of ability scores with modifiers and saving throws.

## Standard Abilities

Basic ability scores with proficiencies and a saving throw bonus.

```ability
abilities:
  strength: 9
  dexterity: 14
  constitution: 14
  intelligence: 19
  wisdom: 12
  charisma: 10

proficiencies:
  - intelligence
  - wisdom

bonuses:
  - name: Cloak of Protection
    target: dexterity
    value: 1
    modifies: saving_throw
```

## High Stats

All high stats to verify modifier calculations at upper range.

```ability
abilities:
  strength: 20
  dexterity: 20
  constitution: 20
  intelligence: 20
  wisdom: 20
  charisma: 20

proficiencies:
  - strength
  - dexterity
  - constitution
  - intelligence
  - wisdom
  - charisma
```

## Low Stats

All low stats to verify negative modifiers display correctly.

```ability
abilities:
  strength: 3
  dexterity: 6
  constitution: 8
  intelligence: 5
  wisdom: 7
  charisma: 4
```

## Score Bonus

Bonus that modifies the ability score itself rather than the saving throw.

```ability
abilities:
  strength: 14
  dexterity: 10
  constitution: 12
  intelligence: 10
  wisdom: 10
  charisma: 10

bonuses:
  - name: Belt of Giant Strength
    target: strength
    value: 4
    modifies: score
```
