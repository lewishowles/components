import { expect, test } from "@playwright/experimental-ct-vue";
import { createMount } from "@lewishowles/testing/playwright";

import FormWrapper from "./form-wrapper.vue";
import FormWrapperFixture from "./form-wrapper.fixture.vue";
import FormWrapperRulesFixture from "./form-wrapper-rules.fixture.vue";

// Mount form-wrapper via fixture to supply a form-field with submit-button-label.
const mountFormWrapper = createMount(FormWrapperFixture);
// Mount form-wrapper with a cross-field form-level rule (password confirmation).
const mountFormWrapperRules = createMount(FormWrapperRulesFixture);

test.describe("form-wrapper", () => {
	test("renders a form-wrapper", async ({ mount, page }) => {
		await mountFormWrapper(mount);

		await expect(page.getByTestId("form-wrapper")).toBeVisible();
		await expect(page.getByTestId("form-input")).toBeVisible();
		await expect(page.getByTestId("form-wrapper-submit-button")).toBeVisible();
	});

	test.describe("Props", () => {
		test.describe("rules", () => {
			test("shows a failing form-level rule beside the field and in the error summary", async ({
				mount,
				page,
			}) => {
				await mountFormWrapperRules(mount);

				await page.getByLabel("Password", { exact: true }).fill("wall-e");
				await page.getByLabel("Confirm password", { exact: true }).fill("eve");
				await page.getByTestId("form-wrapper-submit-button").click();

				await expect(page.getByTestId("form-wrapper-error-summary")).toContainText(
					"Passwords must match",
				);
				await expect(
					page.getByTestId("form-error").filter({ hasText: "Passwords must match" }),
				).toBeVisible();
			});

			test("the error summary link focuses the correct field", async ({ mount, page }) => {
				await mountFormWrapperRules(mount);

				await page.getByLabel("Password", { exact: true }).fill("wall-e");
				await page.getByLabel("Confirm password", { exact: true }).fill("eve");
				await page.getByTestId("form-wrapper-submit-button").click();

				await page
					.getByTestId("form-wrapper-error-summary-message")
					.filter({ hasText: "Passwords must match" })
					.click();

				await expect(page.getByLabel("Confirm password", { exact: true })).toBeFocused();
			});

			test("clears a resolved form-level error on resubmit", async ({ mount, page }) => {
				await mountFormWrapperRules(mount);

				await page.getByLabel("Password", { exact: true }).fill("wall-e");
				await page.getByLabel("Confirm password", { exact: true }).fill("eve");
				await page.getByTestId("form-wrapper-submit-button").click();

				await expect(page.getByTestId("form-wrapper-error-summary")).toContainText(
					"Passwords must match",
				);

				await page.getByLabel("Confirm password", { exact: true }).fill("wall-e");
				await page.getByTestId("form-wrapper-submit-button").click();

				await expect(page.getByTestId("form-wrapper-error-summary")).toBeHidden();
			});
		});
	});

	test.describe("status", () => {
		test("renders a success status message", async ({ mount, page }) => {
			await mount(FormWrapper, {
				props: {
					status: { type: "success", message: "Settings saved." },
				},
				slots: { "submit-button-label": "Save" },
			});

			const statusElement = page.getByTestId("form-wrapper-status");

			await expect(statusElement).toBeVisible();
			await expect(statusElement).toHaveAttribute("data-state", "success");
			await expect(statusElement).toContainText("Settings saved.");
		});

		test("renders an error status message", async ({ mount, page }) => {
			await mount(FormWrapper, {
				props: {
					status: { type: "error", message: "You do not have permission." },
				},
				slots: { "submit-button-label": "Save" },
			});

			const statusElement = page.getByTestId("form-wrapper-status");

			await expect(statusElement).toBeVisible();
			await expect(statusElement).toHaveAttribute("data-state", "error");
			await expect(statusElement).toContainText("You do not have permission.");
		});

		test("renders an info status message", async ({ mount, page }) => {
			await mount(FormWrapper, {
				props: {
					status: { type: "info", message: "Checking availability…" },
				},
				slots: { "submit-button-label": "Save" },
			});

			const statusElement = page.getByTestId("form-wrapper-status");

			await expect(statusElement).toBeVisible();
			await expect(statusElement).toHaveAttribute("data-state", "info");
			await expect(statusElement).toContainText("Checking availability…");
		});

		test("renders multiple status messages", async ({ mount, page }) => {
			await mount(FormWrapper, {
				props: {
					status: {
						type: "error",
						message: ["Name is required.", "Email is invalid."],
					},
				},
				slots: { "submit-button-label": "Save" },
			});

			const statusElement = page.getByTestId("form-wrapper-status");

			await expect(statusElement).toBeVisible();
			await expect(statusElement).toContainText("Name is required.");
			await expect(statusElement).toContainText("Email is invalid.");
		});

		test("does not render when status is not provided", async ({ mount, page }) => {
			await mount(FormWrapper, {
				slots: { "submit-button-label": "Save" },
			});

			await expect(page.getByTestId("form-wrapper-status")).not.toBeAttached();
		});
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

	test.describe("Interaction", () => {
		test("Submit button loading state resets when validation fails", async ({ mount, page }) => {
			await mountFormWrapper(mount);

			await page.getByTestId("form-wrapper-submit-button").click();

			await expect(page.getByTestId("form-wrapper-submit-button")).not.toHaveAttribute("aria-busy");
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
});
