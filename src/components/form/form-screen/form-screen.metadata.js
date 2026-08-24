// Metadata for docs and CLI consumers that need to describe or generate form-screen usage.
export const formScreenMetadata = {
	name: "form-screen",
	category: "form",
	summary: "A registered content boundary that displays one screen in a form-flow.",
	parts: [{ name: "title", summary: "The screen's title heading, rendered from the title slot." }],
	props: [
		{
			name: "id",
			type: "string",
			required: true,
			summary: "Stable unique identifier used to register the screen with its form-flow.",
		},
	],
	slots: [
		{ name: "default", summary: "Fields and other content shown when this screen is active." },
	],
	examples: [],
};
