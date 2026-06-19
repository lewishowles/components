import { expect, test } from "@playwright/experimental-ct-vue";
import { createMount } from "@lewishowles/testing/playwright";

import StepIndicator from "./step-indicator.vue";

// Mount step-indicator with sensible defaults for testing.
const mountStepIndicator = createMount(StepIndicator, {
	props: { currentStep: 2, stepCount: 5 },
	slots: { default: "Address details" },
});

test.describe("step-indicator", () => {
	test("renders a step-indicator", async ({ mount, page }) => {
		await mountStepIndicator(mount);

		const stepIndicator = page.getByTestId("step-indicator");
		const label = page.getByTestId("step-indicator-label");
		const currentStep = page.getByTestId("step-indicator-current-step");

		await expect(stepIndicator).toBeVisible();
		await expect(label).toBeVisible();
		await expect(label).toHaveText("Address details");
		await expect(currentStep).toBeVisible();
		await expect(currentStep).toHaveText("Step 2 of 5");
	});

	test("the appropriate accessibility attributes are included", async ({ mount, page }) => {
		await mountStepIndicator(mount);

		const stepIndicator = page.getByTestId("step-indicator");

		await expect(stepIndicator).toHaveAttribute("role", "progressbar");
		await expect(stepIndicator).toHaveAttribute("aria-valuenow", "2");
		await expect(stepIndicator).toHaveAttribute("aria-valuemin", "1");
		await expect(stepIndicator).toHaveAttribute("aria-valuemax", "5");
		await expect(stepIndicator).toHaveAttribute("aria-valuetext", "40%");
		await expect(stepIndicator).toHaveAttribute("aria-labelledby");
	});

	test("the current progress is displayed", async ({ mount, page }) => {
		await mountStepIndicator(mount);

		await expect(page.getByTestId("step-indicator-current-step")).toHaveText("Step 2 of 5");
	});

	test.describe("Slots", () => {
		test("slots can be defined", async ({ mount, page }) => {
			await mountStepIndicator(mount, { slots: { "current-step": "40%" } });

			await expect(page.getByTestId("step-indicator-label")).toHaveText("Address details");
			await expect(page.getByTestId("step-indicator-current-step")).toHaveText("40%");
		});
	});
});
