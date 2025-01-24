import DataTablePagination from "./data-table-pagination.vue";
import { createMount } from "@cypress/support/mount";

const mount = createMount(DataTablePagination);

describe("data-table-pagination", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("data-table-pagination").shouldBeVisible();
	});
});
