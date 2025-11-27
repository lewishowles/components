import StepIndicator from "./step-indicator.vue";
import { createMount } from "@cypress/support/mount";

const defaultProps = {
	currentStep: 2,
	stepCount: 5,
};

const defaultSlots = {
	default: "Address details",
};

const mount = createMount(StepIndicator, { props: defaultProps, slots: defaultSlots });

describe("step-indicator", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("step-indicator").shouldBeVisible();
		cy.getByData("step-indicator-label").shouldBeVisible();
		cy.getByData("step-indicator-label").shouldHaveText("Address details");
		cy.getByData("step-indicator-current-step").shouldBeVisible();
		cy.getByData("step-indicator-current-step").shouldHaveText("Step 2 of 5");
	});

	it("The appropriate accessibility attributes are included", () => {
		mount();

		cy.getByData("step-indicator")
			.shouldHaveAttribute("role", "progressbar")
			.shouldHaveAttribute("aria-label", "Address details")
			.shouldHaveAttribute("aria-valuenow", "2")
			.shouldHaveAttribute("aria-valuemin", "1")
			.shouldHaveAttribute("aria-valuemax", "5")
			.shouldHaveAttribute("aria-valuetext", "40%");
	});

	it("The current progress is displayed", () => {
		mount();

		cy.getByData("step-indicator-current-step").shouldHaveText("Step 2 of 5");
	});

	describe("Slots", () => {
		it("Slots can be defined", () => {
			mount({ slots: { "current-step": "40%" } });

			cy.getByData("step-indicator-label").shouldHaveText("Address details");
			cy.getByData("step-indicator-current-step").shouldHaveText("40%");
		});
	});
});
