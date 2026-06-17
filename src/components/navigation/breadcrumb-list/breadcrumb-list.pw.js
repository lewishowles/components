import { expect, test } from "@playwright/experimental-ct-vue";
import { createMount } from "#test/ct/support/mount.js";

import BreadcrumbListFixture from "./breadcrumb-list.fixture.vue";

// Mount breadcrumb-list via fixture to supply breadcrumb-item children in the slot.
const mountBreadcrumbList = createMount(BreadcrumbListFixture);

test.describe("breadcrumb-list", () => {
	test("renders a breadcrumb-list", async ({ mount, page }) => {
		await mountBreadcrumbList(mount);

		await expect(page.getByTestId("breadcrumb-list")).toBeVisible();
		await expect(page.getByTestId("breadcrumb-list-list")).toBeVisible();
		await expect(page.getByTestId("breadcrumb-item")).toHaveCount(2);
	});

	test("each item contains a chevron svg", async ({ mount, page }) => {
		await mountBreadcrumbList(mount);

		const items = page.getByTestId("breadcrumb-item");

		await expect(items.nth(0).locator("svg")).toBeAttached();
		await expect(items.nth(1).locator("svg")).toBeAttached();
	});
});
