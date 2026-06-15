// Metadata for docs and CLI consumers that need to describe or generate breadcrumb-item usage.
export const breadcrumbItemMetadata = {
	name: "breadcrumb-item",
	category: "navigation",
	summary: "A breadcrumb item that can render as a link or current-page marker.",
	props: [
		{
			name: "href",
			type: "string",
			default: null,
			summary: "URL for the breadcrumb link.",
		},
		{
			name: "current",
			type: "boolean",
			default: false,
			summary: "Mark this item as the current page.",
		},
	],
	slots: [
		{ name: "default", summary: "Breadcrumb label." },
		{ name: "link", summary: "Custom link content; receives the resolved href." },
	],
	examples: [],
};
