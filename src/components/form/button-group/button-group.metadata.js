// Metadata for docs and CLI consumers that need to describe or generate button-group usage.
export const buttonGroupMetadata = {
	name: "button-group",
	category: "form",
	summary: "A radio group rendered as joined buttons with optional icons.",
	slots: [
		{
			name: "default",
			summary: "The group legend.",
		},
		{
			name: "options",
			summary: "Custom rendering for options. Scoped with options and name.",
		},
		{
			name: "introduction",
			summary: "Introductory text shown above the options.",
		},
		{
			name: "error",
			summary: "Custom error content.",
		},
		{
			name: "help",
			summary: "Help text shown below the options.",
		},
	],
	methods: [
		{
			name: "triggerFocus",
			summary: "Move focus to the selected option, or the first option if none is selected.",
		},
	],
	examples: [],
};
