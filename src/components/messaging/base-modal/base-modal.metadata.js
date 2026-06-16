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
		{
			name: "dialogRole",
			type: "string",
			default: null,
			summary:
				"ARIA role override for the dialog element. Set to `alertdialog` for alert-style dialogs.",
		},
		{
			name: "ariaLabelledby",
			type: "string",
			default: null,
			summary: "ID of the element that labels this dialog, applied as aria-labelledby.",
		},
		{
			name: "ariaDescribedby",
			type: "string",
			default: null,
			summary: "ID of the element that describes this dialog, applied as aria-describedby.",
		},
		{
			name: "inert",
			type: "boolean",
			default: false,
			summary: "Make the dialog inert — visible but not interactive. Used when stacking modals.",
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
