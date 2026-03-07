# Stat Cards

Stat Cards are generic card components that can be used to display any data, such as Armor Class, Initiative, Spell Save DC, or custom values.

<StatCardsDemo />

## Example

````yaml
```stats
items:
  - label: Armor Class
    sublabel: Mage Armor (16)
    value: 13
  - label: Initiative
    value: '+{{ modifier abilities.dexterity }}'
  - label: Spell DC
    value: 14

grid:
  columns: 3
```
````

## Configuration

| Property | Type    | Default | Description                   |
| -------- | ------- | ------- | ----------------------------- |
| `items`  | Array   | Required | List of stat items to display |
| `grid`   | Object  | —       | Grid configuration options    |
| `dense`  | Boolean | false   | Renders a denser card         |

### Item Object

| Property     | Type          | Default | Description                              |
| ------------ | ------------- | ------- | ---------------------------------------- |
| `label` †    | String        | —       | The main label for the stat              |
| `value` †    | String/Number | —       | The value to display                     |
| `sublabel` † | String        | —       | Optional additional text below the value |

† Supports [dynamic content](/concepts/dynamic-content) templates

### Grid Object

| Property  | Type   | Default | Description                          |
| --------- | ------ | ------- | ------------------------------------ |
| `columns` | Number | 2       | Number of columns in the grid layout |
