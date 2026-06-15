// Metadata for docs and CLI consumers that need to describe or generate tab-group usage.
export const tabGroupMetadata = {
	name: "tab-group",
	category: "content",
	summary: "A grouped tab interface for switching between tab-item panels.",
	props: [
		{
			name: "activation",
			type: "string",
			default: "manual",
			values: ["manual", "automatic"],
			summary: "Whether tabs activate on focus or explicit selection.",
		},
		{
			name: "rememberSelection",
			type: "boolean",
			default: false,
			summary: "Remember the selected tab across renders.",
		},
		{
			name: "wrap",
			type: "boolean",
			default: true,
			summary: "Wrap keyboard navigation from last tab to first.",
		},
	],
	slots: [
		{ name: "default", summary: "Tab item panels." },
		{ name: "label", summary: "Accessible label for the tab group." },
	],
	examples: [],
};
