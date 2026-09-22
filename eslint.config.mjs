import eslint from "@eslint/js";
import tsEslint from "typescript-eslint";
import globals from "globals";
import obsidianmd from "eslint-plugin-obsidianmd";

// The directory's review runs the plugin's own `recommended` config, so the
// rule list is read out of it rather than restated here. Restating it is what
// let prefer-create-el reach a review unflagged: the local config pinned a set
// of rule names, the plugin added more, and nothing failed until the directory
// ran its copy. Only the rules are taken — spreading the whole config would
// replace the type-aware parser this block needs and break every file.
//
// Severities are raised to error so CI fails on what the directory only warns
// about. The directory does not block publication on warnings, but an unfixed
// warning here is drift waiting to become an error.
const asError = (level) => {
	if (Array.isArray(level)) return ["error", ...level.slice(1)];
	// `off` is deliberate upstream (prefer-active-doc); don't second-guess it.
	return level === "off" ? "off" : "error";
};

const obsidianmdRecommendedRules = Object.fromEntries(
	obsidianmd.configs.recommended
		.flatMap((block) => Object.entries(block.rules ?? {}))
		.filter(([rule]) => rule.startsWith("obsidianmd/"))
		.map(([rule, level]) => [rule, asError(level)])
);

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
			...obsidianmdRecommendedRules,
			// Nothing here deletes files, so the rule has no call sites to
			// check; kept at warn so adding one is a prompt, not a CI failure.
			"obsidianmd/prefer-file-manager-trash-file": "warn",
		},
	}
);
