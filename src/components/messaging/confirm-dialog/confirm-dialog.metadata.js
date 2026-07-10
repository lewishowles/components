// Metadata for docs and CLI consumers that need to describe or generate confirm-dialog usage.
export const confirmDialogMetadata = {
	name: "confirm-dialog",
	category: "messaging",
	summary: "A modal-dialog built for confirm/cancel decisions, such as destructive actions.",
	props: [
		{
			name: "danger",
			type: "boolean",
			default: false,
			summary: "Whether the confirm action is destructive, styling the confirm button to match.",
		},
		{
			name: "onConfirm",
			type: "function",
			default: null,
			summary: "Called when the confirm action is chosen.",
		},
		{
			name: "onClose",
			type: "function",
			default: null,
			summary: "Called when this dialog closes for any reason.",
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
			name: "confirm-button-label",
			summary: 'Confirm button label content. Defaults to "Confirm".',
		},
		{
			name: "cancel-button-label",
			summary: 'Cancel button label content. Defaults to "Cancel".',
		},
	],
	examples: [],
};
