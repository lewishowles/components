// Metadata for docs and CLI consumers that need to describe or generate modal-dialog-title usage.
export const modalDialogTitleMetadata = {
	name: "modal-dialog-title",
	category: "messaging",
	summary: "A heading wrapper for modal dialog titles.",
	props: [
		{
			name: "tag",
			type: "string",
			default: "h2",
			summary: "HTML heading tag to render.",
		},
	],
	slots: [
		{
			name: "default",
			summary: "Dialog title text.",
		},
	],
	examples: [],
};
