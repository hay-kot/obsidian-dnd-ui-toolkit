# Obsidian DnD UI Toolkit

This plugin provides modern UI elements for playing Dungeons and Dragons that provide building blocks for you to build
a beautiful markdown driven character sheet.

I built this plugin because I was tired of working with PDFs and online tools to manage my characters. I wanted to keep my notes, spells, and character state (Spell Slots, HP, etc..) all in my notebook. I'm building this plugin to make that process easier.

> [!WARNING]
> This plugin is in early development, things may be broken or change.

## 📖 Documentation

For complete documentation, examples, and guides, visit our documentation site:

**[📚 https://hay-kot.github.io/obsidian-dnd-ui-toolkit/](https://hay-kot.github.io/obsidian-dnd-ui-toolkit/)**

The documentation includes:
- [Quick Start Guide](https://hay-kot.github.io/obsidian-dnd-ui-toolkit/getting-started/quick-start) - Get up and running in minutes
- [Component Reference](https://hay-kot.github.io/obsidian-dnd-ui-toolkit/character-sheet/ability-scores) - Detailed docs for all components
- [Concepts & Guides](https://hay-kot.github.io/obsidian-dnd-ui-toolkit/concepts/state-storage) - Understanding state storage, events, and dynamic content
- [Examples](https://hay-kot.github.io/obsidian-dnd-ui-toolkit/examples/wizard) - Complete character sheet examples

## Quick Example

Components are defined with YAML code blocks in any note. For example, a health tracker with hit dice:

````markdown
```healthpoints
state_key: my-character-hp
health: 25
hitdice:
  dice: d8
  value: 3
```
````

An ability score block that other components (skills, spell components, templates) read from:

````markdown
```ability
abilities:
  strength: 10
  dexterity: 15
  constitution: 14
  intelligence: 12
  wisdom: 13
  charisma: 8
```
````

Interactive state (HP, spell slots, consumables) persists across sessions in a JSON state file in your vault. See the [Quick Start Guide](https://hay-kot.github.io/obsidian-dnd-ui-toolkit/getting-started/quick-start) for the full component list.

## Development

### Prerequisites

- [Node.js](https://nodejs.org/) (v22+)
- [Task](https://taskfile.dev/) (task runner)

### Setup

```bash
npm install
task dev:register   # once per machine, with Obsidian closed
```

The dev vault does not live in the repo. It lives in a fixed set of "slots" under
`~/obsidian-dev/`, and each clone of this repo claims one. `task dev:register` creates
the slots and adds them to Obsidian's vault list, which is why Obsidian has to be closed
-- it rewrites that file on quit. A backup is written next to it.

Slots exist because Obsidian resolves `obsidian://` URIs by vault name and cannot register
a vault on its own. A vault checked into the repo gives every clone a vault with the same
name, so Obsidian silently opens whichever copy it saw first. Slots give each clone a
distinct, permanent vault path instead.

The test notes stay in the repo under `dev/notes/` and are symlinked into the slot, so
notes you edit in Obsidian are edited in your working tree and show up in `git status`.

### Dev Workflow

```bash
task dev           # Build and install the plugin into this clone's slot
task dev --watch   # Rebuild and install on file changes
task dev:open      # Open this clone's slot in Obsidian
task dev:status    # Show which clone holds each slot
task dev:release   # Give up this clone's slot
```

`task dev` claims a slot on first run, installs [hot-reload](https://github.com/pjeby/hot-reload)
into it, symlinks `dev/notes/` in, and copies the build to the slot's plugin directory. Use
`--watch` to rebuild on file changes; hot-reload picks each rebuild up without a restart.

Slots are claimed by writing the clone's path to `<slot>/.claim`. A claim whose clone no
longer exists counts as free, so deleted clones release their slot on their own. Three
slots are created by default; set `DND_SLOT_COUNT` (and `DND_SLOT_ROOT`) to change that.

To install to a real vault instead of a slot, set `PLUGIN_DIR` in a `.env` file:

```bash
# .env
PLUGIN_DIR=/path/to/your/vault/.obsidian/plugins/dnd-ui-toolkit
```

### Testing

```bash
npm run test              # Run all tests
npm run test:watch        # Run tests in watch mode
npm run test -- path/to/file.test.ts  # Run a single test file
```

### Other Commands

```bash
npm run format        # Format code with Prettier
npm run lint          # Lint with ESLint
npm run typecheck     # Run TypeScript type checking
task check            # Run all checks (format, lint, typecheck, test)
npm run docs:dev      # Start documentation dev server
```
