---
level: 5
spellcasting_ability: intelligence
---
# Spell Components

Tests the `spell-components` code block which displays spell casting details in a clean format. All fields are optional.

```ability
abilities:
  strength: 10
  dexterity: 14
  constitution: 12
  intelligence: 18
  wisdom: 13
  charisma: 8
proficiencies:
  - intelligence
  - wisdom
```

## Full Spell (with Save)

Spell with a save DC — accent panel shows DC.

```spell-components
casting_time: 1 action
range: 150 feet
components: V, S, M (a tiny ball of bat guano and sulfur)
duration: Instantaneous
save: dexterity
```

## Attack Spell

Spell with an attack roll — accent panel shows attack bonus.

```spell-components
casting_time: 1 action
range: 120 feet
components: V, S
duration: Instantaneous
attack: true
```

## Save + Attack

Both save and attack shown.

```spell-components
casting_time: 1 action
range: 60 feet
components: V, S, M (a pinch of sulfur)
duration: Concentration, up to 1 minute
save: wisdom
attack: true
```

## No Save/Attack

No accent panel — just the grid.

```spell-components
casting_time: 1 action
range: Self (10-foot radius)
components: V, S
duration: Concentration, up to 1 minute
```

## Bonus Action

Bonus action spell with minimal components.

```spell-components
casting_time: 1 bonus action
range: Self
components: V
duration: 1 round
```

## Partial Fields

Only some fields present.

```spell-components
casting_time: 1 reaction
range: 60 feet
```

## Duration Only

Single field to verify minimal rendering.

```spell-components
duration: Until dispelled
```
