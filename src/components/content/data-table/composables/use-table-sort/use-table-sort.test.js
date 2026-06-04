import { describe, expect, test } from "vite-plus/test";
import { ref } from "vue";
import useTableSort, { sortDirections } from "./use-table-sort.js";

/**
 * Build an internal row in the shape the table uses, holding sortable content
 * for each column.
 *
 * @param  {object}  values
 *     A map of column key to that column's sortable content.
 */
function createRow(values) {
	const content = {};

	for (const [columnKey, sortable] of Object.entries(values)) {
		content[columnKey] = { configuration: { sortable } };
	}

	return { content };
}

/**
 * Instantiate the composable with reactive inputs for a test.
 *
 * @param  {object}  options
 *     Test inputs.
 * @param  {object[]}  options.rows
 *     The filtered rows to sort.
 * @param  {object}  options.columns
 *     The column definitions.
 */
function createComposable({ rows = [], columns = { name: { label: "Name" } } } = {}) {
	const filteredRows = ref(rows);
	const columnDefinitions = ref(columns);

	return { columnDefinitions, filteredRows, ...useTableSort(filteredRows, columnDefinitions) };
}

describe("useTableSort", () => {
	describe("Initialisation", () => {
		test("Returns the expected shape", () => {
			const instance = createComposable();

			for (const key of [
				"getColumnSortDirection",
				"getSortIcon",
				"isAscending",
				"sortColumn",
				"sortDirection",
				"sortedColumn",
				"sortedRows",
			]) {
				expect(instance).toHaveProperty(key);
			}
		});

		test("Starts unsorted and ascending", () => {
			const { isAscending, sortDirection, sortedColumn } = createComposable();

			expect(sortedColumn.value).toBeNull();
			expect(sortDirection.value).toBe(sortDirections.ASCENDING);
			expect(isAscending.value).toBe(true);
		});

		test("Returns the filtered rows untouched when unsorted", () => {
			const rows = [createRow({ name: "b" }), createRow({ name: "a" })];
			const { sortedRows } = createComposable({ rows });

			expect(sortedRows.value).toEqual(rows);
		});
	});

	describe("sortColumn", () => {
		test("Sorts a new column ascending", () => {
			const { sortColumn, sortDirection, sortedColumn } = createComposable();

			sortColumn("name");

			expect(sortedColumn.value).toBe("name");
			expect(sortDirection.value).toBe(sortDirections.ASCENDING);
		});

		test("Reverses direction when sorting the same column again", () => {
			const { sortColumn, sortDirection } = createComposable();

			sortColumn("name");
			sortColumn("name");

			expect(sortDirection.value).toBe(sortDirections.DESCENDING);
		});

		test("Ignores an empty column key", () => {
			const { sortColumn, sortedColumn } = createComposable();

			sortColumn("");

			expect(sortedColumn.value).toBeNull();
		});

		test("Ignores a column key that is not defined", () => {
			const { sortColumn, sortedColumn } = createComposable();

			sortColumn("unknown");

			expect(sortedColumn.value).toBeNull();
		});
	});

	describe("sortedRows", () => {
		test("Sorts rows by the column's sortable content ascending", () => {
			const rows = [
				createRow({ name: "charlie" }),
				createRow({ name: "alice" }),
				createRow({ name: "bob" }),
			];

			const { sortColumn, sortedRows } = createComposable({ rows });

			sortColumn("name");

			expect(sortedRows.value.map((row) => row.content.name.configuration.sortable)).toEqual([
				"alice",
				"bob",
				"charlie",
			]);
		});

		test("Sorts descending when the direction is reversed", () => {
			const rows = [createRow({ name: "alice" }), createRow({ name: "bob" })];
			const { sortColumn, sortedRows } = createComposable({ rows });

			sortColumn("name");
			sortColumn("name");

			expect(sortedRows.value.map((row) => row.content.name.configuration.sortable)).toEqual([
				"bob",
				"alice",
			]);
		});
	});

	describe("Sort indicators", () => {
		test("getColumnSortDirection reflects the sorted column and direction", () => {
			const { getColumnSortDirection, sortColumn } = createComposable();

			expect(getColumnSortDirection("name")).toBeNull();

			sortColumn("name");
			expect(getColumnSortDirection("name")).toBe("ascending");

			sortColumn("name");
			expect(getColumnSortDirection("name")).toBe("descending");
		});

		test("getSortIcon shows an icon only on the sorted column", () => {
			const { getSortIcon, sortColumn } = createComposable();

			expect(getSortIcon("name")).toBeNull();

			sortColumn("name");
			expect(getSortIcon("name")).toBe("icon-arrow-down");

			sortColumn("name");
			expect(getSortIcon("name")).toBe("icon-arrow-up");
		});
	});
});
