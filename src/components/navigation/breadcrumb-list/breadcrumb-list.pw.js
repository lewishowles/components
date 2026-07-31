import { expect, test } from "@playwright/experimental-ct-vue";
import { createMount } from "@lewishowles/testing/playwright";

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
		await expect(items.nth(0)).toHaveClass(/whitespace-nowrap/);
		await expect(items.nth(1)).toHaveClass(/whitespace-nowrap/);
	});

	test("keeps a narrow chain on one line with the end visible", async ({ mount, page }) => {
		await page.setViewportSize({ height: 240, width: 100 });
		await mountBreadcrumbList(mount);

		const list = page.getByTestId("breadcrumb-list-list");
		const nav = page.getByTestId("breadcrumb-list");

		await expect(list).toHaveClass(/overflow-x-auto/);
		await expect(nav).toHaveClass(/show-left/);
		await expect(nav).not.toHaveClass(/show-right/);

		// The list scrolls itself to the end asynchronously (after mount, via a
		// ResizeObserver), so these derived metrics need to be read and
		// re-checked together as a unit until that settles, rather than as a
		// single snapshot.
		await expect(async () => {
			const metrics = await list.evaluate((element) => {
				const listRect = element.getBoundingClientRect();
				const lastItemRect = element.lastElementChild.getBoundingClientRect();

				return {
					clientHeight: element.clientHeight,
					clientWidth: element.clientWidth,
					documentWidth: document.documentElement.scrollWidth,
					lastItemRight: lastItemRect.right,
					scrollHeight: element.scrollHeight,
					scrollLeft: element.scrollLeft,
					scrollWidth: element.scrollWidth,
					viewportWidth: window.innerWidth,
					listRight: listRect.right,
				};
			});

			expect(metrics.scrollWidth).toBeGreaterThan(metrics.clientWidth);
			expect(metrics.scrollHeight).toBeLessThanOrEqual(metrics.clientHeight);
			expect(metrics.scrollLeft).toBe(metrics.scrollWidth - metrics.clientWidth);
			expect(metrics.lastItemRight).toBeLessThanOrEqual(metrics.listRight);
			expect(metrics.documentWidth).toBeLessThanOrEqual(metrics.viewportWidth);
		}).toPass();
	});

	test("does not visibly scroll a short chain", async ({ mount, page }) => {
		await page.setViewportSize({ height: 240, width: 320 });
		await mountBreadcrumbList(mount);

		const list = page.getByTestId("breadcrumb-list-list");
		const nav = page.getByTestId("breadcrumb-list");

		const metrics = await list.evaluate((element) => ({
			clientWidth: element.clientWidth,
			scrollLeft: element.scrollLeft,
			scrollWidth: element.scrollWidth,
		}));

		await expect(list).toHaveClass(/overflow-x-auto/);
		await expect(nav).not.toHaveClass(/show-left/);
		await expect(nav).not.toHaveClass(/show-right/);
		expect(metrics.scrollWidth).toBe(metrics.clientWidth);
		expect(metrics.scrollLeft).toBe(0);
	});
});
