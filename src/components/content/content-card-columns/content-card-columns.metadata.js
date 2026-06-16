// Metadata for docs and CLI consumers that need to describe or generate content-card-columns usage.
export const contentCardColumnsMetadata = {
	name: "content-card-columns",
	category: "content",
	summary:
		"A companion for content-card that arranges content-card-section children as horizontal columns with vertical dividers.",
	props: [],
	slots: [{ name: "default", summary: "content-card-section children to arrange as columns." }],
	parts: [{ name: "columns", summary: "The columns region." }],
	examples: [],
};
