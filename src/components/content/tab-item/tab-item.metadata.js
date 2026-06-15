// Metadata for docs and CLI consumers that need to describe or generate tab-item usage.
export const tabItemMetadata = {
	name: "tab-item",
	category: "content",
	summary: "A single tab and panel for use inside tab-group.",
	props: [
		{
			name: "id",
			type: "string",
			default: null,
			summary: "Stable ID for the tab item; auto-generated if omitted.",
		},
		{
			name: "initiallyActive",
			type: "boolean",
			default: false,
			summary: "Select this tab when the group mounts.",
		},
		{
			name: "icon",
			type: "string",
			default: null,
			summary: "Icon shown in the tab label.",
		},
	],
	slots: [
		{ name: "default", summary: "Tab panel content." },
		{ name: "label", summary: "Tab label content." },
	],
	methods: [
		{
			name: "select",
			summary: "Select this tab.",
		},
	],
	examples: [],
};
