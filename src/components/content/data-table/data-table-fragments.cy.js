import DataTableColumns from "./fragments/data-table-columns/data-table-columns.vue";
import DataTableDensity from "./fragments/data-table-density/data-table-density.vue";
import DataTableFooter from "./fragments/data-table-footer/data-table-footer.vue";
import DataTableHeader from "./fragments/data-table-header/data-table-header.vue";
import DataTableSearch from "./fragments/data-table-search/data-table-search.vue";
import DataTableStatus, { statusTypes } from "./fragments/data-table-status/data-table-status.vue";
import DataTableToolbar from "./fragments/data-table-toolbar/data-table-toolbar.vue";
import { createMount } from "@cypress/support/mount";
import { ref } from "vue";

describe("data-table fragments", () => {
	describe("data-table-columns", () => {
		const columnDefinitions = ref({
			title: {
				label: "Title",
				first: true,
				last: false,
				sortable: true,
			},
			release_year: {
				label: "Release year",
				first: false,
				last: true,
				sortable: true,
			},
		});

		const modelValue = { title: true, release_year: true };
		const global = { provide: { "data-table": { columnDefinitions } } };
		const mount = createMount(DataTableColumns, { global, props: { modelValue } });

		it("A component is rendered", () => {
			mount();

			cy.getByData("data-table-columns").shouldBeVisible();
		});

		it("Columns are selected by default", () => {
			mount();

			cy.getByData("data-table-columns-checkbox").shouldHaveCount(2);
			cy.getByData("data-table-columns-checkbox").eq(0).getFormField().should("be.checked");
			cy.getByData("data-table-columns-checkbox").eq(1).getFormField().should("be.checked");
		});

		it("Custom visibility can be provided", () => {
			mount({ modelValue: { title: true, release_year: false } });

			cy.getByData("data-table-columns-checkbox").shouldHaveCount(2);
			cy.getByData("data-table-columns-checkbox").eq(0).getFormField().should("be.checked");
			cy.getByData("data-table-columns-checkbox").eq(1).getFormField().should("not.be.checked");
		});

		it("A column can be hidden", () => {
			mount();

			cy.getByData("data-table-columns-checkbox").eq(0).getFormField().click();

			cy.getByData("data-table-columns-checkbox").eq(0).getFormField().should("not.be.checked");
		});
	});

	describe("data-table-density", () => {
		const tableName = ref("sample-table");
		const haveTableName = ref(true);

		const global = {
			provide: { "data-table": { tableName, haveTableName, updateTableDensityOptions: () => {} } },
		};

		const mount = createMount(DataTableDensity, { global });

		afterEach(() => {
			// We remove any local storage for this table after each run to ensure
			// there are no conflicts between tests.
			localStorage.removeItem("data-table:sample-table:density");
		});

		it("A component is rendered", () => {
			mount();

			cy.getByData("data-table-density").shouldBeVisible();
		});

		it("A default density is selected", () => {
			mount();

			cy.getByData("data-table-density-relaxed").shouldHaveClass("text-primary");
		});

		it("A custom density is retrieved from localStorage", () => {
			localStorage.setItem("data-table:sample-table:density", "compact");

			mount();

			cy.getByData("data-table-density-compact").shouldHaveClass("text-primary");
		});

		it("A change in chosen density is stored in localStorage", () => {
			mount();

			cy.getByData("data-table-density-compact").click();
			cy.getByData("data-table-density-compact").shouldHaveClass("text-primary");

			cy.getByData("data-table-density").then(() => {
				expect(localStorage.getItem("data-table:sample-table:density")).to.equal("compact");
			});
		});
	});

	describe("data-table-footer", () => {
		const mount = createMount(DataTableFooter, {
			props: { totalCount: 25, haveDataToDisplay: true },
		});

		it("Shows pagination when there is data to display", () => {
			mount();

			cy.getByData("data-table-pagination").shouldBeVisible();
			cy.getByData("data-table-no-results").shouldNotBeVisible();
		});

		it("Shows the no-results message when there is no data to display", () => {
			mount({ props: { haveDataToDisplay: false, searchQuery: "zzz" } });

			cy.getByData("data-table-no-results").shouldBeVisible();
			cy.getByData("data-table-no-results").shouldHaveText('"zzz"');
			cy.getByData("data-table-pagination").shouldNotBeVisible();
		});

		it("Hides pagination when pagination is disabled", () => {
			mount({ props: { enablePagination: false } });

			cy.getByData("data-table-pagination").should("not.exist");
		});

		it("Shows the selected row count when selection is enabled", () => {
			mount({ props: { enableSelection: true, selectedCount: 4 } });

			cy.getByData("data-table-footer-selection").shouldHaveText("4 rows selected");
		});

		it("Allows the no-results message to be customised", () => {
			mount({
				props: { haveDataToDisplay: false },
				slots: { "no-results-message": "Nothing here" },
			});

			cy.getByData("data-table-no-results").shouldHaveText("Nothing here");
		});
	});

	describe("data-table-header", () => {
		const mount = createMount(DataTableHeader);

		it("Renders nothing when no slots are provided", () => {
			mount();

			cy.getByData("data-table-header").should("not.exist");
		});

		it("Renders a title at the default heading level", () => {
			mount({ slots: { "table-title": "Movies" } });

			cy.getByData("data-table-header").shouldBeVisible();
			cy.get("h2").shouldHaveText("Movies");
		});

		it("Renders a title at a custom heading level", () => {
			mount({ props: { headingLevel: "h3" }, slots: { "table-title": "Movies" } });

			cy.get("h3").shouldHaveText("Movies");
		});

		it("Renders an introduction", () => {
			mount({ slots: { "table-introduction": "About the data" } });

			cy.getByData("data-table-header").shouldHaveText("About the data");
		});
	});

	describe("data-table-search", () => {
		const global = {
			provide: { "data-table": { searchPlaceholder: "Search characters by name, movie, or year" } },
		};

		const mount = createMount(DataTableSearch, { global });

		it("A component is rendered", () => {
			mount();

			cy.getByData("data-table-search").shouldBeVisible();
		});

		it("A reset button should not be visible by default", () => {
			mount();

			cy.getByData("data-table-search-reset-button").shouldNotBeVisible();
		});

		it("A search can be reset", () => {
			mount();

			cy.getByData("data-table-search-reset-button").shouldNotBeVisible();

			cy.getFormField("data-table-search-input").type("Aladdin");

			cy.getByData("data-table-search-reset-button").shouldBeVisible();

			cy.getByData("data-table-search-reset-button").click();

			cy.getFormField("data-table-search-input").shouldHaveText("");

			cy.getByData("data-table-search-reset-button").shouldNotBeVisible();

			cy.getFormField("data-table-search-input").shouldHaveFocus();
		});
	});

	describe("data-table-status", () => {
		const mount = createMount(DataTableStatus);

		it("A status region is rendered", () => {
			mount({ type: statusTypes.SORT, sortColumn: "Title", ascending: true });

			cy.getByData("data-table-status").should("exist");
		});

		it("Announces the sort state", () => {
			mount({ type: statusTypes.SORT, sortColumn: "Title", ascending: true });

			cy.getByData("data-table-status").shouldHaveText("Sorted by Title ascending");
		});

		it("Announces search results", () => {
			mount({ type: statusTypes.SEARCH, resultCount: 2, query: "ald" });

			cy.getByData("data-table-status").shouldHaveText('Showing 2 results for "ald"');
		});

		it("Announces the selection state", () => {
			mount({ type: statusTypes.SELECTION, selectedCount: 1, totalCount: 5 });

			cy.getByData("data-table-status").shouldHaveText("1 of 5 rows selected");
		});

		it("Allows the sort announcement to be customised", () => {
			mount({
				props: { type: statusTypes.SORT, sortColumn: "Title", ascending: true },
				slots: { "sort-status": "Custom sort message" },
			});

			cy.getByData("data-table-status").shouldHaveText("Custom sort message");
		});
	});

	describe("data-table-toolbar", () => {
		const columnDefinitions = ref({
			title: { label: "Title", first: true, last: false, sortable: true },
			release_year: { label: "Release year", first: false, last: true, sortable: true },
		});

		const dataTable = {
			haveTableName: ref(true),
			tableName: ref("movies"),
			searchPlaceholder: ref("Search movies"),
			columnDefinitions,
			updateTableDensityOptions: () => {},
		};

		const props = {
			tableDensityOptions: ["compact", "standard", "relaxed"],
			columnVisibility: { title: true, release_year: true },
		};

		const mount = createMount(DataTableToolbar, {
			global: { provide: { "data-table": dataTable } },
			props,
		});

		const mountWithoutName = createMount(DataTableToolbar, {
			global: { provide: { "data-table": { ...dataTable, haveTableName: ref(false) } } },
			props,
		});

		it("Renders the search input by default", () => {
			mount();

			cy.getByData("data-table-search").shouldBeVisible();
		});

		it("Hides the search input when search is disabled", () => {
			mount({ props: { ...props, enableSearch: false } });

			cy.getByData("data-table-search").should("not.exist");
		});

		it("Shows the display options when a table name is present", () => {
			mount();

			cy.getByData("data-table-display-options").shouldBeVisible();
			cy.getByData("data-table-display-options").find("summary").click();

			cy.getByData("data-table-density").shouldBeVisible();
			cy.getByData("data-table-columns").shouldBeVisible();
		});

		it("Hides the display options when no table name is present", () => {
			mountWithoutName();

			cy.getByData("data-table-display-options").should("not.exist");
		});

		it("Allows the configure label to be customised", () => {
			mount({ props, slots: { "configure-label": "Options" } });

			cy.getByData("data-table-display-options").find("summary").shouldHaveText("Options");
		});
	});
});
