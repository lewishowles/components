<template>
	<div>
		<data-table
			v-bind="{ columns, data, error, loading, totalRows }"
			v-model:state="state"
			enable-selection
			mode="server"
			row-key="uuid"
		/>

		<output data-test="data-table-server-state">{{ JSON.stringify(state) }}</output>
	</div>
</template>

<script setup>
import { ref, watch } from "vue";
import DataTable from "../data-table.vue";

const columns = {
	title: { label: "Title", primary: true },
	email: { label: "Email" },
};

const serverPageOne = [
	{ uuid: "server-a", title: "Zulu", email: "zulu@example.com" },
	{ uuid: "server-b", title: "Alpha", email: "alpha@example.com" },
];

const serverPageTwo = [
	{ uuid: "server-c", title: "Charlie", email: "charlie@example.com" },
	{ uuid: "server-d", title: "Delta", email: "delta@example.com" },
];

const data = ref(serverPageOne);
const error = ref(null);
const loading = ref(false);

const state = ref({
	page: 1,
	itemsPerPage: 2,
	sort: null,
	filters: { search: "" },
});

const totalRows = 20;

watch(
	() => state.value.page,
	(page) => {
		data.value = page === 2 ? serverPageTwo : serverPageOne;
	},
);
</script>
