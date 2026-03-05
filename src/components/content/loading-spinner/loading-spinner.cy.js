import LoadingSpinner from "./loading-spinner.vue";
import { createMount } from "@cypress/support/mount";

const mount = createMount(LoadingSpinner);

describe("loading-spinner", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("loading-spinner").shouldBeVisible();
	});
});
