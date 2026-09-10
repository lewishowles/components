<!-- Exercise the data-table toolbar with a container-query control in its post-search slot. -->
<template>
	<data-table-toolbar v-bind="toolbarProps">
		<template #post-search>
			<form-button-group
				v-model="resultFilter"
				name="result-filter"
				:options="['All', 'Favourites', 'Recent']"
			>
				Filter results
			</form-button-group>
		</template>

		<template #search-help>Search by title or release year.</template>
	</data-table-toolbar>
</template>

<script setup>
import { provide, ref } from "vue";

import DataTableToolbar from "../fragments/data-table-toolbar/data-table-toolbar.vue";
import FormButtonGroup from "../../../form/form-button-group/form-button-group.vue";

// The post-search control's selected option.
const resultFilter = ref("Favourites");
// Keeps the configuration control present, so the toolbar renders both clusters.
const haveTableName = ref(true);

provide("data-table", {
	haveTableName,
	tableName: ref("movies"),
	searchPlaceholder: ref("Search movies"),
	columnDefinitions: ref({
		title: { label: "Title", first: true, last: false, sortable: true },
		release_year: { label: "Release year", first: false, last: true, sortable: true },
	}),
	updateTableDensityOptions: () => {},
});

// Toolbar inputs the injected context does not supply.
const toolbarProps = {
	tableDensityOptions: ["compact", "standard", "relaxed"],
	columnVisibility: { title: true, release_year: true },
	enableSearch: true,
};
</script>
