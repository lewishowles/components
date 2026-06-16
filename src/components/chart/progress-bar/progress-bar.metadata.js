// Metadata for docs and CLI consumers that need to describe or generate progress-bar usage.
export const progressBarMetadata = {
	name: "progress-bar",
	category: "chart",
	summary: "A progress or meter bar with optional label, value text, and indeterminate state.",
	props: [
		{
			name: "current",
			type: "number | null",
			default: 0,
			summary: "Current value, or null for an indeterminate bar.",
		},
		{ name: "min", type: "number", default: 0, summary: "Minimum value." },
		{ name: "max", type: "number", default: 100, summary: "Maximum value." },
		{
			name: "variant",
			type: "string",
			default: "progress",
			values: ["progress", "meter"],
			summary: "ARIA variant for task progress or bounded measurement.",
		},
		{
			name: "getValueLabel",
			type: "function",
			default: null,
			summary: "Return custom aria-valuetext for the current value.",
		},
		{
			name: "showLabel",
			type: "boolean",
			default: false,
			summary: "Show the label visually.",
		},
		{
			name: "showValue",
			type: "boolean",
			default: false,
			summary: "Show the formatted value.",
		},
		{
			name: "trackClasses",
			type: "string | array | object",
			default: null,
			summary: "Classes applied to the track.",
		},
		{
			name: "barClasses",
			type: "string | array | object",
			default: null,
			summary: "Classes applied to the filled bar.",
		},
	],
	slots: [
		{ name: "default", summary: "Progress label." },
		{ name: "value", summary: "Custom visible value content." },
	],
	parts: [
		{ name: "track", summary: "Background track of the progress bar." },
		{ name: "bar", summary: "Filled bar indicating progress." },
		{ name: "label", summary: "Descriptive label for the progress bar." },
		{ name: "value", summary: "Visible progress value text." },
	],
	examples: [],
};
