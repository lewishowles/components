import { describe, expect, test } from "vite-plus/test";
import { ref } from "vue";
import useTableData from "./use-table-data.js";

describe("useTableData", () => {
	describe("Initialisation", () => {
		test("Returns the expected shape", () => {
			const instance = createComposable();

			for (const key of ["haveData", "internalData"]) {
				expect(instance).toHaveProperty(key);
			}
		});

		test("Has no data when none is provided", () => {
			const { haveData, internalData } = createComposable({ data: [] });

			expect(internalData.value).toEqual([]);
			expect(haveData.value).toBe(false);
		});

		test("Has data when valid rows are provided", () => {
			const { haveData } = createComposable({ data: [{ title: "Toy Story" }] });

			expect(haveData.value).toBe(true);
		});
	});

	describe("internalData", () => {
		test("Drops rows that are not objects", () => {
			const { internalData } = createComposable({ data: [{ title: "A" }, "nope", 5, null] });

			expect(internalData.value).toHaveLength(1);
		});

		test("Builds the internal shape for each row", () => {
			const { internalData } = createComposable({ data: [{ title: "Toy Story" }] });
			const row = internalData.value[0];

			expect(row.raw).toEqual({ title: "Toy Story" });
			expect(row.content.title.content).toBe("Toy Story");
			expect(row.content.title.configuration.searchable).toBe("toy story");
			expect(row.content.title.configuration.sortable).toBe("toy story");
			expect(typeof row.configuration.id).toBe("string");
		});

		describe("Reduces non-string searchable content to an empty string", () => {
			test.for([
				["boolean (true)", true],
				["boolean (false)", false],
				["number (positive)", 1],
				["number (negative)", -1],
				["number (NaN)", NaN],
				["string (empty)", ""],
				["object (non-empty)", { property: "value" }],
				["object (empty)", {}],
				["array (non-empty)", [1, 2, 3]],
				["array (empty)", []],
				["null", null],
				["undefined", undefined],
			])("%s", ([, input]) => {
				const { internalData } = createComposable({ data: [{ id: input }] });

				expect(internalData.value[0].content.id.configuration.searchable).toBe("");
			});
		});

		test("Assigns a unique id to each row", () => {
			const { internalData } = createComposable({ data: [{ title: "A" }, { title: "B" }] });
			const [first, second] = internalData.value;

			expect(first.configuration.id).not.toBe(second.configuration.id);
		});

		test("Uses a column's searchableContentCallback when provided", () => {
			const { internalData } = createComposable({
				data: [{ title: "Toy Story" }],
				columns: { title: { searchableContentCallback: () => "Custom" } },
			});

			expect(internalData.value[0].content.title.configuration.searchable).toBe("custom");
		});

		test("Uses a column's sortableContentCallback when provided", () => {
			const { internalData } = createComposable({
				data: [{ title: "Toy Story" }],
				columns: { title: { sortableContentCallback: () => "Custom" } },
			});

			expect(internalData.value[0].content.title.configuration.sortable).toBe("custom");
		});
	});
});

/**
 * Instantiate the composable with reactive inputs for a test.
 *
 * @param  {object}  options
 *     Test inputs.
 * @param  {object[]}  options.data
 *     The data provided to the table.
 * @param  {object}  options.columns
 *     The column configuration.
 */
function createComposable({ data = [], columns = {} } = {}) {
	const dataRef = ref(data);
	const columnsRef = ref(columns);

	return { data: dataRef, columns: columnsRef, ...useTableData(dataRef, columnsRef) };
}
