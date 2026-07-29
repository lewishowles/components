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
			name: "schema",
			type: "object",
			default: null,
			summary:
				"A whole-object Standard Schema (e.g. Zod, Valibot) validated against the full form data, in addition to rules. Both run together and merge into one per-field result, schema errors first. A whole-object schema can't express cross-field constraints (same, required_if, different, custom); use rules for those.",
		},
		{
			name: "status",
			type: "object",
			default: null,
			summary:
				"Form-wide status feedback shown near the submit button in an accessible live region. Shape: { type: 'success' | 'error' | 'info', message: string | string[] }. Defaults to useForm's own submit-lifecycle status, so most forms need not set this. Pass a value to override with app-driven state (permission errors, session expiry): it takes precedence until cleared. For specific submission failures, use submitErrorsCallback.",
		},
		{
			name: "onSuccess",
			type: "function",
			default: null,
			summary:
				"Called with onSubmit's resolved return value and the submitted form data once a submit succeeds. Use for app-level side effects such as a flash message, closing a modal, or navigating away.",
		},
		{
			name: "onError",
			type: "function",
			default: null,
			summary:
				"Called with onSubmit's rejection error and the submitted form data when a submit fails, before submitErrorsCallback decides whether to swallow the error.",
		},
		{
			name: "onSettled",
			type: "function",
			default: null,
			summary:
				"Called with the submit result, error, and submitted form data after every submit attempt, regardless of outcome.",
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
		{
			name: "readonly",
			type: "boolean",
			default: false,
			summary:
				"When true, all child form-field components become readonly. Use for review-mode or read-only forms.",
		},
		{
			name: "unsavedChangesGuard",
			type: "boolean",
			default: true,
			summary:
				"Whether this form guards against losing unsaved changes: warns on tab close/refresh while dirty, and contributes to the shared dirty-form count that installUnsavedChangesGuard's router guard checks. Set to false for trivial forms where the guard would be unwanted noise.",
		},
		{
			name: "compact",
			type: "boolean",
			default: false,
			summary:
				"When true, reduces vertical spacing in the form. Cascades automatically to form-layout and form-fieldset; no prop needed on child components.",
		},
		{
			name: "fieldTypes",
			type: "object",
			default: "{}",
			summary:
				"Field type transformations applied to initial and submitted form data, keyed by field name. Each value is one of 'nullable-number' or 'nullable-string'.",
		},
		{
			name: "initialData",
			type: "object | function",
			default: null,
			summary:
				"An object or getter used to seed this form once it resolves. When omitted, modelValue remains the seed source.",
		},
		{
			name: "recordId",
			type: "string | number",
			default: null,
			summary:
				"The stable identifier for the record that identifies the contents of this form. When the record ID changes to a new truthy value, a clean form waits for `initialData` to resolve and reseeds. A dirty form keeps its edits until they are saved or discarded.",
		},
	],
	slots: [
		{
			name: "pre-form",
			summary: "Content rendered above the form fields and outside the form-layout wrapper.",
		},
		{
			name: "default",
			summary: "Form fields. Scoped with isSubmitting and hasErrors.",
		},
		{
			name: "submit-button-label",
			summary: "Required. Label for the submit button.",
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
				"Custom rendering for general submit errors. Scoped with errors: string[]; all general errors from submitErrorsCallback.",
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
