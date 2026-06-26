// Metadata for docs and CLI consumers that need to describe or generate form-wrapper usage.
export const formWrapperMetadata = {
	name: "form-wrapper",
	category: "form",
	summary: "A form container that coordinates field registration, validation, and error summaries.",
	props: [
		{
			name: "fieldErrors",
			type: "object",
			default: "{}",
			summary: "Field-level errors from an external source such as an API response.",
		},
		{
			name: "submitErrorsCallback",
			type: "function",
			default: null,
			summary: "Maps a rejected submit Promise into field or general errors.",
		},
		{
			name: "layoutClasses",
			type: "string",
			default: '""',
			summary: "Additional classes merged onto the inner form-layout.",
		},
		{
			name: "rules",
			type: "object",
			default: "{}",
			summary:
				"Form-level validation rules, keyed by field name. Each value is an array of rules in the same shape as `form-field`'s own `validation`, but run against the full form data on submit. Field-local rules run first; form-level errors map to the named field so they display beside the field and in the error summary.",
		},
		{
			name: "status",
			type: "object",
			default: null,
			summary:
				"Form-wide status feedback shown near the submit button in an accessible live region. Shape: { type: 'success' | 'error' | 'info', message: string | string[] }. Use for overall form state (success confirmation, permission errors, session expiry). For specific submission failures, use submitErrorsCallback.",
		},
		{
			name: "updatePageTitleOnError",
			type: "boolean",
			default: true,
			summary:
				"Whether failed validation prefixes document.title with pageTitleErrorPrefix. Disable for router-managed or app-level title handling.",
		},
		{
			name: "pageTitleErrorPrefix",
			type: "string",
			default: '"Error:"',
			summary: "Localisable prefix added to document.title after failed validation.",
		},
	],
	slots: [
		{
			name: "default",
			summary: "Form fields. Scoped with isSubmitting and hasErrors.",
		},
		{
			name: "submit-button-label",
			summary: "Required. Label for the submit button.",
		},
		{
			name: "pre-form",
			summary: "Content rendered above the field list.",
		},
		{
			name: "secondary-actions",
			summary: "Secondary buttons placed beside the submit button.",
		},
		{
			name: "tertiary-actions",
			summary: "Additional actions placed below the primary row.",
		},
		{
			name: "actions-label",
			summary: "Accessible label for the form actions group.",
		},
		{
			name: "submit-errors",
			summary:
				"Custom rendering for general submit errors. Scoped with errors: string[] — all general errors from submitErrorsCallback.",
		},
		{
			name: "error-summary-title",
			summary: "Title for the error summary block.",
			default: "There is a problem",
		},
	],
	events: [
		{
			name: "submit",
			summary: "Emitted when the form passes validation and the user activates the submit button.",
		},
	],
	examples: [
		{
			name: "basic-form",
			label: "Basic form",
			summary: "A form wrapper with required fields, validation, and a submit label.",
			snippet: {
				source: "./examples/basic-form.vue",
			},
		},
	],
};
