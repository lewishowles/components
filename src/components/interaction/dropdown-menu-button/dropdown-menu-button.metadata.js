// Metadata for docs and CLI consumers that need to describe or generate dropdown-menu-button usage.
export const dropdownMenuButtonMetadata = {
	name: "dropdown-menu-button",
	category: "interaction",
	summary: "A styled button item for dropdown-menu.",
	props: [
		{
			name: "icon",
			type: "string",
			default: null,
			summary: "Icon shown at the start of the menu item.",
		},
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
