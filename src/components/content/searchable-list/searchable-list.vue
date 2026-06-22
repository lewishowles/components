<template>
	<div data-component="searchable-list" data-test="searchable-list">
		<div class="flex items-end gap-4">
			<form-input
				ref="search-field"
				v-bind="{ placeholder }"
				v-model="searchQuery"
				class="w-full max-w-lg"
				data-test="searchable-list-search"
			>
				<slot name="label" />
			</form-input>

			<ui-button
				v-show="performingSearch"
				class="button--muted"
				data-test="searchable-list-reset-search-button"
				@click="resetSearch"
			>
				<slot name="reset-search-label">Reset search</slot>
			</ui-button>
		</div>

		<div role="status" aria-live="polite" class="mt-2 mb-6" data-test="searchable-list-toolbar">
			<div v-if="!haveResults" data-test="searchable-list-no-results">
				<slot name="no-results" v-bind="{ query: searchQuery }">
					<pill-badge class="text-sm">
						Sorry, no results could be found for
						<span class="font-bold">"{{ searchQuery }}"</span>
					</pill-badge>
				</slot>
			</div>

			<template v-else>
				<slot
					v-bind="{ performingSearch, resultCount, itemCount, query: searchQuery }"
					name="results-count"
				>
					<pill-badge>
						<template v-if="performingSearch">
							Showing {{ resultCount }} of {{ itemCount }}
						</template>
						<template v-else>Showing {{ resultCount }}</template>
					</pill-badge>
				</slot>
			</template>
		</div>

		<div data-test="searchable-list-results">
			<slot
				v-bind="{
					performingSearch,
					haveResults,
					itemCount,
					items: results,
					query: searchQuery,
					resultCount,
				}"
			/>
		</div>
	</div>
</template>

<script setup>
import { arrayLength, isNonEmptyArray } from "@lewishowles/helpers/array";
import { computed, unref, useTemplateRef } from "vue";
import { isNonEmptyString } from "@lewishowles/helpers/string";
import { objectContains } from "@lewishowles/helpers/object";
import { callComponentMethod } from "@lewishowles/helpers/vue";

const props = defineProps({
	/**
	 * The list of items to search, or display if no search is being performed.
	 */
	data: {
		type: Array,
		required: true,
	},

	/**
	 * Map each item to the content that should be searched. This allows the
	 * displayed item and the searchable content to differ.
	 */
	search: {
		type: Function,
		default: (item) => item,
	},

	/**
	 * Any placeholder to provide to the search input. This can be used to
	 * indicate the kinds of data the user can search for.
	 */
	placeholder: {
		type: String,
		default: null,
	},

	/**
	 * Any properties to exclude from the search.
	 */
	exclude: {
		type: Array,
		default: () => [],
	},

	/**
	 * Any properties to search exclusively.
	 */
	include: {
		type: Array,
		default: () => [],
	},
});

const searchQuery = defineModel({
	type: String,
	default: "",
});

// Our internal copy of data, which we unref so that the user doesn't have to,
// just in case.
const internalData = computed(() => unref(props.data));
// A reference to the search field, so that we can trigger focus on it as
// required.
const searchField = useTemplateRef("search-field");
// The trimmed query to use when searching items.
const normalisedQuery = computed(() => String(searchQuery.value ?? "").trim());
// Whether a search query has been provided and a search can be performed. This
// excludes whitespace at each end of the query.
const performingSearch = computed(() => isNonEmptyString(normalisedQuery.value));

// The items to display, based on any current search query.
const results = computed(() => {
	if (!isNonEmptyArray(internalData.value)) {
		return [];
	}

	if (!performingSearch.value) {
		return internalData.value;
	}

	return internalData.value.filter((item) => {
		return searchableContentContains(props.search(item), normalisedQuery.value);
	});
});

// The number of items provided.
const itemCount = computed(() => arrayLength(internalData.value));
// The number of results currently found.
const resultCount = computed(() => arrayLength(results.value));
// Whether a search is being performed and results have been found.
const haveResults = computed(() => !performingSearch.value || resultCount.value > 0);

/**
 * Determine whether an item's searchable content matches the query.
 *
 * @param  {*}  content
 *     The content to search.
 * @param  {string}  query
 *     The normalised query to search for.
 */
function searchableContentContains(content, query) {
	if (Array.isArray(content) || (content !== null && typeof content === "object")) {
		return objectContains(content, query, {
			exclude: props.exclude,
			include: props.include,
			caseInsensitive: true,
			allowPartial: true,
		});
	}

	if ([undefined, null].includes(content)) {
		return false;
	}

	return String(content).toLowerCase().includes(query.toLowerCase());
}

/**
 * Reset any current search and show all items, focusing the search input.
 */
function resetSearch() {
	searchQuery.value = "";

	triggerFocus();
}

/**
 * Trigger focus on the search field.
 */
function triggerFocus() {
	callComponentMethod(searchField.value, "triggerFocus");
}

defineExpose({
	resetSearch,
	triggerFocus,
});
</script>
