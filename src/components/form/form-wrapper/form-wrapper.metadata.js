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
			summary: "Custom rendering for general submit errors.",
		},
		{
			name: "messages",
			summary: "Arbitrary status messages rendered in the actions area.",
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
	examples: [],
};
