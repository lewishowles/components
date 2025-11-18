import StepIndicator from "./step-indicator.vue";
import { createMount } from "@cypress/support/mount";

const defaultSlots = {
	default: "Address details",
};

const mount = createMount(StepIndicator, { slots: defaultSlots });

describe("step-indicator", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("step-indicator").shouldBeVisible();
		cy.getByData("step-indicator-label").shouldBeVisible();
		cy.getByData("step-indicator-progress").shouldBeVisible();
	});

	it("The appropriate accessibility attributes are included", () => {
		mount({ currentStep: 2, stepCount: 5 });

		cy.getByData("step-indicator")
			.shouldHaveAttribute("role", "progressbar")
			.shouldHaveAttribute("aria-label", "Address details")
			.shouldHaveAttribute("aria-valuenow", "2")
			.shouldHaveAttribute("aria-valuemin", "1")
			.shouldHaveAttribute("aria-valuemax", "5")
			.shouldHaveAttribute("aria-valuetext", "40%");
	});

	it("The current progress is displayed", () => {
		mount({ currentStep: 2, stepCount: 5 });

		cy.getByData("step-indicator-progress").shouldHaveText("Step 2 of 5");
	});
});
