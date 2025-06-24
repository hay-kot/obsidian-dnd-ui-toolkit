# Initiative Tracker

The `initiative` component allows you to track combat encounters by managing initiative order, AC, and optionally HP for each combatant. The tracker automatically sorts combatants by their initiative rolls, and provides controls to move through the combat order.

## Features

- **Automatic Sorting**: Combatants are sorted by initiative rolls
- **Turn Tracking**: Visual indicators for current turn
- **Round Tracking**: Round of combat counter
- **HP Management**: Track damage and healing for individuals or groups
- **AC Display**: Quick reference for armor class
- **Links**: Optional links to character sheets or stat blocks

## Basic Example

For single creatures or grouped creatures that share a single HP pool:

````yaml
```initiative
state_key: forest_encounter
items:
  - name: Thordak (Fighter)
    ac: 18
    hp: 45
    link: thordak-character-sheet
  - name: Elf Wizard
    ac: 15
    hp: 28
    link: wizard-npc
  - name: Goblin Warriors (x3)
    ac: 14
    hp: 21
```
````

## Monster Groups Example

For groups of monsters with individual HP tracking:

````yaml
```initiative
state_key: dungeon_encounter
items:
  - name: Party Fighter
    ac: 18
    hp: 45
  - name: Goblin Squad
    ac: 14
    hp:
      Goblin 1: 12
      Goblin 2: 12
      Goblin 3: 12
  - name: Skeleton Archers
    ac: 13
    hp:
      Archer 1: 10
      Archer 2: 10
```
````

## Configuration

| Property    | Type   | Description                                        |
| ----------- | ------ | -------------------------------------------------- |
| `state_key` | String | **Required** - Unique identifier for state storage |
| `items`     | Array  | **Required** - List of combatants                  |

### Item Object

| Property | Type          | Description                                    |
| -------- | ------------- | ---------------------------------------------- |
| `name`   | String        | **Required** - Name of the combatant           |
| `ac`     | Number        | **Required** - Armor Class                     |
| `hp`     | Number/Object | Hit points (single value or object for groups) |
| `link`   | String        | Optional link to character sheet or notes      |

### HP Options

**Single HP Pool:**

```yaml
hp: 25
```

**Individual HP Tracking:**

```yaml
hp:
  Creature 1: 12
  Creature 2: 12
  Creature 3: 8
```
