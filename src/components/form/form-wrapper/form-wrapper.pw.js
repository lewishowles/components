import { expect, test } from "@playwright/experimental-ct-vue";
import { createMount } from "#test/ct/support/mount.js";

import FormWrapper from "./form-wrapper.vue";
import FormWrapperFixture from "./form-wrapper.fixture.vue";

// Mount form-wrapper via fixture to supply a form-field with submit-button-label.
const mountFormWrapper = createMount(FormWrapperFixture);

test.describe("form-wrapper", () => {
	test("renders a form-wrapper", async ({ mount, page }) => {
		await mountFormWrapper(mount);

		await expect(page.getByTestId("form-wrapper")).toBeVisible();
		await expect(page.getByTestId("form-input")).toBeVisible();
		await expect(page.getByTestId("form-wrapper-submit-button")).toBeVisible();
	});

	test.describe("Slots", () => {
		test("the default slot can be utilised", async ({ mount, page }) => {
			await mount(FormWrapper, {
				slots: {
					default: "<div data-test='default-slot-test'>Slot test</div>",
					"submit-button-label": "Create user",
				},
			});

			await expect(page.getByTestId("default-slot-test")).toBeVisible();
		});

		test("an error is shown if submit-button-label is not provided", async ({ mount, page }) => {
			await mount(FormWrapper, { slots: {} });

			await expect(page.getByTestId("form-wrapper-submit-button-label-error")).toBeVisible();
		});

		test("an error is not shown if submit-button-label is provided", async ({ mount, page }) => {
			await mountFormWrapper(mount);

			await expect(page.getByTestId("form-wrapper-submit-button-label-error")).not.toBeAttached();
		});

		test("the pre-form slot can be utilised", async ({ mount, page }) => {
			await mount(FormWrapper, {
				slots: {
					"pre-form": "<div data-test='pre-form-slot-test'>Slot test</div>",
					"submit-button-label": "Create user",
				},
			});

			await expect(page.getByTestId("pre-form-slot-test")).toBeVisible();
		});

		test("the secondary-actions slot can be utilised", async ({ mount, page }) => {
			await mount(FormWrapper, {
				slots: {
					"secondary-actions": "<div data-test='secondary-actions-slot-test'>Slot test</div>",
					"submit-button-label": "Create user",
				},
			});

			await expect(page.getByTestId("secondary-actions-slot-test")).toBeVisible();
		});

		test("the tertiary-actions slot can be utilised", async ({ mount, page }) => {
			await mount(FormWrapper, {
				slots: {
					"tertiary-actions": "<div data-test='tertiary-actions-slot-test'>Slot test</div>",
					"submit-button-label": "Create user",
				},
			});

			await expect(page.getByTestId("tertiary-actions-slot-test")).toBeVisible();
		});

		test("the submit-errors slot can be utilised", async ({ mount, page }) => {
			await mount(FormWrapper, {
				slots: {
					"submit-errors": "<div data-test='submit-errors-slot-test'>Slot test</div>",
					"submit-button-label": "Create user",
				},
			});

			await expect(page.getByTestId("submit-errors-slot-test")).toBeVisible();
		});
	});

	test.describe("Submit button loading state", () => {
		test("resets when validation fails", async ({ mount, page }) => {
			await mountFormWrapper(mount);

			await page.getByTestId("form-wrapper-submit-button").click();

			await expect(page.getByTestId("form-wrapper-submit-button")).not.toHaveAttribute("aria-busy");
		});
	});

	test("an error summary is shown on submit when a field is invalid", async ({ mount, page }) => {
		await mountFormWrapper(mount);

		await page.getByTestId("form-wrapper-submit-button").click();

		const errorSummary = page.getByTestId("form-wrapper-error-summary");

		await expect(errorSummary).toBeVisible();
		await expect(errorSummary).toContainText("There is a problem");
		await expect(errorSummary).toContainText("Enter your username");
		await expect(page.getByTestId("form-wrapper-error-summary-message")).toHaveCount(1);
	});
});
