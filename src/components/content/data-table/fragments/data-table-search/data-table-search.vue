<template>
	<div class="flex items-end gap-4" data-test="data-table-search">
		<form-input
			ref="searchQueryInput"
			v-bind="{ placeholder: searchPlaceholder }"
			v-model="searchQuery"
			class="w-full max-w-sm"
			data-test="data-table-search-input"
		>
			<slot name="search-label">
				Search
			</slot>
		</form-input>

		<ui-button v-show="haveSearchQuery" class="button--muted" data-test="data-table-search-reset-button" @click="resetSearchQuery">
			<slot name="reset-search-label">
				Reset search
			</slot>
		</ui-button>
	</div>
</template>

<script setup>
import { computed, ref } from "vue";
import { isNonEmptyString } from "@lewishowles/helpers/string";
import { runComponentMethod } from "@lewishowles/helpers/vue";

defineProps({
	/**
	 * The placeholder to apply to the search input.
	 */
	searchPlaceholder: {
		type: String,
		default: null,
	},
});

// The current search query.
const searchQuery = defineModel({
	type: String,
});

// The search query input, allowing us to focus it when necessary.
const searchQueryInput = ref(null);
// Whether we have a search term, and thus whether the user is currently
// searching.
const haveSearchQuery = computed(() => isNonEmptyString(searchQuery.value));

/**
 * Focus on the search input.
 */
function triggerFocus() {
	runComponentMethod(searchQueryInput.value, "triggerFocus");
}

/**
 * Clear any current search query.
 */
function resetSearchQuery() {
	searchQuery.value = "";

	triggerFocus();
}

defineExpose({
	triggerFocus,
});
</script>
