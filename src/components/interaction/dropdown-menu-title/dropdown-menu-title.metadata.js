// Metadata for docs and CLI consumers that need to describe or generate dropdown-menu-title usage.
export const dropdownMenuTitleMetadata = {
	name: "dropdown-menu-title",
	category: "interaction",
	summary: "A heading for grouped dropdown-menu items.",
	props: [
		{
			name: "headingLevel",
			type: "string",
			default: "h4",
			summary: "Heading tag to render.",
		},
	],
	slots: [
		{
			name: "default",
			summary: "Menu section title.",
		},
	],
	examples: [],
};
