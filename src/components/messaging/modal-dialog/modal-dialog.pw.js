import { expect, test } from "@playwright/experimental-ct-vue";
import { createMount } from "#test/ct/support/mount.js";

import ModalDialog from "./modal-dialog.vue";
import InteractionTestFixture from "./modal-dialog.fixture.vue";

// Mount modal-dialog via interaction fixture for open/close flow tests.
const mountInteractionTest = createMount(InteractionTestFixture);

// Mount modal-dialog directly with initiallyOpen for accessibility attribute tests.
const mountModalDialog = createMount(ModalDialog, { props: { initiallyOpen: true } });

test.describe("modal-dialog", () => {
	test("renders closed by default", async ({ mount, page }) => {
		await mountInteractionTest(mount);

		await expect(page.getByTestId("modal-dialog")).not.toBeVisible();
	});

	test.describe("Accessibility", () => {
		test("has aria-modal=true", async ({ mount, page }) => {
			await mountModalDialog(mount, { slots: { title: "Dialog title" } });

			await expect(page.getByTestId("modal-dialog")).toHaveAttribute("aria-modal", "true");
		});

		test("has aria-labelledby pointing to the title id when a title is provided", async ({
			mount,
			page,
		}) => {
			await mountModalDialog(mount, { slots: { title: "Dialog title" } });

			const titleId = await page.getByTestId("modal-dialog-title").getAttribute("id");

			await expect(page.getByTestId("modal-dialog")).toHaveAttribute("aria-labelledby", titleId);
		});

		test("has role=alertdialog when variant is alert", async ({ mount, page }) => {
			await mountModalDialog(mount, {
				props: { variant: "alert" },
				slots: { title: "Alert title" },
			});

			await expect(page.getByTestId("modal-dialog")).toHaveAttribute("role", "alertdialog");
		});

		test("does not override the implicit dialog role by default", async ({ mount, page }) => {
			await mountModalDialog(mount, { slots: { title: "Dialog title" } });

			await expect(page.getByTestId("modal-dialog")).not.toHaveAttribute("role");
		});

		test("automatically wraps content with a description element when variant is alert", async ({
			mount,
			page,
		}) => {
			await mountModalDialog(mount, {
				props: { variant: "alert" },
				slots: { title: "Alert title", default: "This is the alert content" },
			});

			const descriptionId = await page.getByTestId("modal-dialog").getAttribute("aria-describedby");

			await expect(page.locator(`#${descriptionId}`)).toHaveText("This is the alert content");
		});
	});

	test.describe("Interaction", () => {
		test("a dialog can be opened", async ({ mount, page }) => {
			await mountInteractionTest(mount);

			await page.getByTestId("modal-dialog-interaction-test-open").click();

			await expect(page.getByTestId("modal-dialog")).toBeVisible();
		});

		test("a dialog can be closed via the close button", async ({ mount, page }) => {
			await mountInteractionTest(mount);

			await page.getByTestId("modal-dialog-interaction-test-open").click();
			await page.getByTestId("modal-dialog-close").click();

			await expect(page.getByTestId("modal-dialog")).not.toBeVisible();
		});

		test("a dialog can be closed via escape", async ({ mount, page }) => {
			await mountInteractionTest(mount);

			await page.getByTestId("modal-dialog-interaction-test-open").click();
			await page.keyboard.press("Escape");

			await expect(page.getByTestId("modal-dialog")).not.toBeVisible();
		});

		test("a dialog can be closed via a button inside the dialog", async ({ mount, page }) => {
			await mountInteractionTest(mount);

			await page.getByTestId("modal-dialog-interaction-test-open").click();
			await page.getByTestId("modal-dialog-interaction-test-close").click();

			await expect(page.getByTestId("modal-dialog")).not.toBeVisible();
		});
	});
});
