// Metadata for docs and CLI consumers that need to describe or generate form-field usage.
export const formFieldMetadata = {
	name: "form-field",
	category: "form",
	summary:
		"A smart field wrapper that selects the right control by type and wires it into the parent form.",
	props: [
		{
			name: "type",
			type: "string",
			default: "text",
			values: [
				"text",
				"email",
				"password",
				"textarea",
				"checkbox",
				"checkbox-group",
				"radio-group",
				"button-group",
				"select",
				"date",
			],
			summary: "The control to render.",
		},
		{
			name: "name",
			type: "string",
			required: true,
			summary: "Field name used as the form data key. Must be unique within a form-wrapper.",
		},
		{
			name: "validation",
			type: "array",
			default: "[]",
			summary: "Validation rules applied on submit.",
		},
		{
			name: "inputAttributes",
			type: "object",
			default: null,
			summary: "Additional attributes forwarded to the underlying input, such as autocomplete.",
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
			name: "options",
			summary: "Options for select, radio-group, and checkbox-group controls.",
		},
		{
			name: "error",
			summary: "Custom error content; overrides default validation messages.",
		},
		{
			name: "help",
			summary: "Help text shown below the input.",
		},
	],
	examples: [
		{
			name: "email",
			label: "Email field",
			summary: "A required email field wired into a form-wrapper.",
			snippet: {
				slots: {
					default: {
						label: "Field label",
						value: "Email address",
					},
				},
				props: {
					name: {
						label: "Field name",
						value: "email",
						isInline: true,
					},
					type: {
						label: "Field type",
						value: "email",
						isInline: true,
					},
					validation: {
						label: "Validation rules",
						value: "[{ type: 'required' }, { type: 'email' }]",
					},
				},
			},
		},
		{
			name: "textarea",
			label: "Textarea field",
			summary: "A textarea field selected by type.",
			snippet: {
				slots: {
					default: {
						label: "Field label",
						value: "Message",
					},
				},
				props: {
					name: {
						label: "Field name",
						value: "message",
						isInline: true,
					},
					type: {
						label: "Field type",
						value: "textarea",
						isInline: true,
					},
				},
			},
		},
	],
};
