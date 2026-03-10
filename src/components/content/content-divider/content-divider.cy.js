import ContentDivider from "./content-divider.vue";
import { createMount } from "@cypress/support/mount";

const mount = createMount(ContentDivider);

describe("content-divider", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("content-divider").shouldBeVisible();
	});

	it("Is aria-hidden when not using an `hr`", () => {
		mount({ tag: "div" });

		cy.getByData("content-divider").shouldHaveAttribute("aria-hidden", "true");
	});

	it("Is not aria-hidden when using an `hr`", () => {
		mount({ tag: "hr" });

		cy.getByData("content-divider").shouldHaveAttribute("aria-hidden", "false");
	});
});
