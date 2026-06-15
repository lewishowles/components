// Metadata for docs and CLI consumers that need to describe or generate chart-legend usage.
export const chartLegendMetadata = {
	name: "chart-legend",
	category: "chart",
	summary: "A legend for chart series with optional value display.",
	props: [
		{
			name: "series",
			type: "array",
			default: [],
			summary: "Series entries to display, usually from useChartConfig.",
		},
		{
			name: "showValues",
			type: "boolean",
			default: true,
			summary: "Show each series value.",
		},
		{
			name: "formatValue",
			type: "function",
			default: undefined,
			summary: "Format a series value before display.",
		},
		{
			name: "orientation",
			type: "string",
			default: "vertical",
			values: ["horizontal", "vertical"],
			summary: "Legend layout direction.",
		},
	],
	examples: [],
};
