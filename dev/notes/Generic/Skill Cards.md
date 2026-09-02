---
arcana_mod: 5
stealth_mod: 4
athletics_mod: 2
perception_mod: 3
prof_bonus: 3
---

# Skill Cards (Raw)

Tests the `skill-cards` code block which renders raw skill data without automatic calculation. Unlike the `skills` block, this takes pre-computed modifier values and explicit proficiency levels.

## Dynamic Content

Skill cards with modifiers driven by frontmatter. Change the frontmatter values above to verify cards update reactively.

```skill-cards
items:
  - label: Arcana
    ability: INT
    modifier: '{{ frontmatter.arcana_mod }}'
    proficiency: proficient
  - label: Stealth
    ability: DEX
    modifier: '{{ frontmatter.stealth_mod }}'
    proficiency: expert
  - label: Athletics
    ability: STR
    modifier: '{{ frontmatter.athletics_mod }}'
  - label: Perception
    ability: WIS
    modifier: '{{ frontmatter.perception_mod }}'
    proficiency: proficient
```

## Dynamic Content with Math

Skill modifiers computed using math helpers and frontmatter values.

```skill-cards
items:
  - label: Arcana (Prof)
    ability: INT
    modifier: '{{ add frontmatter.arcana_mod frontmatter.prof_bonus }}'
    proficiency: proficient
  - label: Stealth (Expert)
    ability: DEX
    modifier: '{{ add frontmatter.stealth_mod (multiply frontmatter.prof_bonus 2) }}'
    proficiency: expert
  - label: Athletics (Half)
    ability: STR
    modifier: '{{ add frontmatter.athletics_mod (floor (divide frontmatter.prof_bonus 2)) }}'
    proficiency: half
```

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
