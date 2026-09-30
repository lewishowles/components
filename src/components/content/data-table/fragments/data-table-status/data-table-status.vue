<template>
	<span role="status" aria-live="polite" class="sr-only" data-test="data-table-status">
		<template v-if="activeStatusType === statusTypes.SORT">
			<slot name="sort-status" v-bind="{ column: sortColumn, ascending }">
				Sorted by {{ sortColumn }} {{ ascending ? "ascending" : "descending" }}
			</slot>
		</template>

		<template v-else-if="activeStatusType === statusTypes.SEARCH">
			<slot name="search-status" v-bind="{ count: resultCount, query }">
				<template v-if="resultCount === 0">No results for "{{ query }}"</template>
				<template v-else>
					Showing {{ resultCount }} result{{ resultCount === 1 ? "" : "s" }} for "{{ query }}"
				</template>
			</slot>
		</template>

		<template v-else-if="activeStatusType === statusTypes.SELECTION">
			<slot name="selection-status" v-bind="{ selectedCount, total: totalCount, allSelected }">
				<template v-if="selectedCount === 0">All rows deselected</template>
				<template v-else-if="allSelected">All {{ totalCount }} rows selected</template>
				<template v-else>{{ selectedCount }} of {{ totalCount }} rows selected</template>
			</slot>
		</template>
	</span>
</template>

<script setup>
import { isNonEmptyString } from "@lewishowles/helpers/string";
import { computed, ref, watch } from "vue";

const props = defineProps({
	/**
	 * Whether the table can be sorted. A sort announcement is cleared when
	 * sorting is turned off, since there is no longer a sorted column to name.
	 */
	enableSort: {
		type: Boolean,
		default: true,
	},

	/**
	 * Whether rows can be selected. Selection changes are only announced when
	 * it is on.
	 */
	enableSelection: {
		type: Boolean,
		default: false,
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

// The kinds of change the status region can announce.
const statusTypes = { SORT: "sort", SEARCH: "search", SELECTION: "selection" };
// The most recent kind of change, which decides what the status region reads out.
const statusType = ref(null);

// The announcement to show, with a sort announcement dropped once sorting is
// turned off.
const activeStatusType = computed(() => {
	if (!props.enableSort && statusType.value === statusTypes.SORT) {
		return null;
	}

	return statusType.value;
});

// Announce the sort when the sorted column or direction changes. The watchers
// don't run on mount, so a table that starts sorted announces nothing.
watch([() => props.sortColumn, () => props.ascending], () => {
	if (!isNonEmptyString(props.sortColumn)) {
		return;
	}

	statusType.value = statusTypes.SORT;
});

// Announce the search results when the query or the number of matching rows
// changes, as long as there is a query.
watch([() => props.query, () => props.resultCount], () => {
	if (!isNonEmptyString(props.query)) {
		return;
	}

	statusType.value = statusTypes.SEARCH;
});

// Announce the selection when the number of selected rows changes.
watch(
	() => props.selectedCount,
	() => {
		if (!props.enableSelection) {
			return;
		}

		statusType.value = statusTypes.SELECTION;
	},
);
</script>
