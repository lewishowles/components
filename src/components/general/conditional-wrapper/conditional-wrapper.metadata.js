// Metadata for docs and CLI consumers that need to describe or generate conditional-wrapper usage.
export const conditionalWrapperMetadata = {
	name: "conditional-wrapper",
	category: "general",
	summary: "A helper that conditionally wraps slot content in a chosen element.",
	props: [
		{
			name: "wrap",
			type: "boolean",
			default: true,
			summary: "Whether to render the wrapper element.",
		},
		{
			name: "tag",
			type: "string",
			default: "div",
			summary: "Element tag to use when wrapping.",
		},
	],
	slots: [
		{
			name: "default",
			summary: "Content to wrap or render directly.",
		},
	],
	examples: [],
};
