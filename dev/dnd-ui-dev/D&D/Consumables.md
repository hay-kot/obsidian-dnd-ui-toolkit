# Consumables

Tests the `consumable` code block which tracks limited-use resources like spell slots and class features. Verifies reset behavior with event buttons.

## Event Buttons

Trigger resets for the consumables below.

```event-btns
items:
  - name: Short Rest
    value: short-rest
  - name: Long Rest
    value: long-rest
```

## Spell Slots

Multiple consumable rows with different reset triggers.

```consumable
items:
  - label: "Level 1 Slots"
    state_key: test_spell_1
    uses: 4
    reset_on: long-rest
  - label: "Level 2 Slots"
    state_key: test_spell_2
    uses: 3
    reset_on: long-rest
  - label: "Level 3 Slots"
    state_key: test_spell_3
    uses: 2
    reset_on: long-rest
```

## Mixed Reset Types

Tests the three reset_on formats: simple string, array of strings, and array of objects with partial restore.

```consumable
items:
  - label: "Channel Divinity"
    state_key: test_channel
    uses: 2
    reset_on: long-rest
  - label: "Action Surge"
    state_key: test_action_surge
    uses: 1
    reset_on: ["short-rest", "long-rest"]
  - label: "Bardic Inspiration"
    state_key: test_bardic
    uses: 4
    reset_on:
      - event: short-rest
        amount: 1
      - event: long-rest
```

## Single Use

Single-use resource to verify checkbox behavior at minimum count.

```consumable
items:
  - label: "Lucky"
    state_key: test_lucky
    uses: 1
    reset_on: long-rest
```

## Template Uses

Uses count derived from ability scores via template expressions. Requires an ability block on the page.

```ability
abilities:
  strength: 10
  dexterity: 14
  constitution: 12
  intelligence: 10
  wisdom: 16
  charisma: 18
```

```consumable
items:
  - label: "Bardic Inspiration"
    state_key: test_bardic_template
    uses: "{{ modifier abilities.charisma }}"
    reset_on: long-rest
  - label: "Wild Shape"
    state_key: test_wild_shape_template
    uses: "{{ modifier abilities.wisdom }}"
    reset_on: short-rest
  - label: "Computed"
    state_key: test_computed_uses
    uses: "{{add 2 (modifier abilities.charisma)}}"
    reset_on: long-rest
```

## High Count

Many uses to test rendering with a large number of checkboxes.

```consumable
items:
  - label: "Ki Points"
    state_key: test_ki
    uses: 12
    reset_on: long-rest
```
