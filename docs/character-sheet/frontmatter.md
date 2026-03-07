# Frontmatter

Certain frontmatter properties within the character sheet aid in component rendering.

## Example

```yaml
---
proficiency_bonus: 3
level: 5
---
```

## Configuration

| Property            | Type   | Default | Description                                                                   |
| ------------------- | ------ | ------- | ----------------------------------------------------------------------------- |
| `proficiency_bonus` | Number | 2       | Sets your character's proficiency bonus used in skill and spell calculations  |
| `level`             | Number | —       | Character level, auto-calculates proficiency bonus if not explicitly set      |

### Auto-calculation

When `level` is provided in frontmatter but `proficiency_bonus` is not explicitly set, the proficiency bonus will be automatically calculated based on D&D 5e rules:

- Levels 1-4: +2
- Levels 5-8: +3
- Levels 9-12: +4
- Levels 13-16: +5
- Levels 17-20: +6
