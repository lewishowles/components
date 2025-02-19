import FormSelect from "./form-select.vue";
import { createMount } from "@cypress/support/mount";

const mount = createMount(FormSelect);

describe("form-select", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("form-select").shouldBeVisible();
	});
});
