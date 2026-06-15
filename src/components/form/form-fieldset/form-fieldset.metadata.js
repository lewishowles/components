// Metadata for docs and CLI consumers that need to describe or generate form-fieldset usage.
export const formFieldsetMetadata = {
	name: "form-fieldset",
	category: "form",
	summary: "A section wrapper for grouping related form fields under a heading.",
	props: [
		{
			name: "headingLevel",
			type: "string",
			default: "h2",
			summary: "Heading tag used for the section title.",
		},
	],
	slots: [
		{
			name: "title",
			summary: "The section heading.",
		},
		{
			name: "introduction",
			summary: "Introductory content shown below the heading.",
		},
		{
			name: "default",
			summary: "Grouped form fields.",
		},
	],
	examples: [],
};
