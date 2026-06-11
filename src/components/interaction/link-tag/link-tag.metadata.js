// Metadata for docs and CLI consumers that need to describe or generate link-tag usage.
export const linkTagMetadata = {
	name: "link-tag",
	category: "interaction",
	description: "A link component with optional icons and external-link affordances.",
	props: [
		{
			name: "href",
			type: "string",
			required: true,
			description: "Destination for the link.",
		},
		{
			name: "external",
			type: "boolean",
			default: false,
			description: "Open the link in a new tab with the appropriate rel attributes.",
		},
		{
			name: "showExternalIcon",
			type: "boolean",
			default: true,
			description: "Show the external-link icon when external is true.",
		},
		{
			name: "iconStart",
			type: "string",
			default: null,
			description: "Icon to display before the link label.",
		},
		{
			name: "iconEnd",
			type: "string",
			default: null,
			description: "Icon to display after the link label.",
		},
		{
			name: "iconOnly",
			type: "boolean",
			default: false,
			description: "Visually hide the label while keeping it available to screen readers.",
		},
	],
	slots: [
		{
			name: "default",
			description: "The visible link label.",
		},
		{
			name: "external-suffix",
			description: "Screen-reader suffix appended to external links.",
			default: "(opens in new tab)",
		},
	],
	methods: [
		{
			name: "triggerFocus",
			description: "Move focus to the link.",
		},
	],
	snippetQuestions: [
		{
			name: "variant",
			label: "Link shape",
			type: "select",
			options: ["default", "external", "icon-start", "icon-end"],
		},
	],
	snippetVariants: [
		{
			name: "default",
			label: "Default link",
			description: "A standard internal link.",
			template: {
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
			description: "A link that opens in a new tab with accessible external-link text.",
			template: {
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
			description: "A link with an icon before the label.",
			template: {
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
			description: "A link with an icon after the label.",
			template: {
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
