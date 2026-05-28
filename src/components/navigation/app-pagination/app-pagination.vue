<template>
	<nav
		v-if="!haveSinglePage"
		v-bind="{ 'aria-labelledby': internalId }"
		class="flex flex-wrap items-center gap-4 text-center"
		data-component="app-pagination"
		data-test="app-pagination"
	>
		<span class="sr-only" v-bind="{ id: internalId }">
			<slot> Pagination </slot>
		</span>

		<ui-button
			class="button flex items-center gap-2"
			:class="{
				'hocus:bg-grey-200 hocus:text-grey-700 dark:hocus:bg-grey-950/30 dark:hocus:text-grey-200 underline':
					!showingFirstPage,
			}"
			v-bind="{ disabled: showingFirstPage }"
			icon-start="icon-arrow-left"
			data-part="previous"
			data-test="app-pagination-previous"
			@click="selectPreviousPage"
		>
			<slot name="previous-page-label"> Previous </slot>
		</ui-button>

		<ul class="flex items-center" data-part="page-list">
			<template v-for="page in pagesToDisplay" :key="page">
				<li
					v-if="page === pageCount && displayAfterSummary"
					class="button"
					data-test="app-pagination-summary"
				>
					⋯
				</li>
				<li data-test="app-pagination-page">
					<span
						v-if="page === currentPage"
						aria-current="page"
						class="button bg-purple-800 text-white underline dark:bg-purple-500"
						data-test="app-pagination-page-button"
					>
						<span class="sr-only">
							<slot name="page-number-label" v-bind="{ page }"> Page {{ page }} </slot>
						</span>

						<span aria-hidden="true">{{ page }}</span>
					</span>

					<button
						v-else
						type="button"
						class="button hocus:decoration-2 hocus:bg-grey-200 hocus:text-grey-700 dark:hocus:bg-grey-950/30 dark:hocus:text-grey-200 underline"
						data-test="app-pagination-page-button"
						@click="currentPage = page"
					>
						<span class="sr-only">
							<slot name="page-number-label" v-bind="{ page }"> Page {{ page }} </slot>
						</span>

						<span aria-hidden="true">{{ page }}</span>
					</button>
				</li>
				<li
					v-if="page === 1 && displayBeforeSummary"
					class="button"
					data-test="app-pagination-summary"
				>
					⋯
				</li>
			</template>
		</ul>

		<ui-button
			class="button flex items-center gap-2"
			:class="{
				'hocus:bg-grey-200 hocus:text-grey-700 dark:hocus:bg-grey-950/30 dark:hocus:text-grey-200 underline':
					!showingLastPage,
			}"
			v-bind="{ disabled: showingLastPage }"
			icon-end="icon-arrow-right"
			data-part="next"
			data-test="app-pagination-next"
			@click="selectNextPage"
		>
			<slot name="next-page-label"> Next </slot>
		</ui-button>

		<span
			role="status"
			aria-live="polite"
			class="ms-auto"
			data-test="app-pagination-showing-items-label"
		>
			<slot name="showing-items-label" v-bind="{ first: firstItem, last: lastItem, total: count }">
				Showing {{ firstItem }}&ndash;{{ lastItem }} of {{ count }} items
			</slot>
		</span>
	</nav>
</template>

<script setup>
import { computed, ref, useId, watch } from "vue";
import { getUrlParameter, updateUrlParameter } from "@lewishowles/helpers/url";
import { isNumber } from "@lewishowles/helpers/number";

const props = defineProps({
	/**
	 * The number of items in the paginated collection.
	 */
	count: {
		type: Number,
		default: 0,
	},
});

const emit = defineEmits(["update:page"]);

// An internal ID to link the pagination to its label.
const internalId = useId();
// The number of items that will be displayed per page.
const itemsPerPage = ref(10);

// The page number from the URL parameter, read at setup time so that the
// immediate watcher does not overwrite it before onMounted can read it.
const urlPageParam = parseInt(getUrlParameter("page"));
// The initial page, derived from the URL parameter when valid.
const initialPage = isNumber(urlPageParam) && urlPageParam > 0 ? urlPageParam : 1;

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

// Initialise currentPage from the URL parameter now, before the immediate
// watcher fires — otherwise the watcher would call updateUrlParameter("page", 1)
// and overwrite the URL before onMounted can read it.
if (initialPage > 1 && initialPage <= pageCount.value) {
	currentPage.value = initialPage;
}

// Whether all items fit onto a single page.
const haveSinglePage = computed(() => pageCount.value === 1);
// Whether we need to summarise pages before the current page. e.g. 1 ... 5 6 7.
const displayBeforeSummary = computed(() => currentPage.value > 3 && pageCount.value > 4);

// Whether we need to summarise pages after the current page. e.g. 3 4 5 ... 10
const displayAfterSummary = computed(
	() => currentPage.value < pageCount.value - 2 && pageCount.value > 4,
);

// Whether we are currently looking at the first page, which determines whether
// we need to display the "previous" button.
const showingFirstPage = computed(() => currentPage.value == 1);
// Whether we are currently looking at the last page, which determines whether
// we need to display the "next" button.
const showingLastPage = computed(() => currentPage.value == pageCount.value);
// Whether there is a next page to navigate to.
const hasNext = computed(() => !showingLastPage.value);
// Whether there is a previous page to navigate to.
const hasPrev = computed(() => !showingFirstPage.value);

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
const firstItem = computed(() => (currentPage.value - 1) * itemsPerPage.value + 1);
// The number of the last item being displayed based on the current pagination
// settings. With the last item, we need to account for a single page that
// contains fewer than the number of items per page.
const lastItem = computed(() => Math.min(firstItem.value + itemsPerPage.value - 1, props.count));

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

/**
 * Navigate to a specific page, clamped to the valid range.
 *
 * @param  {number}  page
 *     The page number to navigate to.
 */
function goTo(page) {
	if (!isNumber(page)) {
		return;
	}

	currentPage.value = Math.max(1, Math.min(page, pageCount.value));
}

// When our current page changes, emit an event to notify the parent (if they're
// not using v-model), and update the URL. We only want to update the URL when
// the page is not the first page, as that is the default anyway and there is no
// need to add unnecessary parameters.
watch(
	currentPage,
	() => {
		emit("update:page", currentPage.value);

		if (currentPage.value >= 1) {
			updateUrlParameter("page", currentPage.value);
		}
	},
	{ immediate: true },
);

// When the number of items changes, assume we're looking at a new view, and
// reset the current page.
watch(
	() => props.count,
	() => {
		currentPage.value = 1;
	},
);

// TODO: Add per-page options

defineExpose({
	currentPage,
	totalPages: pageCount,
	hasNext,
	hasPrev,
	next: selectNextPage,
	prev: selectPreviousPage,
	goTo,
});
</script>
