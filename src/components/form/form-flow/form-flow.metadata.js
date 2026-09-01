// Metadata for docs and CLI consumers that need to describe or generate form-flow usage.
export const formFlowMetadata = {
	name: "form-flow",
	category: "form",
	summary:
		"A multi-screen form that keeps one model and validates the visible screen before continuing.",
	parts: [
		{
			name: "progress",
			summary: "Container for the default progress display, or replaced progress slot content.",
		},
		{
			name: "review",
			summary: "Container for the optional answer review shown before final submission.",
		},
		{
			name: "review-title",
			summary: "Heading for the optional answer review destination.",
		},
		{
			name: "review-screen",
			summary: "Container for one screen in the answer review.",
		},
		{
			name: "review-screen-title",
			summary: "Heading for one screen in the answer review.",
		},
	],
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
			name: "onSuccess",
			type: "function",
			default: null,
			summary: "Runs after a successful final submit.",
		},
		{
			name: "onError",
			type: "function",
			default: null,
			summary: "Runs when final submission fails.",
		},
		{
			name: "onSettled",
			type: "function",
			default: null,
			summary: "Runs after every final submit attempt.",
		},
		{
			name: "rules",
			type: "object",
			default: "{}",
			summary: "Form-level rules run against the complete form data.",
		},
		{
			name: "schema",
			type: "object",
			default: null,
			summary:
				"A whole-object Standard Schema run against the complete form data. On final submission, errors on another visible screen route to the first visible screen with an error; root-level errors, and errors belonging to a screen that is no longer registered, render in the flow-level summary.",
		},
		{
			name: "status",
			type: "object",
			default: null,
			summary: "Form-wide status feedback displayed in the form actions region.",
		},
		{
			name: "layoutClasses",
			type: "string",
			default: '""',
			summary: "Additional classes merged onto the inner form-layout.",
		},
		{
			name: "enableReview",
			type: "boolean",
			default: false,
			summary: "Whether to show an answer review destination before final submission.",
		},
		{
			name: "modelValue",
			type: "object",
			default: "{}",
			summary: "Form values, seeded once from the initial value and updated through v-model.",
		},
		{
			name: "updatePageTitleOnError",
			type: "boolean",
			default: true,
			summary: "Whether failed validation prefixes document.title.",
		},
		{
			name: "pageTitleErrorPrefix",
			type: "string",
			default: '"Error:"',
			summary: "Prefix added to document.title after failed validation.",
		},
		{
			name: "readonly",
			type: "boolean",
			default: false,
			summary: "Whether child form fields are readonly.",
		},
		{
			name: "unsavedChangesGuard",
			type: "boolean",
			default: true,
			summary: "Whether dirty state guards against losing unsaved changes.",
		},
		{
			name: "compact",
			type: "boolean",
			default: false,
			summary: "Whether child form fields use compact spacing.",
		},
		{
			name: "fieldTypes",
			type: "object",
			default: "{}",
			summary: "Field type transformations applied to seeded and submitted values.",
		},
		{
			name: "initialData",
			type: "object | function",
			default: null,
			summary: "Object or getter used to seed the form.",
		},
		{
			name: "recordId",
			type: "string | number",
			default: null,
			summary: "Stable identifier used when reseeding the form for another record.",
		},
	],
	slots: [
		{
			name: "default",
			summary: "Form-screen components plus other content, scoped with isSubmitting and hasErrors.",
		},
		{
			name: "empty",
			summary:
				"Message shown when all screens are removed and no screen is available. Defaults to No screens are available.",
		},
		{ name: "back-label", summary: "Label for the Back button. Defaults to Go back." },
		{
			name: "continue-label",
			summary: "Label for Continue before the final screen and for opening the review.",
		},
		{
			name: "actions-label",
			summary: "Accessible label for the form actions group.",
		},
		{
			name: "secondary-actions",
			summary: "Secondary buttons placed beside the flow actions.",
		},
		{
			name: "tertiary-actions",
			summary: "Additional actions placed below the primary action row.",
		},
		{
			name: "submit-button-label",
			summary:
				"Required label for the final screen submit button. Choose a meaningful action rather than a generic label.",
		},
		{
			name: "submit-errors",
			summary:
				"Custom rendering for parsed submit errors without a matching field, plus root-level rule and schema errors.",
		},
		{ name: "error-summary-title", summary: "Title for the validation error summary." },
		{
			name: "progress",
			summary:
				"Replaces the numeric step-indicator progress display. Scoped with current, completed, and remaining screen labels.",
		},
	],
	events: [
		{
			name: "screen-change",
			summary:
				"Emitted after navigation with { sourceId, destinationId, direction, reason }; conditional-screen-recovery means the active conditional screen disappeared and the flow moved to the next or previous visible screen, final-error-recovery means final validation found an error on another visible screen and the flow moved to it, and review means a review Change button moved to a different screen.",
		},
		{ name: "update:modelValue", summary: "Emitted when the form model changes." },
		{ name: "submit", summary: "Emitted with submit-ready data after final validation passes." },
	],
	methods: [
		{ name: "isSubmitting", summary: "Whether final submission is in progress." },
		{ name: "isDirty", summary: "Whether the form values differ from their initial state." },
		{ name: "resetSubmitButton", summary: "Reset the final submit button's loading state." },
		{
			name: "setValue",
			summary: "Set a field value without changing completion or automatically advancing.",
		},
	],
	examples: [
		{
			name: "application",
			label: "Two-step application",
			summary:
				"A two-screen application with seeded contact details, validation, and a submit handler.",
			snippet: {
				props: {
					initialData: {
						label: "Initial application data",
						value: "initialData",
						isVariable: true,
					},
					rules: {
						label: "Validation rules",
						value: "rules",
						isVariable: true,
					},
				},
				events: {
					submit: {
						label: "Submit handler",
						value: "submitApplication",
					},
				},
				slots: {
					default: {
						label: "Screens",
						value:
							'<form-screen id="contact">\n  <template #title>Your contact details</template>\n</form-screen>\n\n<form-screen id="application">\n  <template #title>Your application</template>\n</form-screen>',
					},
				},
			},
		},
		{
			name: "review",
			label: "Application with review",
			summary: "A two-screen application that shows the answer review before final submission.",
			snippet: {
				props: {
					enableReview: {
						label: "Enable review",
						value: true,
						type: "boolean",
					},
				},
				slots: {
					default: {
						label: "Screens",
						value:
							'<form-screen id="contact">\n  <template #title>Your contact details</template>\n</form-screen>\n\n<form-screen id="application">\n  <template #title>Your application</template>\n</form-screen>',
					},
				},
			},
		},
	],
};
