import LoadingSkeleton from "./loading-skeleton.vue";
import LoadingSkeletonIndicator from "@/components/interaction/skeleton-indicator/loading-skeleton-indicator.vue";
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

	describe("Validation", () => {
		it("A warning is shown if no label slot is provided", () => {
			mount();

			cy.getByData("loading-skeleton-no-label").shouldBeVisible();
		});

		it("A label is included when provided", () => {
			mount({ slots: { label: "Loading user data" } });

			cy.getByData("loading-skeleton-no-label").should("not.exist");
			cy.getByData("loading-skeleton").shouldHaveText("Loading user data");
		});
	});
});
