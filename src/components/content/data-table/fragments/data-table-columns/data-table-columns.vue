<template>
	<div class="py-1" data-test="data-table-columns">
		<dropdown-menu-checkbox v-for="column in columns" :key="column.key" v-model="columnVisibility[column.key]" data-test="data-table-columns-checkbox">
			{{ column.label }}
		</dropdown-menu-checkbox>
	</div>
</template>

<script setup>
import { computed, inject, watch } from "vue";
import { isNonEmptyArray } from "@lewishowles/helpers/array";
import { isObject } from "@lewishowles/helpers/object";
import { useStorage } from "@vueuse/core";

const { tableName, haveTableName, columnDefinitions } = inject("data-table");

// The user selected column visibility. We know we will have a table name
// because this component isn't activated without it, but we check it just in
// case.
const userColumnVisibility = haveTableName.value && useStorage(`data-table:${tableName.value}:columns`, {});

// Our user-selected table density.
const columnVisibility = defineModel({
	type: Object,
});

// A simplified list of columns, as extracted from columnDefinitions.
const columns = computed(() => {
	const columns = [];

	for (const columnKey in columnDefinitions.value) {
		if (Object.prototype.hasOwnProperty.call(columnDefinitions.value, columnKey)) {
			const definition = columnDefinitions.value[columnKey];

			columns.push({ key: columnKey, label: definition.label });
		}
	}

	return columns;
});

// Initialise our column visibility.
initialiseColumnVisibility();

/**
 * Initialise column visibility based on any stored values.
 */
function initialiseColumnVisibility() {
	if (!isNonEmptyArray(columns.value)) {
		return;
	}

	if (!isObject(columnVisibility.value)) {
		columnVisibility.value = {};
	}

	// Initialise our columns with default visibility, selecting user values as
	// preference.
	for (const column of columns.value) {
		columnVisibility.value[column.key] = true;

		if (Object.hasOwn(userColumnVisibility.value, column.key)) {
			columnVisibility.value[column.key] = userColumnVisibility.value[column.key];
		}
	}

	// Remove any columns no longer found.
	for (const columnKey in columnVisibility.value) {
		if (!columns.value.find(column => column.key === columnKey)) {
			delete columnVisibility.value[columnKey];
		}
	}
}

watch(columnVisibility, () => {
	userColumnVisibility.value = columnVisibility.value;
}, { deep: true });
</script>
