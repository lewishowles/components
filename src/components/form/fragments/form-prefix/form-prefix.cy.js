import FormPrefix from "./form-prefix.vue";
import { createMount } from "@cypress/support/mount";

const mount = createMount(FormPrefix);

describe("form-prefix", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("form-prefix").shouldBeVisible();
	});
});
