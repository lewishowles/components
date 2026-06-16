// Metadata for docs and CLI consumers that need to describe or generate base-icon usage.
export const baseIconMetadata = {
	name: "base-icon",
	category: "icon",
	summary: "An SVG wrapper that provides consistent stroke settings for icon components.",
	props: [
		{
			name: "viewBox",
			type: "string",
			default: "0 0 18 18",
			summary: "The SVG viewBox attribute.",
		},
	],
	slots: [
		{
			name: "default",
			summary: "SVG path content for the icon.",
		},
	],
	examples: [],
};
