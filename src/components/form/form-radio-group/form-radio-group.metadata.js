// Metadata for docs and CLI consumers that need to describe or generate form-radio-group usage.
export const formRadioGroupMetadata = {
	name: "form-radio-group",
	category: "form",
	summary:
		"A radio group that exposes a single selected value while reusing form-input-group layout.",
	props: [
		{
			name: "id",
			type: "string",
			default: null,
			summary: "ID for the radio group; auto-generated if omitted.",
		},
		{
			name: "modelValue",
			type: "string | number",
			default: null,
			summary: "Selected option value.",
		},
		{
			name: "required",
			type: "boolean",
			default: false,
			summary:
				"Whether this field is required. Also set automatically when a required rule for this field is present in the parent form-wrapper's rules, but the prop allows explicit control.",
		},
		{
			name: "name",
			type: "string",
			default: null,
			summary: "A name for this radio group. If not set, the input ID is used.",
		},
		{
			name: "descriptionKey",
			type: "string",
			default: "description",
			summary: "Object key used for optional descriptions associated with each option.",
		},
		{
			name: "variant",
			type: "string",
			default: null,
			values: ["card"],
			summary: "Apply a card treatment to each option.",
		},
		{
			name: "optionClasses",
			type: "string | array | object",
			default: null,
			summary: "Additional classes to merge onto the options wrapper around option rows.",
		},
		{
			name: "optionsClasses",
			type: "string | array | object",
			default: null,
			summary: "Additional classes to merge onto the options wrapper around every option row.",
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
			name: "option",
			summary: "Custom content for one option. Scoped with option, selected, id, and name.",
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
