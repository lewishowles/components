// Metadata for docs and CLI consumers that need to describe or generate dropdown-menu usage.
export const dropdownMenuMetadata = {
	name: "dropdown-menu",
	category: "interaction",
	summary: "An accessible action menu with button trigger and keyboard navigation.",
	props: [
		{
			name: "buttonClasses",
			type: "string | array | object",
			default: "button--muted",
			summary: "Classes applied to the trigger button.",
		},
		{
			name: "detailsClasses",
			type: "string | array | object",
			default: null,
			summary: "Classes applied to the menu panel.",
		},
		{
			name: "placement",
			type: "string",
			default: "below",
			values: ["above", "below"],
			summary: "Preferred panel placement.",
		},
		{
			name: "align",
			type: "string",
			default: "start",
			values: ["start", "end"],
			summary: "Preferred panel alignment.",
		},
	],
	slots: [
		{
			name: "summary",
			summary: "Trigger content; receives open state and menu helpers.",
		},
		{
			name: "default",
			summary: "Menu items; receives open state.",
		},
	],
	events: [
		{ name: "open", summary: "Emitted when the menu opens." },
		{ name: "close", summary: "Emitted when the menu closes." },
	],
	methods: [
		{ name: "openMenu", summary: "Open the menu." },
		{ name: "closeMenu", summary: "Close the menu." },
	],
	examples: [],
};
