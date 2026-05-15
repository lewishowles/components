import FormSuffix from "./form-suffix.vue";
import { createMount } from "@cypress/support/mount";

const defaultSlots = { default: ".com" };
const mount = createMount(FormSuffix, { slots: defaultSlots });

describe("form-suffix", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("form-suffix").shouldBeVisible();
	});
});
