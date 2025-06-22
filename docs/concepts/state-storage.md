# State Storage

The DnD UI Toolkit uses a persistent state storage system to remember the current state of your character's resources, health, and other trackable values between Obsidian sessions.

## How State Storage Works

State storage is handled through **state keys** - unique identifiers that components use to save and retrieve their data. When you interact with a component (like spending a spell slot or taking damage), the plugin automatically saves that state to the configured state file in your settings.

## State Keys

### What is a State Key?

A `state_key` is a unique identifier string that tells the plugin where to store a component's data. Think of it like a variable name that persists between sessions.

```yaml
state_key: "my_character_hp" # This is a state key
```

### State Key Requirements

::: warning Uniqueness Requirement
Each `state_key` must be **globally unique** across your entire Obsidian vault. If two components use the same state key, they will overwrite each other's data.
:::

- ❌ `level_1_spells`
- ✅ `din_level_1_spells`

_If you want to track the same state across multiple files or components you can use the same state key in multiple places_
