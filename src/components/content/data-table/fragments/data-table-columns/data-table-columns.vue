<template>
	<div class="py-1" data-test="data-table-columns">
		<form-checkbox
			v-for="column in columns"
			:key="column.key"
			v-model="columnVisibility[column.key]"
			class="px-4 py-1"
			data-test="data-table-columns-checkbox"
		>
			{{ column.label }}
		</form-checkbox>
	</div>
</template>

<script setup>
import { computed, inject } from "vue";

const { columnDefinitions } = inject("data-table", {});

// Our user-selected column visibility.
const columnVisibility = defineModel({
	type: Object,
});

// A simplified list of columns, as extracted from columnDefinitions.
const columns = computed(() => {
	const columns = [];

	for (const columnKey in columnDefinitions.value) {
		if (!Object.prototype.hasOwnProperty.call(columnDefinitions.value, columnKey)) {
			continue;
		}

		const definition = columnDefinitions.value[columnKey];

		columns.push({ key: columnKey, label: definition.label });
	}

	return columns;
});
</script>
