// Metadata for docs and CLI consumers that need to describe or generate flash-messages usage.
export const flashMessagesMetadata = {
	name: "flash-messages",
	category: "content",
	summary: "A namespaced list of transient messages from useFlashMessages.",
	props: [
		{
			name: "namespace",
			type: "string",
			default: "default",
			summary: "Flash-message namespace to display.",
		},
	],
	slots: [
		{
			name: "default",
			summary: "Custom message content.",
		},
		{
			name: "icon",
			summary: "Custom icon content.",
		},
	],
	examples: [],
};
