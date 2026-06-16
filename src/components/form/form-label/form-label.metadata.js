// Metadata for docs and CLI consumers that need to describe or generate form-label usage.
export const formLabelMetadata = {
	name: "form-label",
	category: "form",
	summary:
		"An accessible label for a form element, with built-in warnings when a label or input ID is missing.",
	props: [
		{
			name: "tag",
			type: "string",
			default: "label",
			summary: "HTML element to render. Use `legend` when labelling a fieldset.",
		},
		{
			name: "id",
			type: "string",
			default: null,
			summary: "ID of the associated input. Required when tag is `label`.",
		},
		{
			name: "required",
			type: "boolean",
			default: false,
			summary: "When false, the label is augmented with an optional indicator.",
		},
		{
			name: "hidden",
			type: "boolean",
			default: false,
			summary: "Visually hide the label while keeping it available to screen readers.",
		},
		{
			name: "styled",
			type: "boolean",
			default: true,
			summary: "Apply default label typography styles.",
		},
	],
	slots: [
		{
			name: "default",
			summary: "The visible label text.",
		},
	],
	examples: [],
};
