# Event Buttons

Tests the `event-btns` code block which creates buttons that dispatch file-scoped events. Other components with matching `reset_on` values respond to these events.

## Standard Rest Buttons

Common D&D rest events.

```event-btns
items:
  - name: Short Rest
    value: short-rest
  - name: Long Rest
    value: long-rest
```

## Extended Events

More event types to test multiple buttons.

```event-btns
items:
  - name: Short Rest
    value: short-rest
  - name: Long Rest
    value: long-rest
  - name: Level Up
    value: level-up
  - name: New Day
    value: new-day
```

## Consumables for Event Testing

Use these consumables to verify that button clicks trigger the correct resets.

```consumable
items:
  - label: "Short Rest Only"
    state_key: test_evt_short
    uses: 2
    reset_on: short-rest
  - label: "Long Rest Only"
    state_key: test_evt_long
    uses: 3
    reset_on: long-rest
  - label: "Both Rests"
    state_key: test_evt_both
    uses: 2
    reset_on: ["short-rest", "long-rest"]
  - label: "Level Up Only"
    state_key: test_evt_level
    uses: 1
    reset_on: level-up
```
