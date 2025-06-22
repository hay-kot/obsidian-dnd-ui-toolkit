# Skills

The `skills` block is used for automatically calculating your skills modifier. It pulls from the first `abilities` block it can find in your file and calculates your scores based on those values.

## Features

- Supports **proficiency**, **expertise**, and **half Proficiency**
- Supports arbitrary bonuses, like for magic items

## Example

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

proficiencies:
  - deception

expertise:
  - investigation

half_proficiencies:
  - history
```
````

## Image

![Rendered Example](../images/examples-skills.webp)

## Configuration

| Property             | Type  | Description                                               |
| -------------------- | ----- | --------------------------------------------------------- |
| `proficiencies`      | Array | List of skills you are proficient in                      |
| `expertise`          | Array | List of skills you have expertise in (double proficiency) |
| `half_proficiencies` | Array | List of skills you have half proficiency in               |
| `bonuses`            | Array | List of bonuses to apply to specific skills               |

### Bonus Object

| Property | Type   | Description                              |
| -------- | ------ | ---------------------------------------- |
| `name`   | String | Name of the bonus (for display purposes) |
| `target` | String | Which skill the bonus applies to         |
| `value`  | Number | The bonus value to add                   |
