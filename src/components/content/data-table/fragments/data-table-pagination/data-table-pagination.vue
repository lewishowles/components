<template>
	<app-pagination v-bind="{ count }" data-test="data-table-pagination">
		<template #page-number-page="{ page }">
			<slot name="page-number-label" v-bind="{ page }" />
		</template>

		<template #next-page-label>
			<slot name="next-page-label" />
		</template>
		<template #page-number-label>
			<slot name="page-number-label" />
		</template>
	</app-pagination>
</template>

<script setup>
defineProps({
	/**
	 * The number of items in the paginated collection.
	 */
	count: {
		type: Number,
		default: 0,
	},
});
</script>
