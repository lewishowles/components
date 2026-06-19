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
