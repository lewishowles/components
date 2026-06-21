// Metadata for docs and CLI consumers that need to describe or generate form-checkbox-group usage.
export const formCheckboxGroupMetadata = {
	name: "form-checkbox-group",
	category: "form",
	summary: "A checkbox group that exposes an array model while reusing form-input-group layout.",
	props: [
		{
			name: "modelValue",
			type: "array | null",
			default: "[]",
			summary: "Selected option values.",
		},
		{
			name: "required",
			type: "boolean",
			default: false,
			summary: "Whether this field is required.",
		},
	],
	slots: [
		{
			name: "default",
			summary: "The group legend.",
		},
		{
			name: "optional-indicator",
			summary:
				"Content shown after the label when the field is not required. Defaults to (optional).",
		},
		{
			name: "introduction",
			summary: "Introductory text shown above the options.",
		},
		{
			name: "help",
			summary: "Help text shown below the options.",
		},
		{
			name: "error",
			summary: "Custom error content.",
		},
	],
	events: [
		{
			name: "update:modelValue",
			summary: "Emitted with the selected option values when selection changes.",
		},
	],
	methods: [
		{
			name: "triggerFocus",
			summary: "Move focus into the checkbox group.",
		},
	],
	examples: [],
};
