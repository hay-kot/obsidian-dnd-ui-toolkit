---
proficiency_bonus: 3
level: 7
---

# Skills

Tests the `skills` code block which calculates skill modifiers from ability scores. Requires an `ability` block in the same file to pull scores from.

## Ability Source

This ability block provides the base scores for skill calculations below.

```ability
abilities:
  strength: 10
  dexterity: 14
  constitution: 12
  intelligence: 18
  wisdom: 13
  charisma: 8
```

## Standard Proficiencies

Basic skill proficiencies with a bonus.

```skills
proficiencies:
  - arcana
  - history
  - investigation
  - insight
  - perception

bonuses:
  - name: Eyes of the Eagle
    target: perception
    value: 2
```

## Expertise and Half Proficiency

Tests expertise (double proficiency), half proficiency, and their interaction.

```skills
proficiencies:
  - stealth
  - deception
  - persuasion
  - sleight_of_hand
  - acrobatics

expertise:
  - stealth
  - deception

half_proficiencies:
  - athletics
  - intimidation
```

## No Proficiencies

Renders all skills with no proficiencies to verify base modifier display.

```skills
```
