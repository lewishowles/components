<template>
	<data-table v-bind="{ data, columns }">
		<template #title="{ cell, row }">
			<div class="flex items-center gap-4">
				<img :src="row.poster" alt="" class="w-12" />

				<span class="flex flex-col">
					{{ cell }}

					<span class="text-sm text-grey-500">{{ row.release_year }}</span>
				</span>
			</div>
		</template>
	</data-table>
</template>

<script setup>
import FrozenPoster from "./frozen.webp";
import TheLionKingPoster from "./the-lion-king.webp";
import ToyStoryPoster from "./toy-story.webp";

const data = [
	{
		id: "2e644b4b-51e8-4519-ab31-d9a37e2d0434",
		poster: ToyStoryPoster,
		title: "Toy Story",
		release_year: "1995",
		box_office: "373.6",
	},
	{
		id: "da9eff2a-c10e-42a3-ab3f-9f252c574384",
		poster: FrozenPoster,
		title: "Frozen",
		release_year: "2013",
		box_office: "1,290.0",
	},
	{
		id: "3ffd9ae1-ef4f-4f6e-b408-a2c5b58a3305",
		poster: TheLionKingPoster,
		title: "The Lion King",
		release_year: "1994",
		box_office: "968.5",
	},
];

const columns = {
	title: {
		label: "Title",
	},
	box_office: {
		label: "Box office ($m)",
		columnClasses: "text-right",
	},
};
</script>
