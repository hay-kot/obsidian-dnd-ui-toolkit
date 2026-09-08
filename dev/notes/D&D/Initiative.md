# Initiative Tracker

Tests the `initiative` code block which manages combat encounters with initiative order, AC, HP tracking, and round management.

## Basic Encounter

Simple encounter with single HP pools.

```initiative
state_key: test_init_basic
items:
  - name: Fighter
    ac: 18
    hp: 45
  - name: Wizard
    ac: 15
    hp: 28
  - name: Goblin Warband
    ac: 14
    hp: 21
```

## Monster Groups

Individual HP tracking for grouped enemies.

```initiative
state_key: test_init_groups
items:
  - name: Paladin
    ac: 20
    hp: 52
  - name: Goblin Squad
    ac: 14
    hp:
      Goblin 1: 12
      Goblin 2: 12
      Goblin 3: 12
  - name: Skeleton Archers
    ac: 13
    hp:
      Archer 1: 10
      Archer 2: 10
```

## With Links

Combatants with links to other notes.

```initiative
state_key: test_init_links
items:
  - name: Thordak
    ac: 18
    hp: 45
    link: "Din Thornewood"
  - name: Enemy Mage
    ac: 13
    hp: 22
    link: "Spell Book"
```

## Boss with Consumables

Encounter with legendary/lair actions that reset each round.

```initiative
state_key: test_init_boss
items:
  - name: Ancient Red Dragon
    ac: 22
    hp: 546
  - name: Fighter
    ac: 18
    hp: 45
  - name: Cleric
    ac: 16
    hp: 38
  - name: Rogue
    ac: 17
    hp: 32
consumables:
  - label: Legendary Actions
    state_key: legendary
    uses: 3
    reset_on_round: true
  - label: Lair Actions
    state_key: lair
    uses: 1
    reset_on_round: true
```

## Large Encounter

Many combatants to test scroll/layout behavior.

```initiative
state_key: test_init_large
items:
  - name: Barbarian
    ac: 16
    hp: 60
  - name: Bard
    ac: 14
    hp: 35
  - name: Druid
    ac: 15
    hp: 40
  - name: Wolves
    ac: 13
    hp:
      Wolf 1: 11
      Wolf 2: 11
      Wolf 3: 11
      Wolf 4: 11
  - name: Bandit Captain
    ac: 15
    hp: 30
  - name: Bandits
    ac: 12
    hp:
      Bandit 1: 8
      Bandit 2: 8
      Bandit 3: 8
      Bandit 4: 8
      Bandit 5: 8
```
