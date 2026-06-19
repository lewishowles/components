import { expect, test } from "@playwright/experimental-ct-vue";
import { createMount } from "@lewishowles/testing/playwright";

import LoadingSpinner from "./loading-spinner.vue";

// Mount loading-spinner with sensible defaults for testing.
const mountLoadingSpinner = createMount(LoadingSpinner);

test.describe("loading-spinner", () => {
	test("renders a loading-spinner", async ({ mount, page }) => {
		await mountLoadingSpinner(mount);

		await expect(page.getByTestId("loading-spinner")).toBeVisible();
	});

	test.describe("Styling hooks", () => {
		test("data-component is set on the root element", async ({ mount, page }) => {
			await mountLoadingSpinner(mount);

			await expect(page.getByTestId("loading-spinner")).toHaveAttribute(
				"data-component",
				"loading-spinner",
			);
		});
	});
});
