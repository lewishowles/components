import DataTableColumns from "./data-table-columns.vue";
import { createMount } from "@cypress/support/mount";
import { ref } from "vue";

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

describe("data-table-columns", () => {
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
