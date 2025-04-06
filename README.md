# Obsidian DnD UI Toolkit

This plugin provides modern UI elements for playing Dungeons and Dragons that provide building blocks for you to build
a beautiful markdown driven character sheet.

I built this plugin because I was tired of working with PDFs and online tools to manage my characters. I wanted to keep my notes, spells, and character state (Spell Slots, HP, etc..) all in my notebook. I'm building this plugin to make that process easier.

> [!WARNING]
> This plugin is in early development, things may be broken or change.

## Quick Start

An easy way to get started is to look at an example in the [examples](./docs/examples/) folder and see how those are laid out.

> [!TIP]
> Want to add a new example for your class? Submit a PR with a template!

> [!WARNING]
> We haven't published to the obsidian store yet, if you want to use this plugin you must install it using the [BRAT](https://github.com/TfTHacker/obsidian42-brat) plugin to load the plugin from a git repository.
>
> If you have issues installing with BRAT, try pinning the version to the latest release.

## Features

- Display character information with grid of cards
- Display Ability Scores and saving throws
- Display Skills calculated off ability scores
- HP Widget: Track your characters HP and hit dice (also support for monsters)
- Spell Slot Tracking
- General Consumables Tracking

## Road Map

- [x] Static Widgets
  - [x] Generic 'Badge' for smaller display of Key Value dat
- [ ] Interactive Widgets
  - [x] HP Widget: Track your characters HP and hit dice (also support for monsters)
  - [x] Spell Slot Widget: Track your spell slot usage
  - [x] Generic Consumables Widget: Track anything like Luck Points, Arcane Recovery, Magic Item Charges, or whatever!
  - [ ] Buttons for Short Rest and Long Rest: Connects with HP Widget, Spell Slots, and Consumables (as configured) so that when you press Short or Long Rest your consumables automatically get restored to their default states.
- [ ] Themeable and/or read from Obsidian styles

### Dev

- [ ] Prefix all styles
- [ ] Determine if i should prefix code blocks
- [ ] Breakup CSS file
- [ ] Submit for approval to obsidian store

## Components

### Ability Scores

The `ability` block is used to generate a 6 column grid of your ability scores and their savings throws. Fill in the code block with your abilities, proficiencies, and any bonuses that are applied to saving throws.

> [!NOTE]
> Bonuses apply to the saving throws modifier so if the value of the bonus is +2 strength it would add +2 to your saving throw value. If you just want to add a bonus to your strength score, you can increment the number and leave yourself a comment in the code block.

![Rendered Example](./docs/images/example-ability-scores.webp)

#### Example

````yaml
```ability
abilities:
  strength: 9
  dexterity: 14
  constitution: 14
  intelligence: 19
  wisdom: 12
  charisma: 10

bonuses:
  - name: Right of Power
    target: strength
	value: 2

proficiencies:
  - intelligence
  - wisdom
```
````

### Skills

the `skills` block is used for automatically calculating your skills modifier. It pulls from the first `abilities` block it can find in your file and calculates your scores based on those values.

You can set your proficiencies using the `proficiencies` key and the skills name. Comparisons are case-insensitive.

Additional bonuses can be added to checks for magic items or similar.

![Rendered Example](./docs/images/examples-skills.webp)

#### Example

````yaml
```skills
proficiencies:
  - arcana
  - deception
  - history
  - insight
  - investigation

bonuses:
  - name: Right of Arcana
    target: arcana
	value: 2
```
````

### Stats

Stats are a generic card components that can be used to display all kinds of data like

- Armor Class
- Initiative
- Spell Save DC

Or really anything you'd like. The `sublabel` property is also supported for displaying additional information below the value.

![Rendered Example](./docs/images/example-stat-cards.webp)

_Note that the example is two stat grids stacked on top of each other_

#### Example

````yaml
```stats
items:
  - label: Armor Class
    sublabel: Mage Armor (16)
    value: 13
  - label: Initiative
    value: '+2'
  - label: Spell DC
    value: 14

grid:
  columns: 3
```
````

## Healthpoints

Healthpoints can be tracked using the `healthpoints` widget. This widget requires a `state_key` be
provided so that the plugin and save the characters state within the Obsidian plugin data. Note
that each `state_key` defined in **any** component needs to be unique as they are all stored within
the same key value store internally.

You can also provide a custom `label` key to override the default `Hit Points`, this is useful if you're
creating an encounter want to track HP of several monsters on a single notebook.

You can also omit the `hitdice` and that part of the component will be omitted from view.

![Rendered Example](./docs/images/example-hp-widget.webp)

#### Example

````yaml
```healthpoints
state_key: din_health
health: 24
hitdice:
  dice: d6
  value: 4
```
````

## Badges

The badges component can be used to display any generic Key/Value data in a more condensed view.

![Rendered Example](./docs/images/example-badges.webp)

````yaml
```badges
items:
  - label: Level
    value: '3'
  - label: Initiative
    value: '+2'
  - label: Spell Save
    value: 14
  - label: AC
    value: 13
  - label: AC (Mage Armor)
    value: 15
```
````

## Consumables

The `consumable` component allows you to create generic trackers for different states of your character. This can be
for anything like Spell Slots, Luck Points, or Channel Divinity.

Note that the labels field is optional.

![Rendered Example](./docs/images/example-consumable.webp)

````yaml
```consumable
items:
  - label: "Level 1"
    state_key: din_luck_spell_1
    uses: 4
  - label: "Level 2"
    state_key: din_luck_spell_2
    uses: 2
```
````
