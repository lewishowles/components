import { expect, test } from "@playwright/experimental-ct-vue";
import { createMount } from "#test/ct/support/mount.js";

import DataTable from "./data-table.vue";
import DataTableDensityFixture from "./data-table-density.fixture.vue";
import DataTableFooter from "./fragments/data-table-footer/data-table-footer.vue";
import DataTableHeader from "./fragments/data-table-header/data-table-header.vue";
import DataTableSearchCallbackFixture from "./data-table-search-callback.fixture.vue";
import DataTableSearchableContentFixture from "./data-table-searchable-content.fixture.vue";
import DataTableShowingItemsFixture from "./data-table-showing-items.fixture.vue";
import DataTableSortableContentFixture from "./data-table-sortable-content.fixture.vue";
import DataTableStatus, { statusTypes } from "./fragments/data-table-status/data-table-status.vue";
import DataTableToolbarFixture from "./data-table-toolbar.fixture.vue";

const columns = {
	title: { label: "Title", primary: true },
	release_year: { label: "Release year" },
	box_office: { label: "Box office ($m)" },
};

const data = [
	{
		id: "2e644b4b-51e8-4519-ab31-d9a37e2d0434",
		title: "Toy Story",
		release_year: "1995",
		box_office: "373.6",
	},
	{
		id: "da9eff2a-c10e-42a3-ab3f-9f252c574384",
		title: "Aladdin",
		release_year: "1992",
		box_office: "1,054.0",
	},
	{
		id: "3ffd9ae1-ef4f-4f6e-b408-a2c5b58a3305",
		title: "The Lion King",
		release_year: "1994",
		box_office: "968.5",
	},
	{
		id: "5c247b4a-a64d-46aa-94aa-7794fe9b7b59",
		title: "The Emperor's New Groove",
		release_year: "2000",
		box_office: "169.3",
	},
	{
		id: "6b2d8c0d-76b2-40dd-adf9-5800a0526c0f",
		title: "Up",
		release_year: "2009",
		box_office: "735.1",
	},
];

const extendedData = [
	...data,
	{
		id: "2594b1c7-865f-4e1c-8056-1da172e6e291",
		title: "Finding Nemo",
		release_year: "2003",
		box_office: "940.3",
	},
	{
		id: "c92adb1c-2911-4af2-8262-63edb6e69b0c",
		title: "Monsters, Inc.",
		release_year: "2001",
		box_office: "577.4",
	},
	{
		id: "93e011fd-6d0b-490f-82b9-47a51aa0b039",
		title: "Ratatouille",
		release_year: "2007",
		box_office: "620.7",
	},
	{
		id: "cad1137a-0174-444c-b2da-d97f0f884d63",
		title: "WALL-E",
		release_year: "2008",
		box_office: "521.3",
	},
	{
		id: "018c2baa-efb5-4f8b-a5e2-0f10a6eff30f",
		title: "Brave",
		release_year: "2012",
		box_office: "540.4",
	},
	{
		id: "63b48efa-b91e-4b5d-a92c-a629383993c4",
		title: "Inside Out",
		release_year: "2015",
		box_office: "857.6",
	},
	{
		id: "5a25addd-3e0a-4974-a3e6-4edb8d7e632e",
		title: "Coco",
		release_year: "2017",
		box_office: "807.1",
	},
	{
		id: "e7853c36-6dac-40f6-9aff-b500c7daa17d",
		title: "Frozen",
		release_year: "2013",
		box_office: "1,290.0",
	},
	{
		id: "51ae5c91-3e71-4aff-8c75-9bf3bedea21b",
		title: "Moana",
		release_year: "2016",
		box_office: "643.3",
	},
	{
		id: "b374343a-97cd-413e-af8e-b6601a165671",
		title: "Zootopia",
		release_year: "2016",
		box_office: "1,023.8",
	},
];

// Mount data-table with sensible defaults for testing.
const mountDataTable = createMount(DataTable, { props: { data, columns } });

// Mount data-table without merged defaults, for tests that need a clean column order.
const mountDataTableRaw = createMount(DataTable);

const mountDataTableDensity = createMount(DataTableDensityFixture);

const mountDataTableFooter = createMount(DataTableFooter, {
	props: { totalCount: 25, haveDataToDisplay: true },
});

const mountDataTableHeader = createMount(DataTableHeader);
const mountDataTableStatus = createMount(DataTableStatus);
const mountDataTableToolbar = createMount(DataTableToolbarFixture);

test.describe("data-table", () => {
	test("a component is rendered", async ({ mount, page }) => {
		await mountDataTable(mount);

		await expect(page.getByTestId("data-table")).toBeVisible();
	});

	test.describe("rendering", () => {
		test("a message is displayed if no data is available", async ({ mount, page }) => {
			await mountDataTable(mount, { props: { data: [] } });

			await expect(page.getByTestId("data-table-no-data")).toBeVisible();
			await expect(page.getByTestId("data-table-no-results")).not.toBeAttached();
		});

		test("the appropriate table is rendered when provided with data", async ({ mount, page }) => {
			await mountDataTable(mount);

			await expect(page.getByTestId("data-table-table")).toBeVisible();
			await expect(page.getByTestId("data-table-heading")).toHaveCount(3);
			await expect(page.getByTestId("data-table-row")).toHaveCount(5);
			await expect(page.getByTestId("data-table-cell")).toHaveCount(15);
		});

		test("a primary column can be defined", async ({ mount, page }) => {
			await mountDataTable(mount);

			await expect(cell(page, 0)).toHaveClass(/font-semibold/);
		});

		test("column headings have scope='col'", async ({ mount, page }) => {
			await mountDataTable(mount);

			const headings = page.getByTestId("data-table-heading");
			const count = await headings.count();

			for (let i = 0; i < count; i++) {
				await expect(headings.nth(i)).toHaveAttribute("scope", "col");
			}
		});

		test("primary column cells render as th elements with scope='row'", async ({ mount, page }) => {
			await mountDataTable(mount);

			expect(await cell(page, 0).evaluate((el) => el.tagName)).toBe("TH");
			await expect(cell(page, 0)).toHaveAttribute("scope", "row");
			expect(await cell(page, 1).evaluate((el) => el.tagName)).toBe("TD");
		});

		test("a label can be provided to the search input", async ({ mount, page }) => {
			const label = "Find a character";

			await mountDataTable(mount, { slots: { "search-label": label } });

			await expect(
				page.getByTestId("data-table-search-input").getByTestId("form-label"),
			).toHaveText(label);
		});

		test("a placeholder can be provided to the search input", async ({ mount, page }) => {
			const placeholder = "Enter a character name or movie to begin";

			await mountDataTable(mount, { props: { searchPlaceholder: placeholder } });

			await expect(searchInput(page)).toHaveAttribute("placeholder", placeholder);
		});
	});

	test.describe("column configuration", () => {
		test("columns can be given labels", async ({ mount, page }) => {
			await mountDataTable(mount, {
				props: {
					columns: {
						title: { label: "Title" },
						release_year: { label: "Release year" },
						box_office: { label: "Box office ($m)" },
					},
				},
			});

			await expect(heading(page, 0)).toContainText("Title");
			await expect(heading(page, 1)).toContainText("Release year");
			await expect(heading(page, 2)).toContainText("Box office ($m)");
		});

		test("columns can be hidden via configuration", async ({ mount, page }) => {
			await mountDataTable(mount, {
				props: { columns: { ...columns, release_year: { hidden: true } } },
			});

			await expect(page.getByTestId("data-table-heading")).toHaveCount(2);
			await expect(page.getByTestId("data-table-row")).toHaveCount(5);
			await expect(page.getByTestId("data-table-cell")).toHaveCount(10);
		});

		test("classes can be applied to a column's heading", async ({ mount, page }) => {
			await mountDataTable(mount, {
				props: {
					columns: {
						...columns,
						box_office: { label: "Box office", sortable: false, headingClasses: "text-right" },
					},
				},
			});

			await expect(heading(page, 2)).toHaveClass(/text-right/);
			await expect(cell(page, 2)).not.toHaveClass(/text-right/);
		});

		test("classes can be applied to a column's cells", async ({ mount, page }) => {
			await mountDataTable(mount, {
				props: {
					columns: { ...columns, box_office: { label: "Box office", cellClasses: "text-right" } },
				},
			});

			await expect(heading(page, 2)).not.toHaveClass(/text-right/);
			await expect(cell(page, 2)).toHaveClass(/text-right/);
		});

		test("classes can be applied to both headings and cells in a column", async ({
			mount,
			page,
		}) => {
			await mountDataTable(mount, {
				props: {
					columns: {
						...columns,
						box_office: { label: "Box office", sortable: false, columnClasses: "text-right" },
					},
				},
			});

			await expect(heading(page, 2)).toHaveClass(/text-right/);
			await expect(cell(page, 2)).toHaveClass(/text-right/);
		});

		test("classes can be defined for a column in multiple ways and combined", async ({
			mount,
			page,
		}) => {
			await mountDataTable(mount, {
				props: {
					columns: {
						...columns,
						box_office: {
							label: "Box office",
							sortable: false,
							columnClasses: "text-right",
							headingClasses: "text-purple-800",
							cellClasses: "text-purple-600",
						},
					},
				},
			});

			await expect(heading(page, 2)).toHaveClass(/text-right/);
			await expect(heading(page, 2)).toHaveClass(/text-purple-800/);
			await expect(heading(page, 2)).not.toHaveClass(/text-purple-600/);

			await expect(cell(page, 2)).toHaveClass(/text-right/);
			await expect(cell(page, 2)).toHaveClass(/text-purple-600/);
			await expect(cell(page, 2)).not.toHaveClass(/text-purple-800/);
		});

		test("a tabularNums column applies tabular-nums to its cells", async ({ mount, page }) => {
			await mountDataTable(mount, {
				props: {
					columns: { ...columns, box_office: { label: "Box office ($m)", tabularNums: true } },
				},
			});

			await expect(cell(page, 2)).toHaveClass(/tabular-nums/);
			await expect(cell(page, 0)).not.toHaveClass(/tabular-nums/);
		});

		test("column order is determined by configuration", async ({ mount, page }) => {
			await mountDataTableRaw(mount, {
				props: {
					data,
					columns: {
						box_office: { label: "Box office ($m)" },
						title: { label: "Title" },
						release_year: { label: "Release year" },
					},
				},
			});

			await expect(heading(page, 0)).toContainText("Box office ($m)");
			await expect(heading(page, 1)).toContainText("Title");
			await expect(heading(page, 2)).toContainText("Release year");
		});
	});

	test.describe("search", () => {
		test("no rows are filtered by default", async ({ mount, page }) => {
			await mountDataTable(mount);

			await expect(page.getByTestId("data-table-row")).toHaveCount(5);
		});

		test("a search should show matching rows", async ({ mount, page }) => {
			await mountDataTable(mount);

			await searchInput(page).fill("Aladdin");

			await expect(page.getByTestId("data-table-row")).toHaveCount(1);
		});

		test("a search with no results should show the no results message", async ({ mount, page }) => {
			await mountDataTable(mount);

			await searchInput(page).fill("Not found");

			await expect(page.getByTestId("data-table-no-results")).toBeVisible();
		});

		test("a column can be excluded from the search", async ({ mount, page }) => {
			await mountDataTable(mount, {
				props: { columns: { ...columns, release_year: { searchable: false } } },
			});

			await searchInput(page).fill("1994");

			await expect(page.getByTestId("data-table-no-results")).toBeVisible();
		});

		test("a column can define custom searchable content", async ({ mount, page }) => {
			await mount(DataTableSearchableContentFixture);

			await searchInput(page).fill("buzz");

			await expect(page.getByTestId("data-table-row")).toHaveCount(1);
			await expect(cell(page, 0)).toHaveText("Toy Story");
		});

		test("a column can define a custom search callback", async ({ mount, page }) => {
			await mount(DataTableSearchCallbackFixture);

			await searchInput(page).fill("AB23456");

			await expect(page.getByTestId("data-table-row")).toHaveCount(1);
			await expect(cell(page, 0)).toHaveText("AB23 456");
		});

		test("a search can be reset", async ({ mount, page }) => {
			await mountDataTable(mount);

			await expect(page.getByTestId("data-table-row")).toHaveCount(5);
			await expect(page.getByTestId("data-table-search-reset-button")).not.toBeVisible();

			await searchInput(page).fill("Aladdin");

			await expect(page.getByTestId("data-table-row")).toHaveCount(1);
			await expect(page.getByTestId("data-table-search-reset-button")).toBeVisible();

			await page.getByTestId("data-table-search-reset-button").click();

			await expect(page.getByTestId("data-table-row")).toHaveCount(5);
			await expect(page.getByTestId("data-table-search-reset-button")).not.toBeVisible();
			await expect(searchInput(page)).toBeFocused();
		});

		test("the status region announces the result count when a search matches rows", async ({
			mount,
			page,
		}) => {
			await mountDataTable(mount);

			await searchInput(page).fill("Aladdin");

			await expect(page.getByTestId("data-table-status")).toHaveText(
				'Showing 1 result for "Aladdin"',
			);
		});

		test("the status region announces when no results are found", async ({ mount, page }) => {
			await mountDataTable(mount);

			await searchInput(page).fill("Not found");

			await expect(page.getByTestId("data-table-status")).toHaveText('No results for "Not found"');
		});
	});

	test.describe("sort", () => {
		test("a table can be sorted", async ({ mount, page }) => {
			await mountDataTable(mount);

			await expect(rowCell(page, 0, 0)).toHaveText("Toy Story");
			await expect(rowCell(page, 1, 0)).toHaveText("Aladdin");

			await sortByColumn(page, "Title");

			await expect(rowCell(page, 0, 0)).toHaveText("Aladdin");
			await expect(rowCell(page, 1, 0)).toHaveText("The Emperor's New Groove");
		});

		test("the appropriate aria-sort is added to the sorted column", async ({ mount, page }) => {
			await mountDataTable(mount);

			await expect(heading(page, 0)).not.toHaveAttribute("aria-sort");

			await sortByColumn(page, "Title");

			await expect(heading(page, 0)).toHaveAttribute("aria-sort", "ascending");

			await sortByColumn(page, "Title");

			await expect(heading(page, 0)).toHaveAttribute("aria-sort", "descending");
		});

		test("the status region announces the sort state", async ({ mount, page }) => {
			await mountDataTable(mount);

			await sortByColumn(page, "Title");

			await expect(page.getByTestId("data-table-status")).toHaveText("Sorted by Title ascending");

			await sortByColumn(page, "Title");

			await expect(page.getByTestId("data-table-status")).toHaveText("Sorted by Title descending");
		});

		test("a column can define custom sortable content", async ({ mount, page }) => {
			await mount(DataTableSortableContentFixture);

			await sortByColumn(page, "Title");

			await expect(rowCell(page, 0, 0)).toHaveText("Toy Story");
		});
	});

	test.describe("pagination", () => {
		test("tables are paginated by default", async ({ mount, page }) => {
			await mountDataTable(mount, { props: { data: extendedData } });

			await expect(page.getByTestId("data-table-pagination")).toBeVisible();
			await expect(page.getByTestId("data-table-row")).toHaveCount(10);

			await assertCurrentPage(page, 1);
		});

		test("pagination can be disabled", async ({ mount, page }) => {
			await mountDataTable(mount, { props: { data: extendedData, enablePagination: false } });

			await expect(page.getByTestId("data-table-pagination")).not.toBeAttached();
			await expect(page.getByTestId("data-table-row")).toHaveCount(15);
		});

		test("the user can choose which page of items to view", async ({ mount, page }) => {
			await mountDataTable(mount, { props: { data: extendedData } });

			await expect(page.getByTestId("data-table-row")).toHaveCount(10);
			await expect(cell(page, 0)).toHaveText("Toy Story");

			await selectPage(page, 2);

			await expect(page.getByTestId("data-table-row")).toHaveCount(5);
			await expect(cell(page, 0)).toHaveText("Inside Out");
		});

		test("the current page is reset when the sorted column is changed", async ({ mount, page }) => {
			await mountDataTable(mount, { props: { data: extendedData } });

			await selectPage(page, 2);
			await sortByColumn(page, "Title");

			await assertCurrentPage(page, 1);
		});

		test("the current page is reset when the sort direction is changed", async ({
			mount,
			page,
		}) => {
			await mountDataTable(mount, { props: { data: extendedData } });

			await selectPage(page, 2);
			await sortByColumn(page, "Title");
			await assertCurrentPage(page, 1);

			await selectPage(page, 2);
			await sortByColumn(page, "Title");
			await assertCurrentPage(page, 1);
		});

		test("the showing items indicator can be overridden", async ({ mount, page }) => {
			await mount(DataTableShowingItemsFixture);

			await expect(page.getByTestId("app-pagination-showing-items-label")).toHaveText(
				"1 to 10 of 15",
			);
		});
	});

	test.describe("user configuration", () => {
		test("user configuration cannot be selected if no name is present", async ({ mount, page }) => {
			await mountDataTable(mount);

			await expect(page.getByTestId("data-table-display-options")).not.toBeAttached();
			await expect(cell(page, 0)).toHaveClass(/py-4/);
		});

		test.describe("table density", () => {
			test("table density can be selected", async ({ mount, page }) => {
				await mountDataTable(mount, { props: { name: "table-name" } });

				await expect(cell(page, 0)).toHaveClass(/py-4/);

				await openUserConfiguration(page);

				await page.getByTestId("data-table-density-compact").click();

				await expect(cell(page, 0)).toHaveClass(/py-2/);
			});
		});

		test.describe("column visibility", () => {
			test.afterEach(async ({ page }) => {
				await page.evaluate(() => localStorage.removeItem("data-table:sample-table:columns"));
			});

			test("all columns are visible by default", async ({ mount, page }) => {
				await mountDataTable(mount, { props: { name: "table-name" } });

				await expect(page.getByTestId("data-table-heading")).toHaveCount(3);
				await expect(page.getByTestId("data-table-display-options")).toBeVisible();

				await openUserConfiguration(page);

				await expect(page.getByTestId("data-table-columns-checkbox")).toHaveCount(3);
				await expect(columnCheckbox(page, 0)).toBeChecked();
				await expect(columnCheckbox(page, 1)).toBeChecked();
				await expect(columnCheckbox(page, 2)).toBeChecked();

				await columnCheckbox(page, 0).click();

				await expect(columnCheckbox(page, 0)).not.toBeChecked();
				await expect(page.getByTestId("data-table-heading")).toHaveCount(2);
			});

			test("custom visibility is retrieved from localStorage", async ({ mount, page }) => {
				await page.evaluate(() => {
					localStorage.setItem(
						"data-table:sample-table:columns",
						'{"title":true,"release_year":false,"box_office":false}',
					);
				});

				await mountDataTable(mount, { props: { name: "sample-table" } });

				await expect(page.getByTestId("data-table-heading")).toHaveCount(1);

				await openUserConfiguration(page);

				await expect(columnCheckbox(page, 0)).toBeChecked();
				await expect(columnCheckbox(page, 1)).not.toBeChecked();
				await expect(columnCheckbox(page, 2)).not.toBeChecked();

				await columnCheckbox(page, 1).click();

				await expect(columnCheckbox(page, 1)).toBeChecked();
				await expect(page.getByTestId("data-table-heading")).toHaveCount(2);
			});
		});
	});

	test.describe("selection", () => {
		test("columns cannot be selected by default", async ({ mount, page }) => {
			await mountDataTable(mount);

			await expect(page.getByTestId("data-table-select-all-rows")).not.toBeAttached();
			await expect(page.getByTestId("data-table-select-row")).not.toBeAttached();
		});

		test("selection can be enabled", async ({ mount, page }) => {
			await mountDataTable(mount, { props: { enableSelection: true } });

			await expect(page.getByTestId("data-table-select-all-rows")).toBeVisible();
			await expect(page.getByTestId("data-table-select-row")).toHaveCount(5);

			const count = await page.getByTestId("data-table-select-row").count();

			for (let i = 0; i < count; i++) {
				await expect(rowCheckbox(page, i)).not.toBeChecked();
			}
		});

		test("a user can select all rows with one press", async ({ mount, page }) => {
			await mountDataTable(mount, { props: { enableSelection: true } });

			await selectAll(page).click();

			const count = await page.getByTestId("data-table-select-row").count();

			for (let i = 0; i < count; i++) {
				await expect(rowCheckbox(page, i)).toBeChecked();
			}
		});

		test("a user can deselect all rows with one press", async ({ mount, page }) => {
			await mountDataTable(mount, { props: { enableSelection: true } });

			await selectAll(page).click();
			await selectAll(page).click();

			const count = await page.getByTestId("data-table-select-row").count();

			for (let i = 0; i < count; i++) {
				await expect(rowCheckbox(page, i)).not.toBeChecked();
			}
		});

		test("unchecking a single checkbox is reflected in the select all rows checkbox", async ({
			mount,
			page,
		}) => {
			await mountDataTable(mount, { props: { enableSelection: true } });

			await selectAll(page).click();

			await expect(selectAll(page)).toBeChecked();

			await rowCheckbox(page, 0).click();

			await expect(selectAll(page)).not.toBeChecked();
		});

		test("checking all checkboxes manually is reflected in the select all rows checkbox", async ({
			mount,
			page,
		}) => {
			await mountDataTable(mount, { props: { enableSelection: true } });

			await expect(selectAll(page)).not.toBeChecked();

			const count = await page.getByTestId("data-table-select-row").count();

			for (let i = 0; i < count; i++) {
				await rowCheckbox(page, i).click();
			}

			await expect(selectAll(page)).toBeChecked();
		});

		test("the select-all checkbox shows indeterminate state when some rows are selected", async ({
			mount,
			page,
		}) => {
			await mountDataTable(mount, { props: { enableSelection: true } });

			await rowCheckbox(page, 0).click();

			const isIndeterminate = await selectAll(page).evaluate((el) => el.indeterminate);

			expect(isIndeterminate).toBe(true);
		});

		test("the select-all checkbox is not indeterminate when no rows are selected", async ({
			mount,
			page,
		}) => {
			await mountDataTable(mount, { props: { enableSelection: true } });

			const isIndeterminate = await selectAll(page).evaluate((el) => el.indeterminate);

			expect(isIndeterminate).toBe(false);
		});

		test("the select-all checkbox is not indeterminate when all rows are selected", async ({
			mount,
			page,
		}) => {
			await mountDataTable(mount, { props: { enableSelection: true } });

			await selectAll(page).click();

			const isIndeterminate = await selectAll(page).evaluate((el) => el.indeterminate);

			expect(isIndeterminate).toBe(false);
		});

		test("each row checkbox has a distinct accessible label", async ({ mount, page }) => {
			await mountDataTable(mount, { props: { enableSelection: true } });

			for (let i = 0; i < 5; i++) {
				await expect(
					page.getByTestId("data-table-select-row").nth(i).getByTestId("form-label"),
				).toHaveText(`Select row ${i + 1}`);
			}
		});

		test("the status region announces partial row selection", async ({ mount, page }) => {
			await mountDataTable(mount, { props: { enableSelection: true } });

			await rowCheckbox(page, 0).click();

			await expect(page.getByTestId("data-table-status")).toHaveText("1 of 5 rows selected");
		});

		test("the status region announces when all rows are selected", async ({ mount, page }) => {
			await mountDataTable(mount, { props: { enableSelection: true } });

			await selectAll(page).click();

			await expect(page.getByTestId("data-table-status")).toHaveText("All 5 rows selected");
		});

		test("the status region announces when all rows are deselected", async ({ mount, page }) => {
			await mountDataTable(mount, { props: { enableSelection: true } });

			await selectAll(page).click();
			await selectAll(page).click();

			await expect(page.getByTestId("data-table-status")).toHaveText("All rows deselected");
		});
	});

	test.describe("styling hooks", () => {
		test("data-component is set on the root element", async ({ mount, page }) => {
			await mountDataTable(mount);

			await expect(page.getByTestId("data-table")).toHaveAttribute("data-component", "data-table");
		});
	});
});

test.describe("data-table fragments", () => {
	test.describe("data-table-density", () => {
		test.afterEach(async ({ page }) => {
			await page.evaluate(() => localStorage.removeItem("data-table:sample-table:density"));
		});

		test("a custom density is retrieved from localStorage", async ({ mount, page }) => {
			await page.evaluate(() => localStorage.setItem("data-table:sample-table:density", "compact"));

			await mountDataTableDensity(mount);

			await expect(page.getByTestId("data-table-density-compact")).toHaveClass(/text-primary/);
		});

		test("a change in chosen density is stored in localStorage", async ({ mount, page }) => {
			await mountDataTableDensity(mount);

			await page.getByTestId("data-table-density-compact").click();

			await expect(page.getByTestId("data-table-density-compact")).toHaveClass(/text-primary/);

			const stored = await page.evaluate(() =>
				localStorage.getItem("data-table:sample-table:density"),
			);

			expect(stored).toBe("compact");
		});
	});

	test.describe("data-table-footer", () => {
		test("shows the selected row count when selection is enabled", async ({ mount, page }) => {
			await mountDataTableFooter(mount, { props: { enableSelection: true, selectedCount: 4 } });

			await expect(page.getByTestId("data-table-footer-selection")).toHaveText("4 rows selected");
		});

		test("allows the no-results message to be customised", async ({ mount, page }) => {
			await mountDataTableFooter(mount, {
				props: { haveDataToDisplay: false },
				slots: { "no-results-message": "Nothing here" },
			});

			await expect(page.getByTestId("data-table-no-results")).toHaveText("Nothing here");
		});
	});

	test.describe("data-table-header", () => {
		test("renders nothing when no slots are provided", async ({ mount, page }) => {
			await mountDataTableHeader(mount);

			await expect(page.getByTestId("data-table-header")).not.toBeAttached();
		});

		test("renders a title at the default heading level", async ({ mount, page }) => {
			await mountDataTableHeader(mount, { slots: { "table-title": "Movies" } });

			await expect(page.getByTestId("data-table-header")).toBeVisible();
			await expect(page.locator("h2")).toHaveText("Movies");
		});

		test("renders a title at a custom heading level", async ({ mount, page }) => {
			await mountDataTableHeader(mount, {
				props: { headingLevel: "h3" },
				slots: { "table-title": "Movies" },
			});

			await expect(page.locator("h3")).toHaveText("Movies");
		});

		test("renders an introduction", async ({ mount, page }) => {
			await mountDataTableHeader(mount, { slots: { "table-introduction": "About the data" } });

			await expect(page.getByTestId("data-table-header")).toHaveText("About the data");
		});
	});

	test.describe("data-table-status", () => {
		test("allows the sort announcement to be customised", async ({ mount, page }) => {
			await mountDataTableStatus(mount, {
				props: { type: statusTypes.SORT, sortColumn: "Title", ascending: true },
				slots: { "sort-status": "Custom sort message" },
			});

			await expect(page.getByTestId("data-table-status")).toHaveText("Custom sort message");
		});
	});

	test.describe("data-table-toolbar", () => {
		test("hides the search input when search is disabled", async ({ mount, page }) => {
			await mountDataTableToolbar(mount, { props: { enableSearch: false } });

			await expect(page.getByTestId("data-table-search")).not.toBeAttached();
		});

		test("allows the configure label to be customised", async ({ mount, page }) => {
			await mountDataTableToolbar(mount, { slots: { "configure-label": "Options" } });

			await expect(page.getByTestId("data-table-display-options").locator("summary")).toHaveText(
				"Options",
			);
		});
	});
});

// --- Locator helpers ---

/**
 * The nth column heading element.
 *
 * @param  {object}  page
 * @param  {number}  n
 */
function heading(page, n) {
	return page.getByTestId("data-table-heading").nth(n);
}

/**
 * The nth cell in the flat cell list (across all rows).
 *
 * @param  {object}  page
 * @param  {number}  n
 */
function cell(page, n) {
	return page.getByTestId("data-table-cell").nth(n);
}

/**
 * A specific cell by row and column index.
 *
 * @param  {object}  page
 * @param  {number}  row
 * @param  {number}  col
 */
function rowCell(page, row, col) {
	return page.getByTestId("data-table-row").nth(row).getByTestId("data-table-cell").nth(col);
}

/**
 * The search input element.
 *
 * @param  {object}  page
 */
function searchInput(page) {
	return page.getByTestId("data-table-search-input").locator("input");
}

/**
 * The select-all checkbox input.
 *
 * @param  {object}  page
 */
function selectAll(page) {
	return page.getByTestId("data-table-select-all-rows").locator("input");
}

/**
 * The checkbox input for the nth data row.
 *
 * @param  {object}  page
 * @param  {number}  n
 */
function rowCheckbox(page, n) {
	return page.getByTestId("data-table-select-row").nth(n).locator("input");
}

/**
 * The checkbox input for the nth column visibility toggle.
 *
 * @param  {object}  page
 * @param  {number}  n
 */
function columnCheckbox(page, n) {
	return page.getByTestId("data-table-columns-checkbox").nth(n).locator("input");
}

// --- Interaction helpers ---

/**
 * Sort the table by the column with the given title.
 *
 * @param  {object}  page
 *     The Playwright page object.
 * @param  {string}  columnTitle
 *     The title of the column to sort by.
 */
async function sortByColumn(page, columnTitle) {
	await page.getByTestId("data-table-sort").filter({ hasText: columnTitle }).click();
}

/**
 * Select the given page of results, then verify it becomes the current page.
 *
 * @param  {object}  page
 *     The Playwright page object.
 * @param  {number}  pageNum
 *     The page to select.
 */
async function selectPage(page, pageNum) {
	await page
		.getByTestId("app-pagination-page-button")
		.nth(pageNum - 1)
		.click();

	await assertCurrentPage(page, pageNum);
}

/**
 * Verify that the given page number is the currently active page.
 *
 * @param  {object}  page
 *     The Playwright page object.
 * @param  {number}  pageNum
 *     The page number to assert.
 */
async function assertCurrentPage(page, pageNum) {
	await expect(
		page.locator('[data-test="app-pagination-page"] [aria-current="page"]'),
	).toContainText(String(pageNum));
}

/**
 * Open the user configuration panel within the data table.
 *
 * @param  {object}  page
 *     The Playwright page object.
 */
async function openUserConfiguration(page) {
	await expect(page.getByTestId("data-table-display-options")).toBeVisible();
	await page.getByTestId("data-table-display-options").locator("summary").click();
	await expect(
		page.getByTestId("data-table-display-options").locator("[data-part=content]"),
	).toBeVisible();
}
