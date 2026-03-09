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

## Development

### Prerequisites

- [Node.js](https://nodejs.org/) (v22+)
- [Task](https://taskfile.dev/) (task runner)

### Setup

```bash
npm install
task dev:setup
```

`task dev:setup` prepares the dev environment by:
- Installing the [hot-reload](https://github.com/pjeby/hot-reload) plugin into the dev vault
- Creating a `.hotreload` marker so changes are picked up automatically
- Configuring `community-plugins.json` to enable both plugins

After setup, open the dev vault in Obsidian for the first time:

1. Open Obsidian
2. Open the vault switcher
3. Select "Open folder as vault" and choose `dev/dnd-ui-dev`

Once registered, you can use `task dev:open` to open it.

### Dev Workflow

```bash
task dev           # Build and install plugin to dev vault
task dev --watch   # Rebuild and install on file changes
task dev:open      # Open the dev vault in Obsidian
```

`task dev` builds the plugin and copies it to `PLUGIN_DIR`. By default this is the included dev vault at `dev/dnd-ui-dev/.obsidian/plugins/dnd-ui-toolkit/`. Use `--watch` to automatically rebuild on file changes. With hot-reload installed, Obsidian will automatically reload the plugin after each rebuild.

To install to a different vault, set `PLUGIN_DIR` in a `.env` file:

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
