# Badges

The badges component displays Key/Value data in a condensed inline format. You can optionally omit the key or value to display only one.

<BadgesDemo />

## Example

````yaml
```badges
items:
  - label: Race
    value: 'Half-Orc'
  - label: Level
    value: '{{ frontmatter.level }}'
  - label: Initiative
    value: '+{{ modifier abilities.dexterity }}'
  - label: AC
    value: '{{ add 10 (modifier abilities.dexterity) }}'
  - label: Spell Attack
    value: '{{ add 10 frontmatter.proficiency_bonus (modifier abilities.intelligence) }}'
```
````

## Configuration

| Property | Type    | Default  | Description                          |
| -------- | ------- | -------- | ------------------------------------ |
| `items`  | Array   | Required | List of badge items to display       |
| `dense`  | Boolean | false    | Whether to use smaller badge styling |

### Item Object

| Property  | Type          | Default | Description                              |
| --------- | ------------- | ------- | ---------------------------------------- |
| `label` †   | String        | —       | The label text                           |
| `value` †   | String/Number | —       | The value to display                     |
| `sublabel` † | String      | —       | Additional text below the value          |
| `reverse` | Boolean       | false   | Whether to reverse label and value order |

† Supports [dynamic content](/concepts/dynamic-content) templates
