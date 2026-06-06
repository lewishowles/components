<template>
	<div v-if="enableSelection" class="ps-4" data-test="data-table-footer-selection">
		<slot name="selected-row-count-label" v-bind="{ selectedCount }">
			{{ selectedCount }} rows selected
		</slot>
	</div>

	<app-pagination
		v-if="enablePagination"
		v-show="haveDataToDisplay"
		v-model="currentPage"
		v-bind="{ count: totalCount }"
		data-test="data-table-pagination"
	>
		<template #page-number-label="{ page }">
			<slot name="page-number-label" v-bind="{ page }" />
		</template>

		<template #next-page-label>
			<slot name="next-page-label" />
		</template>
		<template #showing-items-label="{ first, last, total }">
			<slot name="showing-items-label" v-bind="{ first, last, total }" />
		</template>
	</app-pagination>

	<alert-message v-show="!haveDataToDisplay" data-test="data-table-no-results">
		<slot name="no-results-message" v-bind="{ searchQuery }">
			No results could be found for term
			<span class="font-bold">"{{ searchQuery }}"</span>
			.
		</slot>
	</alert-message>
</template>

<script setup>
// The current page, kept in sync with the table's pagination.
const currentPage = defineModel({
	type: Number,
});

defineProps({
	/**
	 * Whether selection is enabled, controlling the selected-count display.
	 */
	enableSelection: {
		type: Boolean,
		default: false,
	},

	/**
	 * The number of currently selected rows.
	 */
	selectedCount: {
		type: Number,
		default: 0,
	},

	/**
	 * Whether pagination is enabled.
	 */
	enablePagination: {
		type: Boolean,
		default: true,
	},

	/**
	 * Whether there are rows to display. Toggles between the pagination and the
	 * no-results message.
	 */
	haveDataToDisplay: {
		type: Boolean,
		default: false,
	},

	/**
	 * The total number of rows being paginated.
	 */
	totalCount: {
		type: Number,
		default: 0,
	},

	/**
	 * The current search query, shown in the no-results message.
	 */
	searchQuery: {
		type: String,
		default: null,
	},
});
</script>
