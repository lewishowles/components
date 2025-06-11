<template>
	<component-playground v-bind="{ copy: template, componentModel }" id="playground-data-table" v-model="textSlots">
		<template #title>
			Data table
		</template>

		<data-table v-bind="componentProps" v-model="componentModel">
			<template #box_office="{ cell }">
				{{ new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(cell) }}
			</template>
			<template #runtime="{ cell }">
				{{ cell }} min
			</template>
		</data-table>

		<template #additional-code>
			<code-block :code="`const columns = ${JSON.stringify(columns, null, '\t')};`" />
			<code-block :code="`const data = ${JSON.stringify(data, null, '\t')};`" />
		</template>
	</component-playground>
</template>

<script setup>
import { computed, ref } from "vue";
import useTemplateGenerator from "@/views/components/composables/use-template-generator/use-template-generator";

// The current model value.
const componentModel = ref(null);

const data = [
	{
		title: "Incredibles 2",
		year: 2018,
		box_office: 1242000000,
		imdb_rating: 7.6,
		runtime: 118,
		bbfc_classification: "PG",
	},
	{
		title: "Toy Story 4",
		year: 2019,
		box_office: 1073000000,
		imdb_rating: 7.7,
		runtime: 100,
		bbfc_classification: "U",
	},
	{
		title: "Finding Dory",
		year: 2016,
		box_office: 1029000000,
		imdb_rating: 7.3,
		runtime: 97,
		bbfc_classification: "U",
	},
	{
		title: "Toy Story 3",
		year: 2010,
		box_office: 1067000000,
		imdb_rating: 8.3,
		runtime: 103,
		bbfc_classification: "U",
	},
	{
		title: "Inside Out",
		year: 2015,
		box_office: 858000000,
		imdb_rating: 8.1,
		runtime: 95,
		bbfc_classification: "U",
	},
	{
		title: "Coco",
		year: 2017,
		box_office: 807000000,
		imdb_rating: 8.4,
		runtime: 105,
		bbfc_classification: "PG",
	},
	{
		title: "Finding Nemo",
		year: 2003,
		box_office: 940000000,
		imdb_rating: 8.2,
		runtime: 100,
		bbfc_classification: "U",
	},
	{
		title: "The Incredibles",
		year: 2004,
		box_office: 633000000,
		imdb_rating: 8.0,
		runtime: 115,
		bbfc_classification: "PG",
	},
	{
		title: "Up",
		year: 2009,
		box_office: 735000000,
		imdb_rating: 8.3,
		runtime: 96,
		bbfc_classification: "U",
	},
	{
		title: "Monsters, Inc.",
		year: 2001,
		box_office: 577000000,
		imdb_rating: 8.1,
		runtime: 92,
		bbfc_classification: "U",
	},
	{
		title: "Brave",
		year: 2012,
		box_office: 540000000,
		imdb_rating: 7.1,
		runtime: 93,
		bbfc_classification: "PG",
	},
	{
		title: "Ratatouille",
		year: 2007,
		box_office: 623000000,
		imdb_rating: 8.1,
		runtime: 111,
		bbfc_classification: "U",
	},
	{
		title: "Cars",
		year: 2006,
		box_office: 461000000,
		imdb_rating: 7.2,
		runtime: 117,
		bbfc_classification: "PG",
	},
	{
		title: "Soul",
		year: 2020,
		box_office: 121000000,
		imdb_rating: 8.0,
		runtime: 100,
		bbfc_classification: "PG",
	},
	{
		title: "Toy Story",
		year: 1995,
		box_office: 373000000,
		imdb_rating: 8.3,
		runtime: 81,
		bbfc_classification: "PG",
	},
];

const columns = {
	title: {
		label: "Title",
	},
	year: {
		label: "Year of release",
	},
	box_office: {
		label: "Box office",
		align: "right",
	},
	runtime: {
		label: "Runtime",
		align: "right",
	},
	imdb_rating: {
		label: "IMDB rating",
		align: "right",
	},
	bbfc_classification: {
		label: "BBFC classification",
	},
};

// Props both for the template and for the component example itself.
const props = ref({
	data: {
		label: "Data",
		value: data,
		type: "array",
	},
	columns: {
		label: "Column configuration",
		value: columns,
		type: "object",
	},
});

// Convert our props into a format that can be passed directly to our component.
const componentProps = computed(() => {
	return Object.fromEntries(
		Object.entries(props.value).map(([key, prop]) => [key, prop.value]),
	);
});

const template = useTemplateGenerator("data-table", { props });
</script>
