<template>
	<div data-component="data-table" data-test="data-table">
		<data-table-status
			v-bind="{
				enableSort,
				enableSelection,
				sortColumn: getColumnLabel(sortedColumn),
				ascending: isAscending,
				resultCount: rowCount,
				query: searchQuery,
				selectedCount: selectedRowCount,
				totalCount: rowCount,
				allSelected: allAvailableRowsSelected,
			}"
		>
			<template #sort-status="binding">
				<slot name="sort-status" v-bind="binding" />
			</template>
			<template #search-status="binding">
				<slot name="search-status" v-bind="binding" />
			</template>
			<template #selection-status="binding">
				<slot name="selection-status" v-bind="binding" />
			</template>
		</data-table-status>

		<data-table-header>
			<template #table-title>
				<slot name="table-title" />
			</template>
			<template #table-introduction>
				<slot name="table-introduction" />
			</template>
		</data-table-header>

		<div class="text-sm">
			<div class="flex flex-col gap-6">
				<data-table-toolbar
					ref="dataTableToolbar"
					v-bind="{ enableSearch, tableDensityOptions }"
					v-model:search-query="searchQuery"
					v-model:density="tableDensity"
					v-model:column-visibility="columnVisibility"
				>
					<template #search-label>
						<slot name="search-label" />
					</template>
					<template #search-introduction>
						<slot name="search-introduction" />
					</template>
					<template #search-help>
						<slot name="search-help" />
					</template>
					<template #reset-search-label>
						<slot name="reset-search-label" />
					</template>
					<template v-if="$slots['post-search']" #post-search>
						<slot name="post-search" />
					</template>
					<template v-if="$slots['pre-configuration']" #pre-configuration>
						<slot name="pre-configuration" />
					</template>
					<template #configure-label>
						<slot name="configure-label" />
					</template>
					<template #display-options-label>
						<slot name="display-options-label" />
					</template>
					<template v-for="key in tableDensityOptions" #[`display-option-${key}-label`] :key="key">
						<slot :name="`display-option-${key}-label`" />
					</template>
					<template #column-visibility-label>
						<slot name="column-visibility-label" />
					</template>
				</data-table-toolbar>

				<alert-message v-if="!haveData" data-test="data-table-no-data">
					<slot name="no-data-message">No data to display.</slot>
				</alert-message>

				<data-table-table v-else>
					<template v-for="slotName in getTableSlotNames()" #[slotName]="slotProps">
						<slot :name="slotName" v-bind="slotProps || {}" />
					</template>
				</data-table-table>

				<data-table-footer
					v-if="haveData"
					v-bind="{
						enableSelection,
						selectedCount: selectedRowCount,
						enablePagination,
						haveDataToDisplay: haveTableContent,
						itemsPerPage,
						totalCount: rowCount,
						searchQuery,
					}"
					v-model="currentPage"
				>
					<template #selected-row-count-label="binding">
						<slot name="selected-row-count-label" v-bind="binding" />
					</template>
					<template #page-number-label="binding">
						<slot name="page-number-label" v-bind="binding" />
					</template>
					<template #next-page-label>
						<slot name="next-page-label" />
					</template>
					<template #showing-items-label="binding">
						<slot name="showing-items-label" v-bind="binding" />
					</template>
					<template #no-results-message="binding">
						<slot name="no-results-message" v-bind="binding" />
					</template>
				</data-table-footer>
			</div>
		</div>
	</div>
</template>

<script setup>
import { isNonEmptyArray } from "@lewishowles/helpers/array";
import { computed, provide, ref, toRef, useSlots, watchEffect } from "vue";
import { callComponentMethod } from "@lewishowles/helpers/vue";
import { isNonEmptyString } from "@lewishowles/helpers/string";
import { getPathValue } from "@lewishowles/helpers/object";

import DataTableFooter from "./fragments/data-table-footer/data-table-footer.vue";
import DataTableHeader from "./fragments/data-table-header/data-table-header.vue";
import DataTableTable from "./fragments/data-table-table/data-table-table.vue";
import DataTableStatus from "./fragments/data-table-status/data-table-status.vue";
import DataTableToolbar from "./fragments/data-table-toolbar/data-table-toolbar.vue";

import useTableColumns from "./composables/use-table-columns/use-table-columns.js";
import useTableData from "./composables/use-table-data/use-table-data.js";
import useTablePagination from "./composables/use-table-pagination/use-table-pagination.js";
import useTableSearch from "./composables/use-table-search/use-table-search.js";
import useTableSelection from "./composables/use-table-selection/use-table-selection.js";
import useTableSort from "./composables/use-table-sort/use-table-sort.js";

const props = defineProps({
	/**
	 * The data to display in the table, modified by the `columns`
	 * configuration.
	 */
	data: {
		type: Array,
		default: () => [],
	},

	/**
	 * Any additional configuration for columns. Options are as defined in
	 * `data-table.md`.
	 *
	 * **Note:** Columns without configuration will not be displayed. This is to
	 * make it easier to hide unnecessary columns, and to help enforce proper
	 * labelling of column data.
	 */
	columns: {
		type: Object,
		default: () => ({}),
	},

	/**
	 * Whether the table manages data locally or reports state for server data.
	 */
	mode: {
		type: String,
		default: "client",
	},

	/**
	 * How rows appear when the table itself is narrow. "cards" shows one card
	 * per row. "scroll" keeps the columns and scrolls sideways, which suits
	 * tables built for comparing values.
	 */
	narrowLayout: {
		type: String,
		default: "cards",
		validator: (value) => ["cards", "scroll"].includes(value),
	},

	/**
	 * A unique name for this table. This will be used to store the user's
	 * preferences for how dense the table is, for example. Without a name, this
	 * option will not be available. The name will be used directly in
	 * `localStorage`, prefixed with `data-table:`, so should be safe for users.
	 */
	name: {
		type: String,
		default: null,
	},

	/**
	 * Whether to enable the table search. When enabled, anything typed into the
	 * search box will search the text for each cell case-insensitively, and
	 * hide any rows where none of the cells match.
	 */
	enableSearch: {
		type: Boolean,
		default: true,
	},

	/**
	 * Whether to enable the table sort. When enabled, columns marked as
	 * sortable (the default) can be ordered ascending or descending. While
	 * sorting is off, the table ignores any sort in its state and never
	 * changes it.
	 */
	enableSort: {
		type: Boolean,
		default: true,
	},

	/**
	 * Whether to enable pagination. When enabled, visible rows are limited to
	 * those on the currently selected page.
	 */
	enablePagination: {
		type: Boolean,
		default: true,
	},

	/**
	 * The raw row property path used to match controlled selection. Server mode
	 * also uses it to preserve selection across pages.
	 */
	rowKey: {
		type: String,
		default: "id",
	},

	/**
	 * The total number of rows available from the server in server mode.
	 */
	totalRows: {
		type: Number,
		default: undefined,
	},

	/**
	 * Whether server data is currently being loaded.
	 */
	loading: {
		type: Boolean,
		default: undefined,
	},

	/**
	 * The server data loading error, if one occurred.
	 */
	error: {
		type: [String, Error],
		default: undefined,
	},

	/**
	 * Whether to enable selection. When enabled, a new column is added to the
	 * start of the table with selection checkboxes. The table reads initial and
	 * later selected rows from v-model and writes user changes back to it.
	 */
	enableSelection: {
		type: Boolean,
		default: false,
	},

	/**
	 * The placeholder to apply to the search input.
	 */
	searchPlaceholder: {
		type: String,
		default: null,
	},

	/**
	 * A short phrase describing what the table shows, for example "Recent orders"
	 * or "Team members", so screen reader users can identify the scrollable
	 * region when the table has no visible caption.
	 */
	overflowLabel: {
		type: String,
		default: null,
	},

	/**
	 * The heading level to use for any introduction to this table.
	 */
	headingLevel: {
		type: String,
		default: "h2",
	},

	/**
	 * Classes to apply to all headings in the table. Cell padding will always
	 * apply.
	 */
	headingClasses: {
		type: String,
		default: "font-bold text-content-strong",
	},

	/**
	 * Classes to apply to all standard cells in the table. Cell padding will
	 * always apply.
	 */
	cellClasses: {
		type: String,
		default: "text-content-muted",
	},
});

// The single controlled server state model.
const state = defineModel("state", {
	type: Object,
});

// The controlled raw rows selected in the table.
const selection = defineModel({
	type: Array,
});

const slots = useSlots();
// Whether the table delegates data management to the consumer.
const isServerMode = computed(() => props.mode === "server");

// Whether a controlled server search is active.
const haveServerSearchQuery = computed(
	() => isServerMode.value && isNonEmptyString(state.value?.filters?.search),
);

// Whether server data is currently loading.
const isLoading = computed(() => isServerMode.value && props.loading === true);

// Whether server data failed to load.
const haveError = computed(
	() => isServerMode.value && (isNonEmptyString(props.error) || props.error instanceof Error),
);

// Whether a server response state replaces the table's rows.
const hasServerState = computed(() => isLoading.value || haveError.value);

// The message shown when a server error has no usable message.
const errorMessage = computed(() => {
	if (props.error instanceof Error && isNonEmptyString(props.error.message)) {
		return props.error.message;
	}

	if (isNonEmptyString(props.error)) {
		return props.error;
	}

	return "Unable to load data.";
});

// A reference to the toolbar, allowing us to focus its search input when needed.
const dataTableToolbar = ref(null);
// Whether a name has been provided for this table.
const haveTableName = computed(() => isNonEmptyString(props.name));
// Whether an #actions slot has been declared. Its column is injected regardless
// of the slot's output for individual rows.
const haveActionsSlot = computed(() => typeof slots.actions === "function");

watchEffect(() => {
	if (!import.meta.env.DEV || !isServerMode.value) {
		return;
	}

	if (props.totalRows === undefined || props.loading === undefined || props.error === undefined) {
		console.warn("[data-table] Server mode requires `totalRows`, `loading`, and `error` props.");
	}

	if (
		props.enableSelection &&
		props.data.some((row) => getPathValue(row, props.rowKey, null) === null)
	) {
		console.warn(
			`[data-table] Selectable server rows need a stable value at \`rowKey\` path "${props.rowKey}".`,
		);
	}
});

// Table data: the provided data, transformed into the internal shape the table
// works with, and whether any valid data is present.
const { haveData: haveLocalData, internalData } = useTableData(
	toRef(props, "data"),
	toRef(props, "columns"),
	{ isServerMode },
);

// Whether to show the table controls and result presentation.
const haveData = computed(() => {
	if (isServerMode.value) {
		return (props.totalRows ?? 0) > 0 || haveServerSearchQuery.value || hasServerState.value;
	}

	return haveLocalData.value;
});

// Columns: the derived column definitions, which are visible, the table
// density, and the helpers that merge classes and read labels.
const {
	columnDefinitions,
	columnVisibility,
	getCellClasses,
	getColumnLabel,
	getHeadingClasses,
	tableDensity,
	tableDensityOptions,
	updateTableDensityOptions,
	visibleColumnDefinitions,
} = useTableColumns({
	columns: toRef(props, "columns"),
	name: toRef(props, "name"),
	headingClasses: toRef(props, "headingClasses"),
	cellClasses: toRef(props, "cellClasses"),
	haveActionsSlot,
});

// The number of visible columns, including the optional selection control.
const stateRowColumnCount = computed(
	() => Object.keys(visibleColumnDefinitions.value).length + (props.enableSelection ? 1 : 0),
);

// Table search: the current query, whether a search is active, and the rows
// that match it.
const { filteredRows, searchQuery } = useTableSearch(internalData, toRef(props, "columns"), {
	isServerMode,
	state,
});

// Column sorting: the sort state, the sorted rows, and the sort-control helpers.
const {
	getColumnSortDirection,
	getSortIcon,
	isAscending,
	sortColumn,
	sortDirection,
	sortedColumn,
	sortedRows,
} = useTableSort(filteredRows, columnDefinitions, {
	enabled: toRef(props, "enableSort"),
	isServerMode,
	state,
});

// Whether we have any data to display. That is, not only do we have data for
// the table, but if the user is performing a search, there are results for that
// search term.
const haveDataToDisplay = computed(() => isNonEmptyArray(filteredRows.value));

// Whether rows or a server response state should keep the table visible.
const haveTableContent = computed(() => haveDataToDisplay.value || hasServerState.value);

// Row selection: the selected ids, the select-all state, the selection counts,
// and the action to toggle every row. Keeps the `v-model` in sync.
const {
	areAllRowsSelected,
	selectAllIndeterminate,
	selectAllRows,
	selectedRowCount,
	selectedRowIds,
	toggleAllRows,
} = useTableSelection(internalData, filteredRows, selection, toRef(props, "enableSelection"), {
	isServerMode,
	rowKey: toRef(props, "rowKey"),
});

// Pagination: the current page, the rows shown for that page, and the total
// row count.
const { currentPage, itemsPerPage, paginatedRows, rowCount } = useTablePagination(
	{ filteredRows, sortedRows, sortedColumn, sortDirection },
	toRef(props, "enablePagination"),
	{ isServerMode, state, totalRows: toRef(props, "totalRows") },
);

/**
 * The names of the user's slots that the table fragment renders: its fixed
 * slots, plus the cell and heading slots of each visible column. Toolbar,
 * status and footer slots stay with this component. The template calls this on
 * every render, so slots added or removed after the table first appears are
 * passed through.
 */
function getTableSlotNames() {
	// The table slots that do not depend on the configured columns.
	const fixedNames = [
		"caption",
		"sorted-hint",
		"sort-instruction",
		"sort-by-label",
		"sort-direction-label",
		"sort-ascending-label",
		"sort-descending-label",
		"loading-label",
		"error",
		"select-all-rows-label",
		"select-row-label",
	];

	// The keys of the visible columns, including any injected actions column.
	const columnKeys = Object.keys(visibleColumnDefinitions.value);

	return Object.keys(slots).filter(
		(name) =>
			fixedNames.includes(name) ||
			columnKeys.some((key) => name === key || name === `${key}_heading`),
	);
}

// Whether the selection includes every row represented by the table total.
const allAvailableRowsSelected = computed(() => {
	if (!isServerMode.value) {
		return areAllRowsSelected.value;
	}

	return rowCount.value > 0 && selectedRowCount.value === rowCount.value;
});

/**
 * Set the search query to the provided value.
 *
 * @param  {string}  value
 *     The search query to set.
 */
function setSearchQuery(value) {
	if (typeof value !== "string") {
		return;
	}

	searchQuery.value = value;

	callComponentMethod(dataTableToolbar.value, "triggerSearchFocus");
}

provide("data-table", {
	// The complete column configuration used by the toolbar and header.
	columnDefinitions,
	// The heading level for the table introduction.
	headingLevel: toRef(props, "headingLevel"),
	// Whether the table can save preferences under a name.
	haveTableName,
	// The placeholder for the search field.
	searchPlaceholder: toRef(props, "searchPlaceholder"),
	// The name used to save the table's preferences.
	tableName: toRef(props, "name"),
	// Update the density choices when the table configuration changes.
	updateTableDensityOptions,
	// The columns currently rendered in the table.
	visibleColumnDefinitions,
	// The rows on the current page.
	paginatedRows,
	// Whether rows or a server response state should show the table.
	haveTableContent,
	// Whether sortable columns show sort controls.
	enableSort: toRef(props, "enableSort"),
	// Whether rows show selection controls.
	enableSelection: toRef(props, "enableSelection"),
	// The layout to use when the table is narrow.
	narrowLayout: toRef(props, "narrowLayout"),
	// The key of the active sort column.
	sortedColumn,
	// Whether the active sort is ascending.
	isAscending,
	// Whether a server response is loading.
	isLoading,
	// Whether a server response has an error.
	haveError,
	// The server error passed to the error slot.
	error: toRef(props, "error"),
	// The default text for a server error.
	errorMessage,
	// The accessible name for a scrollable table without a caption.
	overflowLabel: toRef(props, "overflowLabel"),
	// Whether the select-all control shows a mixed state.
	selectAllIndeterminate,
	// The number of columns spanned by loading and error rows.
	stateRowColumnCount,
	// Return the label for a column key.
	getColumnLabel,
	// Return the ARIA sort direction for a column key.
	getColumnSortDirection,
	// Return the classes for a column heading.
	getHeadingClasses,
	// Return the classes for a body cell.
	getCellClasses,
	// Return the sort icon for a column key.
	getSortIcon,
	// Sort by a column when its heading button is activated.
	sortColumn,
	// Select or clear all rows when the header checkbox changes.
	toggleAllRows,
	// The select-all value owned by the selection composable.
	selectAllRows,
	// The selected row IDs owned by the selection composable.
	selectedRowIds,
});

defineExpose({
	setSearchQuery,
});
</script>
