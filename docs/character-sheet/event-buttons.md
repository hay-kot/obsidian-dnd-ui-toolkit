# Event Buttons

The `event-btns` component creates clickable buttons that trigger reset events for other components within the same file. This is perfect for managing rest mechanics in D&D, allowing you to reset spell slots, health, and other resources with a single click.

## How It Works

Event buttons dispatch file-scoped events that other components (like `consumable` and `healthpoints`) can listen to. Components with matching `reset_on` values will automatically reset their state when the corresponding button is clicked.

See the [Event Systems](../concepts/event-systems.md) page for a deeper dive into events.

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

## Event Types

You can use any event type name that makes sense for your game:

- `short-rest` - For abilities that recharge on short rests
- `long-rest` - For abilities that recharge on long rests
- `level-up` - For resetting everything when leveling up
- `new-day` - For daily abilities
- `custom` - For any custom event you define

::: tip File Scope
Event buttons only affect components within the same markdown file, so you can have different rest states for different characters or encounters.
:::

## Configuration

| Property | Type  | Description                                    |
| -------- | ----- | ---------------------------------------------- |
| `items`  | Array | **Required** - List of event buttons to create |

### Item Object

| Property | Type   | Description                                |
| -------- | ------ | ------------------------------------------ |
| `name`   | String | **Required** - Display text for the button |
| `value`  | String | **Required** - Event name to trigger       |
