<template>
	<data-table-density />
</template>

<script setup>
import DataTableDensity from "./fragments/data-table-density/data-table-density.vue";
import { provide, ref } from "vue";

const tableName = ref("sample-table");
const haveTableName = ref(true);

provide("data-table", {
	tableName,
	haveTableName,
	updateTableDensityOptions: () => {},
});
</script>
