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
import AladdinPoster from "./aladdin.webp";
import TheEmeprorsNewGroovePoster from "./the-emperors-new-groove.webp";
import TheLionKingPoster from "./the-lion-king.webp";
import ToyStoryPoster from "./toy-story.webp";
import UpPoster from "./up.webp";

const data = [
	{
		id: "2e644b4b-51e8-4519-ab31-d9a37e2d0434",
		title: "Toy Story",
		poster: ToyStoryPoster,
		release_year: "1995",
		box_office: "373.6",
	},
	{
		id: "da9eff2a-c10e-42a3-ab3f-9f252c574384",
		title: "Aladdin",
		poster: AladdinPoster,
		release_year: "1992",
		box_office: "1,054.0",
	},
	{
		id: "3ffd9ae1-ef4f-4f6e-b408-a2c5b58a3305",
		title: "The Lion King",
		poster: TheLionKingPoster,
		release_year: "1994",
		box_office: "968.5",
	},
	{
		id: "5c247b4a-a64d-46aa-94aa-7794fe9b7b59",
		title: "The Emperor's New Groove",
		poster: TheEmeprorsNewGroovePoster,
		release_year: "2000",
		box_office: "169.3",
	},
	{
		id: "6b2d8c0d-76b2-40dd-adf9-5800a0526c0f",
		title: "Up",
		poster: UpPoster,
		release_year: "2009",
		box_office: "735.1",
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
