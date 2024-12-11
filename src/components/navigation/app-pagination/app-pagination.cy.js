import AppPagination from "./app-pagination.vue";
import { createMount } from "@cypress/support/mount";

const mount = createMount(AppPagination);

describe("app-pagination", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("app-pagination").shouldBeVisible();
	});
});
