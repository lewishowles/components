// Metadata for docs and CLI consumers that need to describe or generate copy-content usage.
export const copyContentMetadata = {
	name: "copy-content",
	category: "interaction",
	summary: "A button that copies provided text and announces success or failure.",
	props: [
		{
			name: "content",
			type: "string",
			required: true,
			summary: "Text to copy to the clipboard.",
		},
	],
	slots: [
		{ name: "default", summary: "Button label." },
		{ name: "copy-success-label", summary: "Success label shown and announced after copy." },
		{ name: "copy-error-label", summary: "Error label shown and announced if copy fails." },
	],
	examples: [],
};
