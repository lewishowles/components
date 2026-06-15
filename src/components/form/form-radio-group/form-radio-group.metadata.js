// Metadata for docs and CLI consumers that need to describe or generate form-radio-group usage.
export const formRadioGroupMetadata = {
	name: "form-radio-group",
	category: "form",
	summary:
		"A radio group that exposes a single selected value while reusing form-input-group layout.",
	props: [
		{
			name: "modelValue",
			type: "string | number",
			default: null,
			summary: "Selected option value.",
		},
	],
	slots: [
		{
			name: "default",
			summary: "The group legend.",
		},
		{
			name: "introduction",
			summary: "Introductory text shown above the options.",
		},
		{
			name: "options",
			summary: "Custom rendering for options. Scoped with options and name.",
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
			summary: "Emitted with the selected option value when selection changes.",
		},
	],
	methods: [
		{
			name: "triggerFocus",
			summary: "Move focus into the radio group.",
		},
	],
	examples: [],
};
