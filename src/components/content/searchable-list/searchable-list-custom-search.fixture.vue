<template>
	<searchable-list :data="data" placeholder="Search" :search="searchBySearchable">
		<template #label>Search</template>

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

const data = [
	{ name: "Jean-Luc Picard", searchable: ["captain", "enterprise"] },
	{ name: "Beverly Crusher", searchable: ["doctor", "medical"] },
];

function searchBySearchable(item) {
	return item.searchable;
}
</script>
