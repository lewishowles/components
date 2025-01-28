<template>
	<div data-test="data-table">
		<div v-if="haveTitle || haveIntroduction" class="mb-6 flex flex-col gap-4 border-b border-grey-200 pb-6">
			<component :is="headingLevel" v-if="haveTitle" class="text-3xl font-bold text-grey-950">
				<slot name="table-title" />
			</component>

			<slot name="table-introduction" />
		</div>

		<div class="text-sm">
			<alert-message v-if="!haveData" data-test="data-table-no-data">
				<slot name="no-data-message">
					No data to display.
				</slot>
			</alert-message>

			<div v-if="haveData" class="flex flex-col gap-6">
				<div v-if="enableSearch || showUserConfiguration" class="flex items-end gap-4">
					<data-table-search v-if="enableSearch" ref="dataTableSearchComponent" v-model="searchQuery" class="w-full">
						<template #search-label>
							<slot name="search-label" />
						</template>
						<template #reset-search-label>
							<slot name="reset-search-label" />
						</template>
					</data-table-search>

					<dropdown-menu v-if="showUserConfiguration" v-bind="{ align: 'end' }" class="ms-auto" data-test="data-table-display-options">
						<template #summary>
							<slot name="configure-label">
								Configure
							</slot>
						</template>

						<template v-if="haveTableName">
							<dropdown-menu-title>
								<slot name="display-options-label">
									Display options
								</slot>
							</dropdown-menu-title>

							<data-table-density v-model="tableDensity">
								<template v-for="key in tableDensityOptions" #[`display-option-${key}-label`] :key="key">
									<slot :name="`display-option-${key}-label`" />
								</template>
							</data-table-density>

							<dropdown-menu-title>
								<slot name="column-visibility-label">
									Columns
								</slot>
							</dropdown-menu-title>

							<data-table-columns v-model="columnVisibility" />
						</template>
					</dropdown-menu>
				</div>

				<table v-show="haveDataToDisplay" class="w-full" data-test="data-table-table">
					<caption v-if="haveCaption || (enableSort && sortedColumn)" class="text-left italic" :class="{ 'mb-2': haveCaption }">
						<slot name="caption" />

						<span class="sr-only">
							<slot name="sorted-hint" v-bind="{ sortedColumn: getColumnLabel(sortedColumn), ascending: sortDirection === 1 }">
								Sorted by {{ getColumnLabel(sortedColumn) }}
								<template v-if="sortDirection === 1">
									ascending
								</template>
								<template v-else>
									descending
								</template>
							</slot>
						</span>
					</caption>

					<thead>
						<tr class="border-b border-grey-300">
							<th v-if="enableSelection" />
							<th
								v-for="(column, columnKey) in visibleColumnDefinitions"
								:key="columnKey"
								v-bind="{ 'aria-sort': getColumnSortDirection(columnKey) }"
								class="py-4"
								:class="[{ 'ps-3': !column.sortable && !column.first, 'pe-3': !column.sortable && !column.last }, headingClasses, column.columnClasses, column.headingClasses]"
								data-test="data-table-heading"
							>
								<conditional-wrapper v-bind="{ wrap: column.sortable, tag: 'ui-button', iconEnd: getSortIcon(columnKey) }" class="-mt-4 mb-[calc(-1rem-1px)] w-full border-b border-transparent py-4 hocus:border-purple-800 hocus:bg-grey-100" :class="[{ 'ps-3': !column.first, 'pe-3': !column.last }]" data-test="data-table-sort" @click="sortColumn(columnKey)">
									<slot :name="`${columnKey}_heading`" v-bind="{ key: columnKey, label: columnKey }">
										{{ column.label }}
									</slot>
								</conditional-wrapper>
							</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="row in paginatedRows" :key="row.configuration.id" class="border-b border-grey-200 transition-colors hover:bg-grey-50" data-test="data-table-row">
							<th v-if="enableSelection">
								<form-checkbox v-bind="{ displayLabel: false, inputAttributes: { value: getRowId(row) } }" v-model="selectedIds">
									Select this row
								</form-checkbox>
							</th>
							<td v-for="(column, columnKey) in visibleColumnDefinitions" :key="columnKey" :class="[tableSpacingClasses, { 'ps-3': !column.first, 'pe-3': !column.last, 'font-semibold text-grey-950': column.primary }, cellClasses, column.columnClasses, column.cellClasses]" data-test="data-table-cell">
								<slot :name="columnKey" v-bind="{ cell: getRowContent(row, columnKey), row: getRawRow(row) }">
									{{ getRowContent(row, columnKey) }}
								</slot>
							</td>
						</tr>
					</tbody>
				</table>

				<app-pagination v-if="enablePagination" v-show="haveDataToDisplay" v-model="currentPage" v-bind="{ count: rowCount }" data-test="data-table-pagination">
					<template #page-number-page="{ page }">
						<slot name="page-number-label" v-bind="{ page }" />
					</template>

					<template #next-page-label>
						<slot name="next-page-label" />
					</template>
					<template #page-number-label>
						<slot name="page-number-label" />
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
import { arrayLength, isNonEmptyArray, sortObjectsByProperty } from "@lewishowles/helpers/array";
import { computed, provide, ref, useSlots, watch } from "vue";
import { get, isNonEmptyObject, keys } from "@lewishowles/helpers/object";
import { isFunction } from "@lewishowles/helpers/general";
import { isNonEmptySlot, runComponentMethod } from "@lewishowles/helpers/vue";
import { isNonEmptyString } from "@lewishowles/helpers/string";
import { nanoid } from "nanoid";

import DataTableColumns from "./fragments/data-table-columns/data-table-columns.vue";
import DataTableDensity from "./fragments/data-table-density/data-table-density.vue";
import DataTableSearch from "./fragments/data-table-search/data-table-search.vue";

const props = defineProps({
	/**
	 * The data to display in the table, modified by the `columns`
	 * configuration.
	 */
	data: {
		type: Array,
		default: () => ([]),
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
	 * If defined, this method is called with a `columnKey` for the current
	 * column, and `rowData` for the current row. This method is called as the
	 * table is building up its internal content. If the method returns a
	 * string, this is used as the searchable content for that column in that
	 * row, **overriding** the content of the cell. If anything else is
	 * returned, such as undefined, the original content is used instead.
	 */
	searchableContentCallback: {
		type: Function,
		default: null,
	},

	/**
	 * If defined, this method is called with a `columnKey` for the current
	 * column, and `rowData` for the current row. This method is called as the
	 * table is building up its internal content. If the method returns a
	 * string, this is used as the sortable content for that column in that row,
	 * **overriding** the content of the cell. If anything else is returned,
	 * such as undefined, the original content is used instead.
	 *
	 * The returned content is used in a `sort` method, so the returned content
	 * should make sense when sorted in that way.
	 */
	sortableContentCallback: {
		type: Function,
		default: null,
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
		default: "text-left font-bold text-grey-950",
	},

	/**
	 * Classes to apply to all standard cells in the table. Cell padding will
	 * always apply.
	 */
	cellClasses: {
		type: String,
		default: "text-grey-500",
	},
});

// The currently selected rows, if selection is enabled.
const selection = defineModel({
	type: Array,
});

const slots = useSlots();
// A reference to the search component, allowing us to focus it when necessary.
const dataTableSearchComponent = ref(null);
// The current search query, as provided by the search sub-component.
const searchQuery = ref("");
// Whether we have a search term, and thus whether the user is currently
// searching.
const haveSearchQuery = computed(() => isNonEmptyString(searchQuery.value));
// The column currently sorted. If no column is sorted (the default state), then
// data is displayed as it is provided.
const sortedColumn = ref(null);
// The direction to sort the sorted column. 1 for ascending, -1 for descending.
const sortDirection = ref(1);
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
// Our user-selected column visibility from the fragment component.
const columnVisibility = ref({});

// Our table spacing, based on our current density.
const tableSpacingClasses = computed(() => {
	switch(tableDensity.value) {
		case "compact":
			return "py-2";
		case "standard":
			return "py-3";
		default:
			return "py-4";
	}
});

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
				id: nanoid(),
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

// Our internal data, filtered to those rows matching any current search term.
const filteredRows = computed(() => {
	if (!haveData.value) {
		return [];
	}

	if (!haveSearchQuery.value) {
		return internalData.value;
	}

	const searchTerm = searchQuery.value.toLowerCase();

	return internalData.value.reduce((rows, row) => {
		const rowContent = get(row, "content");

		if (!isNonEmptyObject(rowContent)) {
			return rows;
		}

		const includesTerm = Object.entries(rowContent).some(([columnKey, cell]) => {
			// We check against false here so that the developer can exclude
			// this key and the column is searchable by default.
			const searchableColumn = get(props.columns, `${columnKey}.searchable`) !== false;

			// If this column isn't searchable, we don't need to check it.
			if (!searchableColumn) {
				return false;
			}

			const searchableContent = get(cell, "configuration.searchable");

			return isNonEmptyString(searchableContent) && searchableContent.includes(searchTerm);
		});

		// If we find the term in the searchable columns of this row, we add it
		// to our list of rows to display.
		if (includesTerm) {
			rows.push(row);
		}

		return rows;
	}, []);
});

// Our filtered rows, sorted by any currently defined sort.
const sortedRows = computed(() => {
	if (!haveData.value) {
		return [];
	}

	if (sortedColumn.value === null) {
		return filteredRows.value;
	}

	return sortObjectsByProperty(filteredRows.value, `content.${sortedColumn.value}.configuration.sortable`, { ascending: sortDirection.value === 1 });
});

// Our paginated rows, based on the current page.
const paginatedRows = ref([]);

// Whether we have any data to display. That is, not only do we have data for
// the table, but if the user is performing a search, there are results for that
// search term.
const haveDataToDisplay = computed(() => isNonEmptyArray(filteredRows.value));

// The count of rows currently included in the table.
const rowCount = computed(() => arrayLength(filteredRows.value));

// The internal IDs of the selected rows, available when the user has enabled
// row selection.
const selectedIds = ref([]);

// The rows and data that correspond to our selectedIds
const selectedRows = computed(() => {
	if (props.enableSelection !== true) {
		return [];
	}

	const internalRows = internalData.value.filter(row => selectedIds.value.includes(getRowId(row)));

	if (!isNonEmptyArray(internalRows)) {
		return [];
	}

	return internalRows.map(row => getRawRow(row));
});

// Reset to the first page when our filtered rows or sort change.
watch([filteredRows, sortedColumn, sortDirection], () => {
	currentPage.value = 1;
});

// We use a watch here, rather than another computed property, as with a
// computed property, Vue didn't seem to be detecting the changes to sortedRows,
// even though the sortedRows computed property was triggering correctly, the
// paginatedRows computed property was not.
watch([sortedRows, currentPage, sortDirection, sortedColumn], ([newSortedRows, newPage]) => {
	if (!props.enablePagination) {
		paginatedRows.value = newSortedRows;
	} else {
		const start = (newPage - 1) * 10;
		const end = start + 10;

		paginatedRows.value = newSortedRows.slice(start, end);
	}
}, { deep: true, immediate: true });

// When the selected rows change, update our model value.
watch(selectedRows, () => {
	if (props.enableSelection !== true) {
		return;
	}

	if (!isNonEmptyArray(selectedRows.value)) {
		selection.value = [];

		return;
	}

	selection.value = selectedRows.value;
});

/**
 * Get the unique ID for the given row, which is added when data is
 * internalised.
 *
 * @param  {object}  row
 *     The row data as provided to the table template.
 */
function getRowId(row) {
	return get(row, "configuration.id");
}

/**
 * Get the content for the given columnKey in the given row. This partially
 * abstracts the need for knowledge of the data structure from the table
 * template.
 *
 * @param  {object}  row
 *     The row as standardised for the table.
 * @param  {string}  columnKey
 *     The key for the column.
 */
function getRowContent(row, columnKey) {
	const cell = get(row, `content.${columnKey}.content`);

	if (!isNonEmptyString(cell)) {
		return "";
	}

	return cell;
}

/**
 * Get the searchable content of a cell; that is, either the content provided by
 * the searchable content callback, or hte lowercase content of the cell
 * itself.
 *
 * @param  {object}  row
 *     The row as standardised for the table.
 * @param  {string}  columnKey
 *     The key for the column.
 */
function getSearchableContent(row, columnKey) {
	let searchableContent = row[columnKey];

	if (!isNonEmptyString(searchableContent)) {
		searchableContent = "";
	}

	if (isFunction(props.searchableContentCallback)) {
		const callbackResponse = props.searchableContentCallback(columnKey, row);

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
 * the sortable content callback, or hte lowercase content of the cell
 * itself.
 *
 * @param  {object}  row
 *     The row as standardised for the table.
 * @param  {string}  columnKey
 *     The key for the column.
 */
function getSortableContent(row, columnKey) {
	let sortableContent = row[columnKey];

	if (isFunction(props.sortableContentCallback)) {
		const callbackResponse = props.sortableContentCallback(columnKey, row);

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
 * Get the raw content of the row, as it would have been provided to this
 * component. This removes the need for users creating custom cell templates to
 * understand the internal data-table structure.
 *
 * @param  {object}  row
 *     The standardised row data, as generated by the data-table component.
 */
function getRawRow(row) {
	return get(row, "raw");
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
 * Sort the given column key. This will reset any other column sorting. If the
 * same column is already sorted, the direction will be reversed.
 *
 * @param  {string}  columnKey
 *     The key of the column to sort.
 */
function sortColumn(columnKey) {
	if (!isNonEmptyString(columnKey)) {
		return;
	}

	if (!Object.hasOwn(columnDefinitions.value, columnKey)) {
		return;
	}

	if (sortedColumn.value === columnKey) {
		sortDirection.value = sortDirection.value * -1;

		return;
	}

	sortedColumn.value = columnKey;
	sortDirection.value = 1;
}

/**
 * Retrieve the appropriate sort direction label for a given column by its key.
 * If the column is not sorted, returns null.
 *
 * @param  {string}  columnKey
 *     The key of the column to check.
 */
function getColumnSortDirection(columnKey) {
	if (columnKey !== sortedColumn.value) {
		return null;
	}

	if (sortDirection.value === 1) {
		return "ascending";
	}

	return "descending";
}

/**
 * Retrieve the appropriate sort icon for a given column by its key, depending
 * on whether that column is currently sorted.
 *
 * @param  {string}  columnKey
 *     The key of the column to check.
 */
function getSortIcon(columnKey) {
	if (sortedColumn.value !== columnKey) {
		return null;
	}

	if (sortDirection.value == -1) {
		return "icon-arrow-up";
	}

	return "icon-arrow-down";
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
