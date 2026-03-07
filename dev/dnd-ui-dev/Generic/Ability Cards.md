# Ability Cards (Raw)

Tests the `ability-cards` code block which renders raw card data without automatic modifier calculation. Unlike the `ability` block, this takes pre-computed values directly — useful for non-5e systems or custom stats.

## Pathfinder 2e Attributes

Six core attributes with modifiers and saving throw proficiency.

```ability-cards
items:
  - label: Strength
    value: '+4'
    sublabel: Trained
  - label: Dexterity
    value: '+1'
    sublabel: Expert
  - label: Constitution
    value: '+3'
    sublabel: Trained
  - label: Intelligence
    value: '+0'
    sublabel: Untrained
  - label: Wisdom
    value: '+2'
    sublabel: Master
  - label: Charisma
    value: '-1'
    sublabel: Trained
```

## Call of Cthulhu Characteristics

Percentile-based stats from a d100 system.

```ability-cards
items:
  - label: STR
    value: '55'
    sublabel: '27'
  - label: CON
    value: '60'
    sublabel: '30'
  - label: SIZ
    value: '65'
    sublabel: '32'
  - label: DEX
    value: '50'
    sublabel: '25'
  - label: APP
    value: '45'
    sublabel: '22'
  - label: EDU
    value: '75'
    sublabel: '37'
  - label: INT
    value: '70'
    sublabel: '35'
  - label: POW
    value: '40'
    sublabel: '20'
```

## Fate Core Approaches

Fudge/Fate-style descriptive ratings.

```ability-cards
items:
  - label: Careful
    value: '+2'
  - label: Clever
    value: '+3'
  - label: Flashy
    value: '+1'
  - label: Forceful
    value: '+0'
  - label: Quick
    value: '+2'
  - label: Sneaky
    value: '+1'
```

## Custom Stats

Arbitrary game-specific values showing the block works with any data.

```ability-cards
items:
  - label: Vigor
    value: '8'
    sublabel: 'Pool: 24'
  - label: Finesse
    value: '6'
    sublabel: 'Pool: 18'
  - label: Resolve
    value: '10'
    sublabel: 'Pool: 30'
```
