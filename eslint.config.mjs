import eslint from "@eslint/js";
import tsEslint from "typescript-eslint";
import globals from "globals";

export default tsEslint.config(
	{
		ignores: ["/node_modules", "main.js", "docs/**"],
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
	}
);
