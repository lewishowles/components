// Metadata for docs and CLI consumers that need to describe or generate form-actions usage.
export const formActionsMetadata = {
	name: "form-actions",
	category: "form",
	summary: "A labelled group for form action buttons with primary and tertiary action regions.",
	slots: [
		{
			name: "default",
			summary: "Primary action buttons.",
		},
		{
			name: "label",
			summary: "Accessible label for the group, rendered visually hidden.",
		},
		{
			name: "tertiary-actions",
			summary: "Additional actions placed in a second row below the primary buttons.",
		},
	],
	examples: [],
};
