// Metadata for docs and CLI consumers that need to describe or generate donut-chart usage.
export const donutChartMetadata = {
	name: "donut-chart",
	category: "chart",
	summary: "An accessible SVG doughnut chart backed by labelled segment data.",
	props: [
		{
			name: "segments",
			type: "array",
			default: [],
			summary: "Chart segments, each with label and value data.",
		},
	],
	slots: [
		{
			name: "label",
			summary: "Accessible chart label.",
		},
		{
			name: "description",
			summary: "Accessible chart description.",
		},
	],
	examples: [],
};
