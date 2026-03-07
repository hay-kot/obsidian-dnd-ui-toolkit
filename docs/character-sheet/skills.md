# Skills

The `skills` block automatically calculates your skill modifiers. It pulls from the first `abilities` block in your file and calculates scores based on those values. Supports proficiency, expertise, half proficiency, and arbitrary bonuses.

<SkillCardsDemo />

## Example

````yaml
```skills
proficiencies:
  - arcana
  - deception
  - history
  - insight
  - investigation
  - perception
  - stealth

bonuses:
  - name: Cloak of Elvenkind
    target: stealth
    value: 2

expertise:
  - investigation

half_proficiencies:
  - history
```
````

The skills block automatically displays all 18 D&D 5e skills: Acrobatics, Animal Handling, Arcana, Athletics, Deception, History, Insight, Intimidation, Investigation, Medicine, Nature, Perception, Performance, Persuasion, Religion, Sleight of Hand, Stealth, and Survival. Only skills listed in `proficiencies`, `expertise`, or `half_proficiencies` receive bonuses — the rest display with their base ability modifier.

## Configuration

| Property             | Type  | Default | Description                                               |
| -------------------- | ----- | ------- | --------------------------------------------------------- |
| `proficiencies`      | Array | —       | List of skills you are proficient in                      |
| `expertise`          | Array | —       | List of skills you have expertise in (double proficiency) |
| `half_proficiencies` | Array | —       | List of skills you have half proficiency in               |
| `bonuses`            | Array | —       | List of bonuses to apply to specific skills               |

### Bonus Object

| Property | Type   | Default  | Description                              |
| -------- | ------ | -------- | ---------------------------------------- |
| `name`   | String | Required | Name of the bonus (for display purposes) |
| `target` | String | Required | Which skill the bonus applies to         |
| `value`  | Number | Required | The bonus value to add                   |
