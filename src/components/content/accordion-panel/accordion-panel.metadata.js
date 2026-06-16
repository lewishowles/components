// Metadata for docs and CLI consumers that need to describe or generate accordion-panel usage.
export const accordionPanelMetadata = {
	name: "accordion-panel",
	category: "content",
	summary: "A collapsible content panel for use inside accordion-group.",
	slots: [
		{
			name: "title",
			summary: "Panel heading text.",
		},
		{
			name: "introduction",
			summary: "Introductory content shown before the body.",
		},
		{
			name: "default",
			summary: "Panel body content.",
		},
		{
			name: "show-panel-label",
			summary: "Accessible label for expanding the panel.",
		},
		{
			name: "hide-panel-label",
			summary: "Accessible label for collapsing the panel.",
		},
	],
	parts: [
		{ name: "trigger", summary: "Button that expands or collapses the panel." },
		{ name: "content", summary: "Panel content area." },
	],
	examples: [],
};
