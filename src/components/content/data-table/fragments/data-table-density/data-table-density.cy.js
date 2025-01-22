import DataTableDensity from "./data-table-density.vue";
import { createMount } from "@cypress/support/mount";
import { ref } from "vue";

const tableName = ref("sample-table");
const haveTableName = ref(true);
const global = { provide: { "data-table": { tableName, haveTableName, updateTableDensityOptions: () => {} } } };
const mount = createMount(DataTableDensity, { global });

describe("data-table-density", () => {
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

		cy.getByData("data-table-density-relaxed").shouldHaveClass("text-purple-800");
	});

	it("A custom density is retrieved from localStorage", () => {
		localStorage.setItem("data-table:sample-table:density", "compact");

		mount();

		cy.getByData("data-table-density-compact").shouldHaveClass("text-purple-800");
	});

	it("A change in chosen density is stored in localStorage", () => {
		mount();

		cy.getByData("data-table-density-compact").click();
		cy.getByData("data-table-density-compact").shouldHaveClass("text-purple-800");

		cy.getByData("data-table-density").then(() => {
			expect(localStorage.getItem("data-table:sample-table:density")).to.equal("compact");
		});
	});
});
