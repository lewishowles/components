import { expect, test } from "@playwright/experimental-ct-vue";
import { createMount } from "#test/ct/support/mount.js";

import ModalDialogTitle from "./modal-dialog-title.vue";
import ModalDialogTitleProvideFixture from "./modal-dialog-title-provide.fixture.vue";

// Mount modal-dialog-title with sensible defaults for testing.
const mountModalDialogTitle = createMount(ModalDialogTitle, {
	slots: { default: "Confirm action" },
});

test.describe("modal-dialog-title", () => {
	test("renders a modal-dialog-title", async ({ mount, page }) => {
		await mountModalDialogTitle(mount);

		await expect(page.getByTestId("modal-dialog-title")).toBeVisible();
	});

	test("has tabindex=-1 so it can receive programmatic focus without entering the tab order", async ({
		mount,
		page,
	}) => {
		await mountModalDialogTitle(mount);

		await expect(page.getByTestId("modal-dialog-title")).toHaveAttribute("tabindex", "-1");
	});

	test("has a non-empty id attribute", async ({ mount, page }) => {
		await mountModalDialogTitle(mount);

		const id = await page.getByTestId("modal-dialog-title").getAttribute("id");

		expect(id).toBeTruthy();
	});

	test("uses the provided titleId as its id", async ({ mount, page }) => {
		await mount(ModalDialogTitleProvideFixture);

		await expect(page.getByTestId("modal-dialog-title")).toHaveAttribute("id", "custom-title-id");
	});
});
