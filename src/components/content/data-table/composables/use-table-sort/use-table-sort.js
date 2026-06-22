import { computed, ref } from "vue";
import { isNonEmptyString } from "@lewishowles/helpers/string";
import { sortByProperty } from "@lewishowles/helpers/array";

// The directions a column can be sorted in. The values double as the `aria-sort`
// token for the sorted column.
export const sortDirections = { ASCENDING: "ascending", DESCENDING: "descending" };

/**
 * Manage column sorting for the data table: which column is sorted and in which
 * direction, the resulting sorted rows, and the helpers that describe the sort
 * state to the table.
 *
 * @param  {object}  filteredRows
 *     A ref of the rows to sort, already filtered by any search.
 * @param  {object}  columnDefinitions
 *     A ref of the column definitions, used to validate sort targets.
 */
export default function useTableSort(filteredRows, columnDefinitions) {
	// The column currently sorted. When null, rows are shown in their provided
	// order.
	const sortedColumn = ref(null);
	// The direction the sorted column is sorted in.
	const sortDirection = ref(sortDirections.ASCENDING);
	// Whether the current sort is ascending.
	const isAscending = computed(() => sortDirection.value === sortDirections.ASCENDING);

	// Our filtered rows, sorted by any currently defined sort.
	const sortedRows = computed(() => {
		if (sortedColumn.value === null) {
			return filteredRows.value;
		}

		return sortByProperty(
			filteredRows.value,
			`content.${sortedColumn.value}.configuration.sortable`,
			{ ascending: isAscending.value },
		);
	});

	/**
	 * Sort the given column key. Sorting a new column starts ascending; sorting
	 * the already-sorted column reverses the direction.
	 *
	 * @param  {string}  columnKey
	 *     The key of the column to sort.
	 */
	function sortColumn(columnKey) {
		if (!isNonEmptyString(columnKey)) {
			return;
		}

		if (!Object.hasOwn(columnDefinitions.value, columnKey)) {
			return;
		}

		if (sortedColumn.value === columnKey) {
			sortDirection.value = isAscending.value
				? sortDirections.DESCENDING
				: sortDirections.ASCENDING;

			return;
		}

		sortedColumn.value = columnKey;
		sortDirection.value = sortDirections.ASCENDING;
	}

	/**
	 * The `aria-sort` value for a column: its sort direction when it is the
	 * sorted column, or null otherwise.
	 *
	 * @param  {string}  columnKey
	 *     The key of the column to check.
	 */
	function getColumnSortDirection(columnKey) {
		return columnKey === sortedColumn.value ? sortDirection.value : null;
	}

	/**
	 * The sort icon for a column, shown only on the currently sorted column.
	 *
	 * @param  {string}  columnKey
	 *     The key of the column to check.
	 */
	function getSortIcon(columnKey) {
		if (sortedColumn.value !== columnKey) {
			return null;
		}

		return isAscending.value ? "icon-arrow-down" : "icon-arrow-up";
	}

	return {
		getColumnSortDirection,
		getSortIcon,
		isAscending,
		sortColumn,
		sortDirection,
		sortedColumn,
		sortedRows,
	};
}
