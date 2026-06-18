<template>
	<data-table v-bind="{ data, columns }" />
</template>

<script setup>
import DataTable from "./data-table.vue";

// Normalises cell and query by stripping whitespace before comparing, allowing
// "AB23456" to match a cell value of "AB23 456".
function searchCallback({ cell, searchQuery }) {
	const normalise = (value) => value.replace(/\s+/g, "").toLowerCase();

	return normalise(cell).includes(normalise(searchQuery));
}

const columns = {
	title: { label: "Title", primary: true, searchCallback },
	release_year: { label: "Release year" },
	box_office: { label: "Box office ($m)" },
};

const data = [{ id: "ab1", title: "AB23 456", release_year: "2026", box_office: "0" }];
</script>
