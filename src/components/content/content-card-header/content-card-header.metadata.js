// Metadata for docs and CLI consumers that need to describe or generate content-card-header usage.
export const contentCardHeaderMetadata = {
	name: "content-card-header",
	category: "content",
	summary: "A companion header for content-card, with title, icon, and additional header slots.",
	props: [
		{
			name: "headingLevel",
			type: "string",
			default: "h2",
			summary: "Heading level used for the title slot.",
		},
		{
			name: "iconClasses",
			type: "string | array | object",
			default: "text-primary",
			summary: "Classes applied to the icon wrapper.",
		},
	],
	slots: [
		{ name: "title", summary: "Card title." },
		{ name: "icon", summary: "Icon shown before the title." },
		{ name: "additional", summary: "Additional content at the end of the header." },
		{ name: "header", summary: "Full custom header content, replacing the default layout." },
	],
	parts: [{ name: "header", summary: "The header region." }],
	examples: [],
};
