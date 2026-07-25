import { computed, ref, watch } from "vue";
import { arrayLength } from "@lewishowles/helpers/array";

// The number of rows shown per page when pagination is enabled.
const pageSize = 10;

/**
 * Manage pagination for the data table: the current page, the rows shown for
 * that page, and the total row count. When pagination is disabled, every row is
 * shown. The page resets to the first whenever the underlying row set changes.
 *
 * @param  {object}  source
 *     The filtered and sorted data, plus the sort state that produces it.
 * @param  {object}  source.filteredRows
 *     A ref of the rows after any search, used to reset the page on a search.
 * @param  {object}  source.sortedRows
 *     A ref of the rows after filtering and sorting; the rows to paginate.
 * @param  {object}  source.sortedColumn
 *     A ref of the currently sorted column key, or null.
 * @param  {object}  source.sortDirection
 *     A ref of the current sort direction.
 * @param  {object}  enablePagination
 *     A ref reflecting whether pagination is enabled.
 * @param  {object}  options
 *     Mode-specific pagination options.
 * @param  {object}  options.isServerMode
 *     A ref reflecting whether rows are externally controlled.
 * @param  {object}  options.state
 *     A ref containing the controlled table state.
 * @param  {object}  options.totalRows
 *     A ref containing the server result count.
 */
export default function useTablePagination(source, enablePagination, options = {}) {
	const { filteredRows, sortedRows, sortedColumn, sortDirection } = source;
	const { isServerMode = ref(false), state = ref(null), totalRows = ref(0) } = options;

	// The current page of results being viewed.
	const currentPage = ref(state.value?.page ?? 1);

	// The number of rows represented by each page.
	const itemsPerPage = computed(() => {
		return isServerMode.value ? (state.value?.itemsPerPage ?? pageSize) : pageSize;
	});

	// The total number of rows being paginated.
	const rowCount = computed(() => {
		if (isServerMode.value) {
			return totalRows.value ?? 0;
		}

		return arrayLength(sortedRows.value);
	});

	// Reset to the first page when the filtered rows or sort change.
	watch([filteredRows, sortedColumn, sortDirection], () => {
		if (isServerMode.value) {
			return;
		}

		currentPage.value = 1;
	});

	// Reflect externally controlled server page changes in the pagination model.
	watch(
		() => state.value?.page,
		(page) => {
			if (isServerMode.value && page !== undefined && page !== currentPage.value) {
				currentPage.value = page;
			}
		},
	);

	// Report pagination changes through the single controlled server state model.
	watch(currentPage, (page) => {
		if (!isServerMode.value) {
			return;
		}

		const currentState = state.value ?? {};

		if (currentState.page === page) {
			return;
		}

		state.value = { ...currentState, page };
	});

	// The rows shown for the current page.
	const paginatedRows = computed(() => {
		if (isServerMode.value) {
			return sortedRows.value;
		}

		// Track the sort state directly. The sort orders the underlying array
		// in place, so sortedRows can return the same reference after a sort
		// change (e.g. flipping direction while already on page one, where
		// currentPage does not change either). Reading the column and direction
		// here forces a re-evaluation that a reference check on sortedRows
		// alone would miss.
		void sortedColumn.value;
		void sortDirection.value;

		const rows = sortedRows.value;

		if (!enablePagination.value) {
			return rows;
		}

		const start = (currentPage.value - 1) * itemsPerPage.value;
		const end = start + itemsPerPage.value;

		return rows.slice(start, end);
	});

	return {
		currentPage,
		itemsPerPage,
		paginatedRows,
		rowCount,
	};
}
