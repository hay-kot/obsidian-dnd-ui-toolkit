---
character_file: "[[Din Thornewood]]"
---
# Spell Components (Linked Character)

Tests `spell-components` with `chqjjjaracter_file` frontmatter — ability scores, proficiency bonus, and spellcasting ability are pulled from the linked character file.

## Attack Spell

Should show attack bonus from Din's INT 18 (+4) and level 5 prof (+3) = +7.

```spell-components
casting_time: 1 action
range: 120 feet
components: V, S
duration: Instantaneous
attack: true
```

## Save Spell

Should show DC 15 (8 + 3 + 4).

```spell-components
casting_time: 1 action
range: 150 feet
components: V, S, M (a tiny ball of bat guano and sulfur)
duration: Instantaneous
save: dexterity
```

## Both Save + Attack

```spell-components
casting_time: 1 action
range: 60 feet
components: V, S, M (a pinch of sulfur)
duration: Concentration, up to 1 minute
save: wisdom
attack: true
```

## No Save or Attack

No accent panel — grid only.

```spell-components
casting_time: 1 bonus action
range: Self
components: V
duration: 1 round
```
