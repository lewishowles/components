import LoadingSpinner from "./loading-spinner.vue";
import { createMount } from "@cypress/support/mount";

const mount = createMount(LoadingSpinner);

describe("loading-spinner", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("loading-spinner").shouldBeVisible();
	});

	describe("Styling hooks", () => {
		it("data-component is set on the root element", () => {
			mount();

			cy.getByData("loading-spinner").shouldHaveAttribute("data-component", "loading-spinner");
		});
	});
});
