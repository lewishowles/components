// Metadata for docs and CLI consumers that need to describe or generate combo-box usage.
export const comboBoxMetadata = {
	name: "combo-box",
	category: "content",
	summary: "An accessible combobox for filtering and selecting from item collections.",
	props: [
		{
			name: "items",
			type: "array",
			required: true,
			summary: "Items users can search and select.",
		},
		{
			name: "loading",
			type: "boolean",
			default: false,
			summary: "Show the loading state.",
		},
		{
			name: "id",
			type: "string",
			default: null,
			summary: "ID for the input; auto-generated if omitted.",
		},
		{
			name: "placeholder",
			type: "string",
			default: null,
			summary: "Placeholder text for the search input.",
		},
		{
			name: "placement",
			type: "string",
			default: "bottom",
			summary: "Preferred dropdown placement.",
		},
		{
			name: "align",
			type: "string",
			default: "left",
			summary: "Dropdown alignment.",
		},
		{
			name: "dropdownClasses",
			type: "string | array | object",
			default: null,
			summary: "Classes applied to the dropdown list.",
		},
	],
	slots: [
		{
			name: "default",
			summary: "Result item template.",
		},
		{
			name: "label",
			summary: "Input label.",
		},
		{
			name: "introduction",
			summary: "Introductory text shown above the input.",
		},
		{
			name: "no-results",
			summary: "Empty search result content.",
		},
		{
			name: "loading",
			summary: "Loading state content.",
		},
	],
	events: [
		{
			name: "select",
			summary: "Emitted when an item is selected.",
		},
	],
	methods: [
		{
			name: "triggerFocus",
			summary: "Move focus to the input.",
		},
	],
	examples: [],
};
