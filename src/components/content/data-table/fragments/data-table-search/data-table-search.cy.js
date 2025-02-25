import DataTableSearch from "./data-table-search.vue";
import { createMount } from "@cypress/support/mount";

const global = { provide: { "data-table": { searchPlaceholder: "Search characters by name, movie, or year" } } };
const mount = createMount(DataTableSearch, { global });

describe("data-table-search", () => {
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
