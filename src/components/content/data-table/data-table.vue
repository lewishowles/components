<template>
	<div data-test="data-table">
		<alert-message v-if="!haveData" data-test="data-table-no-data">
			<slot name="no-data-message">
				No data to display.
			</slot>
		</alert-message>

		<table v-if="haveData" class="w-full" data-test="data-table-table">
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
				<tr v-for="row in internalData" :key="row.configuration.id" class="border-b border-grey-200" data-test="data-table-row">
					<td v-for="(column, columnKey) in columnDefinitions" :key="columnKey" :class="['py-4', { 'ps-3': !column.first, 'pe-3': !column.last }, cellClasses, column.columnClasses, column.cellClasses]" data-test="data-table-cell">
						<slot :name="columnKey" v-bind="{ cell: row.content[columnKey], row: row.content }">
							{{ row.content[columnKey] }}
						</slot>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script setup>
import { computed } from "vue";
import { isNonEmptyArray } from "@lewishowles/helpers/array";
import { get, isNonEmptyObject } from "@lewishowles/helpers/object";
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

// Whether we have any data to display. That is, the provided data was validated
// and contains a non-empty array of at least one object.
const haveData = computed(() => isNonEmptyArray(internalData.value));

// A list of columns to display in the table, taking into account validation,
// and containing the relevant data. We base these columns on those provided by
// the user, which means that any column not configured will not be displayed by
// default.
const columnDefinitions = computed(() => {
	if (!haveData.value || !isNonEmptyObject(props.columns)) {
		return {};
	}

	return Object.keys(props.columns).reduce((columns, columnKey, index, array) => {
		const userConfiguration = get(props.columns, columnKey) || {};

		columns[columnKey] = {
			label: columnKey,
			first: index === 0,
			last: index === array.length - 1,
			...userConfiguration,
		};

		return columns;
	}, {});
});
</script>
