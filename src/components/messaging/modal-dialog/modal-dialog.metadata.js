// Metadata for docs and CLI consumers that need to describe or generate modal-dialog usage.
export const modalDialogMetadata = {
	name: "modal-dialog",
	category: "messaging",
	summary: "A composed dialog with title, content, actions, and close behaviour.",
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
			name: "variant",
			type: "string",
			default: "dialog",
			values: ["dialog", "alert"],
			summary:
				'Dialog variant. `alert` renders role="alertdialog" for dialogs that require an immediate response.',
		},
	],
	slots: [
		{
			name: "title",
			summary: "Dialog title content.",
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
	examples: [],
};
