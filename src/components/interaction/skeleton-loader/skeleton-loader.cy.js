import SkeletonLoader from "./skeleton-loader.vue";
import { createMount } from "@cypress/support/mount";

const mount = createMount(SkeletonLoader);

describe("skeleton-loader", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("skeleton-loader").shouldBeVisible();
	});

	it("A label is included", () => {
		mount();

		cy.getByData("skeleton-loader").shouldHaveText("Loading…");
	});
});
