<template>
	<data-table-toolbar v-bind="toolbarProps">
		<template v-if="$slots['configure-label']" #configure-label>
			<slot name="configure-label" />
		</template>
	</data-table-toolbar>
</template>

<script setup>
import DataTableToolbar from "./fragments/data-table-toolbar/data-table-toolbar.vue";
import { computed, provide, ref } from "vue";

const props = defineProps({
	/**
	 * Whether the table has a name, controlling display options visibility.
	 */
	haveTableName: {
		type: Boolean,
		default: true,
	},
	/**
	 * Whether the search input is shown.
	 */
	enableSearch: {
		type: Boolean,
		default: true,
	},
});

const columnDefinitions = ref({
	title: { label: "Title", first: true, last: false, sortable: true },
	release_year: { label: "Release year", first: false, last: true, sortable: true },
});

// Reactive wrapper so the toolbar and its children re-render when the prop changes.
const haveTableName = computed(() => props.haveTableName);

provide("data-table", {
	haveTableName,
	tableName: ref("movies"),
	searchPlaceholder: ref("Search movies"),
	columnDefinitions,
	updateTableDensityOptions: () => {},
});

const toolbarProps = computed(() => ({
	tableDensityOptions: ["compact", "standard", "relaxed"],
	columnVisibility: { title: true, release_year: true },
	enableSearch: props.enableSearch,
}));
</script>
