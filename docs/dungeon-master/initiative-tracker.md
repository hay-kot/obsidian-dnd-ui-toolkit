# Initiative Tracker

The `initiative` component allows you to track combat encounters by managing initiative order, AC, and optionally HP for each combatant. The tracker automatically sorts combatants by their initiative rolls, and provides controls to move through the combat order.

## Features

- **Automatic Sorting**: Combatants are sorted by initiative rolls
- **Turn Tracking**: Visual indicators for current turn
- **Round Tracking**: Round of combat counter
- **HP Management**: Track damage and healing for individuals or groups
- **AC Display**: Quick reference for armor class
- **Links**: Optional links to character sheets or stat blocks
- **Consumables**: Track limited-use abilities that reset between rounds

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

| Property      | Type   | Description                                        |
| ------------- | ------ | -------------------------------------------------- |
| `state_key`   | String | **Required** - Unique identifier for state storage |
| `items`       | Array  | **Required** - List of combatants                  |
| `consumables` | Array  | **Optional** - Tracked consumables                 |

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

### Consumables Object

The initiative tracker supports tracking consumable abilities that reset between rounds, such as legendary actions, lair actions, or other limited-use abilities.

#### Basic Consumables Example

````yaml
```initiative
state_key: dragon_encounter
items:
  - name: Ancient Red Dragon
    ac: 22
    hp: 546
  - name: Fighter
    ac: 18
    hp: 45
  - name: Wizard
    ac: 15
    hp: 28
consumables:
  - label: Legendary Actions
    state_key: dragon_legendary
    uses: 3
    reset_on_round: true
  - label: Lair Actions
    state_key: dragon_lair
    uses: 1
    reset_on_round: true
```
````

#### Consumable Options

| Property         | Type    | Description                                        |
| ---------------- | ------- | -------------------------------------------------- |
| `label`          | String  | **Required** - Display name for the consumable     |
| `state_key`      | String  | **Required** - Unique identifier for state storage |
| `uses`           | Number  | **Required** - Maximum number of uses              |
| `reset_on_round` | Boolean | Optional - Whether to reset when round advances    |

#### How Consumables Work

- **Checkboxes**: Each consumable displays as a series of checkboxes representing available uses
- **Usage Tracking**: Check boxes to mark uses; the tracker maintains state between sessions
- **Round Reset**: If `reset_on_round: true`, all uses reset when advancing to the next round

::: info State Key Requirement
Each `state_key` defined in each consumable only needs to be unique within the component itself. This is because it's stored as apart of the components state and not in the top level state file.
:::
