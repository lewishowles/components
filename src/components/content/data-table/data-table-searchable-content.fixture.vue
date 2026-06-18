<template>
	<data-table v-bind="{ data, columns }" />
</template>

<script setup>
import DataTable from "./data-table.vue";

// Returns "buzz lightyear" as extra searchable content for the Toy Story row,
// allowing the test to verify the search matches on the callback value.
function searchableContentCallback(columnKey, rowData) {
	if (columnKey === "title" && rowData.title === "Toy Story") {
		return "buzz lightyear";
	}
}

const columns = {
	title: { label: "Title", primary: true, searchableContentCallback },
	release_year: { label: "Release year" },
	box_office: { label: "Box office ($m)" },
};

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
];
</script>
