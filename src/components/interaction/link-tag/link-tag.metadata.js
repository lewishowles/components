// Metadata for docs and CLI consumers that need to describe or generate link-tag usage.
export const linkTagMetadata = {
	name: "link-tag",
	category: "interaction",
	summary: "A link component with optional icons and external-link affordances.",
	props: [
		{
			name: "href",
			type: "string",
			required: true,
			summary: "Destination for the link.",
		},
		{
			name: "external",
			type: "boolean",
			default: false,
			summary: "Open the link in a new tab with the appropriate rel attributes.",
		},
		{
			name: "showExternalIcon",
			type: "boolean",
			default: true,
			summary: "Show the external-link icon when external is true.",
		},
		{
			name: "iconStart",
			type: "string",
			default: null,
			summary: "Icon to display before the link label.",
		},
		{
			name: "iconEnd",
			type: "string",
			default: null,
			summary: "Icon to display after the link label.",
		},
		{
			name: "iconOnly",
			type: "boolean",
			default: false,
			summary: "Visually hide the label while keeping it available to screen readers.",
		},
	],
	slots: [
		{
			name: "default",
			summary: "The visible link label.",
		},
		{
			name: "external-suffix",
			summary: "Screen-reader suffix appended to external links.",
			default: "(opens in new tab)",
		},
	],
	methods: [
		{
			name: "triggerFocus",
			summary: "Move focus to the link.",
		},
	],
	examples: [
		{
			name: "default",
			label: "Default link",
			summary: "A standard internal link.",
			snippet: {
				slots: {
					default: {
						label: "Link text",
						value: "Return to the home page",
					},
				},
				props: {
					href: {
						label: "href",
						value: "/",
					},
				},
			},
		},
		{
			name: "external",
			label: "External link",
			summary: "A link that opens in a new tab with accessible external-link text.",
			snippet: {
				slots: {
					default: {
						label: "Link text",
						value: "See some projects",
					},
				},
				props: {
					href: {
						label: "href",
						value: "https://howles.dev",
					},
					external: {
						label: "External",
						type: "boolean",
						value: true,
					},
				},
			},
		},
		{
			name: "icon-start",
			label: "Start icon",
			summary: "A link with an icon before the label.",
			snippet: {
				slots: {
					default: {
						label: "Link text",
						value: "Add new user",
					},
				},
				props: {
					href: {
						label: "href",
						value: "/user/create",
					},
					iconStart: {
						label: "Start icon",
						value: "icon-plus",
					},
				},
			},
		},
		{
			name: "icon-end",
			label: "End icon",
			summary: "A link with an icon after the label.",
			snippet: {
				slots: {
					default: {
						label: "Link text",
						value: "Next step",
					},
				},
				props: {
					href: {
						label: "href",
						value: "/next",
					},
					iconEnd: {
						label: "End icon",
						value: "icon-arrow-right",
					},
				},
			},
		},
	],
};
