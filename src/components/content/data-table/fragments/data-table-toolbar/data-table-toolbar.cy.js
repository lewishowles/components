import DataTableToolbar from "./data-table-toolbar.vue";
import { createMount } from "@cypress/support/mount";
import { ref } from "vue";

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

describe("data-table-toolbar", () => {
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
