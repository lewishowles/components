import { describe, expect, test } from "vite-plus/test";
import { ref } from "vue";
import useTableSearch from "./use-table-search.js";

describe("useTableSearch", () => {
	describe("Initialisation", () => {
		test("Returns the expected shape", () => {
			const instance = createComposable();

			for (const key of ["filteredRows", "haveSearchQuery", "searchQuery"]) {
				expect(instance).toHaveProperty(key);
			}
		});

		test("Starts with no query and an inactive search", () => {
			const { haveSearchQuery, searchQuery } = createComposable();

			expect(searchQuery.value).toBe("");
			expect(haveSearchQuery.value).toBe(false);
		});

		test("Returns every row untouched when there is no query", () => {
			const rows = [createRow({ name: "alice" }), createRow({ name: "bob" })];
			const { filteredRows } = createComposable({ rows });

			expect(filteredRows.value).toEqual(rows);
		});

		test("Returns an empty array when there is no data", () => {
			const { filteredRows } = createComposable({ rows: [] });

			expect(filteredRows.value).toEqual([]);
		});
	});

	describe("haveSearchQuery", () => {
		test("Becomes true once a query is set", () => {
			const { haveSearchQuery, searchQuery } = createComposable();

			searchQuery.value = "alice";

			expect(haveSearchQuery.value).toBe(true);
		});
	});

	describe("filteredRows", () => {
		test("Keeps only rows whose searchable content includes the term", () => {
			const rows = [createRow({ name: "alice" }), createRow({ name: "bob" })];
			const { filteredRows, searchQuery } = createComposable({ rows });

			searchQuery.value = "ali";

			expect(filteredRows.value).toEqual([rows[0]]);
		});

		test("Matches case-insensitively", () => {
			const rows = [createRow({ name: "alice" })];
			const { filteredRows, searchQuery } = createComposable({ rows });

			searchQuery.value = "ALICE";

			expect(filteredRows.value).toEqual([rows[0]]);
		});

		test("Ignores columns marked as not searchable", () => {
			const rows = [createRow({ name: "alice", secret: "alice" })];
			const columns = { name: { searchable: false }, secret: { searchable: false } };
			const { filteredRows, searchQuery } = createComposable({ rows, columns });

			searchQuery.value = "alice";

			expect(filteredRows.value).toEqual([]);
		});

		test("Uses a column's searchCallback in place of the default match", () => {
			const rows = [createRow({ name: "alice" }), createRow({ name: "bob" })];

			const columns = {
				name: { searchCallback: ({ row }) => row.content.name.configuration.searchable === "bob" },
			};

			const { filteredRows, searchQuery } = createComposable({ rows, columns });

			searchQuery.value = "anything";

			expect(filteredRows.value).toEqual([rows[1]]);
		});
	});
});

/**
 * Build an internal row in the shape the table uses, holding searchable content
 * for each column.
 *
 * @param  {object}  values
 *     A map of column key to that column's searchable content.
 */
function createRow(values) {
	const content = {};

	for (const [columnKey, searchable] of Object.entries(values)) {
		content[columnKey] = { configuration: { searchable } };
	}

	return { content };
}

/**
 * Instantiate the composable with reactive inputs for a test.
 *
 * @param  {object}  options
 *     Test inputs.
 * @param  {object[]}  options.rows
 *     The internalised rows to search.
 * @param  {object}  options.columns
 *     The column configuration.
 */
function createComposable({ rows = [], columns = {} } = {}) {
	const internalData = ref(rows);
	const columnConfiguration = ref(columns);

	return {
		internalData,
		columns: columnConfiguration,
		...useTableSearch(internalData, columnConfiguration),
	};
}
