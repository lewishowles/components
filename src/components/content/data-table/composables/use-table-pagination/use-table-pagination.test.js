import { describe, expect, test } from "vite-plus/test";
import { nextTick, ref } from "vue";
import useTablePagination from "./use-table-pagination.js";

describe("useTablePagination", () => {
	describe("Initialisation", () => {
		test("Returns the expected shape", () => {
			const instance = createComposable();

			for (const key of ["currentPage", "paginatedRows", "rowCount"]) {
				expect(instance).toHaveProperty(key);
			}
		});

		test("Starts on the first page", () => {
			const { currentPage } = createComposable({ rows: createRows(25) });

			expect(currentPage.value).toBe(1);
		});

		test("rowCount reflects the total number of rows", () => {
			const { rowCount } = createComposable({ rows: createRows(25) });

			expect(rowCount.value).toBe(25);
		});
	});

	describe("paginatedRows", () => {
		test("Shows every row when pagination is disabled", () => {
			const rows = createRows(25);
			const { paginatedRows } = createComposable({ rows, enabled: false });

			expect(paginatedRows.value).toEqual(rows);
		});

		test("Shows only the first page when pagination is enabled", () => {
			const { paginatedRows } = createComposable({ rows: createRows(25) });

			expect(paginatedRows.value).toHaveLength(10);
			expect(paginatedRows.value[0].id).toBe(0);
		});

		test("Shows the requested page", async () => {
			const { currentPage, paginatedRows } = createComposable({ rows: createRows(25) });

			currentPage.value = 2;
			await nextTick();

			expect(paginatedRows.value).toHaveLength(10);
			expect(paginatedRows.value[0].id).toBe(10);
		});

		test("Shows a partial final page", async () => {
			const { currentPage, paginatedRows } = createComposable({ rows: createRows(25) });

			currentPage.value = 3;
			await nextTick();

			expect(paginatedRows.value).toHaveLength(5);
			expect(paginatedRows.value[0].id).toBe(20);
		});
	});

	describe("Page reset", () => {
		test("Returns to the first page when the row set changes", async () => {
			const { currentPage, filteredRows, sortedRows } = createComposable({ rows: createRows(25) });

			currentPage.value = 2;
			await nextTick();

			const next = createRows(5);

			filteredRows.value = next;
			sortedRows.value = next;
			await nextTick();

			expect(currentPage.value).toBe(1);
		});
	});
});

/**
 * Build a list of simple rows, each identified by its index.
 *
 * @param  {number}  count
 *     How many rows to create.
 */
function createRows(count) {
	return Array.from({ length: count }, (_, id) => ({ id }));
}

/**
 * Instantiate the composable with reactive inputs for a test. `filteredRows`
 * and `sortedRows` start from the same rows; a test can change either to drive
 * the search and sort behaviour.
 *
 * @param  {object}  options
 *     Test inputs.
 * @param  {object[]}  options.rows
 *     The rows to paginate.
 * @param  {boolean}  options.enabled
 *     Whether pagination is enabled.
 */
function createComposable({ rows = [], enabled = true } = {}) {
	const filteredRows = ref(rows);
	const sortedRows = ref(rows);
	const sortedColumn = ref(null);
	const sortDirection = ref("ascending");
	const enablePagination = ref(enabled);

	return {
		filteredRows,
		sortedRows,
		sortedColumn,
		sortDirection,
		enablePagination,
		...useTablePagination(
			{ filteredRows, sortedRows, sortedColumn, sortDirection },
			enablePagination,
		),
	};
}
