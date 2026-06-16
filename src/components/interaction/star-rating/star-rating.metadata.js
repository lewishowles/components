// Metadata for docs and CLI consumers that need to describe or generate star-rating usage.
export const starRatingMetadata = {
	name: "star-rating",
	category: "interaction",
	summary: "A radio-backed rating control with star or heart icons.",
	props: [
		{
			name: "name",
			type: "string",
			default: null,
			summary: "Form field name forwarded to the underlying radio group.",
		},
		{
			name: "id",
			type: "string",
			default: null,
			summary: "Base ID forwarded to the underlying radio group.",
		},
		{
			name: "readOnly",
			type: "boolean",
			default: false,
			summary: "Display the rating without interactive radio controls.",
		},
		{
			name: "shape",
			type: "string",
			default: "star",
			values: ["star", "heart"],
			summary: "Icon shape used for rating options.",
		},
		{
			name: "max",
			type: "number",
			default: 5,
			summary: "Maximum rating value and number of icons.",
		},
	],
	slots: [
		{ name: "default", summary: "Field label." },
		{ name: "option-label", summary: "Accessible label for each rating option." },
		{ name: "read-only-label", summary: "Accessible label for read-only rating output." },
		{ name: "current-rating", summary: "Visible current rating text." },
		{ name: "introduction", summary: "Introductory text shown above the control." },
		{ name: "error", summary: "Error content." },
		{ name: "help", summary: "Help content." },
	],
	methods: [
		{
			name: "triggerFocus",
			summary: "Move focus to the selected rating option, or the first option.",
		},
	],
	parts: [
		{ name: "option", summary: "Individual star rating option." },
		{ name: "options", summary: "Container for all star rating options." },
	],
	examples: [],
};
