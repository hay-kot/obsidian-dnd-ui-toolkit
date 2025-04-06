# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands
- `npm run dev` - Start compilation in watch mode
- `npm run build` - Build production version (with TypeScript checks)
- `npm version patch|minor|major` - Bump version
- `task build` - Build and optionally copy to plugin directory (if PLUGIN_DIR is set)
- `eslint main.ts` - Lint specific file
- `eslint ./lib/` - Lint all files in directory

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