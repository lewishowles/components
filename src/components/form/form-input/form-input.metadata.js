// Metadata for docs and CLI consumers that need to describe or generate form-input usage.
export const formInputMetadata = {
	name: "form-input",
	category: "form",
	summary: "A text input with optional prefix, suffix, placeholder, and datalist suggestions.",
	props: [
		{
			name: "id",
			type: "string",
			default: null,
			summary: "ID for the input; auto-generated if omitted.",
		},
		{
			name: "placeholder",
			type: "string",
			default: null,
			summary: "Placeholder text — do not use for critical information.",
		},
		{
			name: "required",
			type: "boolean",
			default: false,
			summary: "Mark the field as required.",
		},
		{
			name: "inputAttributes",
			type: "object",
			default: null,
			summary:
				"Additional attributes forwarded to the input element, such as autocomplete or type.",
		},
		{
			name: "suggestions",
			type: "array",
			default: null,
			summary: "Suggestions rendered as a datalist; users can select from them or type freely.",
		},
	],
	slots: [
		{
			name: "default",
			summary: "The field label.",
		},
		{
			name: "introduction",
			summary: "Introductory text shown above the input.",
		},
		{
			name: "prefix",
			summary: "Content placed before the input.",
		},
		{
			name: "suffix",
			summary: "Content placed after the input.",
		},
		{
			name: "error",
			summary: "Custom error content.",
		},
		{
			name: "help",
			summary: "Help text shown below the input.",
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
			name: "field-wrapper",
			summary: "Wrapper around the input element and any prefix or suffix.",
		},
	],
	examples: [
		{
			name: "default",
			label: "Default input",
			summary: "A labelled text input.",
			snippet: {
				slots: {
					default: {
						label: "Field label",
						value: "Email address",
					},
				},
				props: {
					placeholder: {
						label: "Placeholder",
						value: "name@example.com",
						isInline: true,
					},
					required: {
						label: "Required",
						value: true,
						type: "boolean",
					},
				},
			},
		},
		{
			name: "suggestions",
			label: "Input with suggestions",
			summary: "A text input backed by datalist suggestions.",
			snippet: {
				slots: {
					default: {
						label: "Field label",
						value: "Company",
					},
				},
				props: {
					suggestions: {
						label: "Suggestions",
						value: "companySuggestions",
						isVariable: true,
					},
				},
			},
		},
	],
};
