import AccordionItem from "./accordion-section.vue";
import { createMount } from "@cypress/support/mount";

const mount = createMount(AccordionItem);

describe("accordion-section", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("accordion-section").shouldBeVisible();
	});
});
