# Spell Components

The `spell-components` block displays spell information in a clean, organized format. This is perfect for displaying the key details of spells in your character sheet or spellbook.

<SpellComponentsDemo />

## Example

````yaml
```spell-components
casting_time: 1 action
range: 60 feet
components: V, S, M (a pinch of sulfur)
duration: Instantaneous
```
````

All fields are optional, so you can include only the information you need:

````yaml
```spell-components
casting_time: 1 bonus action
range: Self
duration: Concentration, up to 1 minute
```
````

### Spell Save DC & Attack Bonus

Spells that require a saving throw or attack roll can automatically calculate the DC and attack bonus using your character's frontmatter.

````yaml
```spell-components
casting_time: 1 action
range: 60 feet
components: V, S, M (a pinch of sulfur)
duration: Instantaneous
save: dexterity
attack: true
```
````

This requires the following frontmatter in your note (or a linked character file):

```yaml
---
proficiency_bonus: 3
spellcasting_ability: intelligence
---
```

The plugin calculates:
- **Spell Save DC** = 8 + proficiency bonus + spellcasting ability modifier
- **Spell Attack Bonus** = proficiency bonus + spellcasting ability modifier

If your character's ability scores are in a separate file, use `character_file` in your frontmatter to link to it:

```yaml
---
character_file: "[[My Character]]"
spellcasting_ability: intelligence
---
```

## Configuration

| Property       | Type    | Default | Description                                                              |
| -------------- | ------- | ------- | ------------------------------------------------------------------------ |
| `casting_time` | String  | —       | How long it takes to cast the spell                                      |
| `range`        | String  | —       | The range or area of effect                                              |
| `components`   | String  | —       | Verbal, Somatic, and Material components                                 |
| `duration`     | String  | —       | How long the spell lasts                                                 |
| `save`         | String  | —       | Ability save required (e.g., "dexterity", "wisdom"). Triggers DC display |
| `attack`       | Boolean | false   | Set to `true` to display the spell attack bonus                          |

### Frontmatter Properties

These frontmatter properties are used for auto-calculating save DC and attack bonus.

| Property               | Type   | Default | Description                                                                          |
| ---------------------- | ------ | ------- | ------------------------------------------------------------------------------------ |
| `spellcasting_ability` | String | —       | Ability used for spell calculations (e.g., "intelligence", "wisdom", "charisma")     |
| `character_file`       | String | —       | Link to another note containing ability scores and proficiency (e.g., `"[[My Character]]"`) |
