// Metadata for docs and CLI consumers that need to describe or generate form-checkbox usage.
export const formCheckboxMetadata = {
	name: "form-checkbox",
	category: "form",
	summary: "A checkbox with accessible labelling, help text, errors, and indeterminate state.",
	props: [
		{
			name: "id",
			type: "string",
			default: null,
			summary: "ID for the checkbox; auto-generated if omitted.",
		},
		{
			name: "displayLabel",
			type: "boolean",
			default: true,
			summary: "Show the visible label while keeping it available to screen readers when hidden.",
		},
		{
			name: "inputAttributes",
			type: "object",
			default: null,
			summary: "Additional attributes forwarded to the checkbox input.",
		},
		{
			name: "required",
			type: "boolean",
			default: false,
			summary: "Whether this field is required.",
		},
		{
			name: "showOptionalIndicator",
			type: "boolean",
			default: true,
			summary: "Whether to show optional text when the field is not required.",
		},
		{
			name: "indeterminate",
			type: "boolean",
			default: false,
			summary: "Set the checkbox to an indeterminate visual state.",
		},
	],
	slots: [
		{
			name: "default",
			summary: "The checkbox label.",
		},
		{
			name: "optional-indicator",
			summary:
				"Content shown after the label when the field is not required. Defaults to (optional).",
		},
		{
			name: "error",
			summary: "Custom error content.",
		},
		{
			name: "help",
			summary: "Help text shown below the checkbox.",
		},
	],
	methods: [
		{
			name: "triggerFocus",
			summary: "Move focus to the checkbox.",
		},
	],
	parts: [
		{ name: "indicator", summary: "The checkbox input element." },
		{ name: "label", summary: "Label associated with the checkbox." },
	],
	examples: [
		{
			name: "default",
			label: "Default checkbox",
			summary: "A labelled checkbox.",
			snippet: {
				slots: {
					default: {
						label: "Checkbox label",
						value: "I agree to the terms",
					},
				},
			},
		},
	],
};
