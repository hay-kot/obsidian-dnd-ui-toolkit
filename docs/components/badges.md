# Badges

The badges component can be used to display any generic Key/Value data in a more condensed view.

Badges support a `reverse` property, when true it reverses the order of the label and value. You can also omit the value or label property and it will only render what is provided. This gives you a lot of flexibility in how they are rendered.

![Rendered Example](../images/example-badges.webp)

## Dynamic Content

Badges support dynamic content using template variables with `{{ }}` style templates. This allows creating badges with data from the frontmatter or even calculations based off abilities or skills. This is great for things like

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
