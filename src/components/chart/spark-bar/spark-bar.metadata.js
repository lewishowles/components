// Metadata for docs and CLI consumers that need to describe or generate spark-bar usage.
export const sparkBarMetadata = {
	name: "spark-bar",
	category: "chart",
	summary: "A compact meter bar with inline value display.",
	props: [
		{ name: "current", type: "number", default: 0, summary: "Current value." },
		{ name: "min", type: "number", default: 0, summary: "Minimum value." },
		{ name: "max", type: "number", default: 100, summary: "Maximum value." },
		{
			name: "trackClasses",
			type: "string | array | object",
			default: "h-1 rounded-full bg-grey-200 dark:bg-white/20",
			summary: "Classes applied to the track.",
		},
		{
			name: "barClasses",
			type: "string | array | object",
			default: "h-full rounded-full bg-primary",
			summary: "Classes applied to the filled bar.",
		},
		{
			name: "valueClasses",
			type: "string | array | object",
			default: "text-sm",
			summary: "Classes applied to the value display.",
		},
	],
	slots: [
		{
			name: "default",
			summary: "Custom value content.",
		},
	],
	parts: [
		{ name: "track", summary: "Background track of the spark bar." },
		{ name: "bar", summary: "Filled bar indicating the value." },
		{ name: "value", summary: "Visible value text." },
	],
	examples: [],
};
