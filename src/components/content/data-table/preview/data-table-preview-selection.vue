<template>
	<data-table v-bind="{ data, columns, enableSelection: true }" v-model="selectedRows" />

	<pre>{{ { selectedRows } }}</pre>
</template>

<script setup>
import { ref } from "vue";

const data = [
	{
		id: "2e644b4b-51e8-4519-ab31-d9a37e2d0434",
		title: "Toy Story",
		release_year: "1995",
		box_office: "373.6",
	},
	{
		id: "da9eff2a-c10e-42a3-ab3f-9f252c574384",
		title: "Aladdin",
		release_year: "1992",
		box_office: "1,054.0",
	},
	{
		id: "3ffd9ae1-ef4f-4f6e-b408-a2c5b58a3305",
		title: "The Lion King",
		release_year: "1994",
		box_office: "968.5",
	},
	{
		id: "3ffd9ae1-ef4f-4f6e-b408-a2c5b58a3305",
		title: "The Emperor's New Groove",
		release_year: "2000",
		box_office: "169.3",
	},
	{
		id: "3ffd9ae1-ef4f-4f6e-b408-a2c5b58a3305",
		title: "Up",
		release_year: "2009",
		box_office: "735.1",
	},
];

const columns = {
	title: {
		label: "Title",
		primary: true,
	},
	release_year: {
		label: "Release year",
	},
	box_office: {
		label: "Box office ($m)",
		columnClasses: "text-right",
	},
};

const selectedRows = ref([]);
</script>
