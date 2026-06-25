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
				"form-button-group",
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
			summary:
				"Validation rules applied on submit. Each entry is either { rule, message?, ...ruleOptions } or a function (value, formData) returning true for valid, false or a string for invalid.",
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
				"Whether this field is required. Also set automatically when a required validation rule is present, but the prop allows explicit control.",
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
			name: "prefix",
			summary: "Content placed before the input.",
		},
		{
			name: "suffix",
			summary: "Content placed after the input.",
		},
		{
			name: "options",
			summary: "Options for select, radio-group, checkbox-group, and form-button-group controls.",
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
			name: "minimal",
			label: "Minimal text field",
			summary: "A text field with only a label, name, and type — the smallest valid usage.",
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
			label: "Email field with validation",
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
						value:
							"[{ rule: 'required', message: 'Enter your email address.' }, { rule: 'email', message: 'Enter a valid email address.' }]",
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
		{
			name: "select",
			label: "Select field with options",
			summary: "A select field using the options slot to provide choices.",
			snippet: {
				slots: {
					default: {
						label: "Field label",
						value: "Country",
					},
					options: {
						label: "Options",
						value:
							'<option value="gb">United Kingdom</option>\n<option value="us">United States</option>\n<option value="ca">Canada</option>',
					},
				},
				props: {
					name: {
						label: "Field name",
						value: "country",
						isInline: true,
					},
					type: {
						label: "Field type",
						value: "select",
						isInline: true,
					},
				},
			},
		},
		{
			name: "radio-group",
			label: "Radio group field with options",
			summary: "A radio-group field using the options slot to provide labelled choices.",
			snippet: {
				slots: {
					default: {
						label: "Field label",
						value: "Preferred contact method",
					},
					options: {
						label: "Options",
						value:
							'<form-radio value="email">Email</form-radio>\n<form-radio value="phone">Phone</form-radio>',
					},
				},
				props: {
					name: {
						label: "Field name",
						value: "contact_method",
						isInline: true,
					},
					type: {
						label: "Field type",
						value: "radio-group",
						isInline: true,
					},
				},
			},
		},
	],
};
