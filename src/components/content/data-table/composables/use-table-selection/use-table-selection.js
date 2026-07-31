import { computed, ref, shallowRef, watch } from "vue";
import { arrayLength, isNonEmptyArray } from "@lewishowles/helpers/array";
import { isEqual } from "@lewishowles/helpers/general";
import { getPathValue } from "@lewishowles/helpers/object";
import { getRawRow, getRowId } from "../../utilities/row.js";

/**
 * Manage row selection for the data table: which rows are selected, the
 * select-all state, the selection counts, and the action to toggle every row.
 * The table's `v-model` and its selection controls are kept in sync through the
 * raw data of the selected rows.
 *
 * @param  {object}  internalData
 *     A ref of the table's internalised rows.
 * @param  {object}  filteredRows
 *     A ref of the rows currently visible after any search.
 * @param  {object}  selection
 *     The table's `v-model` ref containing the raw selected rows.
 * @param  {object}  enableSelection
 *     A ref reflecting whether selection is enabled.
 * @param  {object}  options
 *     Mode-specific selection options.
 * @param  {object}  options.isServerMode
 *     A ref reflecting whether rows are externally controlled.
 * @param  {object}  options.rowKey
 *     A ref containing the raw row property path used as stable identity.
 */
export default function useTableSelection(
	internalData,
	filteredRows,
	selection,
	enableSelection,
	options = {},
) {
	const { isServerMode = ref(false), rowKey = ref("id") } = options;

	// The internal row IDs bound to selection checkboxes.
	const selectedRowIds = ref([]);
	// The selected server rows, keyed by stable identity.
	const selectedRowsByKey = shallowRef(new Map());

	// The model array most recently written by this composable.
	let lastSelectionWrite;

	// Our checkbox that visually determines whether all rows are selected, and
	// allows the user to toggle state globally.
	const selectAllRows = ref(false);

	/**
	 * Get a stable selection key from a raw row.
	 *
	 * @param  {object}  rawRow
	 *     The row data provided to the table.
	 */
	function getRawSelectionKey(rawRow) {
		const key = getPathValue(rawRow, rowKey.value, null);

		return key === null || key === undefined ? null : key;
	}

	/**
	 * Get the selection key for an internal row. Server rows use the configured
	 * raw value because internal row IDs are regenerated when a page is normalised.
	 *
	 * @param  {object}  row
	 *     The standardised row data.
	 */
	function getSelectionKey(row) {
		if (isServerMode.value) {
			const rowKeyValue = getRawSelectionKey(getRawRow(row));

			if (rowKeyValue !== null) {
				return rowKeyValue;
			}
		}

		return getRowId(row);
	}

	/**
	 * Update selected row IDs only when their values have changed.
	 *
	 * @param  {string[]}  rowIds
	 *     The next selected internal row IDs.
	 */
	function setSelectedRowIds(rowIds) {
		if (isEqual(selectedRowIds.value, rowIds)) {
			return;
		}

		selectedRowIds.value = rowIds;
	}

	/**
	 * Restore checkbox state for the current rows from stable selection keys.
	 *
	 * @param  {object[]}  rows
	 *     The current standardised rows.
	 */
	function restoreCurrentPageCheckboxes(rows) {
		if (!isServerMode.value) {
			const selectedKeys = new Set(
				(isNonEmptyArray(selection.value) ? selection.value : [])
					.map((row) => getRawSelectionKey(row))
					.filter((key) => key !== null),
			);

			const rowIds = rows
				.filter((row) => selectedKeys.has(getRawSelectionKey(getRawRow(row))))
				.map((row) => getRowId(row));

			setSelectedRowIds(rowIds);

			return;
		}

		const nextSelectedRows = new Map(selectedRowsByKey.value);

		let selectedRowsChanged = false;

		for (const row of rows) {
			const key = getSelectionKey(row);
			const rawRow = getRawRow(row);

			if (nextSelectedRows.has(key) && nextSelectedRows.get(key) !== rawRow) {
				nextSelectedRows.set(key, rawRow);
				selectedRowsChanged = true;
			}
		}

		if (selectedRowsChanged) {
			selectedRowsByKey.value = nextSelectedRows;
		}

		setSelectedRowIds(
			rows.filter((row) => nextSelectedRows.has(getSelectionKey(row))).map((row) => getRowId(row)),
		);
	}

	// The raw rows that correspond to our `selectedRowIds`.
	const selectedRows = computed(() => {
		if (enableSelection.value !== true) {
			return [];
		}

		if (isServerMode.value) {
			return [...selectedRowsByKey.value.values()];
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
	const selectedRowCount = computed(() => {
		if (isServerMode.value) {
			return selectedRowsByKey.value.size;
		}

		return arrayLength(selectedRowIds.value);
	});

	// The number of selected rows in the current server page.
	const visibleSelectedRowCount = computed(() => {
		if (!isServerMode.value) {
			return selectedRowCount.value;
		}

		return filteredRows.value.filter((row) => selectedRowsByKey.value.has(getSelectionKey(row)))
			.length;
	});

	// Whether every visible row is selected.
	const areAllRowsSelected = computed(() => {
		if (isServerMode.value) {
			return (
				arrayLength(filteredRows.value) > 0 &&
				visibleSelectedRowCount.value === arrayLength(filteredRows.value)
			);
		}

		return selectedRowCount.value === arrayLength(filteredRows.value);
	});

	// Whether the select-all checkbox should be indeterminate (some, but not all,
	// rows selected).
	const selectAllIndeterminate = computed(
		() =>
			(isServerMode.value ? visibleSelectedRowCount.value : selectedRowCount.value) > 0 &&
			!areAllRowsSelected.value,
	);

	/**
	 * Apply checkbox changes from the current server page without changing
	 * selections on other pages.
	 *
	 * @param  {string[]}  rowIds
	 *     The selected internal row IDs.
	 */
	function updateSelectedRowsFromCurrentPage(rowIds) {
		if (!isServerMode.value) {
			return;
		}

		const selectedIds = new Set(rowIds);
		const nextSelectedRows = new Map(selectedRowsByKey.value);

		for (const row of internalData.value) {
			const key = getSelectionKey(row);

			if (selectedIds.has(getRowId(row))) {
				nextSelectedRows.set(key, getRawRow(row));
			} else {
				nextSelectedRows.delete(key);
			}
		}

		selectedRowsByKey.value = nextSelectedRows;
	}

	watch(selectedRowIds, updateSelectedRowsFromCurrentPage);

	/**
	 * Replace server selection with the valid keyed rows from the model.
	 *
	 * @param  {object[]|undefined}  modelSelection
	 *     The externally provided selected rows.
	 */
	function updateSelectedServerRows(modelSelection) {
		const nextSelectedRows = new Map();

		for (const row of isNonEmptyArray(modelSelection) ? modelSelection : []) {
			const key = getRawSelectionKey(row);

			if (key !== null) {
				nextSelectedRows.set(key, row);
			}
		}

		if (nextSelectedRows.size === 0 && selectedRowsByKey.value.size === 0) {
			return;
		}

		selectedRowsByKey.value = nextSelectedRows;
	}

	// When the selected rows change, update our model value.
	watch(selectedRows, (nextSelectedRows) => {
		if (enableSelection.value !== true) {
			return;
		}

		selection.value = nextSelectedRows;
		lastSelectionWrite = selection.value;

		if (!isNonEmptyArray(nextSelectedRows)) {
			if (selectAllRows.value === true) {
				selectAllRows.value = false;
			}
		}
	});

	// Apply initial and later external model values to checkbox state.
	watch(
		selection,
		(modelSelection) => {
			if (modelSelection === lastSelectionWrite) {
				lastSelectionWrite = undefined;

				return;
			}

			if (isServerMode.value) {
				updateSelectedServerRows(modelSelection);
			}

			restoreCurrentPageCheckboxes(internalData.value);
		},
		{ immediate: true },
	);

	watch(internalData, restoreCurrentPageCheckboxes, { immediate: true });

	// If all rows are now selected, and `selectAllRows` is not, we check it. If
	// not all rows are selected, but `selectAllRows` is, we uncheck it.
	watch([selectedRowIds, selectedRowsByKey, filteredRows], () => {
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
		if (isServerMode.value) {
			const visibleRowIds = filteredRows.value.map((row) => getRowId(row));

			if (selectAllRows.value) {
				selectedRowIds.value = [...new Set([...selectedRowIds.value, ...visibleRowIds])];
			} else {
				selectedRowIds.value = selectedRowIds.value.filter(
					(rowId) => !visibleRowIds.includes(rowId),
				);
			}

			return;
		}

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
