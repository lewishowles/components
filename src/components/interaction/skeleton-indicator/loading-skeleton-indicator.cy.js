import LoadingSkeletonIndicator from "./loading-skeleton-indicator.vue";
import { createMount } from "@cypress/support/mount";

const defaultProps = { class: "h-4" };
const mount = createMount(LoadingSkeletonIndicator, { props: defaultProps });

describe("loading-skeleton-indicator", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("loading-skeleton-indicator").shouldBeVisible();
	});
});
