# Dynamic Content

::: v-pre
Dynamic content allows you to create templates that automatically calculate and display values based on your character's data. This is powered by a template system that uses `{{ }}` syntax to reference frontmatter, abilities, skills, and perform calculations.
:::

## How Dynamic Content Works

::: v-pre
The template system uses Handlebars to process template variables and functions. When a component encounters `{{ }}` syntax, it automatically:
:::

1. **Parses** the template expression
2. **Gathers** context data from your document (frontmatter, abilities, skills)
3. **Calculates** the result using available functions
4. **Displays** the computed value

## Template Syntax

::: v-pre
Templates use double curly braces `{{ }}` to define expressions:

```yaml
value: "{{ expression }}"
```

:::

::: tip String Values
Always wrap template expressions in quotes when used as YAML values to ensure proper parsing.
:::

## Available Data Sources

### Frontmatter

Access any property from your document's YAML frontmatter:

```yaml
---
level: 5
proficiency_bonus: 3
class: "Wizard"
---
```

::: v-pre

```yaml
# Reference frontmatter values
value: '{{ frontmatter.level }}'           # → 5
value: '{{ frontmatter.proficiency_bonus }}' # → 3
value: '{{ frontmatter.class }}'           # → "Wizard"
```

:::

### Abilities

Reference ability scores from any `ability` block in the same document:

```yaml
# From an ability block
abilities:
  strength: 14
  dexterity: 16
  constitution: 13
  intelligence: 18
  wisdom: 12
  charisma: 10
```

::: v-pre

```yaml
# Reference ability scores
value: '{{ abilities.strength }}'     # → 14
value: '{{ abilities.intelligence }}' # → 18
```

:::

### Skills

Reference skill data from any `skills` block in the same document:

```yaml
# From a skills block
proficiencies:
  - stealth
  - investigation
expertise:
  - stealth
```

::: v-pre

```yaml
# Reference skills data
value: '{{ skills.proficiencies }}'  # → Array of proficient skills
value: '{{ skills.expertise }}'      # → Array of expertise skills
```

:::

## Template Functions

The template system includes several built-in functions for calculations:

### Mathematical Functions

::: v-pre
| Function | Description | Example |
|----------|-------------|---------|
| `add` | Add multiple numbers | `{{ add 10 5 2 }}` → 17 |
| `subtract` | Subtract two numbers | `{{ subtract 15 3 }}` → 12 |
| `multiply` | Multiply two numbers | `{{ multiply 4 3 }}` → 12 |
| `divide` | Divide two numbers | `{{ divide 20 4 }}` → 5 |
| `floor` | Round down to nearest integer | `{{ floor 3.7 }}` → 3 |
| `ceil` | Round up to nearest integer | `{{ ceil 3.2 }}` → 4 |
| `round` | Round to nearest integer | `{{ round 3.6 }}` → 4 |
:::

### D&D Specific Functions

::: v-pre
| Function | Description | Example |
|----------|-------------|---------|
| `modifier` | Calculate D&D ability modifier | `{{ modifier 16 }}` → +3 |
:::

The `modifier` function follows D&D 5e rules: `(ability_score - 10) / 2` rounded down.

## Common Use Cases

::: v-pre

### Armor Class Calculation

```yaml
# AC = 10 + Dex modifier
value: "{{ add 10 (modifier abilities.dexterity) }}"
```

### Initiative Bonus

```yaml
# Initiative = Dex modifier
value: "+{{ modifier abilities.dexterity }}"
```

### Spell Attack Bonus

```yaml
# Spell Attack = Proficiency + Spellcasting modifier
value: "+{{ add frontmatter.proficiency_bonus (modifier abilities.intelligence) }}"
```

### Spell Save DC

```yaml
# Spell Save DC = 8 + Proficiency + Spellcasting modifier
value: "{{ add 8 frontmatter.proficiency_bonus (modifier abilities.intelligence) }}"
```

### Passive Perception

```yaml
# Passive Perception = 10 + Wisdom modifier + Proficiency (if proficient)
value: "{{ add 10 (modifier abilities.wisdom) frontmatter.proficiency_bonus }}"
```

:::
