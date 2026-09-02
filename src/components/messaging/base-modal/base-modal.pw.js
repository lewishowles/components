import { expect, test } from "@playwright/experimental-ct-vue";
import { createMount } from "@lewishowles/testing/playwright";

import BaseModal from "./base-modal.vue";

// Mount base-modal with sensible defaults for testing.
const mountBaseModal = createMount(BaseModal);

test.describe("base-modal", () => {
	test("renders a base-modal", async ({ mount, page }) => {
		await mountBaseModal(mount);

		await expect(page.getByTestId("modal-dialog")).toBeVisible();
	});

	test("has aria-modal=true", async ({ mount, page }) => {
		await mountBaseModal(mount);

		await expect(page.getByTestId("modal-dialog")).toHaveAttribute("aria-modal", "true");
	});

	test("applies aria-labelledby when provided", async ({ mount, page }) => {
		await mountBaseModal(mount, { props: { ariaLabelledby: "title-id" } });

		await expect(page.getByTestId("modal-dialog")).toHaveAttribute("aria-labelledby", "title-id");
	});

	test("does not set aria-labelledby when not provided", async ({ mount, page }) => {
		await mountBaseModal(mount);

		await expect(page.getByTestId("modal-dialog")).not.toHaveAttribute("aria-labelledby");
	});

	test("applies role=alertdialog when dialogRole is alertdialog", async ({ mount, page }) => {
		await mountBaseModal(mount, { props: { dialogRole: "alertdialog" } });

		await expect(page.getByTestId("modal-dialog")).toHaveAttribute("role", "alertdialog");
	});

	test("does not override the implicit dialog role when dialogRole is not set", async ({
		mount,
		page,
	}) => {
		await mountBaseModal(mount);

		await expect(page.getByTestId("modal-dialog")).not.toHaveAttribute("role");
	});
});

test.describe("desktop viewport", () => {
	test.use({ viewport: { width: 1200, height: 800 } });

	test("positions the close button over the dialog corner", async ({ mount, page }) => {
		await mountBaseModal(mount);

		const layout = await page.getByTestId("modal-dialog").evaluate((element) => {
			const dialogBox = element.getBoundingClientRect();
			const closeButton = element.querySelector('[data-test="modal-dialog-close"]');
			const closeButtonBox = closeButton.getBoundingClientRect();

			return {
				closeButtonRight: closeButtonBox.right,
				closeButtonTop: closeButtonBox.top,
				dialogRight: dialogBox.right,
				dialogTop: dialogBox.top,
			};
		});

		expect(layout.closeButtonRight).toBeGreaterThan(layout.dialogRight - 32);
		expect(layout.closeButtonRight).toBeLessThanOrEqual(layout.dialogRight);
		expect(layout.closeButtonTop).toBeGreaterThanOrEqual(layout.dialogTop);
		expect(layout.closeButtonTop).toBeLessThan(layout.dialogTop + 32);
	});
});
