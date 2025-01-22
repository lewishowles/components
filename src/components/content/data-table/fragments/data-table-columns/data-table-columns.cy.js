import DataTableColumns from "./data-table-columns.vue";
import { createMount } from "@cypress/support/mount";
import { ref } from "vue";

const tableName = ref("sample-table");
const haveTableName = ref(true);

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

const global = { provide: { "data-table": { tableName, haveTableName, columnDefinitions } } };
const mount = createMount(DataTableColumns, { global });

describe("data-table-columns", () => {
	afterEach(() => {
		// We remove any local storage for this table after each run to ensure
		// there are no conflicts between tests.
		localStorage.removeItem("data-table:sample-table:columns");
	});

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

	it("Custom visibility is retrieved from localStorage", () => {
		localStorage.setItem("data-table:sample-table:columns", "{\"title\":true,\"release_year\":false}");

		mount();

		cy.getByData("data-table-columns-checkbox").shouldHaveCount(2);
		cy.getByData("data-table-columns-checkbox").eq(0).getFormField().should("be.checked");
		cy.getByData("data-table-columns-checkbox").eq(1).getFormField().should("not.be.checked");
	});

	it("A change in visibility is stored in localStorage", () => {
		mount();

		cy.getByData("data-table-columns-checkbox").eq(0).getFormField().click();

		cy.getByData("data-table-columns").then(() => {
			expect(localStorage.getItem("data-table:sample-table:columns")).to.equal("{\"title\":false,\"release_year\":true}");
		});
	});
});
