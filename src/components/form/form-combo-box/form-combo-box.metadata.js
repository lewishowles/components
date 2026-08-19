// Metadata for docs and CLI consumers that need to describe or generate form-combo-box usage.
export const formComboBoxMetadata = {
	name: "form-combo-box",
	category: "form",
	summary:
		"A single-choice form field that filters labelled options while storing the selected option value.",
	props: [
		{
			name: "options",
			type: "array | object",
			default: "[]",
			summary:
				"Options to filter and render. Strings, numbers, label/value objects, and value/label maps are supported.",
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
			name: "loading",
			type: "boolean",
			default: false,
			summary: "Show loading content instead of the option list while options are loading.",
		},
		{
			name: "id",
			type: "string",
			default: null,
			summary: "ID for the text input; auto-generated if omitted.",
		},
		{
			name: "placeholder",
			type: "string",
			default: null,
			summary: "Placeholder text for the input.",
		},
		{
			name: "inputAttributes",
			type: "object",
			default: null,
			summary: "Additional attributes forwarded to the text input, such as autocomplete.",
		},
		{
			name: "required",
			type: "boolean",
			default: false,
			summary: "Mark the field as required for form-wrapper validation.",
		},
		{
			name: "displayLabel",
			type: "boolean",
			default: true,
			summary: "Show the field label; when false, keep it available to screen readers only.",
		},
		{
			name: "placement",
			type: "string",
			default: "below",
			summary:
				"Preferred placement of the results list. It flips above or below the input when needed.",
		},
		{
			name: "align",
			type: "string",
			default: "start",
			summary: "Align the results list to the start or end of the input. It flips when needed.",
		},
		{
			name: "dropdownClasses",
			type: "string | array | object",
			default: null,
			summary: "Additional classes for the results list.",
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
			name: "help",
			summary: "Help text shown below the input.",
		},
		{
			name: "error",
			summary: "Custom validation error content.",
		},
		{
			name: "option",
			summary:
				"Custom option content with the original option, label, value, highlighted, and selected. Keep it free of nested interactive controls.",
		},
		{
			name: "loading",
			summary:
				"Content shown while loading is true. Loading takes priority over the empty and no-results states.",
		},
		{
			name: "empty",
			summary: "Content shown when no options were supplied.",
		},
		{
			name: "no-results",
			summary: "Content shown when options exist but none match the current query. Receives query.",
		},
	],
	methods: [
		{
			name: "triggerFocus",
			summary: "Move focus to the text input.",
		},
	],
	parts: [
		{ name: "text-control", summary: "Wrapper around the text input and form fragments." },
		{ name: "dropdown", summary: "Results panel positioned around the text input." },
		{ name: "listbox", summary: "Listbox containing the filtered options." },
		{ name: "option", summary: "Individual option row in the listbox." },
		{ name: "status", summary: "Loading, empty, or no-results content." },
	],
	examples: [
		{
			name: "record-options",
			label: "Records with matching names",
			summary: "Store record IDs while option content distinguishes entries with the same name.",
			snippet: {
				slots: {
					default: {
						label: "Field label",
						value: "Record",
					},
				},
				props: {
					options: {
						label: "Options",
						value: "records",
						isVariable: true,
					},
					labelKey: {
						label: "Label key",
						value: "name",
						isInline: true,
					},
					valueKey: {
						label: "Value key",
						value: "id",
						isInline: true,
					},
				},
			},
		},
	],
};
