// Metadata for docs and CLI consumers that need to describe or generate alert-message usage.
export const alertMessageMetadata = {
	name: "alert-message",
	category: "messaging",
	summary: "A status message with optional title and icon support.",
	props: [
		{
			name: "type",
			type: "string",
			default: "info",
			values: ["success", "error", "warning", "info", "muted"],
			summary: "Visual and semantic status for the alert.",
		},
		{
			name: "showIcon",
			type: "boolean",
			default: true,
			summary: "Show the default status icon.",
		},
		{
			name: "live",
			type: "boolean",
			default: true,
			summary:
				"Render the alert as an aria-live region so assistive technology announces it automatically.",
		},
		{
			name: "titleTag",
			type: "string",
			default: "h3",
			summary: "HTML element used for the title slot.",
		},
	],
	slots: [
		{
			name: "title",
			summary: "Optional alert heading.",
		},
		{
			name: "default",
			summary: "Alert message content.",
		},
		{
			name: "icon",
			summary: "Custom icon content.",
		},
	],
	parts: [
		{ name: "icon", summary: "Icon displayed alongside the message." },
		{ name: "title", summary: "Alert message title." },
		{ name: "content", summary: "Alert message body content." },
	],
	examples: [],
};
