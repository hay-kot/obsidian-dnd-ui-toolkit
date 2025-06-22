# Consumables

The `consumable` component allows you to create generic trackers for different states of your character. This can be for anything like Spell Slots, Luck Points, or Channel Divinity.

![Rendered Example](../images/example-consumable.webp)

## Resetting Uses

::: tip
Consumables can be automatically reset when specific events are triggered. Use the `reset_on` property to specify which events should reset the consumable:

See the [Event Systems](../concepts/event-systems.md) page for more information on utilizing events.
:::

## Basic Example

````yaml
```consumable
items:
  - label: "Level 1"
    state_key: din_luck_spell_1
    uses: 4
    reset_on: long-rest
  - label: "Action Surge"
    state_key: action_surge
    uses: 1
    reset_on: ["short-rest", "long-rest"]  # Reset on either rest type
```
````

## Configuration

| Property | Type  | Description                                      |
| -------- | ----- | ------------------------------------------------ |
| `items`  | Array | **Required** - List of consumable items to track |

### Item Object

| Property    | Type         | Description                                        |
| ----------- | ------------ | -------------------------------------------------- |
| `label`     | String       | Display name for the consumable (optional)         |
| `state_key` | String       | **Required** - Unique identifier for state storage |
| `uses`      | Number       | **Required** - Maximum number of uses              |
| `reset_on`  | String/Array | Events that reset this consumable                  |

## Common Use Cases

- **Spell Slots**: Track spell slots by level
- **Class Features**: Action Surge, Bardic Inspiration, etc.
- **Magic Items**: Limited use items
- **Custom Resources**: Any trackable resource your character has
