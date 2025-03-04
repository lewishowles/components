import FormInputGroup from "./form-input-group.vue";
import { createMount } from "@cypress/support/mount";

const mount = createMount(FormInputGroup);

describe("form-input-group", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("form-input-group").shouldBeVisible();
	});
});
