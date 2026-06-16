// Metadata for docs and CLI consumers that need to describe or generate none-found usage.
export const noneFoundMetadata = {
	name: "none-found",
	category: "content",
	summary: "An empty-state message with optional title and action region.",
	props: [
		{
			name: "headingLevel",
			type: "number",
			default: 2,
			summary: "Heading level used for the title.",
		},
		{
			name: "titleClasses",
			type: "string | array | object",
			default: null,
			summary: "Classes applied to the title.",
		},
	],
	slots: [
		{ name: "title", summary: "Empty-state title." },
		{ name: "default", summary: "Empty-state body content." },
		{ name: "actions", summary: "Optional action controls." },
	],
	parts: [
		{ name: "title", summary: "Heading displayed when no results are found." },
		{ name: "actions", summary: "Container for action controls." },
	],
	examples: [],
};
