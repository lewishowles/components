// Metadata for docs and CLI consumers that need to describe or generate form-screen usage.
export const formScreenMetadata = {
	name: "form-screen",
	category: "form",
	summary: "A registered content boundary that displays one screen in a form-flow.",
	parts: [
		{ name: "title", summary: "The screen's title heading, rendered from the title slot." },
		{
			name: "introduction",
			summary: "Introductory paragraph rendered below the title heading.",
		},
	],
	props: [
		{
			name: "id",
			type: "string",
			required: true,
			summary: "Stable unique identifier used to register the screen with its form-flow.",
		},
		{
			name: "autoAdvance",
			type: "string",
			default: undefined,
			summary:
				"Field name that triggers automatic progression to the next screen after a direct user change and successful validation.",
		},
		{
			name: "autoFocus",
			type: "string",
			default: undefined,
			summary: "Field name to focus after this screen becomes active.",
		},
	],
	slots: [
		{ name: "default", summary: "Fields and other content shown when this screen is active." },
		{ name: "title", summary: "Accessible heading for this screen." },
		{ name: "introduction", summary: "Introductory content shown below the screen title." },
		{
			name: "answer-summary-title",
			summary:
				"Heading used when this screen's answers are shown later. Falls back to the title slot.",
		},
	],
	examples: [],
};
