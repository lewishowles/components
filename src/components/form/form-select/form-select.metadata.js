// Metadata for docs and CLI consumers that need to describe or generate form-select usage.
export const formSelectMetadata = {
	name: "form-select",
	category: "form",
	summary: "A select field with normalised options, accessible labelling, help text, and errors.",
	props: [
		{
			name: "options",
			type: "array | object",
			default: "[]",
			summary: "Options to render. Strings, numbers, and label/value objects are supported.",
		},
		{
			name: "labelKey",
			type: "string",
			default: "label",
			summary: "Object key used for option labels.",
		},
		{
			name: "valueKey",
			type: "string",
			default: "value",
			summary: "Object key used for option values.",
		},
		{
			name: "allowEmpty",
			type: "boolean",
			default: true,
			summary: "Show an empty option before the provided options.",
		},
		{
			name: "id",
			type: "string",
			default: null,
			summary: "ID for the select; auto-generated if omitted.",
		},
		{
			name: "inputAttributes",
			type: "object",
			default: null,
			summary: "Additional attributes forwarded to the select element.",
		},
		{
			name: "required",
			type: "boolean",
			default: false,
			summary: "Mark the field as required.",
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
			summary: "Introductory text shown above the select.",
		},
		{
			name: "empty-option-label",
			summary: "Label for the empty option.",
			default: "Please select…",
		},
		{
			name: "error",
			summary: "Custom error content.",
		},
		{
			name: "help",
			summary: "Help text shown below the select.",
		},
	],
	methods: [
		{
			name: "triggerFocus",
			summary: "Move focus to the select.",
		},
	],
	parts: [{ name: "field-wrapper", summary: "Wrapper around the select element." }],
	examples: [
		{
			name: "default",
			label: "Default select",
			summary: "A labelled select with options supplied from component state.",
			snippet: {
				slots: {
					default: {
						label: "Field label",
						value: "Country",
					},
				},
				props: {
					options: {
						label: "Options",
						value: "countries",
						isVariable: true,
					},
					required: {
						label: "Required",
						value: true,
						type: "boolean",
					},
				},
			},
		},
	],
};
