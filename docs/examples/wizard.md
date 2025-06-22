This examples is for a divination wizard build.

This example doens't take advantage of many of the new features of the plugin. We're hoping to update and provide better examples in the future.

## Example

````
---
Proficiency Bonus: 2
---
```badges
items:
  - label: Level
    value: '3'
  - label: Initiative
    value: '+2'
  - label: Spell Save
    value: 14
  - label: AC
    value: 13
  - label: AC (Mage Armor)
    value: 15
```

```healthpoints
state_key: din_health
health: 24
hitdice:
  dice: d6
  value: 3
```

## Abilities

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
```

## Skills

```skills
proficiencies:
  - arcana
  - deception
  - history
  - insight
  - investigation
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

````
