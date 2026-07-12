// Metadata for docs and CLI consumers that need to describe or generate form-file usage.
export const formFileMetadata = {
	name: "form-file",
	category: "form",
	summary: "A file upload field supporting single or multiple selection.",
	props: [
		{
			name: "id",
			type: "string",
			default: null,
			summary: "ID for the input; auto-generated if omitted.",
		},
		{
			name: "multiple",
			type: "boolean",
			default: false,
			summary: "Allow selecting multiple files and return an array from v-model.",
		},
		{
			name: "required",
			type: "boolean",
			default: false,
			summary: "Mark the field as required.",
		},
		{
			name: "showOptionalIndicator",
			type: "boolean",
			default: true,
			summary: "Show optional text when the field is not required.",
		},
		{
			name: "inputAttributes",
			type: "object",
			default: null,
			summary:
				"Additional attributes forwarded to the input element. Component-managed attributes cannot be overridden.",
		},
	],
	slots: [
		{
			name: "default",
			summary: "The field label.",
		},
		{
			name: "optional-indicator",
			summary:
				"Content shown after the label when the field is not required. Defaults to (optional).",
		},
		{
			name: "introduction",
			summary: "Introductory text shown above the input.",
		},
		{
			name: "error",
			summary: "Custom error content.",
		},
		{
			name: "help",
			summary: "Help text shown below the input.",
		},
		{
			name: "remove-button-label",
			summary: "Remove button content; receives the current files array.",
		},
	],
	methods: [
		{
			name: "triggerFocus",
			summary: "Move focus to the input.",
		},
	],
	parts: [
		{
			name: "controls",
			summary: "Wrapper around the input element and the remove button.",
		},
		{
			name: "remove",
			summary: "Button shown once a file is selected, clearing the selection.",
		},
	],
	examples: [
		{
			name: "default",
			label: "Default file upload",
			summary: "A labelled file upload field.",
			snippet: {
				slots: {
					default: {
						label: "Field label",
						value: "Supporting document",
					},
				},
				props: {
					required: {
						label: "Required",
						value: true,
						type: "boolean",
					},
				},
			},
		},
		{
			name: "multiple",
			label: "Multiple file upload",
			summary: "A labelled file upload field that accepts multiple files.",
			snippet: {
				slots: {
					default: {
						label: "Field label",
						value: "Supporting documents",
					},
				},
				props: {
					multiple: {
						label: "Multiple",
						value: true,
						type: "boolean",
					},
				},
			},
		},
	],
};
