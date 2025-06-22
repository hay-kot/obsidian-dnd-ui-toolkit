# Spell Components

The `spell-components` block allows you to display spell information in a clean, organized format. This is perfect for displaying the key details of spells in your character sheet or spellbook.

![Rendered Example](../images/example-spell-components.webp)

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

## Configuration

All properties are optional - include only what you need for each spell.

| Property       | Type   | Description                              |
| -------------- | ------ | ---------------------------------------- |
| `casting_time` | String | How long it takes to cast the spell      |
| `range`        | String | The range or area of effect              |
| `components`   | String | Verbal, Somatic, and Material components |
| `duration`     | String | How long the spell lasts                 |
