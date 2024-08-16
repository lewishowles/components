import FormActions from "./form-actions.vue";
import { createMount } from "@cypress/support/mount";

const defaultSlots = { default: "Form placeholder" };
const mount = createMount(FormActions, { slots: defaultSlots });

describe("form-actions", () => {
	it("Renders a form actions wrapper", () => {
		mount();

		cy.getByData("form-actions").shouldBeVisible();
	});
});
