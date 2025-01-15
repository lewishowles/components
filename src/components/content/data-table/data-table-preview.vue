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
				With user configuration
			</template>

			<data-table v-bind="{ data, columns, name: 'user-configuration-sample' }" />
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
