// Metadata for docs and CLI consumers that need to describe or generate searchable-list usage.
export const searchableListMetadata = {
	name: "searchable-list",
	category: "content",
	summary: "A searchable collection renderer with reset and result-count helpers.",
	props: [
		{ name: "data", type: "array", required: true, summary: "Items to search and render." },
		{
			name: "search",
			type: "string",
			default: "",
			summary: "Initial or externally controlled search query.",
		},
		{
			name: "placeholder",
			type: "string",
			default: null,
			summary: "Placeholder text for the search input.",
		},
		{
			name: "exclude",
			type: "array",
			default: null,
			summary: "Fields to exclude from search.",
		},
		{
			name: "include",
			type: "array",
			default: null,
			summary: "Fields to include in search.",
		},
	],
	slots: [
		{ name: "default", summary: "Item renderer for matching results." },
		{ name: "label", summary: "Search input label." },
		{ name: "results-count", summary: "Result count text." },
		{ name: "no-results", summary: "Empty search result content." },
		{ name: "reset-search-label", summary: "Reset search button label." },
	],
	methods: [
		{ name: "resetSearch", summary: "Clear the current search query." },
		{ name: "triggerFocus", summary: "Move focus to the search input." },
	],
	examples: [],
};
