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
import { arrayLength, isNonEmptyArray } from "@lewishowles/helpers/array";
import { computed, provide, ref, toRef, useId, useSlots, watch } from "vue";
import { cn } from "@/utilities/cn.js";
import { get, isNonEmptyObject, keys } from "@lewishowles/helpers/object";
import { isFunction } from "@lewishowles/helpers/general";
import { isNonEmptySlot, runComponentMethod } from "@lewishowles/helpers/vue";
import { isNonEmptyString } from "@lewishowles/helpers/string";
import { useResizeObserver, useStorage } from "@vueuse/core";

import DataTableColumns from "./fragments/data-table-columns/data-table-columns.vue";
import DataTableDensity from "./fragments/data-table-density/data-table-density.vue";
import DataTableSearch from "./fragments/data-table-search/data-table-search.vue";

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
// The current page of results being viewed.
const currentPage = ref(1);
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
// Our user-selected table density from the fragment component.
const tableDensity = ref(null);
// Our available table density options, as provided by the `data-table-density`
// sub-component. This means we can provide slots for their labels, without
// having to know what those available densities are from this component.
const tableDensityOptions = ref([]);

// The stored user-selected column visibility for this table.
const userColumnVisibility = haveTableName.value
	? useStorage(`data-table:${props.name}:columns`, {})
	: ref({});

// Our user-selected column visibility.
const columnVisibility = ref({});
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

// Initialise the table with stored column visibility before the menu opens.
initialiseColumnVisibility();

// Our table spacing, based on our current density.
const tableSpacingClasses = computed(() => {
	switch (tableDensity.value) {
		case "compact":
			return "py-2";
		case "standard":
			return "py-3";
		default:
			return "py-4";
	}
});

/**
 * Merge table-level and column-level heading classes, with column-level
 * classes taking precedence.
 *
 * @param  {object}  column
 *     The column definition.
 */
function getHeadingClasses(column) {
	return cn(props.headingClasses, column.columnClasses, column.headingClasses);
}

/**
 * Merge table-level and column-level cell classes, with column-level classes
 * taking precedence.
 *
 * @param  {object}  column
 *     The column definition.
 */
function getCellClasses(column) {
	return cn(tableSpacingClasses.value, props.cellClasses, column.columnClasses, column.cellClasses);
}

// A list of columns to display in the table, taking into account validation,
// and containing the relevant data. We base these columns on those provided by
// the user, which means that any column not configured will not be displayed by
// default.
const columnDefinitions = computed(() => {
	if (!haveData.value || !isNonEmptyObject(props.columns)) {
		return {};
	}

	const columns = keys(props.columns).reduce((columns, columnKey) => {
		const userConfiguration = get(props.columns, columnKey) || {};

		// If this column is hidden by configuration, we don't add it at all.
		const hiddenByConfiguration = get(userConfiguration, "hidden") === true;

		if (hiddenByConfiguration) {
			return columns;
		}

		// However, if this column is hidden by the user's preferences, we want
		// to add it (as that preference may change, and we want to show the
		// checkbox), but we want to mark it as hidden.

		const hiddenByPreference = get(columnVisibility.value, columnKey) === false;

		columns[columnKey] = {
			label: columnKey,
			first: false,
			last: false,
			sortable: true,
			tabularNums: false,
			visible: !hiddenByPreference,
			...userConfiguration,
		};

		return columns;
	}, {});

	// After we determine which columns are present, we need to determine which
	// column is first and which is last, as columns may have been removed or
	// re-ordered by configuration.
	const columnKeys = keys(columns);

	if (columnKeys.length > 0) {
		columns[columnKeys[0]].first = true;
		columns[columnKeys[columnKeys.length - 1]].last = true;
	}

	return columns;
});

// Our column definitions, limited to those that are visible.
const visibleColumnDefinitions = computed(() => {
	return keys(columnDefinitions.value).reduce((columns, columnKey) => {
		const column = columnDefinitions.value[columnKey];

		if (column.visible) {
			columns[columnKey] = column;
		}

		return columns;
	}, {});
});

// Transform the provided data into something more suitable for display in our
// table. This includes adding cell configuration for internal tracking, and
// removing any rows that seem to be invalid.
const internalData = computed(() => {
	if (!isNonEmptyArray(props.data)) {
		return [];
	}

	return props.data.reduce((data, row) => {
		if (!isNonEmptyObject(row)) {
			return data;
		}

		// We update the structure of our data, allowing for both row and cell
		// configuration in addition to the provided data, but we avoid the user
		// having to know what that structure is.
		const rowContent = keys(row).reduce((rowData, columnKey) => {
			rowData[columnKey] = {
				configuration: {
					searchable: getSearchableContent(row, columnKey),
					sortable: getSortableContent(row, columnKey),
				},
				content: row[columnKey],
			};

			return rowData;
		}, {});

		data.push({
			configuration: {
				id: crypto.randomUUID(),
			},
			content: rowContent,
			raw: row,
		});

		return data;
	}, []);
});

// Whether we have any data for our table. That is, the provided data was
// validated and contains a non-empty array of at least one object.
const haveData = computed(() => isNonEmptyArray(internalData.value));

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

// Our paginated rows, based on the current page.
const paginatedRows = ref([]);
// Whether we have any data to display. That is, not only do we have data for
// the table, but if the user is performing a search, there are results for that
// search term.
const haveDataToDisplay = computed(() => isNonEmptyArray(filteredRows.value));
// The count of rows currently included in the table.
const rowCount = computed(() => arrayLength(filteredRows.value));

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

// Reset to the first page when our filtered rows or sort change.
watch([filteredRows, sortedColumn, sortDirection], () => {
	currentPage.value = 1;
});

// We use a watch here, rather than another computed property, as with a
// computed property, Vue didn't seem to be detecting the changes to sortedRows,
// even though the sortedRows computed property was triggering correctly, the
// paginatedRows computed property was not.
watch(
	[sortedRows, currentPage, sortDirection, sortedColumn],
	([newSortedRows, newPage]) => {
		if (!props.enablePagination) {
			paginatedRows.value = newSortedRows;
		} else {
			const start = (newPage - 1) * 10;
			const end = start + 10;

			paginatedRows.value = newSortedRows.slice(start, end);
		}
	},
	{ deep: true, immediate: true },
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

// Persist column visibility when users change the table configuration.
watch(
	columnVisibility,
	() => {
		userColumnVisibility.value = columnVisibility.value;
	},
	{ deep: true },
);

/**
 * Initialise column visibility based on any stored values.
 */
function initialiseColumnVisibility() {
	if (!isNonEmptyObject(props.columns)) {
		return;
	}

	const visibility = {};

	for (const columnKey of keys(props.columns)) {
		const userConfiguration = get(props.columns, columnKey) || {};
		const hiddenByConfiguration = get(userConfiguration, "hidden") === true;

		if (hiddenByConfiguration) {
			continue;
		}

		visibility[columnKey] = true;

		if (Object.hasOwn(userColumnVisibility.value, columnKey)) {
			visibility[columnKey] = userColumnVisibility.value[columnKey];
		}
	}

	columnVisibility.value = visibility;
	userColumnVisibility.value = visibility;
}

/**
 * Get the searchable content of a cell; that is, either the content provided by
 * the column searchable content callback, or the lowercase content of the cell
 * itself.
 *
 * @param  {object}  row
 *     The raw row provided to the table.
 * @param  {string}  columnKey
 *     The key for the column.
 */
function getSearchableContent(row, columnKey) {
	let searchableContent = row[columnKey];

	if (!isNonEmptyString(searchableContent)) {
		searchableContent = "";
	}

	const searchableContentCallback = props.columns[columnKey]?.searchableContentCallback;

	if (isFunction(searchableContentCallback)) {
		const callbackResponse = searchableContentCallback(columnKey, row);

		if (isNonEmptyString(callbackResponse)) {
			searchableContent = callbackResponse;
		}
	}

	if (isNonEmptyString(searchableContent)) {
		searchableContent = searchableContent.toLowerCase();
	}

	return searchableContent;
}

/**
 * Get the sortable content of a cell; that is, either the content provided by
 * the column sortable content callback, or the lowercase content of the cell
 * itself.
 *
 * @param  {object}  row
 *     The raw row provided to the table.
 * @param  {string}  columnKey
 *     The key for the column.
 */
function getSortableContent(row, columnKey) {
	let sortableContent = row[columnKey];

	const sortableContentCallback = props.columns[columnKey]?.sortableContentCallback;

	if (isFunction(sortableContentCallback)) {
		const callbackResponse = sortableContentCallback(columnKey, row);

		if (isNonEmptyString(callbackResponse)) {
			sortableContent = callbackResponse;
		}
	}

	if (isNonEmptyString(sortableContent)) {
		sortableContent = sortableContent.toLowerCase();
	}

	return sortableContent;
}

/**
 * Retrieve the label for the given column key from the column definitions.
 *
 * @param  {string}  columnKey
 *     The column key to retrieve the label for.
 */
function getColumnLabel(columnKey) {
	return get(columnDefinitions.value, `${columnKey}.label`);
}

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

/**
 * Update our local table density options, which allows us to provide slots to
 * overwrite the labels, particularly useful for translation.
 */
function updateTableDensityOptions(options) {
	if (!isNonEmptyArray(options)) {
		return;
	}

	tableDensityOptions.value = options;
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
