// Metadata for docs and CLI consumers that need to describe or generate form-textarea usage.
export const formTextareaMetadata = {
	name: "form-textarea",
	category: "form",
	summary:
		"A textarea with accessible labelling, help text, errors, and forwarded input attributes.",
	props: [
		{
			name: "id",
			type: "string",
			default: null,
			summary: "ID for the textarea; auto-generated if omitted.",
		},
		{
			name: "placeholder",
			type: "string",
			default: null,
			summary: "Placeholder text — do not use for critical information.",
		},
		{
			name: "inputAttributes",
			type: "object",
			default: null,
			summary: "Additional attributes forwarded to the textarea.",
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
			name: "introduction",
			summary: "Introductory text shown above the textarea.",
		},
		{
			name: "error",
			summary: "Custom error content.",
		},
		{
			name: "help",
			summary: "Help text shown below the textarea.",
		},
	],
	methods: [
		{
			name: "triggerFocus",
			summary: "Move focus to the textarea.",
		},
	],
	examples: [
		{
			name: "default",
			label: "Default textarea",
			summary: "A labelled textarea.",
			snippet: {
				slots: {
					default: {
						label: "Field label",
						value: "Message",
					},
				},
				props: {
					placeholder: {
						label: "Placeholder",
						value: "How can we help?",
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
	],
};
