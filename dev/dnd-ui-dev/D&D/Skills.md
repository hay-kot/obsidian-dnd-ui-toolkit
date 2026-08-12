---
proficiency_bonus: 3
level: 7
stealthAdvantage: true
athleticsDisadvantage: true
arcanaAdvantage: false
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

## Advantage and Disadvantage

Skill advantage colors the skill green, disadvantage red. Expect: Perception and
Stealth green, Athletics and Deception red, Insight uncolored (flagged both), and
every other skill uncolored.

```skills
proficiencies:
  - perception
  - stealth
  - insight

advantage:
  perception: true
  stealth: true
  insight: true

disadvantage:
  athletics: true
  deception: true
  insight: true
```

## Reactive Advantage

Advantage bound to frontmatter. Edit `stealthAdvantage`, `athleticsDisadvantage`,
or `arcanaAdvantage` above — coloring should update without a reload. Initial
state: Stealth green, Athletics red, Arcana uncolored.

```skills
proficiencies:
  - stealth
  - arcana

advantage:
  stealth: "{{frontmatter.stealthAdvantage}}"
  arcana: "{{frontmatter.arcanaAdvantage}}"

disadvantage:
  athletics: "{{frontmatter.athleticsDisadvantage}}"
```

## Multi-word Skill Keys

Skills whose names contain a space. Keys are matched against the full skill label,
so they must be spelled with spaces, not underscores. Expect Sleight of Hand green
and Animal Handling red.

```skills
proficiencies:
  - sleight of hand

advantage:
  sleight of hand: true

disadvantage:
  animal handling: true
```

## No Proficiencies

Renders all skills with no proficiencies to verify base modifier display.

```skills
```
