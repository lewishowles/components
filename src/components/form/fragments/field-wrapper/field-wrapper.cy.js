import FieldWrapper from "./field-wrapper.vue";
import { createMount } from "@cypress/support/mount";

const mount = createMount(FieldWrapper);

describe("field-wrapper", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("field-wrapper").shouldBeVisible();
	});
});
