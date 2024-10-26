<template>
	<div data-test="searchable-list">
		<div class="mb-6 flex gap-4">
			<form-input v-bind="{ placeholder }" v-model="searchQuery" class="w-full max-w-lg" data-test="searchable-list-search">
				<slot name="label" />
			</form-input>
		</div>

		<div data-test="searchable-list-results">
			<slot v-bind="{ items: results, query: searchQuery }" />
		</div>
	</div>
</template>

<script setup>
import { computed, ref } from "vue";
import { isNonEmptyString } from "@lewishowles/helpers/string";
import { objectContains } from "@lewishowles/helpers/object";

const props = defineProps({
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

const searchQuery = ref("");
// Whether a search query has been provided and a search can be performed. This
// excludes whitespace at each end of the query.
const haveSearchQuery = computed(() => isNonEmptyString(searchQuery.value, { trim: true }));

// The items to display, based on any current search query.
const results = computed(() => {
	if (!haveSearchQuery.value) {
		return props.data;
	}

	return props.data.filter(item => objectContains(item, searchQuery.value, { caseInsensitive: true, allowPartial: true }));
});
</script>
