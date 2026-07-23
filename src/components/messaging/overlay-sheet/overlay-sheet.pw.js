import { expect, test } from "@playwright/experimental-ct-vue";
import { createMount } from "@lewishowles/testing/playwright";

import OverlaySheet from "./overlay-sheet.vue";

// Mount overlay-sheet with the required controlled props for testing.
const mountOverlaySheet = createMount(OverlaySheet);

test.describe("overlay-sheet", () => {
	test("renders an open sheet", async ({ mount, page }) => {
		await mountOverlaySheet(mount, {
			props: { isOpen: true, isSheet: true, label: "Details" },
			slots: { default: '<div data-test="overlay-sheet-content">Content</div>' },
		});

		await expect(page.locator('[data-part="sheet"]')).toBeVisible();
	});

	test.describe("Accessibility", () => {
		test("has aria-modal=true", async ({ mount, page }) => {
			await mountOverlaySheet(mount, {
				props: { isOpen: true, isSheet: true, label: "Details" },
			});

			await expect(page.locator('[data-part="sheet"]')).toHaveAttribute("aria-modal", "true");
		});

		test("has aria-label from label", async ({ mount, page }) => {
			await mountOverlaySheet(mount, {
				props: { isOpen: true, isSheet: true, label: "Account details" },
			});

			await expect(page.locator('[data-part="sheet"]')).toHaveAttribute(
				"aria-label",
				"Account details",
			);
		});

		test("uses the implicit dialog role", async ({ mount, page }) => {
			await mountOverlaySheet(mount, {
				props: { isOpen: true, isSheet: true, label: "Details" },
			});

			const sheet = page.locator('[data-part="sheet"]');

			await expect(sheet).toHaveRole("dialog");
			await expect(sheet).not.toHaveAttribute("role");
		});

		test("exposes the sheet data part", async ({ mount, page }) => {
			await mountOverlaySheet(mount, {
				props: { isOpen: true, isSheet: true, label: "Details" },
			});

			await expect(page.locator('[data-part="sheet"]')).toHaveCount(1);
		});
	});
});

test.describe("narrow viewport", () => {
	test.use({ viewport: { width: 1023, height: 800 } });

	test("presents open content in a capped bottom sheet", async ({ mount, page }) => {
		await mountOverlaySheet(mount, {
			props: { isOpen: true, isSheet: true, label: "Details" },
			slots: { default: '<div data-test="overlay-sheet-content">Content</div>' },
		});

		const sheet = page.locator('[data-part="sheet"]');

		await expect(sheet).toBeVisible();
		await expect(sheet.getByTestId("overlay-sheet-content")).toBeVisible();
		await expect(sheet).toHaveCSS("max-height", "600px");
	});
});

test.describe("desktop viewport", () => {
	test.use({ viewport: { width: 1200, height: 800 } });

	test("presents open content as a desktop dialog", async ({ mount, page }) => {
		await mountOverlaySheet(mount, {
			props: { isOpen: true, isSheet: true, label: "Details" },
			slots: { default: '<div data-test="overlay-sheet-content">Content</div>' },
		});

		const sheet = page.locator('[data-part="sheet"]');

		await expect(sheet).toBeVisible();
		await expect(sheet.getByTestId("overlay-sheet-content")).toBeVisible();
		await expect(sheet).toHaveCSS("max-height", "none");
	});
});
