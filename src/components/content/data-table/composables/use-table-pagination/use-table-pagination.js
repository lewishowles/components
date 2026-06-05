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
 */
export default function useTablePagination(source, enablePagination) {
	const { filteredRows, sortedRows, sortedColumn, sortDirection } = source;

	// The current page of results being viewed.
	const currentPage = ref(1);
	// The total number of rows being paginated.
	const rowCount = computed(() => arrayLength(sortedRows.value));

	// Reset to the first page when the filtered rows or sort change.
	watch([filteredRows, sortedColumn, sortDirection], () => {
		currentPage.value = 1;
	});

	// The rows shown for the current page.
	const paginatedRows = computed(() => {
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

		const start = (currentPage.value - 1) * pageSize;
		const end = start + pageSize;

		return rows.slice(start, end);
	});

	return {
		currentPage,
		paginatedRows,
		rowCount,
	};
}
