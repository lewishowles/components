<template>
	<alert-message v-if="!haveLabel" type="error">
		<template #title>
			&lt;app-pagination&gt;
		</template>

		A `label` is required for accessibility purposes.
	</alert-message>

	<nav v-else-if="!haveSinglePage" :aria-label="label" class="flex flex-wrap items-center gap-4 text-center" data-test="app-pagination">
		<button
			class="button flex items-center gap-2"
			:class="{ 'text-grey-500 dark:text-white/60': showingFirstPage, 'underline hocus:bg-grey-200 hocus:text-grey-700 dark:hocus:bg-grey-950/30 dark:hocus:text-grey-200': !showingFirstPage }"
			v-bind="{ 'disabled': showingFirstPage ? 'disabled' : null, 'aria-hidden': showingFirstPage ? 'true' : null }"
			data-test="app-pagination-previous"
			@click="selectPreviousPage"
		>
			<icon-arrow-left />

			<slot name="previous-page-label">
				Previous
			</slot>
		</button>

		<ul class="flex items-center">
			<template v-for="page in pagesToDisplay" :key="page">
				<li v-if="page === pageCount && displayAfterSummary" class="button" data-test="app-pagination-summary">
					⋯
				</li>
				<li data-test="app-pagination-page" v-bind="{ 'aria-current': page === currentPage ? 'page' : null }">
					<button class="button underline hocus:decoration-2" :class="{ 'hocus:bg-grey-200 hocus:text-grey-700 dark:hocus:bg-grey-950/30 dark:hocus:text-grey-200': page !== currentPage, 'bg-purple-800 text-white dark:bg-purple-500': page === currentPage }" data-test="app-pagination-page-button" @click="currentPage = page">
						<span class="sr-only">
							<slot name="page-number-label" v-bind="{ page }">
								Page {{ page }}
							</slot>
						</span>

						<span aria-hidden="true">{{ page }}</span>
					</button>
				</li>
				<li v-if="page === 1 && displayBeforeSummary" class="button" data-test="app-pagination-summary">
					⋯
				</li>
			</template>
		</ul>

		<button
			class="button flex items-center gap-2"
			:class="{ 'text-grey-500 dark:text-white/60': showingLastPage, 'underline hocus:bg-grey-200 hocus:text-grey-700 dark:hocus:bg-grey-950/30 dark:hocus:text-grey-200': !showingLastPage }"
			v-bind="{ 'disabled': showingLastPage ? 'disabled' : null, 'aria-hidden': showingLastPage ? 'true' : null }"
			data-test="app-pagination-next"
			@click="selectNextPage"
		>
			<slot name="next-page-label">
				Next
			</slot>

			<icon-arrow-right />
		</button>

		<span class="ms-auto" data-test="app-pagination-showing-items-label">
			<slot name="showing-items-label" v-bind="{ first: firstItem, last: lastItem, total: count }">
				Showing {{ firstItem }}&ndash;{{ lastItem }} of {{ count }} items
			</slot>
		</span>
	</nav>
</template>

<script setup>
import { computed, ref, onMounted, watch } from "vue";
import { isNonEmptyString } from "@lewishowles/helpers/string";
import { isNumber } from "@lewishowles/helpers/number";
import { getUrlParameter, updateUrlParameter } from "@lewishowles/helpers/url";

const props = defineProps({
	/**
	 * The number of items in the paginated collection.
	 */
	count: {
		type: Number,
		default: 0,
	},

	// i18n

	/**
	 * The label for the pagination, intended to explain to screen reader users
	 * the purpose of the navigation.
	 */
	label: {
		type: String,
		default: "Pagination",
	},
});

const emit = defineEmits(["@update:page"]);

// Whether a label for the pagination has been provided.
const haveLabel = computed(() => isNonEmptyString(props.label));
// The number of items that will be displayed per page.
const itemsPerPage = ref(10);

// The current page we're looking at.
const currentPage = defineModel({
	type: Number,
	default: 1,
});

// The number of pages, based on the total number of items and the items
// displayed per page.
const pageCount = computed(() => {
	if (!isNumber(props.count) || props.count <= 0 || !isNumber(itemsPerPage.value)) {
		return 1;
	}

	return Math.ceil(props.count / itemsPerPage.value);
});

// Whether all items fit onto a single page.
const haveSinglePage = computed(() => pageCount.value === 1);
// Whether we need to summarise pages before the current page. e.g. 1 ... 5 6 7.
const displayBeforeSummary = computed(() => currentPage.value > 3 && pageCount.value > 4);
// Whether we need to summarise pages after the current page. e.g. 3 4 5 ... 10
const displayAfterSummary = computed(() => currentPage.value < pageCount.value - 2 && pageCount.value > 4);
// Whether we are currently looking at the first page, which determines whether
// we need to display the "previous" button.
const showingFirstPage = computed(() => currentPage.value == 1);
// Whether we are currently looking at the last page, which determines whether
// we need to display the "next" button.
const showingLastPage = computed(() => currentPage.value == pageCount.value);

// The pages to display. By default this includes the first page, last page,
// current page and a page either side of it, but any of those can collapse
// depending on what page we're currently on. Ideally, we always want to show a
// block of three pages for ease.
const pagesToDisplay = computed(() => {
	// If we're showing the first page, we want to show pages 1-3, if they
	// exist, and the last page. We know page 2 will exist, because pagination
	// isn't shown if there is only one page.
	if (showingFirstPage.value) {
		const pages = [1, 2];

		if (pageCount.value > 2) {
			pages.push(3);
		}

		if (pageCount.value > 3) {
			pages.push(pageCount.value);
		}

		return pages;
	}

	// If we're showing the last page, we want to show the three last pages, if
	// they exist, and the first page.
	if (showingLastPage.value) {
		const pages = [pageCount.value];

		if (pageCount.value > 1) {
			pages.unshift(pageCount.value - 1);
		}

		if (pageCount.value > 2) {
			pages.unshift(pageCount.value - 2);
		}

		if (pageCount.value > 3) {
			pages.unshift(1);
		}

		return pages;
	}

	// Otherwise, we base our pages on the current page.
	const pages = [1];

	// Whether we need to include a page before the current page. This would be
	// false if we're looking at the first page, where there is no previous
	// page, or the second page, where the previous page is handled by showing
	// the first page.
	if (currentPage.value > 2) {
		pages.push(currentPage.value - 1);
	}

	pages.push(currentPage.value);

	// Whether we need to include a page after the current page. The logic is
	// the same as previous, but for the last pages.
	if (currentPage.value < pageCount.value - 1) {
		pages.push(currentPage.value + 1);
	}

	pages.push(pageCount.value);

	return pages;
});

// The number of the first item being displayed based on the current pagination
// settings.
const firstItem = computed(() => ((currentPage.value - 1) * itemsPerPage.value) + 1);
// The number of the last item being displayed based on the current pagination
// settings. With the last item, we need to account for a single page that
// contains fewer than the number of items per page.
const lastItem = computed(() => Math.min(firstItem.value + itemsPerPage.value - 1, props.count));

// When mounting, check if there is a "page" parameter in the URL, and
// initialise our current page with that.
onMounted(() => {
	const pageParam = parseInt(getUrlParameter("page"));

	if (!isNumber(pageParam) || pageParam <= 0 || pageParam > pageCount.value) {
		return;
	}

	currentPage.value = pageParam;
});

/**
 * Select the next page, limited to 1.
 */
function selectPreviousPage() {
	currentPage.value = Math.max(currentPage.value - 1, 1);
}

/**
 * Select the next page, capped at the page count.
 */
function selectNextPage() {
	currentPage.value = Math.min(currentPage.value + 1, pageCount.value);
}

// When our current page changes, emit an event to notify the parent (if they're
// not using v-model), and update the URL. We only want to update the URL when
// the page is not the first page, as that is the default anyway and there is no
// need to add unnecessary parameters.
watch(currentPage, () => {
	emit("@update:page", currentPage.value);

	if (currentPage.value >= 1) {
		updateUrlParameter("page", currentPage.value);
	}
}, { immediate: true });

// When the number of items changes, assume we're looking at a new view, and
// reset the current page.
watch(() => props.count, () => {
	currentPage.value = 1;
});

// TODO: Add per-page options
</script>
