// Metadata for docs and CLI consumers that need to describe or generate content-card usage.
export const contentCardMetadata = {
	name: "content-card",
	category: "content",
	summary: "A structured card with header, body, and footer regions.",
	props: [
		{
			name: "headingLevel",
			type: "number",
			default: 2,
			summary: "Heading level used for the title slot.",
		},
		{
			name: "footerClasses",
			type: "string | array | object",
			default: null,
			summary: "Classes applied to the footer region.",
		},
		{
			name: "iconClasses",
			type: "string | array | object",
			default: null,
			summary: "Classes applied to the icon region.",
		},
	],
	slots: [
		{
			name: "title",
			summary: "Card title.",
		},
		{
			name: "icon",
			summary: "Icon shown in the header.",
		},
		{
			name: "header-additional",
			summary: "Additional header content.",
		},
		{
			name: "header",
			summary: "Full custom header content.",
		},
		{
			name: "default",
			summary: "Card body content.",
		},
		{
			name: "footer",
			summary: "Footer content.",
		},
	],
	parts: [
		{ name: "header", summary: "Card header area." },
		{ name: "body", summary: "Card body content area." },
		{ name: "footer", summary: "Card footer area." },
	],
	examples: [],
};
