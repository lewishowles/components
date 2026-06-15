// Metadata for docs and CLI consumers that need to describe or generate breadcrumb-list usage.
export const breadcrumbListMetadata = {
	name: "breadcrumb-list",
	category: "navigation",
	summary: "A labelled breadcrumb navigation list.",
	props: [
		{
			name: "label",
			type: "string",
			default: "Breadcrumb",
			summary: "Accessible label for the breadcrumb navigation.",
		},
	],
	slots: [
		{
			name: "default",
			summary: "Breadcrumb items.",
		},
	],
	examples: [],
};
