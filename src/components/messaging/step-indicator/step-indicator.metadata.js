// Metadata for docs and CLI consumers that need to describe or generate step-indicator usage.
export const stepIndicatorMetadata = {
	name: "step-indicator",
	category: "messaging",
	summary: "A compact progress indicator for multi-step flows.",
	props: [
		{
			name: "currentStep",
			type: "number",
			required: true,
			summary: "The current 1-based step.",
		},
		{
			name: "stepCount",
			type: "number",
			required: true,
			summary: "The total number of steps.",
		},
	],
	slots: [
		{
			name: "default",
			summary: "Label shown before the progress value.",
		},
		{
			name: "current-step",
			summary: "Custom current-step label.",
		},
	],
	parts: [
		{ name: "label", summary: "Step label text." },
		{ name: "progress", summary: "Progress indicator between steps." },
	],
	examples: [],
};
