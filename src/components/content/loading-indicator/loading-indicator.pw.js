import { expect, test } from "@playwright/experimental-ct-vue";
import { createMount } from "@lewishowles/testing/playwright";

import LoadingIndicator from "./loading-indicator.vue";

// Mount loading-indicator with sensible defaults for testing.
const mountLoadingIndicator = createMount(LoadingIndicator, { slots: { default: "Loading" } });

test.describe("loading-indicator", () => {
	test("renders a loading-indicator", async ({ mount, page }) => {
		await mountLoadingIndicator(mount);

		const loadingIndicator = page.getByTestId("loading-indicator");

		await expect(loadingIndicator).toBeVisible();
		await expect(loadingIndicator).toHaveText("Loading");
	});

	test.describe("Styling hooks", () => {
		test("data-component is set on the root element", async ({ mount, page }) => {
			await mountLoadingIndicator(mount);

			await expect(page.getByTestId("loading-indicator")).toHaveAttribute(
				"data-component",
				"loading-indicator",
			);
		});

		test("data-large is set when large is true", async ({ mount, page }) => {
			await mountLoadingIndicator(mount, { props: { large: true } });

			await expect(page.getByTestId("loading-indicator")).toHaveAttribute("data-large", "true");
		});

		test("data-large is not set by default", async ({ mount, page }) => {
			await mountLoadingIndicator(mount);

			await expect(page.getByTestId("loading-indicator")).not.toHaveAttribute("data-large");
		});
	});
});
