import ContentSeparator from "./content-separator.vue";
import { createMount } from "@cypress/support/mount";

const mount = createMount(ContentSeparator);

describe("content-separator", () => {
	it("A component is rendered", () => {
		mount({ tag: "hr" });

		cy.getByData("content-separator").shouldBeVisible();
	});

	it("Is aria-hidden when not using an hr", () => {
		mount({ tag: "div" });

		cy.getByData("content-separator").shouldHaveAttribute("aria-hidden", "true");
	});

	it("Is not aria-hidden when using an hr", () => {
		mount({ tag: "hr" });

		cy.getByData("content-separator").shouldHaveAttribute("aria-hidden", "false");
	});
});
