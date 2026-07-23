// Metadata for docs and CLI consumers that need to describe or generate overlay-sheet usage.
export const overlaySheetMetadata = {
	name: "overlay-sheet",
	category: "messaging",
	summary:
		"A low-level overlay that switches content between inline and native sheet presentations.",
	props: [
		{
			name: "isOpen",
			type: "boolean",
			required: true,
			summary: "Whether the owning component considers the surface open.",
		},
		{
			name: "isSheet",
			type: "boolean",
			required: true,
			summary: "Whether to use the native dialog sheet presentation.",
		},
		{
			name: "label",
			type: "string",
			required: true,
			summary: "Accessible name for the sheet dialog.",
		},
		{
			name: "closeWithEscape",
			type: "boolean",
			default: true,
			summary: "Request dismissal when Escape is pressed.",
		},
	],
	slots: [
		{
			name: "default",
			summary: "Overlay content.",
		},
		{
			name: "close-dialog-label",
			summary: "Accessible label for the close button. Defaults to `Close dialog`.",
		},
	],
	events: [
		{
			name: "dismiss",
			summary: "Requests that the owning component dismiss the surface.",
		},
	],
	methods: [],
	parts: [
		{ name: "sheet", summary: "Native dialog containing the sheet content." },
		{ name: "close-button", summary: "Button that requests sheet dismissal." },
	],
	examples: [],
};
