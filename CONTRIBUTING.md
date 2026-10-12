# Contributing

Bug reports and feature requests are welcome in
[GitHub issues](https://github.com/hay-kot/obsidian-ttrpg-ui-toolkit/issues). This document
covers how to build and test the plugin locally.

## Prerequisites

- [Node.js](https://nodejs.org/) (v22+)
- [Task](https://taskfile.dev/) (task runner)

## Setup

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

## Dev Workflow

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
PLUGIN_DIR=/path/to/your/vault/.obsidian/plugins/ttrpg-ui-toolkit
```

## Testing

```bash
npm run test              # Run all tests
npm run test:watch        # Run tests in watch mode
npm run test -- path/to/file.test.ts  # Run a single test file
```

## Checks

```bash
npm run format        # Format code with Prettier
npm run lint          # Lint with ESLint
npm run typecheck     # Run TypeScript type checking
task check            # Run all checks (format, lint, typecheck, test)
```

## Documentation

The docs site is built with VitePress from the `docs/` directory. Component pages embed
live demos that render the real plugin components, so changes to `lib/` show up there too.

```bash
npm run docs:dev      # Start the documentation dev server
npm run docs:build    # Build the documentation site
```

## Releases

Releases run through GitHub Actions:

```bash
gh workflow run release.yml -f bump=patch|minor|major
```
