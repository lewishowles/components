import { expect, test } from "@playwright/experimental-ct-vue";
import { createMount } from "@lewishowles/testing/playwright";

import ConfirmDialogFixture from "./confirm-dialog.fixture.vue";

// Mount confirm-dialog via the confirm fixture, since Playwright CT can't
// pass function props (onConfirm) directly to mount().
const mountFixture = createMount(ConfirmDialogFixture);

test.describe("confirm-dialog", () => {
	test("renders open by default with title, content, and actions", async ({ mount, page }) => {
		await mountFixture(mount);

		await expect(page.getByTestId("modal-dialog")).toBeVisible();
		await expect(page.getByTestId("modal-dialog-title")).toHaveText("Delete this vehicle?");
		await expect(page.getByText("Are you sure you want to delete this vehicle?")).toBeVisible();
		await expect(page.getByTestId("confirm-dialog-confirm")).toBeVisible();
		await expect(page.getByTestId("confirm-dialog-cancel")).toBeVisible();
	});

	test.describe("Confirming", () => {
		test("calls onConfirm and closes when the confirm button is clicked", async ({
			mount,
			page,
		}) => {
			await mountFixture(mount);

			await page.getByTestId("confirm-dialog-confirm").click();

			await expect(page.getByTestId("modal-dialog")).not.toBeVisible();
			await expect(page.getByTestId("confirm-dialog-fixture-confirmed")).toBeVisible();
		});
	});

	test.describe("Cancelling", () => {
		test("closes without calling onConfirm when the cancel button is clicked", async ({
			mount,
			page,
		}) => {
			await mountFixture(mount);

			await page.getByTestId("confirm-dialog-cancel").click();

			await expect(page.getByTestId("modal-dialog")).not.toBeVisible();
			await expect(page.getByTestId("confirm-dialog-fixture-confirmed")).not.toBeAttached();
		});

		test("closes without calling onConfirm when the built-in close button is clicked", async ({
			mount,
			page,
		}) => {
			await mountFixture(mount);

			await page.getByTestId("modal-dialog-close").click();

			await expect(page.getByTestId("modal-dialog")).not.toBeVisible();
			await expect(page.getByTestId("confirm-dialog-fixture-confirmed")).not.toBeAttached();
		});
	});
});
