import SkeletonIndicator from "./skeleton-indicator.vue";
import { createMount } from "@cypress/support/mount";

const mount = createMount(SkeletonIndicator);

describe("skeleton-indicator", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("skeleton-indicator").shouldBeVisible();
	});
});
