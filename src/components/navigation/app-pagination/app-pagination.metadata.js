// Metadata for docs and CLI consumers that need to describe or generate app-pagination usage.
export const appPaginationMetadata = {
	name: "app-pagination",
	category: "navigation",
	summary: "Pagination controls with range text and page navigation helpers.",
	props: [
		{
			name: "count",
			type: "number",
			required: true,
			summary: "Total number of items.",
		},
		{
			name: "itemsPerPage",
			type: "number",
			default: 10,
			summary: "Number of items displayed per page.",
		},
	],
	slots: [
		{ name: "default", summary: "Pagination content override." },
		{ name: "previous-page-label", summary: "Previous page link label." },
		{ name: "next-page-label", summary: "Next page link label." },
		{ name: "page-number-label", summary: "Page number link label." },
		{ name: "showing-items-label", summary: "Current item range label." },
	],
	events: [
		{
			name: "update:page",
			summary: "Emitted when the current page changes.",
		},
	],
	methods: [
		{
			name: "goTo",
			summary: "Navigate to a page number.",
		},
	],
	examples: [],
};
