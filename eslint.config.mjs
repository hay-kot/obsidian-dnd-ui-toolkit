import eslint from "@eslint/js";
import tsEslint from "typescript-eslint";
import globals from "globals";
import obsidianmd from "eslint-plugin-obsidianmd";

export default tsEslint.config(
	{
		ignores: ["/node_modules", "main.js", "docs/**", "dist/**", "dev/**"],
	},
	eslint.configs.recommended,
	tsEslint.configs.eslintRecommended,
	tsEslint.configs.recommended,
	{
		plugins: {
			"@typescript-eslint": tsEslint.plugin,
		},
		languageOptions: {
			globals: {
				...globals.node,
			},
			parser: tsEslint.parser,
			sourceType: "module",
		},
		rules: {
			"no-prototype-builtins": "off",
			"no-unused-vars": "off",

			"@typescript-eslint/ban-ts-comment": "off",
			"@typescript-eslint/no-empty-function": "off",
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/no-unused-vars": ["error", { args: "none" }],
			"@typescript-eslint/no-unused-expressions": ["error", { allowShortCircuit: true, allowTernary: true }],
		},
	},
	{
		// Obsidian plugin-review rules (the same checks the community
		// plugin directory's automated review runs), scoped to shipped code.
		// Type-aware rules run here too, matching the directory's review
		// config — they need the same `projectService` parser setup, and
		// keeping this block last lets it re-enable what the base config
		// turns off repo-wide.
		files: ["main.ts", "settings.ts", "lib/**/*.ts"],
		ignores: ["**/*.test.ts"],
		extends: [tsEslint.configs.recommendedTypeChecked],
		plugins: {
			obsidianmd,
		},
		languageOptions: {
			parser: tsEslint.parser,
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
		rules: {
			"@typescript-eslint/no-explicit-any": "error",
			"obsidianmd/commands/no-command-in-command-id": "error",
			"obsidianmd/commands/no-command-in-command-name": "error",
			"obsidianmd/commands/no-default-hotkeys": "error",
			"obsidianmd/commands/no-plugin-id-in-command-id": "error",
			"obsidianmd/commands/no-plugin-name-in-command-name": "error",
			"obsidianmd/settings-tab/no-manual-html-headings": "error",
			"obsidianmd/settings-tab/no-problematic-settings-headings": "error",
			"obsidianmd/vault/iterate": "error",
			"obsidianmd/detach-leaves": "error",
			"obsidianmd/editor-drop-paste": "error",
			"obsidianmd/hardcoded-config-path": "error",
			"obsidianmd/no-forbidden-elements": "error",
			"obsidianmd/no-global-this": "error",
			"obsidianmd/no-plugin-as-component": "error",
			"obsidianmd/no-sample-code": "error",
			"obsidianmd/no-tfile-tfolder-cast": "error",
			"obsidianmd/no-static-styles-assignment": "error",
			"obsidianmd/object-assign": "error",
			"obsidianmd/platform": "error",
			"obsidianmd/prefer-get-language": "error",
			"obsidianmd/prefer-abstract-input-suggest": "error",
			"obsidianmd/prefer-window-timers": "error",
			"obsidianmd/regex-lookbehind": "error",
			"obsidianmd/sample-names": "error",
			"obsidianmd/validate-manifest": "error",
			"obsidianmd/validate-license": "error",
			"obsidianmd/ui/sentence-case": ["error", { enforceCamelCaseLower: true }],
			"obsidianmd/no-view-references-in-plugin": "error",
			"obsidianmd/no-unsupported-api": "error",
			"obsidianmd/prefer-file-manager-trash-file": "warn",
			"obsidianmd/prefer-instanceof": "error",
		},
	}
);
