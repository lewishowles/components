<template>
	<div data-component="data-table" data-test="data-table">
		<span role="status" aria-live="polite" class="sr-only" data-test="data-table-status">
			<template v-if="statusType === statusTypes.SORT">
				<slot
					name="sort-status"
					v-bind="{ column: getColumnLabel(sortedColumn), ascending: isAscending }"
				>
					Sorted by {{ getColumnLabel(sortedColumn) }}
					{{ isAscending ? "ascending" : "descending" }}
				</slot>
			</template>

			<template v-else-if="statusType === statusTypes.SEARCH">
				<slot name="search-status" v-bind="{ count: filteredRows.length, query: searchQuery }">
					<template v-if="filteredRows.length === 0"> No results for "{{ searchQuery }}" </template>
					<template v-else>
						Showing {{ filteredRows.length }} result{{ filteredRows.length === 1 ? "" : "s" }} for
						"{{ searchQuery }}"
					</template>
				</slot>
			</template>

			<template v-else-if="statusType === statusTypes.SELECTION">
				<slot
					name="selection-status"
					v-bind="{
						selectedCount: selectedRowCount,
						total: rowCount,
						allSelected: areAllRowsSelected,
					}"
				>
					<template v-if="selectedRowCount === 0"> All rows deselected </template>
					<template v-else-if="areAllRowsSelected"> All {{ rowCount }} rows selected </template>
					<template v-else> {{ selectedRowCount }} of {{ rowCount }} rows selected </template>
				</slot>
			</template>
		</span>

		<div
			v-if="haveTitle || haveIntroduction"
			class="border-border mb-6 flex flex-col gap-4 border-b pb-6"
		>
			<component :is="headingLevel" v-if="haveTitle" class="text-content-strong text-3xl font-bold">
				<slot name="table-title" />
			</component>

			<slot name="table-introduction" />
		</div>

		<div class="text-sm">
			<alert-message v-if="!haveData" data-test="data-table-no-data">
				<slot name="no-data-message"> No data to display. </slot>
			</alert-message>

			<div v-if="haveData" class="flex flex-col gap-6">
				<div v-if="enableSearch || showUserConfiguration" class="flex items-end gap-4">
					<data-table-search
						v-if="enableSearch"
						ref="dataTableSearchComponent"
						v-model="searchQuery"
						class="w-full"
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
					</data-table-search>

					<slot name="post-search" />
					<slot name="pre-configuration" />

					<floating-details
						v-if="showUserConfiguration"
						align="end"
						class="ms-auto"
						details-classes="min-w-3xs py-2 rounded-lg border"
						data-test="data-table-display-options"
					>
						<template #summary>
							<slot name="configure-label"> Configure </slot>
						</template>

						<template v-if="haveTableName">
							<h4 class="text-content-strong my-2 px-4 font-semibold">
								<slot name="display-options-label"> Display options </slot>
							</h4>

							<data-table-density v-model="tableDensity">
								<template
									v-for="key in tableDensityOptions"
									#[`display-option-${key}-label`]
									:key="key"
								>
									<slot :name="`display-option-${key}-label`" />
								</template>
							</data-table-density>

							<h4 class="text-content-strong my-2 px-4 font-semibold">
								<slot name="column-visibility-label"> Columns </slot>
							</h4>

							<data-table-columns v-model="columnVisibility" />
						</template>
					</floating-details>
				</div>

				<div
					ref="tableScrollWrapper"
					class="overflow-x-auto"
					:tabindex="isOverflowing ? 0 : -1"
					:role="isOverflowing ? 'region' : null"
					:aria-labelledby="isOverflowing && haveCaption ? captionId : null"
					:aria-label="isOverflowing && !haveCaption ? 'Table' : null"
				>
					<table v-show="haveDataToDisplay" class="w-full" data-test="data-table-table">
						<caption
							v-if="haveCaption || (enableSort && sortedColumn)"
							:id="captionId"
							class="text-left italic"
							:class="{ 'mb-2': haveCaption }"
						>
							<slot name="caption" />

							<span class="sr-only">
								<slot
									name="sorted-hint"
									v-bind="{
										sortedColumn: getColumnLabel(sortedColumn),
										ascending: isAscending,
									}"
								>
									Sorted by {{ getColumnLabel(sortedColumn) }}
									<template v-if="isAscending"> ascending </template>
									<template v-else> descending </template>
								</slot>
							</span>
						</caption>

						<thead>
							<tr class="border-border-strong border-b">
								<th v-if="enableSelection" scope="col" class="w-px px-4">
									<form-checkbox
										v-bind="{ displayLabel: false, indeterminate: selectAllIndeterminate }"
										v-model="selectAllRows"
										class="shrink"
										data-test="data-table-select-all-rows"
										@change="toggleAllRows"
									>
										<slot name="select-all-rows-label"> Select all rows </slot>
									</form-checkbox>
								</th>
								<th
									v-for="(column, columnKey) in visibleColumnDefinitions"
									:key="columnKey"
									v-bind="{ 'aria-sort': getColumnSortDirection(columnKey) }"
									scope="col"
									class="py-4"
									:class="[
										{
											'ps-3': !column.sortable && !column.first,
											'pe-3': !column.sortable && !column.last,
											'text-start': column.align !== 'right',
											'text-end': column.align === 'right',
										},
										!column.sortable ? getHeadingClasses(column) : null,
									]"
									data-test="data-table-heading"
								>
									<conditional-wrapper
										v-bind="{
											wrap: column.sortable,
											tag: 'ui-button',
											iconEnd: getSortIcon(columnKey),
										}"
										class="hocus:border-primary hocus:bg-surface-sunken -mt-4 -mb-4.25 w-full border-b border-transparent py-4"
										:class="[
											{
												'ps-3': !column.first,
												'pe-3': !column.last,
												'justify-start': column.align !== 'right',
												'justify-end': column.align === 'right',
											},
											getHeadingClasses(column),
										]"
										data-test="data-table-sort"
										@click="sortColumn(columnKey)"
									>
										<slot
											:name="`${columnKey}_heading`"
											v-bind="{ key: columnKey, label: columnKey }"
										>
											{{ column.label }}
										</slot>

										<span v-if="column.sortable" class="sr-only">
											<slot
												name="sort-instruction"
												v-bind="{
													label: column.label,
													sorted: columnKey === sortedColumn,
													direction: getColumnSortDirection(columnKey),
												}"
											>
												{{ getSortInstruction(columnKey) }}
											</slot>
										</span>
									</conditional-wrapper>
								</th>
							</tr>
						</thead>
						<tbody>
							<tr
								v-for="(row, rowIndex) in paginatedRows"
								:key="row.configuration.id"
								class="border-border hover:bg-surface-subtle border-b transition-colors"
								data-test="data-table-row"
							>
								<td v-if="enableSelection" class="px-4">
									<form-checkbox
										v-bind="{ displayLabel: false, inputAttributes: { value: getRowId(row) } }"
										v-model="selectedRowIds"
										class="shrink"
										data-test="data-table-select-row"
									>
										<slot
											name="select-row-label"
											v-bind="{ row: getRawRow(row), rowNumber: rowIndex + 1 }"
										>
											Select row {{ rowIndex + 1 }}
										</slot>
									</form-checkbox>
								</td>
								<component
									:is="column.primary ? 'th' : 'td'"
									v-for="(column, columnKey) in visibleColumnDefinitions"
									:key="columnKey"
									:scope="column.primary ? 'row' : null"
									:class="[
										{
											'ps-3': !column.first,
											'pe-3': !column.last,
											'text-content-strong font-semibold': column.primary,
											'text-start': column.align !== 'right',
											'text-end': column.align === 'right',
											'tabular-nums': column.tabularNums,
										},
										getCellClasses(column),
									]"
									data-test="data-table-cell"
								>
									<slot
										:name="columnKey"
										v-bind="{ cell: getRowContent(row, columnKey), row: getRawRow(row) }"
									>
										{{ getRowContent(row, columnKey) }}
									</slot>
								</component>
							</tr>
						</tbody>
					</table>
				</div>

				<div v-if="enableSelection" class="ps-4">
					<slot name="selected-row-count-label" v-bind="{ selectedCount: selectedRowCount }">
						{{ selectedRowCount }} rows selected
					</slot>
				</div>

				<app-pagination
					v-if="enablePagination"
					v-show="haveDataToDisplay"
					v-model="currentPage"
					v-bind="{ count: rowCount }"
					data-test="data-table-pagination"
				>
					<template #page-number-label="{ page }">
						<slot name="page-number-label" v-bind="{ page }" />
					</template>

					<template #next-page-label>
						<slot name="next-page-label" />
					</template>
					<template #showing-items-label="{ first, last, total }">
						<slot name="showing-items-label" v-bind="{ first, last, total }" />
					</template>
				</app-pagination>

				<alert-message v-show="!haveDataToDisplay" data-test="data-table-no-results">
					<slot name="no-results-message" v-bind="{ searchQuery }">
						No results could be found for term <span class="font-bold">"{{ searchQuery }}"</span>.
					</slot>
				</alert-message>
			</div>
		</div>
	</div>
</template>

<script setup>
import { isNonEmptyArray } from "@lewishowles/helpers/array";
import { computed, provide, ref, toRef, useId, useSlots, watch } from "vue";
import { isNonEmptySlot, runComponentMethod } from "@lewishowles/helpers/vue";
import { isNonEmptyString } from "@lewishowles/helpers/string";
import { useResizeObserver } from "@vueuse/core";

import DataTableColumns from "./fragments/data-table-columns/data-table-columns.vue";
import DataTableDensity from "./fragments/data-table-density/data-table-density.vue";
import DataTableSearch from "./fragments/data-table-search/data-table-search.vue";

import useTableColumns from "./composables/use-table-columns/use-table-columns.js";
import useTableData from "./composables/use-table-data/use-table-data.js";
import useTablePagination from "./composables/use-table-pagination/use-table-pagination.js";
import useTableSearch from "./composables/use-table-search/use-table-search.js";
import useTableSelection from "./composables/use-table-selection/use-table-selection.js";
import useTableSort, { sortDirections } from "./composables/use-table-sort/use-table-sort.js";
import { getRawRow, getRowContent, getRowId } from "./utilities/row.js";

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
	 * sortable (the default) can be ordered ascending or descending.
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
	 * Whether to enable selection. When enabled, a new column is added to the
	 * start of the table to include selection checkboxes, and v-model on the
	 * table returns the selected rows' data.
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

// The currently selected rows, if selection is enabled.
const selection = defineModel({
	type: Array,
});

const slots = useSlots();
// A reference to the search component, allowing us to focus it when necessary.
const dataTableSearchComponent = ref(null);
// Whether a name has been provided for this table.
const haveTableName = computed(() => isNonEmptyString(props.name));
// Whether to show the "display" options to the user, which require a name for
// this table.
const showUserConfiguration = computed(() => haveTableName.value);
// Whether this table includes a caption.
const haveCaption = computed(() => isNonEmptySlot(slots.caption));
// Whether this table includes a title.
const haveTitle = computed(() => isNonEmptySlot(slots["table-title"]));
// Whether this table includes an introduction.
const haveIntroduction = computed(() => isNonEmptySlot(slots["table-introduction"]));
// The available status announcement types for the live region.
const statusTypes = { SORT: "sort", SEARCH: "search", SELECTION: "selection" };
// Which type of announcement is currently active in the status live region.
const statusType = ref(null);
// A reference to the scrollable wrapper around the table, used to detect overflow.
const tableScrollWrapper = ref(null);
// Whether the table is wider than its container and requires horizontal scrolling.
const isOverflowing = ref(false);
// A stable ID linking the caption to the scrollable wrapper's aria-labelledby.
const captionId = useId();

useResizeObserver(tableScrollWrapper, () => {
	isOverflowing.value =
		tableScrollWrapper.value?.scrollWidth > tableScrollWrapper.value?.clientWidth;
});

// Table data: the provided data, transformed into the internal shape the table
// works with, and whether any valid data is present.
const { haveData, internalData } = useTableData(toRef(props, "data"), toRef(props, "columns"));

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
	name: props.name,
	haveData,
	headingClasses: toRef(props, "headingClasses"),
	cellClasses: toRef(props, "cellClasses"),
});

// Table search: the current query, whether a search is active, and the rows
// that match it.
const { filteredRows, haveSearchQuery, searchQuery } = useTableSearch(
	internalData,
	toRef(props, "columns"),
);

// Column sorting: the sort state, the sorted rows, and the sort-control helpers.
const {
	getColumnSortDirection,
	getSortIcon,
	isAscending,
	sortColumn,
	sortDirection,
	sortedColumn,
	sortedRows,
} = useTableSort(filteredRows, columnDefinitions);

/**
 * The default screen-reader instruction for a column's sort button, describing
 * the current state and the action a click will take. Overridable per column
 * via the `sort-instruction` slot for translation.
 *
 * @param  {string}  columnKey
 *     The key of the column to describe.
 */
function getSortInstruction(columnKey) {
	const direction = getColumnSortDirection(columnKey);

	if (direction === null) {
		return "(sortable — activate to sort ascending)";
	}

	if (direction === sortDirections.ASCENDING) {
		return "(sorted ascending — activate to sort descending)";
	}

	return "(sorted descending — activate to sort ascending)";
}

// Whether we have any data to display. That is, not only do we have data for
// the table, but if the user is performing a search, there are results for that
// search term.
const haveDataToDisplay = computed(() => isNonEmptyArray(filteredRows.value));

// Row selection: the selected ids, the select-all state, the selection counts,
// and the action to toggle every row. Keeps the `v-model` in sync.
const {
	areAllRowsSelected,
	selectAllIndeterminate,
	selectAllRows,
	selectedRowCount,
	selectedRowIds,
	toggleAllRows,
} = useTableSelection(internalData, filteredRows, selection, toRef(props, "enableSelection"));

// Pagination: the current page, the rows shown for that page, and the total
// row count.
const { currentPage, paginatedRows, rowCount } = useTablePagination(
	{ filteredRows, sortedRows, sortedColumn, sortDirection },
	toRef(props, "enablePagination"),
);

// Trigger a sort announcement when the sorted column or direction changes.
watch([sortedColumn, sortDirection], () => {
	if (!isNonEmptyString(sortedColumn.value)) {
		return;
	}

	statusType.value = statusTypes.SORT;
});

// Trigger a search announcement when the filtered rows or search term changes.
watch([filteredRows, haveSearchQuery], () => {
	if (!haveSearchQuery.value) {
		return;
	}

	statusType.value = statusTypes.SEARCH;
});

// Trigger a selection announcement when the selected row count changes.
watch(selectedRowCount, () => {
	if (!props.enableSelection) {
		return;
	}

	statusType.value = statusTypes.SELECTION;
});

/**
 * Set the search query to the provided value.
 *
 * @param  {string}  value
 *     The search query to set.
 */
function setSearchQuery(value) {
	if (!isNonEmptyString(value)) {
		return;
	}

	searchQuery.value = value;

	runComponentMethod(dataTableSearchComponent.value, "triggerFocus");
}

provide("data-table", {
	columnDefinitions,
	haveTableName,
	searchPlaceholder: ref(props.searchPlaceholder),
	tableName: ref(props.name),
	updateTableDensityOptions,
});

defineExpose({
	setSearchQuery,
});
</script>
