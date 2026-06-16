// Metadata for docs and CLI consumers that need to describe or generate content-card usage.
export const contentCardMetadata = {
	name: "content-card",
	category: "content",
	summary:
		"A structured card built from companion components: content-card-header, content-card-section, and content-card-footer.",
	props: [],
	slots: [
		{
			name: "default",
			summary: "Card contents, composed from companion components.",
		},
	],
	parts: [],
	companions: [
		{
			name: "content-card-header",
			summary: "Header region with title, icon, and additional slots.",
		},
		{
			name: "content-card-section",
			summary: "A bordered body section. Multiple sections stack automatically.",
		},
		{ name: "content-card-footer", summary: "Footer region." },
	],
	examples: [],
};
