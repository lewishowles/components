import { createMount } from "@cypress/support/mount";

import DataTableHeader from "./data-table-header.vue";

const mount = createMount(DataTableHeader);

describe("data-table-header", () => {
	it("Renders nothing when no slots are provided", () => {
		mount();

		cy.getByData("data-table-header").should("not.exist");
	});

	it("Renders a title at the default heading level", () => {
		mount({ slots: { "table-title": "Movies" } });

		cy.getByData("data-table-header").shouldBeVisible();
		cy.get("h2").shouldHaveText("Movies");
	});

	it("Renders a title at a custom heading level", () => {
		mount({ props: { headingLevel: "h3" }, slots: { "table-title": "Movies" } });

		cy.get("h3").shouldHaveText("Movies");
	});

	it("Renders an introduction", () => {
		mount({ slots: { "table-introduction": "About the data" } });

		cy.getByData("data-table-header").shouldHaveText("About the data");
	});
});
