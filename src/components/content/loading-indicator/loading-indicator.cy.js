import LoadingIndicator from "./loading-indicator.vue";
import { createMount } from "@cypress/support/mount";

const mount = createMount(LoadingIndicator);

describe("loading-indicator", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("loading-indicator").shouldBeVisible();
	});
});
