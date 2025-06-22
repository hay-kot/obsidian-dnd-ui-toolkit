# Front Matter

Certain front matter within the Character Sheet can aid in component rendering.

| Property            | Type   | Default | Description                                                        |
| ------------------- | ------ | ------- | ------------------------------------------------------------------ |
| `proficiency_bonus` | Number | 2       | Set's your characters proficiency bonus used in skill calculations |
| `level`             | Number | -       | Character level, auto-calculates proficiency bonus if not explicitly set |

## Auto-calculation

When `level` is provided in frontmatter but `proficiency_bonus` is not explicitly set, the proficiency bonus will be automatically calculated based on D&D 5e rules:

- Levels 1-4: +2
- Levels 5-8: +3  
- Levels 9-12: +4
- Levels 13-16: +5
- Levels 17-20: +6
