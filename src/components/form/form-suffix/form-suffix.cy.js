import FormSuffix from "./form-suffix.vue";
import { createMount } from "@cypress/support/mount";

const mount = createMount(FormSuffix);

describe("form-suffix", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("form-suffix").shouldBeVisible();
	});
});
