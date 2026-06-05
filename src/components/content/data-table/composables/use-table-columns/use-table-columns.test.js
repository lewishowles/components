import { describe, expect, test } from "vite-plus/test";
import { ref } from "vue";
import useTableColumns from "./use-table-columns.js";

describe("useTableColumns", () => {
	describe("Initialisation", () => {
		test("Returns the expected shape", () => {
			const instance = createComposable();

			for (const key of [
				"columnDefinitions",
				"columnVisibility",
				"getCellClasses",
				"getColumnLabel",
				"getHeadingClasses",
				"tableDensity",
				"tableDensityOptions",
				"updateTableDensityOptions",
				"visibleColumnDefinitions",
			]) {
				expect(instance).toHaveProperty(key);
			}
		});

		test("Initialises visibility for configured, non-hidden columns", () => {
			const { columnVisibility } = createComposable({
				columns: { title: {}, secret: { hidden: true } },
			});

			expect(columnVisibility.value).toEqual({ title: true });
		});
	});

	describe("columnDefinitions", () => {
		test("Is empty when there is no data", () => {
			const { columnDefinitions } = createComposable({ columns: { title: {} }, haveData: false });

			expect(columnDefinitions.value).toEqual({});
		});

		test("Is empty when no columns are configured", () => {
			const { columnDefinitions } = createComposable({ columns: {} });

			expect(columnDefinitions.value).toEqual({});
		});

		test("Defaults the label to the column key and applies sensible defaults", () => {
			const { columnDefinitions } = createComposable({ columns: { year: {} } });

			expect(columnDefinitions.value.year).toEqual(
				expect.objectContaining({
					label: "year",
					sortable: true,
					tabularNums: false,
					visible: true,
				}),
			);
		});

		test("Excludes a column hidden by configuration", () => {
			const { columnDefinitions } = createComposable({
				columns: { title: {}, secret: { hidden: true } },
			});

			expect(columnDefinitions.value).toHaveProperty("title");
			expect(columnDefinitions.value).not.toHaveProperty("secret");
		});

		test("Marks the first and last columns", () => {
			const { columnDefinitions } = createComposable({ columns: { a: {}, b: {}, c: {} } });

			expect(columnDefinitions.value.a.first).toBe(true);
			expect(columnDefinitions.value.b.first).toBe(false);
			expect(columnDefinitions.value.c.last).toBe(true);
		});

		test("Marks a column hidden by preference as not visible but keeps it defined", () => {
			const { columnDefinitions, columnVisibility, visibleColumnDefinitions } = createComposable({
				columns: { title: {}, year: {} },
			});

			columnVisibility.value = { title: false, year: true };

			expect(columnDefinitions.value.title.visible).toBe(false);
			expect(columnDefinitions.value).toHaveProperty("title");
			expect(visibleColumnDefinitions.value).not.toHaveProperty("title");
			expect(visibleColumnDefinitions.value).toHaveProperty("year");
		});
	});

	describe("getColumnLabel", () => {
		test("Returns the label for a column", () => {
			const { getColumnLabel } = createComposable({ columns: { title: { label: "Title" } } });

			expect(getColumnLabel("title")).toBe("Title");
		});
	});

	describe("Class merging", () => {
		test("getHeadingClasses merges table-level and column-level classes", () => {
			const { getHeadingClasses } = createComposable({ headingClasses: "font-bold" });
			const classes = getHeadingClasses({ headingClasses: "text-lg" });

			expect(classes).toContain("font-bold");
			expect(classes).toContain("text-lg");
		});

		test("getCellClasses reflects the table density", () => {
			const { getCellClasses, tableDensity } = createComposable();

			expect(getCellClasses({})).toContain("py-4");

			tableDensity.value = "compact";
			expect(getCellClasses({})).toContain("py-2");

			tableDensity.value = "standard";
			expect(getCellClasses({})).toContain("py-3");
		});
	});

	describe("updateTableDensityOptions", () => {
		test("Stores the provided options", () => {
			const { tableDensityOptions, updateTableDensityOptions } = createComposable();

			updateTableDensityOptions(["compact", "standard"]);

			expect(tableDensityOptions.value).toEqual(["compact", "standard"]);
		});

		test("Ignores an empty list", () => {
			const { tableDensityOptions, updateTableDensityOptions } = createComposable();

			updateTableDensityOptions(["compact"]);
			updateTableDensityOptions([]);

			expect(tableDensityOptions.value).toEqual(["compact"]);
		});
	});
});

/**
 * Instantiate the composable with reactive inputs for a test. A `name` is left
 * unset by default so column visibility is not persisted to storage.
 *
 * @param  {object}  options
 *     Test inputs.
 * @param  {object}  options.columns
 *     The user's column configuration.
 * @param  {string}  options.name
 *     The table name used for persistence.
 * @param  {boolean}  options.haveData
 *     Whether the table has data.
 * @param  {string}  options.headingClasses
 *     The table-level heading classes.
 * @param  {string}  options.cellClasses
 *     The table-level cell classes.
 */
function createComposable({
	columns = {},
	name,
	haveData = true,
	headingClasses = "",
	cellClasses = "",
} = {}) {
	const columnsRef = ref(columns);
	const haveDataRef = ref(haveData);
	const headingClassesRef = ref(headingClasses);
	const cellClassesRef = ref(cellClasses);

	return {
		columns: columnsRef,
		haveData: haveDataRef,
		...useTableColumns({
			columns: columnsRef,
			name,
			haveData: haveDataRef,
			headingClasses: headingClassesRef,
			cellClasses: cellClassesRef,
		}),
	};
}
