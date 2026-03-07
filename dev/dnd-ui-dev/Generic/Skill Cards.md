# Skill Cards (Raw)

Tests the `skill-cards` code block which renders raw skill data without automatic calculation. Unlike the `skills` block, this takes pre-computed modifier values and explicit proficiency levels.

## Mixed Proficiency Levels

Skills with different proficiency states: proficient, expert, half, and none.

```skill-cards
items:
  - label: Arcana
    ability: INT
    modifier: 7
    proficiency: proficient
  - label: Stealth
    ability: DEX
    modifier: 8
    proficiency: expert
  - label: History
    ability: INT
    modifier: 5
    proficiency: half
  - label: Athletics
    ability: STR
    modifier: 0
  - label: Perception
    ability: WIS
    modifier: 4
    proficiency: proficient
  - label: Deception
    ability: CHA
    modifier: -1
```

## All Proficient

Every skill marked proficient.

```skill-cards
items:
  - label: Acrobatics
    ability: DEX
    modifier: 5
    proficiency: proficient
  - label: Animal Handling
    ability: WIS
    modifier: 4
    proficiency: proficient
  - label: Investigation
    ability: INT
    modifier: 7
    proficiency: proficient
```

## Negative Modifiers

Skills with negative modifiers to verify display.

```skill-cards
items:
  - label: Athletics
    ability: STR
    modifier: -2
  - label: Intimidation
    ability: CHA
    modifier: -3
  - label: Performance
    ability: CHA
    modifier: -1
```
