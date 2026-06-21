// Metadata for docs and CLI consumers that need to describe or generate form-date usage.
export const formDateMetadata = {
	name: "form-date",
	category: "form",
	summary: "A day, month, and year date field that can read and write ISO date strings.",
	props: [
		{
			name: "id",
			type: "string",
			default: null,
			summary: "Base ID for the date inputs; auto-generated if omitted.",
		},
		{
			name: "required",
			type: "boolean",
			default: false,
			summary: "Mark each date part as required.",
		},
	],
	slots: [
		{
			name: "default",
			summary: "The field legend.",
		},
		{
			name: "optional-indicator",
			summary:
				"Content shown after the label when the field is not required. Defaults to (optional).",
		},
		{
			name: "introduction",
			summary: "Introductory text shown above the date inputs.",
		},
		{
			name: "day-label",
			summary: "Label for the day input.",
			default: "Day",
		},
		{
			name: "month-label",
			summary: "Label for the month input.",
			default: "Month",
		},
		{
			name: "year-label",
			summary: "Label for the year input.",
			default: "Year",
		},
		{
			name: "error",
			summary: "Custom error content.",
		},
		{
			name: "help",
			summary: "Help text shown below the date inputs.",
		},
	],
	methods: [
		{
			name: "toString",
			summary: "Return the current date as an ISO string when valid.",
		},
		{
			name: "setDateFromIsoString",
			summary: "Set the current date from an ISO date string.",
		},
		{
			name: "triggerFocus",
			summary: "Move focus to the day input.",
		},
	],
	examples: [],
};
