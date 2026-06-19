import { expect, test } from "@playwright/experimental-ct-vue";
import { createMount } from "@lewishowles/testing/playwright";

import LoadingSkeletonFixture from "./loading-skeleton.fixture.vue";

// Mount loading-skeleton via fixture to supply a loading-skeleton-indicator in the default slot.
const mountLoadingSkeleton = createMount(LoadingSkeletonFixture);

test.describe("loading-skeleton", () => {
	test("renders a loading-skeleton", async ({ mount, page }) => {
		await mountLoadingSkeleton(mount);

		await expect(page.getByTestId("loading-skeleton")).toBeAttached();
		await expect(page.getByTestId("loading-skeleton-indicator")).toBeVisible();
	});

	test.describe("Validation", () => {
		test("a warning is shown if no label slot is provided", async ({ mount, page }) => {
			await mountLoadingSkeleton(mount);

			await expect(page.getByTestId("loading-skeleton-no-label")).toBeVisible();
		});

		test("a label is included when provided", async ({ mount, page }) => {
			await mountLoadingSkeleton(mount, { props: { showLabel: true } });

			await expect(page.getByTestId("loading-skeleton-no-label")).not.toBeAttached();
			await expect(page.getByTestId("loading-skeleton")).toHaveText("Loading user data");
		});
	});
});
