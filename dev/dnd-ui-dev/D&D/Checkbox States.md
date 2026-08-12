# Checkbox States

Gathers every checkbox variant on one page so the checked fill can be verified at
a glance. The fill is painted on an `::after` pseudo-element rather than the
button background, because community themes override workspace button
backgrounds with high-specificity rules.

## How to Test

1. Check a box in each section below and confirm it visibly fills.
2. Switch to a theme that restyles buttons — LYT Mode is the one that surfaced
   this (Settings → Appearance → Themes → Manage → browse for "LYT Mode") — and
   confirm the fills still render. This is the case that regressed.
3. Reload the vault and confirm the checked boxes come back checked. State
   persistence and the fill are separate concerns; a box can be checked in state
   but render blank, which is the bug this page guards.
4. Repeat in both light and dark mode.

## Consumable Checkboxes

Standard accent fill.

```consumable
items:
  - label: "Spell Slots"
    state_key: test_cb_slots
    uses: 4
    reset_on: long-rest
  - label: "Single Use"
    state_key: test_cb_single
    uses: 1
    reset_on: long-rest
```

## Hit Dice and Death Saves

Hit dice use the standard fill. Death saves recolor the fill through
`--dnd-ui-checkbox-fill` — failures red, successes teal — so this section also
verifies the variant colors survive the pseudo-element change.

Death saves are set to always show so they can be checked without dropping to 0 HP.

```healthpoints
state_key: test_cb_health
health: 42
death_saves: "always"
hitdice:
  dice: d10
  value: 6
```

## Multiclass Hit Dice

Two hit dice rows to confirm the fill renders on every row.

```healthpoints
state_key: test_cb_health_multi
health: 58
death_saves: "always"
hitdice:
  - dice: d10
    value: 5
  - dice: d8
    value: 3
```

## Initiative Round Consumables

Checkboxes rendered inside the initiative tracker.

```initiative
state_key: test_cb_init
items:
  - name: Ancient Red Dragon
    ac: 22
    hp: 546
  - name: Fighter
    ac: 18
    hp: 45
consumables:
  - label: Legendary Actions
    state_key: cb_legendary
    uses: 3
    reset_on_round: true
```

## Reset Behavior

Resets clear the fill as well as the state.

```event-btns
items:
  - name: Short Rest
    value: short-rest
  - name: Long Rest
    value: long-rest
```
