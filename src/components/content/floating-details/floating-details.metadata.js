// Metadata for docs and CLI consumers that need to describe or generate floating-details usage.
export const floatingDetailsMetadata = {
	name: "floating-details",
	category: "content",
	summary: "A floating disclosure panel with configurable icon and dismissal behaviour.",
	props: [
		{ name: "open", type: "boolean", default: false, summary: "Open the panel." },
		{
			name: "closeWithEscape",
			type: "boolean",
			default: true,
			summary: "Close the panel when Escape is pressed.",
		},
		{
			name: "closeWithClickOutside",
			type: "boolean",
			default: true,
			summary: "Close the panel when users click outside it.",
		},
		{ name: "iconOpen", type: "string", default: null, summary: "Icon used while open." },
		{ name: "iconClosed", type: "string", default: null, summary: "Icon used while closed." },
		{ name: "icon", type: "string", default: null, summary: "Icon used for both states." },
		{
			name: "iconStart",
			type: "boolean",
			default: false,
			summary: "Place the icon before summary content.",
		},
		{
			name: "includeIcon",
			type: "boolean",
			default: true,
			summary: "Show the state icon.",
		},
		{
			name: "iconOnly",
			type: "boolean",
			default: false,
			summary: "Visually hide summary text and show only the icon.",
		},
		{ name: "align", type: "string", default: "left", summary: "Panel alignment." },
		{ name: "placement", type: "string", default: "bottom", summary: "Panel placement." },
		{
			name: "summaryClasses",
			type: "string | array | object",
			default: null,
			summary: "Classes applied to the summary control.",
		},
		{
			name: "detailsClasses",
			type: "string | array | object",
			default: null,
			summary: "Classes applied to the details panel.",
		},
		{
			name: "iconClasses",
			type: "string | array | object",
			default: null,
			summary: "Classes applied to the icon.",
		},
	],
	slots: [
		{
			name: "summary",
			summary: "Summary control content; receives open state and toggle helpers.",
		},
		{
			name: "default",
			summary: "Panel content; receives open state and toggle helpers.",
		},
	],
	events: [
		{ name: "open", summary: "Emitted when the panel opens." },
		{ name: "close", summary: "Emitted when the panel closes." },
	],
	methods: [
		{ name: "openDetails", summary: "Open the panel." },
		{ name: "closeDetails", summary: "Close the panel." },
	],
	examples: [],
};
