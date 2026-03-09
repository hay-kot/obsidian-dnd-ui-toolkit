# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

- `npm run dev` - Start compilation in watch mode
- `npm run build` - Build production version (with TypeScript checks)
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting with Prettier
- `npm run lint` - Lint code with ESLint
- `npm run lint:fix` - Lint and fix code with ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm run test` - Run tests with Vitest
- `npm run test:watch` - Run tests in watch mode
- `npm run docs:dev` - Start VitePress documentation server
- `npm run docs:build` - Build documentation
- `task build` - Build and optionally copy to plugin directory (if PLUGIN_DIR is set)
- `task check` - Run all checks (format, lint, type check, and test)
- Releases are done via GitHub Actions: `gh workflow run release.yml -f bump=patch|minor|major`

## Code Style

- **TypeScript:** Use strict typing (noImplicitAny, strictNullChecks)
- **Vue:** Use SFCs with `<script setup lang="ts">`, `defineProps`, and `defineEmits`
- **Templates:** Use Vue template syntax; avoid render functions
- **Imports:** Group by: 1) external packages, 2) local files; sort alphabetically within groups
- **Naming:** PascalCase for components/classes/interfaces, camelCase for functions/variables
- **Types:** Define in lib/types.ts with explicit interfaces; use TypeScript generics where appropriate
- **Error Handling:** Use nullable types with default values or early returns; avoid unchecked nulls
- **Components:** Place reusable UI components in lib/components/; use props interfaces
- **Domain Logic:** Place domain-specific code in lib/domains/
- **Views:** Place UI views in lib/views/; extend BaseView where applicable
- **Formatting:** Use consistent indentation (2 spaces), trailing commas, and semi-colons
- **State Management:** Use Vue reactivity (ref, computed) for component state; extract shared logic into composables
- **CSS:** Prefix all styles with plugin namespace; place component styles in lib/styles/components/
- **File Structure:** Keep code aligned with domain separation (domains, components, views)

## Architecture

- **Plugin Structure:** Obsidian plugin with Vue components for D&D UI elements
- **Code Block Processors:** Each View class processes specific YAML code blocks (ability, skills, stats, etc.)
- **State Management:** Uses KeyValueStore with JsonDataStore for persistent state across sessions
- **Component Architecture:**
  - Views: Handle code block parsing and rendering (extend BaseView)
  - Components: Vue SFC components for UI elements
  - Domains: Business logic for D&D mechanics (abilities, skills, combat)
  - Services: KV store for state persistence and event bus for communication
- **Rendering:** Views register markdown post-processors that transform YAML into interactive Vue components
- **Plugin Settings:** Configurable color scheme and state file path in settings tab
- **Event System:** Uses message bus (msgbus) for communication between components and frontmatter changes
- **Frontmatter Integration:** Automatically syncs with Obsidian frontmatter for character data like proficiency bonus and level
- **View Registration Pattern:** Each view extends BaseView and implements:
  - `registerView()`: Registers code block processor with plugin
  - `render()`: Transforms parsed YAML data into Vue components via VueMarkdown
  - State persistence handled automatically via KV store integration
- **State Persistence:**
  - In-memory cache with automatic disk persistence
  - Scoped by view type and element ID
  - State file location configurable in plugin settings
- **Template System:** Handlebars-style templating for dynamic content (e.g., {{dex_mod}} in ability descriptions)
- **D&D Mechanics:** Implements 5e rules for ability modifiers, proficiency bonuses, skill calculations
- **Build System:** Vite (replaced esbuild) for bundling and development

### Vue Integration Patterns

- **VueMarkdown:** Base class extending Obsidian's `MarkdownRenderChild` that bridges Vue and Obsidian. Provides `mount()` and `mountReactive()` methods for mounting Vue components into Obsidian's DOM.
- **Composables:** Shared reactive logic in `lib/composables/` (e.g., `usePersistedState.ts`). Follow Vue conventions: `use` prefix, return reactive refs and functions.
- **D&D Mechanics Module:** Core D&D logic extracted into `lib/domains/dnd/` for ability modifiers, proficiency bonuses, and skill calculations.
- **Component Structure:** All Vue components use `<script setup lang="ts">` with `defineProps` and `defineEmits` for type-safe props and events.

## Testing

- **Framework:** Vitest with Node environment
- **Test Files:** Place tests alongside source files with `.test.ts` extension
- **Coverage:** Configured to exclude config files, main.ts, and build outputs
- **Running Tests:**
  - All tests: `npm run test`
  - Watch mode: `npm run test:watch`
  - Single test file: `npm run test path/to/file.test.ts`
  - Pattern matching: `npm run test -- --grep "pattern"`
- **Test Patterns:** Mock external dependencies (e.g., MockDataStore), use TypeScript generics for type safety

## Documentation

- **Location:** VitePress documentation in `/docs` with examples and component references
- **Component Doc Template:** All component/feature docs follow this structure:
  1. `# Component Name` — Short description of what it does and when to use it
  2. `<Demo />` — Live Vue demo component, if available (always before YAML examples)
  3. `## Example` — Primary YAML example (use `### Variant Name` sub-headings for multiple examples)
  4. `## Configuration` — Properties table with columns: Property, Type, Default, Description
     - Use `### Sub Object` sub-headings for nested object tables (e.g., Item Object, Bonus Object)
     - Mark required fields with `Required` in the Default column
     - Mark template-capable properties with `†` after the property name
     - Include footnote below table: `† Supports [dynamic content](/concepts/dynamic-content) templates`
  5. Additional sections (Features, Common Use Cases, etc.) come after Configuration
- **Callouts:** Use `::: warning` / `::: tip` / `::: info` only for warnings and gotchas, not feature descriptions

## Development Workflow

- **Plugin Development:** Set PLUGIN_DIR environment variable to auto-copy built files to Obsidian plugin directory
- **State File:** Plugin creates `.dnd-ui-toolkit-state.json` (configurable) for persistent component state
