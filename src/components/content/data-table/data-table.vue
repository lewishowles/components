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
					<form-input
						v-if="enableSearch"
						ref="searchQueryInput"
						v-bind="{ placeholder: searchPlaceholder }"
						v-model="searchQuery"
						class="w-full max-w-sm"
						data-test="data-table-search"
					>
						<slot name="search-label">
							Search
						</slot>
					</form-input>

					<ui-button v-show="haveSearchQuery" class="button--muted" data-test="data-table-reset-search-button" @click="resetSearchQuery">
						<slot name="reset-search-label">
							Reset search
						</slot>
					</ui-button>

					<dropdown-menu v-if="showUserConfiguration" v-bind="{ align: 'end' }" class="ms-auto" data-test="data-table-display-options">
						<template #summary>
							<slot name="display-options-label">
								Display options
							</slot>
						</template>

						<template v-for="({ label, value }) in tableDensityOptions" :key="value">
							<dropdown-menu-button v-bind="{ iconStart: `icon-density-${value}`, selected: tableDensity === value }" :data-test="`data-table-density-${value}`" @click="setTableDensity(value)">
								<slot :name="`display-option-${value}-label`">
									{{ label }}
								</slot>
							</dropdown-menu-button>
						</template>
					</dropdown-menu>
				</div>

				<table v-show="haveDataToDisplay" class="w-full" data-test="data-table-table">
					<thead>
						<tr class="border-b border-grey-300">
							<th v-for="(column, columnKey) in columnDefinitions" :key="columnKey" class="py-4" :class="[{ 'ps-3': !column.sortable && !column.first, 'pe-3': !column.sortable && !column.last }, headingClasses, column.columnClasses, column.headingClasses]" data-test="data-table-heading">
								<conditional-wrapper v-bind="{ wrap: column.sortable, tag: 'ui-button', iconEnd: getSortIcon(columnKey) }" class="-mt-4 mb-[calc(-1rem-1px)] w-full border-b border-transparent py-4 hocus:border-purple-800 hocus:bg-grey-100" :class="[{ 'ps-3': !column.first, 'pe-3': !column.last }]" data-test="data-table-sort" @click="sortColumn(columnKey)">
									<slot :name="`${columnKey}_heading`" v-bind="{ key: columnKey, label: columnKey }">
										{{ column.label }}
									</slot>
								</conditional-wrapper>
							</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="row in sortedRows" :key="row.configuration.id" class="border-b border-grey-200" data-test="data-table-row">
							<td v-for="(column, columnKey) in columnDefinitions" :key="columnKey" :class="[tableSpacingClasses, { 'ps-3': !column.first, 'pe-3': !column.last, 'font-semibold text-grey-950': column.primary }, cellClasses, column.columnClasses, column.cellClasses]" data-test="data-table-cell">
								<slot :name="columnKey" v-bind="{ cell: getRowContent(row, columnKey), row: getRawRow(row) }">
									{{ getRowContent(row, columnKey) }}
								</slot>
							</td>
						</tr>
					</tbody>
				</table>

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
import { computed, ref, useSlots } from "vue";
import { get, isNonEmptyObject, keys } from "@lewishowles/helpers/object";
import { isFunction } from "@lewishowles/helpers/general";
import { isNonEmptyArray, sortObjectsByProperty } from "@lewishowles/helpers/array";
import { isNonEmptySlot, runComponentMethod } from "@lewishowles/helpers/vue";
import { isNonEmptyString } from "@lewishowles/helpers/string";
import { nanoid } from "nanoid";
import { useStorage } from "@vueuse/core";

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
	 * `localStorage`, prefixed with `data-table:`, so should be safe to be
	 * viewed by users.
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

const slots = useSlots();
// The current search query.
const searchQuery = ref("");
// The search query input, allowing us to focus it when necessary.
const searchQueryInput = ref(null);
// Whether we have a search term, and thus whether the user is currently
// searching.
const haveSearchQuery = computed(() => isNonEmptyString(searchQuery.value));
// The column currently sorted. If no column is sorted (the default state), then
// data is displayed as it is provided.
const sortedColumn = ref(null);
// The direction to sort the sorted column. 1 for ascending, -1 for descending.
const sortDirection = ref(1);
// Whether a name has been provided for this table.
const haveTableName = computed(() => isNonEmptyString(props.name));
// Whether to show the "display" options to the user, which require a name for
// this table.
const showUserConfiguration = computed(() => haveTableName.value);
// Whether this table includes a title.
const haveTitle = computed(() => isNonEmptySlot(slots["table-title"]));
// Whether this table includes an introduction.
const haveIntroduction = computed(() => isNonEmptySlot(slots["table-introduction"]));
// Our user-selected table density.
const tableDensity = haveTableName.value && useStorage(`data-table:${props.name}:density`, "relaxed");

// Available table densities.
const tableDensityOptions = ref([
	{ label: "Compact", value: "compact" },
	{ label: "Standard", value: "standard" },
	{ label: "Relaxed", value: "relaxed" },
]);

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

// Whether we have any data to display. That is, not only do we have data for
// the table, but if the user is performing a search, there are results for that
// search term.
const haveDataToDisplay = computed(() => isNonEmptyArray(filteredRows.value));

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

		if (get(userConfiguration, "hidden") === true) {
			return columns;
		}

		columns[columnKey] = {
			label: columnKey,
			first: false,
			last: false,
			sortable: true,
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
 * Set the table density based on user choice.
 *
 * @param  {string}  density
 *     The density setting.
 */
function setTableDensity(density) {
	if (!isNonEmptyString(density)) {
		return;
	}

	const isValidDensity = tableDensityOptions.value.map(option => option.value).includes(density);

	if (!isValidDensity) {
		return;
	}

	tableDensity.value = density;
}

/**
 * Focus on the search input.
 */
function focusSearchInput() {
	runComponentMethod(searchQueryInput.value, "triggerFocus");
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

	focusSearchInput();
}

/**
 * Clear any current search query.
 */
function resetSearchQuery() {
	searchQuery.value = "";

	focusSearchInput();
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

defineExpose({
	setSearchQuery,
});
</script>
