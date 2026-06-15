// Metadata for docs and CLI consumers that need to describe or generate accordion-group usage.
export const accordionGroupMetadata = {
	name: "accordion-group",
	category: "content",
	summary: "A grouped accordion with optional show-all and hide-all controls.",
	props: [
		{
			name: "headingLevel",
			type: "number",
			default: 2,
			summary: "Heading level used by child accordion panels.",
		},
	],
	slots: [
		{
			name: "default",
			summary: "Accordion panels.",
		},
		{
			name: "show-all-panels-label",
			summary: "Label for the show-all control.",
		},
		{
			name: "hide-all-panels-label",
			summary: "Label for the hide-all control.",
		},
	],
	examples: [],
};
