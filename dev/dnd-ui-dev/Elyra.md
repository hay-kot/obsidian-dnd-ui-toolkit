---
player_name: Rachel
str: "1"
spd: "1"
int: "1"
wil: "1"
awa: "1"
pre: "1"
max_health: "24"
max_focus: "3"
max_invest: "0"
---
```character-hero
heading: "Player name: {{ frontmatter.player_name }}"
portrait: "[[Pasted image 20260425183628.png]]"
badges:
  items:
    - label: Level
      value: "1"
    - label: Paths
      value: [ "Envoy (Mentor)", "Scholar (Strategist)" ]
    - label: Ancestry
      value: [ "Human", "Iriali", "Veden" ]
healthpoints: |
  state_key: din_health
  health: {{ frontmatter.max_health }}
  hitdice:
    dice: d6
    value: 3
  resources:
    - key: focus
      label: Focus
      max: {{ frontmatter.max_focus }}
      current: 8
    - key: investiture
      label: Investiture
      max: {{ frontmatter.max_invest }}
      current: 6
```

## Abilities
```attribute-cards
realms:
  - label: 
    primary:
      label: Strength
      label_short: STR
      value: "{{frontmatter.str}}"
    defense:
      label: Physical defense
      label_short: Physical defense
      value: "0"
    secondary:
      label: Speed
      label_short: SPD
      header_value: 0
      value: "{{frontmatter.spd}}"
    resources:
      - label: Health (maximum)
        value: 24
      - label: Health (current)
        value: 0
        value_state:
          state_key: din_health
          path: current
      - label: Deflect
        value: "0"
  - label: 
    primary:
      label: Intellect
      label_short: INT
      value: "{{frontmatter.int}}"
    defense:
      label: Cognitive defense
      label_short: Cognitive defense
      value: "0"
    secondary:
      label: Willpower
      label_short: WIL
      value: "{{frontmatter.wil}}"
    resources:
      - label: Focus (maximum)
        value: 10
      - label: Focus (current)
        value: 8
        value_state:
          state_key: din_health
          path: resources.focus
  - label: 
    primary:
      label: Awareness
      label_short: AWA
      value: "{{frontmatter.awa}}"
    defense:
      label: Spiritual defense
      label_short: Spiritual defense
      value: "0"
    secondary:
      label: Presence
      label_short: PRE
      value: "{{frontmatter.pre}}"
    resources:
      - label: Investiture (maximum)
        value: 10
      - label: Investiture (current)
        value: 8
        value_state:
          state_key: din_health
          path: resources.investiture
```

## Skills

```skill-cards
realms:
  - id: physical
    skills: [agility, athletics, heavy weaponry, light weaponry, stealth, thievery]
  - id: cognitive
    skills: [crafting, deduction, discipline, intimidation, lore, medicine]
  - id: spiritual
    skills: [deception, insight, leadership, perception, persuasion, survival]

items:
  - label: Agility
    ability: SPD
    modifier: "{{add frontmatter.spd rank}}"
    rank: 1
  - label: Athletics
    ability: STR
    modifier: "{{add frontmatter.str rank}}"
    rank: 2
  - label: Heavy Weaponry
    ability: STR
    modifier: "{{add frontmatter.str rank}}"
    rank: 3
  - label: Light Weaponry
    ability: SPD
    modifier: "{{add frontmatter.spd rank}}"
    rank: 4
  - label: Stealth
    ability: SPD
    modifier: "{{add frontmatter.spd rank}}"
    rank: 5
  - label: Thievery
    ability: SPD
    modifier: "{{add frontmatter.spd rank}}"
    rank: 0
  - label: Crafting
    ability: INT
    modifier: "{{add frontmatter.int rank}}"
    rank: 4
  - label: Deduction
    ability: INT
    modifier: "{{add frontmatter.int rank}}"
  - label: Discipline
    ability: WIL
    modifier: "{{add frontmatter.wil rank}}"
  - label: Intimidation
    ability: WIL
    modifier: "{{add frontmatter.wil rank}}"
  - label: Lore
    ability: INT
    modifier: "{{add frontmatter.int rank}}"
  - label: Medicine
    ability: INT
    modifier: "{{add frontmatter.int rank}}"
  - label: Deception
    ability: PRE
    modifier: "{{add frontmatter.pre rank}}"
  - label: Insight
    ability: AWA
    modifier: "{{add frontmatter.awa rank}}"
  - label: Leadership
    ability: PRE
    modifier: "{{add frontmatter.pre rank}}"
  - label: Perception
    ability: AWA
    modifier: "{{add frontmatter.awa rank}}"
  - label: Persuasion
    ability: PRE
    modifier: "{{add frontmatter.pre rank}}"
  - label: Survival
    ability: AWA
    modifier: "{{add frontmatter.awa rank}}"
  - label: _______
    ability: ___
    modifier: 
    realm: physical
  - label: _______
    ability: ___
    modifier: 
    realm: cognitive
  - label: _______
    ability: ___
    modifier: 
    realm: spiritual
```

```stats
items:
  - label: Lifting Capacity
    value: 200 lb
    sublabel: "Carry Capacity: 100 lb"
  - label: Movement
    value: 25 ft
  - label: Recovery Die
    value: 1d6
  - label: Senses Range
    value: 10 ft
grid:
  columns: 4
```

```character-sections
conditions_injuries:
  label: "Conditions & Injuries"
  items:
    - "Bruised ribs"
    - "Poisoned"

expertises:
  label: "Expertises"
  items:
    - "Athletics, Medicine"
    - "Perception"

weapons:
  label: "Weapons"
  items:
    - name: "Longsword"
      dice: "1d8"
      damage: "Slashing"
    - name: "Shortbow"
      dice: "1d6"
      damage: "Piercing"

talents:
  label: "Talents"
  items:
    - "Iron Will    adfmasaslslalalalasd;asldkl;asdlkasfkjasdfkjdsfkjdsnfgk jndfskjgnfskjgnfskjgnkdfnkdfngkdfngkdfngkdfsnfgkdsnk"
    - "Quick Recovery"
    - "adasdkasbd"
    - "adasdkasbd"
```


## Purpose
```purpose-goals
state_key: character_goals
purpose: "Unite the scattered houses."
obstacle: "Political distrust and limited resources."
goals:
  - "Secure support from House Kholin"
  - "Recover the lost map"
  - "Train a reliable scout team"
  - "___"
  - "___"
```

```

## Spell Slots

```consumable
items:
  - label: "Level 1"
    state_key: din_spells_1
    uses: 4
  - label: "Level 2"
    state_key: din_spell_2
    uses: 2
```

### Fey Touched

```consumable
items:
  - label: "Misty Step"
    state_key: din_fey_touched_misty_step
    uses: 1
  - label: "Silvery Barbs"
    state_key: din_fey_touched_silvery_barbs
    uses: 1
```

---
## Features

### Luck Points
```consumable
label: ""
state_key: din_luck_points
uses: 3
```

You have inexplicable luck that seems to kick in at just the right moment.

**You have 3 luck points.** Whenever you make an attack roll, an ability check, or a saving throw, you can spend one luck point to roll an additional d20. You can choose to spend one of your luck points **after you roll the die, but before the outcome is determined**. You choose which of the d20s is used for the attack roll, ability check, or saving throw.

You can also spend one luck point when an **attack roll** is made against you. Roll a d20 and then choose whether the attack uses the attacker's roll or yours.

If more than one creature spends a luck point to influence the outcome of a roll, the points cancel each other out; no additional dice are rolled.

You regain your expended luck points when you finish a long rest.

### Arcane Recovery
```consumable
label: ""
state_key: din_arcane_recovery
uses: 1
```

You have learned to regain some of your magical energy by studying your spell book. Once per day when you finish a **short rest**, you can choose expended spell slots to recover. The spell slots can have a combined level that is equal to or **less than half your wizard level** (rounded up), and none of the slots can be 6th level or higher.

For example, if you're a 4th-level wizard, you can recover up to two levels worth of spell slots. You can recover either a 2nd-level spell slot or two 1st-level spell slots.

### Magic Items

#### Ring of Investigation
```consumable
label: ""
state_key: din_items__ring_of_investigation
uses: 3
```

_May the ability to see also provide you with a clear vision" Grants +1 to Investigation Roles_

### Researcher

When you attempt to learn or recall a piece of lore, **if you do not know that information, you often know where and from whom you can obtain it**.

Usually, this information comes from a library, scriptorium, university, or a sage or other learned person or creature.

Your DM might rule that the knowledge you seek is secreted away in an almost inaccessible place, or that it simply cannot be found. Unearthing the deepest secrets of the multiverse can require an adventure or even a whole campaign.