<template>
	<searchable-list
		:data="data"
		:placeholder="placeholder"
		:model-value="modelValue"
		:exclude="exclude"
		:include="include"
		:search="search ?? undefined"
	>
		<template #label>Find your favourite reindeer</template>

		<template #default="{ items }">
			<ul>
				<li v-for="item in items" :key="item.name" data-test="searchable-list-demo-item">
					{{ item.name }}
				</li>
			</ul>
		</template>
	</searchable-list>
</template>

<script setup>
import SearchableList from "./searchable-list.vue";

defineProps({
	data: {
		type: Array,
		default: () => [
			{ name: "Dasher" },
			{ name: "Dancer" },
			{ name: "Prancer" },
			{ name: "Vixen" },
			{ name: "Comet" },
			{ name: "Cupid" },
			{ name: "Donner" },
			{ name: "Blitzen" },
			{ name: "Rudolph" },
		],
	},

	placeholder: {
		type: String,
		default: "e.g. Dasher",
	},

	modelValue: {
		type: String,
		default: "",
	},

	exclude: {
		type: Array,
		default: null,
	},

	include: {
		type: Array,
		default: null,
	},

	search: {
		type: Function,
		default: null,
	},
});
</script>
