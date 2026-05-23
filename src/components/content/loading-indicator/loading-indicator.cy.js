import LoadingIndicator from "./loading-indicator.vue";
import { createMount } from "@cypress/support/mount";

const defaultSlots = { default: "Loading" };
const mount = createMount(LoadingIndicator, { slots: defaultSlots });

describe("loading-indicator", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("loading-indicator").shouldBeVisible();
		cy.getByData("loading-indicator").shouldHaveText("Loading");
	});
});
