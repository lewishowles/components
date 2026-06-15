// Metadata for docs and CLI consumers that need to describe or generate form-input-group usage.
export const formInputGroupMetadata = {
	name: "form-input-group",
	category: "form",
	summary: "A fieldset for radio or checkbox options with shared label, help, and error handling.",
	props: [
		{
			name: "type",
			type: "string",
			default: null,
			values: ["radio", "checkbox"],
			summary: "The input type rendered for each option.",
		},
		{
			name: "options",
			type: "array | object",
			required: true,
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
			name: "name",
			type: "string",
			default: null,
			summary: "Shared input name; generated from the field ID if omitted.",
		},
		{
			name: "id",
			type: "string",
			default: null,
			summary: "ID for the group; auto-generated if omitted.",
		},
		{
			name: "inline",
			type: "boolean",
			default: false,
			summary: "Display options horizontally.",
		},
		{
			name: "required",
			type: "boolean",
			default: false,
			summary: "Mark the group as required.",
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
