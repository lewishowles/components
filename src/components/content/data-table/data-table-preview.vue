<template>
	<preview-wrapper>
		<template #title>
			data-table
		</template>

		<preview-section>
			<template #title>
				Simple table
			</template>

			<data-table v-bind="{ data, columns, searchPlaceholder: 'Find films by title or year of release' }" />
		</preview-section>

		<preview-section>
			<template #title>
				With pagination
			</template>

			<data-table v-bind="{ data: extendedData, columns, searchPlaceholder: 'Find films by title or year of release' }" />
		</preview-section>

		<preview-section>
			<template #title>
				With user configuration
			</template>

			<data-table v-bind="{ data, columns, name: 'user-configuration-sample' }" />
		</preview-section>

		<preview-section>
			<template #title>
				With selection
			</template>

			<data-table-preview-selection />
		</preview-section>

		<preview-section>
			<template #title>
				Utilising heading and cell templates
			</template>

			<data-table-preview-custom-cells />
		</preview-section>

		<preview-section>
			<template #title>
				With caption, title and introduction
			</template>

			<data-table v-bind="{ data, columns }">
				<template #caption>
					A table representing classic Disney films and their box office takings.
				</template>

				<template #table-title>
					Classic Disney films
				</template>

				<template #table-introduction>
					Some of the most popular Disney films of all time, including their box office takings.
				</template>
			</data-table>
		</preview-section>

		<preview-section>
			<template #title>
				Updating the search (from within the table)
			</template>

			<data-table-preview-internal-search />
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
import DataTablePreviewSelection from "./preview/data-table-preview-selection.vue";
import DataTablePreviewCustomCells from "./preview/data-table-preview-custom-cells.vue";
import DataTablePreviewInternalSearch from "./preview/data-table-preview-internal-search.vue";

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

const extendedData = [
	...data,
	{
		id: "2594b1c7-865f-4e1c-8056-1da172e6e291",
		title: "Finding Nemo",
		release_year: "2003",
		box_office: "940.3",
	},
	{
		id: "c92adb1c-2911-4af2-8262-63edb6e69b0c",
		title: "Monsters, Inc.",
		release_year: "2001",
		box_office: "577.4",
	},
	{
		id: "93e011fd-6d0b-490f-82b9-47a51aa0b039",
		title: "Ratatouille",
		release_year: "2007",
		box_office: "620.7",
	},
	{
		id: "cad1137a-0174-444c-b2da-d97f0f884d63",
		title: "WALL-E",
		release_year: "2008",
		box_office: "521.3",
	},
	{
		id: "018c2baa-efb5-4f8b-a5e2-0f10a6eff30f",
		title: "Brave",
		release_year: "2012",
		box_office: "540.4",
	},
	{
		id: "63b48efa-b91e-4b5d-a92c-a629383993c4",
		title: "Inside Out",
		release_year: "2015",
		box_office: "857.6",
	},
	{
		id: "5a25addd-3e0a-4974-a3e6-4edb8d7e632e",
		title: "Coco",
		release_year: "2017",
		box_office: "807.1",
	},
	{
		id: "e7853c36-6dac-40f6-9aff-b500c7daa17d",
		title: "Frozen",
		release_year: "2013",
		box_office: "1,290.0",
	},
	{
		id: "51ae5c91-3e71-4aff-8c75-9bf3bedea21b",
		title: "Moana",
		release_year: "2016",
		box_office: "643.3",
	},
	{
		id: "b374343a-97cd-413e-af8e-b6601a165671",
		title: "Zootopia",
		release_year: "2016",
		box_office: "1,023.8",
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
</script>
