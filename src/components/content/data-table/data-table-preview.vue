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
				Without data
			</template>

			<data-table />
		</preview-section>
	</preview-wrapper>
</template>

<script setup>
const data = [
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
	{
		id: "2e644b4b-51e8-4519-ab31-d9a37e2d0434",
		title: "Toy Story",
		release_year: "1995",
		box_office: "373.6",
	},
];

const columns = {
	title: { label: "Title" },
	release_year: { label: "Release year" },
	box_office: { label: "Box office $m" },
};
</script>
