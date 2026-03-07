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

## Configuration

| Property      | Type             | Default      | Description                                                                        |
| ------------- | ---------------- | ------------ | ---------------------------------------------------------------------------------- |
| `state_key`   | String           | Required     | Unique identifier for state storage                                                |
| `health` †    | Number           | Required     | Maximum health points                                                              |
| `label`       | String           | "Hit Points" | Custom label for the component                                                     |
| `hitdice`     | Object/Array     | —            | Hit dice configuration (single object or array for multiclass)                     |
| `death_saves` | Boolean/"always" | true         | Show death saves (`true` = at 0 HP only, `"always"` = at any HP, `false` = never) |
| `reset_on`    | String/Array/Object | "long-rest" | Events that reset health                                                          |

† Supports [dynamic content](/concepts/dynamic-content) templates

### Hit Dice Object

| Property   | Type   | Default  | Description                          |
| ---------- | ------ | -------- | ------------------------------------ |
| `dice`     | String | Required | Dice type (e.g., "d6", "d8", "d10") |
| `value` †  | Number | Required | Number of hit dice available         |

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

**Array of Objects**: Fine-grained control (currently health always resets completely)
```yaml
reset_on:
  - event: long-rest  # Complete reset
```
