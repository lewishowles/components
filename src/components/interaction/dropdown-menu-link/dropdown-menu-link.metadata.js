// Metadata for docs and CLI consumers that need to describe or generate dropdown-menu-link usage.
export const dropdownMenuLinkMetadata = {
	name: "dropdown-menu-link",
	category: "interaction",
	summary: "A styled link item for dropdown-menu.",
	props: [
		{
			name: "selected",
			type: "boolean",
			default: false,
			summary: "Show the selected state.",
		},
	],
	slots: [
		{
			name: "default",
			summary: "Menu item label.",
		},
	],
	examples: [],
};
