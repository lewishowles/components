import { expect, test } from "@playwright/experimental-ct-vue";
import { createMount } from "@lewishowles/testing/playwright";

import FormFlowFixture from "./form-flow.fixture.vue";
import FormFlowEmptyFixture from "./form-flow-empty.fixture.vue";

// Mount the fixture so screens and fields can be composed in the slot tree.
const mountFormFlow = createMount(FormFlowFixture);
const mountEmptyFormFlow = createMount(FormFlowEmptyFixture);

test.describe("form-flow", () => {
	test("shows only the first screen initially", async ({ mount, page }) => {
		await mountFormFlow(mount);

		await expect(
			page.getByTestId("form-screen").filter({ has: page.getByText("Email address") }),
		).toBeVisible();
		await expect(page.getByText("Display name")).toBeHidden();
	});

	test("screens can be navigated", async ({ mount, page }) => {
		await mountFormFlow(mount);

		await page.getByTestId("form-flow-continue-button").click();
		await expect(page.getByText("Display name")).toBeVisible();

		await page.getByTestId("form-flow-back-button").click();
		await expect(page.getByText("Email address")).toBeVisible();
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
