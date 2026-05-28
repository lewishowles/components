import FormFieldset from "./form-fieldset.vue";
import { createMount } from "@cypress/support/mount";

const defaultSlots = { default: "Fieldset content" };
const mount = createMount(FormFieldset, { slots: defaultSlots });

describe("form-fieldset", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("form-fieldset").shouldBeVisible();
	});

	describe("Styling hooks", () => {
		it("data-component is set on the root element", () => {
			mount();

			cy.getByData("form-fieldset").shouldHaveAttribute("data-component", "form-fieldset");
		});
	});
});
