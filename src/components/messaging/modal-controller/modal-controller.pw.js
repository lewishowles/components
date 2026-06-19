import { expect, test } from "@playwright/experimental-ct-vue";
import { createMount } from "@lewishowles/testing/playwright";

import StackingTestFixture from "./modal-controller.fixture.vue";

// Mount modal-controller via stacking fixture to test composable-driven modal management.
const mountStackingTest = createMount(StackingTestFixture);

test.describe("modal-controller", () => {
	test("renders a modal-controller", async ({ mount, page }) => {
		await mountStackingTest(mount);

		await expect(page.getByTestId("stacking-test-open-first")).toBeVisible();
	});

	test.describe("Modal stacking", () => {
		test("the first modal is inert when a second modal opens on top", async ({ mount, page }) => {
			await mountStackingTest(mount);

			await page.getByTestId("stacking-test-open-first").click();
			await expect(page.getByTestId("stacking-test-first-content")).toBeVisible();

			await page.getByTestId("stacking-test-open-second").click();
			await expect(page.getByTestId("stacking-test-second-content")).toBeVisible();

			const firstDialog = page
				.getByTestId("stacking-test-first-content")
				.locator("xpath=ancestor::dialog");

			const inert = await firstDialog.evaluate((el) => el.inert);

			expect(inert).toBe(true);
		});

		test("the first modal is no longer inert after the second modal closes", async ({
			mount,
			page,
		}) => {
			await mountStackingTest(mount);

			await page.getByTestId("stacking-test-open-first").click();
			await page.getByTestId("stacking-test-open-second").click();
			await page.getByTestId("stacking-test-close-second").click();

			const firstDialog = page
				.getByTestId("stacking-test-first-content")
				.locator("xpath=ancestor::dialog");

			const inert = await firstDialog.evaluate((el) => el.inert);

			expect(inert).toBe(false);
		});

		test("both modals remain in the DOM while stacked", async ({ mount, page }) => {
			await mountStackingTest(mount);

			await page.getByTestId("stacking-test-open-first").click();
			await page.getByTestId("stacking-test-open-second").click();

			await expect(page.getByTestId("stacking-test-first-content")).toBeAttached();
			await expect(page.getByTestId("stacking-test-second-content")).toBeAttached();
		});
	});
});
