<template>
	<span role="status" aria-live="polite" class="sr-only" data-test="data-table-status">
		<template v-if="type === statusTypes.SORT">
			<slot name="sort-status" v-bind="{ column: sortColumn, ascending }">
				Sorted by {{ sortColumn }} {{ ascending ? "ascending" : "descending" }}
			</slot>
		</template>

		<template v-else-if="type === statusTypes.SEARCH">
			<slot name="search-status" v-bind="{ count: resultCount, query }">
				<template v-if="resultCount === 0">No results for "{{ query }}"</template>
				<template v-else>
					Showing {{ resultCount }} result{{ resultCount === 1 ? "" : "s" }} for "{{ query }}"
				</template>
			</slot>
		</template>

		<template v-else-if="type === statusTypes.SELECTION">
			<slot name="selection-status" v-bind="{ selectedCount, total: totalCount, allSelected }">
				<template v-if="selectedCount === 0">All rows deselected</template>
				<template v-else-if="allSelected">All {{ totalCount }} rows selected</template>
				<template v-else>{{ selectedCount }} of {{ totalCount }} rows selected</template>
			</slot>
		</template>
	</span>
</template>

<script>
// The available status announcement types for the live region. Exported so the
// parent can set the active type using the same tokens, and double as the value
// passed to the `type` prop.
export const statusTypes = { SORT: "sort", SEARCH: "search", SELECTION: "selection" };
</script>

<script setup>
defineProps({
	/**
	 * The active announcement type, or null when nothing is announced.
	 */
	type: {
		type: String,
		default: null,
	},

	/**
	 * The label of the currently sorted column.
	 */
	sortColumn: {
		type: String,
		default: null,
	},

	/**
	 * Whether the current sort is ascending.
	 */
	ascending: {
		type: Boolean,
		default: false,
	},

	/**
	 * The number of rows matching the current search.
	 */
	resultCount: {
		type: Number,
		default: 0,
	},

	/**
	 * The current search query.
	 */
	query: {
		type: String,
		default: null,
	},

	/**
	 * The number of currently selected rows.
	 */
	selectedCount: {
		type: Number,
		default: 0,
	},

	/**
	 * The total number of rows.
	 */
	totalCount: {
		type: Number,
		default: 0,
	},

	/**
	 * Whether all rows are currently selected.
	 */
	allSelected: {
		type: Boolean,
		default: false,
	},
});
</script>
