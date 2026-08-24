// Metadata for docs and CLI consumers that need to describe or generate summary-details usage.
export const summaryDetailsMetadata = {
	name: "summary-details",
	category: "content",
	summary: "A disclosure component built on the native details element.",
	props: [
		{ name: "open", type: "boolean", default: false, summary: "Open the details content." },
		{
			name: "autofocus",
			type: "boolean",
			default: false,
			summary: "Move focus into the content when it opens.",
		},
		{
			name: "toggletip",
			type: "boolean",
			default: false,
			summary: "Announce concise, non-interactive supplementary content when opened.",
		},
		{
			name: "closeWithEscape",
			type: "boolean",
			default: true,
			summary: "Close when Escape is pressed.",
		},
		{
			name: "iconOpen",
			type: "string",
			default: "icon-chevron-up",
			summary: "Icon used while open.",
		},
		{
			name: "iconClosed",
			type: "string",
			default: "icon-chevron-down",
			summary: "Icon used while closed.",
		},
		{ name: "icon", type: "string", default: null, summary: "Icon used for both states." },
		{
			name: "iconAtStart",
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
			summary: "Classes applied to the details content.",
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
			required: true,
			summary: "Summary control content; receives open state and toggle helpers.",
		},
		{
			name: "default",
			summary: "Details content; receives open state and toggle helpers.",
		},
	],
	events: [
		{ name: "open", summary: "Emitted when the details content opens." },
		{ name: "close", summary: "Emitted when the details content closes." },
	],
	methods: [
		{ name: "openDetails", summary: "Open the details content." },
		{ name: "closeDetails", summary: "Close the details content." },
		{ name: "toggleDetails", summary: "Toggle the details content." },
	],
	parts: [
		{ name: "summary", summary: "Summary control that triggers the disclosure." },
		{ name: "content", summary: "Disclosure content panel." },
	],
	examples: [],
};
