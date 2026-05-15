import FormFieldset from "./form-fieldset.vue";
import { createMount } from "@cypress/support/mount";

const defaultSlots = { default: "Fieldset content" };
const mount = createMount(FormFieldset, { slots: defaultSlots });

describe("form-fieldset", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("form-fieldset").shouldBeVisible();
	});
});
