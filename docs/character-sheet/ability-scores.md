# Ability Scores

The `ability` block generates a 6-column grid of your ability scores and their saving throws. Fill in the code block with your abilities, proficiencies, and any bonuses that apply to either the ability scores themselves or their saving throws.

<AbilityCardsDemo />

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

| Property        | Type   | Default  | Description                                                                             |
| --------------- | ------ | -------- | --------------------------------------------------------------------------------------- |
| `abilities`     | Object | Required | Ability score values (strength, dexterity, constitution, intelligence, wisdom, charisma) |
| `bonuses`       | Array  | —        | List of bonuses to apply to ability scores or saving throws                             |
| `proficiencies` | Array  | —        | List of abilities you are proficient in for saving throws                               |

### Bonus Object

| Property   | Type   | Default        | Description                                         |
| ---------- | ------ | -------------- | --------------------------------------------------- |
| `name`     | String | Required       | Name of the bonus (for display purposes)            |
| `target`   | String | Required       | Which ability the bonus applies to                  |
| `value`    | Number | Required       | The bonus value to add                              |
| `modifies` | String | "saving_throw" | Either `"score"` or `"saving_throw"` |
