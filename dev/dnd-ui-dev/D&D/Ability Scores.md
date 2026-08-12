---
proficiency_bonus: 3
level: 7
dexAdvantage: true
wisDisadvantage: true
conAdvantage: false
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

## Advantage and Disadvantage

Saving throw advantage marks the save with a teal up-chevron, disadvantage with a
red down-chevron. Hover an indicator for a tooltip. Keys accept full ability names or
3-letter abbreviations. Expect: STR and DEX up-chevrons, CON and INT
down-chevrons, WIS and CHA no indicator (flagged both / flagged neither).

```ability
abilities:
  strength: 15
  dexterity: 14
  constitution: 13
  intelligence: 12
  wisdom: 10
  charisma: 8

proficiencies:
  - strength
  - wisdom

advantage:
  strength: true
  dex: true
  wisdom: true

disadvantage:
  constitution: true
  int: true
  wis: true
```

## Reactive Advantage

Advantage bound to frontmatter. Edit `dexAdvantage`, `wisDisadvantage`, or
`conAdvantage` in this file's frontmatter — the indicators should update without a
reload. Initial state: DEX up-chevron, WIS down-chevron, CON none.

```ability
abilities:
  strength: 12
  dexterity: 16
  constitution: 14
  intelligence: 10
  wisdom: 13
  charisma: 8

proficiencies:
  - dexterity

advantage:
  dexterity: "{{frontmatter.dexAdvantage}}"
  constitution: "{{frontmatter.conAdvantage}}"

disadvantage:
  wisdom: "{{frontmatter.wisDisadvantage}}"
```

## No Advantage Keys

Regression check: a block with no advantage/disadvantage keys must render no
indicators at all.

```ability
abilities:
  strength: 12
  dexterity: 12
  constitution: 12
  intelligence: 12
  wisdom: 12
  charisma: 12

proficiencies:
  - strength
```
