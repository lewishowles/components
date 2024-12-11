<template>
	<alert-message v-if="!haveLabel" type="error">
		<template #title>
			&lt;app-pagination&gt;
		</template>

		A `label` is required for accessibility purposes.
	</alert-message>

	<nav :aria-label="label">
		<a href="#" rel="prev">
			<icon-arrow-left />

			<slot name="previous-page-label">
				Previous page
			</slot>
		</a>

		<ul>
			<li>
				<a href="#" aria-label="Page 1">
					1
				</a>
			</li>
			<li>
				⋯
			</li>
			<li>
				<a href="#" aria-label="Page 6">
					6
				</a>
			</li>
			<li>
				<a href="#" aria-label="Page 7" aria-current="page">
					7
				</a>
			</li>
			<li>
				<a href="#" aria-label="Page 8">
					8
				</a>
			</li>
			<li>
				⋯
			</li>
			<li>
				<a href="#" aria-label="Page 42">
					42
				</a>
			</li>
		</ul>
		<div>
			<a href="#" rel="next">
				<slot name="next-page-label">
					Next page
				</slot>

				<icon-arrow-right />
			</a>
		</div>
	</nav>
</template>

<script setup>
import { computed } from "vue";
import { isNonEmptyString } from "@lewishowles/helpers/string";

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

// Whether a label for the pagination has been provided.
const haveLabel = computed(() => isNonEmptyString(props.label));
// The number of items that will be displayed per page.
// const perPage = ref(10);
// The current page we're looking at.
// const currentPage = ref(1);
// TODO: Calculate the number of pages
// TODO: Emit the current page when it changes - @update:page
// TODO: Determine whether we're looking at the first page
// TODO: Determine whether we're looking at the last page
// TODO: Determine whether all items fit onto a single page
// TODO: Hide if all items fit onto a single page
// TODO: Reset to the first page if the number of items changes
// TODO: Add per-page options
</script>
