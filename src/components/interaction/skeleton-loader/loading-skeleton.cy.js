import LoadingSkeleton from "./loading-skeleton.vue";
import LoadingSkeletonIndicator from "@/components/interaction/loading-skeleton-indicator/loading-skeleton-indicator.vue";
import { createMount } from "@cypress/support/mount";
import { h } from "vue";

const defaultSlots = { default: h(LoadingSkeletonIndicator, { class: "h-4" }) };
const mount = createMount(LoadingSkeleton, { slots: defaultSlots });

describe("loading-skeleton", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("loading-skeleton").shouldBeVisible();
		cy.getByData("loading-skeleton-indicator").shouldBeVisible();
	});

	it("A label is included", () => {
		mount();

		cy.getByData("loading-skeleton").shouldHaveText("Loading…");
	});
});
