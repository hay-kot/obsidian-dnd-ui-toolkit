# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands
- `npm run dev` - Start compilation in watch mode
- `npm run build` - Build production version (with TypeScript checks)
- `npm version patch|minor|major` - Bump version
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting with Prettier
- `npm run lint` - Lint code with ESLint
- `npm run lint:fix` - Lint and fix code with ESLint
- `task build` - Build and optionally copy to plugin directory (if PLUGIN_DIR is set)
- `task release` - Release a new minor version (includes format and lint checks)

## Code Style
- **TypeScript:** Use strict typing (noImplicitAny, strictNullChecks)
- **React:** Use functional components with explicit props interfaces
- **JSX:** Use React JSX syntax with function components
- **Imports:** Group by: 1) external packages, 2) local files; sort alphabetically within groups
- **Naming:** PascalCase for components/classes/interfaces, camelCase for functions/variables
- **Types:** Define in lib/types.ts with explicit interfaces; use TypeScript generics where appropriate
- **Error Handling:** Use nullable types with default values or early returns; avoid unchecked nulls
- **Components:** Place reusable UI components in lib/components/; use props interfaces
- **Domain Logic:** Place domain-specific code in lib/domains/
- **Views:** Place UI views in lib/views/; extend BaseView where applicable
- **Formatting:** Use consistent indentation (2 spaces), trailing commas, and semi-colons
- **State Management:** Use React hooks (useState) for component state
- **CSS:** Prefix all styles with plugin namespace; place component styles in lib/styles/components/
- **File Structure:** Keep code aligned with domain separation (domains, components, views)

## Architecture
- **Plugin Structure:** Obsidian plugin with React components for D&D UI elements
- **Code Block Processors:** Each View class processes specific YAML code blocks (ability, skills, stats, etc.)
- **State Management:** Uses KeyValueStore with JsonDataStore for persistent state across sessions
- **Component Architecture:**
  - Views: Handle code block parsing and rendering (extend BaseView)
  - Components: React components for UI elements
  - Domains: Business logic for D&D mechanics (abilities, skills, combat)
  - Services: KV store for state persistence
- **Rendering:** Views register markdown post-processors that transform YAML into interactive React components
- **Plugin Settings:** Configurable color scheme and state file path in settings tab