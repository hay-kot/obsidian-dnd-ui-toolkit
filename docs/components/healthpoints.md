# Health Points

Your Players HP can be tracked using the `healthpoints` widget. This widget requires a `state_key` be provided so that the plugin can save the character's state within the plugins state file.

::: warning State Key Requirement
Each `state_key` defined in **any** component needs to be unique as they are all stored within the same key value store internally.
:::

## Features

- Customize 'Hit Points' label
- Death save yracking
- Supports temporary HP
- Supports **Reset Events** - See [Event System](../concepts/event-systems.md) for more details. By default it is configured for `long-rest`.

## Image

![Rendered Example](../images/example-hp-widget.webp)

## Example

````yaml
```healthpoints
state_key: din_health
health: 24
hitdice:
  dice: d6
  value: 4
```
````

::: tip
This `health` key supports dynamic content. This allows you to read your HP from frontmatter.

````yaml
```healthpoints
state_key: din_health
health: '{{ frontmatter.hp }}
hitdice:
  dice: d6
  value: 4
```
````

:::

## Configuration

| Property      | Type         | Default      | Description                         |
| ------------- | ------------ | ------------ | ----------------------------------- |
| `state_key`   | String       | **Required** | Unique identifier for state storage |
| `health`      | Number       | **Required** | Maximum health points               |
| `label`       | String       | "Hit Points" | Custom label for the component      |
| `hitdice`     | Object       | null         | Hit dice configuration              |
| `death_saves` | Boolean      | true         | Whether to show death saves         |
| `reset_on`    | String/Array | "long-rest"  | Events that reset health            |

### Hit Dice Object

| Property | Type   | Description                         |
| -------- | ------ | ----------------------------------- |
| `dice`   | String | Dice type (e.g., "d6", "d8", "d10") |
| `value`  | Number | Number of hit dice available        |
