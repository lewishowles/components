import FieldWrapper from "./field-wrapper.vue";
import { createMount } from "@cypress/support/mount";

const defaultSlots = { default: () => "Field" };
const mount = createMount(FieldWrapper, { slots: defaultSlots });

describe("field-wrapper", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("field-wrapper").shouldBeVisible();
	});
});
