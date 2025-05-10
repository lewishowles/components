import SkeletonLoader from "./skeleton-loader.vue";
import SkeletonIndicator from "@/components/content/skeleton-indicator/skeleton-indicator.vue";
import { createMount } from "@cypress/support/mount";
import { h } from "vue";

const defaultSlots = { default: h(SkeletonIndicator, { class: "h-4" }) };
const mount = createMount(SkeletonLoader, { slots: defaultSlots });

describe("skeleton-loader", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("skeleton-loader").shouldBeVisible();
		cy.getByData("skeleton-indicator").shouldBeVisible();
	});

	it("A label is included", () => {
		mount();

		cy.getByData("skeleton-loader").shouldHaveText("Loading…");
	});
});
