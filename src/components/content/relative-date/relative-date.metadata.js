// Metadata for docs and CLI consumers that need to describe or generate relative-date usage.
export const relativeDateMetadata = {
	name: "relative-date",
	category: "content",
	summary: "A live relative-time label for a date.",
	props: [
		{
			name: "date",
			type: "string | number | Date",
			required: true,
			summary: "Date value to compare.",
		},
		{
			name: "relativeTo",
			type: "string | number | Date",
			default: undefined,
			summary: "Reference date used for comparison.",
		},
		{
			name: "locale",
			type: "string",
			default: undefined,
			summary: "Locale used for relative formatting.",
		},
		{
			name: "refreshInterval",
			type: "number",
			default: 60000,
			summary: "Interval in milliseconds for refreshing the label.",
		},
	],
	examples: [],
};
