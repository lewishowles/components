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
				"file",
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
			name: "inputAttributes",
			type: "object",
			default: null,
			summary: "Additional attributes forwarded to the underlying input, such as autocomplete.",
		},
		{
			name: "required",
			type: "boolean",
			default: false,
			summary:
				"Whether this field is required. Also set automatically when a required rule for this field is present in the parent form-wrapper's rules, but the prop allows explicit control.",
		},
		{
			name: "multiple",
			type: "boolean",
			default: false,
			summary: "Allow multiple files when type is file; returns an array from v-model.",
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
			name: "option",
			summary: "Custom content for one option. Scoped with option, selected, id, and name.",
		},
		{
			name: "description",
			summary:
				"Supporting text shown beneath a checkbox label, or custom option descriptions for checkbox and radio groups.",
		},
		{
			name: "empty-option-label",
			summary: "Content for a select field's empty option. Defaults to the field label.",
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
			summary: "Custom error content; overrides default validation messages.",
		},
		{
			name: "help",
			summary: "Help text shown below the input.",
		},
		{
			name: "remove-button-label",
			summary: "File remove button content; receives the current files array.",
		},
	],
	examples: [
		{
			name: "minimal",
			label: "Minimal text field",
			summary: "A text field with only a label, name, and type: the smallest valid usage.",
			snippet: {
				slots: {
					default: {
						label: "Field label",
						value: "Username",
					},
				},
				props: {
					name: {
						label: "Field name",
						value: "username",
						isInline: true,
					},
					type: {
						label: "Field type",
						value: "text",
						isInline: true,
					},
				},
			},
		},
		{
			name: "email",
			label: "Required email field",
			summary: "A required email field. Validation rules live on the parent form-wrapper.",
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
					required: {
						label: "Required",
						value: true,
						type: "boolean",
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
		{
			name: "help-text",
			label: "Field with help text",
			summary: "A text field with a help slot providing additional context beneath the input.",
			snippet: {
				slots: {
					default: {
						label: "Field label",
						value: "Username",
					},
					help: {
						label: "Help text",
						value: "Your username must be unique and cannot be changed later.",
					},
				},
				props: {
					name: {
						label: "Field name",
						value: "username",
						isInline: true,
					},
				},
			},
		},
		{
			name: "prefix-suffix",
			label: "Field with prefix and suffix",
			summary: "A text field using prefix and suffix slots for inline adornments.",
			snippet: {
				slots: {
					default: {
						label: "Field label",
						value: "Website",
					},
					prefix: {
						label: "Prefix",
						value: "https://",
					},
					suffix: {
						label: "Suffix",
						value: ".com",
					},
				},
				props: {
					name: {
						label: "Field name",
						value: "website",
						isInline: true,
					},
				},
			},
		},
	],
};
