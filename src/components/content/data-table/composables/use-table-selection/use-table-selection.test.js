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
		test("Applies an initial client selection through the configured raw row key", async () => {
			const rowA = createRow("internal-a", { name: "Alice", uuid: "a" });
			const rowB = createRow("internal-b", { name: "Bob", uuid: "b" });

			const { selectedRowIds } = createComposable({
				rowKey: "uuid",
				rows: [rowA, rowB],
				selectionValue: [{ name: "Bob", uuid: "b" }],
			});

			await nextTick();

			expect(selectedRowIds.value).toEqual(["internal-b"]);
		});

		test("Applies a replacement client selection", async () => {
			const rowA = createRow("internal-a", { id: "a", name: "Alice" });
			const rowB = createRow("internal-b", { id: "b", name: "Bob" });
			const { selection, selectedRowIds } = createComposable({ rows: [rowA, rowB] });

			selection.value = [{ id: "a", name: "Alice" }];
			await nextTick();
			selection.value = [{ id: "b", name: "Bob" }];
			await nextTick();

			expect(selectedRowIds.value).toEqual(["internal-b"]);
		});

		test("Drops client selection entries that do not match the current data", async () => {
			const row = createRow("internal-a", { id: "a", name: "Alice" });

			const { selection, selectedRowIds } = createComposable({
				rows: [row],
				selectionValue: [row.raw, { id: "missing", name: "Missing" }],
			});

			await nextTick();

			expect(selectedRowIds.value).toEqual(["internal-a"]);
			expect(selection.value).toEqual([row.raw]);
		});

		test("Clears client checkbox state when the external selection is emptied", async () => {
			const row = createRow("internal-a", { id: "a", name: "Alice" });

			const { selection, selectedRowIds } = createComposable({
				rows: [row],
				selectionValue: [row.raw],
			});

			await nextTick();
			selection.value = [];
			await nextTick();

			expect(selectedRowIds.value).toEqual([]);
		});

		test("Treats an undefined model as empty without rewriting it on mount", async () => {
			const { selection, selectedRowIds } = createComposable({
				rows: [createRow("internal-a")],
				selectionValue: undefined,
			});

			await nextTick();

			expect(selectedRowIds.value).toEqual([]);
			expect(selection.value).toBeUndefined();
		});

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

		test("Restores server selection through the configured raw row key", async () => {
			const firstRow = createRow("internal-a", { name: "Alice", uuid: "a" });
			const secondRow = createRow("internal-b", { name: "Bob", uuid: "b" });
			const returnedFirstRow = createRow("returned-a", { name: "Alice", uuid: "a" });

			const { filteredRows, internalData, selectedRowIds, selection } = createComposable({
				rowKey: "uuid",
				rows: [firstRow],
				serverMode: true,
			});

			selectedRowIds.value = ["internal-a"];
			await nextTick();

			internalData.value = [secondRow];
			filteredRows.value = [secondRow];
			await nextTick();

			internalData.value = [returnedFirstRow];
			filteredRows.value = [returnedFirstRow];
			await nextTick();

			expect(selectedRowIds.value).toEqual(["returned-a"]);
			expect(selection.value).toEqual([{ name: "Alice", uuid: "a" }]);
		});

		test("Preserves externally selected server rows outside the current page", async () => {
			const currentRow = createRow("internal-a", { name: "Alice", uuid: "a" });
			const offPageRow = { name: "Bob", uuid: "b" };

			const { selection, selectedRowIds } = createComposable({
				rowKey: "uuid",
				rows: [currentRow],
				selectionValue: [currentRow.raw, offPageRow],
				serverMode: true,
			});

			await nextTick();

			expect(selectedRowIds.value).toEqual(["internal-a"]);
			expect(selection.value).toEqual([currentRow.raw, offPageRow]);
		});

		test("Replaces externally selected server rows without retaining old keys", async () => {
			const rowA = createRow("internal-a", { name: "Alice", uuid: "a" });
			const rowB = createRow("internal-b", { name: "Bob", uuid: "b" });

			const { selection, selectedRowIds } = createComposable({
				rowKey: "uuid",
				rows: [rowA],
				selectionValue: [rowA.raw],
				serverMode: true,
			});

			await nextTick();
			selection.value = [rowB.raw];
			await nextTick();

			expect(selectedRowIds.value).toEqual([]);
			expect(selection.value).toEqual([rowB.raw]);
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
 * @param  {string}  options.rowKey
 *     The raw row property used as the stable server identity.
 * @param  {object[]|undefined}  options.selectionValue
 *     The initial model value.
 * @param  {boolean}  options.serverMode
 *     Whether server selection behaviour is active.
 */
function createComposable(options = {}) {
	const { rows = [], data = rows, enabled = true, rowKey = "id", serverMode = false } = options;
	// Preserve an explicit undefined model while defaulting omitted test input.
	const selectionValue = Object.hasOwn(options, "selectionValue") ? options.selectionValue : [];
	const internalData = ref(data);
	const filteredRows = ref(rows);
	const selection = ref(selectionValue);
	const enableSelection = ref(enabled);
	const isServerMode = ref(serverMode);
	const rowKeyRef = ref(rowKey);

	return {
		internalData,
		filteredRows,
		selection,
		enableSelection,
		...useTableSelection(internalData, filteredRows, selection, enableSelection, {
			isServerMode,
			rowKey: rowKeyRef,
		}),
	};
}
