import FormLayout from "./form-layout.vue";
import { createMount } from "@cypress/support/mount";

const defaultSlots = { default: "Form placeholder" };
const mount = createMount(FormLayout, { slots: defaultSlots });

describe("form-layout", () => {
	it("Renders a form layout", () => {
		mount();

		cy.getByData("form-layout").shouldBeVisible();
	});
});
