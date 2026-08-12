# Health Points

The `healthpoints` widget tracks your character's HP, temporary HP, hit dice, and death saving throws.

::: warning State Key Requirement
Each `state_key` defined in **any** component needs to be unique as they are all stored within the same key value store internally.
:::

<HealthCardDemo />

## Example

### Basic

````yaml
```healthpoints
state_key: din_health
health: 24
hitdice:
  dice: d6
  value: 4
```
````

### Multiclass

````yaml
```healthpoints
state_key: multiclass_health
health: 58
hitdice:
  - dice: d10  # Fighter levels
    value: 5
  - dice: d8   # Cleric levels
    value: 3
```
````

### Always Show Death Saves

By default, death saves only appear when HP reaches 0. Set `death_saves: always` to display them at any HP level.

````yaml
```healthpoints
state_key: din_health
health: 24
death_saves: always
```
````

### Dynamic Health

````yaml
```healthpoints
state_key: din_health
health: '{{ frontmatter.hp }}'
hitdice:
  dice: d6
  value: '{{ frontmatter.level }}'
```
````

### Temporary Max Health

`temp_max_health` raises the maximum for effects that grant bonus max HP, such as _Aid_. It heals and takes
damage like normal health, but the bar and the header show it separately so it's obvious how much of your
maximum will disappear when the effect ends.

<HealthCardTempMaxDemo />

````yaml
```healthpoints
state_key: din_health
health: 24
temp_max_health: '{{ frontmatter.aid }}'
```
````

::: tip
The bonus only raises the maximum — it does not fill itself in. Heal to claim it, the way _Aid_ grants both
current and maximum HP. When the effect ends and the property goes back to `0`, current health is capped at
the base maximum.
:::

### Partial Hit Dice Recovery

By default a long rest restores every hit die. Give a dice entry its own `reset_on` to recover a set number
instead. The amount takes templates too, so the 5e rule of half your total rounded down comes straight from
the character's level.

````yaml
```healthpoints
state_key: din_health
health: '{{ frontmatter.hp }}'
hitdice:
  dice: d6
  value: '{{ frontmatter.level }}'
  reset_on:
    - event: long-rest
      amount: '{{ floor (divide frontmatter.level 2) }}'
```
````

## Configuration

| Property      | Type             | Default      | Description                                                                        |
| ------------- | ---------------- | ------------ | ---------------------------------------------------------------------------------- |
| `state_key`   | String           | Required     | Unique identifier for state storage                                                |
| `health` †    | Number           | Required     | Maximum health points                                                              |
| `temp_max_health` † | Number     | 0            | Bonus maximum health from a temporary effect, shown separately in the health bar   |
| `label`       | String           | "Hit Points" | Custom label for the component                                                     |
| `hitdice`     | Object/Array     | —            | Hit dice configuration (single object or array for multiclass)                     |
| `death_saves` | Boolean/"always" | true         | Show death saves (`true` = at 0 HP only, `"always"` = at any HP, `false` = never) |
| `reset_on`    | String/Array/Object | "long-rest" | Events that restore health, temp HP, death saves and hit dice                     |

† Supports [dynamic content](/concepts/dynamic-content) templates

### Hit Dice Object

| Property   | Type   | Default  | Description                          |
| ---------- | ------ | -------- | ------------------------------------ |
| `dice`     | String | Required | Dice type (e.g., "d6", "d8", "d10") |
| `value` †  | Number | Required | Number of hit dice available         |
| `reset_on` | String/Array/Object | — | Recovery rules for this dice type, replacing the block-level reset |

† Supports [dynamic content](/concepts/dynamic-content) templates

### Reset Configuration

The `reset_on` property supports the same formats as [consumables](/components/consumables#reset-configuration):

**Simple String**: Complete reset on the specified event
```yaml
reset_on: long-rest
```

**Array of Strings**: Complete reset on any of the specified events
```yaml
reset_on: ["short-rest", "long-rest"]
```

**Array of Objects**: Fine-grained control, with `amount` limiting how many hit dice come back
```yaml
reset_on:
  - event: long-rest
    amount: 2  # Supports templates, e.g. '{{ floor (divide frontmatter.level 2) }}'
```

Health, temporary HP and death saves always reset completely, so `amount` only means something on a hit dice
entry. A dice entry with its own `reset_on` stops following the block-level events entirely — it recovers only
on the events it lists.

````yaml
```healthpoints
state_key: multiclass_health
health: 58
reset_on: long-rest       # Health back to full on a long rest
hitdice:
  - dice: d10
    value: 5
    reset_on:
      - event: long-rest  # Two d10 back per long rest
        amount: 2
  - dice: d8              # No reset_on, so all d8 come back on a long rest
    value: 3
```
````
