// Metadata for docs and CLI consumers that need to describe or generate loading-indicator usage.
export const loadingIndicatorMetadata = {
	name: "loading-indicator",
	category: "content",
	summary: "An inline loading state with spinner and accessible label text.",
	props: [
		{
			name: "large",
			type: "boolean",
			default: false,
			summary: "Use the large indicator size.",
		},
		{
			name: "spinnerClasses",
			type: "string | array | object",
			default: null,
			summary: "Classes applied to the spinner.",
		},
	],
	slots: [
		{
			name: "default",
			summary: "Loading label text.",
		},
	],
	examples: [],
};
