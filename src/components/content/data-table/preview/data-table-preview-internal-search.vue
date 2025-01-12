<template>
	<data-table ref="table" v-bind="{ data, columns }">
		<template #release_year="{ cell }">
			<span class="flex items-center gap-2">
				{{ cell }}

				<ui-button class="button--muted" v-bind="{ iconStart: 'icon-eye', iconOnly: true }" @click="setSearchQuery(cell)">
					Find movies from the same year
				</ui-button>
			</span>
		</template>
	</data-table>
</template>

<script setup>
import { ref } from "vue";
import { runComponentMethod } from "@lewishowles/helpers/vue";

// A reference to our table for which we want to set the search query as a test.
const table = ref(null);

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
	},
	release_year: {
		label: "Release year",
	},
	box_office: {
		label: "Box office ($m)",
		columnClasses: "text-right",
	},
};

function setSearchQuery(query) {
	runComponentMethod(table.value, "setSearchQuery", query);
}
</script>
