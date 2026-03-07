# Consumables

The `consumable` component creates generic trackers for character resources like Spell Slots, Luck Points, or Channel Divinity.

<ConsumablesDemo />

## Example

````yaml
```consumable
items:
  - label: "Level 1"
    state_key: din_luck_spell_1
    uses: 4
    reset_on: long-rest  # Full reset on long rest
  - label: "Action Surge"
    state_key: action_surge
    uses: 1
    reset_on: ["short-rest", "long-rest"]  # Reset on either rest type
  - label: "Bardic Inspiration"
    state_key: bardic_inspiration
    uses: 3
    reset_on:
      - event: short-rest
        amount: 1  # Restore 1 use on short rest
      - event: long-rest  # Full reset on long rest (no amount = complete reset)
```
````

## Configuration

| Property | Type  | Default  | Description                              |
| -------- | ----- | -------- | ---------------------------------------- |
| `items`  | Array | Required | List of consumable items to track        |

### Item Object

| Property    | Type                | Default  | Description                            |
| ----------- | ------------------- | -------- | -------------------------------------- |
| `label`     | String              | —        | Display name for the consumable        |
| `state_key` | String              | Required | Unique identifier for state storage    |
| `uses` †    | Number              | Required | Maximum number of uses                 |
| `reset_on`  | String/Array/Object | —        | Events that reset this consumable      |

† Supports [dynamic content](/concepts/dynamic-content) templates

### Reset Configuration

The `reset_on` property supports multiple formats:

**Simple String**: Resets completely on the specified event
```yaml
reset_on: long-rest
```

**Array of Strings**: Resets completely on any of the specified events
```yaml
reset_on: ["short-rest", "long-rest"]
```

**Array of Objects**: Allows fine-grained control over reset amounts
```yaml
reset_on:
  - event: short-rest
    amount: 1  # Restore 1 use
  - event: long-rest  # Complete reset (no amount specified)
```

When `amount` is specified, that many uses are restored (subtracted from current usage). When `amount` is omitted, the consumable resets completely to 0 used.
