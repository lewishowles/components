<template>
	<preview-wrapper>
		<template #title>
			data-table
		</template>

		<preview-section>
			<template #title>
				Simple table
			</template>

			<data-table v-bind="{ data, columns }" />
		</preview-section>

		<preview-section>
			<template #title>
				Utilising heading and cell templates
			</template>

			<data-table v-bind="{ data, columns }">
				<template #title_heading="{ label }">
					<span class="flex items-center gap-2">
						<icon-film />
						{{ label }}
					</span>
				</template>

				<template #title="{ cell }">
					<span class="flex items-center gap-2">
						<icon-film />
						{{ cell }}
					</span>
				</template>
			</data-table>
		</preview-section>

		<preview-section>
			<template #title>
				Updating the search (from within the table)
			</template>

			<data-table ref="setSearchQueryExample" v-bind="{ data, columns }">
				<template #title="{ cell }">
					<span class="flex items-center gap-2">
						{{ cell }}

						<ui-button class="button--muted text-xs" @click="setSearchQuery(cell)">
							Find similar movies
						</ui-button>
					</span>
				</template>
			</data-table>
		</preview-section>

		<preview-section>
			<template #title>
				Without data
			</template>

			<data-table />
		</preview-section>
	</preview-wrapper>
</template>

<script setup>
import { ref } from "vue";
import { runComponentMethod } from "@lewishowles/helpers/vue";

const data = [
	{
		id: "2e644b4b-51e8-4519-ab31-d9a37e2d0434",
		title: "Toy Story",
		release_year: "1995",
		box_office: "373.6",
	},
	{
		id: "da9eff2a-c10e-42a3-ab3f-9f252c574384",
		title: "Frozen",
		release_year: "2013",
		box_office: "1,290.0",
	},
	{
		id: "3ffd9ae1-ef4f-4f6e-b408-a2c5b58a3305",
		title: "The Lion King",
		release_year: "1994",
		box_office: "968.5",
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

// A reference to our table for which we want to set the search query as a test.
const setSearchQueryExample = ref(null);

function setSearchQuery(query) {
	runComponentMethod(setSearchQueryExample.value, "setSearchQuery", query);
}
</script>
