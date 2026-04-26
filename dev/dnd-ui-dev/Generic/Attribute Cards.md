# Attribute Cards

Tests the `attribute-cards` code block: three realms (Physical, Cognitive, Spiritual) with a shield-shaped **defense** between each pair of **attributes**, plus per-realm **resource** rows. For a flat list of ungrouped ability-style cards, use `ability-cards` instead.

```attribute-cards
heading: Attributes
realms:
  - label: Physical
    primary:
      label: Strength
      label_short: STR
      header_value: "+1"
      value: "0"
    defense:
      label: Physical defense
      label_short: PDEF
      header_value: 0
      value: "0"
    secondary:
      label: Speed
      label_short: SPD
      header_value: 0
      value: "0"
    resources:
      - label: Health (maximum)
        value: 10
      - label: Health (current)
        value: 8
      - label: Deflect
        value: "0"
  - label: Cognitive
    primary:
      label: Intellect
      label_short: INT
      header_value: 0
      value: "0"
    defense:
      label: Cognitive defense
      label_short: CDEF
      header_value: 0
      value: "0"
    secondary:
      label: Willpower
      label_short: WIL
      header_value: 0
      value: "0"
    resources:
      - label: Focus (maximum)
        value: 3
      - label: Focus (current)
        value: 2
  - label: Spiritual
    primary:
      label: Awareness
      label_short: AWA
      header_value: 0
      value: "0"
    defense:
      label: Spiritual defense
      label_short: SDEF
      header_value: 0
      value: "0"
    secondary:
      label: Presence
      label_short: PRE
      header_value: 0
      value: "0"
    resources:
      - label: Investiture (maximum)
        value: 5
      - label: Investiture (current)
        value: 3
```
