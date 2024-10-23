<template>
	<div data-test="searchable-list">
		<div class="mb-6 flex gap-4">
			<form-input v-bind="{ placeholder }" class="w-full max-w-lg" data-test="searchable-list-search">
				<slot name="label" />
			</form-input>
		</div>

		<div data-test="searchable-list-results">
			<slot v-bind="{ items: data }" />
		</div>
	</div>
</template>

<script setup>
defineProps({
	/**
	 * The list of items to search, or display if no search is being performed.
	 * This should be an array of objects. Any non-object entries will be
	 * ignored.
	 */
	data: {
		type: Array,
		required: true,
	},

	/**
	 * Any placeholder to provide to the search input. This can be used to
	 * indicate the kinds of data the user can search for.
	 */
	placeholder: {
		type: String,
		default: null,
	},
});
</script>
