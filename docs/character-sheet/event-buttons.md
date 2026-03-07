# Event Buttons

The `event-btns` component creates clickable buttons that trigger reset events for other components within the same file. This is useful for managing rest mechanics, allowing you to reset spell slots, health, and other resources with a single click.

## Example

````yaml
```event-btns
items:
  - name: Short Rest
    value: short-rest
  - name: Long Rest
    value: long-rest
  - name: Level Up
    value: level-up
```
````

## Configuration

| Property | Type  | Default  | Description                            |
| -------- | ----- | -------- | -------------------------------------- |
| `items`  | Array | Required | List of event buttons to create        |

### Item Object

| Property | Type   | Default  | Description                        |
| -------- | ------ | -------- | ---------------------------------- |
| `name`   | String | Required | Display text for the button        |
| `value`  | String | Required | Event name to trigger              |

::: tip File Scope
Event buttons only affect components within the same markdown file, so you can have different rest states for different characters or encounters.
:::

::: tip Reset Amounts
Event buttons dispatch the event name, and individual components determine how much to reset based on their own `reset_on` configuration. See [Consumables](/components/consumables#reset-configuration) for details on configuring partial resets.
:::
