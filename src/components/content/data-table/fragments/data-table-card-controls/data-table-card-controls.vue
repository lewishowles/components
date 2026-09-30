<template>
	<div
		v-if="(enableSort && sortableColumns.length) || enableSelection"
		class="hidden flex-col gap-3 @max-xl/data-table:mbe-3 @max-xl/data-table:flex"
		data-part="card-controls"
		data-test="data-table-card-controls"
	>
		<div v-if="enableSort && sortableColumns.length" class="flex min-w-0 flex-1 items-end gap-2">
			<form-select
				v-model="selectedSortColumn"
				v-bind="{ allowEmpty: !sortedColumn, options: sortableColumns }"
				class="min-w-0 flex-1"
				data-test="data-table-card-sort-column"
			>
				<slot name="sort-by-label">Sort by</slot>
			</form-select>

			<ui-button
				v-if="sortedColumn"
				class="button--muted shrink-0"
				data-test="data-table-card-sort-direction"
				@click="sortColumn(sortedColumn)"
			>
				<span class="sr-only"><slot name="sort-direction-label">Sort direction:</slot></span>
				{{ " " }}
				<slot v-if="isAscending" name="sort-ascending-label">Ascending</slot>
				<slot v-else name="sort-descending-label">Descending</slot>
			</ui-button>
		</div>

		<form-checkbox
			v-if="enableSelection"
			v-model="selectAllRows"
			v-bind="{ indeterminate: selectAllIndeterminate, showOptionalIndicator: false }"
			data-test="data-table-card-select-all-rows"
			@change="toggleAllRows"
		>
			<slot name="select-all-rows-label">Select all rows</slot>
		</form-checkbox>
	</div>
</template>

<script setup>
import { computed, inject } from "vue";

// The card controls use the same state and actions as the table headings.
const {
	enableSelection,
	enableSort,
	isAscending,
	selectAllIndeterminate,
	selectAllRows,
	sortColumn,
	sortedColumn,
	toggleAllRows,
	visibleColumnDefinitions,
} = inject("data-table");

// The visible columns that can be sorted, offered as options in the sort select.
const sortableColumns = computed(() =>
	Object.entries(visibleColumnDefinitions.value)
		.filter(([, column]) => column.sortable)
		.map(([value, column]) => ({ label: column.label, value })),
);

// The column chosen in the sort select, which is empty until the table has been sorted.
// Choosing the column that is already sorted does nothing, because `sortColumn` would
// reverse its direction instead.
const selectedSortColumn = computed({
	get: () => sortedColumn.value ?? "",
	set: (columnKey) => {
		if (columnKey && columnKey !== sortedColumn.value) {
			sortColumn(columnKey);
		}
	},
});
</script>
