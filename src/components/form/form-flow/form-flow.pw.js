import { expect, test } from "@playwright/experimental-ct-vue";
import { createMount } from "@lewishowles/testing/playwright";

import FormFlowFixture from "./form-flow.fixture.vue";
import FormFlowEmptyFixture from "./form-flow-empty.fixture.vue";
import FormFlowErrorRoutingFixture from "./form-flow-error-routing.fixture.vue";

// Mount the fixture so screens and fields can be composed in the slot tree.
const mountFormFlow = createMount(FormFlowFixture);
const mountEmptyFormFlow = createMount(FormFlowEmptyFixture);
const mountErrorRoutingFormFlow = createMount(FormFlowErrorRoutingFixture);

test.describe("form-flow", () => {
	test("shows only the first screen initially", async ({ mount, page }) => {
		await mountFormFlow(mount);

		await expect(
			page.getByTestId("form-screen").filter({ has: page.getByText("Email address") }),
		).toBeVisible();
		await expect(page.getByText("Display name")).toBeHidden();
	});

	test("shows descriptive numeric progress without navigation controls", async ({
		mount,
		page,
	}) => {
		await mountFormFlow(mount);

		const progress = page.getByTestId("step-indicator");

		await expect(progress).toHaveRole("progressbar");
		await expect(progress).toContainText("Account details");
		await expect(progress).toContainText("Step 1 of 2");
		await expect(progress.locator("a, button")).toHaveCount(0);

		await page.getByTestId("form-flow-continue-button").click();

		await expect(progress).toContainText("Profile details");
		await expect(progress).toContainText("Step 2 of 2");
	});

	test("screens can be navigated", async ({ mount, page }) => {
		await mountFormFlow(mount);

		await page.getByTestId("form-flow-continue-button").click();
		await expect(page.getByText("Display name")).toBeVisible();

		await page.getByTestId("form-flow-back-button").click();
		await expect(page.getByText("Email address")).toBeVisible();
	});

	test("moves focus to the first visible screen field after final validation fails", async ({
		mount,
		page,
	}) => {
		await mountErrorRoutingFormFlow(mount);

		await page.getByTestId("form-flow-continue-button").click();
		await page.getByTestId("invalidate-first-field").click();
		await page.getByTestId("form-flow-continue-button").click();

		await expect(page.getByLabel("First answer", { exact: true })).toBeVisible();
		await expect(page.getByLabel("First answer", { exact: true })).toBeFocused();
	});

	test("shows root final errors in the flow summary and focuses it", async ({ mount, page }) => {
		await mountErrorRoutingFormFlow(mount);

		await page.getByTestId("form-flow-continue-button").click();
		await page.getByTestId("show-root-error").click();
		await page.getByTestId("form-flow-continue-button").click();

		const errorSummary = page.getByTestId("form-flow-error-summary");

		await expect(errorSummary).toBeVisible();
		await expect(errorSummary).toContainText("The form is not ready to submit");
		await expect(errorSummary).toBeFocused();
	});

	test("shows an accessible empty state when all screens are removed", async ({ mount, page }) => {
		await mountEmptyFormFlow(mount);

		const removeScreensButton = page.getByTestId("remove-form-flow-screens");

		await removeScreensButton.click();

		const emptyState = page.getByTestId("form-flow-empty");

		await expect(emptyState).toBeVisible();
		await expect(emptyState).toHaveRole("status");
		await expect(emptyState).toHaveAttribute("aria-live", "polite");
		await expect(emptyState).toContainText("No screens are available.");
		await expect(removeScreensButton).toBeFocused();
		await expect(page.getByTestId("form-flow-continue-button")).not.toBeAttached();
	});
});
