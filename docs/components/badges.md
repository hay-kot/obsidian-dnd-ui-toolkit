# Badges

The badges component can be used to display any generic Key/Value data in a more condensed view. Optionally, you can also omit they Key/Value and display only one.

![Rendered Example](../images/example-badges.webp)

## Dynamic Content

Badges support dynamic content using template variables with <span v-pre>`{{ }}`</span> style templates. This allows creating badges with data from the frontmatter or even calculations based off abilities or skills. This is great for things like

- Armor Class
- Attack Bonus
- Initiative

Using dynamic content helps keep your character sheet updated as you level up.

See the [Dynamic Content](../concepts/dynamic-content.md) page for more information on using templates.

## Static Example

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

| Property | Type    | Default      | Description                          |
| -------- | ------- | ------------ | ------------------------------------ |
| `items`  | Array   | **Required** | List of badge items to display       |
| `dense`  | Boolean | false        | Whether to use smaller badge styling |

### Item Object

| Property  | Type          | Description                              |
| --------- | ------------- | ---------------------------------------- |
| `label`   | String        | The label text (optional)                |
| `value`   | String/Number | The value to display (optional)          |
| `reverse` | Boolean       | Whether to reverse label and value order |
