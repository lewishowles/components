// Metadata for docs and CLI consumers that need to describe or generate modal-dialog usage.
export const modalDialogMetadata = {
	name: "modal-dialog",
	category: "messaging",
	summary:
		"A composed dialog with an accessible name, optional title, content, actions, and close behaviour.",
	props: [
		{
			name: "initiallyOpen",
			type: "boolean",
			default: true,
			summary: "Open the dialog when it mounts.",
		},
		{
			name: "focusDialogOnOpen",
			type: "boolean",
			default: false,
			summary: "Move focus to the dialog when it opens.",
		},
		{
			name: "variant",
			type: "string",
			default: "dialog",
			values: ["dialog", "alert"],
			summary:
				'Dialog variant. `alert` renders role="alertdialog" for dialogs that require an immediate response.',
		},
		{
			name: "inert",
			type: "boolean",
			default: false,
			summary:
				"Whether this dialog is inert (disabled and not interactive). Forwarded to base-modal, for use when stacking modals via modal-controller.",
		},
	],
	slots: [
		{
			name: "title",
			summary:
				"Visible dialog title content. A title is required for proper labelling, but this slot can be omitted when the dialog has an aria-label or aria-labelledby attribute.",
		},
		{
			name: "default",
			summary: "Dialog body content.",
		},
		{
			name: "actions",
			summary: "Dialog action controls.",
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
	],
	parts: [
		{ name: "actions", summary: "Footer area containing action buttons." },
		{ name: "title", summary: "Heading area at the top of the dialog." },
	],
	examples: [],
};
