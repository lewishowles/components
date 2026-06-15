// Metadata for docs and CLI consumers that need to describe or generate image-tag usage.
export const imageTagMetadata = {
	name: "image-tag",
	category: "display",
	summary: "An image with a fallback slot when the source is missing or fails to load.",
	props: [
		{
			name: "src",
			type: "string",
			default: null,
			summary: "Image source URL.",
		},
	],
	slots: [
		{
			name: "fallback",
			summary: "Fallback content shown when the image cannot render.",
		},
	],
	events: [
		{
			name: "error",
			summary: "Emitted when the image fails to load.",
		},
	],
	examples: [],
};
