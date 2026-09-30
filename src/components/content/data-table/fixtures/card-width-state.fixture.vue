<template>
	<div>
		<data-table
			v-bind="{ columns, data, error, loading, totalRows }"
			v-model="selection"
			v-model:state="state"
			enable-selection
			mode="server"
			row-key="uuid"
			@update:model-value="selectionUpdateCount += 1"
			@update:state="stateUpdateCount += 1"
		/>

		<output data-test="data-table-card-width-state">{{ JSON.stringify(state) }}</output>
		<output data-test="data-table-card-width-selection">{{ JSON.stringify(selection) }}</output>
		<output data-test="data-table-card-width-state-updates">{{ stateUpdateCount }}</output>
		<output data-test="data-table-card-width-selection-updates">{{ selectionUpdateCount }}</output>
	</div>
</template>

<script setup>
// This fixture shows the table's selection, state and update counts on the page, so a test can
// check that changing the table's width between cards and columns keeps state and emits nothing.
import { ref, watch } from "vue";
import DataTable from "../data-table.vue";

// The two columns shown for each row.
const columns = {
	title: { label: "Title", primary: true },
	email: { label: "Email" },
};

// The rows the pretend server returns for the first page.
const pageOne = [
	{ uuid: "server-a", title: "Zulu", email: "zulu@example.com" },
	{ uuid: "server-b", title: "Alpha", email: "alpha@example.com" },
];

// The rows the pretend server returns for the second page.
const pageTwo = [
	{ uuid: "server-c", title: "Charlie", email: "charlie@example.com" },
	{ uuid: "server-d", title: "Delta", email: "delta@example.com" },
];

// The rows currently shown, swapped when the page changes.
const data = ref(pageOne);
// The pretend server never fails, so the table shows no error.
const error = ref(null);
// The pretend server answers straight away, so the table never shows its loading state.
const loading = ref(false);
// The keys of the selected rows.
const selection = ref([]);
// The table's page, sort and search state.
const state = ref({ page: 1, itemsPerPage: 2, sort: null, filters: { search: "" } });
// How many times the table has sent a state update.
const stateUpdateCount = ref(0);
// How many times the table has sent a selection update.
const selectionUpdateCount = ref(0);
// The total row count a real server would report, so pagination offers more than one page.
const totalRows = 20;

// Swaps in the matching rows when the table asks for another page, as a server would.
watch(
	() => state.value.page,
	(page) => {
		data.value = page === 2 ? pageTwo : pageOne;
	},
);
</script>
