# Ability Scores

The `ability` block is used to generate a 6 column grid of your ability scores and their saving throws. Fill in the code block with your abilities, proficiencies, and any bonuses that are applied to either the ability scores themselves or their saving throws.

![Rendered Example](../images/example-ability-scores.webp)

## Example

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
    modifies: saving_throw  # Optional: defaults to saving_throw

proficiencies:
  - intelligence
  - wisdom
```
````

## Configuration

| Property        | Type   | Description                                                                              |
| --------------- | ------ | ---------------------------------------------------------------------------------------- |
| `abilities`     | Object | Ability score values (strength, dexterity, constitution, intelligence, wisdom, charisma) |
| `bonuses`       | Array  | List of bonuses to apply to ability scores or saving throws                              |
| `proficiencies` | Array  | List of abilities you are proficient in for saving throws                                |

### Bonus Object

| Property   | Type   | Description                                                                  |
| ---------- | ------ | ---------------------------------------------------------------------------- |
| `name`     | String | Name of the bonus (for display purposes)                                     |
| `target`   | String | Which ability the bonus applies to                                           |
| `value`    | Number | The bonus value to add                                                       |
| `modifies` | String | Optional. Either `"score"` or `"saving_throw"`. Defaults to `"saving_throw"` |
