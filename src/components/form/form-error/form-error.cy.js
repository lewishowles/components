import FormError from "./form-error.vue";
import { createMount } from "@cypress/support/mount";

const defaultSlots = { default: "Error message" };
const mount = createMount(FormError, { slots: defaultSlots });

describe("form-error", () => {
	it("Renders help", () => {
		mount();

		cy.getByData("form-error").shouldBeVisible();
	});
});
