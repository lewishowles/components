import FormFieldset from "./form-fieldset.vue";
import { createMount } from "@cypress/support/mount";

const mount = createMount(FormFieldset);

describe("form-fieldset", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("form-fieldset").shouldBeVisible();
	});
});
