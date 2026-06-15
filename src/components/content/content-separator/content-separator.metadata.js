// Metadata for docs and CLI consumers that need to describe or generate content-separator usage.
export const contentSeparatorMetadata = {
	name: "content-separator",
	category: "content",
	summary: "A decorative or semantic separator for content regions.",
	props: [
		{
			name: "tag",
			type: "string",
			default: "div",
			summary: "HTML element to render.",
		},
		{
			name: "orientation",
			type: "string",
			default: "horizontal",
			values: ["horizontal", "vertical"],
			summary: "Separator orientation.",
		},
	],
	examples: [],
};
