import DataTable from "./data-table.vue";
import { createMount } from "@cypress/support/mount";
import { nanoid } from "nanoid";

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

const defaultProps = { data, columns };
const mount = createMount(DataTable, { props: defaultProps });

describe("data-table", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("data-table").shouldBeVisible();
	});

	describe("Rendering", () => {
		it("A message is displayed if no data is available", () => {
			mount({ data: [] });

			cy.getByData("data-table-no-data").shouldBeVisible();
			cy.getByData("data-table-no-results").should("not.exist");
		});

		it("The appropriate table is rendered when provided with data", () => {
			mount();

			cy.getByData("data-table-table").shouldBeVisible();
			cy.getByData("data-table-heading").shouldHaveCount(3);
			cy.getByData("data-table-row").shouldHaveCount(5);
			cy.getByData("data-table-cell").shouldHaveCount(15);
		});

		it("A primary column can be defined", () => {
			mount();

			cy.getByData("data-table-cell").eq(0).shouldHaveClass("font-semibold");
		});

		it("A label can be provided to the search input", () => {
			const label = "Find a character";

			mount({ slots: { "search-label": label } });

			cy.getByData("data-table-search-input").getByData("form-label").shouldHaveText(label);
		});

		it("A placeholder can be provided to the search input", () => {
			const placeholder = "Enter a character name or movie to begin";

			mount({ searchPlaceholder: placeholder });

			cy.getFormField("data-table-search-input").shouldHaveAttribute("placeholder", placeholder);
		});

		it("A label can be provided for the reset search button", () => {
			const label = "Reset search and try again";

			mount({ slots: { "search-label": label } });

			cy.getByData("data-table-search-input").getByData("form-label").shouldHaveText(label);
		});
	});

	describe("Column configuration", () => {
		it("Columns can be given labels", () => {
			mount({
				columns: {
					title: { label: "Title" },
					release_year: { label: "Release year" },
					box_office: { label: "Box office ($m)" },
				},
			});

			cy.getByData("data-table-heading").eq(0).shouldHaveText("Title");
			cy.getByData("data-table-heading").eq(1).shouldHaveText("Release year");
			cy.getByData("data-table-heading").eq(2).shouldHaveText("Box office ($m)");
		});

		it("Columns can be hidden via configuration", () => {
			mount({
				columns: {
					...columns,
					release_year: { hidden: true },
				},
			});

			cy.getByData("data-table-heading").shouldHaveCount(2);
			cy.getByData("data-table-row").shouldHaveCount(5);
			cy.getByData("data-table-cell").shouldHaveCount(10);
		});

		it("Classes can be applied to a column's heading", () => {
			mount({
				columns: {
					...columns,
					box_office: { label: "Box office", headingClasses: "text-right" },
				},
			});

			cy.getByData("data-table-heading").eq(2).shouldHaveClass("text-right");
			cy.getByData("data-table-cell").eq(2).shouldNotHaveClass("text-right");
		});

		it("Classes can be applied to a column's heading", () => {
			mount({
				columns: {
					...columns,
					box_office: { label: "Box office", cellClasses: "text-right" },
				},
			});

			cy.getByData("data-table-heading").eq(2).shouldNotHaveClass("text-right");
			cy.getByData("data-table-cell").eq(2).shouldHaveClass("text-right");
		});

		it("Classes can be applied to both headings and cells in a column", () => {
			mount({
				columns: {
					...columns,
					box_office: { label: "Box office", columnClasses: "text-right" },
				},
			});

			cy.getByData("data-table-heading").eq(2).shouldHaveClass("text-right");
			cy.getByData("data-table-cell").eq(2).shouldHaveClass("text-right");
		});

		it("Classes can be defined for a column in multiple ways and combined", () => {
			mount({
				columns: {
					...columns,
					box_office: {
						label: "Box office",
						columnClasses: "text-right",
						headingClasses: "text-purple-800",
						cellClasses: "text-purple-600",
					},
				},
			});

			cy.getByData("data-table-heading").eq(2)
				.shouldHaveClass("text-right")
				.shouldHaveClass("text-purple-800")
				.shouldNotHaveClass("text-purple-600");

			cy.getByData("data-table-cell").eq(2)
				.shouldHaveClass("text-right")
				.shouldHaveClass("text-purple-600")
				.shouldNotHaveClass("text-purple-800");
		});

		it("Column order is determined by configuration", () => {
			// We create a fresh mount here because options are deep merged, and
			// we're not _changing_ the options, we're simply re-arranging them,
			// which deepMerge will discard.
			const freshMount = createMount(DataTable);

			freshMount({
				data,
				columns: {
					box_office: { label: "Box office ($m)" },
					title: { label: "Title" },
					release_year: { label: "Release year" },
				},
			});

			cy.getByData("data-table-heading").eq(0).shouldHaveText("Box office ($m)");
			cy.getByData("data-table-heading").eq(1).shouldHaveText("Title");
			cy.getByData("data-table-heading").eq(2).shouldHaveText("Release year");
		});
	});

	describe("Search", () => {
		it("No rows are filtered by default", () => {
			mount();

			cy.getByData("data-table-row").shouldHaveCount(5);
		});

		it("A search should show matching rows", () => {
			mount();

			cy.getByData("data-table-search-input").type("Aladdin");

			cy.getByData("data-table-row").shouldHaveCount(1);
		});

		it("A search with no results should show the no results message", () => {
			mount();

			cy.getByData("data-table-search-input").type("Not found");

			cy.getByData("data-table-no-results").shouldBeVisible();
		});

		it("A column can be excluded from the search", () => {
			mount({
				columns: {
					...columns,
					release_year: { searchable: false },
				},
			});

			cy.getByData("data-table-search-input").type("1994");

			cy.getByData("data-table-no-results").shouldBeVisible();
		});

		it("A search can be reset", () => {
			mount();

			cy.getByData("data-table-row").shouldHaveCount(5);
			cy.getByData("data-table-search-reset-button").shouldNotBeVisible();

			cy.getByData("data-table-search-input").type("Aladdin");

			cy.getByData("data-table-row").shouldHaveCount(1);
			cy.getByData("data-table-search-reset-button").shouldBeVisible();

			cy.getByData("data-table-search-reset-button").click();

			cy.getByData("data-table-row").shouldHaveCount(5);
			cy.getByData("data-table-search-reset-button").shouldNotBeVisible();

			cy.getFormField("data-table-search-input").shouldHaveFocus();
		});
	});

	describe("Sort", () => {
		it("A table can be sorted", () => {
			mount();

			cy.getByData("data-table-row").eq(0).getByData("data-table-cell").eq(0).shouldHaveText("Toy Story");
			cy.getByData("data-table-row").eq(1).getByData("data-table-cell").eq(0).shouldHaveText("Aladdin");

			sortByColumn("Title");

			cy.getByData("data-table-row").eq(0).getByData("data-table-cell").eq(0).shouldHaveText("Aladdin");
			cy.getByData("data-table-row").eq(1).getByData("data-table-cell").eq(0).shouldHaveText("The Emperor's New Groove");
		});

		it("The appropriate aria-sort is added to the sorted column", () => {
			mount();

			cy.getByData("data-table-heading").eq(0).shouldNotHaveAttribute("aria-sort");

			sortByColumn("Title");

			cy.getByData("data-table-heading").eq(0).shouldHaveAttribute("aria-sort", "ascending");

			sortByColumn("Title");

			cy.getByData("data-table-heading").eq(0).shouldHaveAttribute("aria-sort", "descending");
		});
	});

	describe.only("Pagination", () => {
		it("Tables are paginated by default", () => {
			mount({ data: extendedData });

			cy.getByData("data-table-pagination").shouldBeVisible();
			cy.getByData("data-table-row").shouldHaveCount(10);

			assertCurrentPage(1);
		});

		it("Pagination can be disabled", () => {
			mount({ data: extendedData, enablePagination: false });

			cy.getByData("data-table-pagination").should("not.exist");
			cy.getByData("data-table-row").shouldHaveCount(15);
		});

		it("The user can choose which page of items to view", () => {
			mount({ data: extendedData });

			cy.getByData("data-table-pagination").shouldBeVisible();
			cy.getByData("data-table-row").shouldHaveCount(10);

			cy.getByData("data-table-cell").eq(0).shouldHaveText("Toy Story");

			selectPage(2);

			cy.getByData("data-table-row").shouldHaveCount(5);

			cy.getByData("data-table-cell").eq(0).shouldHaveText("Inside Out");
		});

		it("The current page is reset when the sorted column is changed", () => {
			mount({ data: extendedData });

			cy.getByData("data-table-pagination").shouldBeVisible();
			cy.getByData("data-table-row").shouldHaveCount(10);

			cy.getByData("data-table-cell").eq(0).shouldHaveText("Toy Story");

			selectPage(2);

			sortByColumn("Title");

			assertCurrentPage(1);
		});

		it("The current page is reset when the sort direction is changed", () => {
			mount({ data: extendedData });

			cy.getByData("data-table-pagination").shouldBeVisible();
			cy.getByData("data-table-row").shouldHaveCount(10);

			cy.getByData("data-table-cell").eq(0).shouldHaveText("Toy Story");

			selectPage(2);

			sortByColumn("Title");

			assertCurrentPage(1);

			selectPage(2);

			sortByColumn("Title");

			assertCurrentPage(1);
		});
	});

	describe("User configuration", () => {
		it("User configuration cannot be selected if no name is present", () => {
			mount();

			cy.getByData("data-table-display-options").should("not.exist");

			cy.getByData("data-table-cell").eq(0).shouldHaveClass("py-4");
		});

		describe("Table density", () => {
			it("Table density can be selected", () => {
				mount({ name: nanoid() });

				cy.getByData("data-table-cell").eq(0).shouldHaveClass("py-4");

				openUserConfiguration();

				cy.getByData("data-table-density-compact").click();

				cy.getByData("data-table-cell").eq(0).shouldHaveClass("py-2");
			});
		});

		describe("Column visibility", () => {
			it("All columns are visible by default", () => {
				mount({ name: nanoid() });

				cy.getByData("data-table-heading").shouldHaveCount(3);

				cy.getByData("data-table-display-options").shouldBeVisible();

				openUserConfiguration();

				cy.getByData("data-table-columns-checkbox").shouldHaveCount(3);

				cy.getByData("data-table-columns-checkbox").eq(0).getFormField().should("be.checked");
				cy.getByData("data-table-columns-checkbox").eq(1).getFormField().should("be.checked");
				cy.getByData("data-table-columns-checkbox").eq(2).getFormField().should("be.checked");

				cy.getByData("data-table-columns-checkbox").eq(0).getFormField().click();
				cy.getByData("data-table-columns-checkbox").eq(0).getFormField().should("not.be.checked");

				cy.getByData("data-table-heading").shouldHaveCount(2);
			});

			it("Custom visibility is retrieved from localStorage", () => {
				localStorage.setItem("data-table:sample-table:columns", "{\"title\":true,\"release_year\":false,\"box_office\":false}");

				mount({ name: "sample-table" });

				cy.getByData("data-table-heading").shouldHaveCount(1);

				cy.getByData("data-table-display-options").shouldBeVisible();

				openUserConfiguration();

				cy.getByData("data-table-columns-checkbox").shouldHaveCount(3);

				cy.getByData("data-table-columns-checkbox").eq(0).getFormField().should("be.checked");
				cy.getByData("data-table-columns-checkbox").eq(1).getFormField().should("not.be.checked");
				cy.getByData("data-table-columns-checkbox").eq(2).getFormField().should("not.be.checked");

				cy.getByData("data-table-columns-checkbox").eq(1).getFormField().click();
				cy.getByData("data-table-columns-checkbox").eq(1).getFormField().should("be.checked");

				cy.getByData("data-table-heading").shouldHaveCount(2);

				cy.getByData("data-table").then(() => {
					localStorage.removeItem("data-table:sample-table:columns");
				});
			});
		});
	});
});

/**
 * Sort the table by the column with the given title.
 *
 * @param  {string}  columnTitle
 *     The title of the column to sort by.
 */
function sortByColumn(columnTitle) {
	cy.getByData("data-table-sort").contains(columnTitle).click();
}

/**
 * Select the given page of results in the table, ensuring that the correct page
 * is then selected.
 *
 * @param  {number}  page
 *     The page to select.
 */
function selectPage(page) {
	cy.getByData("app-pagination-page-button").eq(page - 1).click();

	assertCurrentPage(page);
}

/**
 * Ensure that the given page is the selected page.
 *
 * @param  {number}  page
 *     The page to check.
 */
function assertCurrentPage(page) {
	cy.getByData("app-pagination-page").eq(page - 1).shouldHaveAttribute("aria-current", "page");
}

/**
 * Open the user configuration menu.
 */
function openUserConfiguration() {
	cy.getByData("data-table-display-options").shouldBeVisible();

	cy.getByData("data-table-display-options-summary").click();

	cy.getByData("data-table-display-options-content").shouldBeVisible();
}
