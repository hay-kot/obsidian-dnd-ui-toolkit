# Obsidian DnD UI Toolkit

This plugin provides modern UI elements for playing Dungeons and Dragons that provide building blocks for you to build
a beautiful markdown driven character sheet.

I built this plugin because I was tired of working with PDFs and online tools to manage my characters. I wanted to keep my notes, spells, and character state (Spell Slots, HP, etc..) all in my notebook. I'm building this plugin to make that process easier.

> [!WARNING]
> This plugin is in early development, things may be broken or change.

## Features

- Display character information with grid of cards
- Display Ability Scores and saving throws
- Display Skills calculated off ability scores

## Road Map

- [ ] Static Widgets
- [ ] Interactive Widgets
  - [ ] HP Widget: Track your characters HP and hit dice (also support for monsters)
  - [ ] Spell Slot Widget: Track your spell slot usage
  - [ ] Generic Consumables Widget: Track anything like Luck Points, Arcane Recovery, Magic Item Charges, or whatever!
  - [ ] Buttons for Short Rest and Long Rest: Connects with HP Widget, Spell Slots, and Consumables (as configured) so that when you press Short or Long Rest your consumables automatically get restored to their default states.
- [ ] Themeable and/or read from Obsidian styles

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

### Example

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
