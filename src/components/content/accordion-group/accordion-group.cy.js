import AccordionGroup from "./accordion-group.vue";
import { createMount } from "@cypress/support/mount";

const mount = createMount(AccordionGroup);

describe("accordion-group", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("accordion-group").shouldBeVisible();
	});
});
