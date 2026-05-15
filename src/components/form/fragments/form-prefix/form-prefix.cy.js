import FormPrefix from "./form-prefix.vue";
import { createMount } from "@cypress/support/mount";

const defaultSlots = { default: "£" };
const mount = createMount(FormPrefix, { slots: defaultSlots });

describe("form-prefix", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("form-prefix").shouldBeVisible();
	});
});
