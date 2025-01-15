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
			cy.getByData("data-table-row").shouldHaveCount(3);
			cy.getByData("data-table-cell").shouldHaveCount(9);
		});

		it("A primary column can be defined", () => {
			mount();

			cy.getByData("data-table-cell").eq(0).shouldHaveClass("font-semibold");
		});

		it("A label can be provided to the search input", () => {
			const label = "Find a character";

			mount({ slots: { "search-label": label } });

			cy.getByData("data-table-search").getByData("form-label").shouldHaveText(label);
		});

		it("A placeholder can be provided to the search input", () => {
			const placeholder = "Enter a character name or movie to begin";

			mount({ searchPlaceholder: placeholder });

			cy.getFormField("data-table-search").shouldHaveAttribute("placeholder", placeholder);
		});

		it("A label can be provided for the reset search button", () => {
			const label = "Reset search and try again";

			mount({ slots: { "search-label": label } });

			cy.getByData("data-table-search").getByData("form-label").shouldHaveText(label);
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
			cy.getByData("data-table-row").shouldHaveCount(3);
			cy.getByData("data-table-cell").shouldHaveCount(6);
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

			cy.getByData("data-table-row").shouldHaveCount(3);
		});

		it("A search should show matching rows", () => {
			mount();

			cy.getByData("data-table-search").type("Aladdin");

			cy.getByData("data-table-row").shouldHaveCount(1);
		});

		it("A search with no results should show the no results message", () => {
			mount();

			cy.getByData("data-table-search").type("Not found");

			cy.getByData("data-table-no-results").shouldBeVisible();
		});

		it("A column can be excluded from the search", () => {
			mount({
				columns: {
					...columns,
					release_year: { searchable: false },
				},
			});

			cy.getByData("data-table-search").type("1994");

			cy.getByData("data-table-no-results").shouldBeVisible();
		});

		it("A search can be reset", () => {
			mount();

			cy.getByData("data-table-row").shouldHaveCount(3);
			cy.getByData("data-table-reset-search-button").shouldNotBeVisible();

			cy.getByData("data-table-search").type("Aladdin");

			cy.getByData("data-table-row").shouldHaveCount(1);
			cy.getByData("data-table-reset-search-button").shouldBeVisible();

			cy.getByData("data-table-reset-search-button").click();

			cy.getByData("data-table-row").shouldHaveCount(3);
			cy.getByData("data-table-reset-search-button").shouldNotBeVisible();

			cy.getFormField("data-table-search").shouldHaveFocus();
		});
	});

	describe("Sort", () => {
		it("A table can be sorted", () => {
			mount();

			cy.getByData("data-table-row").eq(0).getByData("data-table-cell").eq(0).shouldHaveText("Toy Story");
			cy.getByData("data-table-row").eq(1).getByData("data-table-cell").eq(0).shouldHaveText("Aladdin");

			cy.getByData("data-table-sort").eq(0).click();

			cy.getByData("data-table-row").eq(0).getByData("data-table-cell").eq(0).shouldHaveText("Aladdin");
			cy.getByData("data-table-row").eq(1).getByData("data-table-cell").eq(0).shouldHaveText("The Emperor's New Groove");
		});
	});

	describe("User configuration", () => {
		it("User configuration cannot be selected if no name is present", () => {
			mount();

			cy.getByData("data-table-display-options").should("not.exist");

			cy.getByData("data-table-cell").eq(0).shouldHaveClass("py-4");
		});

		it("Table density can be selected", () => {
			mount({ name: nanoid() });

			cy.getByData("data-table-display-options").shouldBeVisible();

			cy.getByData("data-table-cell").eq(0).shouldHaveClass("py-4");

			cy.getByData("data-table-display-options-summary").click();
			cy.getByData("data-table-density-compact").click();

			cy.getByData("data-table-cell").eq(0).shouldHaveClass("py-2");
		});
	});
});
