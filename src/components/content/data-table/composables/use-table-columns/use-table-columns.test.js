import { afterEach, describe, expect, test } from "vite-plus/test";
import { nextTick, ref } from "vue";
import useTableColumns from "./use-table-columns.js";

describe("useTableColumns", () => {
	afterEach(() => {
		localStorage.getItem.mockReturnValue(null);
		localStorage.setItem.mockClear();
	});

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

		test("Appends a non-sortable actions column when its slot is present", () => {
			const { columnDefinitions } = createComposable({
				columns: { title: {} },
				haveActionsSlot: true,
			});

			expect(Object.keys(columnDefinitions.value)).toEqual(["title", "actions"]);
			expect(columnDefinitions.value.actions).toEqual({
				label: "Actions",
				visuallyHiddenHeading: true,
				first: false,
				last: true,
				sortable: false,
				tabularNums: false,
				visible: true,
				configurable: false,
				columnClasses: "w-px min-w-0",
			});
		});

		test("Adds an actions column when no columns are configured", () => {
			const { columnDefinitions } = createComposable({ haveActionsSlot: true });

			expect(columnDefinitions.value).toEqual({
				actions: {
					label: "Actions",
					visuallyHiddenHeading: true,
					first: true,
					last: true,
					sortable: false,
					tabularNums: false,
					visible: true,
					configurable: false,
					columnClasses: "w-px min-w-0",
				},
			});
		});

		test("Keeps an explicitly configured actions column without adding another", () => {
			const { columnDefinitions } = createComposable({
				columns: {
					title: {},
					actions: { label: "More", sortable: true, visible: false, columnClasses: "custom" },
				},
				haveActionsSlot: true,
			});

			expect(Object.keys(columnDefinitions.value)).toEqual(["title", "actions"]);
			expect(columnDefinitions.value.actions).toEqual(
				expect.objectContaining({
					label: "More",
					sortable: true,
					visible: false,
					columnClasses: "custom",
				}),
			);
		});

		test("Does not add an actions column when its key is hidden by configuration", () => {
			const { columnDefinitions } = createComposable({
				columns: { title: {}, actions: { hidden: true } },
				haveActionsSlot: true,
			});

			expect(columnDefinitions.value).not.toHaveProperty("actions");
		});

		test("Does not add an actions column when its slot is absent", () => {
			const { columnDefinitions } = createComposable({ columns: { title: {} } });

			expect(columnDefinitions.value).not.toHaveProperty("actions");
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

		test("Keeps a dotted column ID as a literal configuration and visibility key", () => {
			localStorage.getItem.mockReturnValue(JSON.stringify({ "nested.key": false }));

			const { columnDefinitions, columnVisibility, getColumnLabel } = createComposable({
				columns: {
					"nested.key": { label: "Nested", sortable: false },
				},
				name: "nested-table",
			});

			expect(columnVisibility.value).toEqual({ "nested.key": false });

			expect(columnDefinitions.value["nested.key"]).toEqual(
				expect.objectContaining({ label: "Nested", sortable: false, visible: false }),
			);

			expect(getColumnLabel("nested.key")).toBe("Nested");
		});

		test("Switches to the new table's stored column visibility when the name changes", async () => {
			localStorage.getItem.mockImplementation((key) => {
				if (key === "data-table:new-table:columns") {
					return JSON.stringify({ title: false });
				}

				return null;
			});

			const name = ref("old-table");
			const { columnVisibility } = createComposable({ name, columns: { title: {} } });

			await nextTick();
			localStorage.setItem.mockClear();
			name.value = "new-table";
			await nextTick();

			expect(columnVisibility.value.title).toBe(false);

			columnVisibility.value.title = true;
			await nextTick();

			expect(localStorage.setItem).toHaveBeenCalledWith(
				"data-table:new-table:columns",
				expect.any(String),
			);
			expect(localStorage.setItem.mock.calls).not.toContainEqual([
				"data-table:old-table:columns",
				expect.any(String),
			]);
		});
	});

	describe("getColumnLabel", () => {
		test("Returns the label for a column", () => {
			const { getColumnLabel } = createComposable({ columns: { title: { label: "Title" } } });

			expect(getColumnLabel("title")).toBe("Title");
		});
	});

	describe("Class merging", () => {
		test("adds a default minimum width to headings and cells", () => {
			const { getCellClasses, getHeadingClasses } = createComposable();

			expect(getHeadingClasses({})).toContain("min-w-32");
			expect(getCellClasses({})).toContain("min-w-32");
		});

		test("allows column classes to override the default minimum width", () => {
			const { getCellClasses, getHeadingClasses } = createComposable();
			const column = { columnClasses: "min-w-0" };

			expect(getHeadingClasses(column)).toContain("min-w-0");
			expect(getHeadingClasses(column)).not.toContain("min-w-32");
			expect(getCellClasses(column)).toContain("min-w-0");
			expect(getCellClasses(column)).not.toContain("min-w-32");
		});

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
 * unset by default so column visibility is not stored.
 *
 * @param  {object}  options
 *     Test inputs.
 * @param  {object}  options.columns
 *     The user's column configuration.
 * @param  {string|Ref<string>}  options.name
 *     The table name used to identify stored column visibility.
 * @param  {string}  options.headingClasses
 *     The table-level heading classes.
 * @param  {string}  options.cellClasses
 *     The table-level cell classes.
 * @param  {boolean}  options.haveActionsSlot
 *     Whether the table has an actions slot.
 */
function createComposable({
	columns = {},
	name,
	headingClasses = "",
	cellClasses = "",
	haveActionsSlot = false,
} = {}) {
	const columnsRef = ref(columns);
	const nameRef = ref(name);
	const headingClassesRef = ref(headingClasses);
	const cellClassesRef = ref(cellClasses);
	const haveActionsSlotRef = ref(haveActionsSlot);

	return {
		columns: columnsRef,
		name: nameRef,
		...useTableColumns({
			columns: columnsRef,
			name,
			headingClasses: headingClassesRef,
			cellClasses: cellClassesRef,
			haveActionsSlot: haveActionsSlotRef,
		}),
	};
}
