import stylistic from "@stylistic/eslint-plugin";

export default {
	plugins: {
		"@stylistic": stylistic,
	},
	rules: {
		"@stylistic/no-confusing-arrow": "error",
		"@stylistic/padding-line-between-statements": [
			"error",
			{ blankLine: "always", prev: "const", next: "let" },
			{ blankLine: "always", prev: "let", next: "const" },
			{ blankLine: "always", prev: "*", next: "break" },
			{ blankLine: "always", prev: ["const", "let"], next: "*" },
			{ blankLine: "always", prev: "*", next: "return" },
			{ blankLine: "any", prev: "const", next: "const" },
			{ blankLine: "any", prev: "let", next: "let" },
			{ blankLine: "always", prev: "multiline-const", next: "*" },
			{ blankLine: "always", prev: "*", next: "multiline-const" },
		],
	},
};
