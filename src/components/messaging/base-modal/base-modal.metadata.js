// Metadata for docs and CLI consumers that need to describe or generate base-modal usage.
export const baseModalMetadata = {
	name: "base-modal",
	category: "messaging",
	summary: "A low-level dialog wrapper with focus handling and close controls.",
	props: [
		{
			name: "initiallyOpen",
			type: "boolean",
			default: false,
			summary: "Open the dialog when it mounts.",
		},
		{
			name: "focusDialogOnOpen",
			type: "boolean",
			default: true,
			summary: "Move focus to the dialog when it opens.",
		},
	],
	slots: [
		{
			name: "default",
			summary: "Dialog content; receives open state and close helpers.",
		},
		{
			name: "close-dialog-label",
			summary: "Accessible label for the close button.",
		},
	],
	events: [
		{
			name: "dialog:close",
			summary: "Emitted when the dialog closes.",
		},
	],
	methods: [
		{
			name: "open",
			summary: "Open the dialog.",
		},
		{
			name: "close",
			summary: "Close the dialog.",
		},
		{
			name: "isOpen",
			summary: "Return whether the dialog is currently open.",
		},
	],
	examples: [],
};
