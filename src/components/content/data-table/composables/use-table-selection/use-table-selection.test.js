import { describe, expect, test } from "vite-plus/test";
import { nextTick, ref } from "vue";
import useTableSelection from "./use-table-selection.js";

describe("useTableSelection", () => {
	describe("Initialisation", () => {
		test("Returns the expected shape", () => {
			const instance = createComposable();

			for (const key of [
				"areAllRowsSelected",
				"selectAllIndeterminate",
				"selectAllRows",
				"selectedRowCount",
				"selectedRowIds",
				"toggleAllRows",
			]) {
				expect(instance).toHaveProperty(key);
			}
		});

		test("Starts with nothing selected", () => {
			const { selectAllRows, selectedRowCount, selectedRowIds } = createComposable({
				rows: [createRow("a"), createRow("b")],
			});

			expect(selectedRowIds.value).toEqual([]);
			expect(selectedRowCount.value).toBe(0);
			expect(selectAllRows.value).toBe(false);
		});
	});

	describe("Counts and state", () => {
		test("selectedRowCount tracks the selected ids", () => {
			const { selectedRowCount, selectedRowIds } = createComposable({
				rows: [createRow("a"), createRow("b")],
			});

			selectedRowIds.value = ["a"];

			expect(selectedRowCount.value).toBe(1);
		});

		test("areAllRowsSelected is true only when every visible row is selected", () => {
			const { areAllRowsSelected, selectedRowIds } = createComposable({
				rows: [createRow("a"), createRow("b")],
			});

			expect(areAllRowsSelected.value).toBe(false);

			selectedRowIds.value = ["a", "b"];

			expect(areAllRowsSelected.value).toBe(true);
		});

		test("selectAllIndeterminate is true for a partial selection only", () => {
			const { selectAllIndeterminate, selectedRowIds } = createComposable({
				rows: [createRow("a"), createRow("b")],
			});

			expect(selectAllIndeterminate.value).toBe(false);

			selectedRowIds.value = ["a"];
			expect(selectAllIndeterminate.value).toBe(true);

			selectedRowIds.value = ["a", "b"];
			expect(selectAllIndeterminate.value).toBe(false);
		});
	});

	describe("toggleAllRows", () => {
		test("Selects every visible row when the checkbox is checked", () => {
			const { selectAllRows, selectedRowIds, toggleAllRows } = createComposable({
				rows: [createRow("a"), createRow("b")],
			});

			selectAllRows.value = true;
			toggleAllRows();

			expect(selectedRowIds.value).toEqual(["a", "b"]);
		});

		test("Clears the selection when the checkbox is unchecked", () => {
			const { selectAllRows, selectedRowIds, toggleAllRows } = createComposable({
				rows: [createRow("a"), createRow("b")],
			});

			selectedRowIds.value = ["a", "b"];
			selectAllRows.value = false;
			toggleAllRows();

			expect(selectedRowIds.value).toEqual([]);
		});
	});

	describe("Select-all synchronisation", () => {
		test("Checks select-all when every row becomes selected", async () => {
			const { selectAllRows, selectedRowIds } = createComposable({
				rows: [createRow("a"), createRow("b")],
			});

			selectedRowIds.value = ["a", "b"];
			await nextTick();

			expect(selectAllRows.value).toBe(true);
		});

		test("Unchecks select-all when a row is deselected", async () => {
			const { selectAllRows, selectedRowIds } = createComposable({
				rows: [createRow("a"), createRow("b")],
			});

			selectedRowIds.value = ["a", "b"];
			await nextTick();

			selectedRowIds.value = ["a"];
			await nextTick();

			expect(selectAllRows.value).toBe(false);
		});
	});

	describe("Model synchronisation", () => {
		test("Updates the model with the raw data of the selected rows", async () => {
			const rowA = createRow("a", { id: "a", name: "Alice" });
			const rowB = createRow("b", { id: "b", name: "Bob" });
			const { selection, selectedRowIds } = createComposable({ rows: [rowA, rowB] });

			selectedRowIds.value = ["b"];
			await nextTick();

			expect(selection.value).toEqual([{ id: "b", name: "Bob" }]);
		});

		test("Clears the model when nothing is selected", async () => {
			const { selection, selectedRowIds } = createComposable({
				rows: [createRow("a"), createRow("b")],
			});

			selectedRowIds.value = ["a"];
			await nextTick();

			selectedRowIds.value = [];
			await nextTick();

			expect(selection.value).toEqual([]);
		});

		test("Does not update the model when selection is disabled", async () => {
			const { selection, selectedRowIds } = createComposable({
				rows: [createRow("a")],
				enabled: false,
			});

			selectedRowIds.value = ["a"];
			await nextTick();

			expect(selection.value).toEqual([]);
		});
	});
});

/**
 * Build an internal row in the shape the table uses, holding the id assigned on
 * initialisation and the raw row the consumer provided.
 *
 * @param  {string}  id
 *     The internal id for the row.
 * @param  {object}  raw
 *     The raw row data.
 */
function createRow(id, raw = { id }) {
	return { configuration: { id }, raw };
}

/**
 * Instantiate the composable with reactive inputs for a test. `internalData`
 * defaults to the same rows as `filteredRows`, matching the unfiltered table.
 *
 * @param  {object}  options
 *     Test inputs.
 * @param  {object[]}  options.rows
 *     The filtered rows available for selection.
 * @param  {object[]}  options.data
 *     The full internal data, when it differs from the filtered rows.
 * @param  {boolean}  options.enabled
 *     Whether selection is enabled.
 */
function createComposable({ rows = [], data = rows, enabled = true } = {}) {
	const internalData = ref(data);
	const filteredRows = ref(rows);
	const selection = ref([]);
	const enableSelection = ref(enabled);

	return {
		internalData,
		filteredRows,
		selection,
		enableSelection,
		...useTableSelection(internalData, filteredRows, selection, enableSelection),
	};
}
