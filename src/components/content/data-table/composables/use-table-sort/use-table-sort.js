import { computed, ref, watch } from "vue";
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
export default function useTableSort(filteredRows, columnDefinitions, options = {}) {
	const { isServerMode = ref(false), state = ref(null) } = options;

	// The column currently sorted. When null, rows are shown in their provided
	// order.
	const sortedColumn = ref(state.value?.sort?.column ?? null);
	// The direction the sorted column is sorted in.
	const sortDirection = ref(state.value?.sort?.direction ?? sortDirections.ASCENDING);
	// The server-controlled sort state, when server mode is active.
	const serverSort = computed(() => (isServerMode.value ? state.value?.sort : null));

	// The column used for sort indicators and status text.
	const activeSortedColumn = computed(
		() => serverSort.value?.column ?? (isServerMode.value ? null : sortedColumn.value),
	);

	// The direction used for sort indicators and status text.
	const activeSortDirection = computed(
		() =>
			serverSort.value?.direction ??
			(isServerMode.value ? sortDirections.ASCENDING : sortDirection.value),
	);

	// Whether the current sort is ascending.
	const isAscending = computed(() => activeSortDirection.value === sortDirections.ASCENDING);

	// Our filtered rows, sorted by any currently defined sort.
	const sortedRows = computed(() => {
		if (isServerMode.value) {
			return filteredRows.value;
		}

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

		if (activeSortedColumn.value === columnKey) {
			sortDirection.value = isAscending.value
				? sortDirections.DESCENDING
				: sortDirections.ASCENDING;
			updateServerState();

			return;
		}

		sortedColumn.value = columnKey;
		sortDirection.value = sortDirections.ASCENDING;
		updateServerState();
	}

	/**
	 * Report a table-driven sort change through the controlled server state.
	 */
	function updateServerState() {
		if (!isServerMode.value) {
			return;
		}

		const currentState = state.value ?? {};

		const nextSort =
			sortedColumn.value === null
				? null
				: { column: sortedColumn.value, direction: sortDirection.value };

		state.value = { ...currentState, page: 1, sort: nextSort };
	}

	// Keep local sort refs aligned with externally controlled server state changes.
	watch(
		() => state.value?.sort,
		(sort) => {
			if (!isServerMode.value) {
				return;
			}

			sortedColumn.value = sort?.column ?? null;
			sortDirection.value = sort?.direction ?? sortDirections.ASCENDING;
		},
		{ deep: true },
	);

	/**
	 * The `aria-sort` value for a column: its sort direction when it is the
	 * sorted column, or null otherwise.
	 *
	 * @param  {string}  columnKey
	 *     The key of the column to check.
	 */
	function getColumnSortDirection(columnKey) {
		return columnKey === activeSortedColumn.value ? activeSortDirection.value : null;
	}

	/**
	 * The sort icon for a column, shown only on the currently sorted column.
	 *
	 * @param  {string}  columnKey
	 *     The key of the column to check.
	 */
	function getSortIcon(columnKey) {
		if (activeSortedColumn.value !== columnKey) {
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
