<template>
	<div class="text-sm" data-test="data-table">
		<alert-message v-if="!haveData" data-test="data-table-no-data">
			<slot name="no-data-message">
				No data to display.
			</slot>
		</alert-message>

		<div class="flex flex-col gap-6">
			<form-input v-if="enableSearch" v-model="searchQuery" class="w-full max-w-sm" data-test="data-table-search">
				Search
			</form-input>

			<table v-show="haveDataToDisplay" class="w-full" data-test="data-table-table">
				<thead>
					<tr class="border-b border-grey-300">
						<th v-for="(column, columnKey) in columnDefinitions" :key="columnKey" :class="['py-4', { 'ps-3': !column.first, 'pe-3': !column.last }, headingClasses, column.columnClasses, column.headingClasses]" data-test="data-table-heading">
							<slot :name="`${columnKey}_heading`" v-bind="{ key: columnKey, label: columnKey }">
								{{ column.label }}
							</slot>
						</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="row in filteredRows" :key="row.configuration.id" class="border-b border-grey-200" data-test="data-table-row">
						<td v-for="(column, columnKey) in columnDefinitions" :key="columnKey" :class="['py-4', { 'ps-3': !column.first, 'pe-3': !column.last }, cellClasses, column.columnClasses, column.cellClasses]" data-test="data-table-cell">
							<slot :name="columnKey" v-bind="{ cell: row.content[columnKey], row: row.content }">
								{{ row.content[columnKey] }}
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
</template>

<script setup>
import { computed, ref } from "vue";
import { get, isNonEmptyObject } from "@lewishowles/helpers/object";
import { isNonEmptyArray } from "@lewishowles/helpers/array";
import { isNonEmptyString } from "@lewishowles/helpers/string";
import { nanoid } from "nanoid";

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
	 * Whether to enable the table search. When enabled, anything typed into the
	 * search box will search the text for each cell case-insensitively, and
	 * hide any rows where none of the cells match.
	 */
	enableSearch: {
		type: Boolean,
		default: true,
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

// The current search query.
const searchQuery = ref("");

// Whether we have a search term, and thus whether the user is currently
// searching.
const haveSearchQuery = computed(() => isNonEmptyString(searchQuery.value));

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

		// We update the structure of our data, allowing for cell configuration
		// in addition to the provided data.
		data.push({
			configuration: {
				id: nanoid(),
			},
			content: row,
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

	return internalData.value.reduce((rows, row) => {
		const rowContent = get(row, "content");

		if (!isNonEmptyObject(rowContent)) {
			return rows;
		}

		const rowValues = Object.values(rowContent);
		const searchTerm = searchQuery.value.toLowerCase();

		if (rowValues.some(cell => cell.toLowerCase().includes(searchTerm))) {
			rows.push(row);
		}

		return rows;
	}, []);
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

	const columns = Object.keys(props.columns).reduce((columns, columnKey) => {
		const userConfiguration = get(props.columns, columnKey) || {};

		if (get(userConfiguration, "hidden") === true) {
			return columns;
		}

		columns[columnKey] = {
			label: columnKey,
			first: false,
			last: false,
			...userConfiguration,
		};

		return columns;
	}, {});

	// After we determine which columns are present, we need to determine which
	// column is first and which is last, as columns may have been removed or
	// re-ordered by configuration.
	const columnKeys = Object.keys(columns);

	if (columnKeys.length > 0) {
		columns[columnKeys[0]].first = true;
		columns[columnKeys[columnKeys.length - 1]].last = true;
	}

	return columns;
});
</script>
