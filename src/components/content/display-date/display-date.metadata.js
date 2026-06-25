// Metadata for docs and CLI consumers that need to describe or generate display-date usage.
export const displayDateMetadata = {
	name: "display-date",
	category: "content",
	summary: "A locale-aware date formatter for dates, timestamps, and Date instances.",
	props: [
		{
			name: "date",
			type: "string | number | Date",
			required: true,
			summary: "Date value to format.",
		},
		{
			name: "locale",
			type: "string",
			default: undefined,
			summary: "Locale used for formatting.",
		},
		{
			name: "format",
			type: "string | object",
			default: undefined,
			summary:
				'Named format string (e.g. "date", "dateTime", "shortDate"), Day.js token string, or Intl.DateTimeFormat options. Defaults to "date" for date-only inputs and "dateTime" for inputs with time.',
		},
	],
	examples: [],
};
