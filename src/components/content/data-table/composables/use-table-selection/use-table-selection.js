import { computed, ref, watch } from "vue";
import { arrayLength, isNonEmptyArray } from "@lewishowles/helpers/array";
import { getRawRow, getRowId } from "../../utilities/row.js";

/**
 * Manage row selection for the data table: which rows are selected, the
 * select-all state, the selection counts, and the action to toggle every row.
 * The table's `v-model` is kept in sync with the raw data of the selected rows.
 *
 * @param  {object}  internalData
 *     A ref of the table's internalised rows.
 * @param  {object}  filteredRows
 *     A ref of the rows currently visible after any search.
 * @param  {object}  selection
 *     The table's `v-model` ref, updated with the raw selected rows.
 * @param  {object}  enableSelection
 *     A ref reflecting whether selection is enabled.
 */
export default function useTableSelection(internalData, filteredRows, selection, enableSelection) {
	// The internal IDs of the selected rows.
	const selectedRowIds = ref([]);
	// Our checkbox that visually determines whether all rows are selected, and
	// allows the user to toggle state globally.
	const selectAllRows = ref(false);

	// The raw rows that correspond to our `selectedRowIds`.
	const selectedRows = computed(() => {
		if (enableSelection.value !== true) {
			return [];
		}

		const internalRows = internalData.value.filter((row) =>
			selectedRowIds.value.includes(getRowId(row)),
		);

		if (!isNonEmptyArray(internalRows)) {
			return [];
		}

		return internalRows.map((row) => getRawRow(row));
	});

	// The number of rows currently selected.
	const selectedRowCount = computed(() => arrayLength(selectedRowIds.value));

	// Whether every visible row is selected.
	const areAllRowsSelected = computed(
		() => selectedRowCount.value === arrayLength(filteredRows.value),
	);

	// Whether the select-all checkbox should be indeterminate (some, but not all,
	// rows selected).
	const selectAllIndeterminate = computed(
		() => selectedRowCount.value > 0 && !areAllRowsSelected.value,
	);

	// When the selected rows change, update our model value.
	watch(selectedRows, () => {
		if (enableSelection.value !== true) {
			return;
		}

		if (!isNonEmptyArray(selectedRows.value)) {
			selection.value = [];

			if (selectAllRows.value === true) {
				selectAllRows.value = false;
			}

			return;
		}

		selection.value = selectedRows.value;
	});

	// If all rows are now selected, and `selectAllRows` is not, we check it. If
	// not all rows are selected, but `selectAllRows` is, we uncheck it.
	watch(selectedRowIds, () => {
		if (areAllRowsSelected.value && !selectAllRows.value) {
			selectAllRows.value = true;
		} else if (!areAllRowsSelected.value && selectAllRows.value) {
			selectAllRows.value = false;
		}
	});

	/**
	 * Select, or deselect, all individual rows depending on the current state of
	 * the `selectAllRows` checkbox. We perform this action as part of a function
	 * to separate the display of whether all rows are selected from the intention
	 * to select or deselect all rows.
	 */
	function toggleAllRows() {
		if (selectAllRows.value) {
			selectedRowIds.value = filteredRows.value.map((row) => getRowId(row));
		} else {
			selectedRowIds.value = [];
		}
	}

	return {
		areAllRowsSelected,
		selectAllIndeterminate,
		selectAllRows,
		selectedRowCount,
		selectedRowIds,
		toggleAllRows,
	};
}
