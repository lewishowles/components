import SkeletonIndicator from "./skeleton-indicator.vue";
import { createMount } from "@cypress/support/mount";

const defaultProps = { class: "h-4" };
const mount = createMount(SkeletonIndicator, { props: defaultProps });

describe("skeleton-indicator", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("skeleton-indicator").shouldBeVisible();
	});
});
